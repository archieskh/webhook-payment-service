import sequelizeConnection from "../db";
import Invoice from "../models/Invoice";
import Payment from "../models/Payment";

export async function applyPaymentEvent(params:{event_id: string; invoice_id: number; amount: number;}) 
{
    const { event_id, invoice_id, amount } = params;

    // lock the invoice row for update
    return sequelizeConnection.transaction(async (t) => {
        const invoice = await Invoice.findByPk(invoice_id, { 
            transaction: t, 
            lock: t.LOCK.UPDATE 
        });
        if (!invoice) throw new Error("Invoice not found");

        // Insert payment; unique(event_id) enforces idempotency at DB level
        const payment = await Payment.create(
            {event_id, invoice_id, amount},
            { transaction: t });

        if (!payment) throw new Error("Payment creation failed");

        // Recompute total paid for this invoice
        const totalPaid = await Payment.sum("amount", { 
            where: { invoice_id }, 
            transaction: t 
        }) || 0;

        // status transition based on sum of payments
        if (totalPaid >= invoice.amount) {
            invoice.status = "paid";
        } else if (totalPaid > 0) {
            invoice.status = "partially_paid";
        } else {
            invoice.status = "sent";
        }

        await invoice.save({ transaction: t });

        return { invoice_id, status: invoice.status, totalPaid, totalDue: invoice.amount };
    });
    }
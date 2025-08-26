export type InvoiceStatus = "sent" | "partially_paid" | "paid";

export interface Iinvoice {
    id: number;
    amount: number;
    status: InvoiceStatus;
}

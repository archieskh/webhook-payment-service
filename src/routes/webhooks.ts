import { Application, Router } from "express";
import PaymentEvent from "../models/paymentEvent";
import { validatePaymentEvent } from "../helper/validation";
import { UniqueConstraintError } from "sequelize";

const validator = require('express-joi-validation').createValidator({ parseError: true });

export class PaymentRoutes {
    public static routes(app: Application) {
        app.post("/webhooks/payment", async (req, res) => {

            // validate using joi
            const { error, value } = validatePaymentEvent.validate(req.body, { abortEarly: false });
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const { event_id, invoice_id, amount } = value;

            try {
                const result = await PaymentEvent.create({
                    event_id,
                    invoice_id,
                    amount,
                    status: "pending",
                    retry_count: 0
                });
                return res.status(202).json({
                    message: "Event queued for processing",
                    data: result
                })
                // return res.json(result);
            } catch (error: any) {
                if (error instanceof UniqueConstraintError) {
                    return res.status(409).json({
                        message: "Duplicate event ignored",
                        invoice_id: req.body.invoice_id
                    });
                }
                if (error.message === "BAD_INVOICE") {
                    return res.status(400).json({ "message": "Invalid invoice_id" });
                }
                return res.status(500).json({ "message": error });



            }
        });
    }
}

export default new PaymentRoutes();

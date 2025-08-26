import { Application, Router } from "express";
import { applyPaymentEvent } from "../services/applyPaymentEvent";
import { validatePaymentEvent } from "../helper/validation";
import { UniqueConstraintError } from "sequelize";

const validator = require('express-joi-validation').createValidator({ parseError: true});

export class PaymentRoutes {
    public static routes(app: Application) {
        app.post("/webhooks/payment", validator.body(validatePaymentEvent), async (req, res) => {
            try {
                const result = await applyPaymentEvent(req.body);
                return res.json(result);
            } catch (error: any) {
                if(error instanceof UniqueConstraintError) {
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

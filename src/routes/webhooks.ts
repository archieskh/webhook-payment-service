import { Application, Router } from "express";
import { applyPaymentEvent } from "../services/applyPaymentEvent";
import { validatePaymentEvent } from "../helper/validation";

const validator = require('express-joi-validation').createValidator({ parseError: true});

export class PaymentRoutes {
    public static routes(app: Application) {
        app.post("/webhook/payment", validator.body(validatePaymentEvent), async (req, res) => {
            try {
                const result = await applyPaymentEvent(req.body);
                res.json(result);
            } catch (error) {
                console.error("Error processing payment webhook:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
}

export default new PaymentRoutes();

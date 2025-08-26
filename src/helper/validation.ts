import * as Joi from "joi";

const validatePaymentEvent = Joi.object({
    event_id: Joi.string().required(),
    invoice_id: Joi.number().min(1).positive().required(),
    amount: Joi.number().min(0).positive().required()
});

export { validatePaymentEvent };

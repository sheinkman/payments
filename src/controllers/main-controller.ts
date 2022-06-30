import express, { Request, Response } from "express";
import {check, validationResult} from 'express-validator';
import {PaymentsService} from "../services/payments.service";

export const paymentsRouter = express.Router();
const paymentsService = new PaymentsService();

paymentsRouter.post("/",
    check('bookings.*.reference').isString(),
    check('bookings.*.amount').isNumeric(),
    check('bookings.*.amount_received').notEmpty().isNumeric(),
    check('bookings.*.country_from').notEmpty().isString().isLength({min: 2, max: 2}),
    check('bookings.*.sender_full_name').notEmpty().isString(),
    check('bookings.*.sender_address').notEmpty().isString(),
    check('bookings.*.school').notEmpty().isString(),
    check('bookings.*.currency_from').notEmpty().isString().isLength({min: 3, max: 3}),
    check('bookings.*.student_id').notEmpty().isNumeric(),
    // check('email').notEmpty().isEmail(),
    async (req: Request, res: Response) => {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }

            const resp = await paymentsService.handlePayment(req.body.bookings);

            res.status(201).json(resp);
        } catch (e) {
            // @ts-ignore
            res.status(500).send(e.message);
        }
    });

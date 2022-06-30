import express, { Request, Response } from "express";
import {body, check, param, validationResult} from 'express-validator';
import {MainService} from "../services/main.service";

export const mainRouter = express.Router();

const mainService = new MainService();

mainRouter.get("/:id",
 param('id').isNumeric(),
async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const resp = await mainService.get(Number(req.params.id));

        res.status(201).json(resp);
    } catch (e) {
        // @ts-ignore
        res.status(500).send(e.message);
    }
});



mainRouter.post("/",
    body('url').isURL(),
    body('column_name').isString(),
    async (req: Request, res: Response) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        try {
            await mainService.saveList(req.body.url, req.body.column_name);

            res.status(201).json();
        } catch (e) {
            // @ts-ignore
            res.status(500).send(e.message);
        }
    });

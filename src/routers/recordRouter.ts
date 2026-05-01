import express from 'express';
import { Record } from '../models/record.model.js';


export const recordRouter = express.Router();


//Get por el identificador unico de mongoose
recordRouter.get('/records/:id', async(req, res) => {
    try {
        const records = await Record.findById(req.params.id);
        if (!records) {
            return res.status(404).send();
        }
        res.send(records);
    } catch (error) {
        res.status(500).send(error);
    }
})

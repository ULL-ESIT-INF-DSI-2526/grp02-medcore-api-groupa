import express from 'express';
import { Medicine } from '../models/medicine.model.js';

export const medicineRouter = express.Router();

medicineRouter.post('/medications', async(req, res) => {
    const patient = new Medicine(req.body);
    try {
        await patient.save();
        res.status(201).send(patient);
    } catch (error) {
        res.status(400).send(error);
    }
})

//Get por el identificador unico de mongoose
medicineRouter.get('/medications/:id', async(req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            return res.status(404).send();
        }
        res.send(medicine);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Get por nombre comercial, principio activo o codigo nacional
medicineRouter.get('/medications', async(req, res) => {
    const { name, activeIngredient, nationalID } = req.query;
    try {
        const filter: any = {};

        if (name) filter.name = name.toString();
        if (activeIngredient) filter.activeIngredient = activeIngredient.toString();
        if (nationalID) filter.nationalID = nationalID.toString();

        if (Object.keys(filter).length === 0) {
            return res.status(400).send({ error: 'Debe proporcionar al menos un criterio: name, activeIngredient o nationalID'});
        }

        const medicine = await Medicine.findOne(filter);

        if (!medicine) {
            return res.status(404).send();
        }
        res.send(medicine);
    } catch (error) {
        res.status(500).send(error);
    }
});

medicineRouter.delete('/medications/:id', async(req, res) => {
    try {
        const medicine = await Medicine.findByIdAndDelete(req.params.id);
        if (!medicine) {
            return res.status(404).send();
        }
        res.send(medicine);
    } catch (error) {
        res.status(500).send(error);
    }
});

medicineRouter.delete('/medications', async(req, res) => {
    const { name, activeIngredient, nationalID } = req.query;
    try {
        const filter: any = {};

        if (name) filter.name = name.toString();
        if (activeIngredient) filter.activeIngredient = activeIngredient.toString();
        if (nationalID) filter.nationalID = nationalID.toString();

        if (Object.keys(filter).length === 0) {
            return res.status(400).send({ error: 'Debe proporcionar al menos un criterio de búsqueda' });
        }

        const medicine = await Medicine.deleteMany(filter);

        if (medicine.deletedCount === 0) {
            return res.status(404).send();
        }
        res.send(medicine);
    } catch (error) {
        res.status(500).send(error);
    }
});
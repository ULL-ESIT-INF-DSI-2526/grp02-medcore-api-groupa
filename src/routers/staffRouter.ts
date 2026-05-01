import express from 'express';
import { Staff } from '../models/staff.model.js';

export const staffRouter = express.Router();

staffRouter.post('/staff', async(req, res) => {
    const patient = new Staff(req.body);
    try {
        await patient.save();
        res.status(201).send(patient);
    } catch (error) {
        res.status(400).send(error);
    }
})


//Get con el identificador unico de mongoose
staffRouter.get('/staff/:id', async(req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) {
            return res.status(404).send();
        }
        res.send(staff);
    } catch (error) {
        res.status(500).send(error);
    }
})

staffRouter.get('/staff', async(req, res) => {
    const { name, medicalSpeciality } = req.query;
    try {
        let staff;
        if (name && medicalSpeciality) {  
            staff = await Staff.findOne({ name: name.toString(), medicalSpeciality: medicalSpeciality.toString()});
        } else if (medicalSpeciality) {
            staff = await Staff.findOne({ medicalSpeciality: medicalSpeciality.toString() });
        } else if (name) {  
            staff = await Staff.findOne({ name: name.toString() });
        } else {
            return res.status(400).send({ error: 'Debe proporcionar un nombre o un número de identificación' });
        }
        if (!staff) {
            return res.status(404).send();
        }
        res.send(staff);
    } catch (error) {
        res.status(500).send(error);
    }
})

staffRouter.delete('/staff/:id', async(req, res) => {
    try {
        const staff = await Staff.findByIdAndDelete(req.params.id);
        if (!staff) {
            return res.status(404).send();
        }
        res.send(staff);
    } catch (error) {
        res.status(500).send(error);
    }
});

staffRouter.delete('/staff', async(req, res) => {
    const { name, medicalSpeciality } = req.query;
    try {
        const filter: any = {};

        if (name) filter.name = name.toString();
        if (medicalSpeciality) filter.medicalSpeciality = medicalSpeciality.toString();

        if (Object.keys(filter).length === 0) {
            return res.status(400).send({ error: 'Debe proporcionar al menos un criterio de búsqueda' });
        }

        const staff = await Staff.deleteMany(filter);

        if (staff.deletedCount === 0) {
            return res.status(404).send();
        }
        res.send(staff);
    } catch (error) {
        res.status(500).send(error);
    }
});



import express from 'express';
import { Patient } from '../models/patient.model.js';

export const patientRouter = express.Router();

patientRouter.post('/patients', async(req, res) => {
    const patient = new Patient(req.body);
    try {
        await patient.save();
        res.status(201).send(patient);
    } catch (error) {
        res.status(400).send(error);
    }
})

patientRouter.get('/patients/:id', async(req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).send();
        }
        res.send(patient);
    } catch (error) {
        res.status(500).send(error);
    }
})

patientRouter.get('/patients', async(req, res) => {
    const { name, id } = req.query;
    try {
        let patient;
        if (name && id) {  
            patient = await Patient.findOne({ name: name.toString(), id: id.toString()});
        } else if (id) {
            patient = await Patient.findOne({ id: id.toString() });
        } else if (name) {  
            patient = await Patient.findOne({ name: name.toString() });
        } else {
            return res.status(400).send({ error: 'Debe proporcionar un nombre o un número de identificación' });
        }
        if (!patient) {
            return res.status(404).send();
        }
        res.send(patient);
    } catch (error) {
        res.status(500).send(error);
    }
});



patientRouter.delete('/patients/:id', async(req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).send();
        }
        res.send(patient);
    } catch (error) {
        res.status(500).send(error);
    }
});

patientRouter.delete('/patients', async(req, res) => {
    const { name, id } = req.query;
    try {
        const filter: any = {};

        if (name) filter.name = name.toString();
        if (id) filter.id = id.toString();

        if (Object.keys(filter).length === 0) {
            return res.status(400).send({ error: 'Debe proporcionar al menos un criterio: name o id'});
        }

        const result = await Patient.deleteMany(filter);

        if (result.deletedCount === 0) {
            return res.status(404).send();
        }
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

patientRouter.patch('/patients/:id', async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            error: 'Should provide at least one field to update'
        });
    } else {
        const actualUpdates = Object.keys(req.body);
        const allowedUpdates = ['name', 'birthDate', 'gender', 'contactInformation', 'alergies', 'bloodType', 'status'];
        const validUpdate = actualUpdates.every((u) => allowedUpdates.includes(u));
        if (!validUpdate) {
            res.status(400).send({
                error: `Only the following fields can be updated: ${allowedUpdates.join(', ')}`
            });
        } else {
            try {
                const patient = await Patient.findByIdAndUpdate( req.params.id, req.body, {new: true, runValidators: true});
                if (!patient) {
                    res.status(404).send({
                        error: 'Patient not found'
                    });
                } else {
                    res.status(200).send(patient);
                }
            } catch (err) {
                res.status(500).send(err);
            }
        }
    }
});
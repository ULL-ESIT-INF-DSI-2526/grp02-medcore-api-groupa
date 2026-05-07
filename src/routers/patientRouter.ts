import express from 'express';
import { Patient } from '../models/patient.model.js';

export const patientRouter = express.Router();

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Crea un nuevo paciente
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatientCreate'
 *     responses:
 *       201:
 *         description: Paciente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       400:
 *         description: Error en la validación de los datos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
patientRouter.post('/patients', async(req, res) => {
    const patient = new Patient(req.body);
    try {
        await patient.save();
        res.status(201).send(patient);
    } catch (error) {
        res.status(400).send(error);
    }
})

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Obtiene un paciente por su _id de MongoDB
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID generado por MongoDB (_id)
 *     responses:
 *       200:
 *         description: Datos del paciente encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Paciente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 */
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

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Busca un paciente por nombre y/o ID personalizado
 *     tags: [Patients]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nombre del paciente
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: ID personalizado del paciente (distinto al _id)
 *     responses:
 *       200:
 *         description: Paciente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       400:
 *         description: Falta proporcionar nombre o ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Paciente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 */
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
            return res.status(400).send({ error: 'Should provide at least one criterion: name or id' });
        }
        if (!patient) {
            return res.status(404).send();
        }
        res.send(patient);
    } catch (error) {
        res.status(500).send(error);
    }
});


/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: Elimina un paciente por su _id de MongoDB
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paciente eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Paciente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 */
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

/**
 * @swagger
 * /patients:
 *   delete:
 *     summary: Elimina múltiples pacientes basados en filtros (nombre o ID)
 *     tags: [Patients]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resultado de la eliminación masiva
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       400:
 *         description: No se proporcionaron criterios de eliminación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No se encontró ningún paciente para borrar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 */
patientRouter.delete('/patients', async(req, res) => {
    const { name, id } = req.query;
    try {
        const filter: any = {};

        if (name) filter.name = name.toString();
        if (id) filter.id = id.toString();

        if (Object.keys(filter).length === 0) {
            return res.status(400).send({ error: 'Should provide at least one criterion: name or id' });
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

/**
 * @swagger
 * /patients/{id}:
 *   patch:
 *     summary: Actualiza parcialmente los datos de un paciente
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatientUpdate'
 *     responses:
 *       200:
 *         description: Paciente actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       400:
 *         description: Campos inválidos o cuerpo vacío
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Paciente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 */
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

/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     summary: Reemplaza todos los datos de un paciente
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatientCreate'
 *     responses:
 *       200:
 *         description: Paciente reemplazado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       400:
 *         description: Faltan campos obligatorios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Paciente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 */
patientRouter.put('/patients/:id', async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            error: 'Should provide all fields to update'
        });
    } else {
        const requiredFields = ['name', 'birthDate', 'gender', 'contactInformation', 'alergies', 'bloodType', 'status'];
        const missingFields = requiredFields.filter(field => !(field in req.body));
        
        if (missingFields.length > 0) {
            return res.status(400).send({
                error: `Missing required fields for PUT: ${missingFields.join(', ')}`
            });
        }
        try {
            const patient = await Patient.findByIdAndUpdate( req.params.id, req.body, {new: true, runValidators: true, overwrite: true});
            if (!patient) {
                res.status(404).send({ error: 'Patient not found'});
            } 
            res.status(200).send(patient);
        } catch (err) {
            res.status(500).send(err);
        }
    }
});
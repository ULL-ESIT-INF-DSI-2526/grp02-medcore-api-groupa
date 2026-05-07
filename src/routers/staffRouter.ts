import express from 'express';
import { Staff } from '../models/staff.model.js';
import { MedicalSpeciality } from '../interfaces/StaffDocumentInterface.js';

export const staffRouter = express.Router();

/**
 * @swagger
 * /staff:
 *   post:
 *     summary: Crea un nuevo miembro del personal (staff)
 *     tags:
 *       - Staff
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StaffCreate'
 *     responses:
 *       201:
 *         description: Miembro del personal creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       400:
 *         description: Error en la validación de los datos proporcionados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
staffRouter.post('/staff', async(req, res) => {
    const patient = new Staff(req.body);
    try {
        await patient.save();
        res.status(201).send(patient);
    } catch (error) {
        res.status(400).send(error);
    }
})


/**
 * @swagger
 * /staff/{id}:
 *   get:
 *     summary: Obtiene un miembro del personal por su _id de MongoDB
 *     tags:
 *       - Staff
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: El identificador único generado por Mongoose (_id)
 *     responses:
 *       200:
 *         description: Datos del miembro del personal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       404:
 *         description: Miembro del personal no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 */
staffRouter.get('/staff/:id', async(req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) {
            return res.status(404).send({ error: 'Staff no encontrado' });
        }
        res.send(staff);
    } catch (error) {
        res.status(500).send(error);
    }
})

/**
 * @swagger
 * /staff:
 *   get:
 *     summary: Busca un miembro del personal por nombre o especialidad médica
 *     tags:
 *       - Staff
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nombre del miembro del personal
 *       - in: query
 *         name: medicalSpeciality
 *         schema:
 *           type: string
 *         description: Especialidad médica (ej. Cardiología, Pediatría)
 *     responses:
 *       200:
 *         description: Miembro del personal encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       400:
 *         description: No se proporcionaron parámetros de búsqueda válidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Miembro del personal no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 */
staffRouter.get('/staff', async(req, res) => {
    const { name, medicalSpeciality } = req.query;
    try {
        let staff;
        if (name && medicalSpeciality) {  
            staff = await Staff.findOne({ name: name.toString(), medicalSpeciality: medicalSpeciality.toString() as MedicalSpeciality});
        } else if (medicalSpeciality) {
            staff = await Staff.findOne({ medicalSpeciality: medicalSpeciality.toString() as MedicalSpeciality });
        } else if (name) {  
            staff = await Staff.findOne({ name: name.toString() });
        } else {
            return res.status(400).send({ error: 'Should provide at least one criterion: name or medicalSpeciality' });
        }
        if (!staff) {
            return res.status(404).send({ error: 'Staff not found' });
        }
        res.send(staff);
    } catch (error) {
        res.status(500).send(error);
    }
})

/**
 * @swagger
 * /staff/{id}:
 *   delete:
 *     summary: Elimina un miembro del personal por su _id de MongoDB
 *     tags:
 *       - Staff
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: El identificador único del miembro a eliminar
 *     responses:
 *       200:
 *         description: Miembro del personal eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       404:
 *         description: Miembro del personal no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 */
staffRouter.delete('/staff/:id', async(req, res) => {
    try {
        const staff = await Staff.findByIdAndDelete(req.params.id);
        if (!staff) {
            return res.status(404).send({ error: 'Staff not found' });
        }
        res.send(staff);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * /staff:
 *   delete:
 *     summary: Elimina múltiples miembros del personal según nombre o especialidad médica
 *     tags:
 *       - Staff
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: medicalSpeciality
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resultado de la eliminación (cantidad de registros borrados)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       400:
 *         description: Falta proporcionar al menos un criterio de búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No se encontró ningún registro para eliminar con los filtros dados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 */
staffRouter.delete('/staff', async(req, res) => {
    const { name, medicalSpeciality } = req.query;
    try {
        const filter: any = {};

        if (name) filter.name = name.toString();
        if (medicalSpeciality) filter.medicalSpeciality = medicalSpeciality.toString();

        if (Object.keys(filter).length === 0) {
            return res.status(400).send({ error: 'Should provide at least one criterion: name or medicalSpeciality' });
        }

        const staff = await Staff.deleteMany(filter);

        if (staff.deletedCount === 0) {
            return res.status(404).send({error: 'Staff not found'});
        }
        res.send(staff);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * /staff/{id}:
 *   patch:
 *     summary: Actualiza parcialmente los datos de un miembro del personal
 *     tags:
 *       - Staff
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID único de MongoDB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StaffUpdate'
 *     responses:
 *       200:
 *         description: Miembro del personal actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       400:
 *         description: Intento de actualizar campos no permitidos o falta de body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Miembro del personal no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 */
staffRouter.patch('/staff/:id', async (req, res) => {
    if (!req.body) {
        res.status(400).send({ error: 'Should provide at least one field to update'});
    }
    const actualUpdates = Object.keys(req.body);
    const allowedUpdates = ['name', 'medicalSpeciality', 'title', 'workShift', 'consultingRoom', 'contactInformation', 'experience', 'status'];
    const validUpdate = actualUpdates.every(update => allowedUpdates.includes(update));
    if (!validUpdate) {
        return res.status(400).send({ error: 'Only the following fields can be updated: name, medicalSpeciality, title, workShift, consultingRoom, contactInformation, experience, status'});
    }
    try {
        const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!staff) {
            return res.status(404).send({ error: 'Staff not found' });
        }
        res.send(staff);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * /staff/{id}:
 *   put:
 *     summary: Reemplaza completamente los datos de un miembro del personal
 *     tags:
 *       - Staff
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID único de MongoDB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StaffCreate'
 *     responses:
 *       200:
 *         description: Miembro del personal reemplazado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       400:
 *         description: Faltan campos obligatorios para el reemplazo total
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Miembro del personal no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 */
staffRouter.put('/staff/:id', async (req, res) => {
    if (!req.body) {
        return res.status(400).send({ error: 'The body has not been provided'});
    }
    const requiredFields = [
        'name',
        'licenseNumber',
        'medicalSpeciality',
        'title',
        'workShift',
        'consultingRoom',
        'experience',
        'contact',
        'state'
    ];
    
    // Comprobamos si falta alguno de los campos esenciales
    const missingFields = requiredFields.filter(field => !(field in req.body));

    if (missingFields.length > 0) {
        return res.status(400).send({ error: `Missing required fields for PUT: ${missingFields.join(', ')}` });
    }
    try {
        const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, overwrite: true });
        if (!staff) {
            return res.status(404).send({ error: 'Staff not found' });
        } 
        res.status(200).send(staff);
    } catch (error) {
        res.status(500).send(error);
    }
});




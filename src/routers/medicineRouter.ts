import express from 'express';
import { Medicine } from '../models/medicine.model.js';
import { Record } from '../models/record.model.js';

export const medicineRouter = express.Router();

/**
 * @swagger
 * /medications:
 *   post:
 *     summary: Crea una nueva medicina
 *     tags: [Medicines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicineCreate'
 *     responses:
 *       201:
 *         description: Medicina creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medicine'
 *       400:
 *         description: Error en la validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
medicineRouter.post('/medications', async(req, res) => {
    const patient = new Medicine(req.body);
    try {
        await patient.save();
        res.status(201).send(patient);
    } catch (error) {
        res.status(400).send(error);
    }
})

/**
 * @swagger
 * /medications/{id}:
 *   get:
 *     summary: Obtiene una medicina por su ID de Mongoose
 *     tags: [Medicines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la medicina
 *     responses:
 *       200:
 *         description: Medicina encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medicine'
 *       404:
 *         description: Medicina no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 */
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

/**
 * @swagger
 * /medications:
 *   get:
 *     summary: Busca una medicina por nombre, principio activo o ID nacional
 *     tags: [Medicines]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nombre comercial
 *       - in: query
 *         name: activeIngredient
 *         schema:
 *           type: string
 *         description: Principio activo
 *       - in: query
 *         name: nationalID
 *         schema:
 *           type: string
 *         description: Código nacional
 *     responses:
 *       200:
 *         description: Medicina encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medicine'
 *       400:
 *         description: No se proporcionaron criterios de búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No se encontró ninguna medicina
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 */
medicineRouter.get('/medications', async(req, res) => {
    const { name, activeIngredient, nationalID } = req.query;
    try {
        const filter: any = {};

        if (name) filter.name = name.toString();
        if (activeIngredient) filter.activeIngredient = activeIngredient.toString();
        if (nationalID) filter.nationalID = nationalID.toString();

        if (Object.keys(filter).length === 0) {
            return res.status(400).send({ error: 'Should provide at least one criterion: name, activeIngredient or nationalID' });
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

/**
 * @swagger
 * /medications/{id}:
 *   delete:
 *     summary: Elimina una medicina por ID
 *     tags: [Medicines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medicina eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medicine'
 *       404:
 *         description: Medicina no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 */
medicineRouter.delete('/medications/:id', async(req, res) => {
    try {
        const medicine = await Medicine.findByIdAndDelete(req.params.id);
        if (!medicine) {
            return res.status(404).send();
        }
        
        await Record.updateMany(
            { 'medicineList.medicine': req.params.id },
            { $pull: { medicineList: { medicine: req.params.id } } }
        );  
        res.send(medicine);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * /medications:
 *   delete:
 *     summary: Elimina medicinas basadas en filtros (borrado múltiple)
 *     tags: [Medicines]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: activeIngredient
 *         schema:
 *           type: string
 *       - in: query
 *         name: nationalID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Operación completada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medicine'
 *       400:
 *         description: Falta criterio de búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No se encontraron elementos para borrar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 */
medicineRouter.delete('/medications', async(req, res) => {
    const { name, activeIngredient, nationalID } = req.query;
    try {
        const filter: any = {};

        if (name) filter.name = name.toString();
        if (activeIngredient) filter.activeIngredient = activeIngredient.toString();
        if (nationalID) filter.nationalID = nationalID.toString();

        if (Object.keys(filter).length === 0) {
            return res.status(400).send({ error: 'Should provide at least one criterion: name, activeIngredient or nationalID' });
        }

        const medicinesToDelete = await Medicine.find(filter).select('_id');
        const ids = medicinesToDelete.map(m => m._id);

        const result = await Medicine.deleteMany({ _id: { $in: ids } });

        await Record.updateMany(
            { "medicineList.medicine": { $in: ids } },
            { $pull: { medicineList: { medicine: { $in: ids } } } }
        );

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
 * /medications/{id}:
 *   patch:
 *     summary: Actualiza parcialmente una medicina
 *     tags: [Medicines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicineUpdate'
 *     responses:
 *       200:
 *         description: Medicina actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medicine'
 *       400:
 *         description: Campos no permitidos o error en validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Medicina no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 */
medicineRouter.patch('/medications/:id', async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            error: 'Should provide at least one field to update'
        });
    }
    const actualUpdates = Object.keys(req.body);
    const allowedUpdates = ['name', 'activeIngredient', 'type', 'dosage', 'mesureUnit', 'ingestionMethod', 'stock', 'price', 
                            'prescriptionRequired', 'expirationDate', 'contraindications'];
    const validUpdate = actualUpdates.every(update => allowedUpdates.includes(update));
    if (!validUpdate) {
        return res.status(400).send({ 
            error: 'Only the following fields can be updated: name, activeIngredient, dosageForm, administrationRoute, sideEffects, stock, price, prescriptionRequired, expirationDate, contraindications' 
        });
    }
    try {
        const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!medicine) {
            return res.status(404).send({ error: 'Medicine not found' });
        }
        res.send(medicine);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * /medications/{id}:
 *   put:
 *     summary: Reemplaza/Actualiza una medicina completa
 *     tags: [Medicines]
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
 *             $ref: '#/components/schemas/MedicineCreate'
 *     responses:
 *       200:
 *         description: Medicina reemplazada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medicine'
 *       400:
 *         description: Faltan campos obligatorios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Medicina no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 */
medicineRouter.put('/medications/:id', async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            error: 'The body has not been provided'
        });
    }
    const requiredFields = [
        'name', 
        'activeIngredient', 
        'nationalID', 
        'type', 
        'dosage', 
        'mesureUnit', 
        'ingestionMethod', 
        'stock', 
        'price', 
        'prescriptionRequired', 
        'expirationDate', 
        'contraindications'
    ];
    
    const missingFields = requiredFields.filter(field => !(field in req.body));

    if (missingFields.length > 0) {
        return res.status(400).send({
            error: `Missing required fields for PUT: ${missingFields.join(', ')}`
        });
    }
    try {
        const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, overwrite: true });
        if (!medicine) {
            return res.status(404).send({ error: 'Medicine not found' });
        } 
        res.status(200).send(medicine);
    } catch (error) {
        res.status(500).send(error);
    }
});
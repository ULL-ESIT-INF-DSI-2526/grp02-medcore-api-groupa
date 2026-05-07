import express from 'express';
import { Record } from '../models/record.model.js';
import { Patient } from '../models/patient.model.js';
import { Medicine } from '../models/medicine.model.js';
import { Staff } from '../models/staff.model.js';
import { MedicineList } from '../interfaces/RecordDocumentInterface.js';

import { createRecord } from '../controllers/record/createRecord.js';
import { getRecord, getRecordByPatient, getRecordByFilter } from '../controllers/record/getRecord.js';
import { deleteRecord } from '../controllers/record/deleteRecord.js';
import { deleteRecordById } from '../controllers/record/deleteRecord.js';
import { updateRecord } from '../controllers/record/updateRecord.js';

export const recordRouter = express.Router();

/**
 * @swagger
 * /records:
 *   post:
 *     summary: Crea un nuevo registro médico
 *     description: Registra una nueva consulta o ingreso hospitalario, validando la existencia del paciente, personal médico y stock de medicamentos.
 *     tags:
 *       - Records
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecordCreate'
 *     responses:
 *       201:
 *         description: Registro médico creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Record'
 *       400:
 *         description: Error en la solicitud (falta cuerpo, medicamento no encontrado o stock insuficiente)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Paciente o Personal médico no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 */
recordRouter.get('/records/filter', getRecordByFilter);

/**
 * @swagger
 * /records/{id}:
 *   get:
 *     summary: Obtiene un registro médico por su ID de MongoDB
 *     tags: [Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del registro
 *     responses:
 *       200:
 *         description: Registro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Record'
 *       404:
 *         description: Registro no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 */
recordRouter.get('/records/:id', getRecord);

/**
 * @swagger
 * /records:
 *   get:
 *     summary: Obtiene registros médicos de un paciente específico
 *     tags: [Records]
 *     parameters:
 *       - in: query
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID personalizado del paciente (dni/pasaporte)
 *     responses:
 *       200:
 *         description: Lista de registros del paciente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Record'
 *       400:
 *         description: No se proporcionó el patientId
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
 *         description: Error del servidor
 */
recordRouter.get('/records', getRecordByPatient);

/**
 * @swagger
 * /records:
 *   post:
 *     summary: Crea un nuevo registro médico
 *     description: Valida stock de medicinas y existencia de paciente/staff.
 *     tags: [Records]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecordCreate'
 *     responses:
 *       201:
 *         description: Registro creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Record'
 *       400:
 *         description: Error en stock o datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Paciente o Personal no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 */
recordRouter.post('/records', createRecord);

/**
 * @swagger
 * /records/{id}:
 *   delete:
 *     summary: Elimina un registro por ID (restaurando stock)
 *     tags: [Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registro eliminado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Record'
 *       404:
 *         description: Registro no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 */
recordRouter.delete('/records/:id', deleteRecordById);

/**
 * @swagger
 * /records:
 *   delete:
 *     summary: Elimina un registro mediante Query String
 *     tags: [Records]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del registro a eliminar (?id=...)
 *     responses:
 *       200:
 *         description: Registro eliminado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Record'
 *       400:
 *         description: ID no proporcionado en query
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Registro no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
recordRouter.delete('/records', deleteRecord);

/**
 * @swagger
 * /records/{id}:
 *   patch:
 *     summary: Actualiza un registro médico
 *     description: Si se actualiza la medicineList, se devuelve el stock anterior y se valida/resta el nuevo.
 *     tags: [Records]
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
 *             $ref: '#/components/schemas/RecordUpdate'
 *     responses:
 *       200:
 *         description: Registro actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Record'
 *       400:
 *         description: Campos no permitidos o error de stock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *          
 *       404:
 *         description: Registro o medicina no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 */
recordRouter.patch('/records/:id', updateRecord);
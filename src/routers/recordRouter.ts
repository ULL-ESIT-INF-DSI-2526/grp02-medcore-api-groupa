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

//Get por el identificador unico de mongoose

recordRouter.get('/records/filter', getRecordByFilter);

recordRouter.get('/records/:id', getRecord);

recordRouter.get('/records', getRecordByPatient);

recordRouter.post('/records', createRecord);

recordRouter.delete('/records/:id', deleteRecordById);

recordRouter.delete('/records', deleteRecord);

recordRouter.patch('/records/:id', updateRecord);
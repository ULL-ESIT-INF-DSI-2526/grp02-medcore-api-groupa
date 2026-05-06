import {Request, Response} from 'express';
import {Record} from '../../models/record.model.js';
import {Patient} from '../../models/patient.model.js';
import {Staff} from '../../models/staff.model.js';
import {Medicine} from '../../models/medicine.model.js';
import {MedicineList} from '../../interfaces/RecordDocumentInterface.js';
import { medicineValidator } from './createRecord.js';

export const updateRecord = async (req: Request, res: Response) => {
    try {
        const oldRecord = await Record.findById(req.params.id);
        if (!oldRecord) return res.status(404).send({error: 'Record not found'});
        const allowedUpdates = [
                                'patient',
                                'responsable',
                                'registerType',
                                'startDate',
                                'endDate',
                                'motive',
                                'diagnosis',
                                'medicineList',
                                'registerState'
                            ];
        const actualUpdates = Object.keys(req.body);
        const validUpdate = actualUpdates.every(u => allowedUpdates.includes(u));
        if (!validUpdate) return res.status(400).send({
            error: `Only the following fields can be updated: ${allowedUpdates.join(', ')}`
        })
        
        if (req.body.medicineList) {
            for (const item of oldRecord.medicineList) {
                const medicineFounded = await Medicine.findById(item.medicine);
                if (!medicineFounded) return res.status(404).send({error: 'Medicine not found'});
                medicineFounded.stock += item.quantity;
                await medicineFounded?.save();
            }
    
            const updatedMedicines = await medicineValidator(req.body.medicineList);
            req.body.medicineList = updatedMedicines;
        }
        
        const recordUpdated = await Record.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        res.status(200).send(recordUpdated);
    } catch (err: any) {
        const status = err.status || 500;
        res.status(status).send(err);
    }
}
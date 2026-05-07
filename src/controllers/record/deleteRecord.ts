import {Request, Response} from 'express';
import {Record} from '../../models/record.model.js';
import {Patient} from '../../models/patient.model.js';
import {Staff} from '../../models/staff.model.js';
import {Medicine} from '../../models/medicine.model.js';
import {MedicineList} from '../../interfaces/RecordDocumentInterface.js';

/**
 * Función para eliminar una consulta medica por query string.
 * @param req - Request con el id de la consulta a eliminar en query string.
 * @param res - Response con el resultado de la operación.
 * @returns Devuelve un codigo de estado y la consulta eliminada o un mensaje de error.
 */
export const deleteRecord = async (req: Request, res: Response) => {
    if (!req.query.id) return res.status(400).send({ error: 'Id has not been provided' })
    try {
        const record = await Record.findById(req.query.id);
        if (!record) {
            return res.status(404).send({error: 'Record not founded'});
        }
        const medicines: MedicineList[] = record.medicineList;

        for (const m of medicines) {
            const medicineFounded = await Medicine.findById(m.medicine);
            if (!medicineFounded) return res.status(404).send({error: "medicine not found"});
            medicineFounded.stock += m.quantity;
            await medicineFounded.save();
        }
        const recordDeleted = await Record.findByIdAndDelete(req.query.id);
        res.status(200).send(recordDeleted);
    } catch (err) { 
        res.status(500).send(err);
    }
}

/**
 * Elimina una consulta medica por su id de MongoDB.
 * @param req - Request con el id de la consulta a eliminar en params.
 * @param res - Response con el resultado de la operación.
 * @returns Devuelve un codigo de estado y la consulta eliminada o un mensaje de error.
 */
export const deleteRecordById = async (req: Request, res: Response) => {
    const recordId = req.params.id;
    try {
        const record = await Record.findById(recordId);

        if (!record) {
           return res.status(404).send({error: "Record not found"}); 
        }
        const medicines = record.medicineList;

        for (const m in medicines) {
            const medicine = await Medicine.findById(medicines[m].medicine);
            if (!medicine) {
                return res.status(404).send({error: "Medicine not found"}); 
            }
            medicine.stock += medicines[m].quantity;
            await medicine.save();
        }

        const delete_record = await Record.findByIdAndDelete(recordId);
        res.status(200).send(delete_record);
    }
    catch(error) {
        res.status(500).send(error);
    }  
}
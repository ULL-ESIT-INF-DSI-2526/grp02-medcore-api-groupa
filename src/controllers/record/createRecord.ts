import {Request, Response} from 'express';
import {Record} from '../../models/record.model.js';
import {Patient} from '../../models/patient.model.js';
import {Staff} from '../../models/staff.model.js';
import {Medicine} from '../../models/medicine.model.js';
import {MedicineList} from '../../interfaces/RecordDocumentInterface.js';


export const createRecord = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).send({
    error: 'The body has not been provided',
  });
  }
  try {
    const patient = await Patient.findOne({ id: req.body.patient });
    if (!patient) return res.status(404).send({ error: 'Patient not found' });
    
    const staff = await Staff.findOne({ licenseNumber: req.body.responsable });
    if (!staff) return res.status(404).send({ error: 'Staff not found' });
    
    const medicines = await medicineValidator(req.body.medicineList);
    
    req.body.patient = patient._id;
    req.body.responsable = staff._id;
    req.body.medicineList = medicines;

    const newRecord = new Record(req.body);
    await newRecord.save();
    res.status(201).send(newRecord);
    
  } catch (err: any) {
    const stat = err.status || 500;
    res.status(stat).send(err);
  }
};

export const medicineValidator = async (medicines: MedicineList[]) => {
  for (const m of medicines) {
    const medicineFounded = await Medicine.findOne({ nationalID: m.medicine.toString() });

    if (!medicineFounded) throw {status: 400, message: 'Medicine not found'};
    
    if (medicineFounded.stock < m.quantity) throw {status: 400, message: 'Insufficient stock'};
    
    medicineFounded.stock -= m.quantity;
    m.medicine = medicineFounded._id;
    
    await Medicine.findByIdAndUpdate(medicineFounded._id, medicineFounded, { runValidators: true });
  }
  return medicines;
}
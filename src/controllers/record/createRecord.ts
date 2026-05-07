import {Request, Response} from 'express';
import {Record} from '../../models/record.model.js';
import {Patient} from '../../models/patient.model.js';
import {Staff} from '../../models/staff.model.js';
import {Medicine} from '../../models/medicine.model.js';
import {MedicineList} from '../../interfaces/RecordDocumentInterface.js';

/**
 * Crea un nuevo registro médico en la base de datos.
 * @param req - La solicitud HTTP que contiene los datos del nuevo registro médico en el cuerpo de la solicitud.
 * @param res - La respuesta HTTP que se enviará al cliente después de procesar la solicitud. Contendrá el nuevo registro médico creado o un 
 * mensaje de error si ocurre algún problema durante el proceso.
 * @returns Devuelve un codigo de estado y un registro médico creado si la solicitud es exitosa, o un mensaje de error si ocurre algún problema 
 * durante el proceso.
 */
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

/**
 * Función auxiliar para validar la lista de medicamentos asociados a un registro médico. Verifica que cada medicamento exista en la base de datos y 
 * que haya suficiente stock disponible.
 * @returns Devuelve la lista de medicamentos validada
 */
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
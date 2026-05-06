import {Request, Response} from 'express';
import {Record} from '../../models/record.model.js';
import {Patient} from '../../models/patient.model.js';
import {Staff} from '../../models/staff.model.js';
import {Medicine} from '../../models/medicine.model.js';
import {MedicineList} from '../../interfaces/RecordDocumentInterface.js';

export const getRecord = async (req: Request, res: Response) => {
    try {
      const records = await Record.findById(req.params.id);
      if (!records) return res.status(404).send();
      res.send(records);
    } catch (error) {
      res.status(500).send(error);
    }
};

export const getRecordByPatient = async (req: Request, res: Response) => {
    const patientId = req.query.patientId;
    if (!patientId) return res.status(400).send({ error: 'Patient ID has not been provided' });
    
    try {
        const patient = await Patient.findOne({ id: patientId.toString() });
        if (!patient) return res.status(404).send({ error: 'Patient not found' });

        const records = await Record.find({ patient: patient._id }).sort({ StartDate: 1 });
        res.send(records);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getRecordByFilter = async (req: Request, res: Response) => {
  const { startDate, endDate, registerType } = req.query;
  if (!startDate || !endDate) return res.status(400).send({ error: 'Start date and end date must be provided' });

  try {
    const filter: any = {};
    if (registerType) {
      filter.registerType = registerType.toString();
    }
    filter.startDate = { $lte: new Date(endDate.toString()) };
    filter.endDate = { $gte: new Date(startDate.toString()) };

    const records = await Record.find(filter).sort({ startDate: 1 });
    res.send(records);

  } catch (error) {
    res.status(500).send(error);
  }  
}



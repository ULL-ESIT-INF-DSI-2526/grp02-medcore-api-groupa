import { Document, Types } from "mongoose";

/**
 * MedicineList: Define la estructura de un medicamento asociado a un registro médico, incluyendo una referencia al medicamento, la cantidad y la posología.
 */
export interface MedicineList {
  medicine: Types.ObjectId;
  quantity: number;
  posology: string;
}

/**
 * RegisterState: Define los posibles estados de un registro médico, que pueden ser 'Hospital Admission' o 'Outpatient Consultation'.
 */
export type RegisterState = 'Hospital Admission' | 'Outpatient Consultation';


/**
 * RecordDocumentInterface: Define la estructura de un documento de registro médico en la base de datos. 
 * 
 * Incluye referencias a los pacientes, responsables, tipos de registro, fechas, motivos, diagnósticos, una lista de medicamentos asociados al registro,
 * el importe total de los medicamentos y el estado del registro. 
 */
export interface RecordDocumentInterface extends Document {
  patient: Types.ObjectId;
  responsable: Types.ObjectId;
  registerType: RegisterState;
  startDate: Date;
  endDate: Date;
  motive: string;
  diagnosis: string;
  medicineList: MedicineList[];
  totalImport: number;
  registerState: Boolean;
}

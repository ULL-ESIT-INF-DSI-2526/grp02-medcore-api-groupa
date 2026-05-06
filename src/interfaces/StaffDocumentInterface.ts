import { Document } from "mongoose";

export type MedicalSpeciality = 'General Medicine' | 'Cardiology' | 'Traumatology' | 'Pediatry' | 'Oncology' | 'Urgency';

export type Title = 'Attending Physician' | 'Resident Physician' | 'Nurse' | 'Nursing Assistant' | 'Chief of Service';

export type WorkShift = 'morning' | 'afternoon' | 'night' | 'rotating';

/**
 * StaffDocumentInterface: define la estructura de un documento de personal médico en la base de datos.
 * 
 * Incluye campos como nombre, número de licencia, especialidad médica, título, turno de trabajo, consultorio, experiencia, contacto y estado.
 */
export interface StaffDocumentInterface extends Document {
  name: string;
  licenseNumber: number;
  medicalSpeciality: MedicalSpeciality;
  title: Title;
  workShift: WorkShift;
  consultingRoom: string;
  experience: number;
  contact: string;
  state: boolean;
}


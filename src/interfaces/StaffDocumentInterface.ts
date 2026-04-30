import { Document } from "mongoose";

/**
 * StaffDocumentInterface: define la estructura de un documento de personal médico en la base de datos.
 * 
 * Incluye campos como nombre, número de licencia, especialidad médica, título, turno de trabajo, consultorio, experiencia, contacto y estado.
 */
export interface StaffDocumentInterface extends Document {
  name: string;
  licenseNumber: number;
  medicalSpeciality: string;
  title: string;
  workShift: string;
  consultingRoom: string;
  experience: number;
  contact: string;
  state: boolean;
}


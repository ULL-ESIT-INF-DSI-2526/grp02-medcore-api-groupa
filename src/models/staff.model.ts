import { Schema, model } from "mongoose";
import { StaffDocumentInterface } from "../interfaces/StaffDocumentInterface.js";
import validator from 'validator';

/**
 * Mongoose Schema para el personal medico del hospital.
 * 
 * Incluye campos como nombre, numero de licencia, especialidad medica, titulo, turno de trabajo, consultorio, años de experiencia, contacto y estado.
 */
const StaffSchema = new Schema<StaffDocumentInterface>({
  
  /**
   * Nombre completo del personal medico.
   */
  name: {
    type: String,
    required: true,
    trim: true
  },

  /**
   * Numero de licencia profesional del personal medico.
   * 
   * Debe ser unico.
   */
  licenseNumber: {
    type: Number,
    required: true,
    unique: true,
  },

  /**
   * Especialidad medica del personal medico.
   * 
   * Debe ser uno de los siguientes valores: 'General Medicine', 'Cardiology', 'Traumatology', 'Pediatry', 'Oncology', 'Urgency'.
   */
  medicalSpeciality: {
    type: String,
    required: true,
    trim: true,
    enum: [
      'General Medicine',
      'Cardiology', 
      'Traumatology', 
      'Pediatry', 
      'Oncology', 
      'Urgency'
    ]
  },

  /**
   * Titulo del personal medico.
   * 
   * Debe ser uno de los siguientes valores: 'Attending Physician', 'Resident Physician', 'Nurse', 'Nursing Assistant', 'Chief of Service'.
   */
  title: {
    type: String,
    required: true,
    trim: true,
    enum: [
      'Attending Physician', 
      'Resident Physician', 
      'Nurse', 
      'Nursing Assistant', 
      'Chief of Service'
    ]
  },

  /**
   * Turno de trabajo del personal medico.
   * 
   * Debe ser uno de los siguientes valores: 'morning', 'afternoon', 'night', 'rotating'.
   */
  workShift: {
    type: String,
    required: true,
    trim: true,
    enum: [
      'morning',
      'afternoon',
      'night',
      'rotating'
    ]
  },

  /**
   * Consultorio asignado al personal medico.
   */
  consultingRoom: {
    type: String,
    required: true,
    trim: true,
  },

  /**
   * Años de experiencia del personal medico.
   * 
   * No puede ser un numero negativo.
   */
  experience: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('Years of experience cannot be a negative number');
      }
    }
  },

  /**
   * Numero de contacto del personal medico.
   * 
   * Debe ser un numero de telefono valido.
   */
  contact: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => validator.isMobilePhone(value),
      message: 'Please enter a valid phone number'
    }
  },

  /**
   * Estado del personal medico (activo o inactivo).
   */
  state: {
    type: Boolean,
    required: true
  }
});

/**
 * Modelo de Mongoose para el personal medico del hospital.
 * 
 * Permite realizar operaciones CRUD sobre los documentos de personal medico en la base de datos.
 */
export const Staff = model<StaffDocumentInterface>('Staff', StaffSchema);
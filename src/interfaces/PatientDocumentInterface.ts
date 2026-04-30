import { Document } from 'mongoose';

/**
 * data: Representa la información de contacto de un paciente, incluyendo su dirección, número de teléfono y correo electrónico.
 */
export interface data { 
    address: string; 
    phoneNumber: string; 
    email: string; 
}

/**
 * PatientDocumentInterface: Define la estructura de un documento de paciente en la base de datos, incluyendo campos como nombre, fecha de nacimiento, 
 * número de seguridad social, género, información de contacto, alergias, tipo de sangre y estado del paciente.
 */
export interface PatientDocumentInterface extends Document {
    name: string;
    birthDate: Date;
    id: string;
    socialSecurityNumber: string;
    gender: string;
    contactInformation: data;
    alergies: string[];
    bloodType: string;
    status: string;
}
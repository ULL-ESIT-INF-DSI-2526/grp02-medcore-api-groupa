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
 * Gender: Define los posibles géneros de un paciente, que pueden ser 'male', 'female' o 'other'.
 */
export type Gender = 'male' | 'female' | 'other';

/**
 * BloodType: Define los posibles tipos de sangre de un paciente, que pueden ser A+, A-, B+, B-, AB+, AB-, O+ u O-.
 */
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

/**
 * PatientStatus: Define los posibles estados de un paciente, que pueden ser 'active', 'deceased' o 'sick leave'.
 */
export type PatientStatus = 'active' | 'deceased' | 'sick leave';


/**
 * PatientDocumentInterface: Define la estructura de un documento de paciente en la base de datos, incluyendo campos como nombre, fecha de nacimiento, 
 * número de seguridad social, género, información de contacto, alergias, tipo de sangre y estado del paciente.
 */
export interface PatientDocumentInterface extends Document {
    name: string;
    birthDate: Date;
    id: string;
    age: number;
    socialSecurityNumber: string;
    gender: Gender;
    contactInformation: data;
    alergies: string[];
    bloodType: BloodType;
    status: PatientStatus;
}
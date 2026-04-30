import { PatientDocumentInterface } from "../interfaces/PatientDocumentInterface.js";
import {Document, Schema, model} from 'mongoose';
import validator from 'validator';

/**
 * Mongoose Schema que representa un paciente en el sistema.
 * 
 * Incluye nombre, fecha de nacimiento, identificación (DNI o pasaporte), número de seguridad social, género, información de contacto, 
 * alergias, tipo de sangre y estado del paciente.
 */
const patientSchema = new Schema<PatientDocumentInterface>({
    /**
     * Nombre completo del paciente
     */
    name: {
        type: String,
        trim: true,
        required: true
    },

    /**
     * Fecha de nacimiento del paciente
     */
    birthDate: {
        type: Date,
        required: true
    },

    /**
     * Numero de identificación del paciente (DNI o pasaporte).
     * 
     * Se establece una longitud mínima de 9 caracteres para asegurar que el número de identificación sea válido (Tamaño de DNI).
     */
    id: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: (value: string) => {
            if (value.length < 9) {
                throw new Error('ID must be at least 9 characters long');
            }
        }
    },

    /**
     * Numero de la seguridad social del paciente.
     * 
     * Debe contener 12 caracteres para cumplir con el formato estándar de España.
    */
    socialSecurityNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: (value: string) => {
            if (value.length !== 12) {
                throw new Error('Social Security Number must be exactly 12 characters long');
            }
        }
    },

    /**
     * Género del paciente
     * 
     * Se limita a las opciones 'male', 'female' y 'other'.
     */
    gender: {
        type: String,
        trim: true,
        enum: [
            'male', 
            'female', 
            'other'
        ],
        required: true
    },

    /**
     * Lista de informacion de contacto.
     * 
     * Incluye dirección, numero de contacto y correo.
     */
    contactInformation: [{
        /**
         * Dirección del paciente
         */
        address : {
            type: String,
            required: true,      

        },

        /**
         * Número de contacto del paciente
         * 
         * Debe ser un número de telefono valido
         */
        contactNumber: {
            type: String,
            required: true,
            validate: {
                validator: (value: string) => validator.isMobilePhone(value),
                message: 'Invalid contact number format'
             }
        },

        /**
         * Correo electrónico del paciente
         * 
         * Debe ser un correo electronico válido
         */
        email: {
            type: String,
            trim: true,
            validate: {
                validator: (value: string) => validator.isEmail(value),
                message: 'Invalid email format'
             }
        }
    }],

    /**
     * Lista de alergias del paciente
     */
    alergies: {
        type: [String],
        default: []
    },

    /**
     * Tipo de sangre del paciente
     */
    bloodType: {
        type: String,
        trim: true,
        required: true,
        enum: [
            'A+', 
            'A-', 
            'B+', 
            'B-', 
            'AB+', 
            'AB-', 
            'O+', 
            'O-'
        ]
    },

    /**
     * Estado del paciente
     * 
     * Se limita a las opciones 'active', 'deceased' y 'sick leave'
     */
    status: {
        type: String,
        trim: true,
        required: true,
        enum: [
            'active', 
            'deceased', 
            'sick leave' 
        ]
    }
});

/**
 * Modelo de mongoose para el paciente.
 * 
 * Permite realizar operaciones CRUD sobre los documentos de pacientes en la base de datos MongoDB.
 */
export const Patient = model<PatientDocumentInterface>('Patient', patientSchema);
import { MedicineDocumentInterface } from "../interfaces/MedicineDocumentInterface.js";
import {Document, Schema, model} from 'mongoose';
import validator from 'validator';

/**
 * Mongoose Schema que representa un medicamento.
 * 
 * Incluye el nombre del medicamento, el ingrediente activo, el ID nacional, el tipo de medicamento, la dosis, la unidad de medida, el método de ingestión, 
 * el stock disponible, el precio, si requiere receta médica, la fecha de expiración y las contraindicaciones.
 */
const medicineSchema = new Schema<MedicineDocumentInterface>({
    
    /**
     * Nombre del medicamento. 
     * 
     * Debe ser una cadena de texto con al menos 3 caracteres.
     */
    name: {
        type: String,
        trim: true,
        required: true,
        validate: (value: string) => {
            if (value.length < 3) {
                throw new Error('Name must be at least 3 characters long');
            }
        }
    },

    /**
     * Ingrediente activo del medicamento.
     * 
     * Debe ser una cadena de texto con al menos 3 caracteres.
     */
    activeIngredient: {
        type: String,
        trim: true,
        required: true,
        validate: (value: string) => {
            if (value.length < 3) {
                throw new Error('Active ingredient must be at least 3 characters long');
            }
        }
    },

    /**
     * ID nacional del medicamento.
     * 
     * Debe ser una cadena de texto única y no vacía.
     */
    nationalID: {
        type: String,
        unique: true,
        required: true
    },

    /**
     * Tipo de medicamento.
     * 
     * Debe ser una de las siguientes opciones: 'capsule', 'compressed', 'oral solution', 'injectable solution', 'ointment', 'transdermal patch', 'inhaler' 
     * o 'other'.
     */
    type: {
        type: String,
        required: true,
        enum: [
            'capsule', 
            'compressed', 
            'oral solution', 
            'injectable solution', 
            'ointment', 
            'transdermal patch', 
            'inhaler', 
            'other'
        ]
    },

    /**
     * Dosis del medicamento.
     * 
     * Debe ser un número positivo mayor o igual a 0.1.
     */
    dosage: {
        type: Number,
        required: true,
        min: 0.1
    },

    /**
     * Unidad de medida de la dosis.
     * 
     * Debe ser una de las siguientes opciones: 'mg', 'ml', 'g' o 'units'.
     */
    mesureUnit: {
        type: String,
        required: true,
        enum: [
            'mg', 
            'ml', 
            'g', 
            'units'
        ]
    },

    /**
     * Método de ingestión del medicamento.
     * 
     * Debe ser una de las siguientes opciones: 'oral', 'intravenous', 'intramuscular', 'subcutaneous', 'topical' o 'inhalation'.
     */
    ingestionMethod: {
        type: String,
        required: true,
        enum: [
            'oral', 
            'intravenous', 
            'intramuscular', 
            'subcutaneous', 
            'topical', 
            'inhalation'
        ]
    },

    /**
     * Stock disponible del medicamento.
     * 
     * Debe ser un número entero no negativo.
     */
    stock: {
        type: Number,
        min: 0
    },

    /**
     * Precio del medicamento.
     * 
     * Debe ser un número positivo.
     */
    price: {
        type: Number,
        validate: (value: number) => {            
            if (value < 0) {
                throw new Error('Price must be a positive number');
            }
        }
    },

    /**
     * Indica si el medicamento requiere receta médica.
     */
    prescriptionRequired: {
        type: Boolean,
        required: true
    },

    /**
     * Fecha de expiración del medicamento.
     * 
     * Debe ser una fecha futura.
     */
    expirationDate: {
        type: Date,
        required: true
    },

    /**
     * Contraindicaciones del medicamento.
     * 
     * Por defecto la cadena está vacía, pero puede contener una lista de contraindicaciones separadas por comas.
     */
    contraindications: {
        type: [String],
        default: []
    }
});

/**
 * Modelo de mongoose para los medicamentos.
 * 
 * Permite realizar operaciones CRUD sobre los documentos de medicamentos en la base de datos MongoDB.
 */
export const Medicine = model<MedicineDocumentInterface>('Medicine', medicineSchema);

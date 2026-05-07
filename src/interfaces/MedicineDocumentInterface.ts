import {Document} from 'mongoose';

/**
 * Tipos de medicamentos
 */
export type MedicineType = 'capsule' | 'compressed' | 'oral solution' | 'injectable solution' | 'ointment' | 'transdermal patch' | 'inhaler' | 'other';

/**
 * Unidades de medida
 */
export type MeasureUnit = 'mg' | 'ml' | 'g' | 'units';

/**
 * Métodos de ingestión
 */
export type IngestionMethod = 'oral' | 'intravenous' | 'intramuscular' | 'subcutaneous' | 'topical' |'inhalation';


/**
 * MedicineDocumentInterface: define la estructura de un documento de medicamento en la base de datos.
 * 
 * Incluye campos como nombre, ingrediente activo, ID nacional, tipo, dosis, unidad de medida, método de ingestión, stock, precio, si requiere receta, 
 * fecha de expiración y contraindicaciones.
 */
export interface MedicineDocumentInterface extends Document {
    name: string;
    activeIngredient: string;
    nationalID: string;
    type: MedicineType;
    dosage: number;
    mesureUnit: MeasureUnit;
    ingestionMethod: IngestionMethod;
    stock: number;
    price: number;
    prescriptionRequired: boolean;
    expirationDate: Date;
    contraindications: string[];
}
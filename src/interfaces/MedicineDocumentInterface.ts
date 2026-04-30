import {Document} from 'mongoose';


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
    type: string;
    dosage: number;
    mesureUnit: string;
    ingestionMethod: string;
    stock: number;
    price: number;
    preescriptionRequired: boolean;
    expirationDate: Date;
    contraindications: string[];
}
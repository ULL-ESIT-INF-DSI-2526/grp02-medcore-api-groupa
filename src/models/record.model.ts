import { Schema, model, Types } from 'mongoose';
import { RecordDocumentInterface } from '../interfaces/RecordDocumentInterface.js';
import { Medicine } from './medicine.model.js';


/**
 * Mongoose schema para las consultas e ingresos. 
 * 
 * Incluye campos para el paciente, responsable, tipo de registro, fechas, motivo, diagnóstico, lista de medicamentos y el importe total de la receta.
 */
const RecordSchema = new Schema<RecordDocumentInterface>({
  
  /**
   * Paciente que realiza la consulta o ingreso. 
   * 
   * Referencia al id del documento de Patient.
   */
  patient: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Patient'
  },

  /**
   * Referencia al id del documento de Staff que es responsable de la consulta o ingreso.
   */
  responsable: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Staff'
  },

  /**
   * Tipo de registro.
   * 
   * Puede ser "Hospital Admission" para ingresos hospitalarios o "Outpatient Consultation" para consultas ambulatorias.
   */
  registerType: {
    type: String,
    required: true,
    trim: true,
    enum: ['Hospital Admission', 'Outpatient Consultation']
  },

  /**
   * Fecha de inicio de la consulta o ingreso. 
   * 
   * Por defecto, se establece en la fecha actual al crear el documento.
   */
  startDate: {
    type: Date,
    default: Date.now
  },

  /**
   * Fecha de finalización de la consulta o ingreso. 
   * 
   * Debe ser mayor que la fecha de inicio si se proporciona.
   */
  endDate: {
    type: Date,
    validate: function (this: RecordDocumentInterface, value: Date) {
        if (value && this.startDate && value < this.startDate) {
            throw new Error('The end date must be greater than the start date.');
        }
    }
  },

  /**
   * Motivo de la consulta o ingreso.
   */
  motive: {
    type: String,
    required: true,
    trim: true
  },

  /**
   * Diagnostico de la consulta o ingreso.
   */
  diagnosis: {
    type: String,
    required: true,
    trim: true
  },

  /**
   * Lista de medicamentos de la receta
   */
  medicineList: [{

    /**
     * Referencia al id del documento de Medicine que se prescribe en la receta.
     */
    medicine: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Medicine' 
    },

    /**
     * Cantidad del medicamento.
     */
    quantity: {
      type: Number,
      required: true,
      validate: (value: number) => {
        if (value <= 0) {
          throw new Error('The quatity of medicines must be grater than zero.');
        }
      }
    },

    /**
     * Posologia del medicamento.
     */
    posology: {
      type: String,
      required: true,
      trim: true
    }
  }],

  /**
   * Importe total de la receta, calculado automáticamente antes de guardar el documento.
   */
  totalImport: {
    type: Number,
    default: 0
  }
});


/**
 * Middleware que se ejecuta antes de guardar un documento de Record. Calcula el importe total de la receta sumando el precio de cada medicamento 
 * multiplicado por su cantidad.
 */
RecordSchema.pre('save', async function () {
  let total = 0;

  const medicineTuple: [Types.ObjectId, number][] = this.medicineList.map(m => [m.medicine, m.quantity]);

  for (const t of medicineTuple) {
      const medicine = await Medicine.findById(t[0]);
      if (!medicine) {
        throw new Error('Medicine not found');
      } else {
        total += medicine.price * t[1];
      }
  }
  this.totalImport = total;
});


/**
 * Modelo de mongoose para las consultas e ingresos.
 * 
 * Permite realizar operaciones CRUD sobre los documentos de las consultas en la base de datos MongoDB.
 */
export const Record = model<RecordDocumentInterface>('Record', RecordSchema);
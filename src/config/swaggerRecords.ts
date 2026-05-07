import e from "express";

export const recordSchemas = {
  Record: {
    type: "object",
    properties: {
      _id: { type: "string", example: "66201c5e9a7b4b001e3f5678" },
      patient: { 
        type: "string", 
        description: "ID del paciente (ObjectId)", 
        example: "661f1f5c9a7b4b001e3f9999" 
      },
      responsable: { 
        type: "string", 
        description: "ID del personal médico (ObjectId)", 
        example: "661f1f5c9a7b4b001e3f8888" 
      },
      registerType: { 
        type: "string", 
        enum: ["Hospital Admission", "Outpatient Consultation"], 
        example: "Outpatient Consultation" 
      },
      startDate: { type: "string", format: "date-time", example: "2024-04-20T10:00:00Z" },
      endDate: { type: "string", format: "date-time", example: "2024-04-20T11:00:00Z" },
      motive: { type: "string", example: "Dolor abdominal persistente" },
      diagnosis: { type: "string", example: "Gastritis leve" },
      medicineList: {
        type: "array",
        items: {
          type: "object",
          properties: {
            medicine: { type: "string", description: "ID del medicamento", example: "661f1f5c9a7b4b001e3f1234" },
            quantity: { type: "number", example: 2 },
            posology: { type: "string", example: "Una cada 8 horas después de las comidas" }
          }
        }
      },
      totalImport: { 
        type: "number", 
        description: "Calculado automáticamente basado en el precio de los medicamentos",
        example: 15.50 
      }
    }
  },

  RecordCreate: {
    type: "object",
    required: ["patient", "responsable", "registerType", "motive", "diagnosis"],
    properties: {
      patient: { type: "string", example: "661f1f5c9a7b4b001e3f9999" },
      responsable: { type: "string", example: "661f1f5c9a7b4b001e3f8888" },
      registerType: { 
        type: "string", 
        enum: ["Hospital Admission", "Outpatient Consultation"], 
        example: "Outpatient Consultation" 
      },
      startDate: { type: "string", format: "date-time", example: "2024-04-20T10:00:00Z" },
      endDate: { type: "string", format: "date-time", example: "2024-04-20T11:00:00Z" },
      motive: { type: "string", example: "Dolor abdominal persistente" },
      diagnosis: { type: "string", example: "Gastritis leve" },
      medicineList: {
        type: "array",
        items: {
          type: "object",
          properties: {
            medicine: { type: "string", example: "661f1f5c9a7b4b001e3f1234" },
            quantity: { type: "number", example: 2 },
            posology: { type: "string", example: "Una cada 8 horas después de las comidas" }
          }
        }
      }
    }
  },
  RecordUpdate: {
    type: "object",
    additionalProperties: false, 
    description: "Esquema para actualizar registros. Todos los campos son opcionales.",
    properties: {
      registerType: { 
        type: "string", 
        enum: ["Hospital Admission", "Outpatient Consultation"],
        example: "Outpatient Consultation" 
      },
      startDate: { 
        type: "string", 
        format: "date-time", 
        example: "2024-04-20T10:00:00Z" 
      },
      endDate: { 
        type: "string", 
        format: "date-time",
        description: "Debe ser mayor a la fecha de inicio",
        example: "2024-04-20T11:00:00Z"
      },
      motive: { type: "string", example: "Dolor abdominal persistente" },
      diagnosis: { type: "string", example: "Gastritis leve" },
      medicineList: {
        type: "array",
        items: {
          type: "object",
          properties: {
            medicine: { type: "string", description: "ID del medicamento", example: "661f1f5c9a7b4b001e3f1234" },
            quantity: { type: "number", example: 2 },
            posology: { type: "string", example: "Una cada 8 horas después de las comidas" }
          }
        }
      }
    }
  }
};
export const medicineSchemas = {
  Medicine: {
    type: "object",
    properties: {
      _id: { type: "string", example: "661f1f5c9a7b4b001e3f1234" },
      name: { type: "string", example: "Ibuprofeno" },
      activeIngredient: { type: "string", example: "Ibuprofeno" },
      nationalID: { type: "string", example: "ES-12345678" },
      type: { 
        type: "string", 
        enum: ['capsule', 'compressed', 'oral solution', 'injectable solution', 'ointment', 'transdermal patch', 'inhaler', 'other'],
        example: "compressed" 
      },
      dosage: { type: "number", example: 600 },
      mesureUnit: { 
        type: "string", 
        enum: ['mg', 'ml', 'g', 'units'],
        example: "mg" 
      },
      ingestionMethod: { 
        type: "string", 
        enum: ['oral', 'intravenous', 'intramuscular', 'subcutaneous', 'topical', 'inhalation'],
        example: "oral" 
      },
      stock: { type: "integer", example: 50 },
      price: { type: "number", example: 4.50 },
      prescriptionRequired: { type: "boolean", example: true },
      expirationDate: { type: "string", format: "date-time", example: "2026-12-31T23:59:59Z" },
      contraindications: { 
        type: "array", 
        items: { type: "string" }, 
        example: ["Gastritis", "Hipersensibilidad"] 
      },
    },
  },

  MedicineCreate: {
    type: "object",
    required: ["name", "activeIngredient", "nationalID", "type", "dosage", "mesureUnit", "ingestionMethod", "prescriptionRequired", "expirationDate"],
    properties: {
      name: { type: "string", example: "Paracetamol" },
      activeIngredient: { type: "string", example: "Paracetamol" },
      nationalID: { type: "string", example: "ES-87654321" },
      type: { 
        type: "string", 
        enum: ['capsule', 'compressed', 'oral solution', 'injectable solution', 'ointment', 'transdermal patch', 'inhaler', 'other'],
        example: "capsule" 
      },
      dosage: { type: "number", example: 500 },
      mesureUnit: { 
        type: "string", 
        enum: ['mg', 'ml', 'g', 'units'],
        example: "mg" 
      },
      ingestionMethod: { 
        type: "string", 
        enum: ['oral', 'intravenous', 'intramuscular', 'subcutaneous', 'topical', 'inhalation'],
        example: "oral" 
      },
      stock: { type: "integer", example: 100 },
      price: { type: "number", example: 2.95 },
      prescriptionRequired: { type: "boolean", example: false },
      expirationDate: { type: "string", format: "date-time", example: "2025-06-15T00:00:00Z" },
      contraindications: { type: "array", items: { type: "string" } },
    },
  },

  MedicineUpdate: {
    type: "object",
    additionalProperties: false,
    properties: {
      name: { type: "string", example: "Paracetamol" },
      activeIngredient: { type: "string", example: "Paracetamol" },
      nationalID: { type: "string", example: "ES-87654321" },
      type: { 
        type: "string", 
        enum: ['capsule', 'compressed', 'oral solution', 'injectable solution', 'ointment', 'transdermal patch', 'inhaler', 'other'],
        example: "capsule" 
      },
      dosage: { type: "number", example: 500 },
      mesureUnit: { 
        type: "string", 
        enum: ['mg', 'ml', 'g', 'units'],
        example: "mg" 
      },
      ingestionMethod: { 
        type: "string", 
        enum: ['oral', 'intravenous', 'intramuscular', 'subcutaneous', 'topical', 'inhalation'],
        example: "oral" 
      },
      stock: { type: "integer", example: 100 },
      price: { type: "number", example: 2.95 },
      prescriptionRequired: { type: "boolean", example: false },
      expirationDate: { type: "string", format: "date-time", example: "2025-06-15T00:00:00Z" },
      contraindications: { type: "array", items: { type: "string" } },
    },
  },
};
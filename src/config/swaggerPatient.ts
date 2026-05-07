export const patientSchemas = {
  Patient: {
    type: "object",
    properties: {
      _id: { type: "string", example: "661f1f5c9a7b4b001e3f9999" },
      name: { type: "string", example: "Juan Pérez" },
      birthDate: { type: "string", format: "date", example: "1990-05-15" },
      age: { type: "integer", example: 34 },
      id: { type: "string", example: "12345678Z" },
      socialSecurityNumber: { type: "string", example: "123456789012" },
      gender: { type: "string", enum: ["male", "female", "other"], example: "male" },
      contactInformation: {
        type: "array",
        items: {
          type: "object",
          properties: {
            address: { type: "string", example: "Calle Mayor 1, Madrid" },
            contactNumber: { type: "string", example: "+34600000000" },
            email: { type: "string", example: "juan@example.com" }
          }
        }
      },
      alergies: { type: "array", items: { type: "string" }, example: ["Polen", "Penicilina"] },
      bloodType: { type: "string", enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], example: "O+" },
      status: { type: "string", enum: ["active", "deceased", "sick leave"], example: "active" }
    }
  },

  PatientCreate: {
    type: "object",
    required: ["name", "birthDate", "id", "socialSecurityNumber", "gender", "bloodType", "status"],
    properties: {
      name: { type: "string", example: "Juan Pérez" },
      birthDate: { type: "string", format: "date", example: "1990-05-15" },
      id: { type: "string", example: "12345678Z" },
      socialSecurityNumber: { type: "string", example: "123456789012" },
      gender: { type: "string", enum: ["male", "female", "other"], example: "male" },
      contactInformation: {
        type: "array",
        items: {
          type: "object",
          properties: {
            address: { type: "string", example: "Calle Mayor 1, Madrid" },
            contactNumber: { type: "string", example: "+34600000000" },
            email: { type: "string", example: "juan@example.com" }
          }
        }
      },
      alergies: { type: "array", items: { type: "string" }, example: ["Polen", "Penicilina"] },
      bloodType: { type: "string", enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], example: "O+" },
      status: { type: "string", enum: ["active", "deceased", "sick leave"], example: "active" }
    }
  },

  PatientUpdate: {
    type: "object",
    additionalProperties: false,
    description: "Schema for updating patient information. All fields are optional.",
    properties: {
      name: { type: "string", example: "Juan Pérez Modificado" },
      birthDate: { type: "string", format: "date", example: "1990-05-15" },
      gender: { 
        type: "string", 
        enum: ["male", "female", "other"],
        example: "male"
      },
      contactInformation: {
        type: "array",
        items: {
          type: "object",
          properties: {
            address: { type: "string" , example: "Calle Mayor 1, Madrid" },
            contactNumber: { type: "string" , example: "+34600000000" },
            email: { type: "string" , example: "juan@example.com" }
          }
        }
      },
      alergies: { type: "array", items: { type: "string" }, example: ["Polen", "Penicilina"] },
      bloodType: { 
        type: "string", 
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        example: "O+"
      },
      status: { 
        type: "string", 
        enum: ["active", "deceased", "sick leave"],
        example: "active"
      }
    }
  }
};
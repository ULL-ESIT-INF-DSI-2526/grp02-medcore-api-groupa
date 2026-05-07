import e from "express";

export const staffSchemas = {
  Staff: {
    type: "object",
    properties: {
      _id: { type: "string", example: "661f1f5c9a7b4b001e3f8888" },
      name: { type: "string", example: "Dr. Gregory House" },
      licenseNumber: { type: "integer", example: 123456 },
      medicalSpeciality: { 
        type: "string", 
        enum: ['General Medicine', 'Cardiology', 'Traumatology', 'Pediatry', 'Oncology', 'Urgency'],
        example: "Oncology" 
      },
      title: { 
        type: "string", 
        enum: ['Attending Physician', 'Resident Physician', 'Nurse', 'Nursing Assistant', 'Chief of Service'],
        example: "Chief of Service" 
      },
      workShift: { 
        type: "string", 
        enum: ['morning', 'afternoon', 'night', 'rotating'],
        example: "rotating" 
      },
      consultingRoom: { type: "string", example: "B-102" },
      experience: { type: "integer", example: 15 },
      contact: { type: "string", example: "+34611223344" },
      state: { type: "boolean", example: true }
    }
  },

  StaffCreate: {
    type: "object",
    required: ["name", "licenseNumber", "medicalSpeciality", "title", "workShift", "consultingRoom", "experience", "contact", "state"],
    properties: {
      name: { type: "string", example: "Dra. Lisa Cuddy" },
      licenseNumber: { type: "integer", example: 987654 },
      medicalSpeciality: { 
        type: "string", 
        enum: ['General Medicine', 'Cardiology', 'Traumatology', 'Pediatry', 'Oncology', 'Urgency'],
        example: "General Medicine" 
      },
      title: { 
        type: "string", 
        enum: ['Attending Physician', 'Resident Physician', 'Nurse', 'Nursing Assistant', 'Chief of Service'], 
        example: "Attending Physician" 
      },
      workShift: { 
        type: "string", 
        enum: ['morning', 'afternoon', 'night', 'rotating'], 
        example: "morning" 
      },
      consultingRoom: { type: "string", example: "A-01" },
      experience: { type: "integer", example: 10 },
      contact: { type: "string", example: "+34655443322" },
      state: { type: "boolean", example: true }
    }
  },

  StaffUpdate: {
    type: "object",
    additionalProperties: false,
    properties: {
      name: { type: "string" , example: "Dr. James Wilson" },
      medicalSpeciality: { 
        type: "string", 
        enum: ['General Medicine', 'Cardiology', 'Traumatology', 'Pediatry', 'Oncology', 'Urgency'], 
        example: "General Medicine" 
      },
      title: { 
        type: "string", 
        enum: ['Attending Physician', 'Resident Physician', 'Nurse', 'Nursing Assistant', 'Chief of Service'], 
        example: "Attending Physician" 
      },
      workShift: { 
        type: "string", 
        enum: ['morning', 'afternoon', 'night', 'rotating'], 
        example: "morning" 
      },
      consultingRoom: { type: "string", example: "A-01" },
      experience: { type: "integer", example: 10 },
      contact: { type: "string", example: "+34655443322" },
      state: { type: "boolean", example: true }
    }
  }
};
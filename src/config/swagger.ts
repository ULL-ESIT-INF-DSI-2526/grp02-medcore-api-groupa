import swaggerJSDoc, { Options } from "swagger-jsdoc";
import { medicineSchemas } from "./swaggerMedicine.js";
import { patientSchemas } from "./swaggerPatient.js";
import { staffSchemas } from "./swaggerStaff.js";
import { recordSchemas } from "./swaggerRecords.js";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MedCore API",
      version: "1.0.0",
      description: "REST API para la gestión hospitalaria (MedCore)",
    },
    servers: [
      {
        url: process.env.SWAGGER_SERVER,
      },
    ],
    components: {
      schemas: {
        ...medicineSchemas, 
        ...patientSchemas,
        ...staffSchemas,
        ...recordSchemas,
        
        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "string", example: "Mensaje de error descriptivo" },
          },
        },
      },
    },
  },

  apis: ["./src/routers/*.ts", "./dist/routers/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
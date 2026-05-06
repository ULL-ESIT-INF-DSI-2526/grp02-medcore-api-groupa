import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { Medicine } from "../src/models/medicine.model.js";
import mongoose from "mongoose";

describe("Test medications", () => {
    const medicineData = {
        name: "Paracetamol",
        activeIngredient: "Paracetamol",
        nationalID: "1234567890",
        type: "capsule",
        dosage: 500,
        mesureUnit: "mg",
        ingestionMethod: "oral",
        stock: 100,
        price: 5.99,
        prescriptionRequired: false,
        expirationDate: new Date("2025-12-31"),
        contraindications: ["Liver disease", "Allergy to paracetamol"]
    };

    let idMedicine: string;

    beforeEach(async () => {
        await Medicine.deleteMany();
        const medicine = await new Medicine(medicineData).save();
        idMedicine = medicine._id.toString();
    });

    describe("POST /medications", () => {
        test("Debe crear un medicamento", async () => {
            await request(app)
            .post("/medications")
            .send({
                name: "Ibuprofen",
                activeIngredient: "Ibuprofen",
                nationalID: "0987654321",
                type: "compressed",
                dosage: 200,
                mesureUnit: "mg",
                ingestionMethod: "oral",
                stock: 50,
                price: 3.99,
                prescriptionRequired: false,
                expirationDate: new Date("2024-12-31"),
                contraindications: ["Stomach ulcers", "Allergy to ibuprofen"]
            })
            .expect(201);

            expect(await Medicine.countDocuments()).toBe(2);
        });
        
        test("Debe dar error si se añade los mismos datos de medicamento", async () => {
            await request(app)            
            .post("/medications")
            .send(medicineData)
            .expect(400);
        })
    });

    describe("GET /medications/:id", () => {
        test("Debe obtener un medicamento por su id", async () => {
            await request(app)
            .get(`/medications/${idMedicine}`)
            .expect(200);
        });

        test("Debe dar error si el medicamento no existe", async () => {
            await request(app)
            .get("/medications/69f4f553fcd85dd7d524d54b")
            .expect(404);
        });

        test("Debe dar error si el id no es válido", async () => {
            await request(app)
            .get("/medications/invalid-id")
            .expect(500);
        });
    });

    describe("GET /medications?", () => {
        test("Debe obtener un medicamento por su nombre", async () => {
            await request(app)
            .get("/medications?name=Paracetamol")
            .expect(200);
        });

        test("Debe obtener un medicamento por su número de identifiación", async () => {
            await request(app)
            .get("/medications?nationalID=1234567890")
            .expect(200);
        });

        test("Debe dar error si no se proporciona ni nombre ni número de identificación", async () => {
            await request(app)
            .get("/medications")
            .expect(400);
        });

        test("Debe devolver un medicamento si se propocionan ambas cosas", async () => {
            await request(app)
            .get("/medications?name=Paracetamol&nationalID=1234567890")
            .expect(200);
        });

        test("Debe dar error si el medicamento no existe", async () => {
            await request(app)
            .get("/medications?name=Medicamento Inexistente")
            .expect(404);
        });

        test("Debe busacar por ingrediente activo", async () => {
            await request(app)
            .get("/medications?activeIngredient=Paracetamol")
            .expect(200);
        });
        
        test("Debe dar error desconexion con el servidor", async () => {
            await mongoose.connection.close();
            await request(app)
            .get("/medications?name=Paracetamol")
            .expect(500);
            await mongoose.connect("mongodb://localhost:27017/hospital-app");
        });
    });

    describe("DELETE /medications/:id", () => {
        test("Debe eliminar un medicamento por su id", async () => {
            await request(app)
            .delete(`/medications/${idMedicine}`)
            .expect(200);
            expect(await Medicine.countDocuments()).toBe(0);
        });

        test("Debe dar error si el medicamento no existe", async () => {
            await request(app)
            .delete("/medications/69f4f553fcd85dd7d524d54b")
            .expect(404);
        });

        test("Debe dar error si el id no es válido", async () => {
            await request(app)
            .delete("/medications/invalid-id")
            .expect(500);
        });
    });

    describe("DELETE /medications?", () => {
        test("Debe eliminar un medicamento por su nombre", async () => {
            await request(app)
            .delete("/medications?name=Paracetamol")
            .expect(200);
            expect(await Medicine.countDocuments()).toBe(0);
        });

        test("Debe eliminar un medicamento por su número de identificación", async () => {
            await request(app)
            .delete("/medications?nationalID=1234567890")
            .expect(200);
            expect(await Medicine.countDocuments()).toBe(0);
        });

        test("Debe dar error si no se proporciona ni nombre ni número de identificación", async () => {
            await request(app)
            .delete("/medications")
            .expect(400);
        });

        test("Debe eliminar un medicamento si se propocionan ambas cosas", async () => {
            await request(app)
            .delete("/medications?name=Paracetamol&nationalID=1234567890")
            .expect(200);
            expect(await Medicine.countDocuments()).toBe(0);
        });

        test("Debe eliminar un medicamento por su ingrediente activo", async () => {
            await request(app)
            .delete("/medications?activeIngredient=Paracetamol")
            .expect(200);
            expect(await Medicine.countDocuments()).toBe(0);
        });

        test("Debe dar error si el medicamento no existe", async () => {
            await request(app)
            .delete("/medications?name=Medicamento Inexistente")
            .expect(404);
        });

        test("Debe dar error desconexion con el servidor", async () => {
            await mongoose.connection.close();
            await request(app)
            .delete("/medications?name=Paracetamol")
            .expect(500);
            await mongoose.connect("mongodb://localhost:27017/hospital-app");
        });
    });

    describe("PATCH /medications/:id", () => {
        test("Debe actualizar un medicamento por su id", async () => {
            await request(app)
            .patch(`/medications/${idMedicine}`)
            .send({
                name: "Paracetamol Modificado"
            })
            .expect(200);
            const medicine = await Medicine.findById(idMedicine);
            expect(medicine?.name).toBe("Paracetamol Modificado");
        });

        test("Debe dar error si el medicamento no existe", async () => {
            await request(app)
            .patch("/medications/69f4f553fcd85dd7d524d54b")
            .send({
                name: "Medicamento Inexistente"
            })
            .expect(404);
        });

        test("Debe dar error si el id no es válido", async () => {
            await request(app)
            .patch("/medications/invalid-id")
            .send({
                name: "Medicamento Inexistente"
            })
            .expect(500);
        });

        test ("Debe dar error si no se introducen datos para actualizar", async () => {
            await request(app)
            .patch(`/medications/${idMedicine}`)
            .send()
            .expect(400);
        });
        
        test("Debe dar error si se intenta actualizar con datos no válidos", async () => {
            await request(app)
            .patch(`/medications/${idMedicine}`)
            .send({
                hola: "Mundo"
            })
            .expect(400);
        });
    });

    describe('PUT /medications/:id', () => {
        test('Debe actualizar correctamente el medicamento completo', async () => {
            await request(app)
            .put(`/medications/${idMedicine}`)
            .send({
                name: "Dalcy",
                activeIngredient: "Paracetamol",
                nationalID: "1234599990",
                type: "capsule",
                dosage: 500,
                mesureUnit: "mg",
                ingestionMethod: "oral",
                stock: 100,
                price: 5.99,
                prescriptionRequired: false,
                expirationDate: new Date("2025-12-31"),
                contraindications: ["Liver disease", "Allergy to paracetamol"]
            })
            .expect(200);
        });

        test("Debe dar error si el medicamento no existe", async () => {
            await request(app)
            .put("/medications/69f4f553fcd85dd7d524d54b")
            .send({
                name: "Dalcy",
                activeIngredient: "Paracetamol",
                nationalID: "1234599990",
                type: "capsule",
                dosage: 500,
                mesureUnit: "mg",
                ingestionMethod: "oral",
                stock: 100,
                price: 5.99,
                prescriptionRequired: false,
                expirationDate: new Date("2025-12-31"),
                contraindications: ["Liver disease", "Allergy to paracetamol"]
            })
            .expect(404);
        });

        test("Debe dar error si no hay cuerpo en la petición", async () => {
            await request(app)
            .put(`/medications/${idMedicine}`)
            .send()
            .expect(400);
        });

        test("Debe dar error si faltan campos obligatorios", async () => {
            await request(app)
            .put(`/medications/${idMedicine}`)
            .send({
                name: "Dalcy"
            })
            .expect(400);
        });

        test("Debe dar error si no funciona la conexión con el servidor", async () => {
            await mongoose.connection.close();
            await request(app)
            .put(`/medications/${idMedicine}`)
            .send({
                name: "Dalcy",
                activeIngredient: "Paracetamol",
                nationalID: "1234599990",
                type: "capsule",
                dosage: 500,
                mesureUnit: "mg",
                ingestionMethod: "oral",
                stock: 100,
                price: 5.99,
                prescriptionRequired: false,
                expirationDate: new Date("2025-12-31"),
                contraindications: ["Liver disease", "Allergy to paracetamol"]
            })
            .expect(500);
            await mongoose.connect("mongodb://localhost:27017/hospital-app");
        });
    });
});
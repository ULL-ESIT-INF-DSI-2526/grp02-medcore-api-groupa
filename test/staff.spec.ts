import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { Staff } from "../src/models/staff.model.js";
import mongoose from "mongoose";

describe("Staff Test", () => {
    const staffData = {
        name: "Jonas Almeida",
        licenseNumber: 123456,
        medicalSpeciality: 'Cardiology',
        title: 'Attending Physician',
        workShift: "morning",
        consultingRoom: 'A64',
        experience: 10,
        contact: "+34600112233",
        state: true
    };

    let idStaff: string;

    beforeEach(async () => {
        await Staff.deleteMany();
        const staff = await new Staff(staffData).save();
        idStaff = staff._id.toString();
    });


    describe("POST /staff", () => {
        test("Deberia crear un nuevo staff", async () => {
            const response = await request(app)
                .post("/staff")
                .send({
                    name: "Maria Silva",
                    licenseNumber: 654321,
                    medicalSpeciality: 'Traumatology',
                    title: 'Nurse',
                    workShift: 'afternoon',
                    consultingRoom: 'B12',
                    experience: 5,
                    contact: "+34600112233",
                    state: true
                })
                .expect(201);

            expect(await Staff.countDocuments()).toBe(2);
            expect(response.body.name).toBe("Maria Silva");
        });

        test ("Deberia devolver 400 si faltan campos", async () => {
            await request(app)
                .post("/staff")
                .send({
                    name: "Maria Silva",
                    licenseNumber: 654321,
                    medicalSpeciality: 'Cardiology',
                    title: 'Nurse',
                    workShift: 'afternoon',
                    consultingRoom: 'B12',
                    experience: 5,
                    contact: "+34600112233"
                })
                .expect(400);
        });
    });

    describe("GET /staff/:id", () => {
        test("Deberia devovler un staff por su id", async () => {
            await request(app)
                .get(`/staff/${idStaff}`)
                .expect(200);
            expect(await Staff.countDocuments()).toBe(1);
        });

        test("Deberia devolver 404", async () => {
            await request(app)
                .get("/staff/69f4f553fcd85dd7d524d54b")
                .expect(404);
        });

        test ("Deberia devolvererror si se introduce un id invállido", async () => {
            await request(app)
                .get("/staff/invalid-id")
                .expect(500);
        });
    });

    describe("GET /staff", () => {
        test("Debe devolve errror si no se le asigna un query válido", async () => {
            await request(app)
                .get("/staff")
                .expect(400);
        });
        
        test("Debe devovler los miembros de staff por nombre", async () => {
            const response = await request(app)
                .get("/staff?name=Jonas+Almeida")
                .expect(200);

            expect(response.body.name).toBe("Jonas Almeida");
        });

        test("Debe devolver miembros de staff", async () => {
            const response = await request(app)
                .get("/staff?medicalSpeciality=Cardiology")
                .expect(200);
            expect(response.body.medicalSpeciality).toBe("Cardiology");
        });

        test("Debe devoler un staff por nombre y especialidad médica", async () => {
            const response = await request(app)
                .get("/staff?name=Jonas+Almeida&medicalSpeciality=Cardiology")
                .expect(200);
            expect(response.body.name).toBe("Jonas Almeida");
            expect(response.body.medicalSpeciality).toBe("Cardiology");
        });

        test("Deberia devolver 404", async () => {
            await request(app)
                .get("/staff?name=Nonexistent+Name")
                .expect(404);
        });

        test ("debe retornar 500 si se desconecta mongoDB", async () => {
            await mongoose.connection.close();
            await request(app)
                .get("/staff?name=Jonas+Almeida")
                .expect(500);
            await mongoose.connect("mongodb://localhost:27017/hospital-app");
        });

    });

    describe("DELETE /staff/:id", () => {
        test("Debe devolver un staff por su id", async () => {
            await request(app)
                .delete(`/staff/${idStaff}`)
                .expect(200);
            expect(await Staff.countDocuments()).toBe(0);
        });

        test("should return 404 if staff member not found", async () => {
            await request(app)
                .delete("/staff/69f4f553fcd85dd7d524d54b")
                .expect(404);
        });

        test ("Should return 500 if invalid ID format", async () => {
            await request(app)
                .delete("/staff/invalid-id")
                .expect(500);
        });
    });

    describe ("DELETE /staff", () => {
        test("deberia retornar 400 por no ingresar parametros", async () => {
            await request(app)
                .delete("/staff")
                .expect(400);
        });
        
        test("deberia retornar el personal con el nombre ingresado", async () => {
            const response = await request(app)
                .delete("/staff?name=Jonas+Almeida")
                .expect(200);
            expect(await Staff.countDocuments()).toBe(0);
        });

        test("deberia retornar el personal de la especialidad insertada", async () => {
            const response = await request(app)
                .delete("/staff?medicalSpeciality=Cardiology")
                .expect(200);
            expect(await Staff.countDocuments()).toBe(0);
        });

        test("deberia retornar el personal que coincida con el nombre y la especialidad", async () => {
            const response = await request(app)
                .delete("/staff?name=Jonas+Almeida&medicalSpeciality=Cardiology")
                .expect(200);
            expect(await Staff.countDocuments()).toBe(0);
        });

        test("deberia retornar 404 si no existe en la base de datos nadie con ese nombre", async () => {
            await request(app)
                .delete("/staff?name=Nonexistent+Name")
                .expect(404);
        });

        test ("debe retornar 500 si se desconecta mongoDB", async () => {
            await mongoose.connection.close();
            await request(app)
                .delete("/staff?name=Jonas+Almeida")
                .expect(500);
            await mongoose.connect("mongodb://localhost:27017/hospital-app");
        });
    });

    describe('PATCH /staff/:id', () => {
        test('debería poder camv', async () => {
            const response = await request(app)
                .patch(`/staff/${idStaff}`)
                .send({
                    name: "Pepe"
                })
                .expect(200);

            expect(response.body.name).toBe("Pepe");
        });

        test('deberia retornar 404 si el id no existe', async () => {
            await request(app)
                .patch("/staff/69f4f553fcd85dd7d524d54b")
                .send({
                    name: "Pepe"
                })
                .expect(404);
        });

        test('deberia retornar 500 si no proporcionamos un formato de id valido', async () => {
            await request(app)
                .patch("/staff/invalid-id")
                .send({
                    name: "Pepe"
                })
                .expect(500);
        });

        test('deberia retornar 400 si ', async () => {
            await request(app)
                .patch(`/staff/${idStaff}`)
                .send()
                .expect(400);
        });

        test('should return 400 if trying to update with invalid data', async () => {
            await request(app)
                .patch(`/staff/${idStaff}`)
                .send({
                    licenseNumber: "invalid-license-number"
                })
                .expect(400);
        }); 

    });

    describe('PUT /staff/:id', () => {
        test('should replace a staff member by ID', async () => {
            const response = await request(app)
                .put(`/staff/${idStaff}`)
                .send({
                    name: "Jonas Rodriguez",
                    licenseNumber: 333333,
                    medicalSpeciality: 'Cardiology',
                    title: 'Attending Physician',
                    workShift: "morning",
                    consultingRoom: 'A54',
                    experience: 10,
                    contact: "+34602115233",
                    state: true
                });
            expect(response.status).toBe(200);
        });

        test('should return 404 if staff member not found', async () => {
            await request(app)
                .put("/staff/69f4f553fcd85dd7d524d54b")
                .send({
                    name: "Jonas Rodriguez",
                    licenseNumber: 333333,
                    medicalSpeciality: 'Cardiology',
                    title: 'Attending Physician',
                    workShift: "morning",
                    consultingRoom: 'A54',
                    experience: 10,
                    contact: "+34602115233",
                    state: true
                })
                .expect(404);
        });

        test('should return 400 if no fields to update are provided', async () => {
            await request(app)
                .put(`/staff/${idStaff}`)
                .send()
                .expect(400);
        });

        test('should return 400 if trying to update with invalid data', async () => {
            await request(app)
                .put(`/staff/${idStaff}`)
                .send({
                    name: "Jonas Rodriguez",
                })
                .expect(400);
        });

        test('should return 500 if invalid ID format', async () => {
            await request(app)
                .put("/staff/invalid-id")
                .send({
                    name: "Jonas Rodriguez",
                    licenseNumber: 333333,
                    medicalSpeciality: 'Cardiology',
                    title: 'Attending Physician',
                    workShift: "morning",
                    consultingRoom: 'A54',
                    experience: 10,
                    contact: "+34602115233",
                    state: true
                })
                .expect(500);
        });
    });
});
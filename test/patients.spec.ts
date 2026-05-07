import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { Patient } from "../src/models/patient.model.js";
import { Record } from "../src/models/record.model.js";
import { Staff } from "../src/models/staff.model.js";
import { Medicine } from "../src/models/medicine.model.js";
import mongoose, { mongo } from "mongoose";

describe("Test patients", () => {

    const patientData = {
        name: "Ana Gómez",
        birthDate: "1986-07-20",
        age: 37,
        id: "87654321X",
        socialSecurityNumber: "341234567890",
        gender: "female",
        contactInformation: [{
            address: "Calle ",
            contactNumber: "+34600112233",
            email: "juanperez@gmail.com"
        }],
        alergies: ["Polen", "Penicilina"],
        bloodType: "O+",
        status: "active"
    };

    const medicineData = {
        name: "Paracetamol",
        activeIngredient: "Paracetamol",
        nationalID: "1230567890",
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

    const staffData = {
        name: "Jonas Almeida",
        licenseNumber: 173456,
        medicalSpeciality: 'Cardiology',
        title: 'Attending Physician',
        workShift: "morning",
        consultingRoom: 'A64',
        experience: 10,
        contact: "+34600112233",
        state: true
    };

    const recordData = {
        patient: patientData.id,
        responsable: staffData.licenseNumber,
        registerType: "Hospital Admission",
        startDate: new Date(2026, 1, 1),
        endDate: new Date(2026, 1, 15),
        motive: "Patient admitted for severe headache and dizziness",
        diagnosis: "Headache",
        medicineList: [
            { medicine: medicineData.nationalID , quantity: 2, posology: "Take 500mg every 6 hours" }
        ],
        registerState: "active"
     };

    let idPatient: string;

    beforeEach(async () => {
        await Patient.deleteMany();
        await Record.deleteMany();
        await Staff.deleteMany();
        await Medicine.deleteMany();
        const patient = await new Patient(patientData).save();
        idPatient = patient._id.toString();
    });

    describe("POST /patients", () => {
        test("Debe crear un paciente", async () => {
            await request(app)
            .post("/patients")
            .send({
                name: "Juan Pérez",
                birthDate: "1985-05-15",
                id: "12345678Z",
                socialSecurityNumber: "281234567890",
                gender: "male",
                contactInformation: [{
                    address: "Calle Heraclio Sánchez, 25, La Laguna",
                    contactNumber: "+34600112233",
                    email: "juan.perez@example.com"
                }],
                alergies: ["Polen", "Penicilina"],
                bloodType: "O+",
                status: "active"
            })
            .expect(201);

            expect(await Patient.countDocuments()).toBe(2);
        });
        
        test("Debe dar error si se añade los mismos datos de paciente", async () => {
            await request(app)            
            .post("/patients")
            .send(patientData)
            .expect(400);
        })
    });

    describe("GET /patients/:id", () => {
        test("Debe obtener un paciente por su id", async () => {
            // const patient = await Patient.findOne({ id: "87654321X" });
            await request(app)
            .get(`/patients/${idPatient}`)
            .expect(200);
        });

        test("Debe dar error si el paciente no existe", async () => {
            await request(app)
            .get("/patients/69f4f553fcd85dd7d524d54b")
            .expect(404);
        });

        test("Debe dar error si el id no es válido", async () => {
            await request(app)
            .get("/patients/invalid-id")
            .expect(500);
        });
    });

    describe("GET /patients?", () => {
        test("Debe obtener un paciente por su nombre", async () => {
            await request(app)
            .get("/patients?name=Ana Gómez")
            .expect(200);
        });

        test("Debe obtener un paciente por su número de identifiación", async () => {
            await request(app)
            .get("/patients?id=87654321X")
            .expect(200);
        });

        test("Debe dar error si no se proporciona ni nombre ni número de identificación", async () => {
            await request(app)
            .get("/patients")
            .expect(400);
        });

        test("Debe devolver un paciente si se propocionan ambas cosas", async () => {
            await request(app)
            .get("/patients?name=Ana Gómez&id=87654321X")
            .expect(200);
        });

        test("Debe dar error si el paciente no existe", async () => {
            await request(app)
            .get("/patients?name=Paciente Inexistente")
            .expect(404);
        });

        test("Debe dar error si el id no es válido", async () => {
            await mongoose.connection.close();
            await request(app)
            .get("/patients?id=2")
            .expect(500);
            await mongoose.connect("mongodb://localhost:27017/hospital-app");
        });
    });

    describe('PATCH /patients/:id', () => {
        test('Debe hacerse la actualizaciñon satisfactoriamente', async () => {
            await request(app)
            .patch(`/patients/${idPatient}`)
            .send({
                name: "Pepe"
            })
            .expect(200);
        });

        test('El nombre debe de actualizarse satisfactoriamente', async () => {
            const response = await request(app)
            .patch(`/patients/${idPatient}`)
            .send({
                name: "Pepe"
            })

            const patientName = response.body.name;
            expect(patientName).toBe('Pepe');
        });

        test('Debe de dar error la inserción por busqueda no encontrada', async () => {
            await request(app)
            .patch(`/patients/69fa517a5d41db4ed142530c`)
            .send({
                name: "Pepe"
            })
            .expect(404);
        });

        test ("Debe dar error si no se introducen datos para actualizar", async () => {
            await request(app)
            .patch(`/patients/${idPatient}`)
            .send()
            .expect(400);
        });
                
        test("Debe dar error si se intenta actualizar con datos no válidos", async () => {
            await request(app)
            .patch(`/patients/${idPatient}`)
            .send({
                id: "348384382920c"
            })
            .expect(400);
        });

        test ("Debe dar error si el id no es válido", async () => {
            await request(app)
            .patch("/patients/invalid-id")
            .send({
                name: "Pepe"
            })
            .expect(500);
        });
    });

    describe("DELETE /patients/:id", () => {
        test("Debe eliminar un paciente por su id", async () => {
            const patient = await Patient.findOne({ id: "87654321X" });
            await request(app)
            .delete(`/patients/${patient?._id}`)
            .expect(200);
            expect(await Patient.countDocuments()).toBe(0);
        });

        test("Debe dar error si el paciente no existe", async () => {
            await request(app)
            .delete("/patients/69f4f553fcd85dd7d524d54b")
            .expect(404);
        });

        test("Debe dar error si el id no es válido", async () => {
            await request(app)
            .delete("/patients/invalid-id")
            .expect(500);
        });

        test("Si elimina un paciente, se eliminan las consultas a su nombre", async () => {
            const medicine = await new Medicine(medicineData).save();
            const staff = await new Staff(staffData).save();

            const recordToSave = {
                ...recordData,
                patient: idPatient,        
                responsable: staff._id,    
                medicineList: [
                    { medicine: medicine._id , quantity: 2, posology: "Take 500mg every 6 hours" },
                ]
            };

            const record = await new Record(recordToSave).save();
            const response = await request(app)
            .delete(`/patients/${idPatient}`)
            .expect(200);

            const updatedMedicine = await Medicine.findById(medicine._id);
            expect(updatedMedicine?.stock).toBe(102);
        });
    });

    describe("DELETE /patients?", () => {
        test("Debe eliminar un paciente por su nombre", async () => {
            await request(app)
            .delete("/patients?name=Ana Gómez")
            .expect(200);
            expect(await Patient.countDocuments()).toBe(0);
        });

        test("Debe eliminar un paciente por su número de identificación", async () => {
            expect(await Patient.countDocuments()).toBe(1);
            await request(app)
            .delete("/patients?id=87654321X")
            .expect(200);
            expect(await Patient.countDocuments()).toBe(0);
        });

        test("Debe dar error si no se proporciona ni nombre ni número de identificación", async () => {
            await request(app)
            .delete("/patients")
            .expect(400);
        });

        test("Debe dar error si el paciente no existe", async () => {
            await request(app)
            .delete("/patients?name=Paciente Inexistente")
            .expect(404);
        });

        test("Debe dar error si el id no es válido", async () => {
            await mongoose.connection.close();
            await request(app)
            .delete("/patients?id=2")
            .expect(500);
            await mongoose.connect("mongodb://localhost:27017/hospital-app");
        });

        test("Si elimina un paciente, se eliminan las consultas a su nombre", async () => {
            const medicine = await new Medicine(medicineData).save();
            const staff = await new Staff(staffData).save();

            const recordToSave = {
                ...recordData,
                patient: idPatient,        
                responsable: staff._id,    
                medicineList: [
                    { medicine: medicine._id , quantity: 2, posology: "Take 500mg every 6 hours" },
                ]
            };

            const record = await new Record(recordToSave).save();
            const response = await request(app)
            .delete("/patients?name=Ana Gómez")
            .expect(200);

            const updatedMedicine = await Medicine.findById(medicine._id);
            expect(updatedMedicine?.stock).toBe(102);
        });

        test("Si elimina un paciente, se eliminan las consultas a su nombre", async () => {
            const medicine = await new Medicine(medicineData).save();
            const staff = await new Staff(staffData).save();

            const recordToSave = {
                ...recordData,
                patient: idPatient,        
                responsable: staff._id,    
                medicineList: [
                    { medicine: medicine._id , quantity: 2, posology: "Take 500mg every 6 hours" },
                ]
            };

            const record = await new Record(recordToSave).save();
            const response = await request(app)
            .delete("/patients?name=Ana Gómez")
            .expect(200);

            const updatedMedicine = await Medicine.findById(medicine._id);
            expect(updatedMedicine?.stock).toBe(102);
        });
    });

    describe('PUT /patients/:id', () => {
        test('Debe hacerse la actualización satisfactoriamente', async () => {
            await request(app)
            .put(`/patients/${idPatient}`)
            .send({
                name: "Ana Rodríguez",
                birthDate: "1986-07-20",
                age: 72,
                id: "87654321X",
                socialSecurityNumber: "341234567890",
                gender: "female",
                contactInformation: [{
                    address: "Calle ",
                    contactNumber: "+34600112233",
                    email: "juanperez@gmail.com"
                }],
                alergies: [],
                bloodType: "O+",
                status: "active"
            })
            .expect(200);
        });

        test('El nombre debe de actualizarse satisfactoriamente', async () => {
            await request(app)
            .put(`/patients/69f4f553fcd85dd7d524d54b`)
            .send({
                name: "Ana Rodríguez",
                birthDate: "1986-07-20",
                age: 72,
                id: "87654321X",
                socialSecurityNumber: "341234567890",
                gender: "female",
                contactInformation: [{
                    address: "Calle ",
                    contactNumber: "+34600112233",
                    email: "juanperez@gmail.com"
                }],
                alergies: [],
                bloodType: "O+",
                status: "active"
            })
            .expect(404);
        });

        test ("Debe dar error si no se introducen datos para actualizar", async () => {
            await request(app)
            .put(`/patients/${idPatient}`)
            .send()
            .expect(400);
        });

        test("Debe dar error del servidor", async () => {
            await mongoose.connection.close();
            await request(app)
            .put(`/patients/${idPatient}`)
            .send({
                name: "Ana Rodríguez",
                birthDate: "1986-07-20",
                age: 72,
                id: "87654321X",
                socialSecurityNumber: "341234567890",
                gender: "female",
                contactInformation: [{
                    address: "Calle ",
                    contactNumber: "+34600112233",
                    email: "juanperez@gmail.com"
                }],
                alergies: [],
                bloodType: "O+",
                status: "active"
            })
            .expect(500);
            await mongoose.connect("mongodb://localhost:27017/hospital-app");
        });

        test("Debe dar error si se intenta actualizar con datos no válidos", async () => {
            await request(app)
            .put(`/patients/${idPatient}`)
            .send({
                name: "Ana Rodríguez",
                birthDate: "1986-07-20",
                age: 72,
                id: "2",
                socialSecurityNumber: "341234567890"
            })
            .expect(400);
        });
    });
});
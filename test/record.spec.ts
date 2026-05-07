import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { Medicine } from "../src/models/medicine.model.js";
import { Patient } from "../src/models/patient.model.js";
import { Staff } from "../src/models/staff.model.js";
import { Record } from "../src/models/record.model.js";
import mongoose from "mongoose";

describe("Record Router", () => {
    const patientData = {
        name: "Ana Gómez",
        birthDate: "1986-07-20",
        age: 37,
        id: "87653321X",
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

    const medicineData2 = {
        name: "Ibuprofen",
        activeIngredient: "Ibuprofen",
        nationalID: "0987654321",
        type: "inhaler",
        dosage: 200,
        mesureUnit: "mg",
        ingestionMethod: "oral",
        stock: 50,
        price: 3.99,
        prescriptionRequired: false,
        expirationDate: new Date("2024-12-31"),
        contraindications: ["Stomach ulcers", "Allergy to ibuprofen"]
    };

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

    const recordData = {
        patient: patientData.id,
        responsable: staffData.licenseNumber,
        registerType: "Hospital Admission",
        startDate: new Date(2026, 1, 1),
        endDate: new Date(2026, 1, 15),
        motive: "Patient admitted for severe headache and dizziness",
        diagnosis: "Headache",
        medicineList: [
            { medicine: medicineData.nationalID , quantity: 2, posology: "Take 500mg every 6 hours" },
            { medicine: medicineData2.nationalID, quantity: 1, posology: "Take 200mg every 8 hours" }
        ],
        registerState: "active"
     };

    let recordID: string;

    beforeEach(async () => {
        await Record.deleteMany({});
        await Medicine.deleteMany({});
        await Patient.deleteMany({});
        await Staff.deleteMany({});

        const patientDoc = await new Patient(patientData).save();
        const med1Doc = await new Medicine(medicineData).save();
        const med2Doc = await new Medicine(medicineData2).save();
        const staffDoc = await new Staff(staffData).save();

        const recordToSave = {
            ...recordData,
            patient: patientDoc._id,        
            responsable: staffDoc._id,    
            medicineList: [
                { medicine: med1Doc._id , quantity: 2, posology: "Take 500mg every 6 hours" },
                { medicine: med2Doc._id, quantity: 1, posology: "Take 200mg every 8 hours" }
            ]
        };

        const record = await new Record(recordToSave).save();
        recordID = record._id.toString();
    });

    describe("POST /records", () => {
        test("Deberia crear un nuevo registro", async () => {
            await request(app)
                .post("/records")
                .send({
                    patient: patientData.id,
                    responsable: staffData.licenseNumber,
                    registerType: "Hospital Admission",
                    startDate: new Date(2026, 1, 2),
                    endDate: new Date(2026, 1, 17),
                    motive: "Patient admitted headache and dizziness",
                    diagnosis: "Headache",
                    medicineList: [
                        { medicine: medicineData.nationalID , quantity: 2, posology: "Take 500mg every 6 hours" }
                    ],
                    registerState: "active"
                })
                .expect(201);
        });

        test("Deberia devolver un error si el paciente no existe", async () => {
            const invalidRecordData = {
                patient: "345",
                responsable: staffData.licenseNumber,
                registerType: "Hospital Admission",
                startDate: new Date(2026, 1, 1),
                endDate: new Date(2026, 1, 15),
                motive: "Patient admitted for severe headache and dizziness",
                diagnosis: "Headache",
                medicineList: [
                    { medicine: medicineData.nationalID , quantity: 2, posology: "Take 500mg every 6 hours" },
                    { medicine: medicineData2.nationalID, quantity: 1, posology: "Take 200mg every 8 hours" }
                ],
                registerState: "active"
            };

            await request(app)
                .post("/records")
                .send(invalidRecordData)
                .expect(404);
        });

        test("Deberia dar error si no hay body", async () => {
            await request(app)
                .post("/records")
                .expect(400);
        });

        test("Deberia dar error 500 ", async () => {
            await mongoose.connection.close();

            await request(app)
                .post("/records")
                .send({
                    patient: patientData.id,
                    responsable: staffData.licenseNumber,
                    registerType: "Hospital Admission",
                    startDate: new Date(2026, 1, 1),
                    endDate: new Date(2026, 1, 15),
                    motive: "Patient admitted for severe headache and dizziness",
                    diagnosis: "Headache",
                    medicineList: [
                        { medicine: medicineData.nationalID , quantity: 2, posology: "Take 500mg every 6 hours" },
                        { medicine: medicineData2.nationalID, quantity: 1, posology: "Take 200mg every 8 hours" }
                    ],
                    registerState: "active"
                })
                .expect(500);

            await mongoose.connect("mongodb://localhost:27017/hospital-app");
        });

        test ("Deberia dar error si el responsable no existe", async () => {
            await request(app)
                .post("/records")
                .send({
                    patient: patientData.id,
                    responsable: "444444",
                    registerType: "Hospital Admission",
                    startDate: new Date(2026, 1, 1),
                    endDate: new Date(2026, 1, 15),
                    motive: "Patient admitted for severe headache and dizziness",
                    diagnosis: "Headache",
                    medicineList: [
                        { medicine: medicineData.nationalID , quantity: 2, posology: "Take 500mg every 6 hours" },
                        { medicine: medicineData2.nationalID, quantity: 1, posology: "Take 200mg every 8 hours" }
                    ],
                    registerState: "active"
                })
                .expect(404);
        });

        test ("Deberia dar error 404 si una de las medicinas del registro no existe", async () => {
            await Medicine.deleteMany({});

            await request(app)
                .post("/records")
                .send({
                    patient: patientData.id,
                    responsable: staffData.licenseNumber,
                    registerType: "Hospital Admission",
                    startDate: new Date(2026, 1, 1),
                    endDate: new Date(2026, 1, 15),
                    motive: "Patient admitted for severe headache and dizziness",
                    diagnosis: "Headache",
                    medicineList: [
                        { medicine: medicineData.nationalID , quantity: 2, posology: "Take 500mg every 6 hours" },
                        { medicine: medicineData2.nationalID, quantity: 1, posology: "Take 200mg every 8 hours" }
                    ],
                    registerState: "active"
                })
                .expect(400);  
        });

        test("Deberia dar error 400 si el stock de una de las medicinas no es suficiente", async () => {
            await request(app)
                .post("/records")
                .send({
                    patient: patientData.id,
                    responsable: staffData.licenseNumber,
                    registerType: "Hospital Admission",
                    startDate: new Date(2026, 1, 1),
                    endDate: new Date(2026, 1, 15),
                    motive: "Patient admitted for severe headache and dizziness",
                    diagnosis: "Headache",
                    medicineList: [
                        { medicine: medicineData.nationalID , quantity: 200, posology: "Take 500mg every 6 hours" },
                        { medicine: medicineData2.nationalID, quantity: 1, posology: "Take 200mg every 8 hours" }
                    ],
                    registerState: "active"
                })
                .expect(400);
        });
    });

    describe("GET /records/:id", () => {
        test("Deberia obtener la consulta con el id", async () => {
            const response = await request(app)
                .get(`/records/${recordID}`)
                .expect(200);
            expect(response.body).toHaveProperty("_id", recordID);
        });

        test("Deberia dar error si el id no existe", async () => {
            await request(app)
                .get("/records/69f4f553fcd85dd7d524d54b")
                .expect(404);
        });

        test("Deberia dar error 500 si se apaga la base de datos", async () => {
            await mongoose.connection.close();

            await request(app)
                .get(`/records/${recordID}`)
                .expect(500);

            await mongoose.connect("mongodb://localhost:27017/hospital-app");
        });
    });

    describe("GET /records?patientId=...", () => {
        test("Deberia obtener las consultas del paciente", async () => {
            await request(app)
                .get(`/records?patientId=${patientData.id}`)
                .expect(200);
        });

        test ("Deberia dar error si el paciente no existe", async () => {
            await request(app)
                .get("/records?patientId=345")
                .expect(404);
        });

        test("Deberia dar error 500 si se apaga la base de datos", async () => {
            await mongoose.connection.close();

            await request(app)
                .get(`/records?patientId=${patientData.id}`)
                .expect(500);

            await mongoose.connect("mongodb://localhost:27017/hospital-app");
        });

        test("Deberia dar error si no se le introduce el id del paciente", async () => {
            await request(app)
                .get("/records")
                .expect(400);
        });
    });

    describe("GET /records?startDate=...&endDate=...&registerType=...", () => {
        test("Deberia obtener las consultas del rango de fechas y tipo de registro", async () => {
            const startDate = new Date(2026, 0, 1).toISOString();
            const endDate = new Date(2026, 11, 31).toISOString();
            const response = await request(app)
                .get(`/records/filter?startDate=${startDate}&endDate=${endDate}&registerType=Hospital Admission`)
                .expect(200);
        });

        test("Debe dar error 500 si se apaga la base de datos", async () => {
            await mongoose.connection.close();

            const startDate = new Date(2026, 0, 1).toISOString();
            const endDate = new Date(2026, 11, 31).toISOString();
            await request(app)
                .get(`/records/filter?startDate=${startDate}&endDate=${endDate}&registerType=Hospital Admission`)
                .expect(500);

            await mongoose.connect("mongodb://localhost:27017/hospital-app");
         });

         test("Debe dar error 500 si se apaga la base de datos", async () => {
            await mongoose.connection.close();

            const startDate = new Date(2026, 0, 1).toISOString();
            const endDate = new Date(2026, 11, 31).toISOString();
            await request(app)
                .get(`/records/filter?startDate=${startDate}&endDate=${endDate}`)
                .expect(500);

            await mongoose.connect("mongodb://localhost:27017/hospital-app");
         });

         test("Debe dar error si no se le introduce el rango de fechas", async () => {
            await request(app)
                .get("/records/filter")
                .expect(400);   
        });
    });

    describe("DELETE /records/:id", () => {
        test("Deberia eliminar la consulta con el id", async () => {
            await request(app)
                .delete(`/records/${recordID}`)
                .expect(200);
        });

        test("Deberia dar error si el id no existe", async () => {
            await request(app)
                .delete("/records/69f4f553fcd85dd7d524d54b")
                .expect(404);
        });

        test("Deberia dar error 500 si se apaga la base de datos", async () => {
            await mongoose.connection.close();

            await request(app)
                .delete(`/records/${recordID}`)
                .expect(500);

            await mongoose.connect("mongodb://localhost:27017/hospital-app");
        });

        test("Deberia dar error 404 si una de las medicinas del registro ya no existe", async () => {
            await Medicine.deleteMany({});

            const response = await request(app)
                .delete(`/records/${recordID}`)
                .expect(404);

            expect(response.body.error).toBe("Medicine not found");
        });
    });

    describe("DELETE /records?id=...", () => {
        test("Deberia eliminar las consultas ", async () => {
            await request(app)
                .delete(`/records?id=${recordID}`)
                .expect(200);
        });

        test("Deberia dar error si la consulta no existe", async () => {
            await request(app)
                .delete("/records?id=69f4f553fcd85dd7d524d54b")
                .expect(404);
        });

        test("Deberia dar error 500 si se apaga la base de datos", async () => {
            await mongoose.connection.close();

            await request(app)
                .delete(`/records?id=${recordID}`)
                .expect(500);

            await mongoose.connect("mongodb://localhost:27017/hospital-app");
        });

        test("Deberia dar error 404 si una de las medicinas del registro ya no existe", async () => {
            await Medicine.deleteMany({});

            const response = await request(app)
                .delete(`/records?id=${recordID}`)
                .expect(404);

            expect(response.body.error).toBe("medicine not found");
        });

        test("Deberia dar error si no se le introduce ningun id", async () => {
            await request(app)
                .delete("/records")
                .expect(400);
        });
    });

    describe('PATCH /records/:id', () => {

        test('Debe devolver 404 si el ID del registro no existe', async () => {
            const fakeId = '60d5ecb54372092f6c99c6e3';
            const res = await request(app)
                .patch(`/records/${fakeId}`)
                .send({ motive: 'Cambio de motivo' })
                .expect(404);
    
            if (res.status !== 404) throw new Error('Debería haber fallado con 404');
            if (res.body.error !== 'Record not found') throw new Error('Mensaje de error incorrecto');
        });
    
        test('Debe devolver 400 si se intenta modificar un campo no permitido (ej: totalImport)', async () => {
            const res = await request(app)
                .patch(`/records/${recordID}`)
                .send({ totalImport: 0 }) 
                .expect(400)
    
            if (res.status !== 400) throw new Error('Debería haber devuelto 400');
            if (!res.body.error.includes('Only the following fields can be updated')) {
                throw new Error('No se ha notificado correctamente la restricción de campos');
            }
        });

        test('Debe permitir actualizar campos simples sin tocar la lista de medicinas', async () => {
            const res = await request(app)
                .patch(`/records/${recordID}`)
                .send({ diagnosis: 'Cefalea tensional' })
                .expect(200);

            expect(res.body.diagnosis).toBe('Cefalea tensional');
            
            // El stock no debería haber cambiado (med1 sigue en 100)
            const med1 = await Medicine.findOne({ nationalID: medicineData.nationalID });
            expect(med1?.stock).toBe(100);
        });

        test("Debe dar error 404 si se intenta actualizar el registro con una medicina que no existe", async () => {
            await Medicine.deleteMany({});

            const res = await request(app)
                .patch(`/records/${recordID}`)
                .send({ 
                    medicineList: [
                        { medicine: medicineData.nationalID , quantity: 2, posology: "Take 500mg every 6 hours" },
                        { medicine: medicineData2.nationalID, quantity: 1, posology: "Take 200mg every 8 hours" }
                    ]
                })
                .expect(404);
        });

        test("Debe dar internal server error si se apaga la base de datos", async () => {
            await mongoose.connection.close();

            await request(app)
                .patch(`/records/${recordID}`)
                .send({ diagnosis: 'Cefalea tensional' })
                .expect(500);

            await mongoose.connect("mongodb://localhost:27017/hospital-app");
         });

         test("Debe dar bien", async () => {
            await request(app)
                .patch(`/records/${recordID}`)
                .send({ 
                    medicineList: [
                        { medicine: medicineData.nationalID , quantity: 2, posology: "Take 500mg every 6 hours" },
                        { medicine: medicineData2.nationalID, quantity: 1, posology: "Take 200mg every 8 hours" }
                    ]
                })
                .expect(200);
        });
    });
});
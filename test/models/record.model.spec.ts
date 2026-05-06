import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import { Patient } from "../../src/models/patient.model.js";
import { Staff } from "../../src/models/staff.model.js";
import { Medicine } from "../../src/models/medicine.model.js";
import { Record } from "../../src/models/record.model.js";
import moongose, {Types} from "mongoose";

describe("Record Model", () => {
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

    test("should give an error if required fields are missing", async () => {
        const incompleteRecordData = {
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
        try {
            const record = new Record(incompleteRecordData);
            await record.save();
        } catch (error: any | string) {
            expect(error.message).toContain("patient` is required");
        }
    });

    test("Deberia dar error si la fecha de fin es anterior a la fecha de inicio", async () => {
        const incompleteRecordData = {
            responsable: staffData.licenseNumber,
            registerType: "Hospital Admission",
            startDate: new Date(2026, 1, 15),
            endDate: new Date(2026, 1, 1),
            motive: "Patient admitted for severe headache and dizziness",
            diagnosis: "Headache",
            medicineList: [
                { medicine: medicineData.nationalID , quantity: 2, posology: "Take 500mg every 6 hours" },
                { medicine: medicineData2.nationalID, quantity: 1, posology: "Take 200mg every 8 hours" }
            ],
            registerState: "active"
        };
        try {
            const record = new Record(incompleteRecordData);
            await record.save();
        } catch (error: any | string) {
            expect(error.message).toContain("The end date must be greater than the start date.");
        }
    });

    test("Deberia dar error si la cantidad de un medicamente hay una cantidad negativa", async () => {
        const incompleteRecordData = {
            responsable: staffData.licenseNumber,
            registerType: "Hospital Admission",
            startDate: new Date(2026, 1, 15),
            endDate: new Date(2026, 1, 1),
            motive: "Patient admitted for severe headache and dizziness",
            diagnosis: "Headache",
            medicineList: [
                { medicine: medicineData.nationalID , quantity: -22, posology: "Take 500mg every 6 hours" },
                { medicine: medicineData2.nationalID, quantity: 1, posology: "Take 200mg every 8 hours" }
            ],
            registerState: "active"
        };
        try {
            const record = new Record(incompleteRecordData);
            await record.save();
        } catch (error: any | string) {
            expect(error.message).toContain("endDate: The end date must be greater than the start date.");
        }
    });
});
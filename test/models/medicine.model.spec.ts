import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import { Medicine } from "../../src/models/medicine.model.js";
import mongoose from "mongoose";

describe("Medicine Model", () => {
    test("Should return an error if name is less than 3 characters", async () => {
        const medicineData = new Medicine({
            name: "Pa",
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
        });
        try {
            await medicineData.save();
        } catch (error: any | string) {
            expect(error.message).toContain("Name must be at least 3 characters long");
        }
    });

    test("Should return an error if price is negative", async () => {
        const medicineData = new Medicine({
            name: "Paracetamol",
            activeIngredient: "Paracetamol",
            nationalID: "1234567890",
            type: "capsule",
            dosage: 500,
            mesureUnit: "mg",
            ingestionMethod: "oral",
            stock: 100,
            price: -5.99,
            prescriptionRequired: false,
            expirationDate: new Date("2025-12-31"),
            contraindications: ["Liver disease", "Allergy to paracetamol"]
        });
        try {
            await medicineData.save();
        } catch (error: any | string) {
            expect(error.message).toContain("Price must be a positive number");
        }

    });

    test("Should return an error if activeIngredient is less than 3 characters", async () => {
        const medicineData = new Medicine({
            name: "Paracetamol",
            activeIngredient: "Pa",
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
        });
        try {
            await medicineData.save();
        } catch (error: any | string) {
            expect(error.message).toContain("Active ingredient must be at least 3 characters long");
        }
    });
});
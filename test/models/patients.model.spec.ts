import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import { Patient } from "../../src/models/patient.model.js";
import moongose from "mongoose";

describe("Patient Model", () => {

    test("should give an error if required fields are missing", async () => {
        const patient = new Patient({
            name: "Ana Gómez",
            birthDate: "1986-07-20",
            age: 37,
            id: "87654321X",
            gender: "female",
            contactInformation: [{
                address: "Calle ",
                contactNumber: "+34600112233",
                email: "juanperez@gmail.com"
            }],
            alergies: ["Polen", "Penicilina"],
            bloodType: "O+",
            status: "active"
        });
        try {
            await patient.save();
        } catch (error: string | any) {
            expect(error.errors).toHaveProperty("socialSecurityNumber");
        }
    });

    test ("Should return an error if id is less than 9 characters", async () => {
        const patient = new Patient({
            name: "Ana Gómez",
            birthDate: "1986-07-20",
            age: 37,
            id: "8765432",
            gender: "female",
            contactInformation: [{
                address: "Calle ",
                contactNumber: "+34600112233",
                email: "juanperez@gmail.com"
            }],
            alergies: ["Polen", "Penicilina"],
            bloodType: "O+",
            status: "active"
        });
        try {
            await patient.save();
        } catch (error: string | any) {
            expect(error.errors.id.properties.message).toEqual("ID must be at least 9 characters long");
        }
    });

    test("Should return an error if socialSecurityNumber is less than 12 characters", async () => {
        const patient = new Patient({
            name: "Ana Gómez",
            birthDate: "1986-07-20",
            age: 37,
            id: "87654321X",
            socialSecurityNumber: "1234567890",
            gender: "female",
            contactInformation: [{
                address: "Calle ",
                contactNumber: "+34600112233",
                email: "anagomez@gmail.com"
            }],
            alergies: ["Polen", "Penicilina"],
            bloodType: "O+",
            status: "active"
        });
        try {
            await patient.save();
        } catch (error: string | any) {
            expect(error.errors.socialSecurityNumber.properties.message).toEqual("Social Security Number must be exactly 12 characters long");
        }
    });

    test ("Should return an error if birthDate is not a valid date", async () => {
        const patient = new Patient({
            name: "Ana Gómez",
            birthDate: "2027-07-20",
            age: 37,
            id: "87654321X",
            socialSecurityNumber: "123456789023",
            gender: "female",
            contactInformation: [{
                address: "Calle ",
                contactNumber: "+34600112233",
                email: "anagomez@gmail.com"
            }],
            alergies: ["Polen", "Penicilina"],
            bloodType: "O+",
            status: "active"
        });
        try {
            await patient.save();
        } catch (error: string | any) {
            expect(error.message).toEqual("Birth date cannot be in the future");
        }
    });

});
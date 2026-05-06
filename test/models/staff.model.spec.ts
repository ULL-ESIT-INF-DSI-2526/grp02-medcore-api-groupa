import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import { Staff } from "../../src/models/staff.model.js";
import moongose from "mongoose";

describe ("Staff Model", () => {
    test("Should return an error if experience is negative", async () => {
        const staffData = new Staff({
            name: "Jonas Almeida",
            licenseNumber: 123456,
            medicalSpeciality: 'Cardiology',
            title: 'Attending Physician',
            workShift: "morning",
            consultingRoom: 'A64',
            experience: -10,
            contact: "+34600112233",
            state: true
        });
        try {
            await staffData.save();
        } catch (error: any | string) {
            expect(error.message).toContain("Years of experience cannot be a negative number");
        }
    });
});

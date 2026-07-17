"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRentalStatusSchema = exports.createRentalSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.createRentalSchema = zod_1.z.object({
    body: zod_1.z.object({
        gearItemId: zod_1.z.string().cuid(),
        quantity: zod_1.z.number().int().positive(),
        startDate: zod_1.z.coerce.date(),
        endDate: zod_1.z.coerce.date(),
    }),
});
exports.updateRentalStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.RentalStatus),
    }),
});

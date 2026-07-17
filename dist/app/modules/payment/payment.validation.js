"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSchema = void 0;
const zod_1 = require("zod");
exports.createCheckoutSchema = zod_1.z.object({
    body: zod_1.z.object({
        rentalOrderId: zod_1.z.string().cuid(),
    }),
});

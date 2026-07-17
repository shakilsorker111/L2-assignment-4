"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const _1 = __importDefault(require("."));
const stripe = new stripe_1.default(_1.default.stripe_secret_key, {
    apiVersion: "2026-06-24.dahlia",
});
exports.default = stripe;

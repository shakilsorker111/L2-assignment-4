"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const generateToken = (payload, expiresIn) => {
    return jsonwebtoken_1.default.sign(payload, config_1.default.jwt_secret, {
        expiresIn: (expiresIn || config_1.default.jwt_expires_in),
    });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret);
};
exports.verifyToken = verifyToken;

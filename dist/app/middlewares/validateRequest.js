"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateRequest = (schema) => (req, res, next) => {
    const result = schema.safeParse({
        body: req.body,
    });
    if (!result.success) {
        return next(result.error);
    }
    req.body = result.data.body;
    next();
};
exports.default = validateRequest;

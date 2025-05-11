const Joi = require('joi');

// Signup Validation for Tailor
const signupTailorValidation = (req, res, next) => {
    const schema = Joi.object({
        accountType: Joi.string().valid('Tailor').required(),
        fullName: Joi.string().min(3).max(100).required(),
        businessName: Joi.string().allow(null).empty(''),  // Tailor must have a business name
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(100).required(),
        confirmPassword: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        specialization: Joi.string().required(),  // Tailor specialization
        location: Joi.string().allow(null).empty(''),
        experience: Joi.string().required(),
        termsAccepted: Joi.boolean().valid(true).required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: "Bad request",
            error: error.details
        });
    }
    next();
};

// Signup Validation for Customer
const signupCustomerValidation = (req, res, next) => {
    const schema = Joi.object({
        accountType: Joi.string().valid('Customer').required(),
        fullName: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(100).required(),
        confirmPassword: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        termsAccepted: Joi.boolean().valid(true).required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: "Bad request",
            error: error.details
        });
    }
    next();
};

// Login Validation (For both Tailor and Customer)
const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(100).required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: "Bad request",
            error: error.details
        });
    }
    next();
};

module.exports = {
    signupTailorValidation,
    signupCustomerValidation,
    loginValidation
};

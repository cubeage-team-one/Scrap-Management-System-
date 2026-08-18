import Joi from "joi";

/**
 * Common validation schemas
 */

// UUID
const uuid = Joi.string()
  .guid({
    version: ["uuidv4", "uuidv5"],
  })
  .messages({
    "string.guid": "{{#label}} must be a valid UUID",
    "string.empty": "{{#label}} is required",
    "any.required": "{{#label}} is required",
  });

// Required string
const requiredString = Joi.string()
  .trim()
  .required()
  .messages({
    "string.empty": "{{#label}} is required",
    "any.required": "{{#label}} is required",
    "string.base": "{{#label}} must be a string",
  });

// Optional string
const optionalString = Joi.string()
  .trim()
  .allow("", null)
  .messages({
    "string.base": "{{#label}} must be a string",
  });

// Positive number
const positiveNumber = Joi.number()
  .greater(0)
  .required()
  .messages({
    "number.base": "{{#label}} must be a number",
    "number.greater": "{{#label}} must be greater than 0",
    "any.required": "{{#label}} is required",
  });

// Optional positive number
const optionalPositiveNumber = Joi.number()
  .greater(0)
  .optional()
  .messages({
    "number.base": "{{#label}} must be a number",
    "number.greater": "{{#label}} must be greater than 0",
  });

// Email
const email = Joi.string()
  .trim()
  .email()
  .required()
  .messages({
    "string.email": "{{#label}} must be a valid email",
    "string.empty": "{{#label}} is required",
    "any.required": "{{#label}} is required",
  });

/**
 * Validate data against a Joi schema
 */
const validate = (schema, data) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    return {
      isValid: false,
      errors: error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      })),
      value: null,
    };
  }

  return {
    isValid: true,
    errors: [],
    value,
  };
};

/**
 * Scrap validations
 */

const createScrapSchema = Joi.object({
  categoryId: uuid.required(),

  quantity: positiveNumber,

  description: optionalString,

  condition: optionalString,

  locationLabel: optionalString,
});

const updateScrapSchema = Joi.object({
  categoryId: uuid.optional(),

  quantity: optionalPositiveNumber,

  description: optionalString.optional(),

  condition: optionalString.optional(),

  locationLabel: optionalString.optional(),
}).min(1);

/**
 * Validate Scrap create request
 */
const validateCreateScrap = (data) => {
  return validate(createScrapSchema, data);
};

/**
 * Validate Scrap update request
 */
const validateUpdateScrap = (data) => {
  return validate(updateScrapSchema, data);
};

/**
 * Validate Scrap ID
 */
const validateScrapId = (data) => {
  const schema = Joi.object({
    id: uuid.required(),
  });

  return validate(schema, data);
};

export {
  validate,

  uuid,
  requiredString,
  optionalString,
  positiveNumber,
  optionalPositiveNumber,
  email,

  validateCreateScrap,
  validateUpdateScrap,
  validateScrapId,
};
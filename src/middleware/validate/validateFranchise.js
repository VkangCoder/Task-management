const { BadRequestError } = require("../../core/error.response"); // Giả sử đây là đường dẫn đến file của bạn
const Joi = require("joi");

const validateFranchisePost = (req, res, next) => {
  const postSchema = Joi.object({
    user_id: Joi.number().integer().required().messages({
      "number.base": `"User ID" must be a number.`,
      "number.integer": `"User ID" must be an integer.`,
      "any.required": `"User ID" is a required field.`,
    }),
    name: Joi.string().required().messages({
      "string.base": `"Name" must be a string.`,
      "any.required": `"Name" is a required field.`,
    }),
    address: Joi.string().required().messages({
      "string.base": `"Address" must be a string.`,
      "any.required": `"Address" is a required field.`,
    }),
    phone_number: Joi.string().required().messages({
      "string.base": `"Phone Number" must be a string.`,
      "any.required": `"Phone Number" is a required field.`,
    }),

    status: Joi.boolean().required().messages({
      "boolean.base": `"Status" must be true or false.`,
      "any.required": `"Status" is a required field.`,
    }),
  });

  const { error } = postSchema.validate(req.body);
  if (error) {
    throw new BadRequestError(error.details[0].message);
  }
  next();
};
const validateFranchisePut = (req, res, next) => {
  const putSchema = Joi.object({
    id: Joi.number().integer().required().messages({
      "number.base": `"ID" must be a number.`,
      "number.integer": `"ID" must be an integer.`,
      "any.required": `"ID" is a required field.`,
    }),
    user_id: Joi.number().integer().optional().messages({
      "number.base": `"User ID" must be a number.`,
      "number.integer": `"User ID" must be an integer.`,
    }),
    floor_id: Joi.number().integer().optional().messages({
      "number.base": `"Floor ID" must be a number.`,
      "number.integer": `"Floor ID" must be an integer.`,
    }),
    name: Joi.string().optional().messages({
      "string.base": `"Name" must be a string.`,
    }),
    address: Joi.string().optional().messages({
      "string.base": `"Address" must be a string.`,
    }),
    phone_number: Joi.string().optional().messages({
      "string.base": `"Phone Number" must be a string.`,
    }),

    status: Joi.boolean().required().messages({
      "boolean.base": `"Status" must be true or false.`,
      "any.required": `"Status" is a required field.`,
    }),
  });

  const { error } = putSchema.validate(req.body);
  if (error) {
    throw new BadRequestError(error.details[0].message);
  }
  next();
};

module.exports = { validateFranchisePost, validateFranchisePut };

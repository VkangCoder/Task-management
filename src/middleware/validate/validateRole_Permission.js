const { BadRequestError } = require("../../core/error.response"); // Giả sử đây là đường dẫn đến file của bạn
const Joi = require("joi");

const validateRolePermissionsPost = (req, res, next) => {
  const postSchema = Joi.object({
    role_id: Joi.number().integer().required().messages({
      "number.base": `"Role ID" must be a number.`,
      "number.integer": `"Role ID" must be an integer.`,
      "any.required": `"Role ID" is a required field.`,
    }),
    name: Joi.string().required().messages({
      "string.base": `"Name" must be a string.`,
      "any.required": `"Name" is a required field.`,
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
const validateRolePermissionsPut = (req, res, next) => {
  const putSchema = Joi.object({
    id: Joi.number().integer().required().messages({
      "number.base": `"ID" must be a number.`,
      "number.integer": `"ID" must be an integer.`,
      "any.required": `"ID" is a required field.`,
    }),
    role_id: Joi.number().integer().optional().messages({
      "number.base": `"Role ID" must be a number.`,
      "number.integer": `"Role ID" must be an integer.`,
    }),
    name: Joi.string().optional().messages({
      "string.base": `"Name" must be a string.`,
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
module.exports = {
  validateRolePermissionsPost,
  validateRolePermissionsPut,
};

const { BadRequestError } = require("../../core/error.response"); // Giả sử đây là đường dẫn đến file của bạn
const Joi = require("joi");

const validateMenuRolePost = (req, res, next) => {
  const postSchema = Joi.object({
    role_permissions_id: Joi.number().integer().required().messages({
      "number.base": `"Role Permissions ID" must be a number.`,
      "number.integer": `"Role Permissions ID" must be an integer.`,
      "any.required": `"Role Permissions ID" is a required field.`,
    }),
    function_url: Joi.string().required().messages({
      "string.base": `"Function URL" must be a string.`,
      "any.required": `"Function URL" is a required field.`,
    }),
    function_name: Joi.string().required().messages({
      "string.base": `"Function Name" must be a string.`,
      "any.required": `"Function Name" is a required field.`,
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

const validateMenuRolePut = (req, res, next) => {
  const putSchema = Joi.object({
    id: Joi.number().integer().required().messages({
      "number.base": `"ID" must be a number.`,
      "number.integer": `"ID" must be an integer.`,
      "any.required": `"ID" is a required field.`,
    }),
    role_permissions_id: Joi.number().integer().optional().messages({
      "number.base": `"Role Permissions ID" must be a number.`,
      "number.integer": `"Role Permissions ID" must be an integer.`,
    }),
    function_url: Joi.string().optional().messages({
      "string.base": `"Function URL" must be a string.`,
    }),
    function_name: Joi.string().optional().messages({
      "string.base": `"Function Name" must be a string.`,
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
  validateMenuRolePost,
  validateMenuRolePut,
};

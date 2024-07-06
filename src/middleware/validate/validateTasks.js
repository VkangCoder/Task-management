const Joi = require("joi");

const { BadRequestError } = require("../../core/error.response"); // Giả sử đây là đường dẫn đến file của bạn

// Định nghĩa schema để validate
const  validateTaskPost= Joi.object({
  title: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .pattern(new RegExp("@gmail.com"))
    .required()
    .lowercase()
    .messages({
      "string.pattern.base": `"username" must be a valid Gmail address (example@gmail.com)`,
    }),
  // password: Joi.string().min(4).max(32).required,
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(6)
    .max(30)
    .required()
    .messages({
      "string.pattern.base": `"password" must be 6-30 characters long and contain only alphanumeric characters`,
    }),
  franchies_id: Joi.number().integer,
});

// Middleware để validate request body
function validateUserRegistration(req, res, next) {
  const { error } = userRegistrationSchema.validate(req.body);

  if (error) {
    // Nếu có lỗi, trả về lỗi và không tiếp tục xử lý
    throw new BadRequestError(error.details[0].message);
  }

  // Nếu dữ liệu hợp lệ, chuyển tiếp tới handler tiếp theo
  next();
}
const userLoginSchema = Joi.object({
  email: Joi.string()
    .email()
    .pattern(new RegExp("@gmail.com$"))
    .required()
    .lowercase()
    .messages({
      "string.email": `"email" must be a valid email address`,
      "string.pattern.base": `"email" must be a Gmail address (example@gmail.com)`,
      "any.required": `"email" is a required field`,
    }),
  password: Joi.string().min(6).max(30).required().messages({
    "string.min": `"password" must be at least {#limit} characters long`,
    "string.max": `"password" cannot be longer than {#limit} characters`,
    "any.required": `"password" is a required field`,
  }),
});

// Middleware để validate request body cho đăng nhập
function validateUserLogin(req, res, next) {
  const { error } = userLoginSchema.validate(req.body);

  if (error) {
    // Nếu có lỗi, tạo và gửi BadRequestError
    const badRequestError = new BadRequestError(error.details[0].message);
    // Giả sử bạn có một cơ chế để xử lý và trả về lỗi cho client
    return res.status(badRequestError.status).json({
      status: "error",
      code: badRequestError.status,
      message: badRequestError.message,
    });
  }

  // Nếu dữ liệu hợp lệ, chuyển tiếp tới handler tiếp theo
  next();
}
module.exports = { validateUserLogin, validateUserRegistration };

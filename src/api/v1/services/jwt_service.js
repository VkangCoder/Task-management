const JWT = require("jsonwebtoken");

const client = require("../../../helpers/connect_redis");
const { UnauthorizedError } = require("../../../core/error.response");
const SignAccessToken = (userId, roleID) => {
  return new Promise((resolve, reject) => {
    const payload = { userId, roleID };
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = { expiresIn: "24h" };

    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};
const signRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = { userId: userId.toString() };
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const option = { expiresIn: "1y" };
    JWT.sign(payload, secret, option, (err, token) => {
      if (err) {
        reject(err);
      }
      client.set(
        userId.toString(),
        token,
        "EX",
        365 * 24 * 60 * 60,
        (err, reply) => {
          if (err) {
            reject(createError.InternalServerError());
            return;
          }
        }
      );
      resolve(token);
    });
  });
};
const verifyAccessToken = (req, res, next) => {
  if (!req.body) {
    return next(createError.Unauthorized());
  }
  const authHeader = req.headers.authorization;

  const token = authHeader;
  //
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      throw new UnauthorizedError();
    }
    req.payload = payload;
    next();
  });
};
const verifyRefreshToken = async (refreshToken) => {
  // console.log("are verifyinggg");
  try {
    // Sử dụng Promise để xử lý việc kiểm tra refreshToken
    const payload = await new Promise((resolve, reject) => {
      // Sử dụng JWT để xác minh refreshToken
      JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, payload) => {
          if (err) {
            // Nếu có lỗi trong quá trình xác minh, từ chối Promise với lỗi InternalServerError
            return reject(createError.InternalServerError());
          }
          // console.log(payload); // Log payload để debug
          try {
            // Truy xuất refreshToken từ Redis dựa trên userId từ payload
            const reply = await client.get(payload.userId);
            if (refreshToken === reply) {
              // Nếu refreshToken khớp, giải quyết Promise với payload
              resolve(payload);
            } else {
              // Nếu không khớp, từ chối Promise với lỗi Unauthorized
              reject(createError.Unauthorized());
            }
          } catch (error) {
            // Bắt lỗi khi truy xuất từ Redis và từ chối Promise với lỗi InternalServerError
            reject(createError.InternalServerError());
          }
        }
      );
    });
    // Trả về payload sau khi Promise được giải quyết thành công
    return payload;
  } catch (error) {
    // Bắt và log lỗi từ quá trình xác minh
    console.log("Error:", error);
    // Rethrow lỗi để xử lý ở cấp cao hơn
    throw error;
  }
};

module.exports = {
  SignAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};

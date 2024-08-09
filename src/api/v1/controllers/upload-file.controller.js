const { BadRequestError } = require("../../../core/error.response.js");
const { OK, CREATED } = require("../../../core/success.response.js");

const {
  uploadImageFromUrl,
  uploadImageFromLocal,
} = require("../services/upload.service.js");
module.exports = {
  uploadFileController: async (req, res, next) => {
    new CREATED({
      message: "Upload File Succesful! : ",
      metadata: await uploadImageFromUrl(),
    }).send(res);
  },
  uploadFileFromLocalController: async (req, res, next) => {
    const UserId = req.payload.userId;
    const file = req.file;
    if (!file) {
      throw new BadRequestError("File is missing");
    }
    console.log(req.file);
    try {
      const metadata = await uploadImageFromLocal(file.path, UserId);
      if (!metadata || Object.keys(metadata).length === 0) {
        throw new BadRequestError("Failed to upload the file");
      }
      res.status(201).send({
        message: "Upload File Successful!",
        metadata: metadata,
      });
    } catch (error) {
      next(error); // Handle the error, such as logging or sending an error response
    }
  },
};

"use strict";
const { OK, CREATED } = require("../../../core/success.response.js");
const { createComment } = require("../services/comment_service.js");

class comment_controller {
  createComment = async (req, res, next) => {
    const userId = req.payload.userId;
    new CREATED({
      message: "create succesful",
      metadata: await createComment(req.body, userId),
    }).send(res);
  };
}
module.exports = new comment_controller();

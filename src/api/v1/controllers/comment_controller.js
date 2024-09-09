"use strict";
const { OK, CREATED } = require("../../../core/success.response.js");
const {
  createComment,
  getAllCommentsByTaskID,
} = require("../services/comment_service.js");

class comment_controller {
  createComment = async (req, res, next) => {
    const userId = req.payload.userId;
    new CREATED({
      message: "create succesful",
      metadata: await createComment(req.body, userId),
    }).send(res);
  };
  getListCommentsByTaskId = async (req, res, next) => {
    new CREATED({
      message: "create succesful",
      metadata: await getAllCommentsByTaskID(req.query),
    }).send(res);
  };
}
module.exports = new comment_controller();

"use strict";
const { OK, CREATED } = require("../../../core/success.response.js");
const {
  createComment,
  getCommentsByParentId,
  deleteComments,
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
    new OK({
      message: "get List succesful",
      metadata: await getCommentsByParentId(req.query),
    }).send(res);
  };
  deleteComment = async (req, res, next) => {
    new OK({
      message: "delete succesful",
      metadata: await deleteComments(req.body),
    }).send(res);
  };
}
module.exports = new comment_controller();

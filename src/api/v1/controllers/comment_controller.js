const { OK, CREATED } = require("../../../core/success.response.js");
const {
  getAllCommentsService,
  createCommentsService,
} = require("../services/comment_service.js");

module.exports = {
  getAllCommentsController: async (req, res, next) => {
    new OK({
      message: "Get All Comments Succesful! : ",
      metadata: await getAllCommentsService(req.query),
    }).send(res);
  },
  //   getAllCommentsByUserIdController: async (req, res, next) => {
  //     const UserId = req.payload.userId;
  //     new OK({
  //       message: "Get All Comments Succesful! : ",
  //       metadata: await getAllCommentsServiceByUserId(req.query, UserId),
  //     }).send(res);
  //   },
  createCommentController: async (req, res, next) => {
    const UserId = req.payload.userId;

    new CREATED({
      message: "Create  Comments Succesful! : ",
      metadata: await createCommentsService(req.body, UserId),
    }).send(res);
  },
};

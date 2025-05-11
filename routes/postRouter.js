const { Router } = require("express");
const postRouter = Router();
const postsController = require("../controllers/postsController")

postRouter.get("/", postsController.getAllMessages);
postRouter.post("/create", postsController.createPost)

module.exports = postRouter;
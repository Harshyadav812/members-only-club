const db = require("../db/queries");

async function getAllMessages(req, res) {
  // const isMember = req.user.is_member;
  const posts = await db.getAllMessages();
  res.render("posts", {
    user: req.user,
    posts
  })
}

async function createPost(req, res) {
  const id = req.user.id;
  const { title, content } = req.body;
  await db.createPost(id, title, content);
  res.redirect("/posts")
}

module.exports = { getAllMessages, createPost };
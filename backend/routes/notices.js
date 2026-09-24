const express = require("express");
const store = require("../data/store");
const { authRequired, requireRole } = require("../middleware/auth");

// Roles allowed to publish. Remove "student" here if students should only read.
const POST_ROLES = ["student", "office_staff", "industry", "moderator"];

module.exports = function noticesRouteFactory(io) {
  const router = express.Router();

  router.get("/", (req, res) => res.json(store.getNotices()));

  router.post("/", authRequired, requireRole(...POST_ROLES), (req, res) => {
    const title = String(req.body?.title ?? "").trim();
    const content = String(req.body?.content ?? "").trim();
    if (!title || !content) return res.status(400).json({ error: "Title and details are required" });
    if (title.length > 150 || content.length > 3000) {
      return res.status(400).json({ error: "Title or details too long" });
    }

    // author/role come from the verified token, never from the request body
    const notice = store.addNotice({ author: req.user.name, role: req.user.role, title, content });
    io.emit("NOTICES_UPDATE", store.getNotices());
    res.status(201).json(notice);
  });

  return router;
};

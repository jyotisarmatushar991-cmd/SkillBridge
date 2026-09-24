const express = require("express");
const store = require("../data/store");
const { authRequired, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(authRequired, requireRole("moderator")); // user management is moderator-only

router.get("/", (req, res) => res.json(store.getUsers()));

router.delete("/:id", (req, res) => {
  if (String(req.params.id) === String(req.user.id)) {
    return res.status(400).json({ error: "You cannot delete your own account" });
  }
  if (!store.deleteUser(req.params.id)) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ users: store.getUsers() });
});

module.exports = router;

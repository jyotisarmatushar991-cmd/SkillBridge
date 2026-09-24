const express = require("express");
const bcrypt = require("bcryptjs");
const store = require("../data/store");
const rateLimit = require("../middleware/rateLimit");
const { signToken, authRequired } = require("../middleware/auth");

const router = express.Router();

router.post("/login", rateLimit({ max: 10 }), async (req, res, next) => {
  try {
    const { email, password, role } = req.body || {};
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = store.findUserByEmail(email.trim());
    // Same message for every failure so attackers can't tell which part was wrong
    const ok = user && (await bcrypt.compare(password, user.passwordHash)) && (!role || user.role === role);
    if (!ok) return res.status(401).json({ error: "Invalid email, password or role" });

    res.json({ user: store.publicUser(user), token: signToken(user) });
  } catch (err) {
    next(err);
  }
});

router.get("/me", authRequired, (req, res) => {
  const user = store.findUserById(req.user.id);
  if (!user) return res.status(401).json({ error: "User no longer exists" });
  res.json({ user: store.publicUser(user) });
});

module.exports = router;

// Simple JSON-file store. Swap for a real DB (MongoDB/Postgres) when ready.
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const FILE = path.join(__dirname, "db.json");

function seed() {
  const mk = (id, name, email, pass, role) => ({
    id, name, email, role, passwordHash: bcrypt.hashSync(pass, 10),
  });
  return {
    users: [
      mk(1, "Aditi Sharma", "aditi.student@skillbridge.dev", "student123", "student"),
      mk(2, "Ramesh Kumar", "ramesh.staff@skillbridge.dev", "staff123", "office_staff"),
      mk(3, "Priya Nair", "priya.industry@skillbridge.dev", "industry123", "industry"),
      mk(4, "Admin Moderator", "admin.moderator@skillbridge.dev", "moderator123", "moderator"),
    ],
    notices: [],
  };
}

function save() {
  fs.writeFileSync(FILE + ".tmp", JSON.stringify(db, null, 2));
  fs.renameSync(FILE + ".tmp", FILE); // atomic-ish write, avoids half-written files
}

function load() {
  if (!fs.existsSync(FILE)) {
    const fresh = seed();
    fs.writeFileSync(FILE, JSON.stringify(fresh, null, 2));
    return fresh;
  }
  return JSON.parse(fs.readFileSync(FILE, "utf8")); // corrupt file -> throws, never silently overwritten
}

const db = load();

const publicUser = ({ passwordHash, ...rest }) => rest;

module.exports = {
  publicUser,
  getUsers: () => db.users.map(publicUser),
  findUserByEmail: (email) =>
    db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase()),
  findUserById: (id) => db.users.find((u) => String(u.id) === String(id)),
  deleteUser(id) {
    const before = db.users.length;
    db.users = db.users.filter((u) => String(u.id) !== String(id));
    if (db.users.length === before) return false;
    save();
    return true;
  },
  getNotices: () => [...db.notices].reverse(), // newest first
  addNotice({ author, role, title, content }) {
    const id = db.notices.reduce((m, n) => Math.max(m, n.id), 0) + 1;
    const notice = {
      id, author, role, title, content,
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    };
    db.notices.push(notice);
    if (db.notices.length > 200) db.notices.shift();
    save();
    return notice;
  },
};

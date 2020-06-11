const express = require("express");
const router = express.Router();
const db = require("../data/database")
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = "some long secret";

router.post("/login", (req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }
    const { username, password } = req.body;
    if (!db.exists(`/users/${username}`)) {
        return res.sendStatus(400);
    }
    const user = db.getData(`/users/${username}`);
    if (user.password !== password) {
        return res.sendStatus(400);
    }
    const payload = { username: user.username };
    const access_token = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
    res.cookie("jwt-access-token", access_token);
    res.send({ access_token });
});

router.post("/register", (req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }
    const { username, password } = req.body;
    if (db.exists(`/users/${username}`)) {
        return res.sendStatus(400);
    }
    const user = {
        username,
        password,
        joined: new Date().toISOString()
    }
    db.push(`/user/${username}`, user);
    const payload = { username: user.username, joined: user.joined };
    const access_token = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
    res.cookie("jwt-access-token", access_token);
    res.send({ access_token });
});

module.exports = router;
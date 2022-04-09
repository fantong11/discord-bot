const express = require("express");
const router = express.Router();
const email = require("../controllers/EmailController");


router.get("/recipients/:recipient", email.detectEmailOpen);
router.post("/sendmail", email.sendMail);

module.exports = router;
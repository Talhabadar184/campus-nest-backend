const express = require("express");
const router = express.Router();
const { getHostelById ,getAllHostels,createHostels} = require("../controllers/hostel.controller.js");

router.get("/:id", getHostelById);
router.get("/", getAllHostels);
router.post("/", createHostels);
module.exports = router;
//hhh
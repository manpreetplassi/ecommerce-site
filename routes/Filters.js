const express = require("express");
const { addFilters, fetchFilters } = require("../controller/Filters");
const router = express.Router();

router.post("/", addFilters)
.get("/", fetchFilters)

exports.router = router;

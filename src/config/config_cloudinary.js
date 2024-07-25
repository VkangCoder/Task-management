"use strict";

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "issuetracking",
  api_key: "919683787554514",
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;

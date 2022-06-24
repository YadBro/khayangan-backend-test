const express   = require("express");
const route     = express.Router();

// const { addFolderAndFile }    = require("../controllers/foldersandfile");
// route.post("/add", addFolderAndFile);
const { addFolderAndFile, getAllFoldersandFiles }    = require("../controllers/foldersandfile");
route.post("/folders", addFolderAndFile);
route.get("/folders", getAllFoldersandFiles);

module.exports = route;
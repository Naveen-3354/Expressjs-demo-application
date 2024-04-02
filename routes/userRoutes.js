const express = require("express");
const route = express.Router();
const {
  getAllUsers,
  getUsersByFeilds,
  updateUser,
  deleteUsers,
  updateRole,
  getAllUsersByStatus,
} = require("../services/userServices");
// const token = require("../auth/jwtToken");
const { admin, user, develop } = require("../auth/rolesAuth");


route.get("/",admin, getAllUsers);
route.get("/:status", getAllUsersByStatus);
route.get("/getbyfeilds", getUsersByFeilds);
route.put("/update/:id", updateUser);
route.delete("/:id", deleteUsers);
route.put("/updateRoles", updateRole);
module.exports = route;

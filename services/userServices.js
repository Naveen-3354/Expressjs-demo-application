const UserModel = require("../models/userModel");
const _ = require("lodash");
const {
  registerValidationCustom,
  objectIdvalidation,
  validateRole,
} = require("../components/validation");

exports.getAllUsers = async function (req, res) {
  // if(req.params.status !== "Active" || req.params.status !== "Inactive") return res.status(400).send({message:"Invalid Status."})
  let result = await UserModel.find().select([
    "-password",
    "-status",
    "-createdOn",
    // "-roles"
  ]);
  res.send(result);
};

exports.getAllUsersByStatus = async function (req, res) {
  let result = await UserModel.find().select([
    "-password",
    "-status",
    "-createdOn",
    // "-roles"
  ]);
  res.send(result);
};

exports.getUsersByFeilds = async (req, res) => {
  if (_.isEmpty(req.body)) return res.status(400).send("There is no data");
  const { _id, userName, email, number, status } = req.body;
  const error = registerValidationCustom({ userName, email, number }, true);
  if (error) return res.status(400).send(error);
  const result = await UserModel.find({
    $or: [{ _id }, { userName }, { email }, { number }, { status }],
  }).select(["-password", "-createdOn"]);
  res.send(result);
};

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  if (!objectIdvalidation(id))
    return res.status(400).send({
      message: "Invalid id.",
    });
  if (_.isEmpty(req.body)) return res.status(400).send("There is no data");
  const { userName, email, number } = req.body;
  const error = registerValidationCustom({ userName, email, number }, true);
  if (error) return res.status(400).send(error);

  let result = await UserModel.find({ $or: [{ email }, { number }] });
  if (result.length !== 0)
    return res.status(400).send({ message: "Email or Number already exist." });

  result = await UserModel.findOne({ _id: id }).select([
    "userName",
    "email",
    "number",
  ]);
  if (userName) result.userName = userName;
  if (email) result.email = email;
  if (number) result.number = number;
  const response = await result.save();
  res.status(201).send({
    payload: response,
    message: "Updated Successfully",
  });
};

exports.deleteUsers = async (req, res) => {
  const id = req.params.id;
  if (!objectIdvalidation(id))
    return res.status(400).send({
      message: "Invalid id.",
    });
  const result = await UserModel.findByIdAndUpdate({ _id: id }).select(
    "status"
  );
  if (!result)
    return res.status(400).send({
      message: "No user found",
    });
  result.status = "Inactive";
  await result.save();
  res.send({
    message: "User deleted.",
  });
};

exports.updateRole = async (req, res) => {
  if (_.isEmpty(req.body)) return res.status(400).send("There is no data");
  const { id, role } = req.body;
  if (!objectIdvalidation(id))
    return res.status(400).send({
      message: "Invalid id.",
    });
  if (!validateRole(role))
    return res.status(400).send({ message: "Invalid role" });
  const result = await UserModel.findByIdAndUpdate({ _id: id });
  if (!result)
    return res.status(400).send({
      message: "No user found",
    });
  result.roles = role;
  const error = result.validateSync();
  if(error) return res.status(400).send(error.errors.roles.properties.message)
  await result.save()
  res.status(200).send({message:"Role successfully updated"});
};

const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const {
  registerValidationCustom,
} = require("../components/validation");
const _ = require("lodash")
const generateToken = require("../token/generateToken")

// registration
exports.registerUser = async (req, res) => {
  if(_.isEmpty(req.body)) return res.status(400).send("There is no data");
  const { userName, email, number, password } = req.body;
  const validation2 = registerValidationCustom({
    userName,
    email,
    number,
    password,
  });
  if (validation2) return res.status(400).send(validation2);

  let result = await UserModel.find({ $or: [{ email }, { number }] });
  if (result.length !== 0)
    return res.status(400).send({ message: "Email or Number already exist." });

  result = UserModel({
    userName: userName,
    email: email,
    number: number,
    password: password,
  });

  const errors = result.validateSync();
  if (errors) {
    return res.status(400).send(errors);
  }

  const salt = await bcrypt.genSalt(10);
  result.password = await bcrypt.hash(result.password, salt);

  await result.save();

  res.status(201).send({
    payload: "Inserted",
    message: "Payload inserted successfully.",
  });
};

//Login
exports.loginUser = async (req, res) => {
  // if(_.isEmpty(req.body)) return res.status(400).send("There is no data");


  const { email, number, password } = req.body;

  const user = await UserModel.findOne({
    $or: [{ email }, { number }],
  }).select({ userName: 1, email: 1, number: 1, password: 1, roles: 1 });
  if (!user)
    return res.status(500).send({
      payload: req.body,
      message: "User not found",
      error: "email or number might be worng.",
    });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");
  const result = {
    _id: user._id,
    userName: user.userName,
    email: user.email,
    number: user.number,
    role: user.roles
  };

  const token = generateToken(result)

  // res.cookie("token", token, {
  //   maxAge: 5000,
  //   httpOnly: true,
  //   secure: true,
  // });
  res.send({
    response: result,
    token:token,
    message: "User found",
  });
};


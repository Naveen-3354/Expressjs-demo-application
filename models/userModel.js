const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");

const userScheme =new mongoose.Schema(
  new mongoose.Schema(
    {
      userName: {
        type: String,
        required: [true, "Username is a required field."],
        minLength: [4, "Username is less than 4 characters."],
        maxLength: [15, "Username is greater than 15 characters."],
      },
      email: {
        type: String,
        required: [true, "Email is a required field."],
        validate: {
          validator: function (value) {
            return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
          },
          message: (props) => `${props.value} is not a valid email!`,
        },
      },
      number: {
        type: String,
        required: [true, "Mobile number is a required field"],
        minLength: [10, "Number is less than 10 digits"],
        validate: {
          validator: function (value) {
            return /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(
              value
            );
          },
          message: (props) => `${props.value} is not mobile number!`,
        },
      },
      password: {
        type: String,
        required: [true, "Password is a required field"],
        minLength: [8, "Password is less than 8 characters"],
        // maxLength:[15, "Password is greater than 15 characters"],
        // validate:{
        //     validator: function (value){
        //         return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
        //     },
        //     message:(props)=>`${props.value} should contain at least one uppercase letter, one lowercase letter, one number and one special character.`
        // }
      },
      status: {
        type: String,
        enum: {
          values: ["Active", "Inactive"],
          message: "{VALUE} is not valid.",
        },
        default: "Active",
      },
      createdOn: {
        type: Date,
        default: Date.now(),
      },
      roles: {
        type: String,
        enum: ["USER", "ADMIN", "DEVELOP"],
        message: "{VALUE} is not a valid role",
        default: "USER",
      },
    },
    {
      versionKey: false,
    }
  )
);

userScheme.methods.generateJsonWebToken = function () {
  const token = JWT.sign(
    { _id: this._id, roles: this.roles },
    process.env.JWT_SCERET_KEY,
    { algorithm: "HS256", expiresIn: process.env.JWT_EXP_TIME }
  );
  return token
};

const UserModel = mongoose.model("users", userScheme);

module.exports = UserModel;

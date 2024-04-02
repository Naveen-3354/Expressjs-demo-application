const jwt = require("jsonwebtoken")


const generateToken = (payload)=>{
   return  jwt.sign(payload,process.env.JWT_SCERET_KEY)
}

module.exports = generateToken
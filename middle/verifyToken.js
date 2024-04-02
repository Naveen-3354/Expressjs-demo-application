const jwt = require("jsonwebtoken")

function tokenVerify(req, res, cb) {
  const token = req.body.token;
  // const {token} = req.body
    try{
        const payload = jwt.verify(token, process.env.JWT_SCERET_KEY)
        req.role = payload.role;
        cb();
    }catch(e){
        return res.send("invalid token.")
    }
}
module.exports = tokenVerify
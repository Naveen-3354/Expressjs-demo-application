const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const cookies = req.cookies;
  if (!cookies)
    return res.status(400).send({
      message: "Invalid Access",
    });
  const token = cookies.token;
  if (!token)
    return res.status(401).send({
      warning: "Access denied. No token provided.",
    });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SCERET_KEY);
    console.log(decoded);
    req.user = decoded;
  } catch (ex) {
    return res.status(400).send("Invalid token.");
  }
  next();
};

module.exports.admin = function (req, res, next) {
  const roles = req.role;
  if (roles !== process.env.ROLE2)
    return res.status(401).send({
      warning: "Access denied. No token provided.",
    });
  next();
};

module.exports.user = function (req, res, next) {
  const { id, roles } = req.user;
  if (
    roles !== process.env.ROLE1 ||
    roles !== process.env.ROLE3 ||
    roles !== process.env.ROLE2
  )
    return res.status(401).send({
      warning: "Access denied. No token provided.",
    });
  next();
};

module.exports.develop = function (req, res, next) {
  const { id, roles } = req.user;
  if (roles !== process.env.ROLE3 || roles !== process.env.ROLE2)
    return res.status(401).send({
      warning: "Access denied. No token provided.",
    });
  next();
};

module.exports.seller = function (req, res, next) {
  const { id, roles } = req.user;
  if (
    roles !== process.env.ROLE4 ||
    roles !== process.env.ROLE3 ||
    roles !== process.env.ROLE2
  )
    return res.status(401).send({
      warning: "Access denied. No token provided.",
    });
  next();
};

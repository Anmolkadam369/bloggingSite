

//_____________________________for Authentication________________________________
let jwt = require("jsonwebtoken");
const checkToken = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) token = req.headers["x-api-Key"];
    if (!token) return res.send({ msg: "request is missing mandatory header" });

    let verifyToken = jwt.verify(token, "new_seceret_key", (err) => {
      if (err) res.status(401).send({ msg: "invalid token" });
    });

    next();
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};



module.exports.checkToken = checkToken;




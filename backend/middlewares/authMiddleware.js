const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {

  try {

    console.log(
      "Authorization Header:",
      req.headers.authorization
    );

    const header =
      req.headers.authorization;

    if (!header) {

      return res.status(401).json({
        message: "No token found",
      });

    }

    const token =
      header.startsWith("Bearer ")
        ? header.slice(7)
        : header;

    console.log("Token:", token);

    const decoded =
      jwt.verify(
        token,
        "waste-secret-key"
      );

    console.log(
      "Decoded User:",
      decoded
    );

    req.user = decoded;

    next();

  }

  catch (error) {

    console.log(
      "JWT ERROR:",
      error.message
    );

    return res.status(401).json({
      message: error.message,
    });

  }

};

module.exports = auth;
const jwt = require("jsonwebtoken");

const auth = (

  req,
  res,
  next

) => {

  try {

    const token =
      req.headers.authorization;

    if (!token) {

      return res.status(401).json({

        message:
          "No token found",

      });

    }

    const decoded =
      jwt.verify(

        token,

        "waste-secret-key"

      );

    req.user = decoded;

    next();

  }

  catch (error) {

    return res.status(401).json({

      message:
        "Unauthorized",

    });

  }

};

module.exports = auth;
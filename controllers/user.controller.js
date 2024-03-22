const bcrypt = require("bcrypt");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const BCRYPT_SALTS = Number(process.env.BCRYPT_SALTS);

// POST - Register User
const registerUser = async (req, res) => {

  try {
    const userExists = await User.find({ login: req.body.login });

    if (userExists.length != 0) {
      return res.status(400).send({
        status: 400,
        message: "Email/phone already exists",
      });
    }
  } catch (err) {
    return res.status(400).send({
      status: 400,
      message: "Error while checking username and email exists",
      data: err,
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, BCRYPT_SALTS);

  const userObj = new User({
    name: req.body.name,
    login: req.body.login,
    password: hashedPassword,
    dob:req.body.month+"-"+req.body.date+"-"+req.body.year,
  });

  try {
    await userObj.save();

    return res.status(201).send({
      status: 201,
      message: "User registered successfully",
    });
  } catch (err) {
    return res.status(400).send({
      status: 400,
      message: "Error while save user to DB",
      data: err,
    });
  }
};

// POST - Login User
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  let userData;

  try {
    userData = await User.findOne({ username });
    if (!userData) {
      return res.status(400).send({
        status: 400,
        message: "No user found! Please register",
      });
    }
  } catch (err) {
    return res.status(400).send({
      status: 400,
      message: "Error while fetching user data",
      data: err,
    });
  }

  const isPasswordSame = await bcrypt.compare(password, userData.password);

  if (!isPasswordSame) {
    return res.status(400).send({
      status: 400,
      message: "Incorrect Password",
    });
  }


  return res.status(200).send({
    status: 200,
    message: "User Logged in successfully",
  });
};


module.exports = { registerUser, loginUser };

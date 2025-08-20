const errorHandler = require("../utils/errorHandler.js");
const catchAsyncError = require("../middleware/catchAsyncError.js");
const generatedToken = require("../utils/jwtToken");
const setTokenCookie = require("../utils/sendToken");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const resgisterUser = catchAsyncError(async (req, res, next) => {
  const { username, email, password, type } = req.body;

  try {
    const emails = await prisma.user.findUnique({
      where: { email },
    });

    const userNames = await prisma.user.findUnique({
      where: { username },
    });

    if (emails !== null && userNames !== null) {
      return next(
        new errorHandler("User with email or username already exists", 401)
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data
    const userData = {
      username,
      email,
      password: hashedPassword,
      type: type,
      isVerifiedArtist: type === "BUYER" ? true : false,
    };

    // Only add files if it's an artist and file is uploaded
    if (type === "ARTIST" && req.file) {
      userData.files = JSON.stringify(req.file.filename);
    }

    const user = await prisma.user.create({
      data: userData,
    });

    const token = generatedToken(user.userid, user.email, user.username);
    setTokenCookie(res, token);

    console.log("User created successfully");

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: user,
      token,
    });
  } catch (error) {
    return next(new errorHandler(error, 500));
  }
});

const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  const user = req.user;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return next(new errorHandler("Invalid Email", 400));
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return next(new errorHandler("Invalid Password", 400));
    }

    const token = generatedToken(
      user.userid,
      user.email,
      user.username,
      user.type
    );
    setTokenCookie(res, token);

    const userData = {
      ...user,
      profileImage: user.images
        ? `${process.env.API_URL}/Images/${JSON.parse(user.images)}`
        : null,
    };

    res.status(201).json({
      success: true,
      message: `Hi ${user.username} iam logged in`,
      user: userData,
      token,
    });
  } catch (error) {
    return next(new errorHandler("Internal Server Error", 500));
  }
});

const logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
};

module.exports = {
  resgisterUser,
  loginUser,
  logout,
};

const errorHandler = require("../utils/errorHandler.js");
const catchAsyncError = require("../middleware/catchAsyncError.js");
const path = require("path");
const { PrismaClient, userType } = require("@prisma/client");

const prisma = new PrismaClient();

const getAllArtists = catchAsyncError(async (req, res, next) => {
  try {
    const user = req.user;
    if (user.type !== userType.ADMIN) {
      res.status(504).json({
        success: false,
        message: "You are not authorized for this",
      });
    }

    const artists = await prisma.user.findMany({
      where: {
        type: userType.ARTIST,
      },
    });

    const artistsWithFiles = artists.map((artist) => {
      if (artist.files) {
        return {
          ...artist,
          fileUrl: `${process.env.API_URL}/Files/${JSON.parse(artist.files)}`,
        };
      }
      return artist;
    });

    console.log("Users retrived successfully");

    res.status(201).json({
      success: true,
      message: "Users retrived successfully",
      artists: artistsWithFiles,
    });
  } catch (error) {
    return next(new errorHandler(error, 500));
  }
});

const getAllBuyers = catchAsyncError(async (req, res, next) => {
  try {
    const user = req.user;
    if (user.type !== userType.ADMIN) {
      res.status(504).json({
        success: false,
        message: "You are not authorized for this",
      });
    }

    const buyers = await prisma.user.findMany({
      where: {
        type: userType.BUYER,
      },
    });

    const buyersWithFiles = buyers.map((buyer) => {
      if (buyer.files) {
        return {
          ...buyer,
          fileUrl: `${process.env.API_URL}/Files/${JSON.parse(buyer.files)}`,
        };
      }
      return buyer;
    });

    console.log("Users retrived successfully");

    res.status(201).json({
      success: true,
      message: "Users retrived successfully",
      buyers: buyersWithFiles,
    });
  } catch (error) {
    return next(new errorHandler(error, 500));
  }
});

const getUserProfile = catchAsyncError(async (req, res, next) => {
  const userId = req.user.userid;

  try {
    const userProfile = await prisma.user.findUnique({
      where: {
        userid: userId,
      },
    });

    if (!userProfile) {
      return next(new errorHandler("User not found", 404));
    }

    const profile = {
      ...userProfile,
      profileImage: userProfile.images
        ? `${process.env.API_URL}/Images/${JSON.parse(userProfile.images)}`
        : null,
    };

    res.status(200).json({
      success: true,
      message: "User profile retrived successfully",
      user: profile,
    });
  } catch (error) {
    return next(new errorHandler(error, 500));
  }
});

const updateUserProfile = catchAsyncError(async (req, res, next) => {
  const userId = req.user.userid;

  try {
    const userProfile = await prisma.user.findUnique({
      where: {
        userid: userId,
      },
    });

    if (!userProfile) {
      return next(new errorHandler("User not found", 404));
    }

    const { username, email } = req.body;
    const file = req.file?.filename;

    const updatedUser = await prisma.user.update({
      where: {
        userid: userId,
      },
      data: {
        username,
        email,
        images: JSON.stringify(file) || userProfile.images,
      },
    });

    const profile = {
      ...updatedUser,
      profileImage: updatedUser.images
        ? `${process.env.API_URL}/Images/${JSON.parse(updatedUser.images)}`
        : null,
    };

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: profile,
    });
  } catch (error) {
    return next(new errorHandler(error, 500));
  }
});

const getUpdateStatus = catchAsyncError(async (req, res, next) => {
  // const user = req.user;
  const { id, status } = req.body;

  try {
    // if(user.type !== userType.ADMIN){
    //   res.status(504).json({
    //     success: false,
    //     message: "You are not authorized for this",

    // })
    // }
    console.log("status", status);

    await prisma.user.update({
      where: {
        userid: parseInt(id),
      },
      data: {
        isVerifiedArtist: Boolean(status),
      },
    });

    console.log("Users updated successfully");

    res.status(200).json({
      success: true,
      message: "Users updated successfully",
    });
  } catch (error) {
    return next(new errorHandler(error, 500));
  }
});

const getAllPublicArtists = catchAsyncError(async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        isVerifiedArtist: true,
        type: userType.ARTIST,
      },
      include: {
        portfolio: true,
      },
    });

    const formattedUsers = users.map((user) => ({
      ...user,
      profileImage: user.images
        ? `${process.env.API_URL}/Images/${JSON.parse(user.images)}`
        : null,
      portfolio: user.portfolio.map((portfolio) => ({
        ...portfolio,
        image: `${process.env.API_URL}/portfolio/${portfolio.image}`,
      })),
    }));
    // console.log("formattedUsers", formattedUsers);
    res.status(200).json({
      success: true,
      message: "Users retrived successfully",
      formattedUsers,
    });
  } catch (error) {
    return next(new errorHandler(error, 500));
  }
});

const getUserProfileForMessageService = catchAsyncError(async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Profile id is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        userid: parseInt(userId),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User found",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = {
  getAllArtists,
  getUpdateStatus,
  getUserProfile,
  updateUserProfile,
  getAllPublicArtists,
  getAllBuyers,
  getUserProfileForMessageService,
};

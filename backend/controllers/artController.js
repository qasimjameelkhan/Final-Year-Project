const errorHandler = require("../utils/errorHandler.js");
const catchAsyncError = require("../middleware/catchAsyncError.js");
const { PrismaClient, artStatus } = require("@prisma/client");
const { runCheckArts } = require("../cron/duplicateChecks.js");

const prisma = new PrismaClient();

// Create Art
const createArt = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user.userid;
    const { title, description, category, price } = req.body;
    const file = req.file.filename;

    const art = await prisma.arts.create({
      data: {
        title,
        description,
        category,
        price: parseFloat(price),
        image: file,
        status: artStatus.DRAFT,
        userId,
      },
    });

    const res = runCheckArts();

    res.status(201).json({
      success: true,
      message: "Art created successfully.",
      art,
    });
  } catch (error) {
    return next(new errorHandler(error.message, 500));
  }
});

// Update art
const updateArt = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user.userid;
    const id = parseInt(req.params.id);
    const { title, description, price, status } = req.body;
    const file = req.file?.filename;

    const existingArt = await prisma.arts.findFirst({
      where: { id, userId },
    });

    if (!existingArt) {
      return next(new errorHandler("Art not found or unauthorized", 404));
    }
    if (existingArt.status === artStatus.SOLD) {
      return next(new errorHandler("Art soled you cannot updateit", 406));
    }

    const updatedArt = await prisma.arts.update({
      where: { id },
      data: {
        title,
        description,
        price: price ? parseFloat(price) : existingArt.price,
        status: artStatus.DRAFT,
        image: JSON.stringify(file) || existingArt.image,
      },
    });

    res.status(200).json({
      success: true,
      message: "Art updated successfully",
      art: updatedArt,
    });
  } catch (error) {
    return next(new errorHandler(error.message, 500));
  }
});

// Delete art
const deleteArt = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user.userid;
    const id = parseInt(req.params.id);

    const existingArt = await prisma.arts.findFirst({
      where: { id, userId },
    });

    if (!existingArt) {
      return next(new errorHandler("Art not found or unauthorized", 404));
    }

    if (existingArt.status === artStatus.SOLD) {
      return next(new errorHandler("Art soled you cannot updateit", 406));
    }

    await prisma.arts.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Art deleted successfully",
    });
  } catch (error) {
    return next(new errorHandler(error.message, 500));
  }
});

// Get all arts for a user
const getAllArts = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user.userid;

    const arts = await prisma.arts.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const formatted = arts.map((art) => ({
      ...art,
      imageUrl: art.image ? `${process.env.API_URL}/Arts/${art.image}` : null,
    }));

    res.status(200).json({
      success: true,
      arts: formatted,
    });
  } catch (error) {
    return next(new errorHandler(error.message, 500));
  }
});

// Get all arts for a public
const getAllPublicArts = catchAsyncError(async (req, res, next) => {
  try {
    const arts = await prisma.arts.findMany({
      where: {
        status: {
          in: [artStatus.LIVE, artStatus.SOLD],
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
      },
    });

    const formatted = arts.map((art) => ({
      ...art,
      imageUrl: art.image ? `${process.env.API_URL}/Arts/${art.image}` : null,
      user: {
        ...art.user,
        profileImage: art.user.images
          ? `${process.env.API_URL}/Images/${JSON.parse(art.user.images)}`
          : null,
      },
    }));

    res.status(200).json({
      success: true,
      arts: formatted,
    });
  } catch (error) {
    return next(new errorHandler(error.message, 500));
  }
});

// Get a single art
const getSinglelArt = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user.userid;
    const id = parseInt(req.params.id);

    const art = await prisma.arts.findFirst({
      where: { id, userId },
    });

    if (!art) {
      return next(new errorHandler("Art not found", 404));
    }

    const artWithUrl = {
      ...art,
      imageUrl: art.image ? `${process.env.API_URL}/Arts/${art.image}` : null,
    };

    res.status(200).json({
      success: true,
      art: artWithUrl,
    });
  } catch (error) {
    return next(new errorHandler(error.message, 500));
  }
});

// Get a single public art
const getSinglelPublicArt = catchAsyncError(async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const art = await prisma.arts.findFirst({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!art) {
      return next(new errorHandler("Art not found", 404));
    }

    const relatedArtsData = await prisma.arts.findMany({
      where: {
        status: "LIVE",
        NOT: { id },
      },
      include: {
        user: true,
      },
      take: 6,
    });

    const relatedArts = relatedArtsData.map((art) => ({
      ...art,
      imageUrl: art.image ? `${process.env.API_URL}/Arts/${art.image}` : null,
      user: {
        ...art.user,
        profileImage: art.user.images
          ? `${process.env.API_URL}/Images/${JSON.parse(art.user.images)}`
          : null,
      },
    }));

    const artWithUrl = {
      ...art,
      imageUrl: art.image ? `${process.env.API_URL}/Arts/${art.image}` : null,
      user: {
        ...art.user,
        profileImage: art.user.images
          ? `${process.env.API_URL}/Images/${JSON.parse(art.user.images)}`
          : null,
      },
      relatedArts: relatedArts,
    };

    console.log("Public Art Details:", artWithUrl);

    res.status(200).json({
      success: true,
      art: artWithUrl,
    });
  } catch (error) {
    return next(new errorHandler(error.message, 500));
  }
});

module.exports = {
  createArt,
  updateArt,
  deleteArt,
  getAllArts,
  getSinglelArt,
  getAllPublicArts,
  getSinglelPublicArt,
};

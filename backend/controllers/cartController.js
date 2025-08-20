const errorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Add to cart
const addToCart = catchAsyncError(async (req, res, next) => {
  const { artId } = req.body;
  const userId = req.user.userid;

  // Check if art exists
  const art = await prisma.arts.findUnique({
    where: { id: parseInt(artId) },
  });

  if (!art) {
    return next(new errorHandler("Art not found", 404));
  }

  // Check if user is trying to add their own art
  if (art.userId === userId) {
    return next(new errorHandler("You cannot add your own art to cart", 400));
  }

  // Check if art is already sold
  if (art.status === "SOLD") {
    return next(new errorHandler("Art is already sold", 400));
  }

  // Check if art is already in cart
  const existingCartItem = await prisma.cart.findFirst({
    where: {
      userId: userId,
      artId: parseInt(artId),
    },
  });

  if (existingCartItem) {
    return next(new errorHandler("Art is already in cart", 400));
  }

  // Check if user has already purchased this art
  const existingOrder = await prisma.order.findFirst({
    where: {
      userId: userId,
      artId: parseInt(artId),
    },
  });

  if (existingOrder) {
    return next(new errorHandler("You have already purchased this art", 400));
  }

  // Add to cart
  const cartItem = await prisma.cart.create({
    data: {
      userId: userId,
      artId: parseInt(artId),
      quantity: 1,
    },
    include: {
      art: true,
    },
  });

  res.status(201).json({
    success: true,
    cartItem,
  });
});

// Get cart items
const getCart = catchAsyncError(async (req, res, next) => {
  const userId = req.user.userid;

  const cartItems = await prisma.cart.findMany({
    where: { userId: userId },
    include: {
      art: {
        include: {
          user: true,
        },
      },
    },
  });

  // Transform cart items to include full image URLs
  const transformedCartItems = cartItems.map((item) => ({
    ...item,
    art: {
      ...item.art,
      image: item.art.image
        ? `${process.env.API_URL}/Arts/${item.art.image}`
        : null,
    },
  }));

  res.status(200).json({
    success: true,
    cartItems: transformedCartItems,
  });
});

// Update cart item quantity
const updateCartItem = catchAsyncError(async (req, res, next) => {
  const { cartId } = req.params;
  const { quantity } = req.body;
  const userId = req.user.userid;

  const cartItem = await prisma.cart.findUnique({
    where: { id: parseInt(cartId) },
  });

  if (!cartItem) {
    return next(new errorHandler("Cart item not found", 404));
  }

  if (cartItem.userId !== userId) {
    return next(new errorHandler("Not authorized", 403));
  }

  const updatedCartItem = await prisma.cart.update({
    where: { id: parseInt(cartId) },
    data: { quantity },
    include: {
      art: true,
    },
  });

  res.status(200).json({
    success: true,
    cartItem: updatedCartItem,
  });
});

// Remove from cart
const removeFromCart = catchAsyncError(async (req, res, next) => {
  const { cartId } = req.params;
  const userId = req.user.userid;

  const cartItem = await prisma.cart.findUnique({
    where: { id: parseInt(cartId) },
  });

  if (!cartItem) {
    return next(new errorHandler("Cart item not found", 404));
  }

  if (cartItem.userId !== userId) {
    return next(new errorHandler("Not authorized", 403));
  }

  await prisma.cart.delete({
    where: { id: parseInt(cartId) },
  });

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
  });
});

// Clear cart
const clearCart = catchAsyncError(async (req, res, next) => {
  const userId = req.user.userid;

  await prisma.cart.deleteMany({
    where: { userId: userId },
  });

  res.status(200).json({
    success: true,
    message: "Cart cleared",
  });
});

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};

const errorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create a new order
const createOrder = catchAsyncError(async (req, res, next) => {
  try {
    const { artId, quantity = 1 } = req.body;
    const userId = req.user.userid;

    // Get art details
    const art = await prisma.arts.findUnique({
      where: { id: artId },
      include: { user: true },
    });

    if (!art) {
      return next(new errorHandler("Art not found", 404));
    }

    // Get buyer's wallet
    const buyerWallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!buyerWallet) {
      return next(new errorHandler("Buyer wallet not found", 404));
    }

    // Calculate total price and commission
    const totalPrice = art.price * quantity;
    const commission = totalPrice * 0.05;
    const sellerAmount = totalPrice - commission;

    // Check if buyer has sufficient funds
    if (buyerWallet.amount < totalPrice) {
      return next(new errorHandler("Insufficient funds", 400));
    }

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the order
      const order = await tx.order.create({
        data: {
          userId,
          artId,
          quantity,
          totalPrice,
          status: "completed",
        },
      });

      // 2. Deduct amount from buyer's wallet
      await tx.wallet.update({
        where: { id: buyerWallet.id },
        data: { amount: buyerWallet.amount - totalPrice },
      });

      // 3. Get seller's wallet
      const sellerWallet = await tx.wallet.findUnique({
        where: { userId: art.user.userid },
      });

      if (!sellerWallet) {
        await tx.wallet.create({
          data: {
            amount: 0,
            userId: art.user.userid,
          },
        });
      }

      // 4. Add amount to seller's wallet
      await tx.wallet.update({
        where: { id: sellerWallet.id },
        data: { amount: sellerWallet.amount + sellerAmount },
      });

      // 5. Create transaction record for buyer
      await tx.transaction.create({
        data: {
          amount: totalPrice,
          from_account: buyerWallet.id,
          to_account: sellerWallet.id,
          userId,
        },
      });

      // 6. Update art status to SOLD
      await tx.arts.update({
        where: { id: artId },
        data: { status: "SOLD" },
      });

      // 7. Remove item from cart
      await tx.cart.deleteMany({
        where: {
          userId,
          artId,
        },
      });

      return order;
    });

    res.status(201).json({
      success: true,
      order: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all orders for a user
const getUserOrders = catchAsyncError(async (req, res, next) => {
  const userId = req.user.userid;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      art: {
        include: {
          user: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Format the orders with full image URLs
  const formattedOrders = orders.map((order) => ({
    ...order,
    art: {
      ...order.art,
      image: order.art.image
        ? `${process.env.API_URL}/Arts/${order.art.image}`
        : null,
    },
  }));

  res.status(200).json({
    success: true,
    orders: formattedOrders,
  });
});

// Get a single order
const getOrderDetails = catchAsyncError(async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id);
    const userId = req.user.userid;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        art: {
          include: {
            user: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return next(new errorHandler("Order not found", 404));
    }

    if (order.userId !== userId) {
      return next(new errorHandler("Not authorized to view this order", 403));
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = {
  createOrder,
  getUserOrders,
  getOrderDetails,
};

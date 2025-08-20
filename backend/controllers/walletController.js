const errorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const { PrismaClient } = require("@prisma/client");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const prisma = new PrismaClient();

// Get wallet balance
const getWallet = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user.userid;

    const wallet = await prisma.wallet.findUnique({
      where: { userId: userId },
      include: {
        sentTransactions: {
          include: {
            toWallet: {
              include: {
                user: true,
              },
            },
          },
        },
        receivedTransactions: {
          include: {
            fromWallet: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!wallet) {
      return next(new errorHandler("Wallet not found", 404));
    }

    res.status(200).json({
      success: true,
      wallet,
    });
  } catch (error) {
    return next(new errorHandler(error.message, 500));
  }
});

// Create Stripe payment intent for adding funds
const createPaymentIntent = catchAsyncError(async (req, res, next) => {
  try {
    const { amount } = req.body;
    const userId = req.user.userid;

    if (!amount || amount <= 0) {
      return next(new errorHandler("Please enter a valid amount", 400));
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "usd",
      metadata: {
        userId: userId.toString(),
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return next(new errorHandler(error.message, 500));
  }
});

// Handle successful payment and add funds to wallet
const addFunds = catchAsyncError(async (req, res, next) => {
  try {
    const { paymentIntentId } = req.body;
    const userId = req.user.userid;

    if (!paymentIntentId) {
      return next(new errorHandler("Payment intent ID is required", 400));
    }

    // Retrieve the payment intent to get the amount
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return next(new errorHandler("Payment not successful", 400));
    }

    // Get or create wallet
    let wallet = await prisma.wallet.findUnique({
      where: { userId: userId },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: userId,
          amount: 0,
        },
      });
    }

    // Update wallet balance
    const updatedWallet = await prisma.wallet.update({
      where: { userId: userId },
      data: {
        amount: wallet.amount + paymentIntent.amount / 100,
      },
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        amount: paymentIntent.amount / 100,
        from_account: wallet.id,
        to_account: wallet.id,
        userId: userId,
      },
    });

    res.status(200).json({
      success: true,
      wallet: updatedWallet,
    });
  } catch (error) {
    return next(new errorHandler(error.message, 500));
  }
});

// Transfer funds between users
const transferFunds = catchAsyncError(async (req, res, next) => {
  try {
    const { toUserId, amount } = req.body;
    const fromUserId = req.user.userid;

    if (!toUserId || !amount) {
      return next(new errorHandler("Recipient and amount are required", 400));
    }

    if (amount <= 0) {
      return next(new errorHandler("Amount must be greater than 0", 400));
    }

    // Get sender's wallet
    const fromWallet = await prisma.wallet.findUnique({
      where: { userId: fromUserId },
    });

    if (!fromWallet || fromWallet.amount < amount) {
      return next(new errorHandler("Insufficient balance", 400));
    }

    // Get receiver's wallet
    let toWallet = await prisma.wallet.findUnique({
      where: { userId: toUserId },
    });

    if (!toWallet) {
      toWallet = await prisma.wallet.create({
        data: {
          userId: toUserId,
          amount: 0,
        },
      });
    }

    // Update both wallets
    await prisma.$transaction([
      prisma.wallet.update({
        where: { userId: fromUserId },
        data: { amount: fromWallet.amount - amount },
      }),
      prisma.wallet.update({
        where: { userId: toUserId },
        data: { amount: toWallet.amount + amount },
      }),
      prisma.transaction.create({
        data: {
          amount: amount,
          from_account: fromWallet.id,
          to_account: toWallet.id,
          userId: fromUserId,
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      message: "Transfer successful",
    });
  } catch (error) {
    return next(new errorHandler(error.message, 500));
  }
});

// Get transaction history
const getTransactions = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user.userid;

    const transactions = await prisma.transaction.findMany({
      where: { userId: userId },
      include: {
        fromWallet: {
          include: {
            user: true,
          },
        },
        toWallet: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      transactions,
    });
  } catch (error) {
    return next(new errorHandler(error.message, 500));
  }
});

module.exports = {
  getWallet,
  createPaymentIntent,
  addFunds,
  transferFunds,
  getTransactions,
};

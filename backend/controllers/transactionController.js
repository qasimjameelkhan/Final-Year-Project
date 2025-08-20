const { PrismaClient } = require("@prisma/client");

const errorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

const prisma = new PrismaClient();

// Get all transactions for analytics
const getAllTransactions = catchAsyncError(async (req, res, next) => {
  try {
    const type = req.user.type;
    if (type !== "ADMIN") {
      return next(
        new errorHandler("You are not authorized to access this page", 403)
      );
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        NOT: {
          from_account: prisma.transaction.fields.to_account,
        },
      },
      include: {
        fromWallet: {
          include: {
            user: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
        toWallet: {
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

    // Format transactions with dates
    const formattedTransactions = transactions.map((transaction) => ({
      ...transaction,
      date: transaction.createdAt,
      buyer: transaction.fromWallet.user.username,
      seller: transaction.toWallet.user.username,
      buyerEmail: transaction.fromWallet.user.email,
      sellerEmail: transaction.toWallet.user.email,
    }));

    res.status(200).json({
      success: true,
      transactions: formattedTransactions,
    });
  } catch (error) {
    return next(new errorHandler(error.message, 500));
  }
});

// Get analytics summary
const getAnalyticsSummary = catchAsyncError(async (req, res, next) => {
  try {
    const type = req.user.type;
    if (type !== "ADMIN") {
      return next(
        new errorHandler("You are not authorized to access this page", 403)
      );
    }

    // Get total arts
    const totalArts = await prisma.arts.count();

    // Get total sales and commission
    const transactions = await prisma.order.findMany();
    const totalSales = transactions.reduce(
      (sum, transaction) => sum + transaction.totalPrice,
      0
    );
    const totalCommission = totalSales * 0.05; // 5% commission

    // Get sales by date (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentTransactions = await prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Format daily sales data
    const dailySales = {};
    recentTransactions.forEach((transaction) => {
      const date = transaction.createdAt.toISOString().split("T")[0];
      if (!dailySales[date]) {
        dailySales[date] = 0;
      }
      dailySales[date] += transaction.amount;
    });

    // Convert to array format for charts
    const salesData = Object.entries(dailySales).map(([date, amount]) => ({
      date,
      amount,
    }));

    res.status(200).json({
      success: true,
      analytics: {
        totalArts,
        totalSales,
        totalCommission,
        salesData,
      },
    });
  } catch (error) {
    return next(new errorHandler(error.message, 500));
  }
});

// Get sales by category
const getSalesByCategory = catchAsyncError(async (req, res, next) => {
  try {
    const type = req.user.type;
    if (type !== "ADMIN") {
      return next(
        new errorHandler("You are not authorized to access this page", 403)
      );
    }

    const salesByCategory = await prisma.arts.groupBy({
      by: ["category"],
      where: {
        status: "SOLD",
      },
      _sum: {
        price: true,
      },
      _count: {
        id: true,
      },
    });

    const formattedSales = salesByCategory.map((category) => ({
      category: category.category,
      totalSales: category._sum.price,
      totalItems: category._count.id,
    }));

    res.status(200).json({
      success: true,
      salesByCategory: formattedSales,
    });
  } catch (error) {
    return next(new errorHandler(error.message, 500));
  }
});

module.exports = {
  getAllTransactions,
  getAnalyticsSummary,
  getSalesByCategory,
};

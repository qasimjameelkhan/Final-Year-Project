const { PrismaClient } = require("@prisma/client");
const catchAsyncError = require("../middleware/catchAsyncError");

const prisma = new PrismaClient();

const createChat = catchAsyncError(async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const senderIdInt = parseInt(senderId, 10);
    const receiverIdInt = parseInt(receiverId, 10);

    if (!senderIdInt) {
      return res.status(400).json({
        success: false,
        message: "Sender is required",
      });
    }

    if (!receiverIdInt) {
      return res.status(400).json({
        success: false,
        message: "Receiver is required",
      });
    }

    const chat = await prisma.chat.create({
      data: {
        senderId: senderIdInt,
        receiverId: receiverIdInt,
      },
    });

    if (!chat) {
      return res.status(200).json({
        success: true,
        message: "User not created",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User found",
      data: chat,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

const getSingleChat = catchAsyncError(async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const senderIdInt = parseInt(senderId, 10);
    const receiverIdInt = parseInt(receiverId, 10);

    if (!senderId) {
      return res.status(400).json({
        success: false,
        message: "Sender is required",
      });
    }

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Receiver is required",
      });
    }

    const chat = await prisma.chat.findFirst({
      where: {
        OR: [
          { senderId: senderIdInt, receiverId: receiverIdInt },
          { senderId: receiverIdInt, receiverId: senderIdInt },
        ],
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    if (!chat) {
      return res.status(200).json({
        success: true,
        message: "Chat not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chat found",
      data: chat,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

const getSingleChatById = catchAsyncError(async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Chat ID is required",
      });
    }

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    if (!chat) {
      return res.status(200).json({
        success: true,
        message: "Chat not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chat found",
      data: chat,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

const getAllChats = catchAsyncError(async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User is required",
      });
    }

    const chats = await prisma.chat.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!chats) {
      return res.status(200).json({
        success: true,
        message: "Chats not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chats found",
      data: chats,
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
  createChat,
  getSingleChat,
  getSingleChatById,
  getAllChats,
};

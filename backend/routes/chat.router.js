const express = require("express");
const {
  createChat,
  getSingleChat,
  getAllChats,
  getSingleChatById,
} = require("../controllers/chatController");

const router = express.Router();

router.route("/create-chat").post(createChat);
router.route("/get-single-chat").post(getSingleChat);
router.route("/get-all-user-chats").post(getAllChats);
router.route("/get-single-chat-by-id/:chatId").get(getSingleChatById);

module.exports = router;

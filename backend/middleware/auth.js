const errorHandler = require('../utils/errorHandler.js');
const catchAsyncError = require('../middleware/catchAsyncError.js');
const jwt  = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


const isAuthenticatedUser = catchAsyncError(async(req, res, next) =>{

    const {token }= req.cookies;

    if(!token){
        return next(new errorHandler("Please login to access this resource", 401))
    }   

    try{

      const decodedData = jwt.verify(token, process.env.JWT_SECRET);

      const user = await prisma.user.findUnique({
        where: {userid: decodedData.userid},
        select: {userid: true, email: true, username: true, type: true}
      })

      if(!user){
        return next(new errorHandler("User not found", 401))
      }

      const userData = {
        userid: user.userid,
        email: user.email,
        username: user.username,
        type: user.type
      }


      req.user = userData
      next();

    }catch(error){
      return next(new errorHandler(error, 403))
    }

});

module.exports = {
  isAuthenticatedUser
}
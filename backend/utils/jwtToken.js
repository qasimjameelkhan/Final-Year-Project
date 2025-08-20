const jwt = require('jsonwebtoken');

const generatedToken = (userid, email, username, type) => {

    const token = jwt.sign({userid, email, username, type}, process.env.JWT_SECRET, { expiresIn: '7d' });

    return token;
}

module.exports = generatedToken;
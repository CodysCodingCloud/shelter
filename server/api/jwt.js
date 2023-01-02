const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { User } = require('../db');

const jwtStr = process.env.JWT || 'shelter';
const saltRounds = Number(process.env.SALT || 10);

const authByToken = async (token) => {
  try {
    jwt.verify(token, jwtStr);
    const user = await User.findOne(jwt.decode(token).email, {});
    if (user) {
      return user;
    }
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  } catch (err) {
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
};
const hashPassword = async (user, options) => {
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);
  user.password = hashedPassword;
};
const authenticateLogin = async ({ email, password }) => {
  const user = await User.findOne({
    email,
  });
  if (user && (await bcrypt.compare(password, user.password))) {
    var token = jwt.sign({ email: user.email }, jwtStr);
    return token;
  }
  const error = Error('bad credentials');
  error.status = 401;
  throw error;
};
module.exports = {
  authByToken,
  hashPassword,
  authenticateLogin,
};
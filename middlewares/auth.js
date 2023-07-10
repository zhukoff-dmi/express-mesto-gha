const jwt = require('jsonwebtoken');

const ANAUTHORUZED_ERROR = 401;

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(ANAUTHORUZED_ERROR)
      .send({ message: 'Аторизируйтесь' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-secret-key');
  } catch (err) {
    return res
      .status(ANAUTHORUZED_ERROR)
      .send({ message: 'Пользователь не авторизован' });
  }
  req.user = payload;
  return next();
};

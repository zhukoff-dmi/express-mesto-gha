const jwt = require('jsonwebtoken');

module.exports.createToken = (payload) => jwt.sign(payload, 'super-secret-key', { expiresIn: '7d' });

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-secret-key');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация ' });
  }
  req.user = payload;
  next();
  return false;
};

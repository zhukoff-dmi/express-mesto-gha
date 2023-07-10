const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const OK = 200;
const ERROR_BAD_REQUEST = 400;
const ERROR_NOT_FOUND = 404;
const CREATED = 201;
const CONFLICT_ERROR = 409;
const ANAUTHORUZED_ERROR = 401;

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' }));
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некоректные данные' }));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданны некоректные данные' });
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(CREATED).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      email: user.email,
      avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        res.status(CONFLICT_ERROR).send({ message: 'Такой Email уже используется' });
      } else if (err instanceof mongoose.Error.ValidationError) {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданны некоректные данные' });
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User
    .findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        next(res.status(ANAUTHORUZED_ERROR).send({ message: 'Неправильные почта или пароль' }));
      }
      return bcrypt.compare(password, user.password)
        .then((isEqual) => {
          if (!isEqual) {
            next(res.status(ANAUTHORUZED_ERROR).send({ message: 'Неправильные почта или пароль' }));
          }
          const token = jwt.sign({ _id: user._id }, 'super-secret-key', { expiresIn: '7d' });
          return res.status(OK).send({ token });
        });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданны некоректные данные' });
      } else {
        next(err);
      }
    });
};

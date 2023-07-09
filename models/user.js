const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле name должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля name - 2'],
    maxlength: [30, 'Максимальная поля name - 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: [true, 'Поле about должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля about - 2'],
    maxlength: [30, 'Максимальная поля about - 30'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (avatar) => validator.isURL(avatar),
      message: 'Некорректный URL',
    },
  },
  email: {
    type: String,
    required: [true, 'Укажите Email'],
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Некорректный формат электронной почты',
    },
  },
  password: {
    type: String,
    required: [true, 'Укажите пароль'],
    select: false,
    minlength: [8, 'Минимальная длина поля password - 8'],
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);

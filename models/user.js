const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле name должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля name - 2'],
    maxlength: [30, 'Максимальная поля name - 30'],
  },
  about: {
    type: String,
    required: [true, 'Поле about должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля about - 2'],
    maxlength: [30, 'Максимальная поля about - 30'],
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);

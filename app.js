const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('Подключено к MongoDB'))
  .catch((err) => {
    console.error('Ошибка подключения к MongoDB:', err);
  });

app.use(express.json());
app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: '649ca1f486d9da27cf15be96',
  };

  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log('Server started on port 3000');
});

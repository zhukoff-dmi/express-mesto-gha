const router = require('express').Router();

const userRouter = require('./users');
const cardsRouter = require('./cards');
const { auth } = require('../middlewares/auth');
const { login, createUSer } = require('../controllers/users');

const validation = require('../middlewares/validation');

router.post('/signin', validation.login, login);
router.post('/signup', validation.createUser, createUSer);

router.use(auth);

router.use('/cards', cardsRouter);
router.use('/users', userRouter);

module.exports = router;

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const authenticationMiddleware = require("./authenticationMiddleware");
const authorizationMiddleware = require("./authorizationMiddleware");
const session = require('express-session');
const MongoStore = require('connect-mongo');

const loginRouter = require('./routes/login');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const customersRouter = require('./routes/customers');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares básicos
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Autenticação com Passport
authenticationMiddleware(passport);

// Sessão com MongoDB
app.use(session({
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    dbName: process.env.MONGO_DB,
    ttl: 30 * 60, // 30 minutos
    autoRemove: "native"
  }),
  secret: process.env.MONGO_STORE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 }, // 30 minutos
  rolling: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Rotas
app.use('/', loginRouter);
app.use('/index', authorizationMiddleware, indexRouter);
app.use('/users', authorizationMiddleware, usersRouter);
app.use('/customers', authorizationMiddleware, customersRouter);

// Catch 404
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

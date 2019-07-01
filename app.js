const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const cors = require('cors');

const indexRouter = require('./routes/index');
const userController = require('./controller/api/user.controller');
const authController = require('./controller/api/auth.controller');
const questionController = require('./controller/api/question.controller');
const tagController = require('./controller/api/tag.controller');
const gameController = require('./controller/api/game.controller');
const mediaController = require('./controller/api/media.controller');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

// Socket.io
const socket_io = require('socket.io');
const io = socket_io();
app.io = io;
require('./controller/socket/socket.controller')(io);

// Routes
app.use('/', indexRouter);
app.use('/api/users', userController);
app.use('/api/auth', authController);
app.use('/api/questions', questionController);
app.use('/api/tags', tagController);
app.use('/api/games', gameController);
app.use('/api/media', mediaController);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

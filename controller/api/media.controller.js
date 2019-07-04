const express = require('express');
const router = express.Router();
const HttpStatus = require('http-status-codes');
const Token = require('../../utils/token/token');
const upload = require('../../utils/image/upload-media');

router.all('*', Token.verifyToken);

router.post('/upload', upload.single('media'), function(req, res, next) {
  if (!req.file) {
    return res.status(HttpStatus.NO_CONTENT).send('No file receive');
  } else {
    return res.status(HttpStatus.CREATED).send(`${process.env.HOST_URL}/uploads/${req.file.filename}`);
  }
});

module.exports = router;

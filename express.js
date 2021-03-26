const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan')

const app = express();

require('./mongoose')

fs.readdirSync(path.join(__dirname + '/models')).forEach(paths => {
    require(path.join(__dirname + '/models/' + paths))
})
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.static('public'));
app.route('/').get((req, res) => {
    res.render(path.join(__dirname + '/index.html'))
})
app.use(clientErrorHandler);
app.use(errorHandler);
fs.readdirSync(path.join(__dirname + '/routes')).forEach(paths => {
    require(path.join(__dirname + '/routes/' + paths))(app)
})
function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
      res.status(500).send({ error: 'Something failed!' });
    } else {
      next(err);
    }
  }
  function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', { error: err });
  }

module.exports = app;
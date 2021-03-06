var boom = require('boom');

module.exports = function (outputTransformer) {
  return function (req, res, next) {
    if (res.boom) throw new Error('boom already exists on response object');

    res.boom = {};

    Object.keys(boom).forEach(function (key) {
      if (typeof boom[key] !== 'function') return;

      res.boom[key] = function () {
        var boomed = boom[key].apply(this, arguments);

        if (typeof outputTransformer === 'function') {
          boomed = outputTransformer(boomed);
        }

        res.status(boomed.output.statusCode).send(boomed.output.payload);
      };
    });

    next();
  };
};
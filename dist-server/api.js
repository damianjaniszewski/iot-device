'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _device = require('./device');

var _device2 = _interopRequireDefault(_device);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.put('/event', function (req, res) {
  if (!req.query.sensorId || !req.query.sensorKey || !req.query.sensorState) {
    console.error('error put event: required query parameters not found');
    console.error('>> query: ', req.query);
    res.status(400).end();
  }

  if (!req.query.sensorLat) req.query.Lat = 52.1698721;
  if (!req.query.sensorLng) req.query.Lng = 21.0151143;
  if (!req.query.sensorType) req.query.Type = 'f0f4371a-9b18-4755-aa89-d5a7152e6525';

  _device2.default.putEvent(req.query.sensorId, req.query.sensorKey, req.query.sensorState, req.query.sensorLat, req.query.sensorLng, req.query.sensorType).then(function (result) {
    if (!result) {
      res.status(409).end();
    } else {
      res.json(result);
    }
  }).catch(function (error) {
    console.error(error);
    res.status(409).end();
  });
});

router.post('/event', function (req, res) {
  if (!req.query.sensorId || !req.query.sensorKey || !req.query.sensorState) {
    console.error('error put event: required query parameters not found');
    console.error('>> query: ', req.query);
    res.status(400).end();
  }

  if (!req.query.sensorLat) req.query.Lat = 52.1698721;
  if (!req.query.sensorLng) req.query.Lng = 21.0151143;
  if (!req.query.sensorType) req.query.Type = 'f0f4371a-9b18-4755-aa89-d5a7152e6525';

  _device2.default.putEvent(req.query.sensorId, req.query.sensorKey, req.query.sensorState, req.query.sensorLat, req.query.sensorLng, req.query.sensorType).then(function (result) {
    if (!result) {
      res.status(409).end();
    } else {
      res.json(result);
    }
  }).catch(function (error) {
    console.error(error);
    res.status(409).end();
  });
});

router.put('/device/:sensorId', function (req, res) {
  _device2.default.registerDevice(req.params.sensorId).then(function (result) {
    if (!result) {
      res.status(409).end();
    } else {
      res.json(result);
    }
  }).catch(function (error) {
    console.error(error);
    res.status(409).end();
  });
});

router.get('/device/:sensorId', function (req, res) {
  _device2.default.getDevice(req.params.sensorId).then(function (result) {
    if (!result) {
      res.status(404).end();
    } else {
      res.json(result);
    }
  }).catch(function (error) {
    console.error(error);
    res.status(404).end();
  });
});

module.exports = router;
//# sourceMappingURL=api.js.map
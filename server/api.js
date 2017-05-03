import express from 'express';
import device from './device';

const router = express.Router();

router.put('/event', (req, res) => {
  if (!req.query.sensorId || !req.query.sensorKey || !req.query.sensorState) {
    console.error('error put event: required query parameters not found');
    console.error('>> query: ', req.query);
    res.status(400).end();
  }

  if (!req.query.sensorLat) req.query.Lat = 52.1698721;
  if (!req.query.sensorLng) req.query.Lng = 21.0151143;
  if (!req.query.sensorType) req.query.Type = 'f0f4371a-9b18-4755-aa89-d5a7152e6525';

  device.putEvent(req.query.sensorId, req.query.sensorKey, req.query.sensorState, req.query.sensorLat, req.query.sensorLng, req.query.sensorType).then((result) => {
    if (!result) {
      res.status(409).end();
    } else {
      res.json(result);
    }
  }).catch((error) => {
    console.error(error);
    res.status(409).end();
  });
});

router.post('/event', (req, res) => {
  if (!req.query.sensorId || !req.query.sensorKey || !req.query.sensorState) {
    console.error('error put event: required query parameters not found');
    console.error('>> query: ', req.query);
    res.status(400).end();
  }

  if (!req.query.sensorLat) req.query.Lat = 52.1698721;
  if (!req.query.sensorLng) req.query.Lng = 21.0151143;
  if (!req.query.sensorType) req.query.Type = 'f0f4371a-9b18-4755-aa89-d5a7152e6525';

  device.putEvent(req.query.sensorId, req.query.sensorKey, req.query.sensorState, req.query.sensorLat, req.query.sensorLng, req.query.sensorType).then((result) => {
    if (!result) {
      res.status(409).end();
    } else {
      res.json(result);
    }
  }).catch((error) => {
    console.error(error);
    res.status(409).end();
  });
});

router.put('/device/:sensorId', (req, res) => {
  device.registerDevice(req.params.sensorId).then((result) => {
    if (!result) {
      res.status(409).end();
    } else {
      res.json(result);
    }
  }).catch((error) => {
    console.error(error);
    res.status(409).end();
  });
});

router.get('/device/:sensorId', (req, res) => {
  device.getDevice(req.params.sensorId).then((result) => {
    if (!result) {
      res.status(404).end();
    } else {
      res.json(result);
    }
  }).catch((error) => {
    console.error(error);
    res.status(404).end();
  });
});


module.exports = router;

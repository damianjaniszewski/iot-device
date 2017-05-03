'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.putEvent = putEvent;
exports.registerDevice = registerDevice;
exports.getDevice = getDevice;

var _azureIothub = require('azure-iothub');

var _azureIothub2 = _interopRequireDefault(_azureIothub);

var _azureIotDeviceMqtt = require('azure-iot-device-mqtt');

var _azureIotDeviceMqtt2 = _interopRequireDefault(_azureIotDeviceMqtt);

var _azureIotDevice = require('azure-iot-device');

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config({ silent: true });

var connectionString = process.env.connectionStringHostName + ';' + process.env.connectionStringSharedAccessKeyName + ';' + process.env.connectionStringSharedAccessKey;

var registry = _azureIothub2.default.Registry.fromConnectionString(connectionString);

function putEvent(sensorId, sensorKey, sensorState, sensorLat, sensorLng, sensorType) {
  return new Promise(function (resolve, reject) {
    var clientConnectionString = process.env.connectionStringHostName + (';DeviceId=' + sensorId) + (';SharedAccessKey=' + sensorKey);
    var client = _azureIotDeviceMqtt2.default.clientFromConnectionString(clientConnectionString);
    var now = new Date();
    client.open(function (err) {
      // if (res) console.log('registry create> status: ' + res.statusCode + ' ' + res.statusMessage);
      if (err) {
        reject(Error(err.toString()));
      } else {
        var data = JSON.stringify({ sensorId: sensorId, sensorState: parseFloat(sensorState), sensorLat: parseFloat(sensorLat), sensorLng: parseFloat(sensorLng), sensorType: sensorType, eventTime: now.getTime() });
        var message = new _azureIotDevice.Message(data);
        // console.log("sending event: " + message.getData());
        client.sendEvent(message, function (err, res) {
          if (err) reject(Error(err.toString()));
          if (res) resolve(res);
        });
      }
    });
  });
}

function registerDevice(sensorId) {
  return new Promise(function (resolve, reject) {
    var device = new _azureIothub2.default.Device(null);
    device.deviceId = sensorId;
    registry.create(device, function (err, deviceInfo, res) {
      // if (res) console.log('registry create> status: ' + res.statusCode + ' ' + res.statusMessage);
      if (err) reject(Error(err.toString()));
      if (deviceInfo) resolve(deviceInfo);
    });
  });
}

function getDevice(sensorId) {
  return new Promise(function (resolve, reject) {
    registry.get(sensorId, function (err, deviceInfo, res) {
      if (err) reject(Error(err.toString()));
      if (deviceInfo) resolve(deviceInfo);
    });
  });
}

exports.default = { putEvent: putEvent, registerDevice: registerDevice, getDevice: getDevice };
//# sourceMappingURL=device.js.map
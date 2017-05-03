import iothub from 'azure-iothub';
import iotdevicemqtt from 'azure-iot-device-mqtt';
import {Message} from 'azure-iot-device';
import dotenv from 'dotenv';

dotenv.config({silent: true});

const connectionString = process.env.connectionStringHostName + ';' + process.env.connectionStringSharedAccessKeyName + ';' + process.env.connectionStringSharedAccessKey;

const registry = iothub.Registry.fromConnectionString(connectionString);

export function putEvent(sensorId, sensorKey, sensorState, sensorLat, sensorLng, sensorType) {
  return new Promise((resolve, reject) => {
    const clientConnectionString = process.env.connectionStringHostName+`;DeviceId=${sensorId}` + `;SharedAccessKey=${sensorKey}`;
    const client = iotdevicemqtt.clientFromConnectionString(clientConnectionString);
    const now = new Date();
    client.open(err => {
      // if (res) console.log('registry create> status: ' + res.statusCode + ' ' + res.statusMessage);
      if (err) {
        reject(Error(err.toString()));
      }
      else {
        var data = JSON.stringify({sensorId: sensorId, sensorState: parseFloat(sensorState), sensorLat: parseFloat(sensorLat), sensorLng: parseFloat(sensorLng), sensorType: sensorType, eventTime: now.getTime()});
        var message = new Message(data);
        // console.log("sending event: " + message.getData());
        client.sendEvent(message, (err, res) => {
          if (err) reject(Error(err.toString()));
          if (res) resolve(res);
        });
      }
    });
  });
}

export function registerDevice(sensorId) {
  return new Promise((resolve, reject) => {
    var device = new iothub.Device(null);
    device.deviceId = sensorId;
    registry.create(device, (err, deviceInfo, res) => {
      // if (res) console.log('registry create> status: ' + res.statusCode + ' ' + res.statusMessage);
      if (err) reject(Error(err.toString()));
      if (deviceInfo) resolve(deviceInfo);
    });
  });
}

export function getDevice(sensorId) {
  return new Promise((resolve, reject) => {
    registry.get(sensorId, (err, deviceInfo, res) => {
      if (err) reject(Error(err.toString()));
      if (deviceInfo) resolve(deviceInfo);
    });
  });
}

export default { putEvent, registerDevice, getDevice };

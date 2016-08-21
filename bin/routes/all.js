import Promise from 'bluebird';

import lifx from '../lifx';

export default class All {

  static on(req, res) {
    let response = {
      successful: [],
      failed: [] };

    let result = lifx.validateDurationParameter(req.body);
    if(result.errors.length > 0) return res.status(400).send(result);

    let {duration} = req.body;

    return lifx.turnOn(lifx.getClient().lights(), duration)
    .then(result => {
      Object.assign(response, result);
      return res.status(200).send(response);
    });
  }

  static off(req, res) {
    let response = {
      successful: [],
      failed: [] };

    let result = lifx.validateDurationParameter(req.body);
    if(result.errors.length > 0) return res.status(400).send(result);


    let {duration} = req.body;

    return lifx.turnOff(lifx.getClient().lights(), duration)
    .then(result => {
      Object.assign(response, result);
      return res.status(200).send(response);
    });
  }

  static colour(req, res) {
    let response = {
      successful: [],
      failed: []
    }
    let cannotContinue = false;

    // Returns results, and also validates integers
    let result = lifx.validateColourParameters(req.body);
    if(result.errors.length > 0) return res.status(400).send(result);

    let {hue, saturation, brightness, kelvin, duration} = req.body;

    return lifx.changeColour(lifx.getClient().lights(), duration, hue, saturation, brightness, kelvin)
    .then(result => {
      Object.assign(response, result);
      return res.status(200).send(response);
    });
  }

  static lightInfo(req, res) {
    return res.status(200).send(lifx.getBulbInfo(lifx.getClient().lights()));
  }

  static lightState(req, res) {
    return lifx.getBulbState(lifx.getClient().lights()).then(result => res.status(200).send(result));
  }

  static firmwareVersion(req, res) {
    return lifx.getFirmwareVersion(lifx.getClient().lights()).then(result => res.status(200).send(result));
  }

  static hardwareVersion(req, res) {
    return lifx.getHardwareVersion(lifx.getClient().lights()).then(result => res.status(200).send(result));
  }

  static firmwareInfo(req, res) {
    return lifx.getFirmwareInfo(lifx.getClient().lights()).then(result => res.status(200).send(result));
  }

  static wifiStats(req, res) {
    return lifx.getWifiStats(lifx.getClient().lights()).then(result => res.status(200).send(result));
  }

  static wifiVersion(req, res) {
    return lifx.getWifiVersion(lifx.getClient().lights()).then(result => res.status(200).send(result));
  }

  static ambientLight(req, res) {
    return lifx.getAmbientLight(lifx.getClient().lights()).then(result => res.status(200).send(result));
  }

};

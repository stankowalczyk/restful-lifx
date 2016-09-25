import Promise from 'bluebird';

import lifx from '../lifx';

export default class LightRoute {

  static on(req, res) {
    let result = lifx.validateDurationParameter(req.body);
    if(result.errors && result.errors.length > 0) return res.status(400).send({ errors: result.errors });

    let {duration} = req.body;

    return lifx.turnOn(req.lights, duration)
    .then(result => {
      return res.status(200).send(result);
    });
  }

  static off(req, res) {
    let result = lifx.validateDurationParameter(req.body);
    if(result.errors && result.errors.length > 0) return res.status(400).send({ errors: result.errors });

    let {duration} = req.body;

    return lifx.turnOff(req.lights, duration)
    .then(result => {
      return res.status(200).send(result);
    });
  }

  static colour(req, res) {
    // Returns results, and also validates integers
    let result = lifx.validateColourParameters(req.body);
    if(result.errors && result.errors.length > 0) return res.status(400).send({ errors: result.errors });

    let {hue, saturation, brightness, kelvin, duration} = req.body;

    return lifx.changeColour(req.lights, duration, hue, saturation, brightness, kelvin)
    .then(result => {
      return res.status(200).send(result);
    });
  }

  static lightInfo(req, res) {
    return res.status(200).send(lifx.getBulbInfo(req.lights));
  }

  static lightState(req, res) {
    return lifx.getBulbState(req.lights).then(result => res.status(200).send(result));
  }

  static firmwareVersion(req, res) {
    return lifx.getFirmwareVersion(req.lights).then(result => res.status(200).send(result));
  }

  static hardwareVersion(req, res) {
    return lifx.getHardwareVersion(req.lights).then(result => res.status(200).send(result));
  }

  static firmwareInfo(req, res) {
    return lifx.getFirmwareInfo(req.lights).then(result => res.status(200).send(result));
  }

  static wifiStats(req, res) {
    return lifx.getWifiStats(req.lights).then(result => res.status(200).send(result));
  }

  static wifiVersion(req, res) {
    return lifx.getWifiVersion(req.lights).then(result => res.status(200).send(result));
  }

  static ambientLight(req, res) {
    return lifx.getAmbientLight(req.lights).then(result => res.status(200).send(result));
  }

};

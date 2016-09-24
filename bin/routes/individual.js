import Promise from 'bluebird';

import lifx from '../lifx';

export default class Individual {

  static checkLight(req, res, next) {
    if (!req.params.light) return res.status(400).send({ error: 'Missing light parameter'} );

    let light = lifx.getClient().light(req.params.light);
    if (!light) return res.status(400).send({ error: `Light with id: '${req.params.light}' not found` });

    req.light = light;
    req.simplifiedLight = lifx.simplifyLightObject(light);

    next();
  }

  static on(req, res) {
    let result = lifx.validateDurationParameter(req.body);
    if(result.errors && result.errors.length > 0) return res.status(400).send({ errors: result.errors });

    let {duration} = req.body;

    return lifx.turnOn([ req.light ], duration)
    .then(result => {
      return res.status(200).send(result);
    });
  }

  static off(req, res) {
    let result = lifx.validateDurationParameter(req.body);
    if(result.errors && result.errors.length > 0) return res.status(400).send({ errors: result.errors });

    let {duration} = req.body;

    return lifx.turnOff([ req.light ], duration)
    .then(result => {
      return res.status(200).send(result);
    });
  }

  static colour(req, res) {
    // Returns results, and also validates integers
    let result = lifx.validateColourParameters(req.body);
    if(result.errors && result.errors.length > 0) return res.status(400).send({ errors: result.errors });

    let {hue, saturation, brightness, kelvin, duration} = req.body;

    return lifx.changeColour([ req.light ], duration, hue, saturation, brightness, kelvin)
    .then(result => {
      return res.status(200).send(result);
    });
  }

  static lightInfo(req, res) {
    return res.status(200).send(lifx.simplifyLightObject(req.light));
  }

  static lightState(req, res) {
    return lifx.getBulbState([ req.light ]).then(result => res.status(200).send(result));
  }

  static firmwareVersion(req, res) {
    return lifx.getFirmwareVersion([ req.light ]).then(result => res.status(200).send(result));
  }

  static hardwareVersion(req, res) {
    return lifx.getHardwareVersion([ req.light ]).then(result => res.status(200).send(result));
  }

  static firmwareInfo(req, res) {
    return lifx.getFirmwareInfo([ req.light ]).then(result => res.status(200).send(result));
  }

  static wifiStats(req, res) {
    return lifx.getWifiStats([ req.light ]).then(result => res.status(200).send(result));
  }

  static wifiVersion(req, res) {
    return lifx.getWifiVersion([ req.light ]).then(result => res.status(200).send(result));
  }

  static ambientLight(req, res) {
    return lifx.getAmbientLight([ req.light ]).then(result => res.status(200).send(result));
  }

};

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

    return req.light.onAsync(duration)
    .then(() => res.status(200).send({ successful: req.simplifiedLight }))
    .catch(err => {
      console.error(err);
      return res.status(400).send({ failed: req.simplifiedLight });
    });
  }

  static off(req, res) {
    let result = lifx.validateDurationParameter(req.body);
    if(result.errors && result.errors.length > 0) return res.status(400).send({ errors: result.errors });

    let {duration} = req.body;

    return req.light.offAsync(duration)
    .then(() => res.status(200).send({ successful: req.simplifiedLight }))
    .catch(err => {
      console.error(err);
      return res.status(400).send({ failed: req.simplifiedLight });
    });
  }

  static colour(req, res) {
    // Returns results, and also validates integers
    let result = lifx.validateColourParameters(req.body);
    if(result.errors && result.errors.length > 0) return res.status(400).send({ errors: result.errors });

    let {hue, saturation, brightness, kelvin, duration} = req.body;

    return req.light.colorAsync(hue, saturation, brightness, kelvin, duration)
    .then(() => res.status(200).send({ successful: req.simplifiedLight }))
    .catch(err => {
      console.error(err);
      return res.status(400).send({ failed: req.simplifiedLight });
    });
  }

  static lightInfo(req, res) {
    return res.status(200).send(req.simplifiedLight);
  }

  static lightState(req, res) {
    return req.light.getStateAsync()
    .then(data => res.status(200).send(Object.assign(req.simplifiedLight, data)))
    .catch(err => {
      console.error(err);
      return res.status(400).send(req.simplifiedLight);
    });
  }

  static firmwareVersion(req, res) {
    return req.light.getFirmwareVersionAsync()
    .then(data => {
      return res.status(200).send(Object.assign(req.simplifiedLight,
        { firmwareMajorVersion: data.majorVersion, firmwareMinorVersion: data.minorVersion }));
    }).catch(err => {
      console.error(err);
      return res.status(200).send(req.simplifiedLight);
    });
  }

  static hardwareVersion(req, res) {
    return req.light.getHardwareVersionAsync()
    .then(data => res.status(200).send(Object.assign(req.simplifiedLight, { hardwareVersion: data })))
    .catch(err => {
      console.error(err);
      return res.status(400).send(req.simplifiedLight);
    });
  }

  static firmwareInfo(req, res) {
    return req.light.getFirmwareInfoAsync()
    .then(data => res.status(200).send(Object.assign(req.simplifiedLight, { firmwareInfo: data })))
    .catch(err => {
      console.error(err);
      return res.status(400).send(req.simplifiedLight);
    });
  }

  static wifiStats(req, res) {
    return req.light.getWifiInfoAsync()
    .then(data => res.status(200).send(Object.assign(req.simplifiedLight, { wifiStats: data })))
    .catch(err => {
      console.error(err);
      return res.status(400).send(req.simplifiedLight);
    });
  }

  static wifiVersion(req, res) {
    return req.light.getWifiVersionAsync()
    .then(data => res.status(200).send(Object.assign(req.simplifiedLight, { wifiVersion: data })))
    .catch(err => {
      console.error(err);
      return res.status(400).send(req.simplifiedLight);
    });
  }

  static ambientLight(req, res) {
    return req.light.getAmbientLightAsync()
    .then(data => res.status(200).send(Object.assign(req.simplifiedLight, { ambientLight: data })))
    .catch(err => {
      console.error(err);
      return res.status(400).send(req.simplifiedLight);
    });
  }

};

import Promise from 'bluebird';

import lifx from '../lifx';

export default class All {
  static on(req, res) {
    let response = {
      successful: [],
      failed: [] };

    Promise.each(lifx.getClient().lights(), (light, index, length) => {
      return new Promise(result => light.on(0, result))
      .then(() => {
        return response.successful.push(lifx.simplifyLightObject(light));
      }).catch(err => {
        console.error(err);
        return response.failed.push(lifx.simplifyLightObject(light));
      });
    }).then(() => {
      return res.status(200).send(response);
    });
  }

  static off(req, res) {
    let response = {
      successful: [],
      failed: [] };

    Promise.each(lifx.getClient().lights(), (light, index, length) => {
      return new Promise(result => light.off(0, result))
      .then(() => {
        return response.successful.push(lifx.simplifyLightObject(light));
      }).catch(err => {
        console.error(err);
        return response.failed.push(lifx.simplifyLightObject(light));
      });
    }).then(() => {
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
    Object.assign(response, result);

    if(response.errors.length > 0) {
      return res.status(400).send(response);
    }

    let {hue, saturation, brightness, kelvin, duration} = req.body;

    Promise.each(lifx.getClient().lights(), (light, index, length) => {
      return new Promise(result => light.color(hue, saturation, brightness, kelvin, duration, result))
      .then(() => {
        return response.successful.push(lifx.simplifyLightObject(light));
      }).catch(err => {
        console.error(err);
        return response.failed.push(lifx.simplifyLightObject(light));
      });
    }).then(() => {
      return res.status(200).send(response);
    });
  };

  static lightInfo(req, res) {
    let response = [];

    lifx.getClient().lights().forEach(light => {
      response.push(lifx.simplifyLightObject(light));
    });

    res.status(200).send(response);
  };

  static lightState(req, res) {
    let response = {
      successful: [],
      failed: []
    };

    Promise.each(lifx.getClient().lights(), (light, index, length) => {
      return Promise.promisifyAll(light).getStateAsync()
      .then(data => {
        return response.successful.push(Object.assign(lifx.simplifyLightObject(light), data));
      }).catch(err => {
        console.error(err);
        return response.failed.push(lifx.simplifyLightObject(light));
      });
    }).then(() => {
      return res.status(200).send(response);
    });
  };
}

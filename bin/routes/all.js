import Promise from 'bluebird';

import lifx from '../lifx';

export default class All {

  static on(req, res) {
    let response = {
      successful: [],
      failed: [] };

    let result = lifx.validateDurationParameter(req.body);
    Object.assign(response, result);

    if(response.errors.length > 0) return res.status(400).send(response);

    let {duration} = req.body;

    return Promise.each(lifx.getClient().lights(), (light, index, length) => {
      return light.onAsync(duration)
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

    let result = lifx.validateDurationParameter(req.body);
    Object.assign(response, result);

    if(response.errors.length > 0) return res.status(400).send(response);

    let {duration} = req.body;

    return Promise.each(lifx.getClient().lights(), (light, index, length) => {
      return light.offAsync(duration)
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

    if(response.errors.length > 0) return res.status(400).send(response);

    let {hue, saturation, brightness, kelvin, duration} = req.body;

    return Promise.each(lifx.getClient().lights(), (light, index, length) => {
      return light.colorAsync(hue, saturation, brightness, kelvin, duration)
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

  static lightInfo(req, res) {
    let response = [];

    lifx.getClient().lights().forEach(light => {
      response.push(lifx.simplifyLightObject(light));
    });

    return res.status(200).send(response);
  }

  static lightState(req, res) {
    let response = {
      successful: [],
      failed: []
    };

    return Promise.each(lifx.getClient().lights(), (light, index, length) => {
      return light.getStateAsync()
      .then(data => {
        return response.successful.push(Object.assign(lifx.simplifyLightObject(light), data));
      }).catch(err => {
        console.error(err);
        return response.failed.push(lifx.simplifyLightObject(light));
      });
    }).then(() => {
      return res.status(200).send(response);
    });
  }

  static firmwareVersion(req, res) {
    let response = {
      successful: [],
      failed: []
    };

    return Promise.each(lifx.getClient().lights(), (light, index, length) => {
      return light.getFirmwareVersionAsync()
      .then(data => {
        return response.successful.push(Object.assign(
          lifx.simplifyLightObject(light),
          { firmwareMajorVersion: data.majorVersion, firmwareMinorVersion: data.minorVersion }));
      }).catch(err => {
        console.error(err);
        return response.failed.push(lifx.simplifyLightObject(light));
      });
    }).then(() => {
      return res.status(200).send(response);
    });
  }

  static hardwareVersion(req, res) {
    let response = {
      successful: [],
      failed: []
    };

    return Promise.each(lifx.getClient().lights(), (light, index, length) => {
      return light.getHardwareVersionAsync()
      .then(data => {
        return response.successful.push(Object.assign(lifx.simplifyLightObject(light), { hardwareVersion: data }));
      }).catch(err => {
        console.error(err);
        return response.failed.push(lifx.simplifyLightObject(light));
      });
    }).then(() => {
      return res.status(200).send(response);
    });
  }

  static firmwareInfo(req, res) {
    let response = {
      successful: [],
      failed: []
    };

    return Promise.each(lifx.getClient().lights(), (light, index, length) => {
      return light.getFirmwareInfoAsync()
      .then(data => {
        return response.successful.push(Object.assign(lifx.simplifyLightObject(light), { firmwareInfo: data }));
      }).catch(err => {
        console.error(err);
        return response.failed.push(lifx.simplifyLightObject(light));
      });
    }).then(() => {
      return res.status(200).send(response);
    });
  }

  static wifiStats(req, res) {
    let response = {
      successful: [],
      failed: []
    };

    return Promise.each(lifx.getClient().lights(), (light, index, length) => {
      return light.getWifiInfoAsync()
      .then(data => {
        return response.successful.push(Object.assign(lifx.simplifyLightObject(light), { wifiStats: data }));
      }).catch(err => {
        console.error(err);
        return response.failed.push(lifx.simplifyLightObject(light));
      });
    }).then(() => {
      return res.status(200).send(response);
    });
  }

  static wifiVersion(req, res) {
    let response = {
      successful: [],
      failed: []
    };

    return Promise.each(lifx.getClient().lights(), (light, index, length) => {
      return light.getWifiVersionAsync()
      .then(data => {
        return response.successful.push(Object.assign(lifx.simplifyLightObject(light), { wifiVersion: data }));
      }).catch(err => {
        console.error(err);
        return response.failed.push(lifx.simplifyLightObject(light));
      });
    }).then(() => {
      return res.status(200).send(response);
    });
  }

  static ambientLight(req, res) {
    let response = {
      successful: [],
      failed: []
    };

    return Promise.each(lifx.getClient().lights(), (light, index, length) => {
      return light.getAmbientLightAsync()
      .then(data => {
        return response.successful.push(Object.assign(lifx.simplifyLightObject(light), { ambientLight: data }));
      }).catch(err => {
        console.error(err);
        return response.failed.push(lifx.simplifyLightObject(light));
      });
    }).then(() => {
      return res.status(200).send(response);
    });
  }

};

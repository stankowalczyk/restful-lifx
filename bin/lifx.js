import Promise from 'bluebird';
import {Client as LifxClient} from 'node-lifx';

let lifxClient;

let inited = false;

export default class Lifx {

  static init() {
    if (inited === false) {
      lifxClient = Promise.promisifyAll(new LifxClient());
      lifxClient.init();

      lifxClient.on('light-new', (light) => {
        lifxClient.devices[light.address] = Promise.promisifyAll(light);
      });

      lifxClient.on('light-online', (light) => {
        lifxClient.devices[light.address] = Promise.promisifyAll(light);
      });

      inited = true;
    }
  }

  static getClient() {
    Lifx.init();
    return lifxClient;
  }

  static simplifyLightObject(light) {
    if (!light) throw new Error('Light must be defined');

    return {
      id: light.id,
      address: light.address,
      port: light.port,
      label: light.label,
      status: light.status
    }
  }

  static validateDurationParameter(reqBody) {
    let result = {
      errors: [],
      warnings: [],
      info: []
    }

    if (!reqBody.duration) {
      result.info.push('Body did not have duration argument, using default (0).');
      reqBody.duration = 0;
    } else if (isNaN(reqBody.duration)) {
      result.warnings.push('Duration is NaN, using default (0).');
      reqBody.duration = 0;
    } else if (reqBody.duration < 0) {
      result.warnings.push('Duration is not greater than zero, using default (0).');
      reqBody.duration = 0;
    }

    reqBody.duration   = parseInt(reqBody.duration, 10);

    return result;
  }

  static validateColourParameters(reqBody) {
    let result = {
      errors: [],
      warnings: [],
      info: []
    }

    if (!reqBody.hue) result.errors.push('Body did not have hue argument.');
    if (!reqBody.saturation) result.errors.push('Body did not have saturation argument.');
    if (!reqBody.brightness) result.errors.push('Body did not have brightness argument.');
    if (result.errors.length > 0) return result;

    if (isNaN(reqBody.hue)) result.errors.push('Hue is NaN.');
    if (isNaN(reqBody.saturation)) result.errors.push('Saturation is NaN.');
    if (isNaN(reqBody.brightness)) result.errors.push('Brightness is NaN.');
    if (result.errors.length > 0) return result;

    reqBody.hue        = parseInt(reqBody.hue, 10);
    reqBody.saturation = parseInt(reqBody.saturation, 10);
    reqBody.brightness = parseInt(reqBody.brightness, 10);
    reqBody.kelvin     = parseInt(reqBody.kelvin, 10);

    if (reqBody.hue < 0 || reqBody.hue > 360) result.errors.push('Hue is not between 0 and 360.');
    if (reqBody.saturation < 0 || reqBody.saturation > 100) result.errors.push('Saturation is not between 0 and 100.');
    if (reqBody.brightness < 0 || reqBody.brightness > 100) result.errors.push('Brightness is not between 0 and 100.');
    if (result.errors.length > 0) return result;

    if (!reqBody.kelvin) {
      result.info.push('Body did not have kelvin argument, using default (3500).');
      reqBody.kelvin = 3500;
    } else if (isNaN(reqBody.kelvin)) {
      result.warnings.push('Kelvin is NaN, using default (3500).');
      reqBody.kelvin = 3500;
    } else if (reqBody.kelvin < 2500 && reqBody.kelvin > 9000) {
      result.warnings.push('Kelvin is not between 2500 and 9000, using default (3500).');
      reqBody.kelvin = 3500;
    }

    let durationResult = Lifx.validateDurationParameter(reqBody);
    result.errors = result.errors.concat(durationResult.errors);
    result.warnings = result.errors.concat(durationResult.warnings);
    result.info = result.errors.concat(durationResult.info);

    return result;
  }

  static turnOn(bulbs = [], duration = 0) {
    let result = {
      successful: [],
      failed: []
    };

    return Promise.each(bulbs, (light, index, length) => {
      return light.onAsync(duration)
      .then(() => {
        return result.successful.push(this.simplifyLightObject(light));
      }).catch(err => {
        console.error(err);
        return result.failed.push(this.simplifyLightObject(light));
      });
    }).then(() => {
      return result;
    });
  }

  static turnOff(bulbs = [], duration = 0) {
    let result = {
      successful: [],
      failed: []
    };

    return Promise.each(bulbs, (bulb, index, length) => {
      return bulb.offAsync(duration)
      .then(() => {
        return result.successful.push(this.simplifyLightObject(bulb));
      }).catch(err => {
        console.error(err);
        return result.failed.push(this.simplifyLightObject(bulb));
      });
    }).then(() => {
      return result;
    });
  }

  static changeColour(bulbs = [], duration = 0, hue, saturation, brightness, kelvin) {
    let result = {
      successful: [],
      failed: []
    };

    return Promise.each(bulbs, (bulb, index, length) => {
      return bulb.colorAsync(hue, saturation, brightness, kelvin, duration)
      .then(() => {
        return result.successful.push(this.simplifyLightObject(bulb));
      }).catch(err => {
        console.error(err);
        return result.failed.push(this.simplifyLightObject(bulb));
      });
    }).then(() => {
      return result;
    });
  }

  static getBulbInfo(bulbs = []) {
    return bulbs.map(bulb => {
      return this.simplifyLightObject(bulb);
    })
  }

  static getBulbState(bulbs = []) {
    let result = {
      successful: [],
      failed: []
    };

    return Promise.each(bulbs, (bulb, index, length) => {
      return bulb.getStateAsync()
      .then(data => {
        return result.successful.push(Object.assign(this.simplifyLightObject(bulb), data));
      }).catch(err => {
        console.error(err);
        return result.failed.push(this.simplifyLightObject(bulb));
      });
    }).then(() => {
      return result;
    });
  }

  static getFirmwareVersion(bulbs = []) {
    let result = {
      successful: [],
      failed: []
    };

    return Promise.each(bulbs, (bulb, index, length) => {
      return bulb.getFirmwareVersionAsync()
      .then(data => {
        return result.successful.push(Object.assign(
          this.simplifyLightObject(bulb),
          { firmwareMajorVersion: data.majorVersion, firmwareMinorVersion: data.minorVersion }));
      }).catch(err => {
        console.error(err);
        return result.failed.push(this.simplifyLightObject(bulb));
      });
    }).then(() => {
      return result;
    });
  }

  static getHardwareVersion(bulbs = []) {
    let result = {
      successful: [],
      failed: []
    };

    return Promise.each(bulbs, (bulb, index, length) => {
      return bulb.getHardwareVersionAsync()
      .then(data => {
        return result.successful.push(Object.assign(this.simplifyLightObject(bulb), { hardwareVersion: data }));
      }).catch(err => {
        console.error(err);
        return result.failed.push(this.simplifyLightObject(bulb));
      });
    }).then(() => {
      return result;
    });
  }

  static getFirmwareInfo(bulbs = []) {
    let result = {
      successful: [],
      failed: []
    };

    return Promise.each(bulbs, (bulb, index, length) => {
      return bulb.getFirmwareInfoAsync()
      .then(data => {
        return result.successful.push(Object.assign(this.simplifyLightObject(bulb), { firmwareInfo: data }));
      }).catch(err => {
        console.error(err);
        return result.failed.push(this.simplifyLightObject(bulb));
      });
    }).then(() => {
      return result;
    });
  }

  static getWifiStats(bulbs = []) {
    let result = {
      successful: [],
      failed: []
    };

    return Promise.each(bulbs, (bulb, index, length) => {
      return bulb.getWifiInfoAsync()
      .then(data => {
        return result.successful.push(Object.assign(this.simplifyLightObject(bulb), { wifiStats: data }));
      }).catch(err => {
        console.error(err);
        return result.failed.push(this.simplifyLightObject(bulb));
      });
    }).then(() => {
      return result;
    });
  }

  static getWifiVersion(bulbs = []) {
    let result = {
      successful: [],
      failed: []
    };

    return Promise.each(bulbs, (bulb, index, length) => {
      return bulb.getWifiVersionAsync()
      .then(data => {
        return result.successful.push(Object.assign(this.simplifyLightObject(bulb), { wifiVersion: data }));
      }).catch(err => {
        console.error(err);
        return result.failed.push(this.simplifyLightObject(bulb));
      });
    }).then(() => {
      return result;
    });
  }

  static getAmbientLight(bulbs = []) {
    let result = {
      successful: [],
      failed: []
    };

    return Promise.each((bulbs), (bulb, index, length) => {
      return bulb.getAmbientLightAsync()
      .then(data => {
        return result.successful.push(Object.assign(this.simplifyLightObject(bulb), { ambientLight: data }));
      }).catch(err => {
        console.error(err);
        return result.failed.push(this.simplifyLightObject(bulb));
      });
    }).then(() => {
      return result;
    });
  }

}

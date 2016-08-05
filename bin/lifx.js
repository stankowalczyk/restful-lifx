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

    if (reqBody.hue < 0 && reqBody.hue > 360) result.errors.push('Hue is not between 0 and 360.');
    if (reqBody.saturation < 0 && reqBody.saturation > 100) result.errors.push('Saturation is not between 0 and 100.');
    if (reqBody.brightness < 0 && reqBody.brightness > 100) result.errors.push('Brightness is not between 0 and 100.');
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

    reqBody.hue        = parseInt(reqBody.hue, 10);
    reqBody.saturation = parseInt(reqBody.saturation, 10);
    reqBody.brightness = parseInt(reqBody.brightness, 10);
    reqBody.kelvin     = parseInt(reqBody.kelvin, 10);
    reqBody.duration   = parseInt(reqBody.duration, 10);

    return result;
  }
}

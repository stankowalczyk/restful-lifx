import Promise from 'bluebird';
import {Client as LifxClient} from 'node-lifx';

let lifxClient;

let inited = false;

export default class Lifx {
  static init() {
    if (inited === false) {
      lifxClient = Promise.promisifyAll(new LifxClient());
      lifxClient.init();
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
}

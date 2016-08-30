# restful-lifx
A NodeJS RESTful API for interacting with your [LIFX](http://www.lifx.com/) bulbs locally.

## Getting started

1. Clone or download the repo as a zip (and extract).
2. Open a terminal or command prompt window, navigate to the repo.
3. Run `npm install`.
4. Run `npm start`.
5. The server will start on port 8080. If you get an error like this: `Error: listen EACCES 0.0.0.0:8080` it means something else is already using port 8080 and you will need to pick a new port - see _Running on a custom port_.

### Running on a custom port

If you wish to use a custom port, supply it as an argument like so: `npm start 3000`, or as an environment variable named `RESTFUL_LIFX_PORT`.

## License

This project is licensed under the terms of the BSD 3-Clause license. Please see the LICENSE file.

## Disclaimer

This project uses [node-LIFX](https://www.npmjs.com/package/node-lifx) in order to facilitate communication with LIFX bulbs. This project not affiliated by any parties involved with [node-LIFX](https://www.npmjs.com/package/node-lifx). This project is not affiliated with [LiFi Labs, the makers of LIFX](http://www.lifx.com/pages/about).

## Endpoints

You can either control all lights, or an individual like. The endpoint for controlling all lights starts with `/all`, and endpoints which control an individual light start with `/:light` (where `:light` is a bulb id or Ip address).

### Client

#### Start bulb discovery

Endpoint: `PUT /api/startDiscovery` or `PUT /api/startdiscovery`

Returns blank body, refer to Http status code.

#### Stop bulb discovery

Endpoint: `PUT /api/stopDiscovery` or `PUT /api/stopdiscovery`

Returns blank body, refer to Http status code.

### Lights

#### Get all lights

Endpoint: `GET /api/all/bulbs`

Returns JSON, an array of all lights with basic information about them.

#### On

Endpoint `PUT /api/all/on` or `PUT /api/:light/on`

Turns on the specified bulb(s). Returns JSON specifying lights which succeeded and those which failed.

#### Off

Endpoint `PUT /api/all/off` or `PUT /api/:light/off`

Turns off the specified bulb(s). Returns JSON specifying lights which succeeded and those which failed.

#### Colour

Endpoint `PUT /api/all/colour` or `PUT /api/:light/colour`

With parameters: Duration (in milliseconds), Hue (0 ... 360), Saturation (0 ... 100), Brightness (0 ... 100), and Kelvin (2500 ... 9000).

Applies a colour to the specified bulb(s). Returns JSON specifying lights which succeeded and those which failed.

#### Info

Endpoint `GET /api/all/info` or `GET /api/:light/info` or `GET /api/all/information` or `GET /api/:light/information`

Gets basic light information about the specified bulb(s). Returns JSON.

#### State

Endpoint `GET /api/all/state` or `GET /api/:light/state`

Gets the current state of the specified bulb(s). Returns JSON.

#### Firmware Version

Endpoint `GET /api/all/firmware` or `GET /api/:light/firmware`

Gets information about the firmware version of the specified bulb(s). Returns JSON.

#### Hardware Version

Endpoint `GET /api/all/hardware` or `GET /api/:light/firmware`

Gets information about the hardware version of the specified bulb(s). Returns JSON.

#### Firmware Information

Endpoint `GET /api/all/firmwareinfo` or `GET /api/:light/firmwareinfo` or `GET /api/all/firmwareinfo` or `GET /api/:light/firmwareinfo`

Gets firmware information for the specified bulb(s). Returns JSON.

#### Wifi Statistics

Endpoint `GET /api/all/wifistats` or `GET /api/:light/wifistats` or `GET /api/all/wifiStats` or `GET /api/:light/wifiStats`

Gets Wifi statistics for the specified bulb(s). Returns JSON.

#### Wifi Version

Endpoint `GET /api/all/wifiversion` or `GET /api/:light/wifiversion` or `GET /api/all/wifiVersion` or `GET /api/:light/wifiVersion`

Gets Wifi version information for the specified bulb(s). Returns JSON.

#### Ambient Light

Endpoint `GET /api/all/ambientlight` or `GET /api/:light/ambientlight` or `GET /api/all/ambientLight` or `GET /api/:light/ambientLight`

Gets information about the ambient light hitting the bulb, for the specified bulb(s). Returns JSON.

## Contribution

NodeJS and ES6 are not my forte, apologies in advance about code quality.

This project I intend to use personally, and have published it with the hope it may be useful to others. For the moment this repo will be publish only, serving as a means through which others can view and use my code.

Currently I am short of free time I can dedicate to maintaining this project, but I aim to continue updating it in the future. Because of this pull requests or issue tickets may be ignored or closed.

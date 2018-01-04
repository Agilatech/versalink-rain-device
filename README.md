## VersaLink Tipping Bucket Rain Gauge device driver

This device driver is specifically designed to be used with the Agilatech® VersaLink IIoT Platform.
Please see [agilatech.com](https://agilatech.com/software) to download a copy of the system. 

### Install
```
$> npm install @agilatech/versalink-rain-device
```

### Design

This device driver is designed to keep track of the total amount of rainfall during a 24-hour period beginning at midnight local time.  It is meant to be used with an analog-style tipping bucket guage, in which a tipping bucket momentarily closes a switch which privides the pulse to register a tip event.  In this type of device, a small bucket collects rainfall, and tips and empties when a predetermined volume has been reached.  In this manner, individual tip events can be tallied and used to total rainfall.

This driver is programmed to reset at midnight local time. A side effect of this reset is that a data event will be initiated.  All data events with an amount value of 0 can therefore be safely ignored.


### Usage
This device driver is designed to be consumed by the Agilatech® VersaLink IIoT system.  As such, it is not really applicable or useful in other environments.

To use it with VersaLink, insert its object definition as an element in the devices array in the _devlist.json_ file.
```
{
  "name": "RAIN",
  "module": "@agilatech/versalink-rain-device",
  "options": {
    "devicePoll": 3600000,
    "streamPeriod": 0
  }
}
```


#### Device config object
The device config object is an element in the devlist.json device configuration file, which is located in the VersaLink root directory.  It is used to tell the VersaLink system to load the device, as well as several operational parameters.

_name_ is simply the name given to the device.  This name can be used in queries and for other identifcation purposes.

_module_ is the name of the npm module. The module is expected to exist in this directory under the _node_modules_ directory.  If the module is not strictly an npm module, it must still be found under the node_modules directory.

_options_ is an object within the device config object which defines all other operational parameters.  In general, any parameters may be defined in this options object, and most modules will have many several.  The three which are a part of every VersaLink device are 'devicePoll', 'streamPeriod', and 'deltaPercent'. The deviceName options also can define the gpio pin number and the amount of rain per bucket tip.

```
"devicePoll":<period>
Period in milliseconds in which device will be polled

"streamPeriod":<period>
Period in milliseconds for broadcast of streaming values

"gpio":<I/O pin number>
The pin interface to which the tip switch is connected

"tipAmount":<mm rain>
The amount of rain in mm per bucket tip 
```

#### streamPeriod and devicePoll
These config have little applicability for an event-based sensor such as this.  Since this sensor simply updates the monitored variable each and every time the rain bucket tips, it makes little sense to stream the value or poll the device for a new value.  Because of this, it is advisable to **set streamPeriod to 0**, which disables streaming, and set the devicePoll to some arbitrarily large value. Regardless of the setting of these config, the value **amount** will be updated whenever a bucket tip event is registered.

#### module config 
Every module released by Agilatech includes configuration in a file named 'config.json' and we encourage any other publishers to follow the same pattern.  The parameters in this file are considered defaults, since they are overriden by definitions appearing in the options object of the VersaLink devlist.json file.

The construction of the config.json mirrors that of the options object, which is simply a JSON object with key/value pairs.
Here is an example of an 'config.json' file which disables streaming, polls the device every hour, sets the GPIO pin number to 60, and the rain increment per bucket tip to 0.254mm:
```
{
    "streamPeriod":0, 
    "devicePoll":3600000,
    "gpio":60,
    "tipAmount":0.254
}
```

  
#### Default values
If not specified in the config object, the program uses the following default values:
* _streamPeriod_ : 10000 (10,000ms or 10 seconds)
* _devicePoll_ : 1000 (1,000ms or 1 second)


### Properties
All drivers contain the following 4 core properties:
1. **state** : the current state of the device, containing either the value *chron-on* or *chron-off* 
to indicate whether the device is monitoring data isochronally (a predefinied uniform time period of device data query).
2. **id** : the unique id for this device.  This device id is used to subscribe to this device streams.
3. **name** : the given name for this device.
4. **type** : the given type category for this device,  (_sensor_, _actuator_, etc)


#### Monitored Properties
In the *on* state, the driver software for this device monitors three values.
1. **amount** - The total amount of rain so far in this 24-hour period

  
#### Streaming Properties
For this device, it is usual to disable streaming.  However, if it is not disabled, while in the *on* state, the driver software continuously streams this value in isochronal fashion with a period defined by *streamPeriod*. Note that a *streamPeriod* of 0 disables streaming.
1. **amount_stream**
  

### State
This device driver has a binary state: __on__ or __off__. When off, no parameter values are streamed or available, and no commands are accepted other than the _turn-on_ transition. When on, the device is operations and accepts all commands.  The initial state is _off_.
  
  
### Transitions
1. **turn-on** : Sets the device state to *on*. When on, the device is operational and accepts all commands. Values are streamed, and the device is polled periodically to keep monitored values up to date.

2. **turn-off** : Sets the device state to *off*, When off, no parameter values are streamed or available, and no commands are accepted other than the _turn-on_ transition.


### Compatibility
VersaLink will operate on any computer from a small single board computer up to large cloud server, using any of the following operating systems:
* 32 or 64-bit Linux
* Windows 7 and up
* macOS and OS X
* SunOS
* AIX


### Copyright
Copyright © 2018 [Agilatech®](https://agilatech.com). All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

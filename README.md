##VersaLink Tipping Bucket Rain Gauge device driver

This device driver is specifically designed to be used with the Agilatech VersaLink IOT System.

###Install
```
$> npm install @agilatech/versalink-rain-device
```

###Usage
This device driver is designed to be consumed by the Agilatech VersaLink IOT system.
```
const versalink = require('@agilatech/versalink-server');
var rain = require('@agilatech/versalink-rain-device');

versalink()
.use(rain, [options])  // where [options] define operational paramters -- omit to accept defaults
.listen(<port number>)   // where <port number> is the port on which the zetta server should listen
```

####options
_options_ is an object which contains key/value pairs used for driver configuration.

```
"streamPeriod":<period>
Period in milliseconds for broadcast of streaming values

"devicePoll":<period>
Period in milliseconds in which device will be polled

"gpio":<I/O pin number>
The pin interface to which the tip switch is connected

"tipAmount":<mm rain>
The amount of rain in mm per bucket tip 
```

####streamPeriod and devicePoll
These options have little applicability for an event-based sensor such as this.  Since this sensor simply updates the monitored variable each and every time the rain bucket tips, it makes little sense to stream the value or poll the device for a new value.  Because of this, it is advisable to **set streamPeriod to 0**, which disables streaming, and set the devicePoll to some arbitrarily large value. Regardless of the setting of these options, the value **amount** will be updated whenever a bucket tip event is registered.

####options example
Here is an example of an options varible which disables streaming, polls the device every hour, sets the GPIO pin number to 60, and the rain increment per bucket tip to 0.254mm:
```
const options = {
    "streamPeriod":0, 
    "devicePoll":3600000,
    "gpio":60,
    "tipAmount":0.254
}
```

  
####Default values
If not specified in the options object, the program uses the following default values:
* _streamPeriod_ : 10000 (10,000ms or 10 seconds)
* _devicePoll_ : 1000 (1,000ms or 1 second)

    
####&lt;port number&gt;
Agilatech has definied the open port number 1107 as its standard default for IIOT (Industrial Internet Of Things) server application. In practice, most any port above 1024 may be used.


###Example
Using directly in the zetta server, and accepting all defaults:
```
const zetta = require('zetta');
const sensor = require('versalink-rain-device');
zetta().use(sensor).listen(1107);
```

To easily specify some options, simply supply them in an object in the use statement like this:
```
zetta().use(sensor, { "bus":"/dev/i2c-0", "streamPeriod":0, "gpio":44, "tipAmount":0.36 });
```
Overrides the defaults to initialize the bus on **/dev/i2c-0** while **disabling streaming**, setting the I/O pin to 44, and specifying 0.36mm as the amount to increment total rain for each bucket tip.

###Properties
All drivers contain the following 4 core properties:
1. **state** : the current state of the device, containing either the value *chron-on* or *chron-off* 
to indicate whether the device is monitoring data isochronally (a predefinied uniform time period of device data query).
2. **id** : the unique id for this device.  This device id is used to subscribe to this device streams.
3. **name** : the given name for this device.
4. **type** : the given type category for this device,  (_sensor_, _actuator_, etc)


####Monitored Properties
In the *on* state, the driver software for this device monitors three values.
1. **amount** - param definition

  
####Streaming Properties
For this device, it is usual to disable streaming.  However, if it is not disabled, while in the *on* state, the driver software continuously streams this value in isochronal fashion with a period defined by *streamPeriod*. Note that a *streamPeriod* of 0 disables streaming.
1. **amount_stream**
  

###State
This device driver has a binary state: __on__ or __off__. When off, no parameter values are streamed or available, and no commands are accepted other than the _turn-on_ transition. When on, the device is operations and accepts all commands.  The initial state is _off_.
  
  
###Transitions
1. **turn-on** : Sets the device state to *on*. When on, the device is operational and accepts all commands. Values are streamed, and the device is polled periodically to keep monitored values up to date.

2. **turn-off** : Sets the device state to *off*, When off, no parameter values are streamed or available, and no commands are accepted other than the _turn-on_ transition.

###Design

This device driver is designed to keep track of the total amount of rainfall during a 24-hour period beginning at midnight local time.  It is meant to be used with an analog-style tipping bucket guage, in which a tipping bucket momentarily closes a switch which privides the pulse to register a tip event.  In this type of device, a small bucket collects rainfall, and tips and empties when a predetermined volume has been reached.  In this manner, individual tip events can be tallied and used to total rainfall.

This driver is programmed to reset at midnight local time. A side effect of this reset is that a data event will be initiated.  All data events with an amount value of 0 can therefore be safely ignored.

### Hardware

* Beaglebone Black
* Beaglebone Green
* Should also work on Raspberry Pi as well as other Linux SBC


###Copyright
Copyright © 2016 Agilatech. All Rights Reserved.

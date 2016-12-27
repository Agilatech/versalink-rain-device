/*
Copyright © 2016 Agilatech. All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy 
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const VersalinkDevice = require('versalink-device');
const device = require('@agilatech/rain');

module.exports = class Rain extends VersalinkDevice {
    
    constructor(options) {

        const gpio = options.gpio;
        const tipAmount = options['tipAmount']; // || 0.25; // assume .25mm/tip if not given
        
        const hardware = new device(gpio, tipAmount);

        super(hardware, options);

        this.hardware.watchValueAtIndex(0, (this._tipEvent).bind(this));

        this._resetTimer = null;
        this._executeReset();
        
    }

    _tipEvent(err, val) {
        if (err) {
            this.error("Rain Gauge bucket tip error: " + err, {"error":err});
        }
        else {
            const propertyName = this.hardware.nameAtIndex(0);
            this[propertyName] = val;
            this.deviceProperties[propertyName].cur = val;
        }
    }

    _createNewResetTimer(milliseconds) {
        var self = this;

        // We want to zero the amount at midnight every day
        this._resetTimer = setTimeout(function() {
            self._executeReset();
        }, milliseconds); 
    }

    _executeReset() {
        const propertyName = this.hardware.nameAtIndex(0);

        clearTimeout(this._resetTimer);
        this.hardware.resetValueAtIndex(0);
        this.deviceProperties[propertyName].cur = 0;
        this[propertyName] = 0;
        this._createNewResetTimer(this._millisecondsUntilMidnight());
    }

    _millisecondsUntilMidnight() {
        const curDate = new Date();
        return 86400000 - ((((curDate.getHours() * 3600) + (curDate.getMinutes() * 60) + curDate.getSeconds()) * 1000) + curDate.getMilliseconds());
    }
}





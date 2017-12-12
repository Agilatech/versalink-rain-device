
const VersalinkDevice = require('@agilatech/versalink-device');
const device = require('@agilatech/rain');

module.exports = class Rain extends VersalinkDevice {
    
    constructor(config) {

        const gpio = config.gpio;
        const tipAmount = config['tipAmount']; // || 0.25; // assume .25mm/tip if not given
        
        const hardware = new device(gpio, tipAmount);

        super(hardware, config);

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





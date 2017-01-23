
const options = require('./options');

const Scout = require('zetta-scout');
const rain = require('./rain');
const util = require('util');

const RainScout = module.exports = function(opts) {
    
  // see if any of the options were overridden in the server

  if (typeof opts !== 'undefined') {
    // copy all options defined in the server
    for (const key in opts) {
      if (typeof opts[key] !== 'undefined') {
        options[key] = opts[key];
      }
    }
  }

  Scout.call(this);
};

util.inherits(RainScout, Scout);

RainScout.prototype.init = function(next) {

  const Rain = new rain(options);

  const query = this.server.where({name: 'RAIN'});
  
  const self = this;
  this.server.find(query, function(err, results) {
    if (results[0]) {
      self.provision(results[0], Rain, options);
      self.server.info('Provisioned known device RAIN');
    } else {
      self.discover(Rain, options);
      self.server.info('Discovered new device RAIN');
    }
  });

  next();

};

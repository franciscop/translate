// From https://www.npmjs.com/package/memory-cache (Rollup didn't want to bundle it otherwise)
function Cache() {
  var _cache = Object.create(null);
  var _size = 0;

  this.put = function(key, value, time, timeoutCallback) {
    if (
      typeof time !== "undefined" &&
      (typeof time !== "number" || isNaN(time) || time <= 0)
    ) {
      throw new Error("Cache timeout must be a positive number");
    } else if (
      typeof timeoutCallback !== "undefined" &&
      typeof timeoutCallback !== "function"
    ) {
      throw new Error("Cache timeout callback must be a function");
    }

    var oldRecord = _cache[key];
    if (oldRecord) {
      clearTimeout(oldRecord.timeout);
    } else {
      _size++;
    }

    var record = {
      value: value,
      expire: time + Date.now()
    };

    if (!isNaN(record.expire)) {
      record.timeout = setTimeout(
        function() {
          _del(key);
          if (timeoutCallback) {
            timeoutCallback(key, value);
          }
        }.bind(this),
        time
      );
    }

    _cache[key] = record;

    return value;
  };

  this.del = function(key) {
    var canDelete = true;

    var oldRecord = _cache[key];
    if (oldRecord) {
      clearTimeout(oldRecord.timeout);
      if (!isNaN(oldRecord.expire) && oldRecord.expire < Date.now()) {
        canDelete = false;
      }
    } else {
      canDelete = false;
    }

    if (canDelete) {
      _del(key);
    }

    return canDelete;
  };

  function _del(key) {
    _size--;
    delete _cache[key];
  }

  this.clear = function() {
    for (var key in _cache) {
      clearTimeout(_cache[key].timeout);
    }
    _size = 0;
    _cache = Object.create(null);
  };

  this.get = function(key) {
    var data = _cache[key];
    if (typeof data != "undefined") {
      if (isNaN(data.expire) || data.expire >= Date.now()) {
        return data.value;
      } else {
        // free some space
        _size--;
        delete _cache[key];
      }
    }
    return null;
  };
}

const exp = new Cache();
exp.Cache = Cache;
export default exp;

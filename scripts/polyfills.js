// TheWitcherTRPG uses some polyfill functions internally. When this module calls some actor or sheet methods, 
// these will be undefined, so I need the same polyfills here as well.

Array.prototype.sum = function (prop) {
  var total = 0;
  for (var i = 0, _len = this.length; i < _len; i++) {
    if (this[i]["system"][prop]) {
      total += Number(this[i]["system"][prop]);
    }
    else if (this[i]["system"]["system"][prop]) {
      total += Number(this[i]["system"]["system"][prop]);
    }
  }
  return total;
}

Array.prototype.weight = function () {
  var total = 0;
  for (var i = 0, _len = this.length; i < _len; i++) {
      if (this[i]["system"]["weight"] && this[i]["system"]["quantity"]) {
        total += Number(this[i]["system"]["quantity"]) * Number(this[i]["system"]["weight"]);
      }
  }
  return Math.ceil(total);
}

Array.prototype.cost = function () {
  var total = 0;
  for (var i = 0, _len = this.length; i < _len; i++) {
      if (this[i]["system"]["cost"] && this[i]["system"]["quantity"]) {
        total += Number(this[i]["system"]["quantity"]) * Number(this[i]["system"]["cost"]);
      }
  }
  return Math.ceil(total);
}

// Own polyfills
String.prototype.toCapitalCase = function() {
    const words = this.split(' ');
    return words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
if (!String.prototype.getPath) {
  String.prototype.getPath = function () {
    'use strict';
    if (this == null) {
      throw new TypeError('can\'t convert ' + this + ' to object');
    }
    var str = '' + this;
    if (str.length == 0) {
      return '';
    }
    str = str.replace(/\[(\d+?)\]/g, function (s, m1) { return '[' + (m1 - 1) + ']'; })
      .replace(/\/{2}/g, '')
      .replace(/\/+/g, ' > ')
      .replace(/@/g, '')
      .replace(/\[(\d+)\]/g, ':eq($1)')
      .replace(/^\s+/, '');
    return $(str);
  }
}
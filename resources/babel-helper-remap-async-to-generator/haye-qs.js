"use strict";function Qs(a,e){e.add();for(var r=a.length,t=0,d="name",n=!1;t<r;){var o=a[t++],s=o.charCodeAt(0);91===s?n=!0:93===s?n=!1:61===s||44===s&&n?(d="arg",e.shiftValue()):44===s?(d="name",e.add()):"arg"===d?e.appendValue(o):e.appendKey(o,s)}return e.toJSON()}module.exports=Qs;
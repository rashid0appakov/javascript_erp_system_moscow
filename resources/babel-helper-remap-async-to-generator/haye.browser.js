var haye=function(){"use strict";function n(n,e){e.add();for(var r=n.length,t=0,u="name";t<r;){var o=n[t++],a=o.charCodeAt(0);58===a||44===a?(u="arg",e.shiftValue()):124===a?(u="name",e.add()):"arg"===u?e.appendValue(o):e.appendKey(o,a)}return e.toJSON()}function e(n,e){e.add();for(var r=n.length,t=0,u="name",o=!1;t<r;){var a=n[t++],i=a.charCodeAt(0);91===i?o=!0:93===i?o=!1:61===i||44===i&&o?(u="arg",e.shiftValue()):44===i?(u="name",e.add()):"arg"===u?e.appendValue(a):e.appendKey(a,i)}return e.toJSON()}function r(){return{nodes:[],currentNode:null,add:function(){this.currentNode={name:"",args:[]},this.nodes.push(this.currentNode)},appendKey:function(n,e){32!==e&&(this.currentNode.name+=n)},appendValue:function(n){this.currentNode.args[this.currentNode.args.length-1]+=n},shiftValue:function(){this.currentNode.args.push("")},toJSON:function(){return this.nodes}}}function t(){return{nodes:[],currentNode:null,add:function(){this.currentNode={name:"",args:[]},this.nodes.push(this.currentNode)},appendKey:function(n,e){32!==e&&(this.currentNode.name+=n)},appendValue:function(n){this.currentNode.args[this.currentNode.args.length-1]+=n},shiftValue:function(){this.currentNode.args.push("")},toJSON:function(){return this.nodes.reduce(function(n,e){return n[e.name]=e.args,n},{})}}}return{fromPipe:function(e){return{toArray:function(){return n(e,new r)},toJSON:function(){return n(e,new t)}}},fromQS:function(n){return{toArray:function(){return e(n,new r)},toJSON:function(){return e(n,new t)}}}}}();
// Generated by CoffeeScript 1.3.3
(function() {
  var Child, Derp, Grandparent, Parent,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Grandparent = (function() {

    function Grandparent() {}

    Grandparent.prototype.hi = 'hi';

    return Grandparent;

  })();

  Parent = (function(_super) {

    __extends(Parent, _super);

    function Parent() {
      return Parent.__super__.constructor.apply(this, arguments);
    }

    Parent.prototype.hi = 'ralph';

    return Parent;

  })(Grandparent);

  Child = (function(_super) {

    __extends(Child, _super);

    function Child() {
      return Child.__super__.constructor.apply(this, arguments);
    }

    Child.prototype.hi = 'UP';

    return Child;

  })(Parent);

  Derp = (function() {

    function Derp() {}

    Derp.prototype.hi = 'no';

    return Derp;

  })();

  module.exports = {
    Grandparent: Grandparent,
    Parent: Parent,
    Child: Child,
    Derp: Derp
  };

}).call(this);

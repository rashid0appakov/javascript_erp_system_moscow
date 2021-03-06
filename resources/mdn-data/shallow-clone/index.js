'use strict';

var Paginator = require('terminal-paginator');
var debug = require('debug')('prompt-choices');
var define = require('define-property');
var extend = require('extend-shallow');
var visit = require('collection-visit');
var Choice = require('./lib/choice');
var utils = require('./lib/utils');

/**
 * Create a new `Choices` collection.
 *
 * ```js
 * var choices = new Choices(['foo', 'bar', 'baz']);
 * var choices = new Choices([{name: 'foo'}, {name: 'bar'}, {name: 'baz'}]);
 * ```
 * @param {Array} `choices` One or more `choice` strings or objects.
 * @api public
 */

function Choices(choices, options) {
  debug('initializing from <%s>', __filename);
  if (utils.isObject(choices) && choices.isChoices) {
    return choices;
  }

  define(this, 'isChoices', true);
  this.options = extend({}, options);
  this.answers = this.options.answers || {};
  this.paginator = new Paginator(this.options);
  this.choices = [];
  this.items = [];
  this.keymap = {};
  this.keys = [];
  this.original = [];
  this.position = 0;

  if (choices) {
    this.original = utils.clone(choices);
    this.addChoices(choices);
  }
}

/**
 * Render choices.
 *
 * @param {Number} `position` Cursor position
 * @param {Object} `options`
 * @return {String}
 * @api public
 */

Choices.prototype.render = function(position, options) {
  var opts = utils.extend({limit: 7}, this.options, options);
  var buf = '';

  if (opts.radio === true) {
    opts.limit += 2;
  }

  this.position = position || 0;
  for (var i = 0; i < this.choices.length; i++) {
    buf += this.choices[i].render(this.position, opts);
  }

  var str = '\n' + buf.replace(/\s+$/, '');
  return this.paginator.paginate(str, this.position, opts);
};

/**
 * Create a new `Choice` object.
 *
 * ```js
 * choices.choice('blue');
 * ```
 * @param {String|Object} `choice`
 * @return {Object} Returns a choice object.
 * @api public
 */

Choices.prototype.choice = function(choice) {
  return new Choice(choice, this.options);
};

/**
 * Returns a normalized `choice` object.
 *
 * ```js
 * choices.toChoice('foo');
 * choices.toChoice({name: 'foo'});
 * ```
 * @param {Object|String} `choice`
 * @return {Object}
 * @api public
 */

Choices.prototype.toChoice = function(choice) {
  if (choice.type === 'separator') {
    if (!choice.isSeparator) {
      choice = this.separator(choice.line, this.options);
    }
    return choice;
  }
  return this.choice(choice);
};

/**
 * Add a normalized `choice` object to the `choices` array.
 *
 * ```js
 * choices.addChoice(['foo', 'bar', 'baz']);
 * ```
 * @param {string|Object} `choice` One or more choices to add.
 * @api public
 */

Choices.prototype.addChoice = function(choice) {
  choice = this.toChoice(choice);
  if (!choice.disabled && choice.type !== 'separator') {
    choice.index = this.items.length;
    this.keymap[choice.key] = choice;
    this.keys.push(choice.key);
    this.items.push(choice);
  }
  this.choices.push(choice);
  return this;
};

/**
 * Add an array of normalized `choice` objects to the `choices` array. This
 * method is called in the constructor, but it can also be used to add
 * choices after instantiation.
 *
 * ```js
 * choices.addChoices(['foo', 'bar', 'baz']);
 * ```
 * @param {Array|Object} `choices` One or more choices to add.
 * @api public
 */

Choices.prototype.addChoices = function(choices) {
  if (this.options.radio === true && Array.isArray(choices) && choices.length > 2) {
    choices = { all: choices };
  }

  if (utils.isObject(choices)) {
    choices = this.toGroups(choices);
  }

  if (!Array.isArray(choices)) {
    return;
  }

  for (var i = 0; i < choices.length; i++) {
    this.addChoice(choices[i]);
  }
};

/**
 * Create choice "groups" from the given choices object.
 * ![choice groups](docs/prompt-groups.gif).
 *
 * ```js
 * choices.toGroups({
 *   foo: ['a', 'b', 'c'],
 *   bar: ['d', 'e', 'f']
 * });
 * ```
 * @param {Object} `choices` (required) The value of each object must be an array of choices (strings or objects).
 * @return {Array} Returns an array of normalized choice objects.
 * @api public
 */

Choices.prototype.toGroups = function(choices) {
  if (!utils.isObject(choices)) {
    throw new TypeError('expected choices to be an object');
  }

  var line = this.separator(this.options);
  var keys = Object.keys(choices);
  var head = [];
  var tail = this.options.radio ? [line] : [];
  var items = [];

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var val = choices[key];
    var arr = (utils.isObject(val) && val.choices) ? val.choices : val;

    if (!Array.isArray(arr)) {
      throw new TypeError('expected group choices to be an array');
    }

    var select = this.choice({
      name: key,
      type: 'group',
      choices: [],
      keys: []
    });

    if (key !== 'all') {
      tail.push(select);
    }

    for (var j = 0; j < arr.length; j++) {
      var choice = this.choice(arr[j]);
      choice.type = 'option';
      choice.group = select;
      choice.groupName = key;
      select.choices.push(choice);
      select.keys.push(choice.name);
      tail.push(choice);
      items.push(choice);
    }
  }

  var none = {name: 'none', type: 'radio', choices: items};
  var all = {name: 'all', type: 'radio', choices: items};
  if (keys.length === 1 && arr.length <= 2) {
    return tail.filter(function(choice) {
      var isOption = choice.type === 'option';
      delete choice.type;
      return isOption;
    });
  }

  if (this.options.radio === true) {
    head.unshift(none);
    head.unshift(all);

  } else if (keys.length === 1 && keys[0] === 'all') {
    head.push(none);
  }

  return head.concat(tail);
};

/**
 * Create a new `Separator` object. See [choices-separator][]
 * for more details.
 *
 * ```js
 * choices.separator();
 * ```
 * @param {String} `separator` Optionally pass a string to use as the separator.
 * @return {Object} Returns a separator object.
 * @api public
 */

Choices.prototype.separator = function(separator, options) {
  return new utils.Separator(separator, options);
};

/**
 * Returns true if a choice exists.
 *
 * ```js
 * choices.hasChoice(1);
 * choices.hasChoice('foo');
 * ```
 * @param {Number} `val` The index or key of the choice to check for.
 * @return {Boolean}
 * @api public
 */

Choices.prototype.hasChoice = function(val) {
  return typeof this.get(val) !== 'undefined';
};

/**
 * Get a non-separator choice from the collection.
 *
 * ```js
 * choices.getChoice(1);
 * choices.getChoice('foo');
 * ```
 * @param {Number} `idx` The selected choice index
 * @return {Object|undefined} Return the matched choice object or undefined
 * @api public
 */

Choices.prototype.getChoice = function(idx) {
  if (typeof idx === 'string') {
    idx = this.getIndex(idx);
  }
  return this.items[idx];
};

/**
 * Get the index of a non-separator choice from the collection.
 *
 * ```js
 * var choices = new Choices(['foo', 'bar', 'baz']);
 * console.log(choices.getIndex('foo')); //=> 0
 * console.log(choices.getIndex('baz')); //=> 2
 * console.log(choices.getIndex('bar')); //=> 1
 * console.log(choices.getIndex('qux')); //=> -1
 * ```
 * @param {String} `key` The key of the choice to get
 * @return {Number} Index of the choice or `-1`;
 * @api public
 */

Choices.prototype.getIndex = function(key) {
  if (Choices.isChoice(key)) {
    return this.items.indexOf(key);
  }
  if (typeof key === 'string') {
    return this.items.indexOf(this.keymap[key]);
  }
  return this.isValidIndex(key) ? key : -1;
};

/**
 * Get the choice at the specified index.
 *
 * ```js
 * var choice = choices.get(1);
 * //=> {name: 'foo'}
 * var choice = choices.get(1, 'name');
 * //=> 'foo'
 * ```
 * @param {Number|String} `key` The name or index of the object to get
 * @return {Object} Returns the specified choice
 * @api public
 */

Choices.prototype.get = function(key, prop) {
  if (typeof key === 'string') {
    key = this.getIndex(key);
  }
  if (!utils.isNumber(key)) {
    return null;
  }
  var choice = this.getChoice(key);
  if (choice && typeof prop === 'string') {
    return choice[prop];
  }
  return choice;
};

/**
 * Return the `.key` property from the choice at the given index.
 * @param {String} `key` Property name to use for plucking objects.
 * @return {Array} Plucked objects
 * @api public
 */

Choices.prototype.key = function(val) {
  return this.get(val, 'key');
};

/**
 * Check the choice at the given `idx`.
 *
 * ```js
 * choices.check(1);
 * ```
 * @param {Number|Array} `val` The key(s) or index(s) of the choice(s) to check.
 * @api public
 */

Choices.prototype.check = function(val) {
  if (typeof val === 'undefined') {
    val = this.keys;
  }
  if (Array.isArray(val)) {
    visit(this, 'check', val);
    return this;
  }
  var choice = this.get(val);
  if (choice) {
    choice.checked = true;
  }
  return this;
};

/**
 * Disable the choice at the given `idx`.
 *
 * ```js
 * choices.uncheck(1);
 * ```
 * @param {Number} `idx` The index of the choice to enable.
 * @api public
 */

Choices.prototype.uncheck = function(val) {
  if (typeof val === 'undefined') {
    val = this.keys;
  }
  if (Array.isArray(val)) {
    visit(this, 'uncheck', val);
    return this;
  }
  var choice = this.get(val);
  if (choice) {
    choice.checked = false;
  }
  return this;
};

/**
 * Returns true if a choice is checked.
 *
 * ```js
 * var choices = new Choices(['foo', 'bar', 'baz']);
 * console.log(choices.isChecked('foo'));
 * //=> false
 * choices.check('foo');
 * console.log(choices.isChecked('foo'));
 * //=> true
 * ```
 * @param {String|Number} `name` Name or index of the choice.
 * @return {Boolean}
 * @api public
 */

Choices.prototype.isChecked = function(name) {
  if (Array.isArray(name)) {
    for (var i = 0; i < name.length; i++) {
      if (!this.isChecked(name[i])) {
        return false;
      }
    }
    return true;
  }

  var choice = this.get(name);
  if (choice) {
    return choice.checked === true;
  }
};

/**
 * Toggle the choice at the given `idx`.
 *
 * ```js
 * choices.toggle(1);
 * // radio mode
 * choices.toggle(1, true);
 * ```
 * @param {Number} `idx` The index of the choice to toggle.
 * @api public
 */

Choices.prototype.toggle = function(val, radio) {
  if (typeof val === 'undefined') {
    val = this.keys;
  }

  if (Array.isArray(val)) {
    visit(this, 'toggle', val, radio);
    return this;
  }

  var choice = this.get(val);
  if (!choice) {
    return this;
  }

  if (radio) {
    utils.toggle(this.items, 'checked', this.getIndex(choice));
  } else {
    choice.toggle();
  }

  if (choice.type === 'group') {
    choice.checked = this.isChecked(choice.keys);
  }
  if (choice.type === 'option') {
    choice.group.checked = this.isChecked(choice.group.keys);
  }

  this.update();
  return this;
};

/**
 * When user press `enter` key
 */

Choices.prototype.radio = function() {
  var choice = this.get(this.position);
  if (!choice) return;

  if (choice.type === 'group') {
    if (choice.checked === true) {
      this.uncheck(choice.keys);
    } else {
      this.check(choice.keys);
    }
    choice.toggle();
    this.update();
    return;
  }

  if (choice.type === 'option') {
    choice.toggle();
    choice.group.checked = this.isChecked(choice.group.keys);
    this.update();
    return;
  }

  if (this.length > 1) {
    if (choice.name === 'all') {
      this[choice.checked ? 'uncheck' : 'check']();
      this.toggle('none');
      this.update();
      return;
    }

    if (choice.name === 'none') {
      this.uncheck();
      this.check(this.position);
      this.update();
      return;
    }
  }

  choice.toggle();
  this.update();
};

/**
 * Update "radio" choices to ensure that `all` and `none` are
 * correct based on other choices.
 */

Choices.prototype.update = function() {
  if (this.all) {
    this.check('all');
    this.uncheck('none');
    return;
  }
  if (this.none) {
    this.uncheck('all');
    this.check('none');
    return;
  }
  if (this.checked.length) {
    this.uncheck(['all', 'none']);
  }
};

/**
 * Return choice values for choices that return truthy based
 * on the given `val`.
 *
 * @param {Array|Object|Function|String|RegExp} `val`
 * @return {Array} Matching choices or empty array
 * @api public
 */

Choices.prototype.where = function(val) {
  if (typeof val === 'function') {
    return this.filter(val);
  }

  if (typeof val === 'string') {
    return this.filter(function(choice) {
      return choice.name === val || choice.key === val;
    });
  }

  if (utils.typeOf(val) === 'regexp') {
    return this.filter(function(choice) {
      return val.test(choice.name) || val.test(choice.key);
    });
  }

  if (utils.isObject(val)) {
    return this.filter(function(choice) {
      for (var key in val) {
        if (!choice.hasOwnProperty(key)) {
          return false;
        }
        return val[key] === choice[key];
      }
    });
  }

  if (Array.isArray(val)) {
    var acc = [];
    for (var i = 0; i < val.length; i++) {
      acc = acc.concat(this.where.call(this, val[i]));
    }
    return acc;
  }

  return [];
};

/**
 * Returns true if the given `choice` is a valid choice item, and
 * not a "group" or "radio" choice.
 *
 * @param {String} `key` Property name to use for plucking objects.
 * @return {Array} Plucked objects
 * @api public
 */

Choices.prototype.isItem = function(choice) {
  return choice.type !== 'separator'
    && choice.type !== 'group'
    && choice.type !== 'radio'
    && choice.name !== 'none'
    && choice.name !== 'all';
};

/**
 * Returns true if the given `index` is a valid choice index.
 * @param {String} `key` Property name to use for plucking objects.
 * @return {Array} Plucked objects
 * @api public
 */

Choices.prototype.isValidIndex = function(idx) {
  return utils.isNumber(idx) && idx !== -1 && idx < this.items.length;
};

/**
 * Pluck an object with the specified key from the choices collection.
 * @param {String} `key` Property name to use for plucking objects.
 * @return {Array} Plucked objects
 * @api public
 */

Choices.prototype.pluck = function(key) {
  return this.items.map(function(choice) {
    return choice[key];
  });
};

/**
 * Convenience array methods
 */

Choices.prototype.indexOf = function() {
  return this.getChoice(this.keys.indexOf.apply(this.keys, arguments));
};

Choices.prototype.forEach = function() {
  return this.items.forEach.apply(this.items, arguments);
};

Choices.prototype.filter = function() {
  return this.items.filter.apply(this.items, arguments);
};

Choices.prototype.some = function() {
  return this.items.some.apply(this.items, arguments);
};

Choices.prototype.every = function() {
  return this.items.every.apply(this.items, arguments);
};

/**
 * Getter for getting the checked choices from the collection.
 * @name .checked
 * @api public
 */

Object.defineProperty(Choices.prototype, 'checked', {
  set: function() {
    throw new Error('.checked is a getter and cannot be defined');
  },
  get: function() {
    return this.items.reduce(function(acc, choice) {
      if (this.options.radio === true && !this.isItem(choice)) {
        return acc;
      }
      if (choice.checked === true) {
        acc.push(choice.value);
      }
      return acc;
    }.bind(this), []);
  }
});

Object.defineProperty(Choices.prototype, 'all', {
  set: function() {
    throw new Error('.all is a getter and cannot be defined');
  },
  get: function() {
    var items = this.filter(this.isItem);
    return items.length === this.checked.length;
  }
});

Object.defineProperty(Choices.prototype, 'none', {
  set: function() {
    throw new Error('.none is a getter and cannot be defined');
  },
  get: function() {
    return this.checked.length === 0;
  }
});

/**
 * Getter for getting the length of the collection.
 * @name .length
 * @api public
 */

Object.defineProperty(Choices.prototype, 'length', {
  set: function() {
    throw new Error('.length is a getter and cannot be defined');
  },
  get: function() {
    return this.items.length;
  }
});

/**
 * Create a new `Separator` object. See [choices-separator][] for more details.
 *
 * ```js
 * new Choices.Separator();
 * ```
 * @param {String} `separator` Optionally pass a string to use as the separator.
 * @return {Object} Returns a separator object.
 * @api public
 */

Choices.Separator = utils.Separator;

/**
 * Create a new `Separator` object. See [choices-separator][] for more details.
 *
 * ```js
 * var Choices = require('prompt-choices');
 * var choices = new Choices(['foo']);
 * console.log(Choices.isChoices(choices)); //=> true
 * console.log(Choices.isChoices({})); //=> false
 * ```
 * @param {String} `separator` Optionally pass a string to use as the separator.
 * @return {Object} Returns a separator object.
 * @api public
 */

Choices.isChoices = function(choices) {
  return utils.isObject(choices) && choices.isChoices;
};

/**
 * Create a new `Separator` object. See [choices-separator][] for more details.
 *
 * ```js
 * var Choices = require('prompt-choices');
 * var choices = new Choices(['foo']);
 * var foo = choices.getChoice('foo');
 * console.log(Choices.isChoice(foo)); //=> true
 * console.log(Choices.isChoice({})); //=> false
 * ```
 * @param {String} `separator` Optionally pass a string to use as the separator.
 * @return {Object} Returns a separator object.
 * @api public
 */

Choices.isChoice = function(choice) {
  return utils.isObject(choice) && choice.isChoice;
};

/**
 * Expose `Choices`
 */

module.exports = Choices;

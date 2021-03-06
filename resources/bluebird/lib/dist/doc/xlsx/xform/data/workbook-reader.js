"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _asyncGeneratorDelegate(inner, awaitWrap) { var iter = {}, waiting = false; function pump(key, value) { waiting = true; value = new Promise(function (resolve) { resolve(inner[key](value)); }); return { done: false, value: awaitWrap(value) }; } ; if (typeof Symbol === "function" && Symbol.iterator) { iter[Symbol.iterator] = function () { return this; }; } iter.next = function (value) { if (waiting) { waiting = false; return value; } return pump("next", value); }; if (typeof inner.throw === "function") { iter.throw = function (value) { if (waiting) { waiting = false; throw value; } return pump("throw", value); }; } if (typeof inner.return === "function") { iter.return = function (value) { if (waiting) { waiting = false; return value; } return pump("return", value); }; } return iter; }

function _awaitAsyncGenerator(value) { return new _AwaitValue(value); }

function _wrapAsyncGenerator(fn) { return function () { return new _AsyncGenerator(fn.apply(this, arguments)); }; }

function _AsyncGenerator(gen) { var front, back; function send(key, arg) { return new Promise(function (resolve, reject) { var request = { key: key, arg: arg, resolve: resolve, reject: reject, next: null }; if (back) { back = back.next = request; } else { front = back = request; resume(key, arg); } }); } function resume(key, arg) { try { var result = gen[key](arg); var value = result.value; var wrappedAwait = value instanceof _AwaitValue; Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) { if (wrappedAwait) { resume(key === "return" ? "return" : "next", arg); return; } settle(result.done ? "return" : "normal", arg); }, function (err) { resume("throw", err); }); } catch (err) { settle("throw", err); } } function settle(type, value) { switch (type) { case "return": front.resolve({ value: value, done: true }); break; case "throw": front.reject(value); break; default: front.resolve({ value: value, done: false }); break; } front = front.next; if (front) { resume(front.key, front.arg); } else { back = null; } } this._invoke = send; if (typeof gen.return !== "function") { this.return = undefined; } }

if (typeof Symbol === "function" && Symbol.asyncIterator) { _AsyncGenerator.prototype[Symbol.asyncIterator] = function () { return this; }; }

_AsyncGenerator.prototype.next = function (arg) { return this._invoke("next", arg); };

_AsyncGenerator.prototype.throw = function (arg) { return this._invoke("throw", arg); };

_AsyncGenerator.prototype.return = function (arg) { return this._invoke("return", arg); };

function _AwaitValue(value) { this.wrapped = value; }

function _asyncIterator(iterable) { var method; if (typeof Symbol !== "undefined") { if (Symbol.asyncIterator) { method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { method = iterable[Symbol.iterator]; if (method != null) return method.call(iterable); } } throw new TypeError("Object is not async iterable"); }

var fs = require('fs');

var _require = require('events'),
    EventEmitter = _require.EventEmitter;

var _require2 = require('readable-stream'),
    PassThrough = _require2.PassThrough,
    Readable = _require2.Readable;

var nodeStream = require('stream');

var unzip = require('unzipper');

var tmp = require('tmp');

var iterateStream = require('../../utils/iterate-stream');

var parseSax = require('../../utils/parse-sax');

var StyleManager = require('../../xlsx/xform/style/styles-xform');

var WorkbookPropertiesManager = require('../../xlsx/xform/book/workbook-properties-xform');

var WorksheetReader = require('./worksheet-reader');

var HyperlinkReader = require('./hyperlink-reader');

tmp.setGracefulCleanup();

var WorkbookReader = /*#__PURE__*/function (_EventEmitter) {
  _inherits(WorkbookReader, _EventEmitter);

  var _super = _createSuper(WorkbookReader);

  function WorkbookReader(input) {
    var _this4;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, WorkbookReader);

    _this4 = _super.call(this);
    _this4.input = input;
    _this4.options = _objectSpread({
      worksheets: 'emit',
      sharedStrings: 'cache',
      hyperlinks: 'ignore',
      styles: 'ignore',
      entries: 'ignore'
    }, options);
    _this4.styles = new StyleManager();

    _this4.styles.init();

    _this4.properties = new WorkbookPropertiesManager();
    return _this4;
  }

  _createClass(WorkbookReader, [{
    key: "_getStream",
    value: function _getStream(input) {
      if (input instanceof nodeStream.Readable || input instanceof Readable) {
        return input;
      }

      if (typeof input === 'string') {
        return fs.createReadStream(input);
      }

      throw new Error("Could not recognise input: ".concat(input));
    }
  }, {
    key: "read",
    value: function () {
      var _read = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(input, options) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, _value5, eventType, value;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _context.prev = 3;
                _iterator = _asyncIterator(this.parse(input, options));

              case 5:
                _context.next = 7;
                return _iterator.next();

              case 7:
                _step = _context.sent;
                _iteratorNormalCompletion = _step.done;
                _context.next = 11;
                return _step.value;

              case 11:
                _value = _context.sent;

                if (_iteratorNormalCompletion) {
                  _context.next = 28;
                  break;
                }

                _value5 = _value, eventType = _value5.eventType, value = _value5.value;
                _context.t0 = eventType;
                _context.next = _context.t0 === 'shared-strings' ? 17 : _context.t0 === 'worksheet' ? 19 : _context.t0 === 'hyperlinks' ? 23 : 25;
                break;

              case 17:
                this.emit(eventType, value);
                return _context.abrupt("break", 25);

              case 19:
                this.emit(eventType, value);
                _context.next = 22;
                return value.read();

              case 22:
                return _context.abrupt("break", 25);

              case 23:
                this.emit(eventType, value);
                return _context.abrupt("break", 25);

              case 25:
                _iteratorNormalCompletion = true;
                _context.next = 5;
                break;

              case 28:
                _context.next = 34;
                break;

              case 30:
                _context.prev = 30;
                _context.t1 = _context["catch"](3);
                _didIteratorError = true;
                _iteratorError = _context.t1;

              case 34:
                _context.prev = 34;
                _context.prev = 35;

                if (!(!_iteratorNormalCompletion && _iterator.return != null)) {
                  _context.next = 39;
                  break;
                }

                _context.next = 39;
                return _iterator.return();

              case 39:
                _context.prev = 39;

                if (!_didIteratorError) {
                  _context.next = 42;
                  break;
                }

                throw _iteratorError;

              case 42:
                return _context.finish(39);

              case 43:
                return _context.finish(34);

              case 44:
                this.emit('end');
                this.emit('finished');
                _context.next = 51;
                break;

              case 48:
                _context.prev = 48;
                _context.t2 = _context["catch"](0);
                this.emit('error', _context.t2);

              case 51:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 48], [3, 30, 34, 44], [35,, 39, 43]]);
      }));

      function read(_x, _x2) {
        return _read.apply(this, arguments);
      }

      return read;
    }()
  }, {
    key: Symbol.asyncIterator,
    value: function value() {
      var _this = this;

      return _wrapAsyncGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _value2, _value6, eventType, value;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _context2.prev = 2;
                _iterator2 = _asyncIterator(_this.parse());

              case 4:
                _context2.next = 6;
                return _awaitAsyncGenerator(_iterator2.next());

              case 6:
                _step2 = _context2.sent;
                _iteratorNormalCompletion2 = _step2.done;
                _context2.next = 10;
                return _awaitAsyncGenerator(_step2.value);

              case 10:
                _value2 = _context2.sent;

                if (_iteratorNormalCompletion2) {
                  _context2.next = 19;
                  break;
                }

                _value6 = _value2, eventType = _value6.eventType, value = _value6.value;

                if (!(eventType === 'worksheet')) {
                  _context2.next = 16;
                  break;
                }

                _context2.next = 16;
                return value;

              case 16:
                _iteratorNormalCompletion2 = true;
                _context2.next = 4;
                break;

              case 19:
                _context2.next = 25;
                break;

              case 21:
                _context2.prev = 21;
                _context2.t0 = _context2["catch"](2);
                _didIteratorError2 = true;
                _iteratorError2 = _context2.t0;

              case 25:
                _context2.prev = 25;
                _context2.prev = 26;

                if (!(!_iteratorNormalCompletion2 && _iterator2.return != null)) {
                  _context2.next = 30;
                  break;
                }

                _context2.next = 30;
                return _awaitAsyncGenerator(_iterator2.return());

              case 30:
                _context2.prev = 30;

                if (!_didIteratorError2) {
                  _context2.next = 33;
                  break;
                }

                throw _iteratorError2;

              case 33:
                return _context2.finish(30);

              case 34:
                return _context2.finish(25);

              case 35:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[2, 21, 25, 35], [26,, 30, 34]]);
      }))();
    }
  }, {
    key: "parse",
    value: function parse(input, options) {
      var _this2 = this;

      return _wrapAsyncGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var stream, zip, waitingWorkSheets, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _loop, _iterator3, _step3, _value3, _i, _waitingWorkSheets, _waitingWorkSheets$_i, sheetNo, path, tempFileCleanupCallback, fileStream;

        return regeneratorRuntime.wrap(function _callee3$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (options) _this2.options = options;
                stream = _this2.stream = _this2._getStream(input || _this2.input);
                zip = unzip.Parse({
                  forceStream: true
                });
                stream.pipe(zip); // worksheets, deferred for parsing after shared strings reading

                waitingWorkSheets = [];
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _context4.prev = 7;
                _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop() {
                  var entry, match, sheetNo;
                  return regeneratorRuntime.wrap(function _loop$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          entry = _value3;
                          match = void 0;
                          sheetNo = void 0;
                          _context3.t0 = entry.path;
                          _context3.next = _context3.t0 === '_rels/.rels' ? 6 : _context3.t0 === 'xl/_rels/workbook.xml.rels' ? 6 : _context3.t0 === 'xl/workbook.xml' ? 7 : _context3.t0 === 'xl/sharedStrings.xml' ? 10 : _context3.t0 === 'xl/styles.xml' ? 12 : 15;
                          break;

                        case 6:
                          return _context3.abrupt("break", 31);

                        case 7:
                          _context3.next = 9;
                          return _awaitAsyncGenerator(_this2._parseWorkbook(entry));

                        case 9:
                          return _context3.abrupt("break", 31);

                        case 10:
                          return _context3.delegateYield(_asyncGeneratorDelegate(_asyncIterator(_this2._parseSharedStrings(entry)), _awaitAsyncGenerator), "t1", 11);

                        case 11:
                          return _context3.abrupt("break", 31);

                        case 12:
                          _context3.next = 14;
                          return _awaitAsyncGenerator(_this2._parseStyles(entry));

                        case 14:
                          return _context3.abrupt("break", 31);

                        case 15:
                          if (!entry.path.match(/xl\/worksheets\/sheet\d+[.]xml/)) {
                            _context3.next = 26;
                            break;
                          }

                          match = entry.path.match(/xl\/worksheets\/sheet(\d+)[.]xml/);
                          sheetNo = match[1];

                          if (!_this2.sharedStrings) {
                            _context3.next = 22;
                            break;
                          }

                          return _context3.delegateYield(_asyncGeneratorDelegate(_asyncIterator(_this2._parseWorksheet(iterateStream(entry), sheetNo)), _awaitAsyncGenerator), "t2", 20);

                        case 20:
                          _context3.next = 24;
                          break;

                        case 22:
                          _context3.next = 24;
                          return _awaitAsyncGenerator(new Promise(function (resolve, reject) {
                            tmp.file(function (err, path, fd, tempFileCleanupCallback) {
                              if (err) {
                                return reject(err);
                              }

                              waitingWorkSheets.push({
                                sheetNo: sheetNo,
                                path: path,
                                tempFileCleanupCallback: tempFileCleanupCallback
                              });
                              var tempStream = fs.createWriteStream(path);
                              entry.pipe(tempStream);
                              return tempStream.on('finish', function () {
                                return resolve();
                              });
                            });
                          }));

                        case 24:
                          _context3.next = 30;
                          break;

                        case 26:
                          if (!entry.path.match(/xl\/worksheets\/_rels\/sheet\d+[.]xml.rels/)) {
                            _context3.next = 30;
                            break;
                          }

                          match = entry.path.match(/xl\/worksheets\/_rels\/sheet(\d+)[.]xml.rels/);
                          sheetNo = match[1];
                          return _context3.delegateYield(_asyncGeneratorDelegate(_asyncIterator(_this2._parseHyperlinks(iterateStream(entry), sheetNo)), _awaitAsyncGenerator), "t3", 30);

                        case 30:
                          return _context3.abrupt("break", 31);

                        case 31:
                          entry.autodrain();

                        case 32:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _loop);
                });
                _iterator3 = _asyncIterator(iterateStream(zip));

              case 10:
                _context4.next = 12;
                return _awaitAsyncGenerator(_iterator3.next());

              case 12:
                _step3 = _context4.sent;
                _iteratorNormalCompletion3 = _step3.done;
                _context4.next = 16;
                return _awaitAsyncGenerator(_step3.value);

              case 16:
                _value3 = _context4.sent;

                if (_iteratorNormalCompletion3) {
                  _context4.next = 22;
                  break;
                }

                return _context4.delegateYield(_loop(), "t0", 19);

              case 19:
                _iteratorNormalCompletion3 = true;
                _context4.next = 10;
                break;

              case 22:
                _context4.next = 28;
                break;

              case 24:
                _context4.prev = 24;
                _context4.t1 = _context4["catch"](7);
                _didIteratorError3 = true;
                _iteratorError3 = _context4.t1;

              case 28:
                _context4.prev = 28;
                _context4.prev = 29;

                if (!(!_iteratorNormalCompletion3 && _iterator3.return != null)) {
                  _context4.next = 33;
                  break;
                }

                _context4.next = 33;
                return _awaitAsyncGenerator(_iterator3.return());

              case 33:
                _context4.prev = 33;

                if (!_didIteratorError3) {
                  _context4.next = 36;
                  break;
                }

                throw _iteratorError3;

              case 36:
                return _context4.finish(33);

              case 37:
                return _context4.finish(28);

              case 38:
                _i = 0, _waitingWorkSheets = waitingWorkSheets;

              case 39:
                if (!(_i < _waitingWorkSheets.length)) {
                  _context4.next = 48;
                  break;
                }

                _waitingWorkSheets$_i = _waitingWorkSheets[_i], sheetNo = _waitingWorkSheets$_i.sheetNo, path = _waitingWorkSheets$_i.path, tempFileCleanupCallback = _waitingWorkSheets$_i.tempFileCleanupCallback;
                fileStream = fs.createReadStream(path); // TODO: Remove once node v8 is deprecated
                // Detect and upgrade old fileStreams

                if (!fileStream[Symbol.asyncIterator]) {
                  fileStream = fileStream.pipe(new PassThrough());
                }

                return _context4.delegateYield(_asyncGeneratorDelegate(_asyncIterator(_this2._parseWorksheet(fileStream, sheetNo)), _awaitAsyncGenerator), "t2", 44);

              case 44:
                tempFileCleanupCallback();

              case 45:
                _i++;
                _context4.next = 39;
                break;

              case 48:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee3, null, [[7, 24, 28, 38], [29,, 33, 37]]);
      }))();
    }
  }, {
    key: "_emitEntry",
    value: function _emitEntry(payload) {
      if (this.options.entries === 'emit') {
        this.emit('entry', payload);
      }
    }
  }, {
    key: "_parseWorkbook",
    value: function () {
      var _parseWorkbook2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(entry) {
        return regeneratorRuntime.wrap(function _callee4$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                this._emitEntry({
                  type: 'workbook'
                });

                _context5.next = 3;
                return this.properties.parseStream(iterateStream(entry));

              case 3:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee4, this);
      }));

      function _parseWorkbook(_x3) {
        return _parseWorkbook2.apply(this, arguments);
      }

      return _parseWorkbook;
    }()
  }, {
    key: "_parseSharedStrings",
    value: function _parseSharedStrings(entry) {
      var _this3 = this;

      return _wrapAsyncGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var inT, text, index, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _value4, events, _iterator5, _step5, _step5$value, eventType, value, node, _node;

        return regeneratorRuntime.wrap(function _callee5$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _this3._emitEntry({
                  type: 'shared-strings'
                });

                _context6.t0 = _this3.options.sharedStrings;
                _context6.next = _context6.t0 === 'cache' ? 4 : _context6.t0 === 'emit' ? 6 : 7;
                break;

              case 4:
                _this3.sharedStrings = [];
                return _context6.abrupt("break", 8);

              case 6:
                return _context6.abrupt("break", 8);

              case 7:
                return _context6.abrupt("return");

              case 8:
                inT = false;
                text = null;
                index = 0;
                _iteratorNormalCompletion4 = true;
                _didIteratorError4 = false;
                _context6.prev = 13;
                _iterator4 = _asyncIterator(parseSax(iterateStream(entry)));

              case 15:
                _context6.next = 17;
                return _awaitAsyncGenerator(_iterator4.next());

              case 17:
                _step4 = _context6.sent;
                _iteratorNormalCompletion4 = _step4.done;
                _context6.next = 21;
                return _awaitAsyncGenerator(_step4.value);

              case 21:
                _value4 = _context6.sent;

                if (_iteratorNormalCompletion4) {
                  _context6.next = 62;
                  break;
                }

                events = _value4;
                _iterator5 = _createForOfIteratorHelper(events);
                _context6.prev = 25;

                _iterator5.s();

              case 27:
                if ((_step5 = _iterator5.n()).done) {
                  _context6.next = 51;
                  break;
                }

                _step5$value = _step5.value, eventType = _step5$value.eventType, value = _step5$value.value;

                if (!(eventType === 'opentag')) {
                  _context6.next = 34;
                  break;
                }

                node = value;

                if (node.name === 't') {
                  text = null;
                  inT = true;
                }

                _context6.next = 49;
                break;

              case 34:
                if (!(eventType === 'text')) {
                  _context6.next = 38;
                  break;
                }

                text = text ? text + value : value;
                _context6.next = 49;
                break;

              case 38:
                if (!(eventType === 'closetag')) {
                  _context6.next = 49;
                  break;
                }

                _node = value;

                if (!(inT && _node.name === 't')) {
                  _context6.next = 49;
                  break;
                }

                if (!(_this3.options.sharedStrings === 'cache')) {
                  _context6.next = 45;
                  break;
                }

                _this3.sharedStrings.push(text);

                _context6.next = 48;
                break;

              case 45:
                if (!(_this3.options.sharedStrings === 'emit')) {
                  _context6.next = 48;
                  break;
                }

                _context6.next = 48;
                return {
                  index: index++,
                  text: text
                };

              case 48:
                text = null;

              case 49:
                _context6.next = 27;
                break;

              case 51:
                _context6.next = 56;
                break;

              case 53:
                _context6.prev = 53;
                _context6.t1 = _context6["catch"](25);

                _iterator5.e(_context6.t1);

              case 56:
                _context6.prev = 56;

                _iterator5.f();

                return _context6.finish(56);

              case 59:
                _iteratorNormalCompletion4 = true;
                _context6.next = 15;
                break;

              case 62:
                _context6.next = 68;
                break;

              case 64:
                _context6.prev = 64;
                _context6.t2 = _context6["catch"](13);
                _didIteratorError4 = true;
                _iteratorError4 = _context6.t2;

              case 68:
                _context6.prev = 68;
                _context6.prev = 69;

                if (!(!_iteratorNormalCompletion4 && _iterator4.return != null)) {
                  _context6.next = 73;
                  break;
                }

                _context6.next = 73;
                return _awaitAsyncGenerator(_iterator4.return());

              case 73:
                _context6.prev = 73;

                if (!_didIteratorError4) {
                  _context6.next = 76;
                  break;
                }

                throw _iteratorError4;

              case 76:
                return _context6.finish(73);

              case 77:
                return _context6.finish(68);

              case 78:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee5, null, [[13, 64, 68, 78], [25, 53, 56, 59], [69,, 73, 77]]);
      }))();
    }
  }, {
    key: "_parseStyles",
    value: function () {
      var _parseStyles2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(entry) {
        return regeneratorRuntime.wrap(function _callee6$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                this._emitEntry({
                  type: 'styles'
                });

                if (!(this.options.styles === 'cache')) {
                  _context7.next = 5;
                  break;
                }

                this.styles = new StyleManager();
                _context7.next = 5;
                return this.styles.parseStream(iterateStream(entry));

              case 5:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee6, this);
      }));

      function _parseStyles(_x4) {
        return _parseStyles2.apply(this, arguments);
      }

      return _parseStyles;
    }()
  }, {
    key: "_parseWorksheet",
    value: /*#__PURE__*/regeneratorRuntime.mark(function _parseWorksheet(iterator, sheetNo) {
      var worksheetReader;
      return regeneratorRuntime.wrap(function _parseWorksheet$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              this._emitEntry({
                type: 'worksheet',
                id: sheetNo
              });

              worksheetReader = new WorksheetReader({
                workbook: this,
                id: sheetNo,
                iterator: iterator,
                options: this.options
              });

              if (!(this.options.worksheets === 'emit')) {
                _context8.next = 5;
                break;
              }

              _context8.next = 5;
              return {
                eventType: 'worksheet',
                value: worksheetReader
              };

            case 5:
            case "end":
              return _context8.stop();
          }
        }
      }, _parseWorksheet, this);
    })
  }, {
    key: "_parseHyperlinks",
    value: /*#__PURE__*/regeneratorRuntime.mark(function _parseHyperlinks(iterator, sheetNo) {
      var hyperlinksReader;
      return regeneratorRuntime.wrap(function _parseHyperlinks$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              this._emitEntry({
                type: 'hyperlinks',
                id: sheetNo
              });

              hyperlinksReader = new HyperlinkReader({
                workbook: this,
                id: sheetNo,
                iterator: iterator,
                options: this.options
              });

              if (!(this.options.hyperlinks === 'emit')) {
                _context9.next = 5;
                break;
              }

              _context9.next = 5;
              return {
                eventType: 'hyperlinks',
                value: hyperlinksReader
              };

            case 5:
            case "end":
              return _context9.stop();
          }
        }
      }, _parseHyperlinks, this);
    })
  }]);

  return WorkbookReader;
}(EventEmitter); // for reference - these are the valid values for options


WorkbookReader.Options = {
  worksheets: ['emit', 'ignore'],
  sharedStrings: ['cache', 'emit', 'ignore'],
  hyperlinks: ['cache', 'emit', 'ignore'],
  styles: ['cache', 'ignore'],
  entries: ['emit', 'ignore']
};
module.exports = WorkbookReader;
//# sourceMappingURL=workbook-reader.js.map

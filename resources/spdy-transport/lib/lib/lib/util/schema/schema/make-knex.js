"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeKnex;

var _events = require("events");

var _Migrator = _interopRequireDefault(require("../migrate/Migrator"));

var _Seeder = _interopRequireDefault(require("../seed/Seeder"));

var _functionhelper = _interopRequireDefault(require("../functionhelper"));

var _methods = _interopRequireDefault(require("../query/methods"));

var _lodash = require("lodash");

var _batchInsert = _interopRequireDefault(require("./batchInsert"));

var bluebird = _interopRequireWildcard(require("bluebird"));

var _versionHelper = require("./version-helper");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeKnex(client) {
  // The object we're potentially using to kick off an initial chain.
  function knex(tableName, options) {
    return createQueryBuilder(knex.context, tableName, options);
  }

  redefineProperties(knex, client);
  return knex;
}

function initContext(knexFn) {
  const knexContext = knexFn.context || {};
  (0, _lodash.assign)(knexContext, {
    queryBuilder() {
      return this.client.queryBuilder();
    },

    raw() {
      return this.client.raw.apply(this.client, arguments);
    },

    batchInsert(table, batch, chunkSize = 1000) {
      return (0, _batchInsert.default)(this, table, batch, chunkSize);
    },

    // Runs a new transaction, taking a container and returning a promise
    // for when the transaction is resolved.
    transaction(container, config) {
      const trx = this.client.transaction(container, config);
      trx.userParams = this.userParams;
      return trx;
    },

    // Typically never needed, initializes the pool for a knex client.
    initialize(config) {
      return this.client.initializePool(config);
    },

    // Convenience method for tearing down the pool.
    destroy(callback) {
      return this.client.destroy(callback);
    },

    ref(ref) {
      return this.client.ref(ref);
    },

    // Do not document this as public API until naming and API is improved for general consumption
    // This method exists to disable processing of internal queries in migrations
    disableProcessing() {
      if (this.userParams.isProcessingDisabled) {
        return;
      }

      this.userParams.wrapIdentifier = this.client.config.wrapIdentifier;
      this.userParams.postProcessResponse = this.client.config.postProcessResponse;
      this.client.config.wrapIdentifier = null;
      this.client.config.postProcessResponse = null;
      this.userParams.isProcessingDisabled = true;
    },

    // Do not document this as public API until naming and API is improved for general consumption
    // This method exists to enable execution of non-internal queries with consistent identifier naming in migrations
    enableProcessing() {
      if (!this.userParams.isProcessingDisabled) {
        return;
      }

      this.client.config.wrapIdentifier = this.userParams.wrapIdentifier;
      this.client.config.postProcessResponse = this.userParams.postProcessResponse;
      this.userParams.isProcessingDisabled = false;
    },

    withUserParams(params) {
      const knexClone = shallowCloneFunction(knexFn); // We need to include getters in our clone

      if (this.client) {
        knexClone.client = Object.create(this.client.constructor.prototype); // Clone client to avoid leaking listeners that are set on it

        (0, _lodash.merge)(knexClone.client, this.client);
        knexClone.client.config = Object.assign({}, this.client.config); // Clone client config to make sure they can be modified independently
      }

      redefineProperties(knexClone, knexClone.client);

      _copyEventListeners('query', knexFn, knexClone);

      _copyEventListeners('query-error', knexFn, knexClone);

      _copyEventListeners('query-response', knexFn, knexClone);

      _copyEventListeners('start', knexFn, knexClone);

      knexClone.userParams = params;
      return knexClone;
    }

  });

  if (!knexFn.context) {
    knexFn.context = knexContext;
  }
}

function _copyEventListeners(eventName, sourceKnex, targetKnex) {
  const listeners = sourceKnex.listeners(eventName);
  listeners.forEach(listener => {
    targetKnex.on(eventName, listener);
  });
}

function redefineProperties(knex, client) {
  // Allow chaining methods from the root object, before
  // any other information is specified.
  _methods.default.forEach(function (method) {
    knex[method] = function () {
      const builder = knex.queryBuilder();
      return builder[method].apply(builder, arguments);
    };
  });

  Object.defineProperties(knex, {
    context: {
      get() {
        return knex._context;
      },

      set(context) {
        knex._context = context; // Redefine public API for knex instance that would be proxying methods from correct context

        knex.raw = context.raw;
        knex.batchInsert = context.batchInsert;
        knex.transaction = context.transaction;
        knex.initialize = context.initialize;
        knex.destroy = context.destroy;
        knex.ref = context.ref;
        knex.withUserParams = context.withUserParams;
        knex.queryBuilder = context.queryBuilder;
        knex.disableProcessing = context.disableProcessing;
        knex.enableProcessing = context.enableProcessing;
      },

      configurable: true
    },
    client: {
      get() {
        return knex.context.client;
      },

      set(client) {
        knex.context.client = client;
      },

      configurable: true
    },
    userParams: {
      get() {
        return knex.context.userParams;
      },

      set(userParams) {
        knex.context.userParams = userParams;
      },

      configurable: true
    },
    schema: {
      get() {
        return knex.client.schemaBuilder();
      },

      configurable: true
    },
    migrate: {
      get() {
        return new _Migrator.default(knex);
      },

      configurable: true
    },
    seed: {
      get() {
        return new _Seeder.default(knex);
      },

      configurable: true
    },
    fn: {
      get() {
        return new _functionhelper.default(knex.client);
      },

      configurable: true
    }
  });
  initContext(knex);
  knex.Promise = bluebird;
  knex.client = client;
  knex.client.makeKnex = makeKnex;
  knex.userParams = {}; // Hook up the "knex" object as an EventEmitter.

  const ee = new _events.EventEmitter();

  for (const key in ee) {
    knex[key] = ee[key];
  } // Unfortunately, something seems to be broken in Node 6 and removing events from a clone also mutates original Knex,
  // which is highly undesireable


  if (knex._internalListeners && !(0, _versionHelper.isNode6)()) {
    knex._internalListeners.forEach(({
      eventName,
      listener
    }) => {
      knex.client.removeListener(eventName, listener); // Remove duplicates for copies
    });
  }

  knex._internalListeners = []; // Passthrough all "start" and "query" events to the knex object.

  _addInternalListener(knex, 'start', obj => {
    knex.emit('start', obj);
  });

  _addInternalListener(knex, 'query', obj => {
    knex.emit('query', obj);
  });

  _addInternalListener(knex, 'query-error', (err, obj) => {
    knex.emit('query-error', err, obj);
  });

  _addInternalListener(knex, 'query-response', (response, obj, builder) => {
    knex.emit('query-response', response, obj, builder);
  });
}

function _addInternalListener(knex, eventName, listener) {
  knex.client.on(eventName, listener);

  knex._internalListeners.push({
    eventName,
    listener
  });
}

function createQueryBuilder(knexContext, tableName, options) {
  const qb = knexContext.queryBuilder();
  if (!tableName) knexContext.client.logger.warn('calling knex without a tableName is deprecated. Use knex.queryBuilder() instead.');
  return tableName ? qb.table(tableName, options) : qb;
}

function shallowCloneFunction(originalFunction) {
  const fnContext = Object.create(Object.getPrototypeOf(originalFunction), Object.getOwnPropertyDescriptors(originalFunction));
  const knexContext = {};

  const knexFnWrapper = (tableName, options) => {
    return createQueryBuilder(knexContext, tableName, options);
  };

  const clonedFunction = knexFnWrapper.bind(fnContext);
  Object.assign(clonedFunction, originalFunction);
  clonedFunction._context = knexContext;
  return clonedFunction;
}

module.exports = exports.default;
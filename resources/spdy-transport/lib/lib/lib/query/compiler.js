"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _inherits = _interopRequireDefault(require("inherits"));

var _compiler = _interopRequireDefault(require("../../../query/compiler"));

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// MySQL Query Compiler
// ------
function QueryCompiler_MySQL(client, builder) {
  _compiler.default.call(this, client, builder);

  const returning = this.single.returning;

  if (returning) {
    this.client.logger.warn('.returning() is not supported by mysql and will not have any effect.');
  }
}

(0, _inherits.default)(QueryCompiler_MySQL, _compiler.default);
(0, _lodash.assign)(QueryCompiler_MySQL.prototype, {
  _emptyInsertValue: '() values ()',

  // Update method, including joins, wheres, order & limits.
  update() {
    const join = this.join();

    const updates = this._prepUpdate(this.single.update);

    const where = this.where();
    const order = this.order();
    const limit = this.limit();
    return `update ${this.tableName}` + (join ? ` ${join}` : '') + ' set ' + updates.join(', ') + (where ? ` ${where}` : '') + (order ? ` ${order}` : '') + (limit ? ` ${limit}` : '');
  },

  forUpdate() {
    return 'for update';
  },

  forShare() {
    return 'lock in share mode';
  },

  // Compiles a `columnInfo` query.
  columnInfo() {
    const column = this.single.columnInfo; // The user may have specified a custom wrapIdentifier function in the config. We
    // need to run the identifiers through that function, but not format them as
    // identifiers otherwise.

    const table = this.client.customWrapIdentifier(this.single.table, _lodash.identity);
    return {
      sql: 'select * from information_schema.columns where table_name = ? and table_schema = ?',
      bindings: [table, this.client.database()],

      output(resp) {
        const out = resp.reduce(function (columns, val) {
          columns[val.COLUMN_NAME] = {
            defaultValue: val.COLUMN_DEFAULT,
            type: val.DATA_TYPE,
            maxLength: val.CHARACTER_MAXIMUM_LENGTH,
            nullable: val.IS_NULLABLE === 'YES'
          };
          return columns;
        }, {});
        return column && out[column] || out;
      }

    };
  },

  limit() {
    const noLimit = !this.single.limit && this.single.limit !== 0;
    if (noLimit && !this.single.offset) return ''; // Workaround for offset only.
    // see: http://stackoverflow.com/questions/255517/mysql-offset-infinite-rows

    const limit = this.single.offset && noLimit ? '18446744073709551615' : this.formatter.parameter(this.single.limit);
    return `limit ${limit}`;
  }

}); // Set the QueryBuilder & QueryCompiler on the client object,
// in case anyone wants to modify things to suit their own purposes.

var _default = QueryCompiler_MySQL;
exports.default = _default;
module.exports = exports.default;
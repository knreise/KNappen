var PhoneGap;
(function (PhoneGap) {
    /// <reference path="../_References.ts" />
    (function (InteropProviders) {
        var SqlProvider = (function () {
            function SqlProvider() {
                this.dbVersion = "1";
            }
            SqlProvider.prototype.Load = function () {
                log.debug("SqlProvider", "Load()");
                log.debug("SQL", "Opening database KNAppenDB");
                this.db = window.openDatabase("KNAppenDB", "", "KNAppenDB", 20 * 1000 * 1024);

                this.updateDb();
            };

            SqlProvider.prototype.Init = function () {
                log.debug("SqlProvider", "Init()");
                var _this = this;
                phoneGapInterop.onInteropCommand.addHandler(function (target, action, params) {
                    _this.processInteropCommand(target, action, params);
                }, "SqlProvider");
            };

            SqlProvider.prototype.processInteropCommand = function (target, action, params) {
                log.debug("SqlProvider", "processInteropCommand: target: " + target + ", action: " + action);
                if (params)
                    $.each(params, function (k, v) {
                        log.debug("SqlProvider", "processInteropCommand: param: " + k + ", value: " + v);
                    });
                if (target.toLowerCase() === "sql") {
                    var table = params['table'];
                    var key = params['key'];
                    var value = params['value'];
                    var meta = params['meta'];

                    if (action === "set")
                        this.sqlSettingsSet(table, key, value, meta);

                    if (action === "remove")
                        this.sqlSettingsRemove(table, key);

                    if (action === "read")
                        this.sqlSettingsRead(table);
                }
            };

            SqlProvider.prototype.updateDb = function () {
                var _this = this;
                console.log("Current DB version: " + _this.db.version);
                if (_this.db.version != _this.dbVersion) {
                    var sql = "";
                    if (!_this.db.version || _this.db.version == "") {
                        // Table doesn't exist - create full table
                        console.log("SQLite Table doesn't exist, creating.");
                        _this.db.transaction(function (tx) {
                            sql = 'CREATE TABLE IF NOT EXISTS settings (key TEXT NOT NULL PRIMARY KEY, value TEXT, meta TEXT)';
                            log.debug("SqlProvider", "SQL: " + sql);
                            tx.executeSql(sql);
                        }, function (error) {
                            console.log("SQL CREATE: \"" + sql + "\": Error: " + error.code + ": " + error.message);
                        }, function () {
                            console.log("SQL CREATE Success: " + sql);
                        });
                        _this.db.changeVersion(_this.db.version, _this.dbVersion);
                    }

                    if (_this.db.version == "1.0") {
                        // Upgrade from 1.0 databases (beta-testers)
                        console.log("SQLite Table upgrade from 1.0 (beta-testers)");
                        _this.db.transaction(function (tx) {
                            sql = 'ALTER TABLE settings ADD COLUMN meta TEXT';
                            log.debug("SqlProvider", "SQL: " + sql);
                            tx.executeSql(sql);
                        }, function (error) {
                            console.log("SQL ALTER: \"" + sql + "\": Error: " + error.code + ": " + error.message);
                        }, function () {
                            console.log("SQL ALTER Success: " + sql);
                        });
                        _this.db.changeVersion(_this.db.version, "1");
                    }

                    if (_this.db.version != _this.dbVersion) {
                        log.debug("SqlProvider", "ERROR: Unsuccessful upgrade of SQLite tables. Current: " + _this.db.version + ", expected: " + _this.dbVersion);
                    } else {
                        log.debug("SqlProvider", "SUCCESS: Successful upgrade of SQLite tables. Current: " + _this.db.version + ", expected: " + _this.dbVersion);
                    }
                }
            };

            SqlProvider.prototype.sqlDo = function (name, callbackSuccess, callbackError, callbackTransactionSuccess, sql, keys) {
                var _this = this;

                this.db.transaction(function (tx) {
                    log.debug("SqlProvider", "[" + name + "] SQL executing: " + sql);
                    log.debug("SqlProvider", "[" + name + "] Keys: " + keys);
                    var result = tx.executeSql(sql, keys, function querySuccess(tx, results) {
                        var rowsAffected = "NA";
                        var rowCount = "NA";
                        try  {
                            if (results) {
                                rowsAffected = results.rowsAffected.toString();
                                if (results.rows)
                                    rowCount = results.rows.length.toString();
                            }
                        } catch (exception) {
                        }

                        log.debug("SqlProvider", "[" + name + "] SQL Rows affected: " + rowsAffected + ", rows returned: " + rowCount);

                        if (callbackSuccess)
                            callbackSuccess(tx, results);
                    });
                }, function (error) {
                    log.debug("SqlProvider", "[" + name + "] SQL error: \"" + sql + "\": Error: " + error.code + ": " + error.message);

                    if (callbackError)
                        callbackError(error);
                }, function () {
                    log.debug("SqlProvider", "[" + name + "] SQL Success: " + sql);

                    if (callbackTransactionSuccess)
                        callbackTransactionSuccess();
                });
            };

            SqlProvider.prototype.sqlDoSimple = function (name, sql, keys) {
                // Simple SQL-command, not interested in any callbacks
                this.sqlDo(name, null, null, null, sql, keys);
            };

            SqlProvider.prototype.sqlSettingsRemove = function (table, key) {
                // Completely remove key/value
                this.sqlDoSimple('SettingsRemove', 'DELETE FROM ' + table + ' WHERE key=?', [key]);
                this.sqlDoSimple('SettingsRemove', 'DELETE FROM ' + table + ' WHERE key=?', [key + ".meta"]);
            };

            SqlProvider.prototype.sqlSettingsSet = function (table, key, value, meta) {
                // Update key/value
                this.sqlDoSimple('SettingsSet', 'DELETE FROM ' + table + ' WHERE key=?', [key]);
                this.sqlDoSimple('SettingsSet', 'INSERT OR IGNORE INTO ' + table + ' (key, value, meta) VALUES (?, ?, ?)', [key, value, meta]);
            };

            SqlProvider.prototype.sqlSettingsRead = function (table) {
                var _this = this;
                var sql = 'SELECT * FROM ' + table;

                this.sqlDo('SettingsRead', function callbackSuccess(tx, results) {
                    if (!results || !results.rows) {
                        log.debug("SqlProvider", "sqlSettingsRead: Empty table: " + table);
                        return;
                    }

                    var len = results.rows.length;
                    log.debug("SqlProvider", "sqlSettingsRead: " + table + " table: " + len + " rows found.");
                    for (var i = 0; i < len; i++) {
                        var rKey = results.rows.item(i).key;
                        var rValue = results.rows.item(i).value;
                        var rMeta = results.rows.item(i).meta;
                        log.debug("SqlProvider", "SQL Row: " + i + " key: " + rKey + ", value:  " + rValue.length + " bytes, meta: " + rMeta);
                        phoneGapInterop.wikitudePluginProvider.sendInterop.callJavaScript("phoneGapProvider.SqlCallbackSet('" + rKey + "', '" + rValue + "', '" + rMeta + "')");
                    }
                }, function (error) {
                    if (error) {
                        log.debug("SqlProvider", "sqlSettingsRead: Reporting error to app: SQL: \"" + sql + "\": Error: " + error.code + ": " + error.message);
                        phoneGapInterop.wikitudePluginProvider.sendInterop.callJavaScript("phoneGapProvider.callbackSqlReadError('" + error.code + "', '" + error.message + "')");
                    } else {
                        phoneGapInterop.wikitudePluginProvider.sendInterop.callJavaScript("phoneGapProvider.callbackSqlReadError('', '')");
                    }
                }, function () {
                    log.debug("SqlProvider", "sqlSettingsRead: Reporting success to app.");
                    phoneGapInterop.wikitudePluginProvider.sendInterop.callJavaScript("phoneGapProvider.callbackSqlReadSuccess();");
                }, sql, []);
            };
            return SqlProvider;
        })();
        InteropProviders.SqlProvider = SqlProvider;
    })(PhoneGap.InteropProviders || (PhoneGap.InteropProviders = {}));
    var InteropProviders = PhoneGap.InteropProviders;
})(PhoneGap || (PhoneGap = {}));

var sqlProvider = new PhoneGap.InteropProviders.SqlProvider();
startup.addLoad(function () {
    sqlProvider.Load();
}, "SqlProvider");
startup.addLoad(function () {
    sqlProvider.Init();
}, "SqlProvider");
//@ sourceMappingURL=SqlProvider.js.map

/// <reference path="../_References.ts" />

module PhoneGap.InteropProviders {
    export class SqlProvider {
        public db: Database;
        public dbVersion = "1";

        public Load() {
            log.debug("SqlProvider", "Load()");
            log.debug("SQL", "Opening database KNAppenDB");
            this.db = window.openDatabase("KNAppenDB", "", "KNAppenDB", 20 * 1000 * 1024);

            this.updateDb();

        }

        public Init() {
            log.debug("SqlProvider", "Init()");
            var _this = this;
            phoneGapInterop.onInteropCommand.addHandler(function (target: string, action: string, params: any[]) {
                _this.processInteropCommand(target, action, params);
            }, "SqlProvider");
        }

        private processInteropCommand(target: string, action: string, params: any[]) {
            log.debug("SqlProvider", "processInteropCommand: target: " + target + ", action: " + action);
            if (params)
            $.each(params, function (k, v) {
                log.debug("SqlProvider", "processInteropCommand: param: " + k + ", value: " + v);
            });
            if (target.toLowerCase() === "sql")
            {
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
        }

        private updateDb() {
            var _this = this;
            console.log("Current DB version: " + _this.db.version);
            if (_this.db.version != _this.dbVersion) // or whatever version you want to update to
            {
                var sql = "";
                if (!_this.db.version || _this.db.version == "")
                {
                    // Table doesn't exist - create full table
                    console.log("SQLite Table doesn't exist, creating.");
                    _this.db.transaction(
                        function (tx: SQLTransaction) {
                            sql = 'CREATE TABLE IF NOT EXISTS settings (key TEXT NOT NULL PRIMARY KEY, value TEXT, meta TEXT)';
                            log.debug("SqlProvider", "SQL: " + sql);
                            tx.executeSql(sql);
                        },
                        function (error) { console.log("SQL CREATE: \"" + sql + "\": Error: " + error.code + ": " + error.message); },
                        function () { console.log("SQL CREATE Success: " + sql); });
                    _this.db.changeVersion(_this.db.version, _this.dbVersion);
                }

                if (_this.db.version == "1.0") {
                    // Upgrade from 1.0 databases (beta-testers)
                    console.log("SQLite Table upgrade from 1.0 (beta-testers)");
                    _this.db.transaction(
                        function (tx: SQLTransaction) {
                            sql = 'ALTER TABLE settings ADD COLUMN meta TEXT';
                            log.debug("SqlProvider", "SQL: " + sql);
                            tx.executeSql(sql);
                        },
                        function (error) { console.log("SQL ALTER: \"" + sql + "\": Error: " + error.code + ": " + error.message); },
                        function () { console.log("SQL ALTER Success: " + sql); });
                    _this.db.changeVersion(_this.db.version, "1");
                }
                //

                //_this.db.transaction(
                //    function (tx: SQLTransaction) {
                //        sql = 'DROP TABLE IF EXISTS settings';
                //        console.log("SQL: " + sql);
                //        tx.executeSql(sql);
                //    },
                //    function (error) { console.log("SQL DROP: \"" + sql + "\": Error: " + error.code + ": " + error.message); },
                //    function () { console.log("SQL DROP Success: " + sql); });
                if (_this.db.version != _this.dbVersion) {
                    log.debug("SqlProvider", "ERROR: Unsuccessful upgrade of SQLite tables. Current: " + _this.db.version + ", expected: " + _this.dbVersion);
                } else {
                    log.debug("SqlProvider", "SUCCESS: Successful upgrade of SQLite tables. Current: " + _this.db.version + ", expected: " + _this.dbVersion);
                }

            }
        }

        public sqlDo(name: string, callbackSuccess: { (tx: SQLTransaction, results: SQLResultSet): void }, callbackError: { (error: SQLError): void }, callbackTransactionSuccess: { (): void }, sql: string, keys: any) {
            var _this = this;
     
            this.db.transaction(
                function (tx: SQLTransaction) {
                    log.debug("SqlProvider", "[" + name + "] SQL executing: " + sql);
                    log.debug("SqlProvider", "[" + name + "] Keys: " + keys);
                    var result: SQLResultSet = tx.executeSql(sql, keys,
                        function querySuccess(tx: SQLTransaction, results: SQLResultSet) {
                            var rowsAffected = "NA";
                            var rowCount = "NA";
                            try {
                                if (results) {
                                    rowsAffected = results.rowsAffected.toString();
                                    if (results.rows)
                                        rowCount = results.rows.length.toString();
                                }
                            } catch (exception) { }

                            log.debug("SqlProvider", "[" + name + "] SQL Rows affected: " + rowsAffected + ", rows returned: " + rowCount);

                            // Callback if any
                            if (callbackSuccess)
                                callbackSuccess(tx, results);
                        });

                },
                function (error: SQLError) {
                    log.debug("SqlProvider", "[" + name + "] SQL error: \"" + sql + "\": Error: " + error.code + ": " + error.message);
                    //console.log("[" + name + "] SQL error: \"" + sql + "\": Error: " + error.code + ": " + error.message);
                    // Callback if any
                    if (callbackError)
                        callbackError(error);
                },
                function () {
                    log.debug("SqlProvider", "[" + name + "] SQL Success: " + sql);
                    // Callback if any
                    if (callbackTransactionSuccess)
                        callbackTransactionSuccess();
                });
        }

        public sqlDoSimple(name: string, sql: string, keys: any) {
            // Simple SQL-command, not interested in any callbacks
            this.sqlDo(name, null, null, null, sql, keys);
        }

        public sqlSettingsRemove(table: string, key: string) {
            // Completely remove key/value
            this.sqlDoSimple('SettingsRemove', 'DELETE FROM ' + table + ' WHERE key=?', [key]);
            this.sqlDoSimple('SettingsRemove', 'DELETE FROM ' + table + ' WHERE key=?', [key + ".meta"]);
        }

        public sqlSettingsSet(table: string, key: string, value: string, meta: string) {
            // Update key/value
            this.sqlDoSimple('SettingsSet', 'DELETE FROM ' + table + ' WHERE key=?', [key]);
            this.sqlDoSimple('SettingsSet', 'INSERT OR IGNORE INTO ' + table + ' (key, value, meta) VALUES (?, ?, ?)', [key, value, meta]);
        }

        public sqlSettingsRead(table: string) {
            var _this = this;
            var sql = 'SELECT * FROM ' + table;

            this.sqlDo('SettingsRead',
                function callbackSuccess(tx: SQLTransaction, results: SQLResultSet) {
                    if (!results || !results.rows) {
                        log.debug("SqlProvider", "sqlSettingsRead: Empty table: " + table)
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
                },
                function (error: SQLError) {
                    if (error) {
                        log.debug("SqlProvider", "sqlSettingsRead: Reporting error to app: SQL: \"" + sql + "\": Error: " + error.code + ": " + error.message);
                        phoneGapInterop.wikitudePluginProvider.sendInterop.callJavaScript("phoneGapProvider.callbackSqlReadError('" + error.code + "', '" + error.message + "')");
                    } else {
                        phoneGapInterop.wikitudePluginProvider.sendInterop.callJavaScript("phoneGapProvider.callbackSqlReadError('', '')");
                    }
                },
                function () {
                    log.debug("SqlProvider", "sqlSettingsRead: Reporting success to app.");
                    phoneGapInterop.wikitudePluginProvider.sendInterop.callJavaScript("phoneGapProvider.callbackSqlReadSuccess();");
                },
                sql, []);
        }

    }
}

var sqlProvider = new PhoneGap.InteropProviders.SqlProvider();
startup.addLoad(function () { sqlProvider.Load(); }, "SqlProvider");
startup.addLoad(function () { sqlProvider.Init(); }, "SqlProvider");

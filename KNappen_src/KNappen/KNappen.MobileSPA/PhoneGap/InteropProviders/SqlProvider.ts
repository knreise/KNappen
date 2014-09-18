/// <reference path="../_References.ts" />

module PhoneGap.InteropProviders {
    export class SqlProvider {
        public db: Database;
        public dbVersion = "2";

        public load() {
            log.verboseDebug("SqlProvider", "Load");

            if (compatibilityInfo.isMobile) {
                log.info("SqlProvider", "Opening database KNAppenDB");
                this.db = window.openDatabase("KNAppenDB", "", "KNAppenDB", 30 * 1000 * 1024);
                this.updateDb();
            }
            else {
                startup.finishedLoad("SqlProvider");
            }
        }

        private updateDb(): void {
            log.info("SqlProvider", "Current Database version: '" + this.db.version + "'");

            // Bug fix - change version does not work with database above 20MB
            //if (true) {
            //    this.db.transaction(this.bugFixAlwaysTryToUpdate, this.loadCompleteWithError, this.loadComplete);
            //}

            if (!this.db.version || this.db.version == "") {
                this.db.transaction(this.updateFromEmpty, this.loadCompleteWithError, this.loadComplete);
            }
            else if (this.db.version == "1") {
                this.db.transaction(this.updateFromVersion1, this.loadCompleteWithError, this.loadComplete);
            }
            else {
                log.info("SqlProvider", "Database already at latest version");
                startup.finishedLoad("SqlProvider");
            }
        }

        private bugFixAlwaysTryToUpdate(tx: SQLTransaction): void {
            log.info("SqlProvider", "BugFix - Attempting to update database if not already up to date");
            tx.executeSql('CREATE TABLE IF NOT EXISTS settings (key TEXT NOT NULL PRIMARY KEY, value TEXT, meta TEXT)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS mapcache (key TEXT NOT NULL PRIMARY KEY, value BLOB, meta TEXT)');

            tx.executeSql('CREATE TABLE IF NOT EXISTS routes (id TEXT NOT NULL PRIMARY KEY, type TEXT, name TEXT, pois BLOB, version TEXT, mapCached TEXT)');
        }

        private updateFromEmpty(tx: SQLTransaction): void {
            log.info("SqlProvider", "Updating database from 'no previous version installed'");
            tx.executeSql('CREATE TABLE IF NOT EXISTS settings (key TEXT NOT NULL PRIMARY KEY, value TEXT, meta TEXT)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS mapcache (key TEXT NOT NULL PRIMARY KEY, value BLOB, meta TEXT)');

            tx.executeSql('CREATE TABLE IF NOT EXISTS routes (id TEXT NOT NULL PRIMARY KEY, type TEXT, name TEXT, pois BLOB, version TEXT, mapCached TEXT)');
        }

        private updateFromVersion1(tx: SQLTransaction): void {
            log.info("SqlProvider", "Updating database from 'version 1'");
            tx.executeSql('CREATE TABLE IF NOT EXISTS mapcache (key TEXT NOT NULL PRIMARY KEY, value BLOB, meta TEXT)');

            tx.executeSql('CREATE TABLE IF NOT EXISTS routes (id TEXT NOT NULL PRIMARY KEY, type TEXT, name TEXT, pois BLOB, version TEXT, mapCached TEXT)');
        }

        private loadComplete(): void {
            log.info("SqlProvider", "Update finished");

            // Bug fix - change version does not work with database above 20MB
            sqlProvider.db.changeVersion(sqlProvider.db.version, sqlProvider.dbVersion);

            startup.finishedLoad("SqlProvider");
        }

        private loadCompleteWithError(error: any): void {
            log.error("SqlProvider", "Update finished with errors: " + error.code + " - " + error.message);
            startup.finishedLoad("SqlProvider");
        }

        public sqlDo(name: string, callbackSuccess: { (tx: SQLTransaction, results: SQLResultSet): void }, callbackError: { (error: SQLError): void }, callbackTransactionSuccess: { (): void }, sql: string, keys: any) {
            var _this = this;

            this.db.transaction(
                function (tx: SQLTransaction) {
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

                            if (callbackSuccess)
                                callbackSuccess(tx, results);
                        });

                },
                function (error: SQLError) {
                    log.error("SqlProvider", "[" + name + "] SQL error: \"" + sql + "\": Error: " + error.code + ": " + error.message);
                    if (callbackError)
                        callbackError(error);
                },
                function () {
                    if (callbackTransactionSuccess)
                        callbackTransactionSuccess();
                });
        }

        public sqlDoSimple(name: string, sql: string, keys: any) {
            this.sqlDo(name, null, null, null, sql, keys);
            return true;
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

        public sqlSettingsRead(table: string, finishedCallback?: () => void ) {
            var _this = this;
            var sql = 'SELECT * FROM ' + table;

            this.sqlDo('SettingsRead',
                function callbackSuccess(tx: SQLTransaction, results: SQLResultSet) {
                    if (!results || !results.rows) {
                        log.debug("SqlProvider", "sqlSettingsRead: Empty table: " + table);
                        return true;
                    }

                    try {
                        var len = results.rows.length;
                        log.debug("SqlProvider", "sqlSettingsRead: " + table + " table: " + len + " rows found.");
                        for (var i = 0; i < len; i++) {
                            var rKey = results.rows.item(i).key;
                            var rValue = results.rows.item(i).value;
                            var rMeta = results.rows.item(i).meta;
                            log.debug("SqlProvider", "sqlSettingsRead: SQL Row: " + i + " key: " + rKey);

                            tx.executeSql('CREATE TABLE IF NOT EXISTS routes (id TEXT NOT NULL PRIMARY KEY, type TEXT, name TEXT, pois BLOB)');


                            phoneGapProvider.SqlCallbackSet(rKey, rValue, rMeta);
                        }
                    } catch (exception) {
                        log.error("SqlProvider", "sqlSettingsRead: exception was thorwn in callbackSuccess:" + exception);
                        throw exception;
                    }
                },

                function (error: SQLError) {
                    if (error) {
                        log.error("SqlProvider", "sqlSettingsRead: Reporting error to app: SQL: \"" + sql + "\": Error: " + error.code + ": " + error.message);
                    }
                    if (finishedCallback != null) {
                        finishedCallback();
                    }
                },

                function () {
                    log.debug("SqlProvider", "sqlSettingsRead: Reporting success to app.");
                    if (finishedCallback != null) {
                        finishedCallback();
                    }
                },
                sql, []);
        }
    }
}

var sqlProvider = new PhoneGap.InteropProviders.SqlProvider();
startup.addLoad(function () { sqlProvider.load(); }, "SqlProvider");
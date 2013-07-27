var System;
(function (System) {
    /// <reference path="../_References.ts" />
    /// <reference path="../Diagnostics/Log.ts" />
    /**
    System provider modules
    @namespace System.Providers
    */
    (function (Providers) {
        var HttpDownloadItem = (function () {
            //public id: string = null;
            //public url: string = null;
            //public doneCallback: { (data: string): void; } = null;
            //public failCallback: { (message: string): void; } = null;
            //public alwaysCallback: { (): void; } = null;
            /**
            * HttpDownloadItem
            * @class System.Providers.HttpDownloadItem
            * @classdesc Download item for HttoDownloadProvider
            * @param {any} id ID for later reference of download.
            * @param {string} [url] URL to download
            * @param {function} [doneCallback] Callback for when download is done: function(data: string) {}
            * @param {function} [failCallback] Callback for failure: function(message: string) {}
            * @param {function} [alwaysCallback] Callback when done/fail is done: function() {}
            * @param {string} [dataType] JQuery download type (json, xml, html, etc).
            */
            function HttpDownloadItem(id, url, doneCallback, failCallback, alwaysCallback, dataType) {
                if (typeof dataType === "undefined") { dataType = "html"; }
                this.id = id;
                this.url = url;
                this.doneCallback = doneCallback;
                this.failCallback = failCallback;
                this.alwaysCallback = alwaysCallback;
                this.dataType = dataType;
            }
            return HttpDownloadItem;
        })();
        Providers.HttpDownloadItem = HttpDownloadItem;

        (function (HttpDownloadQueuePriority) {
            HttpDownloadQueuePriority[HttpDownloadQueuePriority["Low"] = 0] = "Low";
            HttpDownloadQueuePriority[HttpDownloadQueuePriority["Normal"] = 1] = "Normal";

            HttpDownloadQueuePriority[HttpDownloadQueuePriority["High"] = 2] = "High";
        })(Providers.HttpDownloadQueuePriority || (Providers.HttpDownloadQueuePriority = {}));
        var HttpDownloadQueuePriority = Providers.HttpDownloadQueuePriority;

        var HttpDownloadProvider = (function () {
            /**
            * HttpDownloadProvider
            * @class System.Providers.HttpDownloadProvider
            * @classdesc Provides prioritized scheduled queued http downloading service.
            */
            function HttpDownloadProvider() {
                this.httpDownloadQueue = new HttpDownloadQueue();
                this.currentDownloadCount = 0;
                this.paused = false;
                var _this = this;
                setInterval(function () {
                    _this.tick();
                }, 500);
            }
            /**
            * Add HttpDownloadItem to download queue.
            * @method System.Providers.HttpDownloadProvider#enqueueItem
            * @param {string} queueName Name of queue to add to.
            * @param {System.Providers.HttpDownloadQueuePriority} queuePriority Queue priority.
            * @param {System.Providers.HttpDownloadItem} item System.Providers.HttpDownloadItem to queue for download.
            */
            HttpDownloadProvider.prototype.enqueueItem = function (queueName, queuePriority, item) {
                this.httpDownloadQueue.enqueue(queueName, queuePriority, item);
            };

            /*
            * Clear a queue for all downloads (except running downloads)
            * @method System.Providers.HttpDownloadProvider#clearQueue
            * @param {string} queueName Name of queue to clear.
            */
            HttpDownloadProvider.prototype.clearQueue = function (queueName) {
                this.httpDownloadQueue.clearQueue(queueName);
            };

            /*
            * Each tick we check if we should start another download
            * @ignore
            */
            HttpDownloadProvider.prototype.tick = function () {
                if (this.paused)
                    return;

                if (this.currentDownloadCount > config.httpDownloadMaxSimultaneousDownloads)
                    return;

                // Get next item in queue
                var item = this.httpDownloadQueue.getNext();
                if (!item)
                    return;

                //
                this.executeDownload(item);
            };

            HttpDownloadProvider.prototype.executeDownload = function (item) {
                // Assign handlers immediately after making the request,
                // and remember the jqxhr object for this request
                var _this = this;

                try  {
                    _this.currentDownloadCount++;
                    var jqxhr = $.ajax({ url: item.url, dataType: item.dataType }).done(function (data, textStatus, jqXHR) {
                        if (item.doneCallback)
                            item.doneCallback(data);
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        if (item.failCallback)
                            item.failCallback(textStatus + ": " + errorThrown);
                    }).always(function (a, textStatus, b) {
                        _this.currentDownloadCount--;

                        if (item.alwaysCallback)
                            item.alwaysCallback();
                    });
                } catch (exception) {
                    log.error("HttpDownloadProvider", "Exception starting download of URL \"" + item.url + "\": " + exception);
                    _this.currentDownloadCount--;
                    item.failCallback("Exception: " + exception);
                    item.alwaysCallback();
                }
            };
            return HttpDownloadProvider;
        })();
        Providers.HttpDownloadProvider = HttpDownloadProvider;

        var HttpDownloadQueue = (function () {
            /**
            * HttpDownloadQueue
            * @class System.Providers.HttpDownloadQueue
            * @classdesc Download queue used internally by System.Providers.HttpDownloadProvider
            */
            function HttpDownloadQueue() {
                /** @ignore */ this.queues = {};
                this.queues[System.Providers.HttpDownloadQueuePriority.Low.toString()] = {};
                this.queues[System.Providers.HttpDownloadQueuePriority.Normal.toString()] = {};
                this.queues[System.Providers.HttpDownloadQueuePriority.High.toString()] = {};
            }
            /**
            * Add HttpDownloadItem to download queue.
            * @method System.Providers.HttpDownloadQueue#enqueue
            * @param {string} queueName Name of queue to add to.
            * @param {System.Providers.HttpDownloadQueuePriority} queuePriority Queue priority.
            * @param {System.Providers.HttpDownloadItem} item System.Providers.HttpDownloadItem to queue for download.
            */
            HttpDownloadQueue.prototype.enqueue = function (queueName, queuePriority, item) {
                log.verboseDebug("HttpDownloadProvider", "Enqueue:" + queueName + ":" + queuePriority.toString() + ": ID: " + (item.id || "<null>") + ", URL: " + item.url);
                var qp = this.queues[queuePriority.toString()];

                if (!qp[queueName]) {
                    log.verboseDebug("HttpDownloadProvider", "Queue " + queueName + ":" + queuePriority.toString() + " created (first time use).");
                    qp[queueName] = [];
                }

                // Add item to queue
                qp[queueName].push(item);
                log.verboseDebug("HttpDownloadProvider", "Queue " + queueName + ":" + queuePriority.toString() + " length: " + qp[queueName].length);
            };

            /*
            * Clear a queue for all downloads (except running downloads)
            * @method System.Providers.HttpDownloadQueue#clearQueue
            * @param {string} queueName Name of queue to clear.
            */
            HttpDownloadQueue.prototype.clearQueue = function (queueName) {
                log.verboseDebug("HttpDownloadProvider", "ClearQueue:" + queueName);
                this._clearQueue(System.Providers.HttpDownloadQueuePriority.Low, queueName);
                this._clearQueue(System.Providers.HttpDownloadQueuePriority.Normal, queueName);
                this._clearQueue(System.Providers.HttpDownloadQueuePriority.High, queueName);
            };
            HttpDownloadQueue.prototype._clearQueue = function (queuePriority, queueName) {
                // Empty queue
                var qp = this.queues[queuePriority.toString()];
                if (qp[queueName])
                    qp[queueName] = undefined;
            };

            /*
            * Get next item from queue.
            * @method System.Providers.HttpDownloadQueue#getNext
            * @returns {System.Providers.HttpDownloadItem} System.Providers.HttpDownloadItem
            */
            HttpDownloadQueue.prototype.getNext = function () {
                var ret = null;

                // From highest to low, look for an item to return
                ret = this._getNext(System.Providers.HttpDownloadQueuePriority.High);
                if (ret)
                    return ret;
                ret = this._getNext(System.Providers.HttpDownloadQueuePriority.Normal);
                if (ret)
                    return ret;
                ret = this._getNext(System.Providers.HttpDownloadQueuePriority.Low);
                if (ret)
                    return ret;
                return null;
            };
            HttpDownloadQueue.prototype._getNext = function (queuePriority) {
                // Get first item in first queue under this priority
                var qp = this.queues[queuePriority.toString()];
                var ret = null;
                var qName = null;
                $.each(qp, function (queueName, items) {
                    if (items && items.length > 0 && !ret) {
                        qName = queueName;
                        ret = items.shift();
                        return;
                    }
                });

                if (ret)
                    log.verboseDebug("HttpDownloadProvider", "GetNext(returns):" + qName + ":" + queuePriority.toString() + ": ID: " + (ret.id || "<null>") + ", URL: " + ret.url);

                return ret;
            };
            return HttpDownloadQueue;
        })();
        Providers.HttpDownloadQueue = HttpDownloadQueue;
    })(System.Providers || (System.Providers = {}));
    var Providers = System.Providers;
})(System || (System = {}));
var httpDownloadProvider = new System.Providers.HttpDownloadProvider();
//@ sourceMappingURL=HttpDownloadProvider.js.map

/// <reference path="../_References.ts" />
/// <reference path="../Diagnostics/Log.ts" />
/**
    System provider modules
    @namespace System.Providers
*/
module System.Providers {
    declare var config;
    export class HttpDownloadItem {
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
        constructor(
            public id?: any,
            public url?: string,
            public doneCallback?: { (data: string): void; },
            public failCallback?: { (message: string): void; },
            public alwaysCallback?: { (): void; },
            public dataType: string = "html")
            { }

    }

    export enum HttpDownloadQueuePriority {
        Low = 0,
        Normal = 1,
        High = 2
    }

    export class HttpDownloadProvider {
        private httpDownloadQueue = new HttpDownloadQueue();
        private currentDownloadCount: number = 0;
        public paused: bool = false;

        /**
          * HttpDownloadProvider
          * @class System.Providers.HttpDownloadProvider
          * @classdesc Provides prioritized scheduled queued http downloading service.
          */
        constructor() {
            var _this = this;
            setInterval(function () { _this.tick(); }, 500);
        }

        /**
          * Add HttpDownloadItem to download queue.
          * @method System.Providers.HttpDownloadProvider#enqueueItem
          * @param {string} queueName Name of queue to add to.
          * @param {System.Providers.HttpDownloadQueuePriority} queuePriority Queue priority.
          * @param {System.Providers.HttpDownloadItem} item System.Providers.HttpDownloadItem to queue for download.
          */
        public enqueueItem(queueName: string, queuePriority: System.Providers.HttpDownloadQueuePriority, item: System.Providers.HttpDownloadItem) {
            this.httpDownloadQueue.enqueue(queueName, queuePriority, item);
        }

        /*
         * Clear a queue for all downloads (except running downloads)
         * @method System.Providers.HttpDownloadProvider#clearQueue
         * @param {string} queueName Name of queue to clear.
         */
        public clearQueue(queueName: string) {
            this.httpDownloadQueue.clearQueue(queueName);
        }

        /*
         * Each tick we check if we should start another download
         * @ignore
         */
        private tick() {

            if (this.paused)
                return;

            // Less than max?
            if (this.currentDownloadCount > config.httpDownloadMaxSimultaneousDownloads)
                return;

            // Get next item in queue
            var item = this.httpDownloadQueue.getNext();
            if (!item)
                return;

            // 
            this.executeDownload(item);
        }

        private executeDownload(item: System.Providers.HttpDownloadItem) {
            // Assign handlers immediately after making the request,
            // and remember the jqxhr object for this request
            var _this = this;
            //log.verboseDebug("HttpDownloadProvider", "ExecuteDownload:Start: ID: " + (item.id || "<null>") + ", URL: " + item.url);

            try {
                _this.currentDownloadCount++;
                var jqxhr = $.ajax({ url: item.url, dataType: item.dataType})
                .done(function (data, textStatus, jqXHR) {
                    if (item.doneCallback)
                        item.doneCallback(data);
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (item.failCallback)
                        item.failCallback(textStatus + ": " + errorThrown);
                })
                .always(function (a, textStatus, b) {
                    _this.currentDownloadCount--;
                    //log.verboseDebug("HttpDownloadProvider", "ExecuteDownload:End: ID: " + (item.id || "<null>") + ", URL: " + item.url);
                    if (item.alwaysCallback)
                        item.alwaysCallback();
                });
            } catch (exception) {
                log.error("HttpDownloadProvider", "Exception starting download of URL \"" + item.url + "\": " + exception);
                _this.currentDownloadCount--;
                item.failCallback("Exception: " + exception);
                item.alwaysCallback();
            }
        }

    }


    export class HttpDownloadQueue {
        /** @ignore */ private queues: { [queuePriority: string]: { [queueName: string]: System.Providers.HttpDownloadItem[]; }; } = {};
        
        /**
          * HttpDownloadQueue
          * @class System.Providers.HttpDownloadQueue
          * @classdesc Download queue used internally by System.Providers.HttpDownloadProvider
          */
        constructor() {
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
        public enqueue(queueName: string, queuePriority: System.Providers.HttpDownloadQueuePriority, item: System.Providers.HttpDownloadItem) {
            log.verboseDebug("HttpDownloadProvider", "Enqueue:" + queueName + ":" + queuePriority.toString() + ": ID: " + (item.id || "<null>") + ", URL: " + item.url);
            var qp = this.queues[queuePriority.toString()];
            // Check if queue exists, if not then create
            if (!qp[queueName]) {
                log.verboseDebug("HttpDownloadProvider", "Queue " + queueName + ":" + queuePriority.toString() + " created (first time use).");
                qp[queueName] = [];
            }
            // Add item to queue
            qp[queueName].push(item);
            log.verboseDebug("HttpDownloadProvider", "Queue " + queueName + ":" + queuePriority.toString() + " length: " + qp[queueName].length);
        }

        /*
         * Clear a queue for all downloads (except running downloads)
         * @method System.Providers.HttpDownloadQueue#clearQueue
         * @param {string} queueName Name of queue to clear.
         */
        public clearQueue(queueName: string) {
            log.verboseDebug("HttpDownloadProvider", "ClearQueue:" + queueName);
            this._clearQueue(System.Providers.HttpDownloadQueuePriority.Low, queueName);
            this._clearQueue(System.Providers.HttpDownloadQueuePriority.Normal, queueName);
            this._clearQueue(System.Providers.HttpDownloadQueuePriority.High, queueName);
        }
        private _clearQueue(queuePriority: System.Providers.HttpDownloadQueuePriority, queueName: string) {
            // Empty queue
            var qp = this.queues[queuePriority.toString()];
            if (qp[queueName])
                qp[queueName] = undefined;
        }

        /*
         * Get next item from queue.
         * @method System.Providers.HttpDownloadQueue#getNext
         * @returns {System.Providers.HttpDownloadItem} System.Providers.HttpDownloadItem
         */
        public getNext(): System.Providers.HttpDownloadItem {
            var ret: System.Providers.HttpDownloadItem = null;
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
        }
        private _getNext(queuePriority: System.Providers.HttpDownloadQueuePriority): System.Providers.HttpDownloadItem {
            // Get first item in first queue under this priority
            var qp = this.queues[queuePriority.toString()];
            var ret: System.Providers.HttpDownloadItem = null;
            var qName: string = null;
            $.each(qp, function (queueName: string, items: System.Providers.HttpDownloadItem[]) {
                if (items && items.length > 0 && !ret) {
                    qName = queueName;
                    ret = items.shift();
                    return;
                }
            });

            if (ret)
                log.verboseDebug("HttpDownloadProvider", "GetNext(returns):" + qName + ":" + queuePriority.toString() + ": ID: " + (ret.id || "<null>") + ", URL: " + ret.url);

            return ret;
        }
    }

}
var httpDownloadProvider = new System.Providers.HttpDownloadProvider();
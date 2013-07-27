var System;
(function (System) {
    /// <reference path="../Diagnostics/Log.ts" />
    /// <reference path="../../../Scripts/typings/jquery/jquery.d.ts" />
    /**
    GUI modules
    @namespace
    */
    (function (GUI) {
        var ViewControllerItem = (function () {
            /**
            ViewControllerItem
            @class System.GUI.ViewControllerItem
            @classdesc Creates an instance of a ViewController item (a page).
            */
            function ViewControllerItem() {
            }
            return ViewControllerItem;
        })();
        GUI.ViewControllerItem = ViewControllerItem;

        var ViewController = (function () {
            /**
            ViewController
            @class System.GUI.ViewController
            @classdesc Creates an instance of a ViewController
            */
            function ViewController() {
                /** @ignore */ this.knownViews = {};
                /** @ignore */ this.viewHistory = [];
                this._this = $(this);
                var _this = this;
                window.onhashchange = function () {
                    _this.processUrl();
                };
            }
            /**
            processUrl
            @method System.GUI.ViewController#processUrl
            @type bool
            @public
            */
            ViewController.prototype.processUrl = function () {
                var hash = location.hash;
                if (hash.indexOf("#") < 0)
                    return null;

                var id = hash.replace('#', '');
                log.debug("ViewController", "Hash navigation: " + id);
                return this.openView(id);
            };

            /**
            Add a view to the ViewController.
            @method System.GUI.ViewController#AddView
            @param {string} name The ID of the DOMElement, for example the ID of the DIV tag.
            @public
            */
            ViewController.prototype.AddView = function (name) {
                log.debug("ViewController", "Adding view: " + name);
                var v = new System.GUI.ViewControllerItem();
                v.name = name;
                v.item = $("#" + name);

                if (!v.item) {
                    // Sanity check
                    log.error("ViewController", "View '" + name + "' not found.");
                    return;
                }

                this.knownViews[name] = v;
            };

            /**
            Return all known views.
            @method System.GUI.ViewController#getViews
            @type Array A hash of all known ViewControllerItem.
            @public
            */
            ViewController.prototype.getViews = function () {
                return this.knownViews;
            };

            ViewController.prototype.goBack = function () {
                log.debug("ViewController", "goBack: History length: " + this.viewHistory.length);
                if (this.viewHistory.length < 1)
                    return false;

                var view = this.viewHistory.pop();

                if (view && view.name) {
                    this.selectView(view.name);
                    log.debug("ViewController", "goBack: Last page: " + view.name);
                    return true;
                }

                log.debug("ViewController", "goBack: No more history items.");
                return false;
            };

            /**
            Return current view.
            @method System.GUI.ViewController#getCurrentView()
            @type ViewControllerItem Name of current view.
            @public
            */
            ViewController.prototype.getCurrentView = function () {
                return this.currentView;
            };

            /**
            Return previous view.
            @method System.GUI.ViewController#getOldView
            @type ViewControllerItem Name of old view.
            @public
            */
            ViewController.prototype.getOldView = function () {
                return this.oldView;
            };

            /**
            Select a new view.
            @method System.GUI.ViewController#selectView
            @param {string} name The ID of the DOMElement, for example the ID of the DIV tag.
            @public
            */
            ViewController.prototype.selectView = function (name) {
                //location.hash = "#" + name;
                var view = this.openView(name);

                if (this.oldView)
                    this.viewHistory.push(this.oldView);

                while (this.viewHistory.length > config.maxViewControllerBackHistory) {
                    this.viewHistory.shift();
                }

                return view;
            };
            ViewController.prototype.openView = function (name) {
                var view = this.knownViews[name];
                if (!view) {
                    // Sanity check
                    log.error("ViewController", "selectView: View '" + name + "' does not exist.");
                    return null;
                }
                log.debug("ViewController", "selectView: View '" + name + "' selected.");

                if (this.currentView && this.currentView.name == name)
                    return this.currentView;

                this.oldView = this.currentView;

                // Do selection
                this.doPreSelectEvent(this.oldView, view);
                this.currentView = view;
                this.hideAllViews();
                view.item.show();
                this.doSelectEvent(this.oldView, view);
                this.doPostSelectEvent(this.oldView, view);
                return this.currentView;
            };

            /** @ignore */
            ViewController.prototype.hideAllViews = function () {
                $.each(this.knownViews, function (k, v) {
                    //log.verboseDebug("ViewController", "Hiding: " + k);
                    v.item.hide();
                });
            };

            //
            // Type safe event system
            //
            /**
            Hook up to PreSelectView event.
            @method System.GUI.ViewController#addPreSelectEvent
            @param {eventCallback} Callback function with signature "function (event: JQueryEventObject, oldView: System.GUI.ViewControllerItem, newView: System.GUI.ViewControllerItem) {}" (or just "function (event, oldView, newView) {}" in JS).
            @public
            */
            ViewController.prototype.addPreSelectEvent = function (eventCallback) {
                this._this.on('PreSelectView', eventCallback);
            };

            /**
            Hook up to SelectView event.
            @method System.GUI.ViewController#addSelectEvent
            @param {eventCallback} Callback function with signature "function (event: JQueryEventObject, oldView: System.GUI.ViewControllerItem, newView: System.GUI.ViewControllerItem) {}" (or just "function (event, oldView, newView) {}" in JS).
            @public
            */
            ViewController.prototype.addSelectEvent = function (eventCallback) {
                this._this.on('SelectView', eventCallback);
            };

            /**
            Hook up to PostSelectView event.
            @method System.GUI.ViewController#addPostSelectEvent
            @param {eventCallback} Callback function with signature "function (event: JQueryEventObject, oldView: System.GUI.ViewControllerItem, newView: System.GUI.ViewControllerItem) {}" (or just "function (event, oldView, newView) {}" in JS).
            @public
            */
            ViewController.prototype.addPostSelectEvent = function (eventCallback) {
                this._this.on('PostSelectView', eventCallback);
            };

            /** @ignore */
            ViewController.prototype.doPreSelectEvent = function (oldView, newView) {
                this._this.trigger('PreSelectView', [oldView, newView]);
            };

            /** @ignore */
            ViewController.prototype.doSelectEvent = function (oldView, newView) {
                this._this.trigger('SelectView', [oldView, newView]);
            };

            /** @ignore */
            ViewController.prototype.doPostSelectEvent = function (oldView, newView) {
                this._this.trigger('PostSelectView', [oldView, newView]);
            };
            return ViewController;
        })();
        GUI.ViewController = ViewController;
    })(System.GUI || (System.GUI = {}));
    var GUI = System.GUI;
})(System || (System = {}));
var viewController = new System.GUI.ViewController();
//@ sourceMappingURL=ViewController.js.map

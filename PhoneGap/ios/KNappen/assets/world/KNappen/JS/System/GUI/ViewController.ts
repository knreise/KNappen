/// <reference path="../Diagnostics/Log.ts" />
/// <reference path="../../../Scripts/typings/jquery/jquery.d.ts" />
/**
    GUI modules
    @namespace
*/
module System.GUI {
    declare var config: System.ConfigBase;

    export class ViewControllerItem {
        /**
            ViewControllerItem
            @class System.GUI.ViewControllerItem
            @classdesc Creates an instance of a ViewController item (a page).
        */
        constructor() {
        }

        /**
            Name of the view
            @member System.GUI.ViewControllerItem#name
            @public
            @type {string}
        */
        public name: string;
        /**
            View object (JQuery)
            @member System.GUI.ViewControllerItem#item
            @public
            @type {JQuery}
        */
        public item: JQuery;
    }

    export class ViewController {
        /** @ignore */ private currentView: ViewControllerItem;
        /** @ignore */ private oldView: ViewControllerItem;
        /** @ignore */ private knownViews: { [name: string]: System.GUI.ViewControllerItem; } = {};
        /** @ignore */ private _this: JQuery;
        /** @ignore */ public viewHistory: System.GUI.ViewControllerItem[] = [];

        /**
            ViewController
            @class System.GUI.ViewController
            @classdesc Creates an instance of a ViewController
        */
        constructor() {
            this._this = $(this);
            var _this = this;
            window.onhashchange = function () { _this.processUrl(); };
        }

        /**
            processUrl        
            @method System.GUI.ViewController#processUrl
            @type bool
            @public
        */
        public processUrl(): System.GUI.ViewControllerItem {

            var hash: string = location.hash;
            if (hash.indexOf("#") < 0)
                return null;

            var id = hash.replace('#', '');
            log.debug("ViewController", "Hash navigation: " + id);
            return this.openView(id);
        }

        /**
            Add a view to the ViewController.
            @method System.GUI.ViewController#AddView
            @param {string} name The ID of the DOMElement, for example the ID of the DIV tag.
            @public
          */
        public AddView(name: string) {
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
        }

        /**
            Return all known views.
            @method System.GUI.ViewController#getViews
            @type Array A hash of all known ViewControllerItem.
            @public
          */
        public getViews(): { [name: string]: ViewControllerItem; } {
            return this.knownViews;
        }

        public goBack(): bool {
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
            
        }

        /**
            Return current view.
            @method System.GUI.ViewController#getCurrentView()
            @type ViewControllerItem Name of current view.
            @public
          */
        public getCurrentView(): ViewControllerItem {
            return this.currentView;
        }

        /**
            Return previous view.
            @method System.GUI.ViewController#getOldView
            @type ViewControllerItem Name of old view.
            @public
          */
        public getOldView(): ViewControllerItem {
            return this.oldView;
        }

        /**
            Select a new view.
            @method System.GUI.ViewController#selectView
            @param {string} name The ID of the DOMElement, for example the ID of the DIV tag.
            @public
          */
        public selectView(name: string): System.GUI.ViewControllerItem {
            //location.hash = "#" + name;
            var view = this.openView(name);

            // Push to history
            if (this.oldView)
                this.viewHistory.push(this.oldView);

            while(this.viewHistory.length > config.maxViewControllerBackHistory) {
                this.viewHistory.shift();
            }

            return view;
        }
        private openView(name: string): System.GUI.ViewControllerItem {
            var view = this.knownViews[name];
            if (!view)
            {
                // Sanity check
                log.error("ViewController", "selectView: View '" + name + "' does not exist.");
                return null;
            }
            log.debug("ViewController", "selectView: View '" + name + "' selected.");

            // Do not execute if same page
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
        }



        /** @ignore */
        private hideAllViews() {
            $.each(this.knownViews,
                function (k, v) {
                    //log.verboseDebug("ViewController", "Hiding: " + k);
                    v.item.hide();
                });
        }

        //
        // Type safe event system
        //
        /**
            Hook up to PreSelectView event.
            @method System.GUI.ViewController#addPreSelectEvent
            @param {eventCallback} Callback function with signature "function (event: JQueryEventObject, oldView: System.GUI.ViewControllerItem, newView: System.GUI.ViewControllerItem) {}" (or just "function (event, oldView, newView) {}" in JS).
            @public          
        */
        public addPreSelectEvent(eventCallback: { (event: JQueryEventObject, oldView: System.GUI.ViewControllerItem, newView: System.GUI.ViewControllerItem): void; }) {
            this._this.on('PreSelectView', eventCallback);
        }

        /**
            Hook up to SelectView event.
            @method System.GUI.ViewController#addSelectEvent
            @param {eventCallback} Callback function with signature "function (event: JQueryEventObject, oldView: System.GUI.ViewControllerItem, newView: System.GUI.ViewControllerItem) {}" (or just "function (event, oldView, newView) {}" in JS).
            @public  
        */
        public addSelectEvent(eventCallback: { (event: JQueryEventObject, oldView: System.GUI.ViewControllerItem, newView: System.GUI.ViewControllerItem): void; }) {
            this._this.on('SelectView', eventCallback);
        }

        /**
            Hook up to PostSelectView event.
            @method System.GUI.ViewController#addPostSelectEvent
            @param {eventCallback} Callback function with signature "function (event: JQueryEventObject, oldView: System.GUI.ViewControllerItem, newView: System.GUI.ViewControllerItem) {}" (or just "function (event, oldView, newView) {}" in JS).
            @public  
        */
        public addPostSelectEvent(eventCallback: { (event: JQueryEventObject, oldView: System.GUI.ViewControllerItem, newView: System.GUI.ViewControllerItem): void; }) {
            this._this.on('PostSelectView', eventCallback);
        }

        /** @ignore */
        private doPreSelectEvent(oldView: System.GUI.ViewControllerItem, newView: System.GUI.ViewControllerItem) {
            this._this.trigger('PreSelectView', [oldView, newView]);
        }

        /** @ignore */
        private doSelectEvent(oldView: System.GUI.ViewControllerItem, newView: System.GUI.ViewControllerItem) {
            this._this.trigger('SelectView', [oldView, newView]);
        }

        /** @ignore */
        private doPostSelectEvent(oldView: System.GUI.ViewControllerItem, newView: System.GUI.ViewControllerItem) {
            this._this.trigger('PostSelectView', [oldView, newView]);
        }
    }
}
var viewController = new System.GUI.ViewController();

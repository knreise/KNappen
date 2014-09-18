/// <reference path="../ConfigBase.ts" />
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
        public viewHistory: System.GUI.ViewControllerItem[] = [];

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
            @returns {Array} A hash of all known ViewControllerItem.
            @public
          */
        public getViews(): { [name: string]: ViewControllerItem; } {
            return this.knownViews;
        }

        public goBack(): boolean {
            log.debug("ViewController", "goBack: History length: " + this.viewHistory.length);
            if (this.viewHistory.length < 1)
                return false;

            var view = this.viewHistory.pop();

            if (view && view.name) {
                this.openView(view.name);
                log.debug("ViewController", "goBack: Last page: " + view.name);
                return true;
            }

            log.debug("ViewController", "goBack: No more history items.");
            return false;
        }

        /**
            Return current view.
            @method System.GUI.ViewController#getCurrentView()
            @returns ViewControllerItem Name of current view.
            @public
          */
        public getCurrentView(): ViewControllerItem {
            return this.currentView;
        }

        /**
            Return previous view.
            @method System.GUI.ViewController#getOldView
            @returns ViewControllerItem Name of old view.
            @public
          */
        public getOldView(): ViewControllerItem {
            return this.oldView;
        }

        /**
            Select a new view.
            @method System.GUI.ViewController#selectView
            @param {string} name The ID of the DOMElement, for example the ID of the DIV tag.
            @param {boolean} force Force view to be executed (if same as current view)
            @public
          */
        public selectView(name: string, force: boolean = false): System.GUI.ViewControllerItem {
            if (this.mainMenuOpen(name))
                return null; // If main menu is open and then selected again, close the menu.

            var view = this.openView(name, force);
            this.addOldViewToHistory();
            return view;
        }

        public selectViewWithoutHistory(name: string, force: boolean = false): void {
            if (this.mainMenuOpen(name))
                return null; // If main menu is open and then selected again, close the menu.

            this.openView(name, force);
        }

        private mainMenuOpen(selectedViewName: string): boolean {
            if (this.currentView && this.currentView.name === "mainMenu" && selectedViewName === "mainMenu") {
                this.goBack();
                return true;
            }

            return false;
        }

        private addOldViewToHistory(): void {
            if (this.oldView && this.oldView.name === "mainMenu")
                return; // Do not add main menu to the history when we navigate to another view.

            if (this.oldView)
                this.viewHistory.push(this.oldView);

            while (this.viewHistory.length > config.maxViewControllerBackHistory) {
                this.viewHistory.shift();
            }
        }

        private openView(name: string, force: boolean = false): System.GUI.ViewControllerItem {
            var view = this.knownViews[name];
            if (!view)
            {
                // Sanity check
                log.error("ViewController", "selectView: View '" + name + "' does not exist.");
                return null;
            }
            log.debug("ViewController", "selectView: View '" + name + "' selected.");

            // Do not execute if same page
            if (this.currentView && this.currentView.name == name && !force)
                return this.currentView;

            this.oldView = this.currentView;

            // Do selection
            this.doPreSelectEvent(this.oldView, view);
            this.currentView = view;
            this.hideAllViews();
            view.item.show();

            this.doSelectEvent(this.oldView, view);
            this.doPostSelectEvent(this.oldView, view);

            window.scrollTo(0, 0);

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

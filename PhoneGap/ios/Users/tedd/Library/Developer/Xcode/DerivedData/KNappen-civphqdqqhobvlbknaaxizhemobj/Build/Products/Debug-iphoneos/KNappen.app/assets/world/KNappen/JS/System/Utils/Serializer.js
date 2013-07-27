var System;
(function (System) {
    /// <reference path="../Providers/StorageProvider.ts" />
    /// <reference path="../../../Scripts/typings/knockout.mapping/knockout.mapping.d.ts" />
    /// <reference path="../../../Scripts/typings/knockout/knockout.d.ts" />
    /// <reference path="../../../Scripts/typings/jquery/jquery.d.ts" />
    /**
    Provider modules
    @namespace System.Utils
    */
    (function (Utils) {
        /** @class */
        var Serializer = (function () {
            /**
            * Serializer
            * @class System.Utils.Serializer
            * @classdesc Provides serialization to/from strings and file storage.
            */
            function Serializer() {
            }
            /**
            * Serialize object to localStorage
            * @method System.Utils.Serializer#serializeJSObjectToFile
            * @param {string} fileName Name of place in localstorage
            * @param {any} object Object to serialize
            */
            Serializer.prototype.serializeJSObjectToFile = function (fileName, object) {
                storageProvider.set("FileStore:" + fileName, this.serializeJSObject(object));
            };

            /**
            * Load object from localstorage into object
            * @method System.Utils.Serializer#deserializeJSObjectFromFile
            * @param {string} fileName Name of place in localstorage
            * @param {any} instanceToUse Object to serialize localstorage data into
            */
            Serializer.prototype.deserializeJSObjectFromFile = function (fileName, instanceToUse) {
                var json = storageProvider.get("FileStore:" + fileName);

                //if (json) {
                var tempObj = this.deserializeJSObject(json);

                if (instanceToUse)
                    $.extend(instanceToUse, tempObj);

                //}
                return instanceToUse;
            };

            /**
            * Serialize object to localStorage
            * @method System.Utils.Serializer#serializeKnockoutObjectToFile
            * @param {string} fileName Name of place in localstorage
            * @param {any} object Object to serialize
            */
            Serializer.prototype.serializeKnockoutObjectToFile = function (fileName, object) {
                try  {
                    storageProvider.set("FileStore:" + fileName, this.serializeKnockoutObject(object));
                } catch (exception) {
                    alert(exception.message);
                }
            };

            /**
            * Load object from localstorage into object
            * @method System.Utils.Serializer#deserializeKnockoutObjectFromFile
            * @param {string} fileName Name of place in localstorage
            * @param {any} instanceToUse Object to serialize localstorage data into
            */
            Serializer.prototype.deserializeKnockoutObjectFromFile = function (fileName, instanceToUse) {
                var jsonStr = storageProvider.get("FileStore:" + fileName);
                if (!jsonStr)
                    return false;

                this.deserializeKnockoutObject(jsonStr, instanceToUse);

                return true;
            };

            /**
            * Serialize object
            * @method System.Utils.Serializer#serializeJSObject
            * @param {any} object Object to serialize
            */
            Serializer.prototype.serializeJSObject = function (object) {
                return JSON.stringify(object);
            };

            /**
            * Serialize object to string
            * @method System.Utils.Serializer#serializeKnockoutObject
            * @param {any} object Object to serialize
            */
            Serializer.prototype.serializeKnockoutObject = function (object) {
                return ko.mapping.toJSON(object);
            };

            /**
            * Deserialize object
            * @method System.Utils.Serializer#deserializeJSObject
            * @param {string} json Json string
            * @param {any} instanceToUse Object to serialize localstorage data into
            */
            Serializer.prototype.deserializeJSObject = function (json, instanceToUse) {
                var tempObj = JSON.parse(json);

                if (instanceToUse) {
                    $.extend(instanceToUse, tempObj);
                    return instanceToUse;
                }

                return tempObj;
            };

            /**
            * Deserialize from JSON into Knockout
            * @method System.Utils.Serializer#deserializeKnockoutObject
            * @param {string} jsonString Json string
            * @param {any} instanceToUse Object to serialize localstorage data into
            */
            Serializer.prototype.deserializeKnockoutObject = function (jsonString, instanceToUse) {
                if (!jsonString)
                    return null;

                var tempObj = ko.mapping.fromJS(JSON.parse(jsonString));

                // Copy variables and make them Knockout observable
                $.extend(instanceToUse, tempObj);

                //$.each(tempObj, function (k, v) {
                //    instanceToUse[k] = v;
                //});
                //ko.mapping.fromJS(tempObj, instanceToUse);
                return instanceToUse;
            };
            return Serializer;
        })();
        Utils.Serializer = Serializer;
    })(System.Utils || (System.Utils = {}));
    var Utils = System.Utils;
})(System || (System = {}));
var serializer = new System.Utils.Serializer();
//@ sourceMappingURL=Serializer.js.map

/// <reference path="../Providers/StorageProvider.ts" />
/// <reference path="../../../Scripts/typings/knockout.mapping/knockout.mapping.d.ts" />
/// <reference path="../../../Scripts/typings/knockout/knockout.d.ts" />
/// <reference path="../../../Scripts/typings/jquery/jquery.d.ts" />

/**
    Provider modules
    @namespace System.Utils
*/
module System.Utils {
    //Json2 serializer
    declare var JSON;

    /** @class */
    export class Serializer {

        /**
          * Serializer
          * @class System.Utils.Serializer
          * @classdesc Provides serialization to/from strings and file storage.
          */
        constructor() { }
        
        /**
          * Serialize object to localStorage
          * @method System.Utils.Serializer#serializeJSObjectToFile
          * @param {string} fileName Name of place in localstorage
          * @param {any} object Object to serialize
          */
        public serializeJSObjectToFile(fileName: string, object: any) {
            storageProvider.set("FileStore:" + fileName, this.serializeJSObject(object));
        }

        /**
          * Load object from localstorage into object
          * @method System.Utils.Serializer#deserializeJSObjectFromFile
          * @param {string} fileName Name of place in localstorage
          * @param {any} instanceToUse Object to serialize localstorage data into
          */
        public deserializeJSObjectFromFile(fileName: string, instanceToUse: any): any {
            var json = storageProvider.get("FileStore:" + fileName);
            //if (json) {
            var tempObj = this.deserializeJSObject(json);

            if (instanceToUse)
                $.extend(instanceToUse, tempObj);
            //}

            return instanceToUse;
        }

        /**
          * Serialize object to localStorage
          * @method System.Utils.Serializer#serializeKnockoutObjectToFile
          * @param {string} fileName Name of place in localstorage
          * @param {any} object Object to serialize
          */
        public serializeKnockoutObjectToFile(fileName: string, object: any) {
            try {
                storageProvider.set("FileStore:" + fileName, this.serializeKnockoutObject(object));
            } catch (exception) {
                alert(exception.message);
            }
        }

        /**
          * Load object from localstorage into object
          * @method System.Utils.Serializer#deserializeKnockoutObjectFromFile
          * @param {string} fileName Name of place in localstorage
          * @param {any} instanceToUse Object to serialize localstorage data into
          */
        public deserializeKnockoutObjectFromFile(fileName: string, instanceToUse: any): bool {
            var jsonStr = storageProvider.get("FileStore:" + fileName);
            if (!jsonStr)
                return false;

            this.deserializeKnockoutObject(jsonStr, instanceToUse);

            return true;
        }

        /**
          * Serialize object
          * @method System.Utils.Serializer#serializeJSObject
          * @param {any} object Object to serialize
          */
        public serializeJSObject(object: any): string {
            return JSON.stringify(object);
        }

        /**
          * Serialize object to string
          * @method System.Utils.Serializer#serializeKnockoutObject
          * @param {any} object Object to serialize
          */
        public serializeKnockoutObject(object: any): string {
            return ko.mapping.toJSON(object);
        }

        /**
          * Deserialize object
          * @method System.Utils.Serializer#deserializeJSObject
          * @param {string} json Json string
          * @param {any} instanceToUse Object to serialize localstorage data into
          */
        public deserializeJSObject(json: string, instanceToUse?: any): any {
            var tempObj: any = JSON.parse(json);

            if (instanceToUse) {
                $.extend(instanceToUse, tempObj);
                return instanceToUse;
            }

            return tempObj;
        }
        
        /**
          * Deserialize from JSON into Knockout
          * @method System.Utils.Serializer#deserializeKnockoutObject
          * @param {string} jsonString Json string
          * @param {any} instanceToUse Object to serialize localstorage data into
          */
        public deserializeKnockoutObject(jsonString: string, instanceToUse: any): any {
            if (!jsonString)
                return null;

            var tempObj: any = ko.mapping.fromJS(JSON.parse(jsonString));

            // Copy variables and make them Knockout observable
            $.extend(instanceToUse, tempObj);
            //$.each(tempObj, function (k, v) {
            //    instanceToUse[k] = v;
            //});
            //ko.mapping.fromJS(tempObj, instanceToUse);

            return instanceToUse;
        }

    }

}
var serializer = new System.Utils.Serializer();
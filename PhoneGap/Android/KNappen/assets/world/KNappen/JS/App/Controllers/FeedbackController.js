var App;
(function (App) {
    /// <reference path="../_References.ts" />
    /**
    Controller modules
    @namespace App.Controllers
    */
    (function (Controllers) {
        var FeedbackControllerRequest = (function () {
            /**
            FeedbackControllerRequest
            @class App.Controllers.FeedbackControllerRequest
            @classdesc This class contains the fields being filled out by the user when sending a feedback-mail
            */
            function FeedbackControllerRequest() {
                this.fromAddress = null;
                /**
                Subject
                @member App.Controllers.FeedbackControllerRequest#subject
                @public
                @type {string}
                */
                this.subject = null;
                /**
                Subject
                @member App.Controllers.FeedbackControllerRequest#message
                @public
                @type {string}
                */
                this.message = null;
            }
            return FeedbackControllerRequest;
        })();
        Controllers.FeedbackControllerRequest = FeedbackControllerRequest;

        var FeedbackController = (function () {
            /**
            FeedbackController
            @class App.Controllers.FeedbackController
            @classdesc This class controls the feedback functionality used to send errors and suggestions related to the app
            */
            function FeedbackController() {
            }
            /**
            Sends feedback from the user to the feedback api on the server, which then sends an email to a chosen admin address
            @method App.Controllers.FeedbackController#send
            @public
            */
            FeedbackController.prototype.send = function () {
                var fieldCategory = $("#feedbackCategory");
                var fieldText = $("#feedbackText");
                var fieldFromAddress = $("#feedbackFromAddress");

                var req = new App.Controllers.FeedbackControllerRequest();
                req.fromAddress = fieldFromAddress.val();
                req.subject = fieldCategory.val();
                req.message = fieldText.text();

                var data = serializer.serializeJSObject(req);

                $.ajax({
                    url: config.feedbackUrl,
                    type: "POST",
                    data: data,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    processdata: true,
                    success: function (msg) {
                        userPopupController.sendSuccess("$T[Feedback]", "$T[Feedback sent]");
                        fieldText.text('');
                    },
                    error: function (msg) {
                        userPopupController.sendError("$T[Feedback]", "$T[Error sending feedback]");
                    }
                });
            };
            return FeedbackController;
        })();
        Controllers.FeedbackController = FeedbackController;
    })(App.Controllers || (App.Controllers = {}));
    var Controllers = App.Controllers;
})(App || (App = {}));
var feedbackController = new App.Controllers.FeedbackController();
//@ sourceMappingURL=FeedbackController.js.map

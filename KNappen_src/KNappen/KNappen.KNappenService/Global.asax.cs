using System;
using ServiceStack.WebHost.Endpoints;

namespace KNappen.KNappenService
{
    public class Global : System.Web.HttpApplication
    {

        public class RouteAppHost : AppHostBase
        {
            public RouteAppHost()
                : base("Route service", typeof(api.RouteService).Assembly)
            {
            }

            public override void Configure(Funq.Container container)
            {
                // Configure our app

                //Permit modern browsers (e.g. Firefox) to allow sending of any REST HTTP Method
                base.SetConfig(new EndpointHostConfig
                {
                    GlobalResponseHeaders = {
                        { "Access-Control-Allow-Origin", "*" },
                        { "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS" },
                        { "Access-Control-Allow-Headers", "Content-Type" },
                    }
                });
            }
        }

        protected void Application_Start(object sender, EventArgs e)
        {
            new RouteAppHost().Init();
        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}
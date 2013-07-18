using System.Collections.Generic;
using System.IO;
using KNappen.KNappenService.Models;
using ServiceStack.ServiceInterface;

namespace KNappen.KNappenService.api
{
    public class RouteIndexService: Service
    {
        public object Any(RouteIndex routeIndex)
        {

            var routes = new List<string>();
            
            foreach (string f in Directory.GetFiles(Utils.GetRoutePath("")))
            {
                routes.Add(Path.GetFileName(f));
            }

            return new RouteIndexResponse() { routes = routes.ToArray() };
        }

    }
}
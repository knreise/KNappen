using ServiceStack.ServiceHost;

namespace KNappen.KNappenService.Models
{
    [Route("/RouteIndex", "GET")]
    public class RouteIndex
    {
    }

    public class RouteIndexResponse
    {
        public string[] routes { get; set; }
    }
}
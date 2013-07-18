using ServiceStack.ServiceHost;

namespace KNappen.KNappenService.Models
{
    [Route("/Route", "OPTIONS")]
    [Route("/Route", "POST")]
    [Route("/Route/{id}", "GET")]
    public class Route
    {
        public string id { get; set; }
        public string name { get; set; }
        public string data { get; set; }
        public string adminPwd { get; set; }
    }

    public class RouteResponse
    {
        public bool saved { get; set; }
        public string data { get; set; }
    }
}
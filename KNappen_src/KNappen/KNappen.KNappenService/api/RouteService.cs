using System.Configuration;
using System.IO;
using System.Security;
using KNappen.KNappenService.Models;
using ServiceStack.ServiceInterface;
using ServiceStack.ServiceInterface.Cors;

namespace KNappen.KNappenService.api
{
    
    public class RouteService : Service
    {
        
        public object Get(Route route)
        {
            // Security check
            if (!Utils.isFilenameSafe(route.id))
                throw new SecurityException("Invalid character in id");

            // Read data and send
            var ret = new RouteResponse();
            ret.data = File.ReadAllText(Utils.GetRoutePath(route.id));
            return ret;
        }

        //[EnableCors]
        public void Options(Route route) { }

        public object Post(Route route)
        {
            // Security check
            if (!Utils.isFilenameSafe(route.id))
                throw new SecurityException("Invalid character in id.");


            var test = route.adminPwd != ConfigurationManager.AppSettings["AdminPwd"].ToString() ? false : true;
            if (!test)
                throw new SecurityException("Invalid admin password.");

            var fileName = Utils.GetRoutePath(route.id).ToString();

            // Remove existing if any
            if (File.Exists(fileName))
                File.Delete(fileName);

            // If we have data, write new (if not, assume delete)
            if (!string.IsNullOrEmpty(route.data))
            {
                File.WriteAllText(fileName, route.data);
            }

            return new RouteResponse();
        }

    }
}
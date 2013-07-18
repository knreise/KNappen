using System.Configuration;
using System.IO;
using System.Text.RegularExpressions;

namespace KNappen.KNappenService
{
    public class Utils
    {
        private static Regex idCheckRegex = new Regex(@"^[-a-zA-Z0-9\.]+$");
        public static string ResolvePath(string path)
        {
            return path.Replace("~", System.Web.HttpContext.Current.Request.PhysicalApplicationPath + "/").Replace("/", @"\").Replace(@"\\", @"\");
        }

        public static string GetRoutePath(string file)
        {
            return Path.Combine(ResolvePath(ConfigurationManager.AppSettings["RouteDir"]), file);
        }
        public static string GetFilePath(string file)
        {
            return Path.Combine(ResolvePath(ConfigurationManager.AppSettings["FileDir"]), file);
        }

        public static bool isFilenameSafe(string filename)
        {
            return idCheckRegex.IsMatch(filename);
        }

    }
}
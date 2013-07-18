using System;
using System.Security;

namespace KNappen.KNappenService
{
    public partial class FileService : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

            // Just for good measure
            Response.ClearContent();
            // CORS
            Response.AppendHeader("Access-Control-Allow-Origin", "*");

            string filename = Request.Params["file"];
            if (!Utils.isFilenameSafe(filename))
                throw new SecurityException("Invalid character in filename.");

            // Send file
            Response.ClearContent();
            Response.TransmitFile(Utils.GetFilePath(filename));

        }
    }
}
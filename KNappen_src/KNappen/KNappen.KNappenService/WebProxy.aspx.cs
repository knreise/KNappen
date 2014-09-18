using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace KNappen.KNappenService
{
    public partial class WebProxy : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // Just for good measure
            Response.ClearContent();

            // CORS
            Response.AppendHeader("Access-Control-Allow-Origin", "*");
            Response.AppendHeader("Access-Control-Allow-Credentials", "true");

            //GET http://opencache.statkart.no/gatekeeper/gk/gk.open?SERVICE=WMS&,/WebProxy.aspxurl=http%3a%2f%2fopencache.statkart.no%2fgatekeeper%2fgk%2fgk.open%3fSERVICE%3dWMS%26LAYERS=norges_grunnkartFORMAT=image%2fjpegSERVICE=WMSVERSION=1.1.1REQUEST=GetMapSTYLES=SRS=EPSG%3a900913BBOX=1183856.693916%2c8375052.3139844%2c1188748.6637256%2c8379944.2837939WIDTH=256HEIGHT=256 HTTP/1.1

            // Convert to URL
            string urlStr = Request.QueryString["url"];
            if (!urlStr.Contains("?"))
                urlStr += "?";
            foreach (var k in Request.QueryString.AllKeys)
            {
                if (k != null)
                {
                    var kl = k.ToLower();
                    if (kl != "url")
                        urlStr += "&" + k + "=" + HttpUtility.UrlEncode(Request.QueryString[k]);
                }
            }
            var uri = new Uri(urlStr);


            // Security check
            string hostToLower = uri.Host.ToLower();
            if (hostToLower == "no.wikipedia.org" || hostToLower == "api.wikilocation.org" || hostToLower == "api.digitalarkivet.arkivverket.no" || hostToLower == "opencache.statkart.no")
                // Do it, async style!
                ProcessUrl(uri);
            else
                throw new SecurityException("Illegal hostname: " + hostToLower);

        }

        private async void ProcessUrl(Uri uri)
        {
            // Download content and send to client
            using (WebClient webClient = new WebClient())
            {
                
                // Copy request header into request
                foreach (var k in Request.Headers.AllKeys)
                {
                    var v = Request.Headers[k];
                    var kl = k.ToLower();
                    if (v != null && kl != "host" && kl != "connection" && kl != "if-modified-since")
                        webClient.Headers.Add(k, v);
                }

                // Send request
                byte[] data = await webClient.DownloadDataTaskAsync(uri);
                
                
                // Copy response header into response
                foreach (var k in webClient.ResponseHeaders.AllKeys)
                {
                    var values = webClient.ResponseHeaders.GetValues(k);
                    
                    var kl = k.ToLower();
                    foreach (var v in values)
                    {
                        if (v != null && kl != "host" && kl != "connection" && !kl.StartsWith("access-control-allow-"))
                            Response.Headers.Add(k, v);
                    }
                }
                Response.ContentType = webClient.ResponseHeaders["Content-Type"];
                Response.BinaryWrite(data);
            }

        }
    }
}
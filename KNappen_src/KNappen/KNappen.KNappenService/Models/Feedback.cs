using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ServiceStack.ServiceHost;

namespace KNappen.KNappenService.Models
{

    [Route("/Feedback", "OPTIONS")]
    [Route("/Feedback", "POST")]
    public class Feedback
    {
        public string fromAddress { get; set; }
        public string subject { get; set; }
        public string message { get; set; }
    }

    public class FeedbackResponse
    {
        public bool status { get; set; }
    }
}
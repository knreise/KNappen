using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Mail;
using System.Web;
using KNappen.KNappenService.Models;
using ServiceStack.ServiceInterface;

namespace KNappen.KNappenService.api
{
    public class FeedbackService : Service
    {
        public void Options(Feedback feedback)
        {
            
        }
        public object Post(Feedback feedback)
        {

            var smtp_RelayPort = int.Parse(ConfigurationManager.AppSettings["SMTP_RelayPort"]);
            var smtp_RelayHost = ConfigurationManager.AppSettings["SMTP_RelayHost"];
            var smtp_FromAddress = ConfigurationManager.AppSettings["SMTP_FromAddress"];
            var smtp_ToAddress = ConfigurationManager.AppSettings["SMTP_ToAddress"];
            var smtp_Subject = ConfigurationManager.AppSettings["SMTP_Subject"];


            MailMessage mail = new MailMessage(smtp_FromAddress, smtp_ToAddress);
            SmtpClient client = new SmtpClient();
            client.Port = smtp_RelayPort;
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.UseDefaultCredentials = false;
            client.Host = smtp_RelayHost;

            mail.Subject = string.Format(smtp_Subject, feedback.fromAddress, feedback.subject);
            mail.Body = "";
            mail.Body += "IpAdresse: " + Request.RemoteIp + "\r\n";
            mail.Body += "User Agent: " + Request.UserAgent + "\r\n";

            if (!string.IsNullOrEmpty(feedback.fromAddress))
                mail.Body += "Fra: " + feedback.fromAddress + "\r\n";
            if (!string.IsNullOrEmpty(feedback.subject))
                mail.Body += "Emne: " + feedback.subject + "\r\n";
            if (!string.IsNullOrEmpty(feedback.message))
                mail.Body += "Beskjed: " + "\r\n" + feedback.message + "\r\n";
            client.Send(mail);

            var ret = new FeedbackResponse() { status = true };
            return ret;
        }
    }
}
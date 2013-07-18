KNappen
=======


<b>Deployment</b><br/>
1. Edit KNappen_src\KNappen\KNappen.KNappenService\Web.Config, add correct password to:<br/>
   &lt;add key="AdminPwd" value="XXXX" /&gt;<br/>
2. Edit KNappen_src\KNappen\KNappen.MobileSPA\JS\System\ConfigBase.ts, add correct Google Analytics key to:<br/>
   public googleAnalyticsKey: string = "XXXX";<br/>
3. Edit PhoneGap\ios\KNappen\www\js\WikitudePlugin.js, add correct Wikitude key:<br/>
   mySDKKey : "XXXX",<br/>
4. Edit PhoneGap\Android\KNappen\assets\www\WikitudePlugin.js, add correct Wikitude key:<br/>
   mySDKKey : "XXXX",<br/>

For deployment of apps other than KNappen/Kulturrådet the project name for Android/iOS compile has to be changed so it doesn't use the namespace of Kulturrådet; no.kulturradet.KNappen.<br/>

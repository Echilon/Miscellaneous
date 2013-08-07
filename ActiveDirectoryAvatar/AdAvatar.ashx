<%@ WebHandler Language="C#" Class="AdAvatar" %>

using System;
using System.DirectoryServices;
using System.Drawing;
using System.IO;
using System.Net;
using System.Runtime.Remoting.Channels;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Web;

using Coch.Core;

using Elmah.ContentSyndication;

public class AdAvatar : IHttpHandler
{
    private const int CACHE_DURATION_IN_MINUTES = 60;
    private static object _downloadLock = new object();
    private static WaitCallback dynamicInvokeShim = new WaitCallback(DynamicInvokeShim);
    static void DynamicInvokeShim(object o)
    {
        try {
            TargetInfo ti = (TargetInfo)o;
            ti.Target.DynamicInvoke(ti.Args);
        } catch (Exception ex) {
            System.Diagnostics.Trace.WriteLine(ex.ToString());
        }
    }


    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "image/JPEG";

        int size = int.Parse(context.Request["size"]);
        string userName =HttpUtility.UrlDecode(context.Request["username"]);
                
        string avatarFileName = String.Format("{0}_{1}.jpg", userName, size);
        string cachedAvatarFolderPath = Path.Combine(context.Request.PhysicalApplicationPath, @"cache\avatar\");
        string defaultAvatarFolderPath = Path.Combine(context.Request.PhysicalApplicationPath, @"cache\");
        var defaultAtSize = Path.Combine(defaultAvatarFolderPath, String.Format("avatar_{0}.jpg", size));
        string cachedavatarFilePath = Path.Combine(cachedAvatarFolderPath, avatarFileName);
        string avatarCopyPath = cachedavatarFilePath.Replace(".jpg", ".copy.jpg");

        string avatarToReturnPath = string.IsNullOrWhiteSpace(userName) ?string.Empty: cachedavatarFilePath;
        if (File.Exists(avatarToReturnPath) && (File.GetLastWriteTime(avatarToReturnPath).AddMinutes(CACHE_DURATION_IN_MINUTES) < DateTime.Now)) {

            if (!File.Exists(avatarCopyPath) && new FileInfo(cachedavatarFilePath).Length > 0)
                File.Copy(cachedavatarFilePath, avatarCopyPath, true); //create a copy for temporary serving

            try {
                File.Delete(cachedavatarFilePath);
            } catch (System.IO.IOException) {
            }

            avatarToReturnPath = avatarCopyPath;
        }

        if (File.Exists(avatarToReturnPath)) {
            context.Response.Cache.SetExpires(DateTime.Now.AddHours(24));
            context.Response.Cache.SetValidUntilExpires(true);
            context.Response.Cache.SetCacheability(HttpCacheability.Public);
        } else {
            if (!string.IsNullOrWhiteSpace(userName) && File.Exists(avatarCopyPath))
                avatarToReturnPath = avatarCopyPath;
            else
                avatarToReturnPath = defaultAtSize;

            //Asynchronously download the avatars to the cache
            //var cachedRelativePath =HttpUtility.UrlEncode(cachedavatarFilePath.Replace(HttpContext.Current.Request.ServerVariables["APPL_PHYSICAL_PATH"], String.Empty));
            Downloadavatar_Begin(userName, size, defaultAtSize, cachedavatarFilePath);
        }

        try {
            context.Response.WriteFile(avatarToReturnPath);
        } catch (System.IO.IOException) {
            //The file may be locked
            try {
                context.Response.WriteFile(avatarCopyPath);
            } catch (System.IO.IOException) {
                context.Response.WriteFile(Path.Combine(defaultAvatarFolderPath, String.Format("avatar_{0}.jpg", size)));
            }
        }
    }

    public static void Downloadavatar_Begin(string userName, int size,string defaultPath, string targetFolderPath)
    {
        FireAndForget(() =>
        {
            Downloadavatar(userName, size, defaultPath, targetFolderPath);
        });
    }

    public static void Downloadavatar(string userName, int size,string defaultPath, string targetFilePath)
    {
        try {
            var adUser = ADUtils.GetActiveDirectoryUser(userName);
            byte[] data = adUser.Properties["jpegPhoto"].Value as byte[];
            if (data != null) {
                using (MemoryStream s = new MemoryStream(data)) {
                    var srcBmp = Bitmap.FromStream(s);
                    using(var bitmap = new Bitmap(size, size, srcBmp.PixelFormat))
                    using (var new_g = Graphics.FromImage(bitmap)) {
                        new_g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                        new_g.InterpolationMode =
                            System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                        new_g.DrawImage(srcBmp, 0, 0, bitmap.Width, bitmap.Height);
                        bitmap.Save(targetFilePath, System.Drawing.Imaging.ImageFormat.Png);
                        bitmap.Dispose();
                        new_g.Dispose();
                    }
                }
            }
        } catch {
            if (File.Exists(defaultPath)) {
                // expect a 404 if they have no avatar
                try {
                    File.Copy(defaultPath, targetFilePath);
                } catch {
                }
            }
        }
    }
    
    private static void FireAndForget(Action d, params object[] args)
    {
        ThreadPool.QueueUserWorkItem(dynamicInvokeShim, new TargetInfo(d, args));
    }


    public class TargetInfo
    {
        internal TargetInfo(Delegate d, object[] args)
        {
            Target = d;
            Args = args;
        }

        internal readonly Delegate Target;
        internal readonly object[] Args;
    }

    public bool IsReusable
    {
        get { return false; }
    }
}
using Funq;
using ServiceStack;
using ServiceStack.Mvc;
using MyApp.ServiceInterface;

[assembly: HostingStartup(typeof(MyApp.AppHost))]

namespace MyApp;

public class AppHost : AppHostBase, IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => {
            // Configure ASP.NET Core IOC Dependencies
        });

    public AppHost() : base("MyApp", typeof(MyServices).Assembly) {}

    public override void Configure(Container container)
    {
        SetConfig(new HostConfig {
        });

        if (Config.DebugMode)
        {
            Plugins.Add(new HotReloadFeature());
        }

        Plugins.Add(new RazorFormat());
    }
}

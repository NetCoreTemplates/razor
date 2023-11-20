﻿using Funq;
using ServiceStack;
using MyApp.ServiceInterface;

[assembly: HostingStartup(typeof(MyApp.AppHost))]

namespace MyApp;

public class AppHost : AppHostBase, IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            // Configure ASP.NET Core IOC Dependencies
        });

    public AppHost() : base("MyApp", typeof(MyServices).Assembly) { }

    // Configure your AppHost with the necessary configuration and dependencies your App needs
    public override void Configure(Container container)
    {
        SetConfig(new HostConfig
        {
        });

        //Allow Referencing in #Script expressions, e.g. [Input(EvalAllowableEntries)]
        ScriptContext.Args[nameof(AppData)] = AppData.Instance;
    }
}

// Shared App Data
public class AppData
{
    public static readonly AppData Instance = new();
}

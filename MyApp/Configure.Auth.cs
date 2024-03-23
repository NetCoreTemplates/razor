using ServiceStack.Auth;
using MyApp.Data;

[assembly: HostingStartup(typeof(MyApp.ConfigureAuth))]

namespace MyApp;

public class ConfigureAuth : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => {
            services.AddSingleton<IAuthHttpGateway, AuthHttpGateway>();
            
            services.AddPlugin(new AuthFeature(IdentityAuth.For<ApplicationUser>(options => {
                options.CredentialsAuth();
                options.SessionFactory = () => new CustomUserSession();
            })));
        });
}

var builder = WebApplication.CreateBuilder(args);
#if DEBUG
    builder.Services.AddMvc(options => options.EnableEndpointRouting = false).AddRazorRuntimeCompilation();
#else
    builder.Services.AddMvc(options => options.EnableEndpointRouting = false);
#endif

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
    app.UseHttpsRedirection();
}
else
{
    app.UseDeveloperExceptionPage();
}
app.UseServiceStack(new AppHost());
app.UseMvc(routes => {
    routes.MapRoute(
        name: "default",
        template: "{controller=Home}/{action=Index}/{id?}");
});

app.Run();

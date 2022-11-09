using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using blazor_dotnet6.Data;
using blazor_dotnet6;
using blazor_dotnet6.Pages;
using System.Net.WebSockets;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.ResponseCompression;
using BlazorServerSignalRApp.Server.Hubs;
using Microsoft.Net.Http.Headers;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.AspNetCore.Components.Authorization;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

builder.Services.AddResponseCompression(opts =>
{
    opts.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(
        new[] { "application/octet-stream" });
});

//Register blazor custom element
builder.Services.AddServerSideBlazor(options =>
{
    options.RootComponents.RegisterCustomElement<App>("blazor-home-element");
});

builder.Services.AddAbbottBlazor();

builder.Services.AddSingleton<WeatherForecastService>();

builder.Services.AddSignalR()
    .AddJsonProtocol(options => {
    options.PayloadSerializerOptions.PropertyNamingPolicy = null;});

builder.Services.AddControllers();

builder.Services.AddCors(options =>
    {
        options.AddPolicy("CorsPolicy", policyBuilder => policyBuilder
            .WithOrigins( "http://localhost:3001",
                "http://localhost:8005","http://localhost:3000",
                "*")
            .SetIsOriginAllowedToAllowWildcardSubdomains()
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
    });

builder.Services.AddTelerikBlazor();
var app = builder.Build();
app.UseResponseCompression();
// // Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios,
    // see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("CorsPolicy");
app.UseStaticFiles(new StaticFileOptions
{
    ServeUnknownFileTypes = true,
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers.Append("Access-Control-Allow-Origin", "*");
        ctx.Context.Response.Headers.Append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
});
app.UseWebSockets();
app.UseAuthorization();
app.MapBlazorHub();
app.UseEndpoints(endpoints => { endpoints.MapHub<ChatHub>("/signalr-myChatHub"); });
app.MapFallbackToPage("/_Host");
app.Run();

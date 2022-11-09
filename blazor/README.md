# Blazor server web component

This is an example of how to create a web component for a blazor server app. This web component renders the blazor server's root component as a registered custom element. The web component is bundled into a native ES module (ESM) using for example the Rollup packaging tool.

## Setup

1. Register the root component of blazor app as a custom element by following steps:
   1.1 Install the NuGet package Microsoft.AspNetCore.Components.CustomElements
   1.2 In Program.cs change the call to AddServerSideBlazor to pass an options callback like the following:

```
builder.Services.AddServerSideBlazor(options =>
{
    options.RootComponents.RegisterAsCustomElement<App>("blazor-custom-element");
});
```

2. Add all the static files in a folder in wwwroot folder to server from in app-shell
3. Enable CORS to allow rendering on app-shell which runs on port 3000
4. Add the folder Microsoft.AspNetCore.Components.CustomElements and blazor-dotnet6.sln file to the project for blazor custom element
5. Add the devspace.yaml file to run the blazor server app.

## Usage

1. Start Blazor server:

```sh
cd blazor-dotnet6
dotnet watch
```

2. Start Blazor web component:

```sh
cd blazor-dotnet6/WebComponent
npm install
npm run start
```

## Proxy Setup

In the devspace.yaml file , add ingress proxy rule for '/\_blazor' and '/\_content' request and strip off the basepath as given in below example:

```
ingress:
    rules:
      - path: /aliniq/blazorserver/_blazor (/aliniq/blazorserver is basepath in app-shell)
        stripPath: /aliniq/blazorserver
      - path: /aliniq/blazorserver/_content
        stripPath: /aliniq/blazorserver
```

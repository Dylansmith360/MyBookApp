using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MyBookAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Ensure the configuration is being read correctly
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// Configure built-in logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// Enable CORS for frontend communication
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// Register HttpClient for dependency injection
builder.Services.AddHttpClient();

// Register AppDbContext for dependency injection
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"), sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null);
    }));

// Add Controllers with JSON support
builder.Services.AddControllers().AddNewtonsoftJson();

var app = builder.Build();

app.UseCors("AllowAllOrigins");
app.MapControllers();

app.Run();
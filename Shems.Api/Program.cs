using Microsoft.EntityFrameworkCore;
using Shems.Api.Database;
using Shems.Api.Interfaces;
using Shems.Api.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddScoped<IZoneService, ZoneService>();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();
app.MapControllers();


app.Run();

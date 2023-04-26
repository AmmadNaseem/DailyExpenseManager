using Microsoft.EntityFrameworkCore;
using v1.Configurations;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<ExpenseMangerDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("ExpenseDbConnection")));

builder.Services.AddCors(p => p.AddPolicy("AllowOrigin", build =>
    {
        build.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod();
    }));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowOrigin");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

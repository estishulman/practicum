using Microsoft.EntityFrameworkCore;
using DL.Contexts;
using BL.IService;
using BL.Services;
using DL.IRepositories;
using DL.Repository;
using System.Text.Json;
using System.Text.Json.Serialization;
using BL;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// הזרקת שירותים
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ISummaryService, SummaryService>();
builder.Services.AddScoped<IUserFileService, UserFileService>();
builder.Services.AddScoped<IUserService, UserService>();

// הזרקת רפוזיטוריז
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ISummaryRepository, SummaryRepository>();
builder.Services.AddScoped<IUserFileRepository, UserFileRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// הוספת AutoMapper
builder.Services.AddAutoMapper(typeof(AppMappingProfile));

// הוספת קונפיגורציה של Json
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});

// הוספת Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Description = "Bearer Authentication with JWT Token",
        Type = SecuritySchemeType.Http
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            new List<string>()
        }
    });
});

// הוספת CORS
var allowedOrigins = "_allowedOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: allowedOrigins,
        policy =>
        {
            policy.WithOrigins(
                    "http://localhost:5173",// זה הפורט של React שלך
                    "https://practicum-react-frontside.onrender.com"
                )
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// הגדרת MySQL
builder.Services.AddDbContext<VoiceSummarizerDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(7, 0, 11)) // שימי כאן את גרסת MySQL הנכונה
    ));
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuers = builder.Configuration.GetSection("JWT:Issuer").Get<string[]>(),
            ValidAudiences = builder.Configuration.GetSection("JWT:Audience").Get<string[]>(),
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]))
        };

    });

var app = builder.Build();

// קונפיגורציה של Swagger בסביבת פיתוח
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// השתמש ב-CORS (החלק הזה חייב להיות לפני UseAuthorization)
app.UseCors(allowedOrigins);

// קונפיגורציה של HTTP ו־Authorization
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

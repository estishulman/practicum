//using Microsoft.EntityFrameworkCore;
//using DL.Contexts;
//using BL.IService;
//using BL.Services;
//using DL.IRepositories;
//using DL.Repository;
//using System.Text.Json;
//using System.Text.Json.Serialization;
//using BL;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.IdentityModel.Tokens;
//using System.Text;
//using Microsoft.OpenApi.Models;
//using Amazon.S3;
//using Amazon;
//using Amazon.Extensions.NETCore.Setup;
//using Amazon.Runtime;
//using Microsoft.Extensions.DependencyInjection;


//var builder = WebApplication.CreateBuilder(args);
//builder.Logging.AddConsole();

//// ����� �������
//builder.Services.AddScoped<ICategoryService, CategoryService>();
//builder.Services.AddScoped<ISummaryService, SummaryService>();
//builder.Services.AddScoped<IUserFileService, UserFileService>();
//builder.Services.AddScoped<IUserService, UserService>();
//builder.Services.AddScoped<IS3Service,S3Service>();
//builder.Services.AddHttpClient<IAssemblyAiService, AssemblyAiService>();
//builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
////builder.Services.AddAWSService<IAmazonS3>();

//var awsOptions = builder.Configuration.GetSection("AWS");
//string region = awsOptions["Region"] ?? "us-east-1";
//string accessKeyId = awsOptions["AccessKey"];
//string secretAccessKey = awsOptions["SecretKey"];

//if (string.IsNullOrEmpty(accessKeyId) || string.IsNullOrEmpty(secretAccessKey))
//{
//throw new InvalidOperationException("AWS credentials are missing from appsettings.json.");
//}

//builder.Services.AddSingleton<IAmazonS3>(sp =>
//{
//    var config = new AmazonS3Config
//    {
//        RegionEndpoint = RegionEndpoint.GetBySystemName(region)
//    };

//    var credentials = new BasicAWSCredentials(accessKeyId, secretAccessKey);
//    return new AmazonS3Client(credentials, config);
//});



//// ����� ����������
//builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
//builder.Services.AddScoped<ISummaryRepository, SummaryRepository>();
//builder.Services.AddScoped<IUserFileRepository, UserFileRepository>();
//builder.Services.AddScoped<IUserRepository, UserRepository>();

//// ����� AutoMapper
//builder.Services.AddAutoMapper(typeof(AppMappingProfile));

//// ����� ����������� �� Json
//builder.Services.AddControllers().AddJsonOptions(options =>
//{
//    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
//    options.JsonSerializerOptions.WriteIndented = true;
//});

//// ����� Swagger
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen(options =>
//{
//    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
//    {
//        Scheme = "Bearer",
//        BearerFormat = "JWT",
//        In = ParameterLocation.Header,
//        Name = "Authorization",
//        Description = "Bearer Authentication with JWT Token",
//        Type = SecuritySchemeType.Http
//    });
//    options.AddSecurityRequirement(new OpenApiSecurityRequirement
//    {
//        {
//            new OpenApiSecurityScheme
//            {
//                Reference = new OpenApiReference
//                {
//                    Id = "Bearer",
//                    Type = ReferenceType.SecurityScheme
//                }
//            },
//            new List<string>()
//        }
//    });
//});

//// ����� CORS
//var allowedOrigins = "_allowedOrigins";
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy(name: allowedOrigins,
//        policy =>
//        {
//            policy.WithOrigins(
//                    "http://localhost:5173",// �� ����� �� React ���
//                    "https://practicum-react-frontside.onrender.com",
//                    "http://localhost:4200"
//                )
//                .AllowAnyHeader()
//                .AllowAnyMethod();
//        });
//});

//// ����� MySQL
//builder.Services.AddDbContext<VoiceSummarizerDbContext>(options =>
//    options.UseMySql(
//        builder.Configuration.GetConnectionString("DefaultConnection"),
//        new MySqlServerVersion(new Version(7, 0, 11)) // ���� ��� �� ���� MySQL ������
//    ));
//builder.Services.AddAuthentication(options =>
//{
//    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//})
//    .AddJwtBearer(options =>
//    {
//        options.TokenValidationParameters = new TokenValidationParameters
//        {
//            ValidateIssuer = true,
//            ValidateAudience = true,
//            ValidateLifetime = true,
//            ValidateIssuerSigningKey = true,
//            ValidIssuers = builder.Configuration.GetSection("JWT:Issuer").Get<string[]>(),
//            ValidAudiences = builder.Configuration.GetSection("JWT:Audience").Get<string[]>(),
//            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]))
//        };

//    });

//var app = builder.Build();

//// ����������� �� Swagger ������ �����
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//// ����� �-CORS (���� ��� ���� ����� ���� UseAuthorization)
//app.UseCors(allowedOrigins);

//// ����������� �� HTTP ��Authorization
//app.UseHttpsRedirection();
//app.UseAuthentication();
//app.UseAuthorization();

//app.MapControllers();

//app.Run();


using Microsoft.EntityFrameworkCore;
using DL.Contexts;
using BL.IService;
using BL.Services;
using DL.IRepositories;
using DL.Repository;
using System.Text.Json.Serialization;
using BL;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Amazon.S3;
using Amazon;
using Amazon.Runtime;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.AddConsole();

// �������
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ISummaryService, SummaryService>();
builder.Services.AddScoped<IUserFileService, UserFileService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IS3Service, S3Service>();
builder.Services.AddHttpClient<IAssemblyAiService, AssemblyAiService>();

// ����� ����� ����� �� appsettings
var awsSection = builder.Configuration.GetSection("AWS");
string region = Environment.GetEnvironmentVariable("AWS_REGION") ?? awsSection["Region"] ?? "us-east-1";
string accessKeyId = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID") ?? awsSection["AccessKey"];
string secretAccessKey = Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY") ?? awsSection["SecretKey"];

if (string.IsNullOrEmpty(accessKeyId) || string.IsNullOrEmpty(secretAccessKey))
{
    throw new InvalidOperationException("Missing AWS credentials from env or appsettings.");
}

builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var config = new AmazonS3Config
    {
        RegionEndpoint = RegionEndpoint.GetBySystemName(region)
    };
    var credentials = new BasicAWSCredentials(accessKeyId, secretAccessKey);
    return new AmazonS3Client(credentials, config);
});

// ����������
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ISummaryRepository, SummaryRepository>();
builder.Services.AddScoped<IUserFileRepository, UserFileRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// AutoMapper
builder.Services.AddAutoMapper(typeof(AppMappingProfile));

// JSON
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});

// Swagger
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

// CORS
var allowedOrigins = "_allowedOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: allowedOrigins,
        policy =>
        {
            policy.WithOrigins(
                    "http://localhost:5173",
                    "https://practicum-react-frontside.onrender.com",
                    "http://localhost:4200"
                )
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// MySQL
builder.Services.AddDbContext<VoiceSummarizerDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(7, 0, 11))
    ));

// JWT
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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(allowedOrigins);
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

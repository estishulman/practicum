//////using Microsoft.EntityFrameworkCore;
//////using DL.Contexts; // ������ ��� ����� ����� ������ �������� ���
//////using BL.IService;
//////using BL.Services;
//////using DL.IRepositories;
//////using DL.Repository;
//////var builder = WebApplication.CreateBuilder(args);
////////����� ��������
//////builder.Services.AddScoped<ICategoryService, CategoryService>();
//////builder.Services.AddScoped<ISummaryService, SummaryService>();
//////builder.Services.AddScoped<IUserFileService, UserFileService>();
//////builder.Services.AddScoped<IUserService, UserService>();
//////// ����� ����������
//////builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
//////builder.Services.AddScoped<ISummaryRepository, SummaryRepository>();
//////builder.Services.AddScoped<IUserFileRepository, UserFileRepository>();
//////builder.Services.AddScoped<IUserRepository, UserRepository>();

//////builder.Services.AddControllers();
//////// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
//////builder.Services.AddEndpointsApiExplorer();
//////builder.Services.AddSwaggerGen();
//////builder.Services.AddDbContext<VoiceSummarizerDbContext>(options =>
//////    options.UseMySql(
//////        builder.Configuration.GetConnectionString("DefaultConnection"),
//////        new MySqlServerVersion(new Version(7, 0, 11)) // ���� ��� �� ���� MySQL ������
//////    ));

//////var app = builder.Build();

//////// Configure the HTTP request pipeline.
//////if (app.Environment.IsDevelopment())
//////{
//////    app.UseSwagger();
//////    app.UseSwaggerUI();
//////}

//////app.UseHttpsRedirection();

//////app.UseAuthorization();

//////app.MapControllers();

//////app.Run();



////using Microsoft.EntityFrameworkCore;
////using DL.Contexts; 
////using BL.IService;
////using BL.Services;
////using DL.IRepositories;
////using DL.Repository;
////using System.Text.Json;  // ����� ����� ����� �-Json
////using System.Text.Json.Serialization;
////using BL;

////var builder = WebApplication.CreateBuilder(args);

////// ����� �������
////builder.Services.AddScoped<ICategoryService, CategoryService>();
////builder.Services.AddScoped<ISummaryService, SummaryService>();
////builder.Services.AddScoped<IUserFileService, UserFileService>();
////builder.Services.AddScoped<IUserService, UserService>();

////// ����� ����������
////builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
////builder.Services.AddScoped<ISummaryRepository, SummaryRepository>();
////builder.Services.AddScoped<IUserFileRepository, UserFileRepository>();
////builder.Services.AddScoped<IUserRepository, UserRepository>();

////builder.Services.AddAutoMapper(typeof(AppMappingProfile));

////builder.Services.AddControllers().AddJsonOptions(options =>
////{
////    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
////    options.JsonSerializerOptions.WriteIndented = true;
////});
////// ����� Swagger/OpenAPI
////builder.Services.AddEndpointsApiExplorer();
////builder.Services.AddSwaggerGen();
////builder.Services.AddDbContext<VoiceSummarizerDbContext>(options =>
////    options.UseMySql(
////        builder.Configuration.GetConnectionString("DefaultConnection"),
////        new MySqlServerVersion(new Version(7, 0, 11)) // ���� ��� �� ���� MySQL ������
////    ));

////var app = builder.Build();

////// Configure the HTTP request pipeline.
////if (app.Environment.IsDevelopment())
////{
////    app.UseSwagger();
////    app.UseSwaggerUI();
////}

////app.UseHttpsRedirection();

////app.UseAuthorization();

////app.MapControllers();

////app.Run();



//var builder = WebApplication.CreateBuilder(args);

//// Add services to the container.
//builder.Services.AddControllers();

//// Add AutoMapper, DbContext, Dependency Injection, etc.
//// builder.Services.AddDbContext<...>();
//// builder.Services.AddScoped<IUserService, UserService>();
//// builder.Services.AddAutoMapper(typeof(Program));

//// Add CORS - Allow only specific origins
//var allowedOrigins = "_allowedOrigins";
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy(name: allowedOrigins,
//        policy =>
//        {
//            policy.WithOrigins(
//                    "http://localhost:3000" // ��� ���� ������ �� ������ ������� �����
//                )
//                .AllowAnyHeader()
//                .AllowAnyMethod();
//        });
//});

//// Learn more about configuring Swagger/OpenAPI
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

//var app = builder.Build();

//// Configure the HTTP request pipeline
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//// Use CORS (important - before UseAuthorization)
//app.UseCors(allowedOrigins);

//app.UseHttpsRedirection();

//app.UseAuthorization();

//app.MapControllers();

//app.Run();




using Microsoft.EntityFrameworkCore;
using DL.Contexts;
using BL.IService;
using BL.Services;
using DL.IRepositories;
using DL.Repository;
using System.Text.Json;
using System.Text.Json.Serialization;
using BL;

var builder = WebApplication.CreateBuilder(args);

// ����� �������
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ISummaryService, SummaryService>();
builder.Services.AddScoped<IUserFileService, UserFileService>();
builder.Services.AddScoped<IUserService, UserService>();

// ����� ����������
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ISummaryRepository, SummaryRepository>();
builder.Services.AddScoped<IUserFileRepository, UserFileRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// ����� AutoMapper
builder.Services.AddAutoMapper(typeof(AppMappingProfile));

// ����� ����������� �� Json
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});

// ����� Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ����� CORS
var allowedOrigins = "_allowedOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: allowedOrigins,
        policy =>
        {
            policy.WithOrigins(
                    "http://localhost:5173" // �� ����� �� React ���
                )
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// ����� MySQL
builder.Services.AddDbContext<VoiceSummarizerDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(7, 0, 11)) // ���� ��� �� ���� MySQL ������
    ));

var app = builder.Build();

// ����������� �� Swagger ������ �����
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ����� �-CORS (���� ��� ���� ����� ���� UseAuthorization)
app.UseCors(allowedOrigins);

// ����������� �� HTTP ��Authorization
app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();

using DL.Entities;
using DL.Contexts;
using Microsoft.EntityFrameworkCore;
using BL.IService;
using DL.IRepositories;
using BL.DTOs;
using DL.Repository;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration;

namespace BL.Services
{
    public class UserService : IUserService
    {
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public UserService(IUserRepository userRepository, IMapper mapper, IConfiguration configuration)
            {
            _configuration = configuration;
            _userRepository = userRepository;
            _mapper = mapper;
        }
        public async Task<UserResponseDto> GetUserByIdAsync(int id)
        {
            var user= await _userRepository.GetByIdAsync(id);
            return _mapper.Map<UserResponseDto>(user);
        }
        public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync()
        {
            var list= await _userRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<UserResponseDto>>(list);
        }
        public async Task<IEnumerable<UserResponseDto>> GetLecturersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            var lecturers = users
                .Where(u => u.Role == Role.lecturer);

            return _mapper.Map<IEnumerable<UserResponseDto>>(lecturers);
        }

        public async Task<UserResponseDto> CreateUserAsync(UserCreateDto createDto)
        {
            var user = _mapper.Map<User>(createDto);

            // הצפנת הסיסמה
            var passwordHasher = new PasswordHasher<User>();
            user.PasswordHash = passwordHasher.HashPassword(user, createDto.Password);

            await _userRepository.AddAsync(user);
            return _mapper.Map<UserResponseDto>(user);
        }

        public async Task UpdateUserAsync(int id, UserUpdateDto dto, int currentUserId)
        {
            var userToUpdate = await _userRepository.GetByIdAsync(id);
            if (userToUpdate == null)
                throw new Exception("User not found");

            // שמור את ה־Role המקורי
            var originalRole = userToUpdate.Role;

            // בצע מיפוי של כל השדות חוץ מרול
            _mapper.Map(dto, userToUpdate);

            // אם נשלחה סיסמה חדשה, הצפן אותה מחדש
            if (!string.IsNullOrEmpty(dto.Password))
            {
                var passwordHasher = new PasswordHasher<User>();
                userToUpdate.PasswordHash = passwordHasher.HashPassword(userToUpdate, dto.Password);
            }

            // החזר את ה־Role המקורי
            userToUpdate.Role = originalRole;

            // אם נשלח Role, בדוק הרשאות ועדכן
            if (dto.Role.HasValue)
            {
                var currentUser = await _userRepository.GetByIdAsync(currentUserId);
                if (currentUser == null || currentUser.Role != Role.Admin)
                    throw new UnauthorizedAccessException("Only admins can change roles.");

                userToUpdate.Role = dto.Role.Value;
            }

            await _userRepository.UpdateAsync(userToUpdate);
        }

        public async Task DeleteUserAsync(int id)
        {
            await _userRepository.DeleteAsync(id);
        }

        public async Task<AuthResponseDto?> LoginAsync(UserLoginDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email); // חיפוש משתמש לפי מייל
            if (user == null)
            {
                return null; // אם המשתמש לא נמצא
            }

            var passwordHasher = new PasswordHasher<User>(); // יצירת מאמת סיסמאות
            var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);

            if (result == PasswordVerificationResult.Failed)
            {
                return null; // אם הסיסמה לא נכונה
            }
            var token = GenerateToken(user); // כאן תוכל להוסיף לוגיקה ליצירת טוקן JWT אם תרצה
            var newUser= _mapper.Map<AuthResponseDto>(user);
            newUser.Token = token;
            return newUser; // החזרת המשתמש עם הטוקן
        }


        public string GenerateToken(User user)
        {
            // הכנת רשימת קליימים
            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Name.ToString()),
            new Claim(ClaimTypes.Role, user.Role.ToString())
            } ;

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration.GetSection("Jwt:Issuer").Get<string[]>()[0],
                audience: _configuration.GetSection("Jwt:Audience").Get<string[]>()[0],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(3),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


    }

}

using DL.Entities;
using DL.Contexts;
using Microsoft.EntityFrameworkCore;
using BL.IService;
using DL.IRepositories;
using BL.DTOs;
using DL.Repository;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace BL.Services
{
    //public class UserService
    //{
    //    private readonly VoiceSummarizerDbContext _context;

    //    public UserService(VoiceSummarizerDbContext context)
    //    {
    //        _context = context;
    //    }

    //    public async Task<IEnumerable<User>> GetAllAsync()
    //    {
    //        return await _context.Users.ToListAsync();
    //    }

    //    public async Task<User?> GetByIdAsync(int id)
    //    {
    //        return await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
    //    }

    //    public async Task<User> CreateAsync(User user)
    //    {
    //        _context.Users.Add(user);
    //        await _context.SaveChangesAsync();
    //        return user;
    //    }

    //    public async Task<bool> UpdateAsync(User user)
    //    {
    //        var existingUser = await _context.Users.FindAsync(user.Id);
    //        if (existingUser == null) return false;

    //        _context.Entry(existingUser).CurrentValues.SetValues(user);
    //        await _context.SaveChangesAsync();
    //        return true;
    //    }

    //    public async Task<bool> DeleteAsync(int id)
    //    {
    //        var user = await _context.Users.FindAsync(id);
    //        if (user == null) return false;

    //        _context.Users.Remove(user);
    //        await _context.SaveChangesAsync();
    //        return true;
    //    }
    //}
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public UserService(IUserRepository userRepository, IMapper mapper)
        {
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

        //public async Task<UserResponseDto> CreateUserAsync(UserCreateDto createDto)
        //{
            
        //    var user = _mapper.Map<User>(createDto);
        //    await _userRepository.AddAsync(user);
        //    return _mapper.Map<UserResponseDto>(user);
        //}
        public async Task<UserResponseDto> CreateUserAsync(UserCreateDto createDto)
        {
            var user = _mapper.Map<User>(createDto);

            // הצפנת הסיסמה
            var passwordHasher = new PasswordHasher<User>();
            user.PasswordHash = passwordHasher.HashPassword(user, createDto.Password);

            await _userRepository.AddAsync(user);
            return _mapper.Map<UserResponseDto>(user);
        }


        //public async Task UpdateUserAsync(int id, UserUpdateDto dto, int currentUserId)
        //{
        //    var userToUpdate = await _userRepository.GetByIdAsync(id);
        //    if (userToUpdate == null)
        //        throw new Exception("User not found");

        //    // שמור את ה־Role המקורי
        //    var originalRole = userToUpdate.Role;

        //    // בצע מיפוי של כל השדות חוץ מרול
        //    _mapper.Map(dto, userToUpdate);

        //    // החזר את ה־Role המקורי
        //    userToUpdate.Role = originalRole;

        //    // אם נשלח Role, בדוק הרשאות ועדכן
        //    if (dto.Role.HasValue)
        //    {
        //        var currentUser = await _userRepository.GetByIdAsync(currentUserId);
        //        if (currentUser == null || currentUser.Role != Role.Admin)
        //            throw new UnauthorizedAccessException("Only admins can change roles.");

        //        userToUpdate.Role = dto.Role.Value;
        //    }

        //    await _userRepository.UpdateAsync(userToUpdate);
        //}

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

        public async Task<UserResponseDto?> LoginAsync(UserLoginDto dto)
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

            return _mapper.Map<UserResponseDto>(user); // אם הסיסמה נכונה, מחזיר את המידע של המשתמש
        }





    }

}

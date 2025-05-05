using BL.DTOs;
using DL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.IService
{
    public interface IUserService
    {
        Task<UserResponseDto> GetUserByIdAsync(int id);
        Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();
        Task<UserResponseDto> CreateUserAsync(UserCreateDto user);
        Task UpdateUserAsync(int id,UserUpdateDto user,int currentUserId);
        Task DeleteUserAsync(int id);
        Task<UserResponseDto?> LoginAsync(UserLoginDto dto);

    }

}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DL.Entities;
namespace DL.IRepositories
{
        public interface IUserRepository
        {
            Task<IEnumerable<User>> GetAllAsync();
            Task<User?> GetByIdAsync(int id);
            Task AddAsync(User user);
            Task UpdateAsync(User user);
            Task DeleteAsync(int id);
            Task<User?> GetByEmailAndPasswordAsync(string email, string password);
            Task<User?> GetByEmailAsync(string email);

    }
}



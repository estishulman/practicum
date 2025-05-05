using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DL.Entities;

namespace DL.IRepositories
{
        public interface IUserFileRepository
        {
            Task<IEnumerable<UserFile>> GetAllAsync();
            Task<UserFile?> GetByIdAsync(int id);
            Task AddAsync(UserFile file);
            Task UpdateAsync(UserFile file);
            Task DeleteAsync(int id);
        }
    }


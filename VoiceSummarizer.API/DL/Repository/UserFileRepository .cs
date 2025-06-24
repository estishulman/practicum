using DL.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static DL.Repository.UserFileRepository;
using DL.Contexts;
using DL.IRepositories;

namespace DL.Repository
{
        public class UserFileRepository : IUserFileRepository
        {
            private readonly VoiceSummarizerDbContext _context;

            public UserFileRepository(VoiceSummarizerDbContext context)
            {
                _context = context;
            }

        //public async Task<UserFile?> GetByIdAsync(int id) // צריך להיות עם סימן שאלה
        //{
        // return await _context.Files.FindAsync(id);
        //}

        public async Task<UserFile?> GetByIdAsync(int id)
        {
            return await _context.Files
                .Include(f => f.Category)
                .Include(f => f.User)
                .Include(f => f.Summary)
                .FirstOrDefaultAsync(f => f.Id == id);
        }


        public async Task<IEnumerable<UserFile>> GetAllAsync()
            {
                return await _context.Files.Include(f => f.Category).Include(f => f.User).Include(f => f.Summary).ToListAsync();
            }

            public async Task AddAsync(UserFile file)
            {
                _context.Files.Add(file);
                await _context.SaveChangesAsync();
            }

            public async Task UpdateAsync(UserFile file)
            {
                _context.Files.Update(file);
                await _context.SaveChangesAsync();
            }

            public async Task DeleteAsync(int id)
            {
                var file = await _context.Files.FindAsync(id);
                if (file != null)
                {
                    _context.Files.Remove(file);
                    await _context.SaveChangesAsync();
                }
            }
        }

    }

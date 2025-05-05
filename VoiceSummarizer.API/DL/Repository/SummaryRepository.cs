using DL.Contexts;
using DL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DL.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace DL.Repository
{
    public class SummaryRepository : ISummaryRepository
    {
        private readonly VoiceSummarizerDbContext _context;

        public SummaryRepository(VoiceSummarizerDbContext context)
        {
            _context = context;
        }

        public async Task<Summary> GetByIdAsync(int id)
        {
            return await _context.Summaries.FindAsync(id);
        }

        public async Task<IEnumerable<Summary>> GetAllAsync()
        {
            return await _context.Summaries.ToListAsync();
        }

        public async Task<IEnumerable<Summary>> GetSummariesByUserIdAsync(int userId)
        {
            return await _context.Summaries
                .Where(s => s.File != null && s.File.UserId == userId)
                .ToListAsync();
        }
        public async Task AddAsync(Summary summary)
        {
            await _context.Summaries.AddAsync(summary);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Summary summary)
        {
            _context.Summaries.Update(summary);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var summary = await GetByIdAsync(id);
            if (summary != null)
            {
                _context.Summaries.Remove(summary);
                await _context.SaveChangesAsync();
            }
        }
    }

}

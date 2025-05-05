using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DL.Entities;

namespace DL.IRepositories
{
      public interface ISummaryRepository
      {
            Task<IEnumerable<Summary>> GetAllAsync();
            Task<Summary?> GetByIdAsync(int id);
            Task AddAsync(Summary summary);
            Task UpdateAsync(Summary summary);
            Task DeleteAsync(int id);
      }
}


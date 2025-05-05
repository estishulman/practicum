﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DL.Entities;
namespace DL.IRepositories
{
    
        public interface ICategoryRepository
        {
            Task<IEnumerable<Category>> GetAllAsync();
            Task<Category?> GetByIdAsync(int id);
            Task AddAsync(Category category);
            Task UpdateAsync(Category category);
            Task DeleteAsync(int id);
        }
    }



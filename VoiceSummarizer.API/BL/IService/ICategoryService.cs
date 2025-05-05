using DL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

//namespace BL.IService
//{
//    public interface ICategoryService
//    {
//        Task<Category> GetCategoryByIdAsync(int id);
//        Task<IEnumerable<Category>> GetAllCategoriesAsync();
//        Task<Category> CreateCategoryAsync(Category category);
//        Task UpdateCategoryAsync(Category category);
//        Task DeleteCategoryAsync(int id);
//    }

//}


using BL.DTOs;

namespace BL.IService
{
    public interface ICategoryService
    {
        Task<CategoryResponseDto> GetCategoryByIdAsync(int id);
        Task<IEnumerable<CategoryResponseDto>> GetAllCategoriesAsync();
        Task<CategoryResponseDto> CreateCategoryAsync(CategoryCreateDto createDto);
        Task UpdateCategoryAsync(int id, CategoryCreateDto updateDto);
        Task DeleteCategoryAsync(int id);
    }
}

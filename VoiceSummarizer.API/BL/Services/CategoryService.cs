//using DL.Contexts;
//using DL.Entities;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using Microsoft.EntityFrameworkCore;
//using BL.IService;
//using DL.IRepositories;
//using AutoMapper;
//namespace BL.Services
//{
//    //public class CategoryService
//    //{
//    //    private readonly VoiceSummarizerDbContext _context;

//    //    public CategoryService(VoiceSummarizerDbContext context)
//    //    {
//    //        _context = context;
//    //    }

//    //    public async Task<IEnumerable<Category>> GetAllAsync()
//    //    {
//    //        return await _context.Categories.ToListAsync();
//    //    }

//    //    public async Task<Category?> GetByIdAsync(int id)
//    //    {
//    //        return await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
//    //    }

//    //    public async Task<Category> CreateAsync(Category category)
//    //    {
//    //        _context.Categories.Add(category);
//    //        await _context.SaveChangesAsync();
//    //        return category;
//    //    }

//    //    public async Task<bool> UpdateAsync(Category category)
//    //    {
//    //        var existingCategory = await _context.Categories.FindAsync(category.Id);
//    //        if (existingCategory == null) return false;

//    //        _context.Entry(existingCategory).CurrentValues.SetValues(category);
//    //        await _context.SaveChangesAsync();
//    //        return true;
//    //    }

//    //    public async Task<bool> DeleteAsync(int id)
//    //    {
//    //        var category = await _context.Categories.FindAsync(id);
//    //        if (category == null) return false;

//    //        _context.Categories.Remove(category);
//    //        await _context.SaveChangesAsync();
//    //        return true;
//    //    }
//    //}
//    public class CategoryService : ICategoryService
//    {
//        private readonly ICategoryRepository _categoryRepository;
//        private readonly IMapper _mapper;
//        public CategoryService(ICategoryRepository categoryRepository,IMapper mapper)
//        {
//            _categoryRepository = categoryRepository;
//            _mapper = mapper;
//        }

//        public async Task<Category> GetCategoryByIdAsync(int id)
//        {
//            return await _categoryRepository.GetByIdAsync(id);
//        }

//        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
//        {
//            return await _categoryRepository.GetAllAsync();
//        }

//        public async Task<Category> CreateCategoryAsync(Category category)
//        {
//            await _categoryRepository.AddAsync(category);
//            return category;
//        }

//        public async Task UpdateCategoryAsync(Category category)
//        {
//            await _categoryRepository.UpdateAsync(category);
//        }

//        public async Task DeleteCategoryAsync(int id)
//        {
//            await _categoryRepository.DeleteAsync(id);
//        }
//    }

//}


using DL.Entities;
using BL.DTOs; // ← חדש: נוספה הפנייה ל־DTO
using DL.IRepositories;
using BL.IService;
using AutoMapper;

namespace BL.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryRepository categoryRepository, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        // קבלת קטגוריה לפי מזהה והחזרת DTO (ולא Entity)
        public async Task<CategoryResponseDto> GetCategoryByIdAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            return _mapper.Map<CategoryResponseDto>(category); // ← ממפה ל־DTO
        }

        // קבלת כל הקטגוריות
        public async Task<IEnumerable<CategoryResponseDto>> GetAllCategoriesAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<CategoryResponseDto>>(categories); // ← ממפה רשימה ל־DTO
        }

        // יצירת קטגוריה מתוך DTO
        public async Task<CategoryResponseDto> CreateCategoryAsync(CategoryCreateDto createDto)
        {
            var category = _mapper.Map<Category>(createDto); // ← ממפה מ־CreateDto ל־Entity
            await _categoryRepository.AddAsync(category);
            return _mapper.Map<CategoryResponseDto>(category); // ← מחזיר את הקטגוריה שנוצרה כ־DTO
        }

        // עדכון קטגוריה (לפי Entity – אפשר גם לשנות ל־DTO אם תרצי)
        public async Task UpdateCategoryAsync(int id, CategoryCreateDto updateDto)
        {
            var existing = await _categoryRepository.GetByIdAsync(id);
            if (existing == null) throw new Exception("Category not found");

            _mapper.Map(updateDto, existing); // ← מעדכן את ה־Entity מה־DTO
            await _categoryRepository.UpdateAsync(existing);
        }

        // מחיקת קטגוריה
        public async Task DeleteCategoryAsync(int id)
        {
            await _categoryRepository.DeleteAsync(id);
        }
    }
}

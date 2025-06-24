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

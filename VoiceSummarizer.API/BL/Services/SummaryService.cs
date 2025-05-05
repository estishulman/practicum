//using DL.Entities;
//using DL.Contexts;
//using Microsoft.EntityFrameworkCore;
//using BL.IService;
//using DL.IRepositories;

//namespace BL.Services
//{
//    //public class SummaryService
//    //{
//    //    private readonly VoiceSummarizerDbContext _context;

//    //    public SummaryService(VoiceSummarizerDbContext context)
//    //    {
//    //        _context = context;
//    //    }

//    //    public async Task<IEnumerable<Summary>> GetAllAsync()
//    //    {
//    //        return await _context.Summaries.ToListAsync();
//    //    }

//    //    public async Task<Summary?> GetByIdAsync(int id)
//    //    {
//    //        return await _context.Summaries.FirstOrDefaultAsync(s => s.Id == id);
//    //    }

//    //    public async Task<Summary> CreateAsync(Summary summary)
//    //    {
//    //        _context.Summaries.Add(summary);
//    //        await _context.SaveChangesAsync();
//    //        return summary;
//    //    }

//    //    public async Task<bool> UpdateAsync(Summary summary)
//    //    {
//    //        var existingSummary = await _context.Summaries.FindAsync(summary.Id);
//    //        if (existingSummary == null) return false;

//    //        _context.Entry(existingSummary).CurrentValues.SetValues(summary);
//    //        await _context.SaveChangesAsync();
//    //        return true;
//    //    }

//    //    public async Task<bool> DeleteAsync(int id)
//    //    {
//    //        var summary = await _context.Summaries.FindAsync(id);
//    //        if (summary == null) return false;

//    //        _context.Summaries.Remove(summary);
//    //        await _context.SaveChangesAsync();
//    //        return true;
//    //    }
//    //}

//    public class SummaryService : ISummaryService
//    {
//        private readonly ISummaryRepository _summaryRepository;

//        public SummaryService(ISummaryRepository summaryRepository)
//        {
//            _summaryRepository = summaryRepository;
//        }

//        public async Task<Summary> GetSummaryByIdAsync(int id)
//        {
//            return await _summaryRepository.GetByIdAsync(id);
//        }

//        public async Task<IEnumerable<Summary>> GetAllSummariesAsync()
//        {
//            return await _summaryRepository.GetAllAsync();
//        }

//        public async Task<Summary> CreateSummaryAsync(Summary summary)
//        {
//            await _summaryRepository.AddAsync(summary);  // אם המתודה הזו מחזירה void, אתה לא יכול להחזיר אותה כ-Summary
//            return summary; // חזור על האובייקט summary עצמו אם המתודה מחזירה את הערך הזה
//        }

//        public async Task UpdateSummaryAsync(Summary summary)
//        {
//            await _summaryRepository.UpdateAsync(summary);
//        }

//        public async Task DeleteSummaryAsync(int id)
//        {
//            await _summaryRepository.DeleteAsync(id);
//        }
//    }

//}

using AutoMapper;
using BL.DTOs;
using BL.IService;
using DL.Entities;
using DL.IRepositories;
using DL.Repository;

namespace BL.Services
{
    public class SummaryService : ISummaryService
    {
        private readonly ISummaryRepository _summaryRepository;
        private readonly IUserFileRepository _userFileRepository;
        private readonly IMapper _mapper;

        public SummaryService(ISummaryRepository summaryRepository,IUserFileRepository userFileRepository, IMapper mapper)
        {
            _summaryRepository = summaryRepository;
            _userFileRepository = userFileRepository;
            _mapper = mapper;
        }

        public async Task<SummaryResponseDto> GetSummaryByIdAsync(int id)
        {
            var summary = await _summaryRepository.GetByIdAsync(id);
            return _mapper.Map<SummaryResponseDto>(summary);
        }

        public async Task<IEnumerable<SummaryResponseDto>> GetAllSummariesAsync()
        {
            var summaries = await _summaryRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SummaryResponseDto>>(summaries);
        }

        public async Task<SummaryResponseDto> CreateSummaryAsync(SummaryCreateDto createDto)
        {
            var summary = _mapper.Map<Summary>(createDto);
            await _summaryRepository.AddAsync(summary);
            // עדכון ה-UserFile שיהיה מחובר לסיכום החדש
            var file = await _userFileRepository.GetByIdAsync(createDto.UserFileId);
            if (file != null)
            {
                file.SummaryId = summary.Id;
                await _userFileRepository.UpdateAsync(file);
            }
            return _mapper.Map<SummaryResponseDto>(summary);
        }

        public async Task UpdateSummaryAsync(int id, SummaryUpdateDto updateDto)
        {
            var existing = await _summaryRepository.GetByIdAsync(id);
            if (existing == null) throw new Exception("Summary not found");

            _mapper.Map(updateDto, existing);
            await _summaryRepository.UpdateAsync(existing);

        }

        public async Task DeleteSummaryAsync(int id)
        {
            await _summaryRepository.DeleteAsync(id);
        }
    }
}


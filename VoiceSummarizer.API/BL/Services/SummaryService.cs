

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


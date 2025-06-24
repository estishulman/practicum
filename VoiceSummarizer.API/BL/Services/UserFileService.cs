using DL.Entities;
using DL.Contexts;
using Microsoft.EntityFrameworkCore;
using BL.IService;
using DL.IRepositories;
using AutoMapper;
using BL.DTOs;
using Microsoft.Extensions.Configuration;
namespace BL.Services
{
    public class UserFileService : IUserFileService
    {
        private readonly IUserFileRepository _fileRepository;
        private readonly ISummaryRepository _summaryRepository;
        private readonly IMapper _mapper;
        private readonly IS3Service _s3Service;
        private readonly IAssemblyAiService _assemblyAiService;
        public UserFileService(IUserFileRepository fileRepository, ISummaryRepository summaryRepository,IMapper mapper,IS3Service s3Service,IAssemblyAiService assemblyAiService)
        {
            _fileRepository = fileRepository;
            _summaryRepository = summaryRepository;
            _mapper=mapper;
            _s3Service = s3Service;
            _assemblyAiService = assemblyAiService;
        }

        public async Task<UserFileResponseDto> GetFileByIdAsync(int id)
        {
            var file = await _fileRepository.GetByIdAsync(id);
            return _mapper.Map<UserFileResponseDto>(file);
        }

        public async Task<IEnumerable<UserFileResponseDto>> GetAllFilesAsync()
        {
            var list= await _fileRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<UserFileResponseDto>>(list);
        }

        //public async Task<UserFileResponseDto> UploadFileAsync(UserFileCreateDto createDto)
        //{
        //    var file = _mapper.Map<UserFile>(createDto);
        //    await _fileRepository.AddAsync(file);

        //    try
        //    {
        //        // סיכום אוטומטי עם AssemblyAI
        //        var summary = await GenerateSummaryAsync(file.Id);
        //        Console.WriteLine($"[UploadFileAsync] Summary created for file {file.Id}: {summary?.Content}");
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"[UploadFileAsync] Failed to generate summary: {ex.Message}");
        //    }

        //    return _mapper.Map<UserFileResponseDto>(file);
        //}

        public async Task<UserFileResponseDto> UploadFileAsync(UserFileCreateDto createDto)
        {
            var file = _mapper.Map<UserFile>(createDto);
            await _fileRepository.AddAsync(file); // שמירה ראשונית של הקובץ, מקבל Id

            try
            {
                var summary = await GenerateSummaryAsync(file.Id); // יוצר סיכום ומעדכן את הקובץ עם SummaryId
                Console.WriteLine($"[UploadFileAsync] Summary created for file {file.Id}: {summary?.Content}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[UploadFileAsync] Failed to generate summary: {ex.Message}");
            }

            // כדי לוודא שתחזיר את הקובץ עם ה-SummaryId המעודכן, כדאי למשוך אותו מחדש מהמסד
            var updatedFile = await _fileRepository.GetByIdAsync(file.Id);
            return _mapper.Map<UserFileResponseDto>(updatedFile);
        }

        public async Task UpdateFileAsync(int id,UserFileUpdateDto updateDto)
        {

            var existing = await _fileRepository.GetByIdAsync(id);
            if (existing == null) throw new Exception("userfile not found");

            _mapper.Map(updateDto, existing);
            await _fileRepository.UpdateAsync(existing);
        }

        public async Task DeleteFileAsync(int id)
        {
            await _fileRepository.DeleteAsync(id);
        }

        //public async Task<SummaryResponseDto> GenerateSummaryAsync(int fileId)
        //{
        //    var file = await _fileRepository.GetByIdAsync(fileId);
        //    if (file == null) throw new Exception("File not found");

        //    var existingSummary = await _summaryRepository.GetByFileIdAsync(fileId);

        //    if (existingSummary != null)
        //        return _mapper.Map<SummaryResponseDto>(existingSummary);

        //    var summaryText = await _assemblyAiService.SummarizeFromAudioUrlAsync(file.Url); // שדה שמכיל קישור לקובץ

        //    var summary = new Summary
        //    {
        //        FileId = fileId,
        //        Content = summaryText
        //    };

        //    file.Status = FileStatus.Completed;
        //    await _summaryRepository.AddAsync(summary);
        //    await _fileRepository.UpdateAsync(file);

        //    return _mapper.Map<SummaryResponseDto>(summary);
        //}
        public async Task<SummaryResponseDto> GenerateSummaryAsync(int fileId)
        {
            var file = await _fileRepository.GetByIdAsync(fileId);
            if (file == null) throw new Exception("File not found");

            var existingSummary = await _summaryRepository.GetByFileIdAsync(fileId);
            if (existingSummary != null)
            {
                // אם יש סיכום קיים, וודא שהסטטוס של הקובץ הוא Completed
                if (file.Status != FileStatus.Completed)
                {
                    file.Status = FileStatus.Completed;
                    await _fileRepository.UpdateAsync(file);
                }
                return _mapper.Map<SummaryResponseDto>(existingSummary);
            }

            // שלב 1: שנה סטטוס ל-Processing
            file.Status = FileStatus.Processing;
            await _fileRepository.UpdateAsync(file);

            try
            {
                // שלב 2: צור את הסיכום
                var summaryText = await _assemblyAiService.SummarizeFromAudioUrlAsync(file.Url);

                var summary = new Summary
                {
                    FileId = fileId,
                    Content = summaryText
                };

                await _summaryRepository.AddAsync(summary);

                // שלב 3: עדכן לקובץ שהסטטוס הוא Completed והחבר לסיכום
                file.Status = FileStatus.Completed;  // ← חשוב!
                file.SummaryId = summary.Id;
                await _fileRepository.UpdateAsync(file);

                return _mapper.Map<SummaryResponseDto>(summary);
            }
            catch (Exception ex)
            {
                // אם נכשל, שנה ל-Failed
                file.Status = FileStatus.Failed;
                await _fileRepository.UpdateAsync(file);
                throw; // זרוק את השגיאה הלאה
            }
        }


        public string GeneratePresignedUrl(string fileName, string contentType)
        {
            return _s3Service.GeneratePresignedUrl(fileName, contentType);
        }

    }

}


////using System;
////using System.Collections.Generic;
////using System.Linq;
////using System.Text;
////using System.Threading.Tasks;

//////namespace BL.Services
//////{
//////    internal class UserFileService
//////    {
//////    }
//////}
////using DL.Entities;
////using DL.Contexts;
////using Microsoft.EntityFrameworkCore;
////using BL.IService;
////using DL.IRepositories;
////using AutoMapper;
////using BL.DTOs;
////namespace BL.Services
////{
////    //public class UserFileService
////    //{
////    //    private readonly VoiceSummarizerDbContext _context;

////    //    public UserFileService(VoiceSummarizerDbContext context)
////    //    {
////    //        _context = context;
////    //    }

////    //    public async Task<IEnumerable<UserFile>> GetAllAsync()
////    //    {
////    //        return await _context.Files.Include(f => f.User).Include(f => f.Category).ToListAsync();
////    //    }

////    //    public async Task<UserFile?> GetByIdAsync(int id)
////    //    {
////    //        return await _context.Files.Include(f => f.User).Include(f => f.Category)
////    //                                   .FirstOrDefaultAsync(f => f.Id == id);
////    //    }

////    //    public async Task<UserFile> CreateAsync(UserFile file)
////    //    {
////    //        _context.Files.Add(file);
////    //        await _context.SaveChangesAsync();
////    //        return file;
////    //    }

////    //    public async Task<bool> UpdateAsync(UserFile file)
////    //    {
////    //        var existingFile = await _context.Files.FindAsync(file.Id);
////    //        if (existingFile == null) return false;

////    //        _context.Entry(existingFile).CurrentValues.SetValues(file);
////    //        await _context.SaveChangesAsync();
////    //        return true;
////    //    }

////    //    public async Task<bool> DeleteAsync(int id)
////    //    {
////    //        var file = await _context.Files.FindAsync(id);
////    //        if (file == null) return false;

////    //        _context.Files.Remove(file);
////    //        await _context.SaveChangesAsync();
////    //        return true;
////    //    }
////    // }
////    //public class UserFileService : IUserFileService
////    //{
////    //    private readonly IUserFileRepository _fileRepository;
////    //    private readonly ISummaryRepository _summaryRepository;
////    //    private readonly IMapper _mapper;

////    //    public UserFileService(IUserFileRepository fileRepository, ISummaryRepository summaryRepository, IMapper mapper)
////    //    {
////    //        _fileRepository = fileRepository;
////    //        _summaryRepository = summaryRepository;
////    //        _mapper = mapper;
////    //    }

////    //    public async Task<UserFile> GetFileByIdAsync(int id)
////    //    {
////    //        return await _fileRepository.GetByIdAsync(id);
////    //    }

////    //    public async Task<IEnumerable<UserFile>> GetAllFilesAsync()
////    //    {
////    //        return await _fileRepository.GetAllAsync();
////    //    }

////    //    public async Task<UserFile> UploadFileAsync(UserFile file)
////    //    {
////    //        await _fileRepository.AddAsync(file);
////    //        return file;
////    //    }

////    //    public async Task UpdateFileAsync(UserFile file)
////    //    {
////    //        await _fileRepository.UpdateAsync(file);
////    //    }

////    //    public async Task DeleteFileAsync(int id)
////    //    {
////    //        await _fileRepository.DeleteAsync(id);
////    //    }

////    //    public async Task<Summary> GenerateSummaryAsync(int fileId)
////    //    {
////    //        //לבדוק אם כבר נוצר סיכום לקובץ – כדי לא ליצור כפילויות.

////    //        //לעדכן את סטטוס הקובץ(למשל: Status = FileStatus.Completed).
////    //        var summary = new Summary
////    //        {
////    //            FileId = fileId,
////    //            Content = "Summary content here..." // לדוגמה, יכול להיבנות ע"י AI או אלגוריתם
////    //        };
////    //        await _summaryRepository.AddAsync(summary);
////    //        return summary;
////    //    }
////    //}


////    //public class UserFileService : IUserFileService
////    //{
////    //    private readonly IUserFileRepository _fileRepository;
////    //    private readonly ISummaryRepository _summaryRepository;
////    //    private readonly IMapper _mapper;

////    //    public UserFileService(IUserFileRepository fileRepository, ISummaryRepository summaryRepository, IMapper mapper)
////    //    {
////    //        _fileRepository = fileRepository;
////    //        _summaryRepository = summaryRepository;
////    //        _mapper = mapper;
////    //    }

////    //    public async Task<UserFile> GetFileByIdAsync(int id)
////    //    {
////    //        return await _fileRepository.GetByIdAsync(id);
////    //    }

////    //    public async Task<IEnumerable<UserFile>> GetAllFilesAsync()
////    //    {
////    //        return await _fileRepository.GetAllAsync();
////    //    }

////    //    public async Task<UserFile> UploadFileAsync(UserFile file)
////    //    {
////    //        await _fileRepository.AddAsync(file);
////    //        return file;
////    //    }

////    //    public async Task UpdateFileAsync(UserFile file)
////    //    {
////    //        await _fileRepository.UpdateAsync(file);
////    //    }

////    //    public async Task DeleteFileAsync(int id)
////    //    {
////    //        await _fileRepository.DeleteAsync(id);
////    //    }

////    //    public async Task<Summary> GenerateSummaryAsync(int fileId)
////    //    {
////    //        // לבדוק אם כבר נוצר סיכום לקובץ – כדי לא ליצור כפילויות.
////    //        var existingSummary = await _summaryRepository.GetByFileIdAsync(fileId);
////    //        if (existingSummary != null)
////    //        {
////    //            return existingSummary; // אם כבר יש סיכום, מחזירים אותו.
////    //        }

////    //        // יצירת סיכום חדש אם לא קיים
////    //        var file = await _fileRepository.GetByIdAsync(fileId);
////    //        if (file == null)
////    //        {
////    //            throw new Exception("File not found"); // אם הקובץ לא נמצא
////    //        }

////    //        // יצירת סיכום חדש, לדוגמה על ידי AI או אלגוריתם אחר
////    //        var summary = new Summary
////    //        {
////    //            FileId = fileId,
////    //            Content = "Summary content here..." // תוכן הסיכום יכול להגיע מ-AI
////    //        };

////    //        // עדכון סטטוס הקובץ
////    //        file.Status = "Completed"; // לדוגמה, אם הסיכום נוצר, הסטטוס משתנה ל-Completed
////    //        await _fileRepository.UpdateAsync(file); // עדכון סטטוס הקובץ ב-db

////    //        // שמירה של הסיכום החדש
////    //        await _summaryRepository.AddAsync(summary);

////    //        return summary;
////    //    }

////    //    public async Task<Summary> UpdateSummaryAsync(int fileId, string content)
////    //    {
////    //        // עדכון סיכום ידני – אפשרות לשינוי תוכן הסיכום
////    //        var existingSummary = await _summaryRepository.GetByFileIdAsync(fileId);
////    //        if (existingSummary == null)
////    //        {
////    //            throw new Exception("Summary not found for this file");
////    //        }

////    //        existingSummary.Content = content;

////    //        await _summaryRepository.UpdateAsync(existingSummary); // עדכון הסיכום

////    //        return existingSummary;
////    //    }
////    //}





////    public class UserFileService : IUserFileService
////    {
////        private readonly MyDbContext _context;
////        private readonly IMapper _mapper;

////        public UserFileService(MyDbContext context, IMapper mapper)
////        {
////            _context = context;
////            _mapper = mapper;
////        }

////        public async Task<List<UserFileResponseDto>> GetAllAsync()
////        {
////            var files = await _context.UserFiles
////                .Include(f => f.User)
////                .Include(f => f.Category)
////                .Include(f => f.Summary)
////                .ToListAsync();

////            return files.Select(f => new UserFileResponseDto
////            {
////                Id = f.Id,
////                FileName = f.FileName,
////                FileType = f.FileType,
////                UploadDate = f.UploadDate,
////                Url = f.Url,
////                Status = f.Status,
////                UserName = f.User?.FullName ?? "",
////                CategoryName = f.Category?.Name ?? "",
////                SummaryId = f.Summary?.Id
////            }).ToList();
////        }

////        public async Task<UserFileResponseDto?> GetByIdAsync(int id)
////        {
////            var file = await _context.UserFiles
////                .Include(f => f.User)
////                .Include(f => f.Category)
////                .Include(f => f.Summary)
////                .FirstOrDefaultAsync(f => f.Id == id);

////            if (file == null) return null;

////            return new UserFileResponseDto
////            {
////                Id = file.Id,
////                FileName = file.FileName,
////                FileType = file.FileType,
////                UploadDate = file.UploadDate,
////                Url = file.Url,
////                Status = file.Status,
////                UserName = file.User?.FullName ?? "",
////                CategoryName = file.Category?.Name ?? "",
////                SummaryId = file.Summary?.Id
////            };
////        }

////        public async Task<UserFileResponseDto> AddAsync(UserFileCreateDto dto)
////        {
////            var file = _mapper.Map<UserFile>(dto);
////            _context.UserFiles.Add(file);
////            await _context.SaveChangesAsync();

////            return await GetByIdAsync(file.Id) ?? throw new Exception("Creation failed.");
////        }

////        public async Task<bool> UpdateAsync(int id, UserFileUpdateDto dto)
////        {
////            var file = await _context.UserFiles.FindAsync(id);
////            if (file == null) return false;

////            file.FileName = dto.FileName;
////            file.FileType = dto.FileType;
////            file.Url = dto.Url;
////            file.Status = dto.Status;
////            file.CategoryId = dto.CategoryId;

////            await _context.SaveChangesAsync();
////            return true;
////        }

////        public async Task<bool> DeleteAsync(int id)
////        {
////            var file = await _context.UserFiles.FindAsync(id);
////            if (file == null) return false;

////            _context.UserFiles.Remove(file);
////            await _context.SaveChangesAsync();
////            return true;
////        }
////    }

////}







//using AutoMapper;
//using BL.DTOs;
//using BL.IService;
//using DL.Entities;
//using DL.IRepositories;
//using System;
//using System.Collections.Generic;
//using System.Threading.Tasks;

//namespace BL.Services
//{
//    public class UserFileService : IUserFileService
//    {
//        private readonly IUserFileRepository _fileRepository;
//        private readonly ISummaryRepository _summaryRepository;
//        private readonly IMapper _mapper;

//        public UserFileService(
//            IUserFileRepository fileRepository,
//            ISummaryRepository summaryRepository,
//            IMapper mapper)
//        {
//            _fileRepository = fileRepository;
//            _summaryRepository = summaryRepository;
//            _mapper = mapper;
//        }

//        public async Task<IEnumerable<UserFileResponseDto>> GetAllAsync()
//        {
//            var files = await _fileRepository.GetAllWithIncludesAsync();
//            return _mapper.Map<IEnumerable<UserFileResponseDto>>(files);
//        }

//        public async Task<UserFileResponseDto?> GetByIdAsync(int id)
//        {
//            var file = await _fileRepository.GetByIdWithIncludesAsync(id);
//            return file == null ? null : _mapper.Map<UserFileResponseDto>(file);
//        }

//        public async Task<UserFileResponseDto> CreateAsync(UserFileCreateDto dto)
//        {
//            var entity = _mapper.Map<UserFile>(dto);
//            await _fileRepository.AddAsync(entity);
//            return _mapper.Map<UserFileResponseDto>(entity);
//        }

//        public async Task<bool> UpdateAsync(int id, UserFileUpdateDto dto)
//        {
//            var existing = await _fileRepository.GetByIdAsync(id);
//            if (existing == null) return false;

//            _mapper.Map(dto, existing);
//            await _fileRepository.UpdateAsync(existing);
//            return true;
//        }

//        public async Task<bool> DeleteAsync(int id)
//        {
//            var file = await _fileRepository.GetByIdAsync(id);
//            if (file == null) return false;

//            await _fileRepository.DeleteAsync(id);
//            return true;
//        }

//        public async Task<SummaryResponseDto?> GetSummaryForFileAsync(int fileId)
//        {
//            var summary = await _summaryRepository.GetByFileIdAsync(fileId);
//            return summary == null ? null : _mapper.Map<SummaryOutputDto>(summary);
//        }

//        public async Task<SummaryResponseDto> CreateSummaryForFileAsync(int fileId)
//        {
//            var existingSummary = await _summaryRepository.GetByFileIdAsync(fileId);
//            if (existingSummary != null)
//                return _mapper.Map<SummaryResponseDto>(existingSummary);

//            var file = await _fileRepository.GetByIdAsync(fileId);
//            if (file == null)
//                throw new Exception("File not found");

//            var summary = new Summary
//            {
//                FileId = fileId,
//                Content = "Summary generated by AI..."
//            };

//            file.Status = FileStatus.Completed;
//            await _fileRepository.UpdateAsync(file);
//            await _summaryRepository.AddAsync(summary);

//            return _mapper.Map<SummaryOutputDto>(summary);
//        }
//    }
//}











//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace BL.Services
//{
//    internal class UserFileService
//    {
//    }
//}
using DL.Entities;
using DL.Contexts;
using Microsoft.EntityFrameworkCore;
using BL.IService;
using DL.IRepositories;
using AutoMapper;
using BL.DTOs;
namespace BL.Services
{
    //public class UserFileService
    //{
    //    private readonly VoiceSummarizerDbContext _context;

    //    public UserFileService(VoiceSummarizerDbContext context)
    //    {
    //        _context = context;
    //    }

    //    public async Task<IEnumerable<UserFile>> GetAllAsync()
    //    {
    //        return await _context.Files.Include(f => f.User).Include(f => f.Category).ToListAsync();
    //    }

    //    public async Task<UserFile?> GetByIdAsync(int id)
    //    {
    //        return await _context.Files.Include(f => f.User).Include(f => f.Category)
    //                                   .FirstOrDefaultAsync(f => f.Id == id);
    //    }

    //    public async Task<UserFile> CreateAsync(UserFile file)
    //    {
    //        _context.Files.Add(file);
    //        await _context.SaveChangesAsync();
    //        return file;
    //    }

    //    public async Task<bool> UpdateAsync(UserFile file)
    //    {
    //        var existingFile = await _context.Files.FindAsync(file.Id);
    //        if (existingFile == null) return false;

    //        _context.Entry(existingFile).CurrentValues.SetValues(file);
    //        await _context.SaveChangesAsync();
    //        return true;
    //    }

    //    public async Task<bool> DeleteAsync(int id)
    //    {
    //        var file = await _context.Files.FindAsync(id);
    //        if (file == null) return false;

    //        _context.Files.Remove(file);
    //        await _context.SaveChangesAsync();
    //        return true;
    //    }
    // }
    public class UserFileService : IUserFileService
    {
        private readonly IUserFileRepository _fileRepository;
        private readonly ISummaryRepository _summaryRepository;
        private readonly IMapper _mapper;

        public UserFileService(IUserFileRepository fileRepository, ISummaryRepository summaryRepository,IMapper mapper)
        {
            _fileRepository = fileRepository;
            _summaryRepository = summaryRepository;
            _mapper=mapper;
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

        public async Task<UserFileResponseDto> UploadFileAsync(UserFileCreateDto createDto)
        {
          
            var file = _mapper.Map<UserFile>(createDto);
            await _fileRepository.AddAsync(file);
            return _mapper.Map<UserFileResponseDto>(file);
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

        public async Task<SummaryResponseDto> GenerateSummaryAsync(int fileId)
        {
            //לבדוק אם כבר נוצר סיכום לקובץ – כדי לא ליצור כפילויות.

            //לעדכן את סטטוס הקובץ(למשל: Status = FileStatus.Completed).
            var summary = new Summary
            {
                FileId = fileId,
                Content = "Summary content here..." // לדוגמה, יכול להיבנות ע"י AI או אלגוריתם
            };
            await _summaryRepository.AddAsync(summary);
            return _mapper.Map<SummaryResponseDto>(summary);
        }
    }

}


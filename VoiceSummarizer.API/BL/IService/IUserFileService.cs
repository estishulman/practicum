////using BL.DTOs;
////using DL.Entities;
////using System;
////using System.Collections.Generic;
////using System.Linq;
////using System.Text;
////using System.Threading.Tasks;

////namespace BL.IService
////{
////    //public interface IUserFileService
////    //{
////    //    Task<UserFileResponseDto> GetFileByIdAsync(int id);
////    //    Task<IEnumerable<UserFileResponseDto>> GetAllFilesAsync();
////    //    Task<UserFileResponseDto> UploadFileAsync(UserCreateDto file);
////    //    Task UpdateFileAsync(UserCreateDto file);
////    //    Task DeleteFileAsync(int id);
////    //    Task<SummaryResponseDto> GenerateSummaryAsync(int fileId);
////    //}
////    public interface IUserFileService
////    {
////        Task<List<UserFileResponseDto>> GetAllAsync();
////        Task<UserFileResponseDto?> GetByIdAsync(int id);
////        Task<UserFileResponseDto> AddAsync(UserFileCreateDto dto);
////        Task<bool> UpdateAsync(int id, UserFileUpdateDto dto);
////        Task<bool> DeleteAsync(int id);
////    }

////}


//using BL.DTOs;
//using System.Collections.Generic;
//using System.Threading.Tasks;

//namespace BL.IService
//{
//    public interface IUserFileService
//    {
//        Task<IEnumerable<UserFileResponseDto>> GetAllAsync();
//        Task<UserFileResponseDto?> GetByIdAsync(int id);
//        Task<UserFileResponseDto> CreateAsync(UserFileCreateDto dto);
//        Task<bool> UpdateAsync(int id, UserFileUpdateDto dto);
//        Task<bool> DeleteAsync(int id);
//        Task<SummaryResponseDto?> GetSummaryForFileAsync(int fileId);
//        Task<SummaryResponseDto> CreateSummaryForFileAsync(int fileId);
//    }
//}








using DL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BL.DTOs;

namespace BL.IService
{
    public interface IUserFileService
    {
        Task<UserFileResponseDto> GetFileByIdAsync(int id);
        Task<IEnumerable<UserFileResponseDto>> GetAllFilesAsync();
        Task<UserFileResponseDto> UploadFileAsync(UserFileCreateDto file);
        Task UpdateFileAsync(int id,UserFileUpdateDto file);
        Task DeleteFileAsync(int id);
        Task<SummaryResponseDto> GenerateSummaryAsync(int fileId);
    }

}


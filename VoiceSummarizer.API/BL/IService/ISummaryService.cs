using BL.DTOs;
using DL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.IService
{
    public interface ISummaryService
    {
        Task<SummaryResponseDto> GetSummaryByIdAsync(int id);
        Task<IEnumerable<SummaryResponseDto>> GetAllSummariesAsync();
        Task<SummaryResponseDto> CreateSummaryAsync(SummaryCreateDto summary);
        Task UpdateSummaryAsync(int id,SummaryUpdateDto summary);
        Task DeleteSummaryAsync(int id);
    }

}

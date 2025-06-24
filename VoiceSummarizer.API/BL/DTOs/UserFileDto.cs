using DL.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.DTOs
{
 
    public class UserFileResponseDto
    {
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public DateTime UploadDate { get; set; }
        public string? Url { get; set; }
        public FileStatus Status { get; set; }

        public string UserName { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public int? SummaryId { get; set; }
        public string? SummaryContent { get; set; }

    }

    //public class UserFileCreateDto
    //{
    //    [Required]
    //    public string FileName { get; set; } = string.Empty;
    //    public string FileType { get; set; } = string.Empty;
    //    public int CategoryId { get; set; }
    //    [Required]
    //    public int UserId { get; set; }
    //}
    public class UserFileCreateDto
    {
        public string FileName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public string? Url { get; set; }
        public int UserId { get; set; }
        public int CategoryId { get; set; }
    }
    public class UserFileUpdateDto
    {
        public string FileName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public string? Url { get; set; }
        public FileStatus Status { get; set; }
        public int CategoryId { get; set; }
    }

}

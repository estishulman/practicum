using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace DL.Entities
{
    public class UserFile
    {
        public int Id { get; set; }

        [Required]
        public string FileName { get; set; } = string.Empty;

        public string FileType { get; set; } = string.Empty;

        public DateTime UploadDate { get; set; } = DateTime.UtcNow;

        public string? Url { get; set; }

        public FileStatus Status { get; set; } = FileStatus.Pending;

        public int UserId { get; set; }
        [JsonIgnore] // מונע רינדור לולאה אינסופית
        public User? User { get; set; }

        public int? SummaryId { get; set; }

        public Summary? Summary { get; set; }

        public int CategoryId { get; set; }
        public Category? Category { get; set; }

    }

    public enum FileStatus
    {
        Pending,
        Processing,
        Completed,
        Failed
    }

}

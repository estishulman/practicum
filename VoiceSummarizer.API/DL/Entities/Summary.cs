using System.ComponentModel.DataAnnotations;

namespace DL.Entities
{
    public class Summary
    {
        public int Id { get; set; }

        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string Language { get; set; } = "he"; // אפשר גם enum אם רוצים

        public int FileId { get; set; }
        public UserFile? File { get; set; }
    }

}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.DTOs
{
    //public class SummaryResponseDto
    //{
    //    public int Id { get; set; }
    //    public string Content { get; set; } = string.Empty;
    //    public DateTime CreatedAt { get; set; }
    //    public string Language { get; set; } = "he";
    //    public int FileId { get; set; }
    //}

    //public class SummaryCreateDto
    //{
    //    [Required]
    //    public string Content { get; set; } = string.Empty;
    //    public string Language { get; set; } = "he";
    //    [Required]
    //    public int FileId { get; set; }
    //}


    public class SummaryResponseDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string Language { get; set; } = "he";
        public int FileId { get; set; }
    }


    public class SummaryCreateDto
    {
        public string Content { get; set; } = string.Empty; // לא חובה – כי לפעמים זה יבוא מה-AI
        public string Language { get; set; } = "he";
        [Required]
        public int UserFileId { get; set; }
    }

    public class SummaryUpdateDto
    {
        [Required]
        public string Content { get; set; } = string.Empty;

        public string Language { get; set; } = "he";
    }


}




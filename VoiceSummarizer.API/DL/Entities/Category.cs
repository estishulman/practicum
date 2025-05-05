using System.ComponentModel.DataAnnotations;

namespace DL.Entities
{
    public class Category
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;

        public ICollection<UserFile> Files { get; set; } = new List<UserFile>();

    }

}
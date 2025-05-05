using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace DL.Entities
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public Role Role { get; set; } = Role.Regular; // 👈 הוספנו תפקיד
        [JsonIgnore]
        public List<UserFile> Files { get; set; } = new();
    }

    public enum Role
    {
        Admin,
        Regular
    }

}

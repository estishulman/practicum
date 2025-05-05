using Microsoft.EntityFrameworkCore;
using DL.Entities;  // כאן תייבא את המודלים שלך

namespace DL.Contexts
{
    public class VoiceSummarizerDbContext : DbContext
    {
        public VoiceSummarizerDbContext(DbContextOptions<VoiceSummarizerDbContext> options)
            : base(options) { }

        // הגדרת ה-DbSets (טבלאות) שלך
        public DbSet<User> Users { get; set; }
        public DbSet<UserFile> Files { get; set; }
        public DbSet<Summary> Summaries { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserFile>()
                .HasOne(f => f.Category)
                .WithMany(c => c.Files)
                .HasForeignKey(f => f.CategoryId)
                .OnDelete(DeleteBehavior.Restrict); // כדי לא למחוק קבצים אם קטגוריה נמחקת

            modelBuilder.Entity<UserFile>()
                .HasOne(f => f.User)
                .WithMany(u => u.Files)
                .HasForeignKey(f => f.UserId);

            modelBuilder.Entity<Summary>()
                .HasOne(s => s.File)
                .WithOne(f => f.Summary)
                .HasForeignKey<Summary>(s => s.FileId);

            modelBuilder.Entity<UserFile>()
               .HasIndex(f => f.CategoryId);

            modelBuilder.Entity<UserFile>()
               .HasIndex(f => f.UserId);
        }
    }
}

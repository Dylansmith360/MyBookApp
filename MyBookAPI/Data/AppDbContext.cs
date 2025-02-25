using Microsoft.EntityFrameworkCore;
using MyBookAPI.Models;

namespace MyBookAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Review> Reviews { get; set; }
    }
}
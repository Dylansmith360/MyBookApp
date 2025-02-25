using System.ComponentModel.DataAnnotations;

namespace MyBookAPI.Models
{
    public class Review
    {
        [Key]
        public int Id { get; set; }
        public required string BookId { get; set; } // Google Books ID
        public required string Reviewer { get; set; } // Reviewer's name
        public required string Comment { get; set; } // Updated to match the database column name
        public int Rating { get; set; } // 1-5 stars
    }
}
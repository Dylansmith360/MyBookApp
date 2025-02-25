using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyBookAPI.Data;
using MyBookAPI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace MyBookAPI.Controllers
{
    [ApiController]
    [Route("api/reviews")]  // Base URL: /api/reviews
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ReviewsController> _logger;

        public ReviewsController(AppDbContext context, ILogger<ReviewsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET /api/reviews/{bookId} - Fetch reviews for a specific book
        [HttpGet("{bookId}")]
        public IActionResult GetReviews(string bookId)
        {
            _logger.LogInformation($"Fetching reviews for book ID: {bookId}");
            var reviews = _context.Reviews.Where(r => r.BookId == bookId).ToList();
            _logger.LogInformation($"Fetched {reviews.Count} reviews for book ID: {bookId}");
            return Ok(reviews);
        }

        // POST /api/reviews - Add a new review
        [HttpPost]
        public IActionResult AddReview([FromBody] Review review)
        {
            if (review == null)
            {
                _logger.LogWarning("Review is null.");
                return BadRequest("Review is null.");
            }

            _logger.LogInformation($"Adding review for book ID: {review.BookId}");
            _context.Reviews.Add(review);
            _context.SaveChanges();
            _logger.LogInformation($"Added review with ID: {review.Id} for book ID: {review.BookId}");
            return CreatedAtAction(nameof(GetReviews), new { bookId = review.BookId }, review);
        }
    }
}
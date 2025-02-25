using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

namespace MyBookAPI.Controllers
{
    [ApiController]
    [Route("api/books")]
    public class BooksController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<BooksController> _logger;
        private readonly string _apiKey;

        public BooksController(IHttpClientFactory httpClientFactory, ILogger<BooksController> logger, IConfiguration configuration)
        {
            _httpClient = httpClientFactory.CreateClient();
            _logger = logger;
            _apiKey = configuration["GoogleBooksApiKey"] ?? throw new ArgumentNullException(nameof(configuration), "GoogleBooksApiKey is not configured.");
        }

        [HttpGet]
        public async Task<IActionResult> SearchBooks([FromQuery] string query, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (string.IsNullOrEmpty(query))
            {
                _logger.LogWarning("Query parameter is required");
                return BadRequest("Query parameter is required");
            }

            int startIndex = (page - 1) * pageSize;
            string url = $"https://www.googleapis.com/books/v1/volumes?q={query}&startIndex={startIndex}&maxResults={pageSize}&key={_apiKey}";

            try
            {
                _logger.LogInformation($"Fetching books from: {url}");
                var response = await _httpClient.GetStringAsync(url);
                _logger.LogInformation($"Response received: {response.Substring(0, Math.Min(response.Length, 100))}...");
                return Content(response, "application/json");
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Failed to fetch books from Google Books API");
                return StatusCode(500, "Failed to fetch books from Google Books API");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBook(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                _logger.LogWarning("Book ID is required");
                return BadRequest("Book ID is required");
            }

            try
            {
                string url = $"https://www.googleapis.com/books/v1/volumes/{id}?key={_apiKey}";
                _logger.LogInformation($"Fetching book details from: {url}");

                var response = await _httpClient.GetStringAsync(url);
                _logger.LogInformation($"Google Books API Response Status: {response}");
                return Content(response, "application/json");
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError($"Network error fetching book {id}: {ex.Message}");
                return StatusCode(500, $"Failed to fetch book details: {ex.Message}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Unexpected error fetching book {id}: {ex.Message}");
                return StatusCode(500, "An unexpected error occurred");
            }
        }
    }
}
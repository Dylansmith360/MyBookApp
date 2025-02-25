# MyBookAPI

## Setup & Run

1. Open the solution in Visual Studio or VS Code.
2. Restore NuGet packages:
   ```
   dotnet restore
   ```
3. Run the database migrations (if using EF Core):
   ```
   dotnet ef database update
   ```
4. Launch the API:
   ```
   dotnet run
   ```
5. Verify the endpoints:
   - GET /api/books?query={term}&page={number}&pageSize={number}
   - GET /api/reviews/{bookId}
   - POST /api/reviews

namespace Lab3.AuthCrud.Dtos;

public record TaskRequest(string Title, string? Description, bool IsCompleted, int UserId);
public record TaskResponse(int Id, string Title, string Description, bool IsCompleted, DateTime CreatedAt, int UserId);

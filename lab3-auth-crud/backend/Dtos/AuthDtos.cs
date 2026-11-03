namespace Lab3.AuthCrud.Dtos;

public record RegisterRequest(string Email, string Password, string ConfirmPassword);
public record LoginRequest(string Email, string Password);
public record UserResponse(int Id, string Email, DateTime CreatedAt);
public record AuthResponse(UserResponse User, string Message);

using Lab3.AuthCrud.Data;
using Lab3.AuthCrud.Dtos;
using Lab3.AuthCrud.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lab3.AuthCrud.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AppDbContext db, IPasswordHasher<User> passwordHasher) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(email) || !email.Contains('@'))
            return BadRequest(new { message = "Email không hợp lệ." });
        if (request.Password.Length < 6)
            return BadRequest(new { message = "Mật khẩu phải có ít nhất 6 ký tự." });
        if (request.Password != request.ConfirmPassword)
            return BadRequest(new { message = "Mật khẩu xác nhận không khớp." });
        if (await db.Users.AnyAsync(user => user.Email == email))
            return Conflict(new { message = "Email đã được đăng ký." });

        var user = new User { Email = email };
        user.PasswordHash = passwordHasher.HashPassword(user, request.Password);
        db.Users.Add(user);
        await db.SaveChangesAsync();

        return Ok(new AuthResponse(ToResponse(user), "Đăng ký thành công."));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await db.Users.SingleOrDefaultAsync(item => item.Email == email);
        if (user is null || passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password)
            == PasswordVerificationResult.Failed)
            return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });

        return Ok(new AuthResponse(ToResponse(user), "Đăng nhập thành công."));
    }

    private static UserResponse ToResponse(User user) => new(user.Id, user.Email, user.CreatedAt);
}

using Lab3.AuthCrud.Data;
using Lab3.AuthCrud.Dtos;
using Lab3.AuthCrud.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lab3.AuthCrud.Controllers;

[ApiController]
[Route("api/tasks")]
public class TasksController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskResponse>>> GetAll([FromQuery] int userId)
    {
        var tasks = await db.Tasks.AsNoTracking()
            .Where(task => task.UserId == userId)
            .OrderByDescending(task => task.CreatedAt)
            .Select(task => new TaskResponse(task.Id, task.Title, task.Description, task.IsCompleted, task.CreatedAt, task.UserId))
            .ToListAsync();
        return Ok(tasks);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TaskResponse>> GetById(int id, [FromQuery] int userId)
    {
        var task = await db.Tasks.AsNoTracking().SingleOrDefaultAsync(item => item.Id == id && item.UserId == userId);
        return task is null ? NotFound(new { message = "Không tìm thấy công việc." }) : Ok(ToResponse(task));
    }

    [HttpPost]
    public async Task<ActionResult<TaskResponse>> Create(TaskRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            return BadRequest(new { message = "Tiêu đề không được để trống." });
        if (!await db.Users.AnyAsync(user => user.Id == request.UserId))
            return NotFound(new { message = "Người dùng không tồn tại." });

        var task = new TaskItem
        {
            Title = request.Title.Trim(),
            Description = request.Description?.Trim() ?? string.Empty,
            IsCompleted = request.IsCompleted,
            UserId = request.UserId
        };
        db.Tasks.Add(task);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = task.Id, userId = task.UserId }, ToResponse(task));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TaskResponse>> Update(int id, TaskRequest request)
    {
        var task = await db.Tasks.SingleOrDefaultAsync(item => item.Id == id && item.UserId == request.UserId);
        if (task is null) return NotFound(new { message = "Không tìm thấy công việc." });
        if (string.IsNullOrWhiteSpace(request.Title)) return BadRequest(new { message = "Tiêu đề không được để trống." });

        task.Title = request.Title.Trim();
        task.Description = request.Description?.Trim() ?? string.Empty;
        task.IsCompleted = request.IsCompleted;
        await db.SaveChangesAsync();
        return Ok(ToResponse(task));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, [FromQuery] int userId)
    {
        var task = await db.Tasks.SingleOrDefaultAsync(item => item.Id == id && item.UserId == userId);
        if (task is null) return NotFound(new { message = "Không tìm thấy công việc." });
        db.Tasks.Remove(task);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static TaskResponse ToResponse(TaskItem task) =>
        new(task.Id, task.Title, task.Description, task.IsCompleted, task.CreatedAt, task.UserId);
}

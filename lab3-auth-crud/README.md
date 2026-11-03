# Lab 3 — Authentication + CRUD

Bài thực hành kết hợp yêu cầu bài 1 và bài 2:

- React đăng ký/đăng nhập, kiểm tra dữ liệu đầu vào.
- ASP.NET Core Web API với endpoint POST/GET/PUT/DELETE.
- EF Core + SQLite, quan hệ User–Task và migration.
- React Context + localStorage lưu user sau khi đăng nhập thành công.

## Chạy nhanh bằng Docker

```bash
docker compose up
```

- Frontend: http://localhost:5173
- API/Swagger: http://localhost:5000/swagger

## Chạy riêng

```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run --urls http://localhost:5000
```

```bash
cd frontend
npm install
npm run dev
```

## API chính

| Method | Endpoint | Mục đích |
| --- | --- | --- |
| POST | `/api/auth/register` | Tạo tài khoản, hash mật khẩu |
| POST | `/api/auth/login` | Kiểm tra email/mật khẩu |
| GET | `/api/tasks?userId={id}` | Lấy danh sách task của user |
| POST | `/api/tasks` | Tạo task |
| PUT | `/api/tasks/{id}` | Cập nhật task |
| DELETE | `/api/tasks/{id}?userId={id}` | Xóa task |

> Phạm vi lab dùng `userId` để minh họa luồng frontend–backend. Khi triển khai thật cần thay bằng JWT/ASP.NET Core Identity authorization.

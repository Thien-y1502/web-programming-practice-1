import { useState } from 'react';
import { authApi } from './api';
import { useAuth } from './AuthContext';
import Dashboard from './Dashboard';

function validateAuth(form, mode) {
  const errors = {};
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Email không hợp lệ.';
  if (form.password.length < 6) errors.password = 'Mật khẩu cần ít nhất 6 ký tự.';
  if (mode === 'register' && form.password !== form.confirmPassword) errors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
  return errors;
}

export default function App() {
  const { user, login } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Dashboard />;

  const onChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validateAuth(form, mode);
    setErrors(nextErrors); setMessage('');
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    try {
      const result = mode === 'login' ? await authApi.login(form) : await authApi.register(form);
      login(result.user); setMessage(result.message);
    } catch (error) { setMessage(error.message); }
    finally { setLoading(false); }
  };

  return <main className="auth-shell"><section className="auth-card">
    <div className="brand-mark">L3</div><p className="eyebrow">WEB PROGRAMMING · LAB 3</p>
    <h1>{mode === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}</h1>
    <p className="muted">{mode === 'login' ? 'Đăng nhập để quản lý công việc của bạn.' : 'Thông tin sẽ được kiểm tra và lưu vào database.'}</p>
    <form onSubmit={submit} noValidate>
      <label>Email<input name="email" value={form.email} onChange={onChange} placeholder="you@example.com" autoComplete="email" />{errors.email && <small>{errors.email}</small>}</label>
      <label>Mật khẩu<input type="password" name="password" value={form.password} onChange={onChange} placeholder="Tối thiểu 6 ký tự" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />{errors.password && <small>{errors.password}</small>}</label>
      {mode === 'register' && <label>Xác nhận mật khẩu<input type="password" name="confirmPassword" value={form.confirmPassword} onChange={onChange} placeholder="Nhập lại mật khẩu" autoComplete="new-password" />{errors.confirmPassword && <small>{errors.confirmPassword}</small>}</label>}
      {message && <div className="notice">{message}</div>}
      <button disabled={loading}>{loading ? 'Đang xử lý…' : mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</button>
    </form>
    <button className="link-button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrors({}); setMessage(''); }}>
      {mode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
    </button>
  </section></main>;
}

import { useEffect, useState } from 'react';
import { taskApi } from './api';
import { useAuth } from './AuthContext';

const blank = { title: '', description: '', isCompleted: false };

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => { setLoading(true); try { setTasks(await taskApi.list(user.id)); } catch (e) { setMessage(e.message); } finally { setLoading(false); } };
  useEffect(() => { loadTasks(); }, [user.id]);

  const submit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) { setMessage('Tiêu đề không được để trống.'); return; }
    try {
      const payload = { ...form, userId: user.id };
      if (editingId) await taskApi.update(editingId, payload); else await taskApi.create(payload);
      setForm(blank); setEditingId(null); setMessage('Đã lưu thay đổi.'); await loadTasks();
    } catch (e) { setMessage(e.message); }
  };
  const edit = (task) => { setEditingId(task.id); setForm({ title: task.title, description: task.description, isCompleted: task.isCompleted }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const remove = async (id) => { if (!window.confirm('Xóa công việc này?')) return; try { await taskApi.remove(id, user.id); setMessage('Đã xóa công việc.'); await loadTasks(); } catch (e) { setMessage(e.message); } };

  return <main className="dashboard-shell"><header className="topbar"><div><p className="eyebrow">LAB 3 · TASK MANAGER</p><h1>Xin chào, {user.email}</h1></div><button className="ghost" onClick={logout}>Đăng xuất</button></header>
    <section className="content-grid"><form className="task-form panel" onSubmit={submit}><div className="panel-heading"><div><p className="eyebrow">CRUD FORM</p><h2>{editingId ? 'Chỉnh sửa công việc' : 'Thêm công việc'}</h2></div>{editingId && <button type="button" className="ghost" onClick={() => { setEditingId(null); setForm(blank); }}>Hủy</button>}</div>
      <label>Tiêu đề<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength="120" placeholder="Ví dụ: Hoàn thành báo cáo lab" /></label>
      <label>Mô tả<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="5" placeholder="Ghi chú thêm…" /></label>
      <label className="check-row"><input type="checkbox" checked={form.isCompleted} onChange={(e) => setForm({ ...form, isCompleted: e.target.checked })} /> Đã hoàn thành</label>
      <button>{editingId ? 'Cập nhật' : 'Thêm công việc'}</button>{message && <div className="notice">{message}</div>}
    </form><section className="panel"><div className="panel-heading"><div><p className="eyebrow">DATABASE RECORDS</p><h2>Công việc của tôi</h2></div><span className="count">{tasks.length}</span></div>
      {loading ? <p className="muted">Đang tải…</p> : tasks.length === 0 ? <div className="empty"><strong>Chưa có công việc</strong><span>Thêm công việc đầu tiên bằng biểu mẫu bên trái.</span></div> : <div className="task-list">{tasks.map((task) => <article className={`task ${task.isCompleted ? 'done' : ''}`} key={task.id}><div><h3>{task.title}</h3>{task.description && <p>{task.description}</p>}<span className="status">{task.isCompleted ? 'Đã hoàn thành' : 'Đang thực hiện'}</span></div><div className="task-actions"><button className="icon-button" onClick={() => edit(task)}>Sửa</button><button className="icon-button danger" onClick={() => remove(task.id)}>Xóa</button></div></article>)}</div>}
    </section></section><footer>React Context + localStorage · ASP.NET Core API · EF Core + SQLite</footer></main>;
}

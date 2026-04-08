import { useState, useEffect } from 'react';
import { AddEventForm } from '../components/AddEventForm';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Trash2, LogOut } from 'lucide-react';

export function Admin() {
  const [isAuthenticated, setIsAuth] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(true);
  
  // Login states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Events state
  const [events, setEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuth(true);
    }
    setTokenLoading(false);
  }, []);

  const loadEvents = async () => {
    setEventsLoading(true);
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadEvents();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Error en autenticación');
      }

      localStorage.setItem('token', data.token);
      setIsAuth(true);
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este evento?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/events?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        loadEvents();
      } else {
        alert('Error al eliminar evento');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (tokenLoading) return <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}></div>;

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6', padding: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', maxWidth: '400px', width: '100%' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1A2E6C', textAlign: 'center', marginBottom: '8px' }}>Admin Login</h2>
            <p style={{ color: '#6B7280', textAlign: 'center', fontSize: '14px', marginBottom: '24px' }}>Acceso exclusivo para administradores de Ezer</p>
            
            {loginError && (
              <div style={{ backgroundColor: '#FEF2F2', color: '#991B1B', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '6px' }}>Usuario</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB' }} 
                  required 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '6px' }}>Contraseña</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB' }} 
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={loginLoading}
                style={{ 
                  marginTop: '8px',
                  backgroundColor: '#1A2E6C', 
                  color: 'white', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  fontWeight: 700, 
                  border: 'none', 
                  cursor: loginLoading ? 'not-allowed' : 'pointer',
                  opacity: loginLoading ? 0.7 : 1,
                  width: '100%'
                }}
              >
                {loginLoading ? 'Ingresando...' : 'Iniciar Sesión'}
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      
      <div style={{ flex: 1, backgroundColor: '#FFFFFF' }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h1 style={{ color: '#1A2E6C', fontWeight: 800, fontSize: '32px' }}>Panel de Control (Eventos)</h1>
            <button 
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              <LogOut size={16} /> Cerrar Sesión
            </button>
          </div>

          <AddEventForm onEventAdded={loadEvents} />

          <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1A2E6C', marginBottom: '16px' }}>Eventos Actuales</h3>
          
          {eventsLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Cargando eventos...</div>
          ) : (
            <div style={{ border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ backgroundColor: '#F9FAFB' }}>
                  <tr>
                    <th style={{ padding: '12px 16px', color: '#4B5563', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid #E5E7EB' }}>Título</th>
                    <th style={{ padding: '12px 16px', color: '#4B5563', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid #E5E7EB' }}>Fecha</th>
                    <th style={{ padding: '12px 16px', color: '#4B5563', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid #E5E7EB' }}>Empresa</th>
                    <th style={{ padding: '12px 16px', color: '#4B5563', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid #E5E7EB', width: '80px', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '16px', color: '#111827', fontSize: '14px', fontWeight: 500 }}>{event.title}</td>
                      <td style={{ padding: '16px', color: '#4B5563', fontSize: '14px' }}>{event.date}</td>
                      <td style={{ padding: '16px', color: '#4B5563', fontSize: '14px' }}>{event.company}</td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <button 
                          onClick={() => handleDelete(event.id)}
                          style={{ backgroundColor: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                          title="Eliminar evento"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {events.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: '#6B7280' }}>
                        No hay eventos registrados en la base de datos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

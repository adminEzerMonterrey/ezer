import { useState, useEffect } from 'react';
import { AddEventForm } from '../components/AddEventForm';
import { EditEventForm } from '../components/EditEventForm';
import { AddPartnerForm } from '../components/AddPartnerForm';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Trash2, LogOut, Pencil, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { supabase } from '../../supabaseClient';

export function Admin() {
  const [isAuthenticated, setIsAuth] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(true);
  
  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Events state
  const [events, setEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  
  // Partners state
  const [partners, setPartners] = useState<any[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(false);

  // Export state
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState('');

  // Tabs state
  const [activeTab, setActiveTab] = useState<'eventos' | 'aliados'>('eventos');

  // Edit Modal State
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) setIsAuth(true);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setTokenLoading(false);
      }
    };
    checkSession();
  }, []);

  const loadEvents = async () => {
    setEventsLoading(true);
    try {
      const { data, error } = await supabase.from('events').select('*');
      if (error) throw error;
      if (data) {
        setEvents(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEventsLoading(false);
    }
  };

  const loadPartners = async () => {
    setPartnersLoading(true);
    try {
      const { data, error } = await supabase.from('partners').select('*');
      if (error) throw error;
      if (data) setPartners(data);
    } catch (e) {
      console.error(e);
    } finally {
      setPartnersLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadEvents();
      loadPartners();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      await supabase.auth.signInWithPassword({
        email,
        password
      });
      setIsAuth(true);
    } catch (error: any) {
      setLoginError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuth(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este evento?')) return;
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Error al eliminar evento: ' + error.message);
      } else {
        loadEvents();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePartner = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar esta empresa aliada?')) return;
    try {
      const { error } = await supabase.from('partners').delete().eq('id', id);
      if (error) {
        alert('Error al eliminar empresa: ' + error.message);
      } else {
        loadPartners();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportInterestLeads = async () => {
    setExportLoading(true);
    setExportError('');

    try {
      const response = await fetch('/api/export-interest-leads');

      if (!response.ok) {
        let message = 'No se pudo exportar el archivo.';

        try {
          const errorData = await response.json();
          message = errorData.message || message;
        } catch {
          // Ignorar respuesta no JSON.
        }

        throw new Error(message);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const contentDisposition = response.headers.get('Content-Disposition');
      const fileNameMatch = contentDisposition?.match(/filename="(.+)"/);
      const fallbackDate = new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
        .format(new Date())
        .replace(/\//g, '-');
      const fileName = fileNameMatch?.[1] || `Voluntarios - ${fallbackDate}.xlsx`;

      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error: any) {
      setExportError(error.message || 'No se pudo exportar el Excel.');
    } finally {
      setExportLoading(false);
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
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '6px' }}>Correo Electrónico</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
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
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={handleExportInterestLeads}
                disabled={exportLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: exportLoading ? '#CBD5E1' : '#1A2E6C',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: exportLoading ? 'not-allowed' : 'pointer'
                }}
              >
                <Download size={16} /> {exportLoading ? 'Exportando...' : 'Exportar leads'}
              </button>
              <button 
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
              >
                <LogOut size={16} /> Cerrar Sesión
              </button>
            </div>
          </div>

          {exportError && (
            <div style={{ backgroundColor: '#FEF2F2', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '20px' }}>
              {exportError}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            <button 
              onClick={() => setActiveTab('eventos')}
              style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', backgroundColor: activeTab === 'eventos' ? '#1A2E6C' : '#E5E7EB', color: activeTab === 'eventos' ? 'white' : '#4B5563', transition: 'all 0.2s' }}
            >
              Eventos
            </button>
            <button 
              onClick={() => setActiveTab('aliados')}
              style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', backgroundColor: activeTab === 'aliados' ? '#1A2E6C' : '#E5E7EB', color: activeTab === 'aliados' ? 'white' : '#4B5563', transition: 'all 0.2s' }}
            >
              Empresas Aliadas
            </button>
          </div>

          {activeTab === 'eventos' ? (
            <>
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
                        <th style={{ padding: '12px 16px', color: '#4B5563', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid #E5E7EB', width: '80px', textAlign: 'center' }}>Imagen</th>
                        <th style={{ padding: '12px 16px', color: '#4B5563', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid #E5E7EB', width: '80px', textAlign: 'center' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => (
                        <tr key={event.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                          <td style={{ padding: '16px', color: '#111827', fontSize: '14px', fontWeight: 500 }}>{event.name || event.title}</td>
                          <td style={{ padding: '16px', color: '#4B5563', fontSize: '14px' }}>{event.date || event.event_date}</td>
                          <td style={{ padding: '16px', color: '#4B5563', fontSize: '14px' }}>{event.company}</td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            {event.image_url ? (
                              <img 
                                src={event.image_url} 
                                alt={event.title || event.name}
                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                              />
                            ) : (
                              <div style={{ width: '60px', height: '60px', backgroundColor: '#E5E7EB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#6B7280' }}>
                                Sin imagen
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <button 
                              onClick={() => {
                                setEditingEvent(event);
                                setIsEditDialogOpen(true);
                              }}
                              style={{ backgroundColor: 'transparent', border: 'none', color: '#3B82F6', cursor: 'pointer', padding: '4px', marginRight: '8px' }}
                              title="Editar evento"
                            >
                              <Pencil size={18} />
                            </button>
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
                          <td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: '#6B7280' }}>
                            No hay eventos registrados en la base de datos.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <>
              <AddPartnerForm onPartnerAdded={loadPartners} />

              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1A2E6C', marginBottom: '16px' }}>Empresas Aliadas Actuales</h3>
              
              {partnersLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Cargando aliados...</div>
              ) : (
                <div style={{ border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#F9FAFB' }}>
                      <tr>
                        <th style={{ padding: '12px 16px', color: '#4B5563', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid #E5E7EB' }}>Nombre</th>
                        <th style={{ padding: '12px 16px', color: '#4B5563', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid #E5E7EB', width: '100px', textAlign: 'center' }}>Logo</th>
                        <th style={{ padding: '12px 16px', color: '#4B5563', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid #E5E7EB', width: '80px', textAlign: 'center' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partners.map((partner) => (
                        <tr key={partner.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                          <td style={{ padding: '16px', color: '#111827', fontSize: '14px', fontWeight: 500 }}>{partner.name}</td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            {partner.logo_url ? (
                              <img 
                                src={partner.logo_url} 
                                alt={partner.name}
                                style={{ width: '80px', height: '40px', objectFit: 'contain', borderRadius: '4px' }}
                              />
                            ) : (
                              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Sin logo</span>
                            )}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <button 
                              onClick={() => handleDeletePartner(partner.id)}
                              style={{ backgroundColor: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                              title="Eliminar aliado"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {partners.length === 0 && (
                        <tr>
                          <td colSpan={3} style={{ padding: '30px', textAlign: 'center', color: '#6B7280' }}>
                            No hay empresas aliadas registradas.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Edit Event Modal */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ color: '#1A2E6C', fontSize: '20px', fontWeight: 800 }}>Actualizar Evento</DialogTitle>
            <DialogDescription>
              Modifica la información del evento seleccionado y guarda los cambios.
            </DialogDescription>
          </DialogHeader>
          
          {editingEvent && (
            <EditEventForm 
              initialData={editingEvent} 
              onEventUpdated={() => {
                setIsEditDialogOpen(false);
                loadEvents();
              }}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getLocations, updateLocation, deleteLocation, deleteReviewFromLocation } from '../data/locations';
import { menuProducts, setProductsForLocation } from '../data/menu';
import { ArrowLeft, Save, Trash2, ShieldAlert } from 'lucide-react';

export const AdminLocationEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [locData, setLocData] = useState<any>(null);

  const [editName, setEditName] = useState('');
  const [editAddr, setEditAddr] = useState('');
  const [editSchedule, setEditSchedule] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    if (id) {
      const allLocs = getLocations();
      const targetLoc = allLocs.find(l => l.id === id);
      if (targetLoc) {
        setLocData(targetLoc);
        setEditName(targetLoc.name);
        setEditAddr(targetLoc.addr);
        setEditSchedule(targetLoc.schedule || '');
        setEditDesc(targetLoc.description);

        const currentProds = menuProducts.filter(p => p.availableAt.includes(targetLoc.id)).map(p => p.id);
        setSelectedProducts(currentProds);
      }
    }
  }, [id, user, navigate, refreshKey]);

  if (!user || user.role !== 'admin') return <div className="min-h-screen bg-[#FDFBF7]" />;
  if (!locData) return <div className="min-h-screen bg-[#FDFBF7] flex justify-center items-center"><p>Locație negăsită...</p></div>;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateLocation(locData.id, {
      name: editName,
      addr: editAddr,
      schedule: editSchedule,
      description: editDesc
    });
    setProductsForLocation(locData.id, selectedProducts);
    alert("Modificările au fost salvate cu succes!");
    setRefreshKey(prev => prev + 1);
  };

  const handleProductToggle = (prodId: string) => {
    setSelectedProducts(prev =>
      prev.includes(prodId) ? prev.filter(p => p !== prodId) : [...prev, prodId]
    );
  };

  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm("Ești sigur că vrei să ștergi definitiv această recenzie?")) {
      deleteReviewFromLocation(locData.id, reviewId);
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleDeleteLocation = () => {
    if (window.confirm("ATENȚIE! Ești sigur că vrei să ștergi această locație cu totul? Acțiunea este ireversibilă!")) {
      deleteLocation(locData.id);
      navigate('/locations');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <button
          onClick={() => navigate('/locations')}
          className="flex items-center gap-2 text-coffee-600 hover:text-coffee-900 font-bold mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Înapoi la Locații
        </button>

        <div className="bg-white rounded-3xl p-8 border border-coffee-100 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-coffee-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert size={20} className="text-gold" />
                <span className="text-sm font-bold uppercase tracking-widest text-gold">Admin Editor</span>
              </div>
              <h1 className="text-4xl font-serif font-black text-coffee-900">{locData.name}</h1>
            </div>
            <button
              onClick={handleDeleteLocation}
              className="mt-4 md:mt-0 px-6 py-2 bg-red-50 text-red-600 font-bold rounded-xl border border-red-200 hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
            >
              <Trash2 size={18} /> Șterge Locația
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-8">

            <div>
              <h2 className="text-xl font-bold text-coffee-900 mb-4">Date de Identificare</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-coffee-600">Nume Cafenea</label>
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} required className="bg-cream border border-coffee-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold text-coffee-900" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-coffee-600">Adresă</label>
                  <input type="text" value={editAddr} onChange={e => setEditAddr(e.target.value)} required className="bg-cream border border-coffee-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold text-coffee-900" />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-bold text-coffee-600">Orar</label>
                  <input type="text" value={editSchedule} onChange={e => setEditSchedule(e.target.value)} placeholder="ex. Luni-Dum: 08:00 - 20:00" className="bg-cream border border-coffee-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold text-coffee-900" />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-bold text-coffee-600">Descriere Comercială</label>
                  <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={4} className="bg-cream border border-coffee-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold text-coffee-900 resize-none" />
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-coffee-100">
              <h2 className="text-xl font-bold text-coffee-900 mb-4">Produse Disponibile Aici</h2>
              <div className="bg-cream/50 p-6 rounded-2xl border border-coffee-100 flex flex-wrap gap-3">
                {menuProducts.map(prod => (
                  <label key={prod.id} className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-bold border transition-colors flex items-center gap-2 ${selectedProducts.includes(prod.id) ? 'bg-coffee-800 text-white border-coffee-900' : 'bg-white text-coffee-600 border-coffee-200 hover:bg-coffee-50'}`}>
                    <input type="checkbox" className="hidden" checked={selectedProducts.includes(prod.id)} onChange={() => handleProductToggle(prod.id)} />
                    {prod.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-coffee-100">
              <h2 className="text-xl font-bold text-coffee-900 mb-4">Moderare Recenzii Clienți</h2>
              {locData.reviews.length === 0 ? (
                <p className="text-coffee-500 italic">Această locație nu are recenzii momentan.</p>
              ) : (
                <div className="space-y-4">
                  {locData.reviews.map((r: any) => (
                    <div key={r.id} className="flex justify-between items-center bg-white p-4 rounded-xl border border-coffee-100 shadow-sm">
                      <div className="pr-4">
                        <p className="font-bold text-coffee-800 text-sm mb-1">{r.author} <span className="text-gold">({r.rating}★)</span></p>
                        <p className="text-coffee-600 text-sm">"{r.text}"</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(r.id)}
                        className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-100 shrink-0"
                        title="Șterge recenzia (neadecvat)"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-8 flex justify-end">
              <button
                type="submit"
                className="px-8 py-4 bg-gold text-white font-bold rounded-xl hover:bg-yellow-600 transition-colors shadow-lg flex items-center gap-2 text-lg"
              >
                <Save size={24} /> Salvează Modificările
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

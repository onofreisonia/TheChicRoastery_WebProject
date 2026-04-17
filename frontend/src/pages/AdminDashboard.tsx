import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Users, PackageOpen, ShoppingBag,
  Trash2, Plus, AlertCircle,
  ShieldAlert, LogOut, Mail, CheckCircle, Menu, X
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  getAccounts, addAccount, deleteAccount, MockAccount,
  getInventory, updateInventoryQuantity, InventoryItem,
  getOrders, updateOrderStatus, Order,
  addVendor, getTickets, resolveTicket, SupportTicket
} from '../data/adminData';
import { addLocation, getLocations } from '../data/locations';
import { menuProducts, addLocationToProducts, addMenuProduct, Product } from '../data/menu';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'accounts' | 'inventory' | 'orders' | 'management' | 'support'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const [accounts, setAccounts] = useState<MockAccount[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);


  const [newAccName, setNewAccName] = useState('');
  const [newAccEmail, setNewAccEmail] = useState('');


  const [newLocName, setNewLocName] = useState('');
  const [newLocAddr, setNewLocAddr] = useState('');
  const [newLocDesc, setNewLocDesc] = useState('');
  const [newLocLat, setNewLocLat] = useState('');
  const [newLocLng, setNewLocLng] = useState('');
  const [newLocSchedule, setNewLocSchedule] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);


  const [newVendName, setNewVendName] = useState('');
  const [newVendDesc, setNewVendDesc] = useState('');
  const [newVendContact, setNewVendContact] = useState('');


  const [newProdName, setNewProdName] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Product['category']>('Cafea');
  const [selectedLocForProd, setSelectedLocForProd] = useState<string[]>([]);


  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    setAccounts(getAccounts());
    setInventory(getInventory());
    setOrders(getOrders());
    setTickets(getTickets());
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return <div className="min-h-screen bg-cream"></div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName || !newAccEmail) return;
    setAccounts(addAccount(newAccName, newAccEmail));
    setNewAccName('');
    setNewAccEmail('');
  };

  const handleDeleteAccount = (id: string) => {
    if (window.confirm("Ești sigur că vrei să ștergi acest cont?")) {
      setAccounts(deleteAccount(id));
    }
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName || !newLocAddr || !newLocLat || !newLocLng) return;


    const result = addLocation(newLocName, newLocAddr, newLocSchedule, newLocDesc, parseFloat(newLocLat), parseFloat(newLocLng));

    if (selectedProducts.length > 0) {
      addLocationToProducts(result.newLocId, selectedProducts);
    }

    setNewLocName('');
    setNewLocAddr('');
    setNewLocDesc('');
    setNewLocLat('');
    setNewLocLng('');
    setNewLocSchedule('');
    setSelectedProducts([]);
    alert("Locație de cafenea adăugată cu succes!");
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendName || !newVendContact) return;
    addVendor(newVendName, newVendDesc, newVendContact);
    setNewVendName('');
    setNewVendDesc('');
    setNewVendContact('');
    alert("Furnizor adăugat cu succes!");
  };

  const handleAddMenuProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;
    addMenuProduct(newProdName, newProdDesc, parseFloat(newProdPrice), newProdCategory, selectedLocForProd);
    setNewProdName('');
    setNewProdDesc('');
    setNewProdPrice('');
    setNewProdCategory('Cafea');
    setSelectedLocForProd([]);
    alert("Produs de meniu adăugat cu succes!");
  };

  const handleProductLocToggle = (locId: string) => {
    setSelectedLocForProd(prev =>
      prev.includes(locId) ? prev.filter(id => id !== locId) : [...prev, locId]
    );
  };

  const handleResolveTicket = (id: string) => {
    setTickets(resolveTicket(id));
  };



  const renderOverviewTab = () => {
    const totalUsers = accounts.length;
    const totalRevenue = orders.filter(o => o.status === 'completed' || o.status === 'shipped' || o.status === 'ready').reduce((acc, o) => acc + o.totalPrice, 0);
    const lowStockCount = inventory.filter(i => i.lowStockAlert).length;

    return (
      <div className="space-y-8 animate-fade-in text-coffee-900">
        <h2 className="text-3xl font-serif font-bold text-coffee-900">Privire de Ansamblu</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-coffee-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-coffee-50 flex items-center justify-center">
              <Users size={24} className="text-coffee-800" />
            </div>
            <div>
              <p className="text-sm text-coffee-500 font-medium uppercase tracking-wider">Utilizatori</p>
              <p className="text-3xl font-bold font-serif">{totalUsers}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-coffee-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <BarChart3 size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-coffee-500 font-medium uppercase tracking-wider">Venit Estimativ</p>
              <p className="text-3xl font-bold font-serif">{totalRevenue} RON</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-50 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle size={24} className="text-red-500" />
            </div>
            <div>
              <p className="text-sm text-coffee-500 font-medium uppercase tracking-wider">Alerte Stoc</p>
              <p className="text-3xl font-bold font-serif text-red-600">{lowStockCount} produse</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-coffee-100 p-8">
          <h3 className="text-xl font-bold text-coffee-800 mb-4 border-b border-coffee-100 pb-4">Activitate Recentă</h3>
          <p className="italic text-coffee-500 text-sm">Dashboard-ul de monitorizare actualizează în timp real operațiunile din frontend. Modificările făcute aici se vor reflecta temporar pe durata vizitei tale pe pagină.</p>
        </div>
      </div>
    );
  };

  const renderAccountsTab = () => (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-serif font-bold text-coffee-900">Management Utilizatori</h2>


      <div className="bg-white p-6 rounded-3xl shadow-sm border border-coffee-100">
        <h3 className="text-lg font-bold text-coffee-800 mb-4 flex items-center gap-2">
          <Plus size={20} className="text-gold" /> Adaugă Utilizator Nou
        </h3>
        <form onSubmit={handleAddAccount} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Nume Complet"
            value={newAccName}
            onChange={e => setNewAccName(e.target.value)}
            className="flex-1 bg-cream border border-coffee-200 text-coffee-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-gold outline-none"
            required
          />
          <input
            type="email"
            placeholder="Adresă Email"
            value={newAccEmail}
            onChange={e => setNewAccEmail(e.target.value)}
            className="flex-1 bg-cream border border-coffee-200 text-coffee-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-gold outline-none"
            required
          />
          <button type="submit" className="bg-coffee-800 text-white font-bold px-8 py-3 rounded-xl hover:bg-coffee-900 transition-colors shadow-sm">
            Creează Cont
          </button>
        </form>
      </div>


      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-coffee-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-coffee-50 text-coffee-800 font-serif text-sm uppercase tracking-wide">
                <th className="px-6 py-4 border-b border-coffee-200">ID Utilizator</th>
                <th className="px-6 py-4 border-b border-coffee-200">Nume</th>
                <th className="px-6 py-4 border-b border-coffee-200">Email</th>
                <th className="px-6 py-4 border-b border-coffee-200">Rol</th>
                <th className="px-6 py-4 border-b border-coffee-200 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-100">
              <AnimatePresence>
                {accounts.map(acc => (
                  <motion.tr
                    key={acc.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="hover:bg-amber-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-xs font-mono text-coffee-500">{acc.id}</td>
                    <td className="px-6 py-4 font-medium text-coffee-900">{acc.name}</td>
                    <td className="px-6 py-4 text-coffee-600">{acc.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${acc.role === 'admin' ? 'bg-coffee-800 text-white' : 'bg-coffee-100 text-coffee-800'}`}>
                        {acc.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {acc.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteAccount(acc.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Șterge Cont"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderInventoryTab = () => (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-serif font-bold text-coffee-900">Inventar & Vendori</h2>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-coffee-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-coffee-50 text-coffee-800 font-serif text-sm uppercase tracking-wide">
                <th className="px-6 py-4 border-b border-coffee-200">Produs</th>
                <th className="px-6 py-4 border-b border-coffee-200">Categorie</th>
                <th className="px-6 py-4 border-b border-coffee-200">Stoc</th>
                <th className="px-6 py-4 border-b border-coffee-200">Furnizor (Vendor)</th>
                <th className="px-6 py-4 border-b border-coffee-200">Acțiuni Stoc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-100">
              {inventory.map(item => (
                <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-coffee-900">{item.name}</p>
                    {item.lowStockAlert && (
                      <span className="flex items-center gap-1 text-xs text-red-600 font-bold mt-1">
                        <AlertCircle size={12} /> Stoc Scăzut
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-coffee-600">{item.category}</td>
                  <td className="px-6 py-4 text-coffee-900 font-mono font-medium">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/admin/vendor/${item.vendorId}`} className="font-bold text-coffee-900 hover:text-gold hover:underline transition-colors">
                      {item.vendorName}
                    </Link>
                    <p className="text-xs text-gold mt-1">Rating: {item.vendorRating} ★</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setInventory(updateInventoryQuantity(item.id, item.quantity + 10))}
                        className="px-3 py-1 bg-coffee-100 text-coffee-800 rounded-lg hover:bg-coffee-200 text-sm font-bold"
                      >
                        +10 {item.unit}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );

  const renderManagementTab = () => (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-serif font-bold text-coffee-900">Adăugare Date Noi</h2>


      <div className="bg-white p-6 rounded-3xl shadow-sm border border-coffee-100">
        <h3 className="text-lg font-bold text-coffee-800 mb-4 flex items-center gap-2">
          <Plus size={20} className="text-gold" /> Adaugă Locație (Cafenea) Nouă
        </h3>
        <form onSubmit={handleAddLocation} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Nume Locație" value={newLocName} onChange={e => setNewLocName(e.target.value)} required className="bg-cream border border-coffee-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
          <input type="text" placeholder="Adresă" value={newLocAddr} onChange={e => setNewLocAddr(e.target.value)} required className="bg-cream border border-coffee-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
          <input type="number" step="0.000001" placeholder="Latitudine (ex: 44.431)" value={newLocLat} onChange={e => setNewLocLat(e.target.value)} required className="bg-cream border border-coffee-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
          <input type="number" step="0.000001" placeholder="Longitudine (ex: 26.099)" value={newLocLng} onChange={e => setNewLocLng(e.target.value)} required className="bg-cream border border-coffee-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
          <input type="text" placeholder="Orar (ex. Luni-Dum: 08:00 - 20:00)" value={newLocSchedule} onChange={e => setNewLocSchedule(e.target.value)} className="col-span-1 md:col-span-2 bg-cream border border-coffee-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
          <input type="text" placeholder="Descriere" value={newLocDesc} onChange={e => setNewLocDesc(e.target.value)} className="col-span-1 md:col-span-2 bg-cream border border-coffee-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />

          <div className="col-span-1 md:col-span-2 bg-cream/50 p-4 rounded-xl border border-coffee-100">
            <p className="text-sm font-bold text-coffee-800 mb-3">Asociază Produse Disponibile din Meniu</p>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2">
              {menuProducts.map(prod => (
                <label key={prod.id} className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-2 ${selectedProducts.includes(prod.id) ? 'bg-coffee-800 text-white border-coffee-900' : 'bg-white text-coffee-600 border-coffee-200 hover:bg-coffee-50'}`}>
                  <input type="checkbox" className="hidden" checked={selectedProducts.includes(prod.id)} onChange={() => handleProductToggle(prod.id)} />
                  {prod.name}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="col-span-1 md:col-span-2 bg-coffee-800 text-white font-bold p-3 rounded-xl hover:bg-coffee-900 transition-colors mt-2">
            Adaugă Locație
          </button>
        </form>
      </div>


      <div className="bg-white p-6 rounded-3xl shadow-sm border border-coffee-100">
        <h3 className="text-lg font-bold text-coffee-800 mb-4 flex items-center gap-2">
          <Plus size={20} className="text-gold" /> Adaugă Produs în Meniu
        </h3>
        <form onSubmit={handleAddMenuProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Nume Produs" value={newProdName} onChange={e => setNewProdName(e.target.value)} required className="bg-cream border border-coffee-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
          <input type="number" step="0.01" placeholder="Preț (RON)" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} required className="bg-cream border border-coffee-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
          <select value={newProdCategory} onChange={e => setNewProdCategory(e.target.value as Product['category'])} className="bg-cream border border-coffee-200 text-coffee-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold">
            <option value="Cafea">Cafea</option>
            <option value="Patiserie">Patiserie</option>
            <option value="Specialități Reci">Specialități Reci</option>
          </select>
          <input type="text" placeholder="Descriere" value={newProdDesc} onChange={e => setNewProdDesc(e.target.value)} className="bg-cream border border-coffee-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />

          <div className="col-span-1 md:col-span-2 bg-cream/50 p-4 rounded-xl border border-coffee-100">
            <p className="text-sm font-bold text-coffee-800 mb-3">Disponibilitate (selectează locațiile)</p>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2">
              {getLocations().map(loc => (
                <label key={loc.id} className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-2 ${selectedLocForProd.includes(loc.id) ? 'bg-coffee-800 text-white border-coffee-900' : 'bg-white text-coffee-600 border-coffee-200 hover:bg-coffee-50'}`}>
                  <input type="checkbox" className="hidden" checked={selectedLocForProd.includes(loc.id)} onChange={() => handleProductLocToggle(loc.id)} />
                  {loc.name}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="col-span-1 md:col-span-2 bg-coffee-800 text-white font-bold p-3 rounded-xl hover:bg-coffee-900 transition-colors mt-2">
            Adaugă Produs
          </button>
        </form>
      </div>


      <div className="bg-white p-6 rounded-3xl shadow-sm border border-coffee-100">
        <h3 className="text-lg font-bold text-coffee-800 mb-4 flex items-center gap-2">
          <Plus size={20} className="text-gold" /> Adaugă Furnizor (Vendor) Nou
        </h3>
        <form onSubmit={handleAddVendor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Nume Furnizor" value={newVendName} onChange={e => setNewVendName(e.target.value)} required className="bg-cream border border-coffee-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
          <input type="text" placeholder="Contact (Email/Tel)" value={newVendContact} onChange={e => setNewVendContact(e.target.value)} required className="bg-cream border border-coffee-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
          <input type="text" placeholder="Descriere" value={newVendDesc} onChange={e => setNewVendDesc(e.target.value)} className="col-span-1 md:col-span-2 bg-cream border border-coffee-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
          <button type="submit" className="col-span-1 md:col-span-2 bg-coffee-800 text-white font-bold p-3 rounded-xl hover:bg-coffee-900 transition-colors">
            Adaugă Furnizor
          </button>
        </form>
      </div>
    </div>
  );

  const renderOrdersTab = () => (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-serif font-bold text-coffee-900">Urmărire Comenzi & Servicii</h2>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-coffee-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-coffee-50 text-coffee-800 font-serif text-sm uppercase tracking-wide">
                <th className="px-6 py-4 border-b border-coffee-200">ID / Data</th>
                <th className="px-6 py-4 border-b border-coffee-200">Client</th>
                <th className="px-6 py-4 border-b border-coffee-200">Tip Comandă</th>
                <th className="px-6 py-4 border-b border-coffee-200">Detalii Produse</th>
                <th className="px-6 py-4 border-b border-coffee-200">Valoare</th>
                <th className="px-6 py-4 border-b border-coffee-200">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-100">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-mono text-xs text-coffee-500 mb-1">{order.id}</p>
                    <p className="text-sm font-medium text-coffee-900 flex gap-2 items-center">
                      {order.date}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-bold text-coffee-800">{order.customerName}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-gold">
                      {order.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-coffee-700">{order.details}</td>
                  <td className="px-6 py-4 font-bold text-coffee-900">{order.totalPrice} RON</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => setOrders(updateOrderStatus(order.id, e.target.value as any))}
                      className={`text-sm font-bold rounded-full px-3 py-1 outline-none border cursor-pointer ${order.status === 'completed' || order.status === 'ready' || order.status === 'shipped'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}
                    >
                      <option value="pending">În așteptare</option>
                      <option value="processing">În procesare</option>
                      <option value="ready">Gata de ridicare</option>
                      <option value="shipped">Livrat</option>
                      <option value="completed">Finalizat</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSupportTab = () => (
    <div className="space-y-8 animate-fade-in text-coffee-900">
      <h2 className="text-3xl font-serif font-bold text-coffee-900">Inbox Asistență Vendori</h2>
      <p className="text-coffee-600 mb-8">Mesaje de suport direct de la partenerii comerciali The Chic Roastery.</p>

      <div className="space-y-4">
        {tickets.sort((a, b) => (a.status === 'open' ? -1 : (b.status === 'open' ? 1 : 0))).map(ticket => (
          <div key={ticket.id} className={`p-6 rounded-2xl border ${ticket.status === 'open' ? 'bg-white border-coffee-200 shadow-md' : 'bg-coffee-50 border-coffee-100 opacity-60'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${ticket.status === 'open' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {ticket.status === 'open' ? 'NECESITĂ ACȚIUNE' : 'REZOLVAT'}
                </span>
                <h3 className="text-xl font-bold font-serif text-coffee-900">{ticket.subject}</h3>
                <p className="text-sm font-bold text-gold">{ticket.vendorName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-coffee-400 font-medium">{ticket.date}</p>
                {ticket.status === 'open' && (
                  <button
                    onClick={() => handleResolveTicket(ticket.id)}
                    className="mt-3 flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-bold shadow-sm"
                  >
                    <CheckCircle size={16} /> Marchează Rezolvat
                  </button>
                )}
              </div>
            </div>
            <div className="bg-cream p-4 rounded-xl text-coffee-700 italic border border-coffee-100">
              "{ticket.message}"
            </div>
          </div>
        ))}
        {tickets.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-coffee-100 italic text-coffee-500">
            Niciun tichet de suport primit momentan. Totul e curat!
          </div>
        )}
      </div>
    </div>
  );

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'accounts', label: 'Utilizatori', icon: Users },
    { id: 'orders', label: 'Comenzi', icon: ShoppingBag },
    { id: 'inventory', label: 'Inventar & Vendori', icon: PackageOpen },
    { id: 'management', label: 'Adăugare Date', icon: Plus },
    { id: 'support', label: 'Inbox Vendori', icon: Mail },
  ];

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-coffee-100">
        <div className="w-12 h-12 bg-coffee-800 rounded-full flex items-center justify-center text-white shrink-0">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h3 className="font-bold text-coffee-900">Admin Control</h3>
          <p className="text-xs text-coffee-500">Privilegii maxime</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as any); onItemClick?.(); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left ${isActive
                  ? 'bg-coffee-800 text-white shadow-md'
                  : 'text-coffee-600 hover:bg-coffee-50 hover:text-coffee-900'
                }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-coffee-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-500 font-medium hover:bg-red-50 w-full rounded-xl transition-colors"
        >
          <LogOut size={18} /> Deconectare
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      <Navbar />


      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-14 h-14 bg-coffee-800 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-coffee-900 transition-colors"
          aria-label="Deschide meniu"
        >
          <Menu size={24} />
        </button>
      </div>


      <AnimatePresence>
        {sidebarOpen && (
          <>

            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl z-50 p-6 flex flex-col lg:hidden"
            >

              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-coffee-600 hover:bg-coffee-50 transition-colors"
                aria-label="Închide meniu"
              >
                <X size={20} />
              </button>
              <SidebarContent onItemClick={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full flex gap-8">


        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-coffee-100 sticky top-32">
            <SidebarContent />
          </div>
        </aside>


        <main className="flex-1 min-w-0">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'accounts' && renderAccountsTab()}
          {activeTab === 'orders' && renderOrdersTab()}
          {activeTab === 'inventory' && renderInventoryTab()}
          {activeTab === 'management' && renderManagementTab()}
          {activeTab === 'support' && renderSupportTab()}
        </main>

      </div>
    </div>
  );
};

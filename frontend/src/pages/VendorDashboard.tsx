import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, LayoutDashboard, ShoppingCart, LogOut,
  Plus, Search, Edit2, AlertTriangle, CheckCircle,
  TrendingUp, Trash2, Mail, Menu, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getInventory, getOrdersByVendor, getProductSalesStats,
  updateInventoryItem, addInventoryItem, fulfillRestock, deleteInventoryItem,
  InventoryItem, Order, addTicket
} from '../data/adminData';

export const VendorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'orders' | 'contact'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [vendorProducts, setVendorProducts] = useState<InventoryItem[]>([]);
  const [vendorOrders, setVendorOrders] = useState<Order[]>([]);

  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    category: 'Echipamente' as InventoryItem['category']
  });

  useEffect(() => {
    if (!user || user.role !== 'vendor' || !user.vendorId) {
      navigate('/');
      return;
    }
    refreshData();
  }, [user, navigate]);

  const refreshData = () => {
    if (!user?.vendorId) return;
    const items = getInventory().filter(i => i.vendorId === user.vendorId);
    setVendorProducts(items);
    setVendorOrders(getOrdersByVendor(user.vendorId));
  };

  const handleEditClick = (p: InventoryItem) => {
    setSelectedProduct(p);
    setFormData({
      name: p.name,
      description: p.description,
      price: p.price,
      quantity: p.quantity,
      category: p.category
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    updateInventoryItem(selectedProduct.id, formData);
    setIsEditModalOpen(false);
    setSelectedProduct(null);
    refreshData();
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.vendorId) return;

    addTicket(user.vendorId, user.name, supportSubject, supportMessage);
    setSupportSubject('');
    setSupportMessage('');
    alert('Mesajul a fost primit de echipa de suport Vendor!');
    setActiveTab('overview');
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Sunteți sigur că doriți să ștergeți definitiv produsul "${name}" din magazin?`)) {
      deleteInventoryItem(id);
      refreshData();
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.vendorId) return;

    let defaultImg = "";
    if (formData.category === 'Cafea Boabe') {
      defaultImg = "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=1000&auto=format&fit=crop"; // Boabe
    } else if (formData.category === 'Patiserie') {
      defaultImg = "https://images.unsplash.com/photo-1549996647-190b679b33d7?q=80&w=1000&auto=format&fit=crop";
    } else if (formData.category === 'Echipamente') {
      defaultImg = "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000&auto=format&fit=crop";
    } else {
      defaultImg = "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1000&auto=format&fit=crop";
    }

    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: formData.price,
      imageUrl: defaultImg,
      category: formData.category,
      quantity: formData.quantity,
      unit: "buc",
      vendorId: user.vendorId,
      vendorName: user.name,
      vendorRating: user.vendorRating || 5.0,
      lowStockAlert: formData.quantity < 10
    };

    addInventoryItem(newItem);
    setIsAddModalOpen(false);
    setFormData({ name: '', description: '', price: 0, quantity: 0, category: 'Echipamente' });
    refreshData();
  };

  const handleFulfillRestock = (id: string) => {
    fulfillRestock(id, 20);
    refreshData();
  };

  const calculateStats = () => {
    let totalRev = 0;
    let totalUnits = 0;
    vendorProducts.forEach(p => {
      const stats = getProductSalesStats(p.name, p.price);
      totalRev += stats.totalRevenue;
      totalUnits += stats.totalUnits;
    });
    return { totalRev, totalUnits };
  };

  const stats = calculateStats();
  const lowStockCount = vendorProducts.filter(p => p.quantity < 10).length;

  if (!user || user.role !== 'vendor') return null;

  const navItems = [
    { id: 'overview', label: 'Prezentare Generală', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventar', icon: Package },
    { id: 'orders', label: 'Comenzi', icon: ShoppingCart },
    { id: 'contact', label: 'Asistență Admin', icon: Mail },
  ];

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      <div className="p-8 border-b border-white/10">
        <h1 className="text-2xl font-serif font-black tracking-tight text-gold">Chic Vendor</h1>
        <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1 font-bold">Panou Partener</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as any); onItemClick?.(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-gold text-white shadow-lg' : 'hover:bg-white/5 text-white/60'
                }`}
            >
              <Icon size={20} />
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 mt-auto">
        <div className="bg-white/5 rounded-2xl p-4 mb-4">
          <p className="text-xs text-white/40 mb-1">Conectat ca</p>
          <p className="text-sm font-bold truncate">{user.name}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all font-bold text-sm"
        >
          <LogOut size={20} /> Deconectare
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-coffee-950">

      <aside className="hidden lg:flex w-64 bg-coffee-900 text-white flex-col fixed inset-y-0 shadow-2xl z-50">
        <SidebarContent />
      </aside>
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-14 h-14 bg-coffee-900 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-black transition-colors"
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-coffee-900 text-white shadow-2xl z-50 flex flex-col lg:hidden"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-white/60 hover:bg-white/10 transition-colors"
                aria-label="Închide meniu"
              >
                <X size={20} />
              </button>
              <SidebarContent onItemClick={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-64 p-6 lg:p-10">
        <header className="flex flex-col gap-3 sm:flex-row justify-between sm:items-center mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-serif font-black text-coffee-900">
              {activeTab === 'overview' ? 'Performanță Generală' : activeTab === 'inventory' ? 'Gestionare Inventar' : activeTab === 'orders' ? 'Istoric Comenzi' : 'Asistență Parteneri'}
            </h2>
            <p className="text-coffee-500 font-medium text-sm">Monitorizarea parteneriatului cu The Chic Roastery</p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-coffee-100 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-coffee-600 uppercase tracking-wider">Sistem Live Activ</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-coffee-50 flex items-center gap-4 group hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all shrink-0">
                    <TrendingUp size={24} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-coffee-400 uppercase tracking-widest mb-0.5">Vânzări Totale</p>
                    <div className="flex items-baseline gap-1 flex-wrap">
                      <span className="text-2xl font-black text-coffee-900">{stats.totalRev}</span>
                      <span className="text-sm font-bold text-coffee-400">RON</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-coffee-50 flex items-center gap-4 group hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-coffee-900/10 rounded-xl flex items-center justify-center text-coffee-900 group-hover:bg-coffee-900 group-hover:text-white transition-all shrink-0">
                    <Package size={24} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-coffee-400 uppercase tracking-widest mb-0.5">Unități Vândute</p>
                    <div className="flex items-baseline gap-1 flex-wrap">
                      <span className="text-2xl font-black text-coffee-900">{stats.totalUnits}</span>
                      <span className="text-sm font-bold text-coffee-400">bucăți</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-coffee-50 flex items-center gap-4 group hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-coffee-400 uppercase tracking-widest mb-0.5">Stoc Redus</p>
                    <div className="flex items-baseline gap-1 flex-wrap">
                      <span className="text-2xl font-black text-coffee-900">{lowStockCount}</span>
                      <span className="text-sm font-bold text-coffee-400">necesită atenție</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-md border border-coffee-100 overflow-hidden">
                <div className="p-4 sm:p-6 bg-coffee-50 border-b border-coffee-100 flex flex-wrap gap-2 justify-between items-center">
                  <h3 className="font-serif font-bold text-base sm:text-xl text-coffee-900 leading-tight">
                    Cereri de Reaprovizionare
                  </h3>
                  <span className="bg-gold text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0">
                    {vendorProducts.filter(p => p.restockRequested).length} În Așteptare
                  </span>
                </div>
                <div className="p-4 sm:p-6">
                  {vendorProducts.filter(p => p.restockRequested).length === 0 ? (
                    <p className="text-center py-10 text-coffee-400 font-medium text-sm">Nu există cereri de reaprovizionare active din partea administrației.</p>
                  ) : (
                    <div className="space-y-4">
                      {vendorProducts.filter(p => p.restockRequested).map(p => (
                        <div key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-cream rounded-2xl border border-coffee-100 gap-4">
                          <div className="flex items-center gap-4">
                            <img src={p.imageUrl} alt={p.name} className="w-14 h-14 object-cover rounded-xl shrink-0" />
                            <div>
                              <h4 className="font-bold text-coffee-900">{p.name}</h4>
                              <p className="text-sm text-red-500 font-bold">Stoc Curent: {p.quantity} {p.unit}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleFulfillRestock(p.id)}
                            className="w-full sm:w-auto bg-coffee-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
                          >
                            <CheckCircle size={16} /> Onorează (+20 buc.)
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" size={18} />
                  <input
                    type="text"
                    placeholder="Caută în inventar..."
                    className="w-full bg-white border border-coffee-100 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-gold/20 transition-all outline-none font-medium"
                  />
                </div>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-gold text-white px-5 py-3 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-yellow-600 transition-all shadow-lg hover:-translate-y-0.5 shrink-0"
                >
                  <Plus size={20} /> <span className="whitespace-nowrap">Adaugă Produs</span>
                </button>
              </div>

              <div className="lg:hidden space-y-3">
                {vendorProducts.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl border border-coffee-100 shadow-sm p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={p.imageUrl} className="w-12 h-12 object-cover rounded-xl shrink-0" alt={p.name} />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-coffee-900 text-sm leading-tight">{p.name}</p>
                        <span className="inline-block mt-1 bg-coffee-50 text-coffee-600 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">{p.category}</span>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => handleEditClick(p)}
                          className="p-2 hover:bg-gold/10 text-coffee-400 hover:text-gold rounded-lg transition-all"
                          title="Editează"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-2 hover:bg-red-50 text-coffee-400 hover:text-red-500 rounded-lg transition-all"
                          title="Șterge"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-coffee-50">
                      <div>
                        <p className="text-[10px] font-black text-coffee-400 uppercase tracking-widest mb-0.5">Stoc</p>
                        <p className={`font-bold text-sm ${p.quantity < 10 ? 'text-red-500' : 'text-coffee-700'}`}>
                          {p.quantity} {p.unit}
                          {p.quantity < 10 && <span className="ml-1 text-[10px]">⚠ scăzut</span>}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-coffee-400 uppercase tracking-widest mb-0.5">Preț</p>
                        <p className="font-black text-coffee-900">{p.price} RON</p>
                      </div>
                    </div>
                  </div>
                ))}
                {vendorProducts.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-2xl border border-coffee-100 text-coffee-400 font-medium">
                    Nu există produse în inventar.
                  </div>
                )}
              </div>

              <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-coffee-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-coffee-50 border-b border-coffee-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-coffee-400 uppercase tracking-widest">Produs</th>
                      <th className="px-6 py-4 text-[10px] font-black text-coffee-400 uppercase tracking-widest">Categorie</th>
                      <th className="px-6 py-4 text-[10px] font-black text-coffee-400 uppercase tracking-widest">Stoc</th>
                      <th className="px-6 py-4 text-[10px] font-black text-coffee-400 uppercase tracking-widest">Preț</th>
                      <th className="px-6 py-4 text-[10px] font-black text-coffee-400 uppercase tracking-widest text-right">Acțiuni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-coffee-50">
                    {vendorProducts.map(p => (
                      <tr key={p.id} className="hover:bg-cream/50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <img src={p.imageUrl} className="w-10 h-10 object-cover rounded-lg" alt={p.name} />
                            <span className="font-bold text-coffee-900 text-sm">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="bg-coffee-50 text-coffee-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">{p.category}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`font-bold text-sm ${p.quantity < 10 ? 'text-red-500' : 'text-coffee-600'}`}>{p.quantity} {p.unit}</span>
                        </td>
                        <td className="px-6 py-5 font-black text-coffee-900">{p.price} RON</td>
                        <td className="px-6 py-5 text-right">
                          <button onClick={() => handleEditClick(p)} className="p-2 hover:bg-gold/10 text-coffee-400 hover:text-gold rounded-lg transition-all" title="Editează produsul">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id, p.name)} className="p-2 hover:bg-red-50 text-coffee-400 hover:text-red-500 rounded-lg transition-all ml-2" title="Șterge definitiv produsul">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl shadow-sm border border-coffee-100 overflow-hidden">
                {vendorOrders.length === 0 ? (
                  <div className="p-12 text-center">
                    <ShoppingCart size={48} className="mx-auto text-coffee-100 mb-4" />
                    <p className="text-coffee-400 font-bold">Nu au fost găsite comenzi pentru produsele tale.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-coffee-50">
                    {vendorOrders.map(order => (
                      <div key={order.id} className="p-4 sm:p-8 hover:bg-cream/30 transition-all flex flex-col gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bg-gold/10 text-gold px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">{order.id}</span>
                          <span className="text-sm font-bold text-coffee-400">{order.date}</span>
                        </div>
                        <h4 className="text-base sm:text-xl font-serif font-black text-coffee-900">{order.customerName}</h4>
                        <div className="bg-cream/60 border border-coffee-50 rounded-xl p-3">
                          <p className="text-[10px] font-black text-coffee-400 uppercase tracking-widest mb-1">Articole Relevante</p>
                          <p className="text-sm font-bold text-coffee-700">{order.details}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-coffee-50">
                          <div>
                            <p className="text-[10px] font-black text-coffee-400 uppercase tracking-widest mb-1">Status</p>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{order.status}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-coffee-400 uppercase tracking-widest mb-1">Total</p>
                            <p className="text-lg sm:text-2xl font-black text-coffee-900">{order.totalPrice} RON</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6 max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-3xl shadow-sm border border-coffee-100 overflow-hidden p-5 sm:p-10">
                <h3 className="text-xl sm:text-2xl font-serif font-black text-coffee-900 mb-2">Linie Directă Suport</h3>
                <p className="text-coffee-500 text-sm mb-5">Dacă întâmpini probleme la facturare sau vrei să soliciți clarificări de listing, trimite-ne situația, iar un administrator va investiga.</p>

                <form onSubmit={handleSupportSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black text-coffee-400 mb-2 uppercase tracking-widest">Subiect</label>
                    <input
                      type="text" required value={supportSubject} onChange={e => setSupportSubject(e.target.value)}
                      className="w-full bg-cream border-none rounded-xl py-3 px-4 font-bold text-coffee-900 focus:ring-2 focus:ring-gold/20"
                      placeholder="Ex: Probleme la preluare comenzi"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-coffee-400 mb-2 uppercase tracking-widest">Detalii Probleme</label>
                    <textarea
                      rows={5} required value={supportMessage} onChange={e => setSupportMessage(e.target.value)}
                      className="w-full bg-cream border-none rounded-xl py-3 px-4 font-medium text-coffee-800 focus:ring-2 focus:ring-gold/20 resize-none"
                      placeholder="Explică-ne cu ce te confrunți..."
                    />
                  </div>
                  <button type="submit" className="w-full py-4 rounded-xl font-black bg-gold text-white hover:bg-yellow-600 shadow-lg hover:-translate-y-1 transition-all">
                    Trimite Mesajul Către Admin
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-coffee-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 relative z-10 shadow-2xl border border-coffee-100"
            >
              <h3 className="text-2xl font-serif font-black text-coffee-900 mb-8 border-b border-coffee-50 pb-4">Editează Detaliile Produsului</h3>
              <form onSubmit={handleUpdateProduct} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-coffee-400 mb-2 uppercase tracking-widest">Nume Produs</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-cream border-none rounded-xl py-3 px-4 font-bold text-coffee-900 focus:ring-2 focus:ring-gold/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-coffee-400 mb-2 uppercase tracking-widest">Preț (RON)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full bg-cream border-none rounded-xl py-3 px-4 font-bold text-coffee-900 focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-coffee-400 mb-2 uppercase tracking-widest">Nivel Stoc</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                      className="w-full bg-cream border-none rounded-xl py-3 px-4 font-bold text-coffee-900 focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-coffee-400 mb-2 uppercase tracking-widest">Descriere</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-cream border-none rounded-xl py-3 px-4 font-medium text-coffee-800 focus:ring-2 focus:ring-gold/20"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 rounded-xl font-bold bg-coffee-50 text-coffee-600 hover:bg-coffee-100 transition-all">Anulează</button>
                  <button type="submit" className="flex-1 py-4 rounded-xl font-black bg-gold text-white hover:bg-yellow-600 shadow-lg hover:-translate-y-1 transition-all">Salvează Modificările</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-coffee-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 relative z-10 shadow-2xl border border-coffee-100"
            >
              <h3 className="text-2xl font-serif font-black text-coffee-900 mb-8 border-b border-coffee-50 pb-4">Adaugă Produs în Magazin</h3>
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-coffee-400 mb-2 uppercase tracking-widest">Nume Produs</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-cream border-none rounded-xl py-3 px-4 font-bold text-coffee-900 focus:ring-2 focus:ring-gold/20"
                    placeholder="Ex: Hario V60 Plastic"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-coffee-400 mb-2 uppercase tracking-widest">Preț (RON)</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full bg-cream border-none rounded-xl py-3 px-4 font-bold text-coffee-900 focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-coffee-400 mb-2 uppercase tracking-widest">Stoc Inițial</label>
                    <input
                      type="number"
                      required
                      value={formData.quantity}
                      onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                      className="w-full bg-cream border-none rounded-xl py-3 px-4 font-bold text-coffee-900 focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-coffee-400 mb-2 uppercase tracking-widest">Categorie</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-cream border-none rounded-xl py-3 px-4 font-bold text-coffee-900 focus:ring-2 focus:ring-gold/20 appearance-none"
                  >
                    <option value="Echipamente">Echipamente</option>
                    <option value="Cafea Boabe">Cafea Boabe</option>
                    <option value="Accesorii">Accesorii</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-coffee-400 mb-2 uppercase tracking-widest">Descriere</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-cream border-none rounded-xl py-3 px-4 font-medium text-coffee-800 focus:ring-2 focus:ring-gold/20"
                    placeholder="Descrie produsul tău..."
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 rounded-xl font-bold bg-coffee-50 text-coffee-600 hover:bg-coffee-100 transition-all">Anulează</button>
                  <button type="submit" className="flex-1 py-4 rounded-xl font-black bg-gold text-white hover:bg-yellow-600 shadow-lg hover:-translate-y-1 transition-all">Publică Produs</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

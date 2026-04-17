import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Star, CalendarDays, Key, MapPin, Clock, Plus, X, ShoppingBag, Settings, Save, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { useAuth, BookingDetails } from '../context/AuthContext';
import { addReviewToLocation, locations } from '../data/locations';
import { addProductReview, mockInventory } from '../data/adminData';
import { menuProducts } from '../data/menu';

export const ProfilePage = () => {
  const { user, isLoggedIn, logout, addAddonToBooking, updateUser } = useAuth();
  const navigate = useNavigate();

  const [addonModalOpen, setAddonModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(null);
  const [addonQuantities, setAddonQuantities] = useState<Record<string, number>>({});

  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const [productReviewModalOpen, setProductReviewModalOpen] = useState(false);
  const [selectedProductReview, setSelectedProductReview] = useState<{ id: string, name: string } | null>(null);
  const [productReviewRating, setProductReviewRating] = useState(5);
  const [productReviewText, setProductReviewText] = useState('');
  const [, setRefreshKey] = useState(0);
  const [viewingReview, setViewingReview] = useState<{ title: string, rating: number, text: string } | null>(null);

  const getUserReviewForLocation = (locationId: string) => {
    const loc = locations.find(l => l.id === locationId);
    return loc?.reviews.find(r => r.author === user?.name);
  };

  const getUserReviewForProduct = (productId: string) => {
    const product = mockInventory.find(p => p.id === productId);
    return product?.reviews?.find(r => r.author === user?.name);
  };

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
    }
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName || !editEmail) return;
    updateUser(editName, editEmail);
    setIsEditingProfile(false);
  };

  const isEligibleForAddon = (dateStr: string, timeStr: string) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    if (dateStr !== todayStr) return false;

    const [bHour, bMin] = timeStr.split(':').map(Number);
    const bookingDate = new Date();
    bookingDate.setHours(bHour, bMin, 0, 0);

    return (bookingDate.getTime() - today.getTime()) >= 30 * 60 * 1000;
  };

  const isEligibleForReview = (dateStr: string, timeStr: string) => {
    const today = new Date();
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, min] = timeStr.split(':').map(Number);

    const bookingFullDate = new Date(year, month - 1, day, hour, min);
    return today >= bookingFullDate;
  };

  const handleOpenAddon = (booking: BookingDetails) => {
    setSelectedBooking(booking);
    setAddonQuantities({});
    setAddonModalOpen(true);
  };

  const handleConfirmAddons = () => {
    if (!selectedBooking) return;
    Object.entries(addonQuantities).forEach(([productId, qty]) => {
      if (qty > 0) {
        const product = menuProducts.find(p => p.id === productId);
        if (product) {
          addAddonToBooking(selectedBooking.id, `${qty}x ${product.name}`);
        }
      }
    });
    setAddonQuantities({});
    setAddonModalOpen(false);
  };

  const handleOpenReview = (booking: BookingDetails) => {
    setSelectedBooking(booking);
    setReviewRating(5);
    setReviewText('');
    setReviewModalOpen(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !reviewText.trim()) return;

    addReviewToLocation(selectedBooking.locationId, {
      author: user?.name || "Oaspete",
      rating: reviewRating,
      text: reviewText
    });

    setReviewModalOpen(false);
    alert('Recenzia a fost adăugată cu succes, mulțumim!');
    setRefreshKey(prev => prev + 1);
  };

  const handleOpenProductReview = (productId: string, productName: string) => {
    setSelectedProductReview({ id: productId, name: productName });
    setProductReviewRating(5);
    setProductReviewText('');
    setProductReviewModalOpen(true);
  };

  const handleSubmitProductReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductReview || !productReviewText.trim()) return;

    addProductReview(selectedProductReview.id, {
      author: user?.name || "Oaspete",
      rating: productReviewRating,
      text: productReviewText
    });

    setProductReviewModalOpen(false);
    alert('Recenzia pentru produs a fost adăugată cu succes, mulțumim!');
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth');
    } else if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'vendor') {
      navigate('/vendor');
    }
  }, [isLoggedIn, user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getTier = (points: number) => {
    if (points >= 3000) return "VIP Elite";
    if (points >= 1000) return "Gold Member";
    if (points >= 500) return "Silver Member";
    return "Membru Standard";
  };

  const tier = getTier(user.loyaltyPoints);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <span className="text-gold font-bold tracking-widest uppercase text-sm mb-2 block">Panoul Tău</span>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-coffee-900 leading-tight">
              Salutare, {user.name.split(' ')[0]}
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-5 py-2.5 rounded-full font-medium transition-colors border border-red-100 shadow-sm"
          >
            <LogOut size={16} /> Deconectare
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-coffee-900 via-coffee-800 to-black rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <p className="text-coffee-200 text-sm font-medium tracking-wide uppercase mb-1">Status Cont</p>
                  <p className="text-2xl font-serif font-bold text-gold">{tier}</p>
                </div>
                <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm border border-white/10">
                  <Star className="text-gold" fill="currentColor" size={24} />
                </div>
              </div>

              <div className="space-y-1 relative z-10">
                <p className="text-coffee-200 text-xs font-semibold tracking-wider uppercase">Puncte de Loialitate</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold font-serif">{user.loyaltyPoints}</span>
                  <span className="text-coffee-300 font-medium">PKT</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2 text-coffee-100 text-sm">
                  <Key size={14} className="opacity-80" />
                  <span className="truncate max-w-[120px]">{user.email}</span>
                </div>
                <span className="text-xs font-medium bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">Membru Activ</span>
              </div>
            </motion.div>

            <div className="bg-white rounded-3xl p-6 border border-coffee-100 shadow-sm flex flex-col">
              <h3 className="font-serif font-bold text-coffee-900 text-lg mb-4 flex items-center gap-2 border-b border-coffee-100 pb-2">
                <ShoppingBag size={18} className="text-gold" /> Achiziții Recente
              </h3>
              {user.orderHistory.length === 0 ? (
                <div className="text-center py-6 text-coffee-400">
                  <p className="text-sm font-medium mb-4">Nu ai nicio achiziție de pe Marketplace.</p>
                  <button onClick={() => navigate('/marketplace')} className="bg-coffee-50 text-coffee-900 py-2 px-4 rounded-xl font-bold hover:bg-gold hover:text-white transition-colors text-sm shadow-sm w-full">
                    Vizitează Magazinul
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {user.orderHistory.map(order => (
                    <div key={order.id} className="bg-cream rounded-xl p-4 border border-coffee-50 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2 mt-1">
                        <p className="text-xs font-mono font-bold text-coffee-500">{order.date.split(' ')[0]}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${order.status === 'completed' || order.status === 'shipped' || order.status === 'ready'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}>
                          {order.status}
                        </span>
                        <div className="text-right flex flex-col justify-between items-end">
                          <span className="font-black text-gold text-lg block">{order.totalPrice} RON</span>
                          <span className="text-xs font-bold text-coffee-400 uppercase tracking-widest block mt-4">
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <p className="font-bold text-coffee-900 text-sm mb-2">{order.details}</p>
                      {order.items && order.items.length > 0 && (order.status === 'completed' || order.status === 'shipped' || order.status === 'ready') && (
                        <div className="mt-2 pt-3 border-t border-coffee-100/50 flex flex-wrap gap-2">
                          {order.items.map(item => {
                            const existingReview = getUserReviewForProduct(item.id);
                            return existingReview ? (
                              <button
                                key={item.id}
                                onClick={() => setViewingReview({ title: item.name, rating: existingReview.rating, text: existingReview.text })}
                                className="bg-coffee-50 border border-coffee-200 text-coffee-800 text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm flex items-center justify-center gap-1"
                              >
                                <Star size={12} className="text-gold" fill="currentColor" /> Recenzia ta ({existingReview.rating})
                              </button>
                            ) : (
                              <button
                                key={item.id}
                                onClick={() => handleOpenProductReview(item.id, item.name)}
                                className="bg-white text-coffee-800 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gold hover:text-white transition-colors shadow-sm flex items-center justify-center gap-1 border border-coffee-100"
                              >
                                <Star size={12} /> Recenzie: {item.name}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-coffee-100 shadow-sm">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-coffee-50">
                <h2 className="text-2xl font-serif font-bold text-coffee-900 flex items-center gap-3">
                  <CalendarDays className="text-gold" /> Istoric Rezervări
                </h2>
              </div>

              {user.upcomingBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-coffee-50 rounded-full flex items-center justify-center mb-6">
                    <CalendarDays className="text-coffee-300" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-coffee-800 mb-2">Niciun eveniment programat</h3>
                  <p className="text-coffee-500 mb-6 max-w-xs">Nu ai nicio rezervare curentă. Alege o locație și planifică o vizită!</p>
                  <button onClick={() => navigate('/locations')} className="bg-coffee-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-coffee-900 transition-colors shadow-sm">
                    Găsește o Cafenea
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.upcomingBookings.map((booking) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border border-coffee-100 rounded-2xl p-6 hover:shadow-md transition-shadow group bg-cream/30 flex flex-col md:flex-row gap-6 md:items-center justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-coffee-50 flex flex-col items-center justify-center flex-shrink-0 text-coffee-800">
                          <span className="text-xs font-bold uppercase">{new Date(booking.date).toLocaleDateString('ro-RO', { month: 'short' })}</span>
                          <span className="text-lg font-black">{new Date(booking.date).getDate()}</span>
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-coffee-900 text-lg mb-1">{booking.locationName}</h4>
                          <div className="flex items-center gap-4 text-sm text-coffee-600">
                            <span className="flex items-center gap-1.5"><Clock size={14} className="text-gold" /> {booking.time}</span>
                            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gold" /> {booking.guests} Pers.</span>
                          </div>
                          {booking.addons && booking.addons.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {booking.addons.map((addon, idx) => (
                                <span key={`${addon}-${idx}`} className="bg-coffee-50 border border-coffee-200 text-coffee-800 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                                  + {addon}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 w-full md:w-auto mt-4 md:mt-0 items-end">
                        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-xs font-bold border border-green-100 uppercase text-center block">
                          Confirmată
                        </span>
                        <span className="text-coffee-400 text-xs text-center pr-1">ID: {booking.id}</span>
                        {isEligibleForAddon(booking.date, booking.time) && (
                          <button
                            onClick={() => handleOpenAddon(booking)}
                            className="bg-gold text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-yellow-600 transition-colors shadow-sm flex items-center justify-center gap-1 mt-1"
                          >
                            <Plus size={14} /> Produs
                          </button>
                        )}
                        {isEligibleForReview(booking.date, booking.time) && (
                          getUserReviewForLocation(booking.locationId) ? (
                            <button
                              onClick={() => {
                                const rev = getUserReviewForLocation(booking.locationId);
                                if (rev) setViewingReview({ title: booking.locationName, rating: rev.rating, text: rev.text });
                              }}
                              className="bg-coffee-50 border border-coffee-200 text-coffee-800 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center justify-center gap-1 mt-1"
                            >
                              <MessageSquare size={14} className="text-gold" fill="currentColor" /> Recenzia ta
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenReview(booking)}
                              className="bg-coffee-100 text-coffee-800 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-coffee-200 transition-colors shadow-sm flex items-center justify-center gap-1 mt-1"
                            >
                              <MessageSquare size={14} /> Recenzie
                            </button>
                          )
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-8 border border-coffee-100 shadow-sm">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-coffee-50">
                <h2 className="text-2xl font-serif font-bold text-coffee-900 flex items-center gap-3">
                  <Settings className="text-gold" /> Date Personale
                </h2>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="text-sm font-bold text-coffee-600 hover:text-gold transition-colors"
                  >
                    Editează
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-coffee-600 mb-1">Nume Complet</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        required
                        className="w-full bg-cream border border-coffee-200 text-coffee-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-coffee-600 mb-1">Adresă Email</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={e => setEditEmail(e.target.value)}
                        required
                        className="w-full bg-cream border border-coffee-200 text-coffee-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex items-center gap-2 bg-coffee-800 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-coffee-900 transition-colors shadow-sm">
                      <Save size={16} /> Salvează
                    </button>
                    <button type="button" onClick={() => { setIsEditingProfile(false); setEditName(user.name); setEditEmail(user.email); }} className="bg-coffee-50 text-coffee-600 font-bold px-6 py-2.5 rounded-xl hover:bg-coffee-100 transition-colors">
                      Anulează
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                  <div className="bg-cream p-4 rounded-xl border border-coffee-50">
                    <p className="text-xs font-bold text-coffee-400 uppercase mb-1">Nume Complet</p>
                    <p className="font-medium text-coffee-900">{user.name}</p>
                  </div>
                  <div className="bg-cream p-4 rounded-xl border border-coffee-50">
                    <p className="text-xs font-bold text-coffee-400 uppercase mb-1">Adresă Email</p>
                    <p className="font-medium text-coffee-900">{user.email}</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      <AnimatePresence>
        {addonModalOpen && selectedBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-cream rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto border border-coffee-200"
            >
              <div className="sticky top-0 bg-cream/90 backdrop-blur-md p-6 border-b border-coffee-200 flex justify-between items-center z-10">
                <div>
                  <h3 className="font-serif font-bold text-xl text-coffee-900">Comenzi în avans</h3>
                  <p className="text-sm text-coffee-600">Produse disponibile la destinația ta</p>
                </div>
                <button onClick={() => setAddonModalOpen(false)} className="bg-white p-2 rounded-full hover:bg-gray-100 shadow-sm border border-coffee-100 transition-colors">
                  <X size={20} className="text-coffee-600" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {menuProducts.filter(p => p.availableAt.includes(selectedBooking.locationId)).map(product => {
                  const qty = addonQuantities[product.id] || 0;
                  return (
                    <div key={product.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-coffee-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-coffee-900 text-sm max-w-[180px] break-words">{product.name}</p>
                          <p className="text-gold font-bold text-sm">{product.price} RON</p>
                        </div>
                      </div>
                      {qty > 0 ? (
                        <div className="flex items-center gap-3">
                          <button onClick={() => setAddonQuantities(prev => ({ ...prev, [product.id]: qty - 1 }))} className="w-8 h-8 flex items-center justify-center rounded-full bg-coffee-50 text-coffee-800 font-bold hover:bg-coffee-200 transition-colors">-</button>
                          <span className="font-bold text-coffee-900 w-4 text-center">{qty}</span>
                          <button onClick={() => setAddonQuantities(prev => ({ ...prev, [product.id]: qty + 1 }))} className="w-8 h-8 flex items-center justify-center rounded-full bg-coffee-50 text-coffee-800 font-bold hover:bg-coffee-200 transition-colors">+</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddonQuantities(prev => ({ ...prev, [product.id]: 1 }))}
                          className="bg-coffee-800 text-white rounded-lg px-3 py-2 text-xs font-bold hover:bg-coffee-900 transition-colors flex items-center gap-1"
                        >
                          <Plus size={14} /> Adaugă
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="p-6 pt-2 border-t border-coffee-100 mt-2 bg-cream/50 rounded-b-3xl">
                <button
                  onClick={handleConfirmAddons}
                  className="w-full bg-gold text-white rounded-xl py-3.5 font-bold hover:bg-yellow-600 transition-colors shadow-sm text-lg"
                >
                  Gata, finalizare
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reviewModalOpen && selectedBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-cream rounded-3xl shadow-2xl max-w-md w-full border border-coffee-200 overflow-hidden"
            >
              <div className="p-6 border-b border-coffee-200 flex justify-between items-center bg-white">
                <div>
                  <h3 className="font-serif font-bold text-xl text-coffee-900">Lasă o recenzie</h3>
                  <p className="text-sm text-coffee-600">{selectedBooking.locationName}</p>
                </div>
                <button onClick={() => setReviewModalOpen(false)} className="bg-cream p-2 rounded-full hover:bg-coffee-50 transition-colors">
                  <X size={20} className="text-coffee-600" />
                </button>
              </div>
              <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-coffee-800 mb-2">Acordă o notă</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          size={32}
                          fill={star <= reviewRating ? "#D4AF37" : "none"}
                          className={star <= reviewRating ? "text-gold" : "text-coffee-200"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-coffee-800 mb-2">Experiența ta</label>
                  <textarea
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    required
                    placeholder="Cum a fost vizita ta?"
                    className="w-full bg-white border border-coffee-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold min-h-[120px] resize-none"
                  />
                </div>
                <button type="submit" className="w-full bg-coffee-800 text-white font-bold py-3.5 rounded-xl hover:bg-coffee-900 transition-colors">
                  Publică Recenzia
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {productReviewModalOpen && selectedProductReview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-cream rounded-3xl shadow-2xl max-w-md w-full border border-coffee-200 overflow-hidden"
            >
              <div className="p-6 border-b border-coffee-200 flex justify-between items-center bg-white">
                <div>
                  <h3 className="font-serif font-bold text-xl text-coffee-900">Recenzie Produs</h3>
                  <p className="text-sm text-coffee-600 truncate max-w-[200px]">{selectedProductReview.name}</p>
                </div>
                <button onClick={() => setProductReviewModalOpen(false)} className="bg-cream p-2 rounded-full hover:bg-coffee-50 transition-colors">
                  <X size={20} className="text-coffee-600" />
                </button>
              </div>
              <form onSubmit={handleSubmitProductReview} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-coffee-800 mb-2">Acordă o notă produsului</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setProductReviewRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          size={32}
                          fill={star <= productReviewRating ? "#D4AF37" : "none"}
                          className={star <= productReviewRating ? "text-gold" : "text-coffee-200"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-coffee-800 mb-2">Părerea ta</label>
                  <textarea
                    value={productReviewText}
                    onChange={e => setProductReviewText(e.target.value)}
                    required
                    placeholder="Cum ți s-a părut produsul?"
                    className="w-full bg-white border border-coffee-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold min-h-[120px] resize-none"
                  />
                </div>
                <button type="submit" className="w-full bg-coffee-800 text-white font-bold py-3.5 rounded-xl hover:bg-coffee-900 transition-colors shadow-sm">
                  Trimite Recenzia
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewingReview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-cream rounded-3xl shadow-2xl max-w-md w-full border border-coffee-200 overflow-hidden"
            >
              <div className="p-6 border-b border-coffee-200 flex justify-between items-center bg-white">
                <div>
                  <h3 className="font-serif font-bold text-xl text-coffee-900">Recenzia ta</h3>
                  <p className="text-sm text-coffee-600 truncate max-w-[250px]">{viewingReview.title}</p>
                </div>
                <button onClick={() => setViewingReview(null)} className="bg-cream p-2 rounded-full hover:bg-coffee-50 transition-colors">
                  <X size={20} className="text-coffee-600" />
                </button>
              </div>
              <div className="p-6 space-y-4 text-center">
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={28}
                      fill={star <= viewingReview.rating ? "#D4AF37" : "none"}
                      className={star <= viewingReview.rating ? "text-gold" : "text-coffee-200"}
                    />
                  ))}
                </div>
                <p className="text-coffee-800 italic bg-white p-4 rounded-xl border border-coffee-100 shadow-sm">"{viewingReview.text}"</p>
                <div className="pt-4">
                  <button onClick={() => setViewingReview(null)} className="w-full bg-coffee-800 text-white font-bold py-3 rounded-xl hover:bg-coffee-900 transition-colors shadow-sm">
                    Închide
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

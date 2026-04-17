import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { getInventory, addOrder, decreaseInventoryQuantity, getProductSalesStats } from '../data/adminData';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export const MarketplacePage = () => {
  const { isLoggedIn, user, addOrderToUser, cart, addToCart, updateCartQty, clearCart, isCartOpen, setIsCartOpen } = useAuth();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState<string>('Toate');

  const inventory = getInventory().filter(i => i.category !== 'Patiserie');

  const categories = ['Toate', ...Array.from(new Set(inventory.map(i => i.category)))];

  const filteredProducts = activeCategory === 'Toate'
    ? inventory
    : inventory.filter(p => p.category === activeCategory);

  const cartTotal = cart.reduce((acc, p) => acc + (p.item.price * p.qty), 0);

  const handleCheckout = () => {
    if (!isLoggedIn || !user) {
      alert("Te rugăm să te autentifici pentru a plasa o comandă.");
      navigate('/auth');
      return;
    }
    if (cart.length === 0) return;

    const orderId = `ord-${Date.now()}`;
    const newOrder = {
      id: orderId,
      type: 'marketplace' as const,
      customerName: user.name,
      details: cart.map(p => `${p.qty}x ${p.item.name}`).join(', '),
      totalPrice: cartTotal,
      status: 'pending' as const,
      date: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    addOrder(newOrder);
    addOrderToUser(newOrder);
    decreaseInventoryQuantity(cart.map(c => ({ id: c.item.id, requestedQuantity: c.qty })));

    clearCart();
    setIsCartOpen(false);
    alert('Comanda a fost plasată cu succes! Vei fi redirecționat către profilul tău.');
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      <Navbar />

      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full flex-1">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-serif font-black text-coffee-900 mb-4 tracking-tight">The Marketplace</h1>
            <p className="text-coffee-600 text-lg max-w-2xl">Echipamente profesionale și cafea proaspăt prăjită adusă direct la tine acasă, din selecția specială The Chic Roastery.</p>
          </div>

          {user?.role !== 'admin' && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-coffee-800 text-white px-6 py-4 rounded-full font-bold shadow-xl hover:bg-coffee-900 transition-all flex items-center gap-3 hover:-translate-y-1 hover:shadow-2xl self-start md:self-auto"
            >
              <ShoppingBag size={20} />
              <span>Coșul meu</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-black border-2 border-[#FDFBF7]">
                  {cart.reduce((ac, c) => ac + c.qty, 0)}
                </span>
              )}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-10 pb-4 border-b border-coffee-100 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeCategory === cat
                  ? 'bg-gold text-white shadow-md'
                  : 'bg-white text-coffee-600 hover:bg-coffee-50 border border-coffee-100'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col border border-coffee-50"
            >
              <Link to={`/marketplace/product/${product.id}`} className="relative h-64 overflow-hidden block">
                <div className="absolute inset-0 bg-coffee-900/10 group-hover:bg-transparent transition-colors z-10" />
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {product.quantity < 5 && product.quantity > 0 && (
                  <span className="absolute top-4 left-4 z-20 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Stoc Limitat
                  </span>
                )}
                {product.quantity === 0 && (
                  <span className="absolute top-4 left-4 z-20 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Stoc Epuizat
                  </span>
                )}
              </Link>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-serif text-xl font-bold text-coffee-900 line-clamp-2">
                    <Link to={`/marketplace/product/${product.id}`} className="hover:text-gold transition-colors">{product.name}</Link>
                  </h3>
                </div>
                <Link to={`/admin/vendor/${product.vendorId}`} className="text-sm font-medium text-coffee-400 hover:text-gold mb-4 inline-block">
                  via {product.vendorName}
                </Link>
                <p className="font-black text-2xl text-coffee-900 mt-auto pt-4 mb-4">{product.price} RON</p>

                {user?.role === 'admin' ? (
                  <div className="mt-auto pt-2 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-coffee-400 border-t border-coffee-50 pt-4">
                      <span>Unități Vândute</span>
                      <span className="text-coffee-900">{getProductSalesStats(product.name, product.price).totalUnits}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-coffee-400 py-1">
                      <span>Venit Total</span>
                      <span className="text-gold">{getProductSalesStats(product.name, product.price).totalRevenue} RON</span>
                    </div>
                    <Link
                      to={`/marketplace/product/${product.id}`}
                      className="w-full mt-4 py-3 rounded-xl font-bold bg-coffee-100 text-coffee-800 hover:bg-coffee-200 transition-colors flex items-center justify-center gap-2"
                    >
                      Performanță Detaliată <ArrowRight size={16} />
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.quantity === 0}
                    className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${product.quantity === 0
                        ? 'bg-coffee-100 text-coffee-400 cursor-not-allowed'
                        : 'bg-coffee-50 text-coffee-900 hover:bg-gold hover:text-white'
                      }`}
                  >
                    <Plus size={18} /> Adaugă în coș
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-coffee-100 flex items-center justify-between bg-coffee-900 text-white">
                <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                  <ShoppingBag /> Coșul Tău
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-coffee-800 rounded-full transition-colors">
                  Închide
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-coffee-400 gap-4">
                    <ShoppingBag size={48} opacity={0.2} />
                    <p>Coșul este gol momentan.</p>
                  </div>
                ) : (
                  cart.map((c) => (
                    <div key={c.item.id} className="flex gap-4 items-center bg-cream p-4 rounded-2xl border border-coffee-50">
                      <img src={c.item.imageUrl} alt={c.item.name} className="w-16 h-16 object-cover rounded-xl shadow-sm" />
                      <div className="flex-1">
                        <h4 className="font-bold text-coffee-900 text-sm line-clamp-1">{c.item.name}</h4>
                        <p className="font-bold text-gold mt-1">{c.item.price * c.qty} RON</p>
                      </div>
                      <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-coffee-100 shadow-sm">
                        <button onClick={() => updateCartQty(c.item.id, -1)} className="text-coffee-400 hover:text-coffee-900"><Minus size={14} /></button>
                        <span className="font-bold text-coffee-900 text-sm w-4 text-center">{c.qty}</span>
                        <button onClick={() => updateCartQty(c.item.id, 1)} className="text-coffee-400 hover:text-coffee-900"><Plus size={14} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-coffee-100 bg-white">
                  <div className="flex justify-between items-end mb-6">
                    <span className="text-coffee-500 font-medium">Total estimat:</span>
                    <span className="text-3xl font-black text-coffee-900">{cartTotal} RON</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gold text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-600 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Mergi la Checkout <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

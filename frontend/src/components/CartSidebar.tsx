import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Plus, Minus, ArrowRight, User, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const CartSidebar = () => {
  const { isLoggedIn, user, cart, updateCartQty, isCartOpen, setIsCartOpen } = useAuth();
  const navigate = useNavigate();

  const [showLoginChoice, setShowLoginChoice] = useState(false);
  const cartTotal = cart.reduce((acc, p) => acc + (p.item.price * p.qty), 0);
  const { pathname } = useLocation();

  useEffect(() => {
    setIsCartOpen(false);
    setShowLoginChoice(false);
  }, [pathname, setIsCartOpen]);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (!isLoggedIn || !user) {
      setShowLoginChoice(true);
      return;
    }

    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[110] shadow-2xl flex flex-col"
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
              {showLoginChoice ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center px-4"
                >
                  <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mb-6">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-2xl font-serif font-black text-coffee-900 mb-2">Finalizare Comandă</h3>
                  <p className="text-coffee-500 mb-8 text-sm leading-relaxed">
                    Ești aproape gata! Recomandăm crearea unui cont pentru a câștiga <b>punctele de loialitate</b> aferente acestei comenzi, dar poți continua și ca vizitator.
                  </p>

                  <div className="w-full space-y-4">
                    <button
                      onClick={() => navigate('/auth')}
                      className="w-full bg-coffee-900 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg"
                    >
                      <User size={18} /> Conectează-te / Înregistrare
                    </button>

                    <button
                      onClick={() => navigate('/checkout')}
                      className="w-full bg-cream text-coffee-700 font-bold py-4 rounded-xl hover:bg-coffee-50 transition-all border border-coffee-100"
                    >
                      Continuă ca Vizitator
                    </button>

                    <button
                      onClick={() => setShowLoginChoice(false)}
                      className="w-full flex items-center justify-center gap-2 text-xs font-bold text-coffee-400 hover:text-coffee-600 transition-colors pt-4"
                    >
                      <ArrowLeft size={14} /> Înapoi la Coș
                    </button>
                  </div>
                </motion.div>
              ) : cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-coffee-400 gap-4">
                  <ShoppingBag size={48} opacity={0.2} />
                  <p>Coșul este gol momentan.</p>
                </div>
              ) : (
                cart.map((c, i) => (
                  <div key={i} className="flex gap-4 items-center bg-cream p-4 rounded-2xl border border-coffee-50">
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

            {!showLoginChoice && cart.length > 0 && (
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
  );
};

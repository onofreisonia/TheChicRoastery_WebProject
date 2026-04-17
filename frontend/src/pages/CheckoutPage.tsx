import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CreditCard, Truck, MapPin, Phone, User,
  ChevronRight, ShieldCheck, CheckCircle, Loader2, Lock
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { addOrder, decreaseInventoryQuantity } from '../data/adminData';

interface Courier {
  id: string;
  name: string;
  price: number;
  time: string;
}

const COURIERS: Courier[] = [
  { id: 'fan', name: 'Fan Courier', price: 19, time: '24-48h' },
  { id: 'dhl', name: 'DHL Express', price: 35, time: '24h' },
  { id: 'personal', name: 'Personal Delivery (Local)', price: 10, time: 'Azi' },
];

export const CheckoutPage = () => {
  const { user, cart, clearCart, addOrderToUser, setIsCartOpen } = useAuth();
  const navigate = useNavigate();
  const redirectTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
  });

  const [selectedCourier, setSelectedCourier] = useState<Courier>(COURIERS[0]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
  });

  useEffect(() => {
    if (user?.role === 'vendor') {
      navigate('/vendor');
      return;
    }
    if (user?.role === 'admin') {
      navigate('/admin');
      return;
    }

    setIsCartOpen(false);
  }, [cart, navigate, isSuccess, setIsCartOpen, user]);

  const subtotal = cart.reduce((acc, p) => acc + (p.item.price * p.qty), 0);
  const total = subtotal + selectedCourier.price;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'card') {
      setIsPaymentModalOpen(true);
      return;
    }

    processFinalOrder();
  };

  const processFinalOrder = () => {
    const orderId = `ord-${Date.now()}`;
    const newOrder = {
      id: orderId,
      type: 'marketplace' as const,
      customerName: formData.name,
      details: cart.map(p => `${p.qty}x ${p.item.name}`).join(', '),
      totalPrice: total,
      status: 'pending' as const,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      paymentMethod,
      deliveryCourier: selectedCourier.name,
      shippingAddress: `${formData.address}, ${formData.city}`,
      contactPhone: formData.phone,
      items: cart.map(c => ({ id: c.item.id, name: c.item.name, qty: c.qty }))
    };

    addOrder(newOrder);
    if (user) {
      addOrderToUser(newOrder);
    }
    decreaseInventoryQuantity(cart.map(c => ({ id: c.item.id, requestedQuantity: c.qty })));

    setIsSuccess(true);
    clearCart();

    redirectTimeoutRef.current = setTimeout(() => {
      navigate(user ? '/profile' : '/marketplace');
    }, 3000);
  };

  const handleSimulatedPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaymentModalOpen(false);
      processFinalOrder();
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[2rem] shadow-xl text-center max-w-md border border-coffee-100"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-500" size={48} />
          </div>
          <h1 className="text-3xl font-serif font-black text-coffee-900 mb-4">Comandă Plasată!</h1>
          <p className="text-coffee-600 mb-8">Mulțumim, {formData.name.split(' ')[0]}! Comanda ta a fost înregistrată și va fi procesată în cel mai scurt timp.</p>
          <div className="flex items-center justify-center gap-2 text-coffee-400 text-sm">
            <Loader2 className="animate-spin" size={16} />
            {user ? 'Te redirecționăm către profilul tău...' : 'Te redirecționăm către marketplace...'}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex-1">

        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Link to="/marketplace" className="inline-flex items-center gap-2 text-coffee-600 hover:text-coffee-900 transition-colors font-medium group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Înapoi la Marketplace
          </Link>

          {!user && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gold/10 border border-gold/20 rounded-2xl p-4 flex items-center gap-4 max-w-md"
            >
              <div className="bg-gold text-white p-2 rounded-xl">
                <Lock size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-coffee-900">Comandă ca vizitator</p>
                <p className="text-xs text-coffee-600">
                  <Link to="/auth" className="text-gold font-bold hover:underline">Autentifică-te</Link> pentru a câștiga puncte de loialitate la această comandă.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          <div className="lg:col-span-7 space-y-8">
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-coffee-50">
              <h2 className="text-2xl font-serif font-black text-coffee-900 mb-6 flex items-center gap-3">
                <MapPin className="text-gold" /> Date de Expediere
              </h2>

              <form id="checkout-form" onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-coffee-900 mb-2 uppercase tracking-wider">Nume Complet</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-300" size={18} />
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ex: Alexandra Ionescu"
                      className="w-full bg-cream border-none rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-gold/20 transition-all font-medium text-coffee-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-coffee-900 mb-2 uppercase tracking-wider">Telefon</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-300" size={18} />
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="07xx xxx xxx"
                      className="w-full bg-cream border-none rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-gold/20 transition-all font-medium text-coffee-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-coffee-900 mb-2 uppercase tracking-wider">Oraș</label>
                  <input
                    required
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="București"
                    className="w-full bg-cream border-none rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-gold/20 transition-all font-medium text-coffee-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-coffee-900 mb-2 uppercase tracking-wider">Adresă de Livrare</label>
                  <input
                    required
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Strada, Număr, Bloc, Apartament"
                    className="w-full bg-cream border-none rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-gold/20 transition-all font-medium text-coffee-900"
                  />
                </div>
              </form>
            </section>

            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-coffee-50">
              <h2 className="text-2xl font-serif font-black text-coffee-900 mb-6 flex items-center gap-3">
                <Truck className="text-gold" /> Metodă de Livrare
              </h2>

              <div className="space-y-3">
                {COURIERS.map((courier) => (
                  <button
                    key={courier.id}
                    onClick={() => setSelectedCourier(courier)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${selectedCourier.id === courier.id
                        ? 'border-gold bg-gold/5 shadow-inner'
                        : 'border-coffee-50 bg-white hover:border-coffee-100'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl ${selectedCourier.id === courier.id ? 'bg-gold text-white' : 'bg-cream text-coffee-400'}`}>
                        <Truck size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-coffee-900">{courier.name}</p>
                        <p className="text-xs text-coffee-500 font-medium">Timp estimat: {courier.time}</p>
                      </div>
                    </div>
                    <span className="font-black text-coffee-900">{courier.price} RON</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-coffee-50">
              <h2 className="text-2xl font-serif font-black text-coffee-900 mb-6 flex items-center gap-3">
                <CreditCard className="text-gold" /> Metodă de Plată
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${paymentMethod === 'cash'
                      ? 'border-coffee-900 bg-coffee-900 text-white shadow-lg'
                      : 'border-coffee-50 bg-white text-coffee-900 hover:border-coffee-100'
                    }`}
                >
                  <div className="p-2 rounded-xl bg-white/10">
                    <User size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Plată la livrare</p>
                    <p className={`text-xs ${paymentMethod === 'cash' ? 'text-coffee-200' : 'text-coffee-400'}`}>Plătești cash curierului</p>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${paymentMethod === 'card'
                      ? 'border-gold bg-gold text-white shadow-lg'
                      : 'border-coffee-50 bg-white text-coffee-900 hover:border-coffee-100'
                    }`}
                >
                  <div className="p-2 rounded-xl bg-white/10">
                    <CreditCard size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Card Bancar ONLINE</p>
                    <p className={`text-xs ${paymentMethod === 'card' ? 'text-yellow-100' : 'text-coffee-400'}`}>Securizat prin The Chic Pay</p>
                  </div>
                </button>
              </div>
            </section>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-coffee-900 text-white rounded-[2rem] p-8 shadow-2xl sticky top-32">
              <h3 className="text-2xl font-serif font-black mb-8 border-b border-white/10 pb-4">Rezumat Comandă</h3>

              <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {cart.map((c, i) => (
                  <div key={i} className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-lg overflow-hidden shrink-0">
                        <img src={c.item.imageUrl} alt={c.item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-sm line-clamp-1">{c.item.name}</p>
                        <p className="text-xs text-white/40">{c.qty} x {c.item.price} RON</p>
                      </div>
                    </div>
                    <span className="font-bold text-gold">{c.item.price * c.qty} RON</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span className="font-bold">{subtotal} RON</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Transport ({selectedCourier.name})</span>
                  <span className="font-bold">{selectedCourier.price} RON</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-4 border-t border-white/10">
                  <span className="text-gold">TOTAL</span>
                  <span className="text-white">{total} RON</span>
                </div>
              </div>

              <button
                form="checkout-form"
                type="submit"
                className="w-full bg-gold hover:bg-yellow-600 text-white font-black py-5 rounded-2xl mt-12 transition-all flex items-center justify-center gap-3 shadow-xl hover:-translate-y-1 active:scale-95"
              >
                {paymentMethod === 'card' ? 'Mergi la Plată' : 'Finalizează Comanda'} <ChevronRight size={20} />
              </button>

              <div className="mt-6 flex items-center justify-center gap-4 opacity-40">
                <Lock size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Secured Check-out System</span>
                <ShieldCheck size={14} />
              </div>
            </div>
          </div>

        </div>
      </div>

      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessing && setIsPaymentModalOpen(false)}
              className="absolute inset-0 bg-coffee-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden relative z-10 border border-coffee-100"
            >
              <div className="bg-gold p-8 text-white text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CreditCard size={32} />
                </div>
                <h3 className="text-2xl font-serif font-black">Plată Securizată</h3>
                <p className="text-yellow-100/60 font-medium">Sumă de plată: {total} RON</p>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-coffee-400 mb-2 uppercase tracking-widest">Număr Card</label>
                  <input
                    type="text"
                    placeholder="xxxx xxxx xxxx xxxx"
                    value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                    className="w-full bg-cream border-none rounded-xl py-3.5 px-4 font-mono text-lg tracking-wider focus:ring-2 focus:ring-gold/20 mr-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-coffee-400 mb-2 uppercase tracking-widest">Expirare</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      className="w-full bg-cream border-none rounded-xl py-3.5 px-4 font-mono focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-coffee-400 mb-2 uppercase tracking-widest">CVC</label>
                    <input
                      type="password"
                      placeholder="***"
                      maxLength={3}
                      value={cardData.cvc}
                      onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                      className="w-full bg-cream border-none rounded-xl py-3.5 px-4 font-mono focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSimulatedPayment}
                  disabled={isProcessing}
                  className="w-full bg-coffee-900 text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg mt-4 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> Se procesează...
                    </>
                  ) : (
                    <>Plătește Acum</>
                  )}
                </button>

                <p className="text-[10px] text-coffee-400 text-center flex items-center justify-center gap-2">
                  <Lock size={10} /> Datele tale sunt criptate SSL și nu sunt stocate.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckoutPage;

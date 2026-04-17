import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Truck, ShieldCheck, Plus, Minus, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getInventory, InventoryItem, getProductSalesStats } from '../data/adminData';

export const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, user } = useAuth();

  const [product, setProduct] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      const p = getInventory().find(i => i.id === id);
      if (!p) navigate('/marketplace');
      else setProduct(p);
    }
  }, [id, navigate]);

  if (!product) return null;

  const stats = getProductSalesStats(product.name, product.price);

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      <Navbar />

      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex-1">

        <div className="mb-8">
          <Link to="/marketplace" className="inline-flex items-center gap-2 text-coffee-600 hover:text-coffee-900 transition-colors font-medium">
            <ArrowLeft size={18} /> Înapoi la Marketplace
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-coffee-100 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="relative rounded-2xl overflow-hidden aspect-square border border-coffee-50 bg-cream">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover absolute inset-0"
              />
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white text-coffee-900 border border-coffee-100 shadow-sm backdrop-blur-sm z-10 transition-colors"><ChevronLeft size={20} /></button>
                <button onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white text-coffee-900 border border-coffee-100 shadow-sm backdrop-blur-sm z-10 transition-colors"><ChevronRight size={20} /></button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setCurrentImageIndex(i)} className={`w-2 h-2 rounded-full transition-colors ${i === currentImageIndex ? 'bg-gold' : 'bg-white/50 backdrop-blur-sm border border-white/50'}`} />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col h-full justify-center">
            <div className="mb-4 flex items-center gap-2">
              <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-gold/20">
                {product.category}
              </span>
              {product.quantity > 0 && product.quantity < 10 && (
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-200">
                  Stoc limitat: {product.quantity}
                </span>
              )}
            </div>

            <h1 className="text-4xl lg:text-5xl font-serif font-black text-coffee-900 mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <p className="text-3xl font-black text-coffee-900">{product.price} RON</p>
              <Link to={`/vendor/${product.vendorId}`} className="text-sm font-medium text-coffee-500 hover:text-gold flex items-center gap-1 transition-colors">
                Furnizor / Vendor: {product.vendorName}
              </Link>
            </div>

            <p className="text-coffee-600 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            {user?.role !== 'admin' && (
              <div className="flex flex-col gap-2 mb-8 border-t border-b border-coffee-50 py-6">
                <p className="text-sm font-bold text-coffee-900 uppercase tracking-widest mb-1">Cantitate</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-cream border border-coffee-200 rounded-xl shadow-inner">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={product.quantity === 0 || quantity <= 1}
                      className="p-3 text-coffee-500 hover:text-coffee-900 transition-colors disabled:opacity-30 disabled:hover:text-coffee-500"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-12 text-center font-black text-coffee-900 text-xl">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      disabled={quantity >= product.quantity}
                      className="p-3 text-coffee-500 hover:text-coffee-900 transition-colors disabled:opacity-30 disabled:hover:text-coffee-500"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <p className="text-sm font-medium text-coffee-400">din {product.quantity} buc. disponibile</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 text-coffee-700">
                <div className="w-10 h-10 rounded-full bg-coffee-50 flex items-center justify-center text-gold">
                  <Truck size={18} />
                </div>
                <span className="font-medium text-sm">Livrare rapidă 24/48h</span>
              </div>
              <div className="flex items-center gap-3 text-coffee-700">
                <div className="w-10 h-10 rounded-full bg-coffee-50 flex items-center justify-center text-gold">
                  <ShieldCheck size={18} />
                </div>
                <span className="font-medium text-sm">Garanția Calității The Chic</span>
              </div>
            </div>

            {user?.role === 'admin' ? (
              <div className="bg-coffee-900 text-white rounded-2xl p-8 shadow-xl mt-4">
                <h3 className="text-lg font-serif font-bold text-gold mb-6 uppercase tracking-widest border-b border-white/10 pb-4">Sales Performance</h3>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Total Unități Vândute</p>
                    <p className="text-3xl font-black">{stats.totalUnits}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Venit Total Generat</p>
                    <p className="text-3xl font-black text-gold">{stats.totalRevenue} <span className="text-sm font-bold">RON</span></p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-white/60">Stoc curent în depozit: <strong>{product.quantity} buc.</strong></span>
                  <Link to="/admin" className="text-xs font-bold text-gold hover:underline">Accesează Inventar Complet</Link>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-lg shadow-sm ${product.quantity === 0
                    ? 'bg-coffee-100 text-coffee-400 cursor-not-allowed'
                    : 'bg-coffee-800 text-white hover:bg-gold hover:shadow-md hover:-translate-y-0.5'
                  }`}
              >
                <ShoppingCart size={20} /> Adaugă în Coș
              </button>
            )}
          </div>
        </div>

        <div className="bg-cream/50 mt-16 py-12 px-8 rounded-3xl border border-coffee-100/50">
          <h3 className="text-3xl font-serif font-black text-coffee-900 mb-8 flex items-center gap-3">
            Părerile Clienților
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map(review => (
                <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-coffee-50 transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-bold text-coffee-900">{review.author}</span>
                    <div className="flex text-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < review.rating ? "currentColor" : "none"}
                          className={i < review.rating ? "text-gold" : "text-coffee-200"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-coffee-600 font-serif italic text-sm leading-relaxed min-h-[60px]">
                    "{review.text}"
                  </p>
                  <p className="text-xs font-bold text-coffee-400 mt-4 text-right uppercase tracking-wider">{review.date}</p>
                </div>
              ))
            ) : (
              <p className="text-coffee-500 italic col-span-full">Acest produs nu are încă recenzii. Adaugă o comandă și fii primul care lasă un review!</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

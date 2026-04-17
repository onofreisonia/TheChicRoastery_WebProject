import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Package, Mail, Clock, AlertCircle, ShoppingCart } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  getVendorById, getInventory, requestRestock,
  Vendor, InventoryItem
} from '../data/adminData';

export const VendorPage = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<InventoryItem[]>([]);
  useEffect(() => {
    if (vendorId) {
      const v = getVendorById(vendorId);
      if (!v) {
        navigate(user?.role === 'admin' ? '/admin' : '/marketplace');
        return;
      }
      setVendor(v);
      setProducts(getInventory().filter(p => p.vendorId === vendorId));
    }
  }, [user, navigate, vendorId]);
  if (!vendor) return null;

  const handleRequestStock = (productId: string) => {
    const updatedInventory = requestRestock(productId);
    setProducts(updatedInventory.filter(p => p.vendorId === vendorId));
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex-1">

        <div className="mb-8">
          {user?.role === 'admin' ? (
            <Link to="/admin" className="inline-flex items-center gap-2 text-coffee-600 hover:text-coffee-900 transition-colors font-medium">
              <ArrowLeft size={18} /> Înapoi la Dashboard Admin
            </Link>
          ) : (
            <Link to="/marketplace" className="inline-flex items-center gap-2 text-coffee-600 hover:text-coffee-900 transition-colors font-medium">
              <ArrowLeft size={18} /> Către Marketplace
            </Link>
          )}
        </div>

        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-coffee-100 flex flex-col lg:flex-row gap-8 items-start mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>

          <div className="w-24 h-24 bg-coffee-800 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg relative z-10">
            <span className="text-4xl font-serif font-black">{vendor.name.charAt(0)}</span>
          </div>

          <div className="flex-1 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl font-serif font-black text-coffee-900 mb-2">{vendor.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-coffee-600">
                  <span className="flex items-center gap-1"><Mail size={16} className="text-gold" /> {vendor.contact}</span>
                  <span className="flex items-center gap-1 font-medium text-gold"><Star size={16} fill="currentColor" /> {vendor.rating} Rating General</span>
                </div>
              </div>
              <span className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-green-100 self-start">Partner Activ</span>
            </div>
            <p className="text-coffee-700 leading-relaxed max-w-3xl text-lg">
              {vendor.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-end justify-between border-b border-coffee-100 pb-4">
              <h2 className="text-2xl font-serif font-bold text-coffee-900 flex items-center gap-3">
                <Package className="text-gold" /> Mărfuri & Echipamente Furnizate
              </h2>
              <span className="text-coffee-500 font-bold">{products.length} repere</span>
            </div>

            <div className="space-y-4">
              {products.map(product => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-coffee-100 flex flex-col md:flex-row justify-between items-center gap-6"
                >
                  <div>
                    <h4 className="font-bold text-coffee-900 text-lg mb-1">{product.name}</h4>
                    <p className="text-sm text-coffee-500 font-medium">Categorie: {product.category} • Preț Intern N/A</p>

                    <div className="mt-3 flex items-center gap-3">
                      {user?.role === 'admin' ? (
                        <>
                          <span className="bg-coffee-50 text-coffee-800 px-3 py-1 rounded-lg text-sm font-bold border border-coffee-100">
                            Stoc: {product.quantity} {product.unit}
                          </span>
                          {product.lowStockAlert && (
                            <span className="text-red-500 text-xs font-bold flex items-center gap-1">
                              <AlertCircle size={14} /> Stoc Critic
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-coffee-600 font-bold">{product.price} RON</span>
                      )}
                    </div>
                  </div>

                  <div className="w-full md:w-auto">
                    {user?.role === 'admin' ? (
                      product.restockRequested ? (
                        <div className="bg-amber-50 text-amber-700 px-5 py-3 rounded-xl text-sm font-bold border border-amber-200 flex items-center justify-center gap-2 w-full">
                          <Clock size={18} /> Cerere În Așteptare
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRequestStock(product.id)}
                          className="bg-coffee-800 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-coffee-900 transition-all flex items-center justify-center gap-2 w-full hover:-translate-y-0.5"
                        >
                          <ShoppingCart size={18} /> Cere Reaprovizionare
                        </button>
                      )
                    ) : (
                      <Link
                        to={`/marketplace/product/${product.id}`}
                        className="bg-gold text-white px-5 py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-yellow-600 transition-all flex items-center justify-center gap-2 w-full hover:-translate-y-0.5"
                      >
                        <ShoppingCart size={18} /> Vezi Produs
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-2xl font-serif font-bold text-coffee-900 mb-6">Recenzii Vendor</h3>

            <div className="space-y-4">
              {vendor.reviews.map(review => (
                <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-coffee-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-coffee-900 text-sm">{review.author}</p>
                      <p className="text-xs text-coffee-400 mt-0.5">{review.date}</p>
                    </div>
                    <div className="flex items-center text-gold">
                      <Star size={14} fill="currentColor" />
                      <span className="ml-1 text-sm font-bold text-coffee-900">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-coffee-700 italic">"{review.text}"</p>
                </div>
              ))}

              {vendor.reviews.length === 0 && (
                <p className="text-coffee-500 text-sm">Nicio recenzie înregistrată momentan.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

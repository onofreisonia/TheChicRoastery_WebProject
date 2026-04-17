import { Link, useLocation } from 'react-router-dom';
import { MapPin, Coffee, ShoppingBag, User, Package, Menu, X, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed w-full z-50 glass-effect border-b border-coffee-200 bg-cream/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-serif font-bold text-coffee-800 tracking-tight">
              The Chic Roastery
            </Link>
          </div>


          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-coffee-600 p-2 hover:bg-coffee-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/locations" className="text-coffee-600 hover:text-coffee-900 transition-colors flex items-center gap-2 font-medium">
              <MapPin size={18} /> Locații
            </Link>
            <Link to="/menu" className="text-coffee-600 hover:text-coffee-900 transition-colors flex items-center gap-2 font-medium">
              <Coffee size={18} /> Meniu
            </Link>
            <Link to="/marketplace" className="text-coffee-600 hover:text-coffee-900 transition-colors flex items-center gap-2 font-medium">
              <ShoppingBag size={18} /> Marketplace
            </Link>
            <Link to="/contact" className="text-coffee-600 hover:text-coffee-900 transition-colors flex items-center gap-2 font-medium">
              <Mail size={18} /> Contact
            </Link>
            {user ? (
              user.role === 'admin' ? (
                <Link to="/admin" className="bg-coffee-800 text-white px-5 py-2.5 rounded-full hover:bg-coffee-900 transition-colors flex items-center gap-2 font-medium shadow-sm">
                  <User size={18} /> Panou Admin
                </Link>
              ) : user.role === 'vendor' ? (
                <Link to="/vendor" className="bg-gold text-white px-5 py-2.5 rounded-full hover:bg-yellow-600 transition-colors flex items-center gap-2 font-medium shadow-sm">
                  <Package size={18} /> Panou Vendor
                </Link>
              ) : (
                <Link to="/profile" className="bg-coffee-800 text-white px-5 py-2.5 rounded-full hover:bg-coffee-900 transition-colors flex items-center gap-2 font-medium shadow-sm">
                  <User size={18} /> Contul Meu
                </Link>
              )
            ) : (
              <Link to="/auth" className="bg-coffee-800 text-white px-5 py-2.5 rounded-full hover:bg-coffee-900 transition-colors flex items-center gap-2 font-medium shadow-sm">
                <User size={18} /> Autentificare
              </Link>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-coffee-100 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-4">
              <Link to="/locations" className="flex items-center gap-4 p-4 rounded-2xl bg-cream text-coffee-800 font-bold">
                <MapPin className="text-gold" /> Locații
              </Link>
              <Link to="/menu" className="flex items-center gap-4 p-4 rounded-2xl bg-cream text-coffee-800 font-bold">
                <Coffee className="text-gold" /> Meniu
              </Link>
              <Link to="/marketplace" className="flex items-center gap-4 p-4 rounded-2xl bg-cream text-coffee-800 font-bold">
                <ShoppingBag className="text-gold" /> Marketplace
              </Link>
              <Link to="/contact" className="flex items-center gap-4 p-4 rounded-2xl bg-cream text-coffee-800 font-bold">
                <Mail className="text-gold" /> Contact
              </Link>

              <div className="pt-4 mt-4 border-t border-coffee-50">
                {user ? (
                  <Link
                    to={user.role === 'admin' ? "/admin" : user.role === 'vendor' ? "/vendor" : "/profile"}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-coffee-900 text-white font-black"
                  >
                    {user.role === 'vendor' ? <Package size={20} /> : <User size={20} />}
                    {user.role === 'admin' ? "Panou Admin" : user.role === 'vendor' ? "Panou Vendor" : "Contul Meu"}
                  </Link>
                ) : (
                  <Link to="/auth" className="flex items-center gap-4 p-4 rounded-2xl bg-coffee-900 text-white font-black">
                    <User size={20} /> Autentificare
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

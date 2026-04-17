import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User as UserIcon, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    redirectTimeoutRef.current = setTimeout(() => {
      if (isLoginView) {
        login(email);
      } else {
        register(name, email);
      }

      if (email.toLowerCase().includes("admin")) {
        navigate('/admin');
      } else if (email.toLowerCase().includes("hario") || email.toLowerCase().includes("sage")) {
        navigate('/vendor');
      } else {
        navigate('/profile');
      }
    }, 1200);
  };

  return (
    <div className="flex min-h-screen bg-cream">

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 text-coffee-600 hover:text-coffee-900 flex items-center gap-2 font-medium transition-colors"
        >
          <ArrowLeft size={20} /> Întoarce-te
        </button>

        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif font-black text-coffee-900 mb-2">
              {isLoginView ? 'Bine ai revenit' : 'Devino Membru'}
            </h1>
            <p className="text-coffee-600">
              {isLoginView
                ? 'Conectează-te pentru a avea acces la setul tău de rezervări și recompense Elite.'
                : 'Creează un cont The Chic și pășește în comunitatea cafelei de specialitate.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative">
            <AnimatePresence mode="popLayout">
              {!isLoginView && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-coffee-700 mb-1">Nume Complet</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-coffee-400" />
                    </div>
                    <input
                      type="text"
                      required={!isLoginView}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 rounded-xl border border-coffee-200 bg-white focus:ring-2 focus:ring-gold focus:border-transparent transition-all sm:text-sm text-coffee-900"
                      placeholder="Ex: Alexandra Ionescu"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-1">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-coffee-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 rounded-xl border border-coffee-200 bg-white focus:ring-2 focus:ring-gold focus:border-transparent transition-all sm:text-sm text-coffee-900"
                  placeholder="vip@thechic.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-coffee-700">Parolă</label>
                {isLoginView && (
                  <a href="#" className="text-xs font-semibold text-gold hover:text-coffee-900 transition-colors">Ai uitat parola?</a>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-coffee-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 rounded-xl border border-coffee-200 bg-white focus:ring-2 focus:ring-gold focus:border-transparent transition-all sm:text-sm text-coffee-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-lg border border-transparent text-sm font-bold text-white bg-coffee-800 hover:bg-coffee-900 hover:shadow-xl focus:outline-none transition-all mt-4 items-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLoginView ? 'Conectează-te' : 'Creează Cont'}
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-coffee-100 text-center">
            <p className="text-sm text-coffee-600">
              {isLoginView ? "Nu deții încă o cartela de membru?" : "Ai deja un cont deschis?"}{' '}
              <button
                onClick={() => {
                  setIsLoginView(!isLoginView);
                  setName('');
                  setPassword('');
                }}
                className="font-bold text-gold hover:text-coffee-900 transition-colors"
                disabled={loading}
              >
                {isLoginView ? 'Creează-ți un cont acum' : 'Conectează-te la contul tău'}
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-coffee-900/30 z-10" />
        <img
          src="https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&q=80&w=2000"
          alt="Coffee Art"
          className="w-full h-full object-cover transform scale-105"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-16 z-20">
          <div className="backdrop-blur-md bg-white/10 p-8 rounded-3xl border border-white/20 shadow-2xl">
            <h2 className="text-3xl font-serif font-bold text-white mb-4 leading-snug">
              "Cafeaua ne unește ideile. Comunitatea ne hrănește inima."
            </h2>
            <p className="text-white/80 font-medium">The Chic Roastery Club</p>
          </div>
        </div>
      </div>
    </div>
  );
};

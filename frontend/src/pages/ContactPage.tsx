import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { MapComponent } from '../components/MapComponent';
import { getLocations } from '../data/locations';
import { contactInfo, updateContactInfo } from '../data/adminData';
import { useAuth } from '../context/AuthContext';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Linkedin, Edit2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ContactPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const locations = getLocations();

  const [formSent, setFormSent] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [info, setInfo] = useState(contactInfo);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    setTimeout(() => {
      setFormSent(false);
    }, 5000);
  };

  const handleSaveInfo = () => {
    updateContactInfo(info);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-gold font-bold tracking-widest uppercase text-sm mb-4 block">Contact</span>
          <h1 className="text-5xl md:text-6xl font-serif font-black text-coffee-900 mb-6">Păstrăm Legătura</h1>
          <p className="text-xl text-coffee-600 max-w-2xl mx-auto">
            Ai o întrebare despre cafeaua noastră de specialitate, vrei să colaborezi cu noi sau doar vrei să ne spui cât de mult ți-a plăcut ultimul espresso? Scrie-ne!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">

          <div className="bg-white p-10 rounded-3xl shadow-xl border border-coffee-100 relative">
            {isAdmin && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-6 right-6 p-3 bg-gold/10 text-gold hover:bg-gold hover:text-white rounded-xl transition-all shadow-sm"
                title="Editează datele comerciale"
              >
                <Edit2 size={20} />
              </button>
            )}

            <h2 className="text-3xl font-serif font-bold text-coffee-900 mb-8">Sediul Central</h2>

            {isEditing ? (
              <div className="space-y-4 mb-8">
                <input
                  type="text" value={info.address} onChange={(e) => setInfo({ ...info, address: e.target.value })}
                  className="w-full bg-cream border border-coffee-200 rounded-xl px-4 py-3 text-coffee-900 font-medium" placeholder="Adresă"
                />
                <input
                  type="text" value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                  className="w-full bg-cream border border-coffee-200 rounded-xl px-4 py-3 text-coffee-900 font-medium" placeholder="Telefon"
                />
                <input
                  type="email" value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })}
                  className="w-full bg-cream border border-coffee-200 rounded-xl px-4 py-3 text-coffee-900 font-medium" placeholder="Email"
                />
                <input
                  type="text" value={info.schedule} onChange={(e) => setInfo({ ...info, schedule: e.target.value })}
                  className="w-full bg-cream border border-coffee-200 rounded-xl px-4 py-3 text-coffee-900 font-medium" placeholder="Orar contact"
                />
                <button
                  onClick={handleSaveInfo}
                  className="w-full bg-gold text-white font-bold py-3 rounded-xl hover:bg-yellow-600 transition-colors"
                >
                  Salvează Modificările
                </button>
              </div>
            ) : (
              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cream rounded-2xl text-gold mt-1"><MapPin size={24} /></div>
                  <div>
                    <h3 className="font-bold text-coffee-900 mb-1">Adresă</h3>
                    <p className="text-coffee-600">{info.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cream rounded-2xl text-gold mt-1"><Phone size={24} /></div>
                  <div>
                    <h3 className="font-bold text-coffee-900 mb-1">Telefon</h3>
                    <p className="text-coffee-600">{info.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cream rounded-2xl text-gold mt-1"><Mail size={24} /></div>
                  <div>
                    <h3 className="font-bold text-coffee-900 mb-1">Email</h3>
                    <p className="text-coffee-600">{info.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cream rounded-2xl text-gold mt-1"><Clock size={24} /></div>
                  <div>
                    <h3 className="font-bold text-coffee-900 mb-1">Program Relații Clienți</h3>
                    <p className="text-coffee-600">{info.schedule}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-8 border-t border-coffee-100">
              <h3 className="font-bold text-coffee-900 mb-4">Urmărește-ne:</h3>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-coffee-50 hover:bg-gold text-coffee-800 hover:text-white rounded-2xl flex items-center justify-center transition-all shadow-sm">
                  <Instagram size={24} />
                </a>
                <a href="#" className="w-12 h-12 bg-coffee-50 hover:bg-gold text-coffee-800 hover:text-white rounded-2xl flex items-center justify-center transition-all shadow-sm">
                  <Facebook size={24} />
                </a>
                <a href="#" className="w-12 h-12 bg-coffee-50 hover:bg-gold text-coffee-800 hover:text-white rounded-2xl flex items-center justify-center transition-all shadow-sm">
                  <Linkedin size={24} />
                </a>
              </div>
            </div>
          </div>

          {isAdmin ? (
            <div className="bg-coffee-900 p-10 rounded-3xl shadow-xl text-white relative overflow-hidden flex flex-col justify-center">
              <div className="w-16 h-16 bg-gold/20 rounded-2xl flex items-center justify-center mb-6">
                <Mail size={32} className="text-gold" />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">Inbox Mesaje Clienți</h2>
              <p className="text-coffee-300 mb-8 leading-relaxed">
                Ca administrator, poți vizualiza toate mesajele primite de la clienți și vendori direct din panoul de control dedicat.
              </p>
              <a
                href="/admin"
                className="inline-flex items-center justify-center gap-3 bg-gold text-white font-black py-4 px-8 rounded-xl text-lg hover:bg-yellow-500 transition-all shadow-lg hover:-translate-y-0.5"
              >
                <Mail size={20} />
                Accesează Inbox Admin
              </a>
              <p className="text-coffee-500 text-xs mt-6 text-center">
                Navighează la <strong className="text-coffee-300">Admin Dashboard → Inbox Vendori</strong>
              </p>
            </div>
          ) : (
            <div className="bg-coffee-900 p-10 rounded-3xl shadow-xl text-white relative overflow-hidden">
              <h2 className="text-3xl font-serif font-bold mb-8">Lasă-ne un mesaj</h2>

              <AnimatePresence>
                {formSent && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="absolute inset-0 bg-green-500 z-10 flex flex-col items-center justify-center p-10 text-center"
                  >
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle size={48} className="text-white" />
                    </div>
                    <h3 className="text-3xl font-serif font-bold mb-4">Mesaj Trimis!</h3>
                    <p className="text-green-50 text-lg">Îți mulțumim că ne-ai contactat. Un reprezentant The Chic Roastery te va contacta în curând.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-coffee-200 mb-2">Nume Complet</label>
                    <input
                      type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-gold outline-none transition-all"
                      placeholder="Ion Popescu"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-coffee-200 mb-2">Adresă Email</label>
                    <input
                      type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-gold outline-none transition-all"
                      placeholder="ion@exemplu.ro"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-coffee-200 mb-2">Subiect</label>
                  <input
                    type="text" required value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-gold outline-none transition-all"
                    placeholder="Vreau să devin vendor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-coffee-200 mb-2">Mesajul tău</label>
                  <textarea
                    rows={5} required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-gold outline-none transition-all resize-none"
                    placeholder="Salutare echipa The Chic Roastery..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold text-white font-black py-4 rounded-xl text-lg hover:bg-yellow-500 transition-all shadow-lg hover:shadow-gold/20 hover:-translate-y-0.5"
                >
                  Trimite Mesajul
                </button>
              </form>
            </div>
          )}

        </div>

        <div className="w-full bg-white p-4 rounded-[2.5rem] shadow-xl border border-coffee-100 overflow-hidden">
          <h2 className="text-3xl font-serif font-bold text-coffee-900 mb-6 px-4 pt-4">Găsește-ne fizic</h2>
          <div className="w-full h-[500px] rounded-3xl overflow-hidden relative z-0">
            <MapComponent locations={locations} />
          </div>
        </div>

      </main>
    </div>
  );
};

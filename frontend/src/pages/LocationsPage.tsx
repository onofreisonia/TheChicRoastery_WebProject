import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Star, Map as MapIcon, ChevronUp } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { MapComponent } from '../components/MapComponent';
import { ImageCarousel } from '../components/ImageCarousel';
import { locations, LocationItem } from '../data/locations';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Edit3 } from 'lucide-react';

const LocationCard = ({ loc }: { loc: LocationItem }) => {
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="bg-white rounded-3xl overflow-hidden shadow-xl border border-coffee-100 flex flex-col w-full mb-16"
    >
      <ImageCarousel images={loc.images} />

      <div className="relative px-8 pt-6">
        <div className="absolute -top-6 right-8">
          {loc.isOpen ? (
            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-md border border-green-200">
              Deschis Acum
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-md border border-red-200">
              Închis momentan
            </span>
          )}
        </div>

        <h2 className="text-4xl font-serif font-bold text-coffee-900 mb-3">{loc.name}</h2>
        <p className="text-coffee-600 mb-6 flex items-center gap-2 text-lg">
          <MapPin size={20} className="text-gold" />
          {loc.addr}
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-gold to-coffee-200 mb-6 rounded-full" />

        <p className="text-coffee-700 text-lg leading-relaxed mb-8">
          {loc.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <button
            onClick={() => navigate(`/reserve/${loc.id}`)}
            className="flex-1 bg-coffee-800 text-white py-4 rounded-xl hover:bg-coffee-900 transition-all font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Rezervă o masă <ArrowRight size={20} />
          </button>

          <button
            onClick={() => navigate(`/menu?loc=${loc.id}`)}
            className="flex-1 bg-coffee-100 text-coffee-800 py-4 rounded-xl hover:bg-coffee-200 transition-all font-semibold text-lg flex items-center justify-center gap-2 shadow-sm"
          >
            Vezi Meniu
          </button>

          <button
            onClick={() => setShowMap(!showMap)}
            className="flex-1 bg-cream text-coffee-800 py-4 rounded-xl hover:bg-coffee-100 transition-all font-semibold text-lg flex items-center justify-center gap-2 shadow-sm border-2 border-coffee-200"
          >
            {showMap ? (
              <><ChevronUp size={20} /> Ascunde Harta</>
            ) : (
              <><MapIcon size={20} /> Vezi Harta</>
            )}
          </button>

          {isAdmin && (
            <button
              onClick={() => navigate(`/admin/location/${loc.id}`)}
              className="flex-1 bg-transparent border-2 border-gold text-coffee-900 py-4 rounded-xl hover:bg-gold hover:text-white transition-all font-semibold text-lg flex items-center justify-center gap-2 order-first sm:order-last sm:flex-none mt-2 sm:mt-0 px-6 shadow-sm"
            >
              <Edit3 size={20} className="text-gold group-hover:text-white" /> Editează Locația
            </button>
          )}
        </div>

        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "400px", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-10 rounded-2xl border-4 border-white shadow-inner bg-coffee-50"
            >
              <MapComponent locations={[loc]} selectedId={loc.id} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-cream/50 px-8 py-10 border-t border-coffee-100">
        <h3 className="text-xl font-serif font-bold text-coffee-900 mb-6 flex items-center gap-3">
          Experiențele Clienților
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loc.reviews.map(review => (
            <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-coffee-50">
              <div className="flex justify-between items-start mb-4">
                <span className="font-semibold text-coffee-800">{review.author}</span>
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
              <p className="text-coffee-600 font-serif italic text-sm leading-relaxed">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const LocationsPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-gold font-bold tracking-widest uppercase text-sm mb-4 block">Portofoliu</span>
          <h1 className="text-5xl md:text-6xl font-serif font-black text-coffee-900 mb-6">Locațiile Noastre</h1>
          <p className="text-xl text-coffee-600 max-w-2xl mx-auto">
            Explorați concept-store-urile noastre create cu meticulozitate pentru a oferi cea mai pură experiență a cafelei de specialitate.
          </p>
        </div>

        <div className="flex flex-col items-center">
          {locations.map((loc) => (
            <LocationCard key={loc.id} loc={loc} />
          ))}
        </div>
      </div>
    </div>
  );
};

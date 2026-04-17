import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { MapComponent } from '../components/MapComponent';
import { locations } from '../data/locations';

const Hero = () => (
  <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/90 to-transparent z-10" />
      <img
        src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop"
        alt="Coffee background"
        className="w-full h-full object-cover"
      />
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <span className="text-gold font-semibold tracking-wider uppercase text-sm mb-4 block">Experiență Premium</span>
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-coffee-900 leading-tight mb-6">
          Arta cafelei de specialitate.
        </h1>
        <p className="text-lg md:text-xl text-coffee-700 mb-10 leading-relaxed max-w-lg">
          Descoperă locațiile noastre chic, rezervă-ți masa preferată și pre-comandă din meniul artizanal sau comandă direct acasă din Marketplace-ul comunității.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 relative z-30">
          <Link to="/locations" className="bg-coffee-800 text-white px-8 py-4 rounded-full text-center hover:bg-coffee-900 transition-all font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Vezi Locațiile
          </Link>
          <Link to="/marketplace" className="bg-white text-coffee-800 border border-coffee-200 px-8 py-4 rounded-full text-center hover:bg-coffee-50 transition-all font-medium text-lg shadow-sm">
            Explorează Marketplace
          </Link>
        </div>
      </motion.div>
    </div>
  </div>
);

const LocationsSection = () => {
  const [startIndex, setStartIndex] = useState(0);

  const nextSlide = () => {
    if (startIndex + 3 < locations.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  const visibleLocations = locations.slice(startIndex, startIndex + 3);

  return (
    <div className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold font-semibold tracking-wider uppercase text-sm mb-3 block">Găsește-ne</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-coffee-900 mb-4">Locațiile Noastre</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"></div>
        </div>

        <div className="relative z-10 px-0 sm:px-6 lg:px-12">
          {locations.length > 3 && startIndex > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-lg text-coffee-800 hover:bg-coffee-50 transition-colors hover:scale-110 border border-cream"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          {locations.length > 3 && startIndex + 3 < locations.length && (
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-lg text-coffee-800 hover:bg-coffee-50 transition-colors hover:scale-110 border border-cream"
            >
              <ChevronRight size={24} />
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {visibleLocations.map((loc) => (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -10 }}
                className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-cream"
              >
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-coffee-900/20 group-hover:bg-transparent transition-colors duration-300 z-10" />
                  <img src={loc.img} alt={loc.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-8 relative">
                  <h3 className="text-2xl font-serif font-bold text-coffee-900 mb-2">{loc.name}</h3>
                  <p className="text-coffee-600 mb-6 flex items-start gap-2 h-12">
                    <MapPin size={18} className="mt-1 flex-shrink-0 text-gold" />
                    {loc.addr}
                  </p>
                  <div className="flex gap-3 mt-4">
                    <Link to={`/reserve/${loc.id}`} className="flex-1 text-center bg-coffee-800 text-white py-2.5 rounded-lg hover:bg-coffee-900 transition-colors font-medium text-sm">
                      Rezervă masă
                    </Link>
                    <Link to={`/menu?loc=${loc.id}`} className="flex-1 text-center border-2 border-coffee-200 text-coffee-800 py-2.5 rounded-lg hover:border-coffee-800 transition-colors font-medium text-sm">
                      Vezi Meniu
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-20 rounded-2xl overflow-hidden h-96 shadow-xl relative border-[4px] border-white">
          <MapComponent locations={locations} />
        </div>
      </div>
    </div>
  );
};

export const Home = () => (
  <div className="min-h-screen bg-cream">
    <Navbar />
    <Hero />
    <LocationsSection />
  </div>
);

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, CakeSlice, CupSoda, MapPin, Grid3x3 } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { menuProducts } from '../data/menu';
import { locations } from '../data/locations';

const categories = ['Toate', 'Cafea', 'Patiserie', 'Specialități Reci'] as const;
type Category = typeof categories[number];

export const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<Category>('Toate');

  const locationParam = searchParams.get('loc') || 'all';

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'all') {
      searchParams.delete('loc');
    } else {
      searchParams.set('loc', val);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = menuProducts.filter(product => {
    const matchCategory = selectedCategory === 'Toate' || product.category === selectedCategory;
    const matchLocation = locationParam === 'all' || product.availableAt.includes(locationParam);
    return matchCategory && matchLocation;
  });

  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case 'Cafea': return <Coffee size={18} />;
      case 'Patiserie': return <CakeSlice size={18} />;
      case 'Specialități Reci': return <CupSoda size={18} />;
      default: return <Grid3x3 size={18} />;
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-gold font-bold tracking-widest uppercase text-sm mb-4 block">Gustul Desăvârșit</span>
          <h1 className="text-5xl md:text-6xl font-serif font-black text-coffee-900 mb-6">Meniul Nostru</h1>
          <p className="text-xl text-coffee-600 max-w-2xl mx-auto">
            Explorați selecția noastră artizanală. Anumite specialități sunt preparate în exclusivitate la anumite prăjitorii din rețea.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-white p-4 rounded-2xl shadow-sm border border-coffee-100">

          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${selectedCategory === cat
                    ? 'bg-coffee-800 text-white shadow-md'
                    : 'bg-cream text-coffee-700 hover:bg-coffee-100'
                  }`}
              >
                {getCategoryIcon(cat)}
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-cream px-4 py-2 rounded-xl border border-coffee-200 w-full md:w-auto">
            <MapPin size={18} className="text-gold" />
            <select
              value={locationParam}
              onChange={handleLocationChange}
              className="bg-transparent border-none text-coffee-900 font-medium focus:ring-0 cursor-pointer outline-none select-none py-1 w-full md:w-48"
            >
              <option value="all">Toate Locațiile</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-coffee-100 shadow-sm">
            <CupSoda size={48} className="mx-auto text-coffee-200 mb-4" />
            <h3 className="text-2xl font-serif text-coffee-800 mb-2">Niciun produs găsit</h3>
            <p className="text-coffee-500">Încearcă să schimbi filtrele sau să alegi altă locație.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-coffee-50 flex flex-col group cursor-pointer"
                >
                  <div className="h-64 overflow-hidden relative">
                    <div className="absolute inset-0 bg-coffee-900/10 group-hover:bg-transparent transition-colors z-10" />
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 z-20">
                      <span className="bg-white/90 backdrop-blur-md text-coffee-900 px-4 py-2 rounded-full font-bold shadow-lg">
                        {product.price} LEI
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <span className="text-gold text-xs font-bold uppercase tracking-wider mb-2">{product.category}</span>
                    <h3 className="text-2xl font-serif font-bold text-coffee-900 mb-4">{product.name}</h3>
                    <p className="text-coffee-600 text-sm leading-relaxed mb-6 flex-1">
                      {product.description}
                    </p>

                    <div className="mt-auto pt-6 border-t border-coffee-100">
                      <p className="text-xs text-coffee-500 font-medium mb-2 uppercase tracking-wide">Disponibil la:</p>
                      <div className="flex flex-wrap gap-2">
                        {product.availableAt.map(locId => {
                          const locName = locations.find(l => l.id === locId)?.name;
                          return (
                            <span key={locId} className="bg-cream text-coffee-700 px-3 py-1 rounded-lg text-xs border border-coffee-200">
                              {locName}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

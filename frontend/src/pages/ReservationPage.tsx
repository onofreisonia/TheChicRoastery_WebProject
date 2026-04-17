import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Clock, CheckCircle2, User, UserPlus, Phone, ArrowLeft } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { locations } from '../data/locations';
import { addBooking, getBookedCount, MAX_CAPACITY } from '../data/bookings';

const TIME_SLOTS = ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"];

export const ReservationPage = () => {
  const { locationId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user, addBookingToUser } = useAuth();
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  const currentHour = new Date().getHours();
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const minDateStr = useMemo(() => {
    const d = new Date();
    if (d.getHours() >= 19) {
      d.setDate(d.getDate() + 1);
    }
    return d.toISOString().split('T')[0];
  }, []);

  const maxDateStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  }, []);

  const [bookingMode, setBookingMode] = useState<'choice' | 'form'>(isLoggedIn ? 'form' : 'choice');
  const [date, setDate] = useState(minDateStr);
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [success, setSuccess] = useState(false);

  const loc = locations.find(l => l.id === locationId) || locations[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time) {
      alert("Te rugăm să selectezi o oră!");
      return;
    }

    if (!isLoggedIn && (!guestName || !guestPhone)) {
      alert("Te rugăm să completezi datele de contact!");
      return;
    }

    const numGuests = parseInt(guests, 10);

    const successBooking = addBooking(loc.id, date, time, numGuests);
    if (!successBooking) {
      alert("A apărut o eroare de suprapunere! Capacitate depășită fix în acest moment. Reîncearcă.");
      return;
    }

    if (isLoggedIn && addBookingToUser) {
      addBookingToUser({
        locationId: loc.id,
        locationName: loc.name,
        date: date,
        time: time,
        guests: numGuests
      });
    }

    setSuccess(true);
    redirectTimeoutRef.current = setTimeout(() => {
      navigate(isLoggedIn ? '/profile' : '/locations');
    }, 4500);
  };

  const parsedGuests = parseInt(guests) || 2;

  const renderTimeSlots = () => {
    if (!date) return <p className="text-sm text-coffee-400 italic">Selectează o dată pentru a vedea orele</p>;

    return (
      <div className="grid grid-cols-3 gap-3">
        {TIME_SLOTS.map(slot => {
          const booked = getBookedCount(loc.id, date, slot);
          const availableSeats = MAX_CAPACITY - booked;
          let isFull = availableSeats < parsedGuests;
          let reasonMsg = 'Indisponibil';

          if (date === todayStr) {
            const slotHour = parseInt(slot.split(':')[0], 10);
            if (slotHour <= currentHour) {
              isFull = true;
              reasonMsg = 'Expirat';
            }
          }

          return (
            <button
              key={slot}
              type="button"
              disabled={isFull}
              onClick={() => setTime(slot)}
              className={`py-2 flex flex-col items-center justify-center rounded-xl text-sm font-bold border-2 transition-all ${isFull
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                  : time === slot
                    ? 'bg-coffee-800 text-white border-coffee-800 shadow-md transform scale-105'
                    : 'bg-white text-coffee-700 border-coffee-200 hover:border-gold hover:text-coffee-900 cursor-pointer'
                }`}
            >
              {slot}
              <span className="block text-[10px] uppercase font-medium mt-0.5 tracking-wider font-sans">
                {isFull ? reasonMsg : `${availableSeats} locuri`}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center">

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl p-6 sm:p-12 text-center border border-coffee-100 max-w-xl w-full"
            >
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle2 size={36} className="text-green-500 sm:hidden" />
                <CheckCircle2 size={48} className="text-green-500 hidden sm:block" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-black text-coffee-900 mb-3 tracking-tight">Rezervare Confirmată!</h2>
              <p className="text-coffee-600 mb-6 text-base sm:text-xl leading-relaxed">
                {isLoggedIn ? `Excelent, ${user?.name.split(' ')[0]}!` : `Mulțumim, ${guestName.split(' ')[0]}!`} Masa ta la <strong>{loc.name}</strong> a fost asigurată pe {date} la ora {time}.
              </p>

              <div className="bg-cream/50 p-4 sm:p-6 rounded-2xl border border-coffee-50 space-y-3 mb-6">
                <p className="text-[10px] font-bold text-coffee-400 uppercase tracking-widest">Detalii Rezervare</p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-8 text-coffee-900 font-black text-sm">
                  <div className="flex items-center gap-2"><Calendar size={16} className="text-gold" /> {date}</div>
                  <div className="flex items-center gap-2"><Clock size={16} className="text-gold" /> {time}</div>
                  <div className="flex items-center gap-2"><Users size={16} className="text-gold" /> {guests} persoane</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-coffee-300 text-sm italic">
                Te redirecționăm imediat...
              </div>
            </motion.div>
          ) : !isLoggedIn && bookingMode === 'choice' ? (
            <motion.div
              key="choice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl space-y-8"
            >
              <div className="text-center space-y-4 mb-12">
                <h1 className="text-5xl font-serif font-black text-coffee-900 leading-tight">Rezervă o masă la<br /><span className="text-gold">{loc.name}</span></h1>
                <p className="text-coffee-600 text-lg">Alege cum dorești să continui rezervarea pentru o experiență optimă.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-white p-8 rounded-[2.5rem] border-2 border-transparent hover:border-gold transition-all text-left group shadow-xl hover:shadow-2xl hover:-translate-y-2"
                >
                  <div className="w-14 h-14 bg-gold text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <UserPlus size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-coffee-900 mb-3">Membru Elite</h3>
                  <p className="text-coffee-500 text-sm leading-relaxed mb-6">Conectează-te pentru a câștiga puncte de loialitate și a păstra istoricul rezervărilor.</p>
                  <div className="inline-flex items-center gap-2 font-black text-gold border-b-2 border-gold/20 pb-1">Loghează-te Acum</div>
                </button>

                <button
                  onClick={() => setBookingMode('form')}
                  className="bg-coffee-900 p-8 rounded-[2.5rem] border-2 border-transparent hover:border-white/20 transition-all text-left group shadow-xl hover:shadow-2xl hover:-translate-y-2 text-white"
                >
                  <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 border border-white/20 group-hover:scale-110 transition-transform">
                    <User size={28} />
                  </div>
                  <h3 className="text-2xl font-black mb-3">Vizitator</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-6">Continuă rapid fără cont. Datele tale nu vor fi salvate pentru beneficii ulterioare.</p>
                  <div className="inline-flex items-center gap-2 font-black text-white border-b-2 border-white/20 pb-1">Rezervă Simplu</div>
                </button>
              </div>

              <div className="flex justify-center pt-8">
                <Link to="/locations" className="text-coffee-400 hover:text-coffee-600 font-bold flex items-center gap-2 transition-colors">
                  <ArrowLeft size={18} /> Înapoi la locații
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] shadow-2xl border border-coffee-100 overflow-hidden w-full"
            >
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-coffee-950/40 z-10" />
                <img src={loc.img} alt={loc.name} className="w-full h-full object-cover scale-110" />
                <div className="absolute bottom-8 left-10 z-20 text-white">
                  <span className="text-gold font-bold tracking-[0.2em] uppercase text-[10px] mb-2 block">The Chic Experience</span>
                  <h1 className="text-3xl font-serif font-black">{loc.name}</h1>
                </div>
                {!isLoggedIn && (
                  <button
                    onClick={() => setBookingMode('choice')}
                    className="absolute top-8 right-10 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-full hover:bg-white/20 transition-all"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
              </div>

              <div className="p-10">
                <form onSubmit={handleSubmit} className="space-y-10">

                  {!isLoggedIn && (
                    <div className="space-y-6 bg-cream/40 p-8 rounded-[2rem] border border-coffee-50 shadow-inner">
                      <h4 className="text-xs font-black text-coffee-400 uppercase tracking-widest flex items-center gap-2">
                        <User size={14} className="text-gold" /> Date de Contact Rezervare
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-black text-coffee-400 mb-2 uppercase tracking-widest pl-2">Nume Complet</label>
                          <input
                            required
                            type="text"
                            value={guestName}
                            onChange={e => setGuestName(e.target.value)}
                            placeholder="Ex: Alexandra Ionescu"
                            className="w-full bg-white border-none rounded-xl px-5 py-4 font-bold text-coffee-900 focus:ring-2 focus:ring-gold/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-coffee-400 mb-2 uppercase tracking-widest pl-2">Telefon</label>
                          <div className="relative">
                            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-300" />
                            <input
                              required
                              type="tel"
                              value={guestPhone}
                              onChange={e => setGuestPhone(e.target.value)}
                              placeholder="07xx xxx xxx"
                              className="w-full bg-white border-none rounded-xl pl-12 pr-5 py-4 font-bold text-coffee-900 focus:ring-2 focus:ring-gold/20"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      <div>
                        <label className="block text-[10px] font-black text-coffee-400 mb-3 uppercase tracking-widest pl-2 flex items-center gap-2">
                          <Calendar size={14} className="text-gold" /> Data Rezervării
                        </label>
                        <input
                          type="date"
                          required
                          min={minDateStr}
                          max={maxDateStr}
                          value={date}
                          onChange={(e) => {
                            setDate(e.target.value);
                            setTime('');
                          }}
                          className="w-full bg-cream border-none font-bold text-coffee-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-gold/20 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-coffee-400 mb-3 uppercase tracking-widest pl-2 flex items-center gap-2">
                          <Users size={14} className="text-gold" /> Număr Persoane
                        </label>
                        <select
                          value={guests}
                          onChange={(e) => {
                            setGuests(e.target.value);
                            setTime('');
                          }}
                          className="w-full bg-cream border-none font-bold text-coffee-900 rounded-xl px-5 py-4 focus:ring-2 focus:ring-gold/20 cursor-pointer appearance-none"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 10, 20].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'persoană' : 'persoane'}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <label className="block text-[10px] font-black text-coffee-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                        <Clock size={14} className="text-gold" /> Ore Disponibile
                      </label>
                      {renderTimeSlots()}
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      className="w-full bg-coffee-900 text-white font-black text-xl py-5 rounded-2xl shadow-xl hover:bg-black hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
                    >
                      Confirmă Experiența <CheckCircle2 size={24} className="text-gold transition-transform group-hover:scale-110" />
                    </button>
                    {!isLoggedIn && (
                      <p className="text-center text-[10px] text-coffee-300 font-bold uppercase tracking-[0.2em] mt-6">
                        Rezervare Securizată by The Chic
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

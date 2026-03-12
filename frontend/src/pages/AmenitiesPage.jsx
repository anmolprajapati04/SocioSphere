import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, AlertCircle, Info, Star, Plus, MapPin, Activity } from 'lucide-react';
import api from '../services/api';
import { getSocket } from '../services/socket';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/ui/Button';

export default function AmenitiesPage() {
  const [amenities, setAmenities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [bookingForm, setBookingForm] = useState({ date: '', startTime: '', endTime: '' });

  function load() {
    setLoading(true);
    const p1 = api.get('/amenities');
    const p2 = api.get('/amenities/bookings');
    
    Promise.all([p1, p2])
      .then(([r1, r2]) => {
        setAmenities(r1.data || []);
        setBookings(r2.data || []);
      })
      .catch(() => {
        setAmenities([]);
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    const socket = getSocket();
    
    const onNewBooking = (booking) => {
      // Need to include Amenity and User relations for the list
      // Since the broadcast might just be the raw booking, we might need a refresh or a targeted fetch
      load(); 
    };

    socket.on('new_amenity_booking', onNewBooking);
    return () => socket.off('new_amenity_booking', onNewBooking);
  }, []);

  function handleBook(e) {
    e.preventDefault();
    if (!selectedAmenity) return;

    const start = new Date(`${bookingForm.date}T${bookingForm.startTime}`);
    const end = new Date(`${bookingForm.date}T${bookingForm.endTime}`);

    api.post('/amenities/book', {
      amenity_id: selectedAmenity.id,
      start_time: start.toISOString(),
      end_time: end.toISOString()
    }).then(() => {
      setSelectedAmenity(null);
      setBookingForm({ date: '', startTime: '', endTime: '' });
      load();
    }).catch(err => {
      alert(err.response?.data?.message || 'Booking failed. This slot might already be reserved.');
    });
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="w-8 h-8 rounded-lg bg-elegant-gold/10 flex items-center justify-center">
              <Star className="w-4 h-4 text-elegant-gold" />
            </div>
            <span className="text-[10px] font-black text-elegant-gold uppercase tracking-[0.2em]">Exclusive Resident Access</span>
          </motion.div>
          <h2 className="text-4xl font-black text-primary-900 tracking-tighter">Society Amenities</h2>
          <p className="text-slate-500 font-medium">Reserve world-class facilities and manage your leisure schedule.</p>
        </div>
        
        <div className="flex bg-white p-2 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
           {['Daily', 'Weekly', 'Monthly'].map(t => (
             <button key={t} className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-900 transition-colors">{t}</button>
           ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           <div className="flex justify-between items-center px-2">
              <h4 className="text-[11px] font-black text-primary-900 uppercase tracking-[0.3em] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-elegant-gold" />
                Select Clubhouse Space
              </h4>
           </div>

           <div className="grid md:grid-cols-2 gap-6">
              <AnimatePresence>
                {amenities.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -8 }}
                    className={`group relative overflow-hidden rounded-[32px] border transition-all cursor-pointer
                      ${selectedAmenity?.id === a.id 
                        ? 'border-elegant-gold bg-elegant-gold/5 shadow-2xl ring-4 ring-elegant-gold/10' 
                        : 'border-slate-100 bg-white hover:border-elegant-gold/30 hover:shadow-xl'}
                    `}
                    onClick={() => a.is_active && setSelectedAmenity(a)}
                  >
                    <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                       <div className="absolute top-4 left-4">
                          <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border
                            ${a.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}
                          `}>
                            {a.is_active ? 'Available' : 'Closed'}
                          </span>
                       </div>
                       <div className="absolute bottom-4 left-6">
                          <h5 className="text-xl font-black text-white tracking-tight">{a.name}</h5>
                          <p className="text-[10px] text-white/70 font-bold uppercase tracking-[0.2em]">Luxury Access</p>
                       </div>
                    </div>
                    
                    <div className="p-6">
                       <div className="flex justify-between items-center mb-6">
                          <div className="flex gap-2">
                             {[1,2,3].map(i => <div key={i} className="w-8 h-1 bg-slate-100 rounded-full group-hover:bg-elegant-gold/20 transition-colors" />)}
                          </div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Max 4 hours/day</span>
                       </div>
                       
                       {a.is_active ? (
                         <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Fee per hour</span>
                               <span className="text-lg font-black text-primary-900 tracking-tighter">₹ 0.00</span>
                            </div>
                            <Button 
                              variant={selectedAmenity?.id === a.id ? 'primary' : 'outline'}
                              className="h-10 px-6 rounded-xl text-[9px] font-black tracking-widest uppercase border-slate-200"
                            >
                              {selectedAmenity?.id === a.id ? 'SELECTED' : 'SELECT SPACE'}
                            </Button>
                         </div>
                       ) : (
                         <div className="flex items-center gap-2 text-rose-500">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Under Maintenance</span>
                         </div>
                       )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </div>

        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {selectedAmenity ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <DashboardCard title="Reserve Space" subtitle={`Booking for ${selectedAmenity.name}`}>
                  <form onSubmit={handleBook} className="space-y-6 mt-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary-900 uppercase tracking-widest pl-1">Preferred Date</label>
                      <input 
                        type="date" 
                        className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 font-bold text-primary-900 focus:ring-2 ring-elegant-gold/20 outline-none transition-all"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={bookingForm.date}
                        onChange={e => setBookingForm(p => ({...p, date: e.target.value}))}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-primary-900 uppercase tracking-widest pl-1">Start Time</label>
                        <input 
                          type="time" 
                          className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 font-bold text-primary-900 focus:ring-2 ring-elegant-gold/20 outline-none transition-all"
                          required
                          value={bookingForm.startTime}
                          onChange={e => setBookingForm(p => ({...p, startTime: e.target.value}))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-primary-900 uppercase tracking-widest pl-1">End Time</label>
                        <input 
                          type="time" 
                          className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 font-bold text-primary-900 focus:ring-2 ring-elegant-gold/20 outline-none transition-all"
                          required
                          value={bookingForm.endTime}
                          onChange={e => setBookingForm(p => ({...p, endTime: e.target.value}))}
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3">
                       <Info className="w-4 h-4 text-primary-400 flex-shrink-0" />
                       <p className="text-[9px] text-slate-500 leading-relaxed font-medium">Please ensure you vacate the space on time for the next resident. Cancellation permitted up to 2 hours before start.</p>
                    </div>

                    <div className="flex gap-4">
                       <Button type="button" variant="secondary" onClick={() => setSelectedAmenity(null)} className="h-14 flex-1 rounded-2xl uppercase text-[10px] font-black">CANCEL</Button>
                       <Button type="submit" className="h-14 flex-1 rounded-2xl uppercase text-[10px] font-black">CONFIRM SLOT</Button>
                    </div>
                  </form>
                </DashboardCard>
              </motion.div>
            ) : (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <DashboardCard title="Your Schedule" subtitle="Live and upcoming reservations">
                   <div className="space-y-4 mt-6">
                      {bookings.length > 0 ? bookings.map((b) => (
                        <div key={b.id} className="p-6 rounded-3xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-elegant-gold/20 transition-all group">
                           <div className="flex justify-between items-start mb-4">
                              <div className="flex gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-primary-900 text-white flex items-center justify-center shadow-lg">
                                    <Calendar className="w-5 h-5" />
                                 </div>
                                 <div>
                                    <p className="font-black text-primary-900 tracking-tight leading-none mb-1">{b.Amenity?.name}</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Conf #RS-{b.id}0{b.id}</p>
                                 </div>
                              </div>
                              <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border bg-emerald-50 text-emerald-600 border-emerald-100`}>
                                CONFIRMED
                              </span>
                           </div>
                           
                           <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                              <div className="flex items-center gap-4">
                                 <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px]">
                                    <Clock className="w-3.5 h-3.5 text-elegant-gold" />
                                    {new Date(b.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                 </div>
                                 <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px]">
                                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                                    {new Date(b.start_time).toLocaleDateString()}
                                 </div>
                              </div>
                              <button className="text-[10px] font-black text-elegant-gold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">MANAGE</button>
                           </div>
                        </div>
                      )) : (
                        <div className="py-20 text-center opacity-30 grayscale">
                           <Calendar className="w-12 h-12 mx-auto text-slate-200 mb-4" />
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No active bookings</p>
                        </div>
                      )}
                   </div>
                </DashboardCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}


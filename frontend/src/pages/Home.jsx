import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ShieldCheck, 
  CreditCard, 
  MessageSquare, 
  Bell, 
  Calendar,
  ChevronRight,
  ArrowRight,
  Star,
  Activity,
  Award,
  Layers,
  Layout,
  Menu,
  X,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// Assets
import heroImg from '../assets/luxury/hero.png';
import poolImg from '../assets/luxury/pool.png';
import clubhouseImg from '../assets/luxury/clubhouse.png';
import gardenImg from '../assets/luxury/garden.png';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { title: 'Visitor Management', icon: Users, desc: 'Digital approvals & secure entry logs.', color: 'gold' },
    { title: 'Maintenance Payments', icon: CreditCard, desc: 'Seamless one-click bill settlement.', color: 'primary' },
    { title: 'Complaint Tracking', icon: MessageSquare, desc: 'Efficient resolution workflow.', color: 'emerald' },
    { title: 'Amenity Booking', icon: Calendar, desc: 'Reserve clubhouses & pools instantly.', color: 'gold' },
    { title: 'Society Notices', icon: Bell, desc: 'Real-time broadcast to all residents.', color: 'primary' },
    { title: 'Community Chat', icon: ShieldCheck, desc: 'Private networking for your society.', color: 'emerald' },
  ];

  const galleryItems = [
    { img: poolImg, title: 'Infinity Pool', tag: 'Leisure' },
    { img: clubhouseImg, title: 'Grand Clubhouse', tag: 'Luxury' },
    { img: gardenImg, title: 'Zen Garden', tag: 'Peace' },
    { img: heroImg, title: 'Apartments', tag: 'Lifestyle' },
  ];

  const stats = [
    { label: 'Societies Managed', value: '450+' },
    { label: 'Residents Connected', value: '75k+' },
    { label: 'Complaints Resolved', value: '150k+' },
    { label: 'Daily Visitors', value: '5k+' },
  ];

  return (
    <div className="bg-white selection:bg-elegant-gold/30 overflow-x-hidden">
      {/* Premium Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${
        isScrolled ? 'bg-white/95 backdrop-blur-3xl py-3 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border-b border-primary-900/5' : 'bg-transparent py-8'
      }`}>
        <div className="container mx-auto px-10 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-primary-900 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
               <ShieldCheck className="w-7 h-7 text-elegant-gold" />
            </div>
            <div className="flex flex-col">
              <span className={`text-2xl font-black tracking-tighter leading-none transition-colors duration-500 ${isScrolled ? 'text-primary-900' : 'text-white'}`}>
                 SOCIO<span className="text-elegant-gold">SPHERE</span>
              </span>
              <span className={`text-[10px] font-bold tracking-[0.3em] uppercase transition-opacity duration-500 ${isScrolled ? 'text-primary-400' : 'text-elegant-gold/60'}`}>Platinum Living</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-4">
            {['Services', 'Gallery', 'About'].map(item => (
               <a key={item} href={`#${item.toLowerCase()}`} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-md ${
                 isScrolled 
                   ? 'bg-slate-100 hover:bg-slate-200 text-primary-900' 
                   : 'bg-white text-primary-900 hover:bg-slate-100'
               }`}>
                 {item}
               </a>
            ))}
            <div className={`h-6 w-px mx-2 transition-colors duration-500 ${isScrolled ? 'bg-slate-200' : 'bg-white/50'}`} />
            {isAuthenticated ? (
               <Link to={`/${user?.role?.toLowerCase()}`}>
                  <Button className="bg-primary-900 text-white border-none shadow-2xl hover:scale-105 px-8 h-12 rounded-xl">MY CONSOLE</Button>
               </Link>
            ) : (
               <div className="flex items-center gap-4">
                  <Link to="/login" className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-md ${
                    isScrolled 
                      ? 'bg-slate-100 hover:bg-slate-200 text-primary-900' 
                      : 'bg-white text-primary-900 hover:bg-slate-100'
                  }`}>
                    Login
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-elegant-gold text-primary-900 border-none font-black px-8 h-12 rounded-xl hover:shadow-[0_0_30px_-5px_#FACC15]">REGISTER</Button>
                  </Link>
               </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ scale, opacity }} className="absolute inset-0 z-0">
          <img src={heroImg} alt="Luxury Society" className="w-full h-full object-cover brightness-[0.4]" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/40 via-transparent to-primary-900/90" />
        </motion.div>

        <div className="container mx-auto px-10 relative z-10 text-center lg:text-left">
           <div className="flex flex-col lg:flex-row items-center gap-20">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="flex-1 max-w-2xl"
              >
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-elegant-gold/10 border border-elegant-gold/20 rounded-full mb-8">
                   <Award className="w-5 h-5 text-elegant-gold" />
                   <span className="text-xs font-black text-elegant-gold tracking-[0.2em] uppercase">The Platinum Standard</span>
                </div>
                <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.95] mb-8 tracking-tighter">
                   Welcome to <br />
                   <span className="text-gradient-gold">SocioSphere</span>
                </h1>
                <p className="text-xl text-white/70 font-medium mb-10 leading-relaxed max-w-xl">
                   Experience smart living like never before. Join India's most prestigious society management 
                   network designed for residents who demand excellence.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <Link to="/signup">
                    <Button size="lg" className="bg-elegant-gold text-primary-900 border-none font-black px-10 h-16 text-lg hover:scale-105 transition-transform">
                       START LIVING SMART
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="border-white/20 text-white h-16 px-10 hover:bg-white/10">
                     EXPLORE FEATURES
                  </Button>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="flex-1 hidden lg:block"
              >
                 <div className="relative">
                    <div className="absolute -inset-4 bg-elegant-gold/20 blur-[100px] rounded-full" />
                    <div className="relative glass-card p-4 rounded-[40px] border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
                       <div className="bg-primary-900 rounded-[32px] overflow-hidden aspect-[16/10] relative group">
                          <video 
                            autoPlay 
                            muted 
                            loop 
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover brightness-75 transition-transform duration-700 group-hover:scale-110"
                            poster={heroImg}
                          >
                            <source src="https://cdn.pixabay.com/video/2021/08/13/84930-588439404_large.mp4" type="video/mp4" />
                          </video>
                          <div className="absolute inset-0 bg-primary-900/20 group-hover:bg-transparent transition-colors" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="w-16 h-16 bg-elegant-gold/90 rounded-full flex items-center justify-center shadow-2xl">
                               <Play className="w-6 h-6 text-primary-900 fill-primary-900 ml-1" />
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </motion.div>
           </div>
        </div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
        >
           <ChevronRight className="w-8 h-8 rotate-90" />
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-slate-50 relative overflow-hidden">
         <div className="container mx-auto px-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
               <span className="text-primary-400 font-black tracking-widest text-xs uppercase mb-4 block">Our Amenities</span>
               <h2 className="text-5xl font-black text-primary-900 tracking-tighter mb-6">Designed for Excellence</h2>
               <div className="h-1.5 w-24 bg-elegant-gold mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
               {features.map((f, i) => (
                  <Card key={i} delay={i * 0.1} className="luxury-card group p-10">
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all group-hover:scale-110 group-hover:rotate-6 
                        ${f.color === 'gold' ? 'bg-elegant-gold/10 text-elegant-gold' : ''}
                        ${f.color === 'primary' ? 'bg-primary-900/10 text-primary-900' : ''}
                        ${f.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                     `}>
                        <f.icon className="w-8 h-8" />
                     </div>
                     <h4 className="text-2xl font-black text-primary-900 mb-4 tracking-tighter">{f.title}</h4>
                     <p className="text-slate-500 font-medium leading-relaxed mb-6">{f.desc}</p>
                     <div className="flex items-center gap-2 text-primary-900 font-bold text-sm tracking-widest group-hover:gap-3 transition-all cursor-pointer">
                        LEARN MORE <ArrowRight className="w-4 h-4" />
                     </div>
                  </Card>
               ))}
            </div>
         </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-32 bg-primary-900">
         <div className="container mx-auto px-10">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-20">
               <div className="max-w-2xl">
                  <span className="text-elegant-gold font-black tracking-widest text-xs uppercase mb-4 block">Visual Journey</span>
                  <h2 className="text-5xl font-black text-white tracking-tighter">Luxury is in the Details</h2>
               </div>
               <Button className="bg-elegant-gold text-primary-900 font-black tracking-widest border-none">VIEW ALL SPACES</Button>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
               {galleryItems.map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -10 }}
                    className="relative rounded-3xl overflow-hidden aspect-[3/4] group cursor-pointer"
                  >
                     <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                     <div className="absolute bottom-8 left-8">
                        <span className="text-elegant-gold text-[10px] font-black tracking-widest uppercase mb-2 block">{item.tag}</span>
                        <h5 className="text-xl font-bold text-white tracking-tight">{item.title}</h5>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
         <div className="container mx-auto px-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
               {stats.map((s, i) => (
                  <div key={i} className="text-center">
                     <h3 className="text-5xl lg:text-6xl font-black text-primary-900 mb-2 tracking-tighter">{s.value}</h3>
                     <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{s.label}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Testimonials section */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-10">
          <div className="text-center mb-20">
            <span className="text-primary-400 font-black tracking-widest text-xs uppercase mb-4 block">Resident Voices</span>
            <h2 className="text-5xl font-black text-primary-900 tracking-tighter mb-6">Platinum Experiences</h2>
            <div className="h-1.5 w-24 bg-elegant-gold mx-auto rounded-full" />
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {[
              { name: 'Sarah Jenkins', role: 'Penthouse Resident', text: 'SocioSphere has completely transformed how we interact with our estate. The security features are world-class.' },
              { name: 'Vikram Malhotra', role: 'Society Chairman', text: 'Management is now effortless. The transparency in maintenance and complaint tracking is exactly what we needed.' },
              { name: 'Elena Rodriguez', role: 'Luxury Resident', text: 'The amenity booking system is so fluid. I can reserve the clubhouse or gym in seconds. Highly recommended.' }
            ].map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="p-10 bg-slate-50 rounded-[40px] border border-slate-100 relative group"
              >
                <div className="flex gap-1 mb-6 text-elegant-gold">
                   {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-xl italic text-slate-600 font-medium mb-8 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary-900 rounded-full flex items-center justify-center text-white font-black text-xl">
                     {t.name[0]}
                  </div>
                  <div>
                    <h5 className="font-black text-primary-900 tracking-tight">{t.name}</h5>
                    <p className="text-xs font-bold text-elegant-gold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-primary-900 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-elegant-gold/50 to-transparent" />
        
        <div className="container mx-auto px-10 pt-32 pb-20">
          <div className="grid lg:grid-cols-4 gap-20 mb-24">
            {/* Column 1: Brand */}
            <div className="col-span-1 lg:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-8 group w-fit">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center transition-all group-hover:bg-elegant-gold/10 group-hover:border-elegant-gold/20">
                  <ShieldCheck className="w-7 h-7 text-elegant-gold" />
                </div>
                <span className="text-2xl font-black text-white tracking-tighter">
                  SOCIO<span className="text-elegant-gold">SPHERE</span>
                </span>
              </Link>
              <p className="text-white/70 font-medium leading-relaxed mb-10">
                Redefining modern community living with premium security and seamless management solutions. The platinum standard in residential excellence.
              </p>
              <div className="flex gap-4">
                {['facebook', 'twitter', 'linkedin', 'instagram'].map(platform => (
                  <div key={platform} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-elegant-gold hover:border-elegant-gold/30 hover:bg-elegant-gold/5 transition-all cursor-pointer">
                    <Activity className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Navigation */}
            <div>
              <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-10">Exploration</h4>
              <ul className="space-y-4">
                {['Services', 'Gallery', 'About Us', 'Contact', 'Privacy Policy'].map(link => (
                  <li key={link}>
                    <a href="#" className="text-white font-bold text-sm hover:text-elegant-gold flex items-center gap-2 group transition-all duration-300">
                      <ChevronRight className="w-3 h-3 text-elegant-gold opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                      <span className="group-hover:translate-x-1 transition-transform">{link}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div>
              <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-10">Headquarters</h4>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-elegant-gold/10 flex-shrink-0 flex items-center justify-center text-elegant-gold">
                    <Activity className="w-4 h-4" />
                  </div>
                  <p className="text-white/80 font-medium text-sm leading-relaxed">
                    101 Luxury Tower, Platinum District,<br />
                    Mumbai, MH 400001
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-elegant-gold/10 flex-shrink-0 flex items-center justify-center text-elegant-gold">
                    <Activity className="w-4 h-4" />
                  </div>
                  <p className="text-white/80 font-medium text-sm">
                    contact@sociosphere.platinum<br />
                    +91 1800-SOCIO-SAFE
                  </p>
                </div>
              </div>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-10">Platinum Insights</h4>
              <p className="text-white/70 font-medium text-sm mb-8 leading-relaxed">
                Subscribe to receive community updates and luxury lifestyle news.
              </p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Your Email Address" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 pl-6 pr-16 text-white font-medium focus:ring-2 ring-elegant-gold/20 outline-none transition-all"
                />
                <button className="absolute right-2 top-2 h-10 w-10 bg-elegant-gold rounded-xl flex items-center justify-center text-primary-900 shadow-lg hover:scale-105 transition-transform">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-500 font-bold text-[10px] tracking-widest uppercase">
              &copy; 2026 SocioSphere Platinum Platforms Inc. All Rights Reserved.
            </p>
            <div className="flex gap-8">
              <span className="text-slate-500 font-bold text-[10px] tracking-widest uppercase cursor-pointer hover:text-white transition-colors">Terms of Service</span>
              <span className="text-slate-500 font-bold text-[10px] tracking-widest uppercase cursor-pointer hover:text-white transition-colors">Cookie Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

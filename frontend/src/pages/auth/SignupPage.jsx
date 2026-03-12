import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, Phone, Home, Building2, ArrowRight, ArrowLeft, Star, Award, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Resident',
    society_name: '',
    society_address: '',
    city: '',
    flat_number: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await signup(formData);
      if (response.ok) {
        const role = response.user.role;
        if (role === 'Admin') navigate('/admin');
        else if (role === 'Security') navigate('/security');
        else navigate('/resident');
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 lg:p-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-elegant-gold/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-primary-900/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-5xl grid lg:grid-cols-5 gap-12 items-start relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block lg:col-span-2 space-y-8"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary-900/10 border border-primary-900/10 rounded-full">
            <Award className="w-5 h-5 text-elegant-gold" />
            <span className="text-xs font-black text-primary-900 tracking-[0.2em] uppercase">Join the Elite Circle</span>
          </div>
          <h1 className="text-6xl font-black text-primary-900 tracking-tighter leading-[0.95]">
            Embark on a <br />
            <span className="text-gradient-gold">New Standard</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Create your account and unlock the full potential of prestigious community living.
          </p>
          <div className="space-y-6 pt-6">
            {[
              { icon: ShieldCheck, text: 'Military-grade visitor security' },
              { icon: Star, text: 'Platinum amenity management' },
              { icon: Home, text: 'Seamless resident networking' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-lg flex items-center justify-center text-elegant-gold">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-600 text-sm tracking-tight">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-3"
        >
          <div className="p-12 bg-white border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-[3rem]">
            <div className="flex justify-between items-center mb-12">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-black text-primary-900 tracking-tighter"
                >
                  Membership Request
                </motion.h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Stage {step} of 2 • Secure Processing</p>
              </div>
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="w-20 h-20 bg-primary-900 rounded-[2rem] flex items-center justify-center shadow-2xl"
              >
                <ShieldCheck className="w-10 h-10 text-elegant-gold" />
              </motion.div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-2xl mb-8"
              >
                <p className="text-red-600 text-sm font-bold text-center flex items-center justify-center gap-2">
                   <AlertCircle className="w-4 h-4" /> {error}
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    className="space-y-8"
                  >
                    <div className="grid md:grid-cols-2 gap-8">
                      <Input label="Full Name" name="name" icon={User} placeholder="Sarah Jenkins" value={formData.name} onChange={handleChange} required className="h-16" />
                      <Input label="Email Address" name="email" type="email" icon={Mail} placeholder="sarah@example.com" value={formData.email} onChange={handleChange} required className="h-16" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <Input label="Mobile Number" name="phone" icon={Phone} placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} required className="h-16" />
                      <Input label="Security Password" name="password" type="password" icon={Lock} placeholder="••••••••" value={formData.password} onChange={handleChange} required className="h-16" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 ml-1">Select Community Tier</label>
                      <div className="grid grid-cols-3 gap-6">
                        {['Resident', 'Admin', 'Security'].map(r => (
                          <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            key={r}
                            type="button"
                            onClick={() => setFormData({ ...formData, role: r })}
                            className={`h-16 rounded-2xl border-2 font-black text-xs tracking-[0.2em] transition-all duration-300 ${
                              formData.role === r ? 'bg-primary-900 border-primary-900 text-white shadow-2xl' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-elegant-gold/50'
                            }`}
                          >
                            {r.toUpperCase()}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    <Button type="button" onClick={nextStep} className="w-full bg-elegant-gold text-primary-900 font-black h-18 rounded-3xl border-none shadow-[0_15px_30px_rgba(250,204,21,0.2)] flex items-center justify-center gap-4 group mt-4">
                      PROCEED TO SOCIETY PROTOCOLS <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    className="space-y-8"
                  >
                    <Input label="Society Name" name="society_name" icon={Building2} placeholder="Royal Palms Residency" value={formData.society_name} onChange={handleChange} required className="h-16" />
                    <Input label="Society Address" name="society_address" icon={MapPin} placeholder="Main Street, Highview Area" value={formData.society_address} onChange={handleChange} required className="h-16" />
                    <div className="grid md:grid-cols-2 gap-8">
                      <Input label="City" name="city" icon={MapPin} placeholder="Mumbai" value={formData.city} onChange={handleChange} required className="h-16" />
                      <Input label="Flat / Unit Number" name="flat_number" icon={Home} placeholder="A-1204" value={formData.flat_number} onChange={handleChange} required className="h-16" />
                    </div>
                    <div className="flex gap-6 pt-4">
                      <Button type="button" onClick={prevStep} variant="outline" className="h-18 px-10 rounded-2xl border-slate-100 text-slate-400 hover:text-primary-900 hover:border-primary-900 transition-all">
                        <ArrowLeft className="w-6 h-6" />
                      </Button>
                      <Button type="submit" disabled={isLoading} className="flex-1 bg-primary-900 text-white font-black h-18 rounded-3xl border-none shadow-[0_15px_30px_rgba(15,23,42,0.3)] flex items-center justify-center gap-4">
                        {isLoading ? <div className="w-7 h-7 border-4 border-elegant-gold border-t-transparent rounded-full animate-spin" /> : 'CONFIRM MEMBERSHIP'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;

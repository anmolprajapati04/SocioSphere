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
      const role = response.user.role;
      if (role === 'Admin') navigate('/admin');
      else if (role === 'Security') navigate('/security');
      else navigate('/resident');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3"
        >
          <div className="luxury-card p-10 bg-white">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-black text-primary-900 tracking-tighter">Membership Request</h2>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Step {step} of 2</p>
              </div>
              <div className="w-14 h-14 bg-primary-900 rounded-2xl flex items-center justify-center shadow-xl">
                <ShieldCheck className="w-8 h-8 text-elegant-gold" />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl mb-8">
                <p className="text-red-600 text-sm font-bold text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <Input label="Full Name" name="name" icon={User} placeholder="Sarah Jenkins" value={formData.name} onChange={handleChange} required className="h-14 font-medium border-slate-100" />
                      <Input label="Email Address" name="email" type="email" icon={Mail} placeholder="sarah@example.com" value={formData.email} onChange={handleChange} required className="h-14 font-medium border-slate-100" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Input label="Mobile Number" name="phone" icon={Phone} placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} required className="h-14 font-medium border-slate-100" />
                      <Input label="Security Password" name="password" type="password" icon={Lock} placeholder="••••••••" value={formData.password} onChange={handleChange} required className="h-14 font-medium border-slate-100" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Select Community Role</label>
                      <div className="grid grid-cols-3 gap-4">
                        {['Resident', 'Admin', 'Security'].map(r => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setFormData({ ...formData, role: r })}
                            className={`h-14 rounded-xl border-2 font-black text-xs tracking-widest transition-all ${
                              formData.role === r ? 'bg-primary-900 border-primary-900 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-elegant-gold'
                            }`}
                          >
                            {r.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button type="button" onClick={nextStep} className="w-full bg-elegant-gold text-primary-900 font-black h-16 rounded-2xl border-none shadow-2xl flex items-center justify-center gap-3">
                      CONTINUE TO SOCIETY DETAILS <ArrowRight className="w-5 h-5" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <Input label="Society Name" name="society_name" icon={Building2} placeholder="Royal Palms Residency" value={formData.society_name} onChange={handleChange} required className="h-14 font-medium border-slate-100" />
                    <Input label="Society Address" name="society_address" icon={MapPin} placeholder="Main Street, Highview Area" value={formData.society_address} onChange={handleChange} required className="h-14 font-medium border-slate-100" />
                    <div className="grid md:grid-cols-2 gap-6">
                      <Input label="City" name="city" icon={MapPin} placeholder="Mumbai" value={formData.city} onChange={handleChange} required className="h-14 font-medium border-slate-100" />
                      <Input label="Flat / Unit Number" name="flat_number" icon={Home} placeholder="A-1204" value={formData.flat_number} onChange={handleChange} required className="h-14 font-medium border-slate-100" />
                    </div>
                    <div className="flex gap-6">
                      <Button type="button" onClick={prevStep} variant="outline" className="h-16 px-8 rounded-2xl border-slate-100 text-slate-400">
                        <ArrowLeft className="w-5 h-5" />
                      </Button>
                      <Button type="submit" disabled={isLoading} className="flex-1 bg-primary-900 text-white font-black h-16 rounded-2xl border-none shadow-2xl flex items-center justify-center gap-3">
                        {isLoading ? <div className="w-6 h-6 border-4 border-elegant-gold border-t-transparent rounded-full animate-spin" /> : 'COMPLETE REGISTRATION'}
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

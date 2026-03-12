import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await login({ email, password });
      if (response.ok) {
        const role = response.user.role;
        if (role === 'Admin') navigate('/admin');
        else if (role === 'Security') navigate('/security');
        else navigate('/resident');
      } else {
        setError(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 lg:p-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-elegant-gold/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-primary-900/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block space-y-10"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary-900/10 border border-primary-900/10 rounded-full">
            <Star className="w-5 h-5 text-elegant-gold fill-elegant-gold" />
            <span className="text-xs font-black text-primary-900 tracking-[0.2em] uppercase">Elite Member Access</span>
          </div>
          <h1 className="text-7xl font-black text-primary-900 tracking-tighter leading-[0.9]">
            Welcome Back to <br />
            <span className="text-gradient-gold">SocioSphere</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-md leading-relaxed">
            Resume your premium living experience. Secure, efficient, and sophisticated society management.
          </p>
          <div className="flex items-center gap-4 py-6 border-y border-slate-200 w-fit">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full bg-slate-200 border-4 border-slate-50 flex items-center justify-center text-xs font-black">U{i}</div>
              ))}
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Joined by 75,000+ Elite Residents</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="lg:col-span-1"
        >
          <div className="p-12 bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem]">
            <div className="flex flex-col items-center mb-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="w-20 h-20 bg-primary-900 rounded-[2rem] flex items-center justify-center shadow-2xl mb-6 relative"
              >
                <div className="absolute inset-0 bg-elegant-gold/20 rounded-[2rem] animate-pulse" />
                <ShieldCheck className="w-10 h-10 text-elegant-gold relative z-10" />
              </motion.div>
              <h2 className="text-4xl font-black text-primary-900 tracking-tighter">Elite Login</h2>
              <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Authentication Required</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="p-4 bg-red-50 border border-red-100 rounded-2xl mb-8 overflow-hidden"
              >
                <p className="text-red-600 text-sm font-bold text-center flex items-center justify-center gap-2">
                  <Star className="w-4 h-4" /> {error}
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Registered Email"
                icon={Mail}
                type="email"
                placeholder="resident@sociosphere.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-16"
              />
              <div className="space-y-2">
                <Input
                  label="Security Password"
                  icon={Lock}
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-16"
                />
                <div className="flex justify-end">
                  <Link to="#" className="text-[10px] font-black text-elegant-gold uppercase tracking-[0.2em] hover:text-primary-900 transition-colors">Recover Access</Link>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group py-2">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-primary-900 focus:ring-primary-900 transition-all cursor-pointer" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-primary-900 transition-colors">Authorize terminal session</span>
              </label>

              <Button 
                type="submit" 
                className="w-full bg-primary-900 text-white font-black h-18 rounded-[1.5rem] border-none shadow-[0_15px_30px_rgba(15,23,42,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-elegant-gold border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    ENTER CONSOLE
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-12 text-center pt-8 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                New Prospect? 
                <Link to="/signup" className="text-elegant-gold font-black hover:text-primary-900 ml-2 underline underline-offset-4 decoration-2 decoration-elegant-gold/30 hover:decoration-primary-900/100 transition-all">Request Membership</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;

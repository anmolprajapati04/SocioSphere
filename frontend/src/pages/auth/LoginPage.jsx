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
      const response = await login(email, password);
      const role = response.user.role;
      if (role === 'Admin') navigate('/admin');
      else if (role === 'Security') navigate('/security');
      else navigate('/resident');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="luxury-card p-12 bg-white">
            <div className="flex flex-col items-center mb-10">
              <div className="w-16 h-16 bg-primary-900 rounded-2xl flex items-center justify-center shadow-2xl mb-6">
                <ShieldCheck className="w-9 h-9 text-elegant-gold" />
              </div>
              <h2 className="text-3xl font-black text-primary-900 tracking-tighter">Secure Sign In</h2>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 border border-red-100 rounded-xl mb-8">
                <p className="text-red-600 text-sm font-bold text-center">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                icon={Mail}
                type="email"
                placeholder="elitemember@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 font-medium border-slate-100 text-primary-900"
              />
              <div className="space-y-2">
                <Input
                  label="Password"
                  icon={Lock}
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-14 font-medium border-slate-100 text-primary-900"
                />
                <div className="flex justify-end">
                  <Link to="#" className="text-xs font-black text-elegant-gold uppercase tracking-widest hover:text-gold-600 transition-colors">Forgot Password?</Link>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-elegant-gold focus:ring-elegant-gold transition-all" />
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest group-hover:text-primary-900 transition-colors">Remember my access</span>
              </label>

              <Button 
                type="submit" 
                className="w-full bg-primary-900 text-white font-black h-16 rounded-2xl border-none shadow-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-elegant-gold border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    ENTER DASHBOARD
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                New to the community? <br className="lg:hidden" />
                <Link to="/signup" className="text-elegant-gold font-black hover:text-gold-600 ml-2">Request Access</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, History, AlertCircle, CheckCircle2, Receipt, Download, ArrowUpRight, TrendingUp } from 'lucide-react';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/ui/Button';

export default function MaintenancePage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  function handlePay(id) {
    api.post(`/maintenance/payments/${id}/pay`)
      .then(() => {
        load();
      })
      .catch((err) => {
        console.error('Payment failed', err);
      });
  }

  function load() {
    setLoading(true);
    api
      .get('/maintenance/payments')
      .then((r) => setPayments(r.data || []))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  const totalDue = payments.filter(p => p.status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Financial Transparency Active</span>
          </motion.div>
          <h2 className="text-4xl font-black text-primary-900 tracking-tighter">Maintenance Ledger</h2>
          <p className="text-slate-500 font-medium">Manage your association dues and view payment history.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
           <div className="px-6 py-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Outstanding</p>
              <h4 className="text-2xl font-black text-primary-900 tracking-tighter">₹ {totalDue.toLocaleString()}</h4>
           </div>
           {totalDue > 0 && (
              <Button size="lg" className="h-14 px-8 rounded-xl shadow-lg hover:scale-105 transition-all">
                PAY ALL DUES
              </Button>
           )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h4 className="text-[11px] font-black text-primary-900 uppercase tracking-[0.3em] flex items-center gap-2">
            <Receipt className="w-4 h-4 text-elegant-gold" />
            Current Billing Cycle
          </h4>
          
          <AnimatePresence mode="popLayout">
            {payments.filter(p => p.status === 'PENDING').map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:border-elegant-gold/20 transition-all"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary-900 flex items-center justify-center text-white shadow-lg">
                      <CreditCard className="w-8 h-8" />
                    </div>
                    <div>
                      <h5 className="text-xl font-black text-primary-900 tracking-tight mb-1">Maintenance Bill #SY-{p.id}</h5>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Billing Period: {new Date(p.due_date).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-100 mb-2">
                      <AlertCircle className="w-3 h-3" /> PENDING
                    </span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due by {new Date(p.due_date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-slate-50">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Base Amount</p>
                    <p className="text-lg font-black text-primary-900 tracking-tighter">₹ {p.amount - 500}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Amenity Charges</p>
                    <p className="text-lg font-black text-primary-900 tracking-tighter">₹ 350</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Utility Fund</p>
                    <p className="text-lg font-black text-primary-900 tracking-tighter">₹ 150</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Payable</p>
                    <p className="text-2xl font-black text-primary-900 tracking-tighter">₹ {p.amount}</p>
                  </div>
                </div>

                <div className="mt-8 flex justify-between items-center">
                  <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-900 flex items-center gap-1.5 transition-colors">
                    <Download className="w-3.5 h-3.5" /> DOWNLOAD INVOICE
                  </button>
                  <Button 
                    onClick={() => handlePay(p.id)}
                    className="px-10 h-14 rounded-2xl bg-elegant-gold text-primary-900 font-black tracking-widest text-[11px] shadow-lg shadow-elegant-gold/20"
                  >
                    COMPLETE PAYMENT
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {!payments.filter(p => p.status === 'PENDING').length && !loading && (
            <div className="p-12 bg-emerald-50/50 rounded-[40px] border border-dashed border-emerald-100 text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                 <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h5 className="text-xl font-black text-emerald-900 tracking-tight mb-2">Account is Clear</h5>
              <p className="text-emerald-700/70 font-medium">All your maintenance dues have been settled for this period.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h4 className="text-[11px] font-black text-primary-900 uppercase tracking-[0.3em] flex items-center gap-2">
            <History className="w-4 h-4 text-elegant-gold" />
            Payment History
          </h4>
          
          <DashboardCard className="p-0 overflow-hidden">
             <div className="divide-y divide-slate-50">
                {payments.filter(p => p.status === 'PAID').map((p) => (
                  <div key={p.id} className="p-6 hover:bg-slate-50 transition-colors flex justify-between items-center group">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-primary-900 tracking-tight leading-none mb-1">Payment Successful</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date: {new Date(p.payment_date || Date.now()).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-primary-900 tracking-tight">₹ {p.amount}</p>
                      <button className="text-[8px] font-black text-elegant-gold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">RECEIPT</button>
                    </div>
                  </div>
                ))}
                {!payments.filter(p => p.status === 'PAID').length && (
                  <div className="p-10 text-center opacity-50 grayscale">
                    <History className="w-10 h-10 mx-auto text-slate-200 mb-3" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">No history found</p>
                  </div>
                )}
             </div>
             <button className="w-full py-4 text-[9px] font-black text-primary-400 uppercase tracking-[0.2em] bg-slate-50/50 hover:bg-slate-50 transition-colors">
               VIEW FULL STATEMENT
             </button>
          </DashboardCard>

          <DashboardCard title="Tax Benefits" subtitle="80C certificates" className="bg-primary-900 text-white border-none">
             <p className="text-xs text-white/60 mb-6 leading-relaxed">Download your annual maintenance contribution certificates for tax declarations.</p>
             <Button variant="secondary" className="w-full h-12 rounded-xl text-[10px] font-black tracking-widest uppercase">DOWNLOAD FY 25-26</Button>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}


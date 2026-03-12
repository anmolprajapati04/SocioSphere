import { useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Send, Users, ShieldCheck, MoreHorizontal, MessageSquare, Search, Plus, Phone, Video, Info } from 'lucide-react';
import api from '../services/api';
import { getSocket } from '../services/socket';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/ui/Button';

export default function ChatPage() {
  const [groups, setGroups] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const activeGroup = useMemo(
    () => groups.find((g) => g.id === activeGroupId),
    [groups, activeGroupId]
  );

  useEffect(() => {
    setLoading(true);
    api
      .get('/chat/groups')
      .then((r) => {
        setGroups(r.data || []);
        if (r.data?.length) setActiveGroupId(r.data[0].id);
      })
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeGroupId) return;
    api
      .get('/chat/messages', { params: { group_id: activeGroupId } })
      .then((r) => setMessages(r.data || []))
      .catch(() => setMessages([]));
  }, [activeGroupId]);

  useEffect(() => {
    const socket = getSocket();
    const onMsg = (payload) => {
      if (payload?.group_id === activeGroupId) {
        setMessages((prev) => [...prev, payload]);
      }
    };
    socket.on('chat_message', onMsg);
    return () => socket.off('chat_message', onMsg);
  }, [activeGroupId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function send() {
    const body = text.trim();
    if (!body || !activeGroupId) return;
    api
      .post('/chat/messages', { group_id: activeGroupId, body })
      .then((r) => {
        setText('');
        // Emission is now handled by the back-end controller for consistency
      })
      .catch(() => {});
  }

  return (
    <div className="space-y-6 pb-10 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-1"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Encrypted Community Network</span>
          </motion.div>
          <h2 className="text-3xl font-black text-primary-900 tracking-tighter leading-none mb-1">Community Workspace</h2>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black text-primary-900 uppercase overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-900 flex items-center justify-center text-[8px] font-black text-elegant-gold uppercase">
                +42
              </div>
           </div>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">46 Members Online</span>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 flex flex-col gap-6">
           <DashboardCard className="p-0 overflow-hidden flex flex-col flex-1 border-none shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
              <div className="p-6 border-b border-slate-50">
                 <div className="relative mb-4">
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <input className="w-full h-11 bg-slate-50 rounded-xl pl-11 pr-4 text-xs font-bold text-primary-900 focus:ring-2 ring-elegant-gold/20 outline-none transition-all" placeholder="Search Channels..." />
                 </div>
                 <div className="flex justify-between items-center">
                    <h5 className="text-[10px] font-black text-primary-900 uppercase tracking-[0.3em]">Channels</h5>
                    <button className="w-6 h-6 bg-slate-50 rounded-lg flex items-center justify-center hover:bg-elegant-gold hover:text-white transition-all">
                       <Plus className="w-3.5 h-3.5" />
                    </button>
                 </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                 {groups.map((g) => (
                   <button
                     key={g.id}
                     onClick={() => setActiveGroupId(g.id)}
                     className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all group
                       ${g.id === activeGroupId 
                         ? 'bg-primary-900 text-white shadow-xl shadow-primary-900/20 pointer-events-none' 
                         : 'text-slate-500 hover:bg-slate-50'}
                     `}
                   >
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                       ${g.id === activeGroupId ? 'bg-elegant-gold/20 text-elegant-gold' : 'bg-slate-100 text-slate-400 group-hover:bg-elegant-gold/10 group-hover:text-elegant-gold'}
                     `}>
                        <Hash className="w-5 h-5" />
                     </div>
                     <div className="text-left flex-1 min-w-0">
                        <p className={`text-sm font-black tracking-tight leading-none mb-1 truncate ${g.id === activeGroupId ? 'text-white' : 'text-primary-900'}`}>{g.name}</p>
                        <p className={`text-[9px] font-bold uppercase tracking-widest ${g.id === activeGroupId ? 'text-white/40' : 'text-slate-400'}`}>{g.type}</p>
                     </div>
                     {g.id === activeGroupId && <div className="w-1.5 h-1.5 rounded-full bg-elegant-gold animate-pulse" />}
                   </button>
                 ))}
              </div>
           </DashboardCard>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
           <DashboardCard className="p-0 flex flex-col flex-1 border-none shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100 overflow-hidden">
              {/* Header */}
              <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-10">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-elegant-gold">
                       <Hash className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="text-xl font-black text-primary-900 tracking-tight leading-none mb-1">{activeGroup?.name || 'Community Hub'}</h4>
                       <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Broadcasting</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-2">
                    <button className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary-900 transition-all">
                       <Search className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary-900 transition-all">
                       <Phone className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary-900 transition-all">
                       <Info className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-slate-100 mx-2" />
                    <button className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary-900 transition-all">
                       <MoreHorizontal className="w-5 h-5" />
                    </button>
                 </div>
              </div>

              {/* Messages Container */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth scrollbar-chat"
              >
                 <AnimatePresence mode="popLayout">
                    {messages.map((m, i) => {
                       const isSystem = m.sender_id === 0;
                       const isMe = false; // Need auth context to know if it's me

                       return (
                          <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`flex ${isSystem ? 'justify-center' : 'justify-start'} group`}
                          >
                             {!isSystem && (
                                <div className="w-10 h-10 rounded-xl bg-slate-100 mr-4 mt-1 flex-shrink-0 overflow-hidden">
                                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.sender_id}`} alt="" />
                                </div>
                             )}
                             
                             <div className={`flex flex-col ${isSystem ? 'items-center w-full max-w-lg' : 'items-start max-w-[70%]'}`}>
                                {!isSystem && (
                                   <div className="flex items-center gap-3 mb-2 px-1">
                                      <span className="text-[11px] font-black text-primary-900 uppercase tracking-widest leading-none">
                                         {m.Sender?.name || `Resident ID:${m.sender_id}`}
                                      </span>
                                      <span className="text-[9px] text-slate-300 font-bold uppercase">
                                         {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                      </span>
                                   </div>
                                )}
                                
                                <div className={`relative px-6 py-4 rounded-3xl text-sm leading-relaxed border shadow-sm transition-all group-hover:shadow-md
                                   ${isSystem 
                                     ? 'bg-slate-50 border-slate-100 text-slate-500 italic text-[11px] text-center w-full' 
                                     : 'bg-white border-slate-100 text-slate-700 font-medium'}
                                `}>
                                   {m.body}
                                </div>
                             </div>
                          </motion.div>
                       );
                    })}
                 </AnimatePresence>
                 
                 {!messages.length && !loading && (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20">
                       <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mb-6">
                          <MessageSquare className="w-10 h-10 text-slate-200" />
                       </div>
                       <h5 className="text-xl font-black text-primary-900 mb-2">The Channel is Quiet</h5>
                       <p className="text-sm text-slate-400 font-medium max-w-xs leading-relaxed">Encryption status: Active. Send a message to start the conversation.</p>
                    </div>
                 )}
              </div>

              {/* Input Area */}
              <div className="p-8 bg-slate-50/50 backdrop-blur-md border-t border-slate-100">
                 <div className="relative flex items-center gap-4">
                    <button className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-elegant-gold hover:border-elegant-gold transition-all shadow-sm">
                       <Plus className="w-6 h-6" />
                    </button>
                    <div className="flex-1 relative">
                       <input
                         className="w-full h-12 bg-white border border-slate-200 rounded-2xl px-6 text-sm font-bold text-primary-900 focus:ring-4 ring-elegant-gold/10 outline-none transition-all placeholder:text-slate-300 shadow-sm"
                         value={text}
                         onChange={(e) => setText(e.target.value)}
                         placeholder="Craft a message to the community..."
                         onKeyDown={(e) => {
                           if (e.key === 'Enter') send();
                         }}
                       />
                       <div className="absolute right-4 top-3 flex items-center gap-2">
                          <button className="p-1 hover:bg-slate-50 rounded-lg transition-all">
                             <TrendingUp className="w-4 h-4 text-slate-300" />
                          </button>
                       </div>
                    </div>
                    <Button 
                      onClick={send}
                      disabled={!text.trim()}
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-all
                        ${text.trim() ? 'bg-primary-900 text-elegant-gold hover:scale-110 active:scale-95' : 'bg-slate-200 text-white cursor-not-allowed opacity-50'}
                      `}
                    >
                       <Send className="w-5 h-5" />
                    </Button>
                 </div>
              </div>
           </DashboardCard>
        </div>
      </div>
    </div>
  );
}


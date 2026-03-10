import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';
import { getSocket } from '../services/socket';

export default function ChatPage() {
  const [groups, setGroups] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const activeGroup = useMemo(
    () => groups.find((g) => g.id === activeGroupId),
    [groups, activeGroupId]
  );

  useEffect(() => {
    api
      .get('/chat/groups')
      .then((r) => {
        setGroups(r.data || []);
        if (r.data?.length) setActiveGroupId(r.data[0].id);
      })
      .catch(() => setGroups([]));
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

  function send() {
    const body = text.trim();
    if (!body || !activeGroupId) return;
    api
      .post('/chat/messages', { group_id: activeGroupId, body })
      .then((r) => {
        setText('');
        const socket = getSocket();
        socket.emit('chat_message', r.data);
      })
      .catch(() => {});
  }

  return (
    <div>
      <h2 className="page-title">Society Chat</h2>
      <p className="page-subtitle">Real-time group chat with announcements and community updates.</p>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '320px 1fr' }}>
        <DashboardCard title="Groups" subtitle="Society & custom groups">
          <div style={{ display: 'grid', gap: '0.45rem' }}>
            {groups.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setActiveGroupId(g.id)}
                style={{
                  textAlign: 'left',
                  borderRadius: '0.9rem',
                  padding: '0.6rem 0.75rem',
                  border: '1px solid #e5e7eb',
                  background: g.id === activeGroupId ? 'rgba(47,128,237,0.08)' : '#fff',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontWeight: 600 }}>{g.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{g.type}</div>
              </button>
            ))}
            {!groups.length && <div style={{ color: '#6b7280' }}>No groups yet.</div>}
          </div>
        </DashboardCard>

        <DashboardCard title={activeGroup ? activeGroup.name : 'Messages'} subtitle="Live updates">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', height: 420 }}>
            <div style={{ flex: 1, overflow: 'auto', paddingRight: '0.25rem' }}>
              {messages.map((m) => (
                <div key={m.id} style={{ marginBottom: '0.6rem' }}>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    User #{m.sender_id} · {new Date(m.createdAt || Date.now()).toLocaleTimeString()}
                  </div>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '1rem',
                      background: 'rgba(86,204,242,0.18)',
                      border: '1px solid rgba(47,128,237,0.18)',
                      marginTop: '0.25rem',
                    }}
                  >
                    {m.body}
                  </div>
                </div>
              ))}
              {!messages.length && <div style={{ color: '#6b7280' }}>Start the conversation.</div>}
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <input
                className="form-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message…"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') send();
                }}
              />
              <button type="button" className="btn-primary" style={{ width: 'auto' }} onClick={send}>
                Send
              </button>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}


import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Send, Clock } from 'lucide-react';
import storage from '../utils/storage';
import supportService from '../utils/supportService';
import ConsentGate from './ConsentGate';

const LOCAL_MESSAGES_KEY = 'sp_support_local_messages';

const ChatWidget = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [threadId] = useState(() => supportService.getSupportThreadId());
  const [messages, setMessages] = useState(() => storage.get(LOCAL_MESSAGES_KEY, []));
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [sentToast, setSentToast] = useState('');

  useEffect(() => {
    storage.set(LOCAL_MESSAGES_KEY, messages);
  }, [messages]);

  useEffect(() => {
    if (!open) return undefined;

    let active = true;
    const loadMessages = async () => {
      try {
        const remoteMessages = await supportService.listSupportMessages(threadId);
        if (active && Array.isArray(remoteMessages) && remoteMessages.length) {
          setMessages(remoteMessages);
        }
      } catch (error) {
        // keep local history when backend is unavailable
      }
    };

    loadMessages();
    const timer = setInterval(loadMessages, 4000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [open, threadId]);

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)),
    [messages]
  );

  const sendMessage = async () => {
    const value = input.trim();
    if (!value || !consentChecked) return;

    const optimistic = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: value,
      senderName: 'You',
      createdAt: new Date().toISOString(),
      status: 'sent'
    };

    setMessages((prev) => [...prev, optimistic]);
    setInput('');
    setIsSending(true);
    setSentToast('');

    try {
      await supportService.sendSupportMessage({
        threadId,
        message: value,
        senderName: 'Website user'
      });
      setSentToast(t('chatbot.sent'));
      setTimeout(() => setSentToast(''), 2000);
    } catch (error) {
      setSentToast('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999]">
      {open && (
        <div className="w-[380px] max-w-[92vw] rounded-2xl shadow-2xl overflow-hidden border border-[var(--sp-border)] bg-[var(--sp-surface)]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--sp-border)]">
            <div>
              <span className="font-black uppercase text-sm block">{t('chatbot.title')}</span>
              <span className="text-[10px] opacity-60">Telegram support</span>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-[var(--sp-surface-2)]">
              <X size={16} />
            </button>
          </div>

          <div className="max-h-[420px] overflow-y-auto px-4 py-3 space-y-3">
            {sortedMessages.map((msg, index) => (
              <div
                key={msg.id || `${msg.role}-${index}`}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                  msg.role === 'user'
                    ? 'ml-auto bg-primary/20 text-text'
                    : 'mr-auto bg-[var(--sp-surface-2)] text-text'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] opacity-60">
                  <Clock size={10} />
                  <span>{new Date(msg.createdAt || Date.now()).toLocaleString()}</span>
                </div>
              </div>
            ))}
            {isSending && (
              <div className="mr-auto max-w-[80%] rounded-2xl px-3 py-2 text-sm bg-[var(--sp-surface-2)] text-text opacity-80">
                {t('chatbot.typing')}
              </div>
            )}
          </div>

          {sentToast && (
            <div className="px-4 pb-2 text-xs font-black text-emerald-400">{sentToast}</div>
          )}

          <div className="px-4 pb-3">
            <ConsentGate
              checked={consentChecked}
              onChange={setConsentChecked}
              text={t('checkout.consent')}
              policyLabel={t('common.privacyPolicy')}
              policyUrl={process.env.REACT_APP_PRIVACY_POLICY_URL}
              isDark={true}
            />
          </div>

          <div className="flex items-center gap-2 px-3 py-3 border-t border-[var(--sp-border)]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={t('chatbot.placeholder')}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={!consentChecked || isSending || !input.trim()}
              className="p-2 rounded-lg bg-primary text-black hover:scale-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full bg-primary text-black shadow-lg flex items-center justify-center hover:scale-105 transition-all"
          title={t('chatbot.title')}
        >
          <MessageCircle size={20} />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;

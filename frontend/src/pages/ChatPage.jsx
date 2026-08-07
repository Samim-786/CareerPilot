import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Paperclip, Plus, MessageSquare, Trash2, Menu, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { chatService } from "../services/chatService";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { Copy, Check } from "lucide-react";
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const MOBILE_BREAKPOINT = 768;

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [chatId, setChatId] = useState(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const bottomRef = useRef(null)
  const [chats, setChats] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== 'undefined' ? window.innerWidth > MOBILE_BREAKPOINT : true
  );
  const [toggleHover, setToggleHover] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= MOBILE_BREAKPOINT : false
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    initializeChat()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    })
  }, [messages])

  const loadMessages = async (id) => {
    try {
      const data = await chatService.getMessages(id)

      setMessages(
        data.map(msg => ({
          id: msg.id,
          role: msg.role,
          text: msg.content,
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        }))
      )
    } catch (err) {
      console.error(err)
      toast.error("Failed to load messages")
    }
  }

  const selectChat = async (chat) => {
    if (chat.id === chatId) return
    setChatId(chat.id)
    await loadMessages(chat.id)
    if (isMobile) setSidebarOpen(false)
  }

  const handleNewChat = async () => {
    try {
      const chat = await chatService.createChat("New Chat")
      setChats(prev => [chat, ...prev])
      setChatId(chat.id)
      setMessages([])
      if (isMobile) setSidebarOpen(false)
    } catch (err) {
      console.error(err)
      toast.error("Failed to create new chat")
    }
  }

  const initializeChat = async () => {
    try {
      const chatList = await chatService.getChats()
      setChats(chatList)

      if (chatList.length > 0) {
        setChatId(chatList[0].id)
        await loadMessages(chatList[0].id)
      } else {
        const chat = await chatService.createChat("New Chat")
        setChats([chat])
        setChatId(chat.id)
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to load chats")
    } finally {
      setInitializing(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading || !chatId) return;

    const question = input.trim();

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: question,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Show user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Rename chat if this is the first message
      if (messages.length === 0) {
        const title =
          question.length > 35
            ? question.substring(0, 35) + "..."
            : question;

        await chatService.updateChat(chatId, title);

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId ? { ...chat, title } : chat
          )
        );
      }

      // Save user message
      await chatService.saveMessage(chatId, "user", question);

      // Ask AI
      const aiResponse = await chatService.askAI(question);

      // Save assistant message
      await chatService.saveMessage(
        chatId,
        "assistant",
        aiResponse.answer
      );

      // Create empty assistant message
      const assistantId = Date.now() + 1;

      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          text: "",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      // Typing animation
      const fullText = aiResponse.answer;

      for (let i = 0; i <= fullText.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 10));

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? {
                ...msg,
                text: fullText.slice(0, i),
              }
              : msg
          )
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");

      // Remove optimistic user message if request fails
      setMessages((prev) =>
        prev.filter((m) => m.id !== userMessage.id)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  const handleDeleteChat = async (id) => {
    try {
      await chatService.deleteChat(id);

      const remainingChats = chats.filter(chat => chat.id !== id);
      setChats(remainingChats);

      if (chatId === id) {
        if (remainingChats.length > 0) {
          setChatId(remainingChats[0].id);
          await loadMessages(remainingChats[0].id);
        } else {
          const newChat = await chatService.createChat("New Chat");
          setChats([newChat]);
          setChatId(newChat.id);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="cp-root" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 130px)', minWidth: 0 }}>

      <style>{`
        .cp-title { font-size: 26px; }
        .cp-body { flex: 1; display: flex; gap: 20px; overflow: hidden; min-width: 0; position: relative; }
        .cp-chat-sidebar {
          width: 240px;
          flex-shrink: 0;
        }
        .cp-backdrop { display: none; }
        .cp-bubble { max-width: 70%; }
        @media (max-width: 768px) {
          .cp-title { font-size: 20px !important; }
          .cp-subtitle { display: none; }
          .cp-chat-sidebar {
            position: fixed !important;
            top: 0; left: 0; bottom: 0;
            width: 80vw !important;
            max-width: 280px;
            z-index: 50;
            border-radius: 0 !important;
            transform: translateX(0);
            box-shadow: 4px 0 24px rgba(0,0,0,0.4);
          }
          .cp-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 40;
          }
          .cp-bubble { max-width: 88% !important; }
          .cp-input-area { padding: 12px !important; }
          .cp-messages { padding: 16px !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{ position: 'relative' }}
          onMouseEnter={() => setToggleHover(true)}
          onMouseLeave={() => setToggleHover(false)}
        >
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            style={{
              background: toggleHover ? '#181c30' : 'none',
              border: '1px solid #1f2440',
              color: 'white',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
            }}
          >
            <Menu size={20} />
          </button>

          {toggleHover && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              backgroundColor: '#181c30',
              border: '1px solid #1f2440',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '12px',
              color: '#9ca3af',
              whiteSpace: 'nowrap',
              zIndex: 10,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}>
              {sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            </div>
          )}
        </div>

        <div style={{ minWidth: 0 }}>
          <h2 className="cp-title" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'white' }}>
            AI Chat Assistant
          </h2>
          <p className="cp-subtitle" style={{ color: '#6b7280', fontSize: '15px', marginTop: '6px' }}>
            Ask anything about your resume, job descriptions, or career guidance.
          </p>
        </div>
      </div>

      <div className="cp-body">

        {/* Mobile backdrop */}
        {isMobile && sidebarOpen && (
          <div className="cp-backdrop" onClick={() => setSidebarOpen(false)} />
        )}

        {sidebarOpen && (
          <div className="cp-chat-sidebar" style={{
            backgroundColor: '#12152a', border: '1px solid #1f2440',
            borderRadius: '16px', display: 'flex', flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleNewChat}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: '8px',
                  justifyContent: 'center', padding: '10px', borderRadius: '10px',
                  backgroundColor: 'rgba(29,70,234,0.15)', border: '1px solid rgba(29,70,234,0.3)',
                  color: '#598ef9', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                }}
              >
                <Plus size={15} /> New Chat
              </button>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    background: 'none', border: '1px solid #1f2440', borderRadius: '10px',
                    color: '#9ca3af', cursor: 'pointer', padding: '10px', flexShrink: 0
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px 10px' }}>
              {chats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => selectChat(chat)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 12px', borderRadius: '10px', marginBottom: '6px',
                    backgroundColor: chat.id === chatId ? 'rgba(29,70,234,0.15)' : 'transparent',
                    border: 'none', textAlign: 'left', cursor: 'pointer',
                    color: chat.id === chatId ? '#598ef9' : '#9ca3af',
                    fontSize: '13px', transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={e => { if (chat.id !== chatId) e.currentTarget.style.backgroundColor = '#181c30' }}
                  onMouseLeave={e => { if (chat.id !== chatId) e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <MessageSquare size={14} />

                  <span
                    style={{
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {chat.title || "New Chat"}
                  </span>

                  <Trash2
                    size={15}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(chat.id);
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}


        {/* Chat Window */}
        <div style={{
          flex: 1, backgroundColor: '#12152a',
          border: '1px solid #1f2440', borderRadius: '16px',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          minWidth: 0
        }}>

          {/* Messages */}
          <div className="cp-messages" style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}

            {/* Loading bubble */}
            {loading && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #1d46ea, #22d3ee)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Bot size={16} color='white' />
                </div>
                <div style={{
                  backgroundColor: '#181c30', border: '1px solid #1f2440',
                  borderRadius: '12px', padding: '14px 18px',
                  display: 'flex', gap: '6px', alignItems: 'center'
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      backgroundColor: '#598ef9',
                      animation: `bounce 1s infinite ${i * 0.2}s`
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested Questions */}
          {!initializing && messages.length === 0 && (
            <div style={{ padding: '0 24px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                'What are my skill gaps?',
                'How can I improve my ATS score?',
                'Generate interview questions for me',
                'Suggest a learning roadmap',
              ].map((q, i) => (
                <button key={i} onClick={() => setInput(q)} style={{
                  padding: '7px 14px', borderRadius: '999px', fontSize: '13px',
                  backgroundColor: 'rgba(29,70,234,0.1)', border: '1px solid rgba(29,70,234,0.25)',
                  color: '#598ef9', cursor: 'pointer', transition: 'all 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(29,70,234,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(29,70,234,0.1)'}
                >{q}</button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="cp-input-area" style={{
            padding: '16px 20px',
            borderTop: '1px solid #1f2440',
            display: 'flex', gap: '12px', alignItems: 'flex-end'
          }}>
            <button style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#4b5563', padding: '8px', borderRadius: '8px',
              transition: 'color 0.2s', flexShrink: 0
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#598ef9'}
              onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}
            >
              <Paperclip size={18} />
            </button>

            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your resume or career..."
              rows={1}
              style={{
                flex: 1, backgroundColor: '#181c30',
                border: '1px solid #1f2440', borderRadius: '12px',
                padding: '12px 16px', color: 'white', fontSize: '14px',
                resize: 'none', outline: 'none', fontFamily: 'Inter, sans-serif',
                lineHeight: '1.5', maxHeight: '120px', minWidth: 0
              }}
              onFocus={e => e.target.style.borderColor = '#1d46ea'}
              onBlur={e => e.target.style.borderColor = '#1f2440'}
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              style={{
                width: '42px', height: '42px', borderRadius: '12px',
                backgroundColor: input.trim() ? '#1d46ea' : '#1f2440',
                border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s', flexShrink: 0,
                boxShadow: input.trim() ? '0 0 16px rgba(29,70,234,0.4)' : 'none'
              }}
            >
              <Send size={16} color='white' />
            </button>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>

    </div>
  )
}

function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: "relative", maxWidth: '100%', overflowX: 'auto' }}>
      <button
        onClick={copyCode}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          border: "none",
          background: "#2d2d2d",
          color: "white",
          borderRadius: 6,
          padding: "4px 8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 12,
        }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? "Copied" : "Copy"}
      </button>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        PreTag="div"
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

function MessageBubble({ msg }) {
  const isAI = msg.role === 'assistant'
  return (
    <div style={{
      display: 'flex', gap: '12px',
      alignItems: 'flex-start',
      flexDirection: isAI ? 'row' : 'row-reverse'
    }}>
      {/* Avatar */}
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
        background: isAI ? 'linear-gradient(135deg, #1d46ea, #22d3ee)' : 'rgba(29,70,234,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {isAI ? <Bot size={16} color='white' /> : <User size={16} color='#598ef9' />}
      </div>

      {/* Bubble */}
      <div className="cp-bubble" style={{
        backgroundColor: isAI ? '#181c30' : 'rgba(29,70,234,0.15)',
        border: `1px solid ${isAI ? '#1f2440' : 'rgba(29,70,234,0.3)'}`,
        borderRadius: '12px', padding: '12px 16px',
        color: "white",
        lineHeight: 1.7,
        fontSize: "14px",
        minWidth: 0,
        overflowWrap: 'break-word'
      }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");

              return !inline && match ? (
                <CodeBlock
                  language={match[1]}
                  value={String(children).replace(/\n$/, "")}
                />
              ) : (
                <code
                  style={{
                    background: "#222",
                    padding: "2px 4px",
                    borderRadius: "4px",
                    color: "#7dd3fc",
                  }}
                  {...props}
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {msg.text}
        </ReactMarkdown>
        <p style={{ color: '#4b5563', fontSize: '11px', marginTop: '6px', textAlign: isAI ? 'left' : 'right' }}>
          {msg.time}
        </p>
      </div>
    </div>
  )
}
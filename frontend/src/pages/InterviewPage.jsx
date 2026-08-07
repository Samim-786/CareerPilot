import { useEffect, useState } from 'react'
import { interviewService } from '../services/interviewService'
import { Mic, ChevronRight, ChevronLeft, RotateCcw, CheckCircle, Brain, Plus, Trash2, MessageSquare, Clock } from 'lucide-react'
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "react-toastify";


const categoryColors = {
  DSA: { bg: 'rgba(168,85,247,0.1)', text: '#a855f7', border: 'rgba(168,85,247,0.25)' },
  Java: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
  'Spring Boot': { bg: 'rgba(34,211,238,0.1)', text: '#22d3ee', border: 'rgba(34,211,238,0.25)' },
  'System Design': { bg: 'rgba(244,63,94,0.1)', text: '#f43f5e', border: 'rgba(244,63,94,0.25)' },
  HR: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e', border: 'rgba(34,197,94,0.25)' },
}

const defaultColor = {
  bg: 'rgba(29,70,234,0.1)',
  text: '#598ef9',
  border: 'rgba(29,70,234,0.3)',
}

function MarkdownBlock({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={oneDark}
              language={match[1]}
              PreTag="div"
              customStyle={{ borderRadius: "10px", fontSize: "13px" }}
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code
              style={{
                background: "#181c30",
                padding: "2px 6px",
                borderRadius: "6px",
                fontSize: "13px"
              }}
              {...props}
            >
              {children}
            </code>
          );
        }
      }}
    >
      {content || ""}
    </ReactMarkdown>
  )
}

export default function InterviewPage() {
  // mode: 'form' (new interview setup) | 'active' (live/resumed interview) | 'result' (viewing a finished session)
  const [mode, setMode] = useState('form')

  const [session, setSession] = useState(null)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)

  const [answer, setAnswer] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState([])

  const [finalResult, setFinalResult] = useState(null)

  const question = questions[current]
  const [jobRole, setJobRole] = useState("")
  const [difficulty, setDifficulty] = useState("MEDIUM")

  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState(null)

  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth > 768 : true
  );

  useEffect(() => {
    loadHistory()
  }, [])

  // Auto close/open sidebar based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }

  const loadHistory = async () => {
    try {
      setHistoryLoading(true)
      const data = await interviewService.getHistory()
      setHistory(data || [])
    } catch (err) {
      console.error(err)
      toast.error("Failed to load interview history.")
    } finally {
      setHistoryLoading(false)
    }
  }

  const startInterview = async () => {

    if (!jobRole.trim()) {
      toast.error("Please enter a job role.")
      return
    }

    try {

      setLoading(true)

      const data = await interviewService.generateInterview(
        jobRole,
        difficulty
      )
      setSession(data)
      setQuestions(data.questions || [])
      setCurrent(0)
      setAnswer('')
      setSubmitted(false)
      setFeedback(null)
      setCompleted([])
      setFinalResult(null)
      setSelectedId(null)
      setMode('active')
      closeSidebarOnMobile()
      await loadHistory()

    } catch (err) {
      console.error(err)
      toast.error("Failed to generate interview")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {

    if (!answer.trim()) return

    try {

      setLoading(true)

      const result = await interviewService.evaluateAnswer(
        session.id,
        question.id,
        answer
      )

      setFeedback(result)
      setSubmitted(true)
      setCompleted(prev =>
        prev.includes(question.id) ? prev : [...prev, question.id]
      )

    } catch (err) {
      console.error(err)
      toast.error("Failed to evaluate answer.")
    } finally {
      setLoading(false)
    }
  }

  const handleFinish = async () => {

    try {

      setLoading(true)

      const result = await interviewService.finalizeInterview(session.id)

      setFinalResult(result)
      setMode('result')
      setSelectedId(session.id)
      toast.success("Interview completed!")
      await loadHistory()

    } catch (err) {
      console.error(err)
      toast.error("Failed to finalize interview.")
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1)
      setAnswer('')
      setSubmitted(false)
      setFeedback(null)
    }
  }

  const handleReset = () => {
    setCurrent(0)
    setAnswer('')
    setSubmitted(false)
    setFeedback(null)
    setCompleted([])
  }

  const handleNewInterview = () => {
    setSession(null)
    setQuestions([])
    setCurrent(0)
    setAnswer('')
    setSubmitted(false)
    setFeedback(null)
    setCompleted([])
    setFinalResult(null)
    setJobRole('')
    setSelectedId(null)
    setMode('form')
  }

  // Clicking a history item either resumes a pending session or shows a finished one
  const selectSession = async (item) => {
    try {
      setLoading(true)
      const data = await interviewService.getSession(item.id)

      const isPending = item.score == null

      if (isPending) {
        // Resume: load questions, mark already-answered ones as completed,
        // jump to the first unanswered question
        const qs = data.questions || []
        const answeredIds = qs
          .filter(q => q.userAnswer != null && q.userAnswer !== "")
          .map(q => q.id)

        const firstUnansweredIndex = qs.findIndex(
          q => !answeredIds.includes(q.id)
        )

        setSession(data)
        setQuestions(qs)
        setCompleted(answeredIds)
        setCurrent(firstUnansweredIndex === -1 ? Math.max(qs.length - 1, 0) : firstUnansweredIndex)
        setAnswer('')
        setSubmitted(false)
        setFeedback(null)
        setFinalResult(null)
        setSelectedId(item.id)
        setMode('active')
        toast.success("Resumed interview")
      } else {
        setFinalResult(data)
        setSelectedId(item.id)
        setMode('result')
      }

      closeSidebarOnMobile()

    } catch (err) {
      console.error(err)
      toast.error("Failed to load interview.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return

    try {
      await interviewService.deleteSession(sessionToDelete)

      const updated = history.filter(h => h.id !== sessionToDelete)
      setHistory(updated)
      toast.success("Interview deleted successfully!")

      if (selectedId === sessionToDelete) {
        handleNewInterview()
      }

      setShowDeleteModal(false)
      setSessionToDelete(null)
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete interview.")
    }
  }

  const activeColor = categoryColors[question?.category] || defaultColor

  return (
    <div style={{ display: "flex", gap: "20px", height: "calc(100vh - 130px)" }}>

      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? "260px" : "70px",
          flexShrink: 0,
          background: "#12152a",
          border: "1px solid #1f2440",
          borderRadius: "16px",
          padding: sidebarOpen ? "16px" : "16px 10px",
          transition: "width 0.25s ease, padding 0.25s ease",
          overflow: "hidden",
          overflowY: "auto",
        }}
      >
        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "10px",
            background: "#181c30",
            color: "#9ca3af",
            border: "1px solid #1f2440",
            marginBottom: "12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: sidebarOpen ? "flex-end" : "center",
          }}
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        <button
          onClick={handleNewInterview}
          title="New Interview"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            background: "#1d46ea",
            color: "white",
            border: "none",
            marginBottom: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            fontWeight: 600,
          }}
        >
          <Plus size={16} /> {sidebarOpen && "New Interview"}
        </button>

        {historyLoading ? (
          sidebarOpen && <p style={{ color: "#6b7280", fontSize: "13px" }}>Loading...</p>
        ) : history.length === 0 ? (
          sidebarOpen && <p style={{ color: "#6b7280", fontSize: "13px" }}>No interviews yet.</p>
        ) : (
          history.map((item) => {
            const isPending = item.score == null
            return (
              <div
                key={item.id}
                title={!sidebarOpen ? `${item.jobRole} (${isPending ? "Pending" : `${item.score}/10`})` : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                  padding: "10px",
                  borderRadius: "10px",
                  background: selectedId === item.id ? "#072B6E" : "transparent",
                  border: selectedId === item.id ? "1px solid #3b82f6" : "1px solid transparent",
                }}
              >
                <button
                  onClick={() => selectSession(item)}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: sidebarOpen ? "flex-start" : "center",
                    gap: "4px",
                    border: "none",
                    background: "transparent",
                    color: "white",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "13px",
                    minWidth: 0,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", width: "100%", justifyContent: sidebarOpen ? "flex-start" : "center" }}>
                    {isPending ? (
                      <Clock size={13} style={{ flexShrink: 0, color: "#f59e0b" }} />
                    ) : (
                      <MessageSquare size={13} style={{ flexShrink: 0 }} />
                    )}
                    {sidebarOpen && (
                      <span style={{
                        overflow: "hidden", textOverflow: "ellipsis",
                        whiteSpace: "nowrap", fontWeight: 500
                      }}>
                        {item.jobRole}
                      </span>
                    )}
                  </div>
                  {sidebarOpen && (
                    <span style={{ color: isPending ? "#f59e0b" : "#6b7280", fontSize: "11px", marginLeft: "19px" }}>
                      {item.difficulty} · {isPending ? "Pending — click to resume" : `${item.score}/10`}
                    </span>
                  )}
                </button>

                {sidebarOpen && (
                  <Trash2
                    size={16}
                    color="#9ca3af"
                    style={{ cursor: "pointer", flexShrink: 0 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSessionToDelete(item.id);
                      setShowDeleteModal(true);
                    }}
                  />
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: "auto", paddingRight: "4px" }}>

        {/* FORM MODE */}
        {mode === 'form' && (
          <div style={{
            display: "flex", justifyContent: "center",
            alignItems: "center", minHeight: "70vh"
          }}>
            <div style={{
              width: "450px", background: "#12152a",
              borderRadius: "20px", padding: "35px", border: "1px solid #1f2440"
            }}>
              <h2 style={{ color: "white", marginBottom: "25px" }}>
                Start AI Interview
              </h2>

              <input
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g. Backend Developer"
                style={{
                  width: "100%", padding: "14px", borderRadius: "10px",
                  marginBottom: "20px", background: "#181c30",
                  color: "white", border: "1px solid #1f2440"
                }}
              />

              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{
                  width: "100%", padding: "14px", borderRadius: "10px",
                  marginBottom: "25px", background: "#181c30",
                  color: "white", border: "1px solid #1f2440"
                }}
              >
                <option>EASY</option>
                <option>MEDIUM</option>
                <option>HARD</option>
              </select>

              <button
                onClick={startInterview}
                disabled={loading}
                style={{
                  width: "100%", padding: "15px", borderRadius: "12px",
                  border: "none", background: loading ? "#4b5563" : "#1d46ea",
                  color: "white", cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                {loading ? "Generating Interview..." : "Generate Interview"}
              </button>
            </div>
          </div>
        )}

        {/* RESULT MODE (finished session) */}
        {mode === 'result' && finalResult && (
          <div style={{ padding: "10px 4px 40px", color: "white" }}>

            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", marginBottom: "35px"
            }}>
              <div style={{
                width: "120px", height: "120px", borderRadius: "50%",
                background: `conic-gradient(#22c55e 0% ${Math.round((finalResult.score || 0) * 10)}%, #1f2440 ${Math.round((finalResult.score || 0) * 10)}% 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "20px", boxShadow: "0 0 25px rgba(34,197,94,0.25)"
              }}>
                <div style={{
                  width: "92px", height: "92px", borderRadius: "50%",
                  background: "#12152a", display: "flex", alignItems: "center",
                  justifyContent: "center", flexDirection: "column"
                }}>
                  <span style={{ fontSize: "28px", fontWeight: 700, color: "#22c55e" }}>
                    {Math.round((finalResult.score || 0) * 10)}%
                  </span>
                  <span style={{ color: "#9ca3af", fontSize: "12px" }}>Score</span>
                </div>
              </div>

              <h1 style={{ marginBottom: "8px", color: "white" }}>
                {finalResult.jobRole || "Interview"} — {finalResult.difficulty || ""}
              </h1>
              <p style={{ color: "#9ca3af" }}>
                Here's your interview performance.
              </p>
            </div>

            {finalResult.feedback && (
              <div style={{
                background: "#12152a", borderRadius: "15px",
                padding: "25px", marginBottom: "20px"
              }}>
                <h3 style={{ color: "white", marginBottom: "12px" }}>Overall Feedback</h3>
                <div style={{ color: "#d1d5db", lineHeight: "1.8" }}>
                  <MarkdownBlock content={finalResult.feedback} />
                </div>
              </div>
            )}

            {Array.isArray(finalResult.questions) && finalResult.questions.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <h3 style={{ color: "white" }}>Questions & Answers</h3>
                {finalResult.questions.map((q, i) => {
                  const qc = categoryColors[q.category] || defaultColor
                  return (
                    <div key={q.id || i} style={{
                      background: "#12152a", border: "1px solid #1f2440",
                      borderRadius: "14px", padding: "20px"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                        <span style={{
                          padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600,
                          backgroundColor: qc.bg, color: qc.text, border: `1px solid ${qc.border}`
                        }}>{q.category || "Interview"}</span>
                        {q.score != null && (
                          <span style={{ color: "#22c55e", fontSize: "13px", fontWeight: 600 }}>
                            {q.score}/10
                          </span>
                        )}
                      </div>
                      <p style={{ color: "white", fontWeight: 500, marginBottom: "10px" }}>{q.question}</p>
                      {q.userAnswer && (
                        <div style={{ background: "#181c30", borderRadius: "10px", padding: "12px", marginBottom: "10px" }}>
                          <span style={{ color: "#6b7280", fontSize: "12px" }}>Your answer:</span>
                          <p style={{ color: "#d1d5db", fontSize: "13px", marginTop: "4px" }}>{q.userAnswer}</p>
                        </div>
                      )}
                      {q.aiFeedback && (
                        <div style={{ color: "#9ca3af", fontSize: "13px", lineHeight: "1.6" }}>
                          <MarkdownBlock content={q.aiFeedback} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            <button
              onClick={handleNewInterview}
              style={{
                marginTop: "30px", display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "12px 24px", borderRadius: "12px", border: "none",
                background: "#1d46ea", color: "white", fontWeight: 600, cursor: "pointer"
              }}
            >
              <Plus size={16} /> Start New Interview
            </button>
          </div>
        )}

        {/* ACTIVE MODE (live or resumed interview) */}
        {mode === 'active' && session && question && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '26px', fontWeight: 700, color: 'white' }}>
                  Mock Interview
                </h2>
                <p style={{ color: '#6b7280', fontSize: '15px', marginTop: '6px' }}>
                  {session.jobRole} · {session.difficulty}
                </p>
              </div>
              <button onClick={handleReset} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 18px', borderRadius: '12px',
                backgroundColor: '#181c30', border: '1px solid #1f2440',
                color: '#9ca3af', fontSize: '14px', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              {questions.map((q, i) => (
                <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    onClick={() => { setCurrent(i); setAnswer(''); setSubmitted(false); setFeedback(null) }}
                    style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                      backgroundColor: completed.includes(q.id) ? 'rgba(34,197,94,0.15)' : i === current ? 'rgba(29,70,234,0.2)' : '#181c30',
                      border: `2px solid ${completed.includes(q.id) ? '#22c55e' : i === current ? '#1d46ea' : '#1f2440'}`,
                      color: completed.includes(q.id) ? '#22c55e' : i === current ? '#598ef9' : '#6b7280',
                      transition: 'all 0.2s'
                    }}
                  >
                    {completed.includes(q.id) ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  {i < questions.length - 1 && (
                    <div style={{ width: '40px', height: '2px', backgroundColor: completed.includes(q.id) ? '#22c55e' : '#1f2440', borderRadius: '999px' }} />
                  )}
                </div>
              ))}
              <span style={{ color: '#6b7280', fontSize: '13px', marginLeft: '8px' }}>
                {completed.length}/{questions.length} completed
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <div style={{
                  backgroundColor: '#12152a', border: '1px solid #1f2440',
                  borderRadius: '16px', padding: '28px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
                      backgroundColor: activeColor.bg, color: activeColor.text, border: `1px solid ${activeColor.border}`
                    }}>{question?.category || 'Interview'}</span>
                    <span style={{ color: '#4b5563', fontSize: '13px' }}>Question {current + 1} of {questions.length}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                      background: 'linear-gradient(135deg, #1d46ea, #22d3ee)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Mic size={16} color='white' />
                    </div>
                    <p style={{ color: 'white', fontSize: '17px', lineHeight: '1.7', fontWeight: 500 }}>
                      {question.question}
                    </p>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#12152a', border: '1px solid #1f2440',
                  borderRadius: '16px', padding: '24px'
                }}>
                  <h4 style={{ color: '#9ca3af', fontSize: '13px', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Your Answer
                  </h4>
                  <textarea
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    disabled={submitted}
                    placeholder="Type your answer here... Be as detailed as possible."
                    style={{
                      width: '100%', height: '160px',
                      backgroundColor: '#181c30', border: '1px solid #1f2440',
                      borderRadius: '12px', padding: '14px',
                      color: 'white', fontSize: '14px', resize: 'none',
                      outline: 'none', fontFamily: 'Inter, sans-serif', lineHeight: '1.7',
                      opacity: submitted ? 0.6 : 1
                    }}
                    onFocus={e => e.target.style.borderColor = '#1d46ea'}
                    onBlur={e => e.target.style.borderColor = '#1f2440'}
                  />
                  {!submitted && (
                    <button
                      onClick={handleSubmit}
                      disabled={!answer.trim() || loading}
                      style={{
                        marginTop: '12px',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '11px 24px', borderRadius: '12px',
                        backgroundColor: answer.trim() ? '#1d46ea' : '#1f2440',
                        border: 'none', color: 'white', fontSize: '14px', fontWeight: 600,
                        cursor: answer.trim() ? 'pointer' : 'not-allowed',
                        boxShadow: answer.trim() ? '0 0 20px rgba(29,70,234,0.3)' : 'none',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Brain size={15} />
                      {loading ? 'Evaluating...' : 'Get AI Feedback'}
                    </button>
                  )}
                </div>

                {submitted && feedback && (
                  <div style={{
                    backgroundColor: '#12152a', border: '1px solid rgba(34,197,94,0.25)',
                    borderRadius: '16px', padding: '24px',
                    animation: 'fadeIn 0.4s ease'
                  }}>
                    <h4 style={{ color: '#22c55e', fontWeight: 600, fontSize: '14px', marginBottom: '16px' }}>
                      🤖 AI Feedback
                    </h4>
                    <div style={{
                      backgroundColor: '#181c30', borderRadius: '12px',
                      padding: '18px', textAlign: 'center', marginBottom: '18px'
                    }}>
                      <p style={{ color: '#22c55e', fontSize: '28px', fontWeight: 700 }}>
                        {feedback.score}/10
                      </p>
                      <p style={{ color: '#9ca3af', marginTop: '6px' }}>AI Score</p>
                    </div>

                    <div style={{ color: '#d1d5db', fontSize: '14px', lineHeight: '1.7' }}>
                      <MarkdownBlock content={feedback.aiFeedback} />
                    </div>

                    {current < questions.length - 1 ? (
                      <button
                        onClick={handleNext}
                        style={{
                          marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '10px 20px', borderRadius: '12px',
                          backgroundColor: '#1d46ea', border: 'none', color: 'white', cursor: 'pointer'
                        }}
                      >
                        Next Question
                        <ChevronRight size={15} />
                      </button>
                    ) : (
                      <button
                        onClick={handleFinish}
                        disabled={loading}
                        style={{
                          marginTop: '16px', padding: '10px 20px', borderRadius: '12px',
                          backgroundColor: loading ? '#4b5563' : '#22c55e',
                          border: 'none', color: 'white',
                          cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {loading ? 'Finishing...' : 'Finish Interview'}
                      </button>
                    )}
                  </div>
                )}

              </div>

              <div style={{
                backgroundColor: '#12152a', border: '1px solid #1f2440',
                borderRadius: '16px', padding: '20px', height: 'fit-content'
              }}>
                <h4 style={{ color: 'white', fontWeight: 600, fontSize: '14px', marginBottom: '16px' }}>
                  Current Interview
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {questions.map((q, i) => {
                    const qc = categoryColors[q.category] || defaultColor
                    const isActive = i === current
                    const isDone = completed.includes(q.id)
                    return (
                      <div
                        key={q.id}
                        onClick={() => { setCurrent(i); setAnswer(''); setSubmitted(false); setFeedback(null) }}
                        style={{
                          padding: '12px 14px', borderRadius: '12px', cursor: 'pointer',
                          backgroundColor: isActive ? 'rgba(29,70,234,0.1)' : 'transparent',
                          border: `1px solid ${isActive ? 'rgba(29,70,234,0.3)' : '#1f2440'}`,
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#181c30' }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{
                            fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px',
                            backgroundColor: qc.bg, color: qc.text, border: `1px solid ${qc.border}`
                          }}>{q.category || 'Interview'}</span>
                          {isDone && <CheckCircle size={13} color='#22c55e' />}
                        </div>
                        <p style={{ color: isActive ? 'white' : '#9ca3af', fontSize: '12px', lineHeight: '1.5' }}>
                          {q.question.length > 60 ? `${q.question.slice(0, 60)}...` : q.question}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div
          onClick={() => { setShowDeleteModal(false); setSessionToDelete(null); }}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)", display: "flex",
            justifyContent: "center", alignItems: "center", zIndex: 9999,
            animation: "fadeIn 0.25s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "420px", background: "#111827", border: "1px solid #374151",
              borderRadius: "16px", padding: "28px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "50%",
                background: "rgba(239,68,68,0.15)", display: "flex",
                justifyContent: "center", alignItems: "center"
              }}>
                <Trash2 size={24} color="#ef4444" />
              </div>
              <div>
                <h3 style={{ color: "white", margin: 0 }}>Delete Interview</h3>
                <p style={{ color: "#9ca3af", marginTop: "6px", fontSize: "14px" }}>
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p style={{ color: "#d1d5db", lineHeight: 1.6, marginBottom: "24px" }}>
              Are you sure you want to permanently delete this interview?
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                onClick={() => { setShowDeleteModal(false); setSessionToDelete(null); }}
                style={{
                  padding: "10px 18px", borderRadius: "10px", border: "1px solid #374151",
                  background: "#1f2937", color: "white", cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSession}
                style={{
                  padding: "10px 18px", borderRadius: "10px", border: "none",
                  background: "#dc2626", color: "white", cursor: "pointer", fontWeight: 600
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  )
}
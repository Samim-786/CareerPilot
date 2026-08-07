import { useState, useEffect } from 'react'
import { Plus, Briefcase, ExternalLink, Trash2 } from 'lucide-react'
import toast from "react-hot-toast";
import { jobService } from "../services/jobService";


const statusColors = {
  Applied: { bg: 'rgba(89,142,249,0.1)', text: '#598ef9', border: 'rgba(89,142,249,0.25)' },
  Interview: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
  Offered: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e', border: 'rgba(34,197,94,0.25)' },
  Rejected: { bg: 'rgba(244,63,94,0.1)', text: '#f43f5e', border: 'rgba(244,63,94,0.25)' },
}

const statuses = ['Applied', 'Interview', 'Offered', 'Rejected']

export default function JobTrackerPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    companyName: "",
    jobTitle: "",
    status: "Applied",
    appliedDate: "",
    jobUrl: "",
    notes: ""
  });

  const handleAdd = async () => {
    if (!form.companyName || !form.jobTitle) {
      toast.error("Company and role are required.");
      return;
    }

    try {
      const saved = await jobService.add(form);

      setJobs((prev) => [...prev, saved]);

      setForm({
        companyName: "",
        jobTitle: "",
        status: "Applied",
        appliedDate: "",
        jobUrl: "",
        notes: ""
      });

      setShowForm(false);

      toast.success("Job added.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add job.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await jobService.delete(id);

      setJobs((prev) => prev.filter((j) => j.id !== id));

      toast.success("Job deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed.");
    }
  };
  const handleStatusChange = async (id, status) => {
    try {
      const job = jobs.find((j) => j.id === id);

      const updated = {
        ...job,
        status,
      };

      await jobService.update(updated);

      setJobs((prev) =>
        prev.map((j) => (j.id === id ? updated : j))
      );

      toast.success("Status updated.");
    } catch (err) {
      console.error(err);
      toast.error("Update failed.");
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);

      const data = await jobService.getAll();

      setJobs(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  const counts = statuses.reduce((acc, s) => {
    acc[s] = jobs.filter(j => j.status === s).length
    return acc
  }, {})
  if (loading) {
    return (
      <div
        style={{
          minHeight: '300px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#9ca3af',
          fontSize: '15px'
        }}
      >
        Loading jobs...
      </div>
    );
  }
  return (

    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      <style>{`
        .jt-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }
        .jt-add-btn {
          flex-shrink: 0;
        }
        .jt-stat-pills {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 4px;
          -webkit-overflow-scrolling: touch;
        }
        .jt-stat-pills::-webkit-scrollbar {
          height: 4px;
        }
        .jt-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 12px;
        }
        .jt-status-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .jt-table-scroll {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .jt-table-scroll table {
          min-width: 640px;
        }
        @media (max-width: 768px) {
          .jt-header {
            flex-direction: column;
            align-items: stretch;
          }
          .jt-add-btn {
            justify-content: center;
          }
          .jt-stat-pills {
            flex-wrap: nowrap;
          }
          .jt-stat-pills > div {
            flex-shrink: 0;
          }
          .jt-form-grid {
            grid-template-columns: 1fr !important;
          }
          .jt-status-row button {
            flex: 1 1 calc(50% - 5px);
          }
          .jt-save-btn {
            margin-left: 0 !important;
            width: 100%;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .jt-form-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="jt-header">
        <div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(24px,4vw,30px)', fontWeight: 700, color: 'white' }}>
            Job Tracker
          </h2>
          <p style={{ color: '#6b7280', fontSize: '15px', marginTop: '6px' }}>
            Track all your job applications in one place.
          </p>
        </div>
        <button
          className="jt-add-btn"
          onClick={() => setShowForm(!showForm)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '11px 20px', borderRadius: '12px',
            backgroundColor: '#1d46ea', border: 'none',
            color: 'white', fontSize: '14px', fontWeight: 600,
            cursor: 'pointer', boxShadow: '0 0 20px rgba(29,70,234,0.3)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(29,70,234,0.5)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(29,70,234,0.3)'}
        >
          <Plus size={16} /> Add Job
        </button>
      </div>

      {/* Stat Pills */}
      <div className="jt-stat-pills">
        {statuses.map(s => {
          const c = statusColors[s]
          return (
            <div key={s} style={{
              padding: '10px 20px', borderRadius: '12px',
              backgroundColor: c.bg, border: `1px solid ${c.border}`,
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span style={{ color: c.text, fontWeight: 700, fontSize: '18px', fontFamily: 'Space Grotesk, sans-serif' }}>
                {counts[s]}
              </span>
              <span style={{ color: c.text, fontSize: '13px' }}>{s}</span>
            </div>
          )
        })}
      </div>

      {/* Add Job Form */}
      {showForm && (
        <div style={{
          backgroundColor: '#12152a', border: '1px solid #1f2440',
          borderRadius: '16px', padding: '24px',
          display: 'flex', flexDirection: 'column', gap: '16px'
        }}>
          <h3 style={{ color: 'white', fontWeight: 600, fontSize: '15px' }}>Add New Application</h3>
          <div className="jt-form-grid">
            {[
              { placeholder: "Company", key: "companyName" },
              { placeholder: "Job Title", key: "jobTitle" },
              { placeholder: "Applied Date", key: "appliedDate" },
              { placeholder: "Job URL", key: "jobUrl" },
            ].map(({ placeholder, key }) => (
              <input
                key={key}
                placeholder={placeholder}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                style={{
                  backgroundColor: '#181c30', border: '1px solid #1f2440',
                  borderRadius: '10px', padding: '10px 14px',
                  color: 'white', fontSize: '14px', outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                  width: '100%', boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = '#1d46ea'}
                onBlur={e => e.target.style.borderColor = '#1f2440'}
              />
            ))}
          </div>
          <div className="jt-status-row">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setForm({ ...form, status: s })}
                style={{
                  padding: '8px 16px', borderRadius: '8px', fontSize: '13px',
                  cursor: 'pointer', border: '1px solid',
                  fontWeight: form.status === s ? 600 : 400,
                  backgroundColor: form.status === s ? statusColors[s].bg : 'transparent',
                  borderColor: form.status === s ? statusColors[s].border : '#1f2440',
                  color: form.status === s ? statusColors[s].text : '#6b7280',
                  transition: 'all 0.2s'
                }}
              >{s}</button>
            ))}
            <button
              className="jt-save-btn"
              onClick={handleAdd}
              style={{
                marginLeft: 'auto', padding: '8px 20px', borderRadius: '8px',
                backgroundColor: '#1d46ea', border: 'none',
                color: 'white', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer'
              }}
            >Save</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ backgroundColor: '#12152a', border: '1px solid #1f2440', borderRadius: '16px', overflow: 'hidden' }}>
        <div className="jt-table-scroll">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1f2440' }}>
                {['Company', 'Role', 'Status', 'Date Applied', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '14px 20px', textAlign: 'left',
                    color: '#6b7280', fontSize: '12px', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    whiteSpace: 'nowrap'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>

              {jobs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: '50px',
                      textAlign: 'center',
                      color: '#6b7280'
                    }}
                  >
                    No job applications yet.
                  </td>
                </tr>
              ) : (
                jobs.map((job, i) => {
                  const c = statusColors[job.status]
                  return (
                    <tr key={job.id} style={{
                      borderBottom: i < jobs.length - 1 ? '1px solid #1f2440' : 'none',
                      transition: 'background 0.15s'
                    }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#181c30'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            backgroundColor: 'rgba(29,70,234,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <Briefcase size={14} color='#598ef9' />
                          </div>
                          <span style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{job.companyName}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#9ca3af', fontSize: '14px' }}>{job.jobTitle}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <select
                          value={job.status}
                          onChange={e => handleStatusChange(job.id, e.target.value)}
                          style={{
                            padding: '5px 10px', borderRadius: '8px', fontSize: '12px',
                            fontWeight: 600, cursor: 'pointer', outline: 'none',
                            backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}`,
                          }}
                        >
                          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#6b7280', fontSize: '13px', whiteSpace: 'nowrap' }}>{job.appliedDate || '—'}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {job.jobUrl && (
                            <a href={job.jobUrl} target="_blank" rel="noreferrer" style={{ color: '#598ef9' }}>
                              <ExternalLink size={15} />
                            </a>
                          )}
                          <button onClick={() => handleDelete(job.id)} style={{
                            background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563',
                            transition: 'color 0.2s', padding: 0
                          }}
                            onMouseEnter={e => e.currentTarget.style.color = '#f43f5e'}
                            onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
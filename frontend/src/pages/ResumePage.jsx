import { useState } from 'react'
import { Upload, FileText, Briefcase, Zap, CheckCircle } from 'lucide-react'
import toast from "react-hot-toast";
import { resumeService } from "../services/resumeService";

export default function ResumePage() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");

  const [loading, setLoading] = useState(false);

  const [uploadedResume, setUploadedResume] = useState(null);
  const [analysis, setAnalysis] = useState("");

  const [analyzed, setAnalyzed] = useState(false);

  const handleResumeDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer?.files[0] || e.target.files[0]
    if (file) setResumeFile(file)
  }

  const handleAnalyze = async () => {
    if (!resumeFile) {
      toast.error("Please select a resume.");
      return;
    }

    try {
      setLoading(true);

      console.log("Uploading resume...");

      const uploaded = await resumeService.uploadResume(resumeFile);

      console.log("Uploaded Resume:", uploaded);

      setUploadedResume(uploaded);

      toast.success("Resume uploaded successfully.");

      console.log("Analyzing resume...");

      const result = await resumeService.analyzeResume(uploaded.id);

      console.log("Analysis Response:", result);

      setAnalysis(
        typeof result === "string"
          ? result
          : result.analysis || JSON.stringify(result, null, 2)
      );

      setAnalyzed(true);

      toast.success("Resume analyzed successfully.");
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Failed to analyze resume."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      <style>{`
        .resume-upload-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .resume-dropzone {
          padding: 40px 20px;
        }
        .resume-analyze-btn {
          align-self: flex-start;
        }
        @media (max-width: 768px) {
          .resume-upload-grid {
            grid-template-columns: 1fr !important;
          }
          .resume-dropzone {
            padding: 28px 16px !important;
          }
          .resume-analyze-btn {
            align-self: stretch !important;
            justify-content: center;
          }
          .resume-header h2 {
            font-size: 22px !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="resume-header">
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '26px', fontWeight: 700, color: 'white' }}>
          Resume Analyzer
        </h2>
        <p style={{ color: '#6b7280', fontSize: '15px', marginTop: '6px' }}>
          Upload your resume and paste a job description to get your ATS score and skill gap analysis.
        </p>
      </div>

      {/* Upload Grid */}
      <div className="resume-upload-grid">

        {/* Resume Upload */}
        <div style={{
          backgroundColor: '#12152a', border: '1px solid #1f2440',
          borderRadius: '16px', padding: '24px', minWidth: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <FileText size={18} color='#598ef9' />
            <h3 style={{ color: 'white', fontWeight: 600, fontSize: '15px' }}>Upload Resume</h3>
          </div>

          <div
            className="resume-dropzone"
            onDrop={handleResumeDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => document.getElementById('resumeInput').click()}
            style={{
              border: `2px dashed ${resumeFile ? '#22c55e' : '#1f2440'}`,
              borderRadius: '12px',
              textAlign: 'center', cursor: 'pointer',
              backgroundColor: resumeFile ? 'rgba(34,197,94,0.05)' : 'rgba(29,70,234,0.03)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = resumeFile ? '#22c55e' : '#598ef9'}
            onMouseLeave={e => e.currentTarget.style.borderColor = resumeFile ? '#22c55e' : '#1f2440'}
          >
            <input
              id="resumeInput" type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              onChange={handleResumeDrop}
            />
            {resumeFile ? (
              <>
                <CheckCircle size={36} color='#22c55e' style={{ margin: '0 auto 12px' }} />
                <p style={{ color: '#22c55e', fontWeight: 600, fontSize: '14px', wordBreak: 'break-word' }}>{resumeFile.name}</p>
                <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>Click to change</p>
              </>
            ) : (
              <>
                <Upload size={36} color='#4b5563' style={{ margin: '0 auto 12px' }} />
                <p style={{ color: 'white', fontWeight: 500, fontSize: '14px' }}>Drop your resume here</p>
                <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>PDF, DOC, DOCX supported</p>
              </>
            )}
          </div>
        </div>

        {/* Job Description */}
        <div style={{
          backgroundColor: '#12152a', border: '1px solid #1f2440',
          borderRadius: '16px', padding: '24px', minWidth: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Briefcase size={18} color='#a855f7' />
            <h3 style={{ color: 'white', fontWeight: 600, fontSize: '15px' }}>Job Description</h3>
          </div>
          <textarea
            value={jobDesc}
            onChange={e => setJobDesc(e.target.value)}
            placeholder="Paste the job description here..."
            style={{
              width: '100%', height: '172px',
              backgroundColor: '#181c30',
              border: '1px solid #1f2440',
              borderRadius: '12px', padding: '14px',
              color: 'white', fontSize: '14px',
              resize: 'none', outline: 'none',
              fontFamily: 'Inter, sans-serif',
              lineHeight: '1.6',
              boxSizing: 'border-box'
            }}
            onFocus={e => e.target.style.borderColor = '#a855f7'}
            onBlur={e => e.target.style.borderColor = '#1f2440'}
          />
        </div>
      </div>

      {/* Analyze Button */}
      <button
        className="resume-analyze-btn"
        onClick={handleAnalyze}
        disabled={!resumeFile || loading}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '13px 28px', borderRadius: '12px',
          fontSize: '15px', fontWeight: 600,
          cursor: resumeFile ? 'pointer' : 'not-allowed',
          border: 'none', color: 'white',
          background: resumeFile
            ? 'linear-gradient(135deg, #1d46ea, #1534d8)'
            : '#1f2440',
          boxShadow: resumeFile && jobDesc ? '0 0 24px rgba(29,70,234,0.4)' : 'none',
          transition: 'all 0.2s'
        }}
      >
        <Zap size={17} />
        {loading ? 'Analyzing...' : 'Analyze with AI'}
      </button>

      {/* Loading Bar */}
      {loading && (
        <div style={{ backgroundColor: '#12152a', border: '1px solid #1f2440', borderRadius: '16px', padding: '24px' }}>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px' }}>🤖 AI is analyzing your resume...</p>
          <div style={{ height: '6px', backgroundColor: '#1f2440', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: '60%', borderRadius: '999px',
              background: 'linear-gradient(90deg, #1d46ea, #22d3ee)',
              animation: 'shimmer 1.5s infinite'
            }} />
          </div>
        </div>
      )}

      {/* Results */}
      {analyzed && (
        <div
          style={{
            background: "#12152a",
            border: "1px solid #1f2440",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h3
            style={{
              color: "white",
              marginBottom: "16px",
            }}
          >
            Resume Analysis
          </h3>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              color: "#d1d5db",
              lineHeight: "1.7",
              fontFamily: "inherit",
            }}
          >
            {analysis}
          </pre>

          {uploadedResume?.skills?.length > 0 && (
            <>
              <h3
                style={{
                  color: "white",
                  marginTop: "30px",
                  marginBottom: "12px",
                }}
              >
                Extracted Skills
              </h3>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                {uploadedResume.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      background: "#1d46ea",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "13px",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

    </div>
  )
}
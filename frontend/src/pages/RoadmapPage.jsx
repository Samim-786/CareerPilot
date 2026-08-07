import { CheckCircle, Circle, Plus, Trash2, Map, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { roadmapService } from '../services/roadmapService'
import { toast } from "react-toastify";

export default function RoadmapPage() {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(false)
  const [roadmapId, setRoadmapId] = useState(null)
  const [roadmap, setRoadmap] = useState(null)
  const [roadmaps, setRoadmaps] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roadmapToDelete, setRoadmapToDelete] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);


  const toggleTopic = async (index) => {

    const step = topics[index]

    try {

      await roadmapService.markStepCompleted(
        roadmapId,
        step.id
      )

      const updatedRoadmap =
        await roadmapService.getRoadmap(roadmapId)

      setRoadmap(updatedRoadmap)
      setTopics(updatedRoadmap.steps)

    } catch (err) {

      console.error(err)

    }

  }

  const totalSteps = topics.length

  const completedSteps = topics.filter(
    step => step.isCompleted
  ).length
  const remainingSteps = totalSteps - completedSteps
  const percent = totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100)
  const [targetRole, setTargetRole] = useState("")
  const [currentSkills, setCurrentSkills] = useState("")

  useEffect(() => {
    loadRoadmaps();
  }, []);

  const selectRoadmap = async (id) => {
    try {
      const data = await roadmapService.getRoadmap(id);

      setRoadmap(data);
      setRoadmapId(data.id);
      setTopics(data.steps);
    } catch (err) {
      console.error(err);
    }
  };
  const loadRoadmaps = async () => {
    try {
      const data = await roadmapService.getRoadmaps();

      setRoadmaps(data);

      if (data.length > 0) {
        setRoadmap(data[0]);
        setRoadmapId(data[0].id);
        setTopics(data[0].steps);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const generateRoadmap = async () => {

    if (!targetRole.trim()) {
      toast.error("Please enter target role")
      return
    }

    if (!currentSkills.trim()) {
      toast.error("Please enter current skills")
      return
    }

    try {

      setLoading(true)

      const data = await roadmapService.generateRoadmap(
        targetRole,
        currentSkills
      )

      setRoadmap(data)
      setRoadmapId(data.id)
      setTopics(data.steps)
      setShowForm(false);
      toast.success("Roadmap generated successfully!");
      await loadRoadmaps();

    } catch (err) {

      console.error(err);
      toast.error("Failed to generate roadmap.");

    } finally {

      setLoading(false)

    }

  }

  const handleDeleteRoadmap = async () => {
    if (!roadmapToDelete) return;

    try {
      await roadmapService.deleteRoadmap(roadmapToDelete);

      const updated = roadmaps.filter(
        r => r.id !== roadmapToDelete
      );

      setRoadmaps(updated);
      toast.success("Roadmap deleted successfully!");

      if (roadmapId === roadmapToDelete) {
        if (updated.length > 0) {
          selectRoadmap(updated[0].id);
        } else {
          setRoadmap(null);
          setRoadmapId(null);
          setTopics([]);
          setShowForm(true);
        }
      }

      setShowDeleteModal(false);
      setRoadmapToDelete(null);

    } catch (err) {
      console.error(err);
      toast.error("Failed to delete roadmap.");
    }
  };

  if (showForm || topics.length === 0) {

    return (

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh"
        }}
      >

        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            background: "#12152a",
            padding: "30px",
            borderRadius: "18px",
            border: "1px solid #1f2440"
          }}
        >

          <h2 style={{ color: "white" }}>
            Generate AI Roadmap
          </h2>

          <input
            placeholder="Target Role"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "20px",
              marginBottom: "15px",
              borderRadius: "10px",
              background: "#181c30",
              color: "white",
              border: "1px solid #1f2440"
            }}
          />

          <textarea
            rows={4}
            placeholder="Current Skills (comma separated)"
            value={currentSkills}
            onChange={(e) => setCurrentSkills(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              background: "#181c30",
              color: "white",
              border: "1px solid #1f2440"
            }}
          />

          <button
            onClick={generateRoadmap}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "15px",
              border: "none",
              borderRadius: "10px",
              background: "#1d46ea",
              color: "white"
            }}
          >
            {
              loading
                ?
                "Generating..."
                :
                "Generate Roadmap"
            }
          </button>

          <button
            onClick={() => {
              setShowForm(false);
            }}
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "15px",
              border: "1px solid #1f2440",
              borderRadius: "10px",
              background: "#181c30",
              color: "white",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>

        </div>

      </div>

    )

  }

  return (
    <div style={{ display: "flex", gap: "20px", height: "calc(100vh - 130px)" }}>

      {/* Sidebar */}

      <div
        style={{
          width: sidebarOpen ? "250px" : "70px",
          flexShrink: 0,
          background: "#12152a",
          border: "1px solid #1f2440",
          borderRadius: "16px",
          padding: sidebarOpen ? "16px" : "16px 10px",
          transition: "width 0.25s ease, padding 0.25s ease",
          overflow: "hidden",
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
          onClick={() => {
            setShowForm(true);
          }}
          title="New Roadmap"
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "10px",
            background: "#1d46ea",
            color: "white",
            border: "none",
            marginBottom: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <Plus size={16} /> {sidebarOpen && "New Roadmap"}
        </button>
        {roadmaps.map((r) => (
          <div
            key={r.id}
            title={!sidebarOpen ? r.targetRole : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              padding: "10px",
              borderRadius: "10px",
              background:
                roadmapId === r.id
                  ? "#072B6E"
                  : "transparent",

              border:
                roadmapId === r.id
                  ? "1px solid #3b82f6"
                  : "1px solid transparent",
            }}
          >
            <button
              onClick={() => selectRoadmap(r.id)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: sidebarOpen ? "flex-start" : "center",
                gap: "8px",
                border: "none",
                background: "transparent",
                color: "white",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              <Map size={14} />
              {sidebarOpen && (
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.targetRole}
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
                  setRoadmapToDelete(r.id);
                  setShowDeleteModal(true);
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Current Roadmap */}

      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: "28px",overflowY: "auto",paddingRight: "4px" }}>

        {/* Header */}
        <div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '26px', fontWeight: 700, color: 'white' }}>
            {roadmap?.title || "Learning Roadmap"}
          </h2>
          <p style={{ color: '#6b7280', fontSize: '15px', marginTop: '6px' }}>
            Target Role : {roadmap?.targetRole}
          </p>
        </div>

        {/* Overall Progress */}
        <div style={{
          backgroundColor: '#12152a', border: '1px solid #1f2440',
          borderRadius: '16px', padding: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'white', fontWeight: 600, fontSize: '15px' }}>Overall Progress</span>
            <span style={{
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
              fontSize: '20px', color: '#22c55e'
            }}>{percent}%</span>
          </div>
          <div style={{ height: '8px', backgroundColor: '#1f2440', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${percent}%`,
              background: 'linear-gradient(90deg, #1d46ea, #22d3ee)',
              borderRadius: '999px', transition: 'width 0.5s ease'
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ color: '#6b7280', fontSize: '13px' }}>{completedSteps} of {totalSteps} steps completed</span>
            <span style={{ color: '#6b7280', fontSize: '13px' }}>{remainingSteps} steps left</span>
          </div>
        </div>

        {/* Weeks */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px"
          }}
        >

          {topics.map((step, index) => (

            <div
              key={step.id}
              style={{
                background: "#12152a",
                border: "1px solid #1f2440",
                borderRadius: "16px",
                padding: "22px"
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >

                <div>

                  <div
                    style={{
                      color: "#598ef9",
                      fontSize: "13px",
                      fontWeight: 600
                    }}
                  >
                    Step {step.stepOrder}
                  </div>

                  <h3
                    style={{
                      color: "white",
                      marginTop: "6px"
                    }}
                  >
                    {step.title}
                  </h3>

                </div>

                <button
                  onClick={() => toggleTopic(index)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  {
                    step.isCompleted
                      ?
                      <CheckCircle color="#22c55e" size={22} />
                      :
                      <Circle color="#4b5563" size={22} />
                  }
                </button>

              </div>

              <p
                style={{
                  color: "#9ca3af",
                  marginTop: "12px",
                  lineHeight: "1.6"
                }}
              >
                {step.description}
              </p>

              <div
                style={{
                  marginTop: "12px",
                  color: "#22c55e",
                  fontWeight: 600
                }}
              >
                Duration : {step.durationWeeks} Weeks
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "15px"
                }}
              >

                {step.resources.map((resource, i) => (

                  <span
                    key={i}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "999px",
                      background: "#181c30",
                      color: "#598ef9",
                      fontSize: "12px"
                    }}
                  >
                    {resource.trim()}
                  </span>

                ))}

              </div>

            </div>

          ))}

        </div>

      </div>

      {showDeleteModal && (
        <div
          onClick={() => {
            setShowDeleteModal(false);
            setRoadmapToDelete(null);
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            animation: "fadeIn 0.25s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "420px",
              background: "#111827",
              border: "1px solid #374151",
              borderRadius: "16px",
              padding: "28px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
              animation: "scaleIn 0.25s ease",
              transformOrigin: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "rgba(239,68,68,0.15)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Trash2 size={24} color="#ef4444" />
              </div>

              <div>
                <h3 style={{ color: "white", margin: 0 }}>
                  Delete Roadmap
                </h3>

                <p
                  style={{
                    color: "#9ca3af",
                    marginTop: "6px",
                    fontSize: "14px",
                  }}
                >
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p
              style={{
                color: "#d1d5db",
                lineHeight: 1.6,
                marginBottom: "24px",
              }}
            >
              Are you sure you want to permanently delete this roadmap?
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setRoadmapToDelete(null);
                }}
                style={{
                  padding: "10px 18px",
                  borderRadius: "10px",
                  border: "1px solid #374151",
                  background: "#1f2937",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteRoadmap}
                style={{
                  padding: "10px 18px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#dc2626",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Calculator, BookOpen, Plus, RotateCcw, Trash2, Info, GraduationCap, ChevronDown } from 'lucide-react'
import './style.css'

const defaultSubjects = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `Subject ${i + 1}`,
  credits: 4,
  cie: [0, 0, 0],
  see: 0,
  assignment: 0,
}))

const initialScale = [
  { min: 90, point: 10, grade: 'O' },
  { min: 80, point: 9, grade: 'A+' },
  { min: 70, point: 8, grade: 'A' },
  { min: 60, point: 7, grade: 'B+' },
  { min: 55, point: 6, grade: 'B' },
  { min: 50, point: 5, grade: 'C' },
  { min: 40, point: 4, grade: 'P' },
  { min: 0, point: 0, grade: 'F' },
]

const clamp = (value, max) => Math.min(max, Math.max(0, Number(value) || 0))
const getTotal = (s) => (s.cie.reduce((a, b) => a + b, 0) / 3 / 30) * 25 + (s.see / 100) * 50 + s.assignment
const getGrade = (total, scale) => [...scale].sort((a,b) => b.min-a.min).find(x => total >= x.min) || scale[scale.length-1]

function App() {
  const [subjects, setSubjects] = useState(defaultSubjects)
  const [scale, setScale] = useState(initialScale)
  const [showScale, setShowScale] = useState(false)

  const results = useMemo(() => subjects.map(s => {
    const total = getTotal(s)
    const grade = getGrade(total, scale)
    return { ...s, total, grade }
  }), [subjects, scale])

  const totalCredits = subjects.reduce((sum, s) => sum + Math.max(0, Number(s.credits) || 0), 0)
  const sgpa = totalCredits ? results.reduce((sum, s) => sum + (Number(s.credits) || 0) * s.grade.point, 0) / totalCredits : 0
  const average = subjects.length ? results.reduce((sum, s) => sum + s.total, 0) / subjects.length : 0
  const updateSubject = (id, patch) => setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
  const updateCie = (id, index, value) => setSubjects(prev => prev.map(s => s.id === id ? { ...s, cie: s.cie.map((v,i) => i === index ? clamp(value,30) : v) } : s))
  const addSubject = () => setSubjects(prev => [...prev, { id: Math.max(0,...prev.map(s=>s.id))+1, name:`Subject ${prev.length+1}`, credits:4, cie:[0,0,0], see:0, assignment:0 }])
  const reset = () => { setSubjects(defaultSubjects); setScale(initialScale) }

  return <main className="app-shell">
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-icon"><GraduationCap size={21}/></span><span>gradepilot</span></a>
      <span className="top-note">SEMESTER PERFORMANCE TOOL</span>
    </header>

    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-dot"/> YOUR SEMESTER, MADE CLEAR</div>
        <h1>Know where your<br/><em>grades</em> are headed.</h1>
        <p>Enter your CIEs, SEE and assignment marks. GradePilot calculates your subject grades and credit-weighted SGPA instantly.</p>
      </div>
      <div className="score-card">
        <div className="score-card-head"><span>YOUR ESTIMATED SGPA</span><span className="live-dot">LIVE</span></div>
        <div className="score-number">{sgpa.toFixed(2)}<small>/ 10</small></div>
        <div className="score-progress"><span style={{width:`${Math.min(100,sgpa*10)}%`}}/></div>
        <div className="score-foot"><span>{totalCredits} total credits</span><span>{subjects.length} subjects</span></div>
      </div>
    </section>

    <section className="stats-row">
      <div className="stat"><span className="stat-label">SEMESTER AVERAGE</span><strong>{average.toFixed(2)}<small> / 100</small></strong></div>
      <div className="stat"><span className="stat-label">TOTAL CREDITS</span><strong>{totalCredits.toFixed(1)}</strong></div>
      <div className="stat"><span className="stat-label">SUBJECTS ADDED</span><strong>{subjects.length.toString().padStart(2,'0')}</strong></div>
      <div className="stat stat-action"><button className="text-button" onClick={reset}><RotateCcw size={14}/> Reset calculator</button></div>
    </section>

    <section className="section-heading">
      <div><div className="section-kicker">01 / MARKS & CREDITS</div><h2>Your subjects</h2><p>Fill in the marks for each subject. All scores update automatically.</p></div>
      <button className="add-button" onClick={addSubject}><Plus size={16}/> Add subject</button>
    </section>

    <div className="table-wrap">
      <div className="table-head">
        <div className="subject-head">SUBJECT DETAILS</div>
        <div>CIE 1 <small>/ 30</small></div><div>CIE 2 <small>/ 30</small></div><div>CIE 3 <small>/ 30</small></div>
        <div>SEE <small>/ 100</small></div><div>ASSIGN. <small>/ 25</small></div><div>TOTAL <small>/ 100</small></div><div>GRADE</div>
      </div>
      {subjects.map((s, index) => {
        const result = results[index]
        return <div className="subject-row" key={s.id}>
          <div className="subject-info">
            <div className="subject-index">{String(index+1).padStart(2,'0')}</div>
            <div className="subject-fields">
              <input className="subject-name" value={s.name} onChange={e=>updateSubject(s.id,{name:e.target.value})} aria-label={`Subject ${index+1} name`} />
              <label className="credit-input"><span>CR</span><input type="number" min="0" max="30" step="0.5" value={s.credits} onChange={e=>updateSubject(s.id,{credits:Math.max(0,Number(e.target.value)||0)})} aria-label="Credits"/></label>
            </div>
          </div>
          {s.cie.map((v,i)=><div className="mark-cell" key={i}><input type="number" min="0" max="30" value={v} onChange={e=>updateCie(s.id,i,e.target.value)} aria-label={`CIE ${i+1}`} /></div>)}
          <div className="mark-cell"><input type="number" min="0" max="100" value={s.see} onChange={e=>updateSubject(s.id,{see:clamp(e.target.value,100)})} aria-label="SEE marks"/></div>
          <div className="mark-cell"><input type="number" min="0" max="25" value={s.assignment} onChange={e=>updateSubject(s.id,{assignment:clamp(e.target.value,25)})} aria-label="Assignment marks"/></div>
          <div className="total-cell"><strong>{result.total.toFixed(1)}</strong><span>/ 100</span></div>
          <div className="grade-cell"><span className={`grade-pill ${result.grade.point===0?'fail':''}`}>{result.grade.grade}</span><small>{result.grade.point} GP</small></div>
          <button className="remove-button" onClick={()=>setSubjects(prev=>prev.filter(x=>x.id!==s.id))} aria-label="Remove subject" title="Remove subject"><Trash2 size={15}/></button>
        </div>
      })}
      {subjects.length===0 && <div className="empty-state">No subjects yet. Add a subject to start calculating.</div>}
    </div>
    <div className="mobile-hint"><Info size={14}/> On smaller screens, scroll horizontally to view all marks.</div>

    <section className="bottom-grid">
      <div className="formula-card">
        <div className="card-kicker">02 / HOW IT WORKS</div><h3>Your marks, weighted correctly.</h3>
        <div className="formula-line"><span className="formula-tag cie-tag">CIE</span><div><strong>Average of 3 CIEs → 25 marks</strong><p> ((CIE 1 + CIE 2 + CIE 3) ÷ 3) ÷ 30 × 25</p></div></div>
        <div className="formula-line"><span className="formula-tag see-tag">SEE</span><div><strong>SEE → 50 marks</strong><p>SEE marks ÷ 100 × 50</p></div></div>
        <div className="formula-line"><span className="formula-tag ass-tag">TASK</span><div><strong>Assignments → 25 marks</strong><p>Assignment marks are added directly.</p></div></div>
        <div className="formula-total"><span>FINAL SUBJECT SCORE</span><strong>100 marks</strong></div>
      </div>
      <div className="grade-card">
        <button className="grade-card-title" onClick={()=>setShowScale(!showScale)}><div><div className="card-kicker">03 / GRADE POINTS</div><h3>Grade scale <span className="editable-label">EDITABLE</span></h3></div><ChevronDown className={showScale?'rotated':''} size={18}/></button>
        <p className="grade-intro">Default 10-point scale. Adjust the minimum score and grade point to match your university's regulations.</p>
        <div className="scale-grid">
          {[...scale].sort((a,b)=>b.min-a.min).map((item,i)=><div className="scale-item" key={i}><span className="scale-grade">{item.grade}</span><span className="scale-range">{item.min}+ marks</span><strong>{item.point}</strong></div>)}
        </div>
        {showScale && <div className="scale-editor">{scale.map((item,i)=><div className="scale-edit-row" key={i}><input value={item.grade} onChange={e=>setScale(prev=>prev.map((x,j)=>i===j?{...x,grade:e.target.value}:x))} aria-label="Grade label"/><label>Min. marks<input type="number" min="0" max="100" value={item.min} onChange={e=>setScale(prev=>prev.map((x,j)=>i===j?{...x,min:clamp(e.target.value,100)}:x))}/></label><label>Grade point<input type="number" min="0" max="10" step="0.5" value={item.point} onChange={e=>setScale(prev=>prev.map((x,j)=>i===j?{...x,point:clamp(e.target.value,10)}:x))}/></label></div>)}</div>}
      </div>
    </section>

    <section className="result-strip">
      <div><span className="card-kicker">YOUR RESULT</span><h2>Semester performance</h2><p>Credit-weighted grade point average across all entered subjects.</p></div>
      <div className="result-main"><strong>{sgpa.toFixed(2)}</strong><span>SGPA <small>/ 10</small></span></div>
      <div className="result-detail"><span>Average marks</span><strong>{average.toFixed(2)} / 100</strong><span>Credits counted</span><strong>{totalCredits}</strong></div>
    </section>

    <footer><span>gradepilot <b>·</b> A clearer view of your semester.</span><span>Calculations are estimates. Verify your university's official grading rules.</span></footer>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)

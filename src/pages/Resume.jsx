import './Resume.css'

export default function Resume() {
  return (
    <div className="section resume-page">
      <div className="container">
        <div className="section-head resume-head">
          <div>
            <span className="eyebrow">Resume</span>
            <h1>John Nzivo</h1>
            <p>Designer &amp; developer. View it inline below, or download the PDF.</p>
          </div>
          <a href="/resume.pdf" download className="btn btn-primary">
            Download PDF
          </a>
        </div>

        <div className="resume-viewer card">
          <object data="/resume.pdf" type="application/pdf" width="100%" height="100%">
            <div className="resume-fallback">
              <p>Your browser can't preview PDFs inline.</p>
              <a href="/resume.pdf" download className="btn btn-primary btn-sm">
                Download the resume
              </a>
            </div>
          </object>
        </div>
      </div>
    </div>
  )
}

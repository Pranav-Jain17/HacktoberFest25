function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/[&<>"']/g, function (m) {
    return (
      {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[m] || m
    );
  });
}

/**
 * Wraps the plain AI-enhanced resume text into an elite professional HTML resume template.
 */
export function generateEliteResumeHTML(enhancedText) {
    console.log("Enhanced text for PDF:",enhancedText)
  const safeText = escapeHtml(enhancedText).replace(/\n/g, "<br>");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Enhanced Resume</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
  body {
    font-family: 'Roboto', sans-serif;
    margin: 40px auto;
    max-width: 900px;
    color: #222;
    background: #fefefe;
    padding: 40px;
    border: 1px solid #ddd;
    box-shadow: 0 0 12px rgba(0,0,0,0.07);
  }
  h1 {
    font-weight: 700;
    font-size: 2.5em;
    margin-bottom: 0;
    color: #002b5c;
  }
  h2 {
    color: #00509e;
    border-bottom: 2px solid #00509e;
    padding-bottom: 8px;
    margin: 40px 0 15px;
    font-weight: 700;
    font-size: 1.6em;
  }
  p, li {
    font-weight: 400;
    font-size: 1.1em;
    line-height: 1.55;
    margin: 6px 0;
  }
  ul {
    padding-left: 20px;
    margin-top: 8px;
  }
  .header, .contact-info, .section {
    margin-bottom: 25px;
  }
  .header, .contact-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  .header-left {
    flex: 1 1 auto;
  }
  .header-right {
    text-align: right;
    font-size: 0.95em;
    color: #555;
  }
  hr {
    border: none;
    border-top: 1px solid #ddd;
    margin: 30px 0;
  }
  .skills, .experience, .education {
    margin-top: 10px;
  }
  .job-title {
    font-weight: 700;
    color: #004080;
    font-size: 1.15em;
  }
  .company {
    font-style: italic;
    color: #666;
  }
  .date-range {
    float: right;
    color: #767676;
    font-size: 0.9em;
  }
</style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <h1>Your Full Name</h1>
      <p><strong>Professional Title or Summary</strong></p>
    </div>
    <div class="header-right">
      <p>Email | Phone | LinkedIn | Portfolio</p>
    </div>
  </div>
  
  <hr />

  <div class="section summary">
    <h2>Profile Summary</h2>
    <p>${safeText}</p>
  </div>

  <div class="section skills">
    <h2>Skills</h2>
    <ul>
      <li>Skill One</li>
      <li>Skill Two</li>
      <li>Skill Three</li>
    </ul>
  </div>

  <div class="section experience">
    <h2>Experience</h2>
    <p><span class="job-title">Job Title</span> at <span class="company">Company Name</span> <span class="date-range">Date Range</span></p>
    <ul>
      <li>Achievement or Responsibility 1</li>
      <li>Achievement or Responsibility 2</li>
    </ul>
  </div>

  <div class="section education">
    <h2>Education</h2>
    <p><strong>Degree</strong> – Institution Name – Graduation Year</p>
  </div>
</body>
</html>
  `;
}

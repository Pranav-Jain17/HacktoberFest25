export default function About() {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-300 text-center">
        About the AI Resume Enhancer
      </h1>

      {/* ATS Explanation */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">
          🧾 What is an ATS?
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          An <strong>Applicant Tracking System (ATS)</strong> is software used by
          recruiters to manage and filter job applications. It scans resumes for
          relevant keywords, skills, and formatting consistency to identify the
          best matches for a job posting.
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
          Most companies use ATS tools to shortlist candidates before a human
          recruiter reviews the resume. That means if your resume isn’t optimized
          for ATS, it may never be seen — even if you’re a great fit.
        </p>
      </section>

      {/* AI Enhancement Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">
          🤖 How Our AI Enhancement Works
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Our tool uses <strong>AI-based analysis</strong> to improve both the content
          and structure of your resume. It:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Detects missing or weak keywords compared to the job description.</li>
          <li>Suggests stronger phrasing and quantifiable achievements.</li>
          <li>Ensures ATS-friendly formatting that’s easily readable by scanners.</li>
        </ul>

        <div className="mt-4 border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <p className="font-medium mb-2 text-gray-800 dark:text-gray-200">Example:</p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-red-600 dark:text-red-400">Before</h3>
              <p className="italic">Worked on Python.</p>
            </div>
            <div>
              <h3 className="font-semibold text-green-600 dark:text-green-400">After</h3>
              <p className="italic">
                Developed and deployed Python-based automation scripts, improving
                process efficiency by 30%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">
          💡 Tips to Improve Your ATS Score
        </h2>
        <ul className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300">
          <li>Use job-specific keywords directly from job descriptions.</li>
          <li>Keep formatting simple — avoid tables, images, and custom fonts.</li>
          <li>Use standard section names like <em>Experience</em>, <em>Education</em>, and <em>Skills</em>.</li>
          <li>Quantify your achievements with measurable results.</li>
          <li>Save your resume as <strong>PDF</strong> or <strong>DOCX</strong>.</li>
        </ul>
      </section>

      {/* Scoring Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">
          📊 Understanding Your ATS Score
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left">Score Range</th>
                <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left">Meaning</th>
                <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-3 py-2 dark:border-gray-700">80–100</td>
                <td className="border px-3 py-2 dark:border-gray-700">Excellent</td>
                <td className="border px-3 py-2 dark:border-gray-700">Resume is highly ATS-friendly.</td>
              </tr>
              <tr>
                <td className="border px-3 py-2 dark:border-gray-700">60–79</td>
                <td className="border px-3 py-2 dark:border-gray-700">Good</td>
                <td className="border px-3 py-2 dark:border-gray-700">Minor keyword or structure fixes needed.</td>
              </tr>
              <tr>
                <td className="border px-3 py-2 dark:border-gray-700">Below 60</td>
                <td className="border px-3 py-2 dark:border-gray-700">Needs Improvement</td>
                <td className="border px-3 py-2 dark:border-gray-700">Revise keywords and formatting for better results.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">
          ❓ Frequently Asked Questions
        </h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            <strong>Q:</strong> Is my data stored or shared?<br />
            <strong>A:</strong> No, all resumes are processed securely and never shared with third parties.
          </p>
          <p>
            <strong>Q:</strong> What file types can I upload?<br />
            <strong>A:</strong> We currently support <code>.pdf</code> and <code>.docx</code> formats.
          </p>
          <p>
            <strong>Q:</strong> How often should I update my resume?<br />
            <strong>A:</strong> Customize it for every new role you apply to — matching the job description improves your ATS score.
          </p>
        </div>
      </section>

      {/* Learn More Section */}
      <section className="text-center">
        <a
          href="#"
          className="inline-block mt-4 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Learn More
        </a>
      </section>
    </div>
  );
}

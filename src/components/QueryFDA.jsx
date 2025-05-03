import { useState } from 'react';
import axios from 'axios';
import { DownloadChecklistButton } from './makeActionable';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';


function BeautifiedResponse({ answer }) {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Non-Compliance Summary</h3>
      <div className="space-y-4">
        {answer.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="bg-blue-50 border-b border-blue-100 py-2 px-4 flex items-center">
              <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-medium text-sm mr-2">
                {index + 1}
              </div>
              <h4 className="font-medium text-gray-800">{item.title}</h4>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="bg-blue-50 rounded p-3 border border-blue-100">
                <h5 className="font-medium text-blue-700 mb-1 flex items-center text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Regulation
                </h5>
                <p className="text-blue-800 text-sm">{item.fda_requirement_summary}</p>
              </div>
              
              <div className="bg-gray-50 rounded p-3 border border-gray-200">
                <h5 className="font-medium text-gray-700 mb-1 flex items-center text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                  </svg>
                  User Summary
                </h5>
                <p className="text-gray-600 text-sm">{item.user_summary}</p>
              </div>
              
              <div className="bg-red-50 rounded p-3 border border-red-100">
                <h5 className="font-medium text-red-700 mb-1 flex items-center text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  Issues in SOP
                </h5>
                <ul className="space-y-1 list-disc pl-5 text-sm">
                  {Array.isArray(item.potential_issues) && item.potential_issues.length > 0 ? (
                    item.potential_issues.map((issue, i) => (
                      <li key={i} className="text-red-800">{issue}</li>
                    ))
                  ) : (
                    <li className="text-red-800">{item.issue || (typeof item.potential_issues === 'string' ? item.potential_issues : 'No specific issues found - review SOP against regulation')}</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const SuggestionReview = ({ suggestions, onSave }) => {
  const [accepted, setAccepted] = useState({});

  const handleAccept = (index) => {
    setAccepted(prev => ({ ...prev, [index]: suggestions[index].suggestion }));
  };

  const handleReject = (index) => {
    setAccepted(prev => ({ ...prev, [index]: suggestions[index].original }));
  };

  const handleSave = () => {
    const final = suggestions.map((s, i) => {
      const item = accepted[i] || s.original;
      if (typeof item === 'object' && item.code && item.description) {
        return `${item.code} ${item.description}`;
      }
      return item;
    });
    onSave(final);
  
    // Join final SOP content
    const content = final.join('\n\n');
  
    // Trigger file download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Updated_SOP.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">SOP Improvement Suggestions</h3>
      <p className="text-gray-600 text-center mb-6">Review and accept/reject the suggested changes to improve your SOP document.</p>
      
      <div className="space-y-8">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="bg-blue-50 border-b border-blue-100 py-2 px-4 flex items-center">
              <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-medium text-sm mr-2">
                {i + 1}
              </div>
              <h4 className="font-medium text-gray-800">Suggested Change</h4>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="overflow-hidden rounded border border-gray-200">
                <ReactDiffViewer
                  oldValue={s.original}
                  newValue={s.suggestion}
                  splitView={true}
                  showDiffOnly={true}
                  compareMethod={DiffMethod.WORDS}
                  disableWordDiff={false}
                  styles={{
                    variables: {
                      light: {
                        diffViewerBackground: '#ffffff',
                        diffViewerColor: '#212121',
                        addedBackground: '#e6ffec',
                        addedColor: '#24292e',
                        removedBackground: '#ffebe9',
                        removedColor: '#24292e',
                        wordAddedBackground: '#abf2bc',
                        wordRemovedBackground: '#ffc0bd',
                        addedGutterBackground: '#cdffd8',
                        removedGutterBackground: '#ffdce0',
                        gutterBackground: '#f8f8f8',
                        gutterBackgroundDark: '#f3f1f1',
                        highlightBackground: '#fffbdd',
                        highlightGutterBackground: '#fff5b1',
                      },
                    },
                    contentText: {
                      fontSize: '0.8rem',
                      lineHeight: '1.4',
                      fontFamily: '"Menlo", "Monaco", "Consolas", "Courier New", monospace',
                    },
                    line: {
                      padding: '0.2rem',
                    },
                  }}
                />
              </div>
              
              {s.suggestion !== 'NO CHANGE' ? (
                <>
                  <div className="bg-yellow-50 border border-yellow-100 rounded p-3">
                    <h5 className="font-medium text-yellow-800 mb-1 flex items-center text-sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Reason for change:
                    </h5>
                    <p className="text-yellow-700 text-sm">{s.reason}</p>
                  </div>
                  
                  <div className="flex justify-center gap-3 mt-2">
                    <button 
                      onClick={() => handleAccept(i)}
                      className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded shadow-sm transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Accept Change
                    </button>
                    <button 
                      onClick={() => handleReject(i)}
                      className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded shadow-sm transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      Reject Change
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-gray-100 text-gray-600 p-3 rounded text-center font-medium">
                  No changes needed for this section
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {suggestions.length > 0 && (
        <div className="flex justify-center mt-8">
          <button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded shadow-sm hover:shadow transition-all flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
            </svg>
            Save & Download Final SOP
          </button>
        </div>
      )}
    </div>
  );
};

function QueryFDA() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [finalSOP, setFinalSOP] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleQuery = async () => {
    if (!file) {
      setError('Please upload a SOP file first');
      return;
    }

    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError(null);
    setAnswer(null);
    setSuggestions([]);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("question", question);

      const res = await axios.post("https://norma-ai.onrender.com/query_compare", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Parse the JSON responses if needed
      const parsedAnswers = res.data.answer.map(entry => {
        try {
          // Some models return JSON as a code block or string. Strip wrapping.
          const cleaned = entry.trim().replace(/^```json\n/, '').replace(/\n```$/, '');
          return JSON.parse(cleaned);
        } catch (e) {
          console.error("❌ JSON parse error:", e);
          return {
            title: "Parsing Error",
            fda_requirement_summary: "Could not parse response.",
            user_summary: question,
            potential_issues: [entry],
          };
        }
      });
      
      console.log('Parsed Response:', parsedAnswers);
      setAnswer(parsedAnswers);

      const fileData = new FormData();
      fileData.append('file', file);

      const textRes = await axios.post('http://localhost:3001/extract-pdf-text', fileData);
      const extractedText = textRes.data.text;

      const suggestionRes = await axios.post('http://localhost:3001/generate-suggestions', {
        paragraphs: extractedText.split('\n\n').filter(p => p.trim().length > 0),
        complianceNotes: parsedAnswers.map((item) => item.fda_requirement_summary || ''),
      });
      
      setSuggestions(suggestionRes.data.suggestions);
    } catch (err) {
      console.error('Error querying FDA:', err);
      setError('Failed to analyze SOP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (final) => {
    setFinalSOP(final);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-4 px-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Analyze SOP Compliance
        </h2>
      </div>
      
      {/* Card Body */}
      <div className="p-6 space-y-6">
        {/* SOP Upload */}
        <div className="space-y-2">
          <label htmlFor="sop-file" className="block text-sm font-medium text-gray-700 mb-1">
            Upload SOP Document:
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${file ? 'bg-blue-50 border-blue-300' : 'border-gray-300 hover:border-blue-400'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('sop-file').click()}
          >
            <input
              type="file"
              id="sop-file"
              onChange={handleFileChange}
              accept=".txt,.pdf,.doc,.docx"
              className="hidden"
            />
            
            <div className="flex flex-col items-center justify-center space-y-2">
              {file ? (
                <>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-blue-700">{file.name}</span>
                  <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
                  >
                    Remove file
                  </button>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Drag and drop your SOP file here</p>
                  <p className="text-xs text-gray-500">or click to browse files</p>
                  <p className="text-xs text-gray-400 mt-1">Accepts .txt, .pdf, .doc, .docx</p>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Compliance Question */}
        <div className="space-y-2">
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
            Compliance Question:
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Does this SOP comply with 21 CFR Part 11?"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 py-3 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Ask specific questions about regulatory compliance of your SOP</p>
        </div>
        
        {/* Submit Button */}
        <div className="pt-2">
          <button 
            onClick={handleQuery} 
            disabled={loading}
            className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing SOP...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                Analyze Compliance
              </>
            )}
          </button>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Results Section - Full Width */}
      {(answer || suggestions.length > 0 || finalSOP) && (
        <div className="w-full mt-8">
          {answer && (
            <>
              <BeautifiedResponse answer={answer} />
              {Array.isArray(answer) && <DownloadChecklistButton nonCompliantRules={answer} />}
            </>
          )}

          {suggestions.length > 0 && (
            <SuggestionReview suggestions={suggestions} onSave={handleSave} />
          )}

          {finalSOP && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Final SOP Content</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-auto max-h-96">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">{finalSOP.join('\n\n')}</pre>
              </div>
              <div className="flex justify-center mt-4">
                <button 
                  onClick={() => {
                    const content = finalSOP.join('\n\n');
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'Final_SOP.txt';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                  </svg>
                  Download as Text File
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default QueryFDA;

// src/components/UploadFDADoc.jsx
import { useState } from 'react';
import axios from 'axios';

function UploadFDADoc() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState(''); // 'loading', 'success', 'error'

  const handleUpload = async () => {
    if (!file) return alert('Please select a file');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setStatus('Uploading document...');
      setStatusType('loading');
      
      const res = await axios.post('https://norma-node.onrender.com/upload-fda', formData);
      
      setStatus(res.data.message);
      setStatusType('success');
    } catch (error) {
      console.error(error);
      setStatus('Upload failed. Please try again.');
      setStatusType('error');
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div className="bg-blue-50 border-b border-blue-100 py-4 px-6">
        <h2 className="text-xl font-semibold text-gray-800 text-center">Upload Guidance Document</h2>
        <p className="text-gray-600 mt-1 mx-auto max-w-xl text-center text-sm">
          Upload an FDA guidance document in PDF format to analyze for compliance requirements.
        </p>
      </div>
      
      <div className="p-6">
        <div className="mx-auto max-w-xl mb-6">
          <label 
            htmlFor="file-upload" 
            className="cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50/50 hover:bg-blue-50 transition-colors"
          >
            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center text-blue-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <span className="text-gray-700 font-medium">Choose PDF file</span>
            <span className="text-gray-500 text-sm mt-1">Click to browse files</span>
            
            {file && (
              <div className="mt-4 bg-blue-100 px-3 py-2 rounded-full flex items-center max-w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span className="text-blue-600 font-medium text-sm truncate">{file.name}</span>
              </div>
            )}
          </label>
          <input 
            id="file-upload"
            type="file" 
            accept=".pdf" 
            onChange={e => setFile(e.target.files[0])} 
            className="hidden"
          />
        </div>
        
        <div className="flex justify-center mt-4">
          <button 
            onClick={handleUpload} 
            disabled={!file || statusType === 'loading'}
            className={`px-4 py-2 rounded-md font-medium text-white flex items-center justify-center transition-all text-sm ${!file ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow'}`}
          >
            {statusType === 'loading' ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              'Upload Document'
            )}
          </button>
        </div>
        
        {status && (
          <div className={`mt-4 p-3 rounded-md text-center max-w-xl mx-auto text-sm ${
            statusType === 'loading' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 
            statusType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
            'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <div className="flex items-center justify-center">
              {statusType === 'loading' && (
                <svg className="animate-spin h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {statusType === 'success' && (
                <svg className="h-4 w-4 mr-1.5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {statusType === 'error' && (
                <svg className="h-4 w-4 mr-1.5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-medium">{status}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default UploadFDADoc;

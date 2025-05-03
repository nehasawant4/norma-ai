import UploadFDADoc from './components/UploadFDADoc';
import QueryFDA from './components/QueryFDA';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h1 className="text-3xl font-bold text-white mb-1">ReguLens</h1>
          <p className="text-white/90 text-lg">FDA Regulatory Compliance Assistant</p>
        </div>
      </header>
      
      <main className="flex-grow py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Top section with side-by-side cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full h-full">
              <UploadFDADoc />
            </div>
            <div className="w-full h-full">
              <QueryFDA />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

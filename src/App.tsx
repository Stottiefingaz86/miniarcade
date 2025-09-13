import StableChatHead from './components/StableChatHead'

function App() {
  return (
    <div className="App">
      {/* Demo content to show the chat head floating above */}
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Wireframe Header */}
          <div className="border-2 border-dashed border-gray-400 rounded-lg p-6 mb-6">
            <div className="h-8 bg-gray-300 rounded mb-4 w-1/3 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          
          {/* Wireframe Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="border-2 border-dashed border-gray-400 rounded-lg p-6">
                <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Chat Head Component */}
      <StableChatHead />
    </div>
  )
}

export default App


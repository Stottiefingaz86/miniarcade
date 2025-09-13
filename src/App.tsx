import StableChatHead from './components/StableChatHead'

function App() {
  return (
    <div className="App">
      {/* Demo content to show the chat head floating above */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            Mini Arcade
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Demo Content {i + 1}
                </h3>
                <p className="text-gray-600">
                  This is demo content to show how the chat head floats above the page content.
                  Try dragging the floating bubble around!
                </p>
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


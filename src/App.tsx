import React, { useState } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { Pencil } from 'lucide-react';

function App() {
  const [content, setContent] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Pencil className="h-6 w-6 text-red-500" />
            <h1 className="ml-2 text-xl font-semibold text-gray-900">小红书文章编辑器</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm">
            <Editor onUpdate={setContent} />
          </div>
          <div className="hidden lg:block">
            <Preview content={content} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
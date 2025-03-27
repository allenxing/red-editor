import { useEffect, useState } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import PhonePreview from './components/PhonePreview';
import { Pencil } from 'lucide-react'; // 新增Smartphone图标
import { storageKey, setLocalStorage } from './utils/storage';

function App() {
  const [content, setContent] = useState('');
  useEffect(() => {
    setLocalStorage(storageKey, content);
  }, [content]);

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
      
      <main className="max-w-8xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 ">
          <div className="bg-white rounded-lg shadow-sm lg:col-span-2">
            <Editor onUpdate={setContent} />
          </div>
          <div className=" lg:block lg:col-span-2">
            <Preview content={content} />
          </div>
          <div className="lg:block lg:col-span-1">
            <div className="sticky top-4 self-start"> {/* 新增sticky容器 */}
              <PhonePreview content={content} />
            </div>
          </div>
          {/* 更新右侧预览区域 */}
          {/* <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center text-gray-600">
                <Smartphone className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">移动端预览</span>
              </div>
            </div>
            <div className="relative mx-auto p-8" style={{ maxWidth: '375px' }}>
              <img 
                src="/assets/natural-titanium.png"
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                alt="手机模型"
              />
              <div className="relative pt-12 pb-16 px-5" style={{ 
                minHeight: '667px',
                height: '667px', // 新增固定高度
                display: 'flex', // 添加弹性布局
                flexDirection: 'column',
                overflow: 'hidden' // 隐藏外层溢出
              }}>
                <div 
                  className="flex-1 overflow-y-auto" // 滚动容器
                  style={{ 
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#e5e7eb transparent'
                  }}>
                  <Preview content={content} />
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </main>
    </div>
  );
}

export default App;
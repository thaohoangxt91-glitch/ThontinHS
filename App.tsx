
import React, { useState, useEffect } from 'react';
import { Student } from './types';
import StudentForm from './components/StudentForm';
import StudentTable from './components/StudentTable';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'list' | 'analytics' | 'settings'>('form');
  const [scriptUrl, setScriptUrl] = useState<string>(localStorage.getItem('google_script_url') || '');

  // Tải dữ liệu từ Google Sheets (nếu có URL)
  const fetchData = async () => {
    if (!scriptUrl) return;
    setIsLoading(true);
    try {
      const response = await fetch(scriptUrl);
      const data = await response.json();
      if (Array.isArray(data)) {
        setStudents(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu từ Sheets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [scriptUrl]);

  const handleAddStudent = async (newStudent: Omit<Student, 'id' | 'createdAt'>) => {
    const studentWithId: Student = {
      ...newStudent,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    // Lưu cục bộ trước để phản hồi nhanh UI
    const updated = [studentWithId, ...students];
    setStudents(updated);

    // Nếu có scriptUrl, gửi lên Google Sheets
    if (scriptUrl) {
      try {
        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors', // Apps Script yêu cầu no-cors nếu không cấu hình CORS phức tạp
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentWithId)
        });
        // Vì no-cors không đọc được response, ta giả định thành công
        // Hoặc fetch lại data sau 1 khoảng thời gian
        setTimeout(fetchData, 2000);
      } catch (error) {
        console.error("Lỗi khi lưu vào Sheets:", error);
      }
    }
    
    setActiveTab('list');
  };

  const handleDelete = (id: string) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    // Lưu ý: Tính năng xóa trên Sheets cần script hỗ trợ thêm action="delete"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <i className="fas fa-user-graduate text-white"></i>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              StudentHub
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => setActiveTab('form')} className={`text-sm font-medium transition-colors ${activeTab === 'form' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Thêm học sinh</button>
            <button onClick={() => setActiveTab('list')} className={`text-sm font-medium transition-colors ${activeTab === 'list' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Danh sách</button>
            <button onClick={() => setActiveTab('analytics')} className={`text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Thống kê AI</button>
            <button onClick={() => setActiveTab('settings')} className={`text-lg transition-colors ${activeTab === 'settings' ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`} title="Cài đặt">
              <i className="fas fa-cog"></i>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto w-full p-4 md:p-8">
        {isLoading && (
          <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-[60] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        <div className="animate-fadeIn">
          {activeTab === 'form' && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-slate-800">Thu thập thông tin</h2>
                <p className="text-slate-500 mt-2">Dữ liệu sẽ được đồng bộ trực tiếp với Google Sheets</p>
              </div>
              <StudentForm onSubmit={handleAddStudent} />
            </div>
          )}

          {activeTab === 'list' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Danh sách học sinh</h2>
                <button onClick={fetchData} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-all" title="Làm mới">
                  <i className="fas fa-sync-alt"></i>
                </button>
              </div>
              <StudentTable students={students} onDelete={handleDelete} />
            </div>
          )}

          {activeTab === 'analytics' && <Dashboard students={students} />}
          
          {activeTab === 'settings' && (
            <Settings 
              url={scriptUrl} 
              onSave={(url) => {
                setScriptUrl(url);
                localStorage.setItem('google_script_url', url);
                setActiveTab('form');
              }} 
            />
          )}
        </div>
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-50">
        <button onClick={() => setActiveTab('form')} className={`flex flex-col items-center gap-1 ${activeTab === 'form' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <i className="fas fa-plus-circle"></i>
          <span className="text-[10px]">Thêm mới</span>
        </button>
        <button onClick={() => setActiveTab('list')} className={`flex flex-col items-center gap-1 ${activeTab === 'list' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <i className="fas fa-list"></i>
          <span className="text-[10px]">Danh sách</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <i className="fas fa-cog"></i>
          <span className="text-[10px]">Cài đặt</span>
        </button>
      </div>
    </div>
  );
};

export default App;

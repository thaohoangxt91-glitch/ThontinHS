
import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GoogleGenAI } from "@google/genai";

interface DashboardProps {
  students: Student[];
}

const Dashboard: React.FC<DashboardProps> = ({ students }) => {
  const [insight, setInsight] = useState<string>('Đang phân tích dữ liệu...');
  const [isGenerating, setIsGenerating] = useState(false);

  // Group by class
  const classStats = students.reduce((acc: any, student) => {
    acc[student.className] = (acc[student.className] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(classStats).map(name => ({
    name,
    count: classStats[name],
  }));

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

  useEffect(() => {
    const fetchAIInsight = async () => {
      if (students.length === 0) {
        setInsight('Vui lòng thêm học sinh để nhận phân tích từ AI.');
        return;
      }

      setIsGenerating(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        const studentListText = students.map(s => `${s.fullName} - ${s.className}`).join(', ');
        const prompt = `Bạn là một trợ lý quản lý giáo dục. Dưới đây là danh sách học sinh: [${studentListText}]. 
        Hãy tóm tắt nhanh về phân bổ học sinh theo lớp và đưa ra một vài nhận xét ngắn gọn về cấu trúc lớp học (Ví dụ: lớp nào đông nhất, tổng số lượng). Trả lời bằng tiếng Việt, súc tích trong 3-4 câu.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
        });
        
        setInsight(response.text || 'Không có dữ liệu phân tích.');
      } catch (error) {
        console.error("AI Error:", error);
        setInsight('Có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.');
      } finally {
        setIsGenerating(false);
      }
    };

    fetchAIInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students.length]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Tổng số học sinh</div>
          <div className="text-4xl font-extrabold text-indigo-600">{students.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Số lượng lớp</div>
          <div className="text-4xl font-extrabold text-purple-600">{Object.keys(classStats).length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Trung bình / Lớp</div>
          <div className="text-4xl font-extrabold text-emerald-600">
            {students.length > 0 ? (students.length / Object.keys(classStats).length).toFixed(1) : 0}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i className="fas fa-chart-bar text-indigo-500"></i>
            Phân bổ theo lớp
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <i className="fas fa-brain text-9xl"></i>
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <i className="fas fa-magic text-yellow-400"></i>
              Gemini AI Phân tích
            </h3>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 min-h-[200px]">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <p className="text-sm animate-pulse">Đang suy luận...</p>
                </div>
              ) : (
                <p className="leading-relaxed text-indigo-50">
                  {insight}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

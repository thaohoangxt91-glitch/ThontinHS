
import React, { useState } from 'react';
import { Student } from '../types';

interface StudentFormProps {
  onSubmit: (student: Omit<Student, 'id' | 'createdAt'>) => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    className: '',
    birthDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.className || !formData.birthDate) return;
    
    onSubmit(formData);
    setFormData({ fullName: '', className: '', birthDate: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Họ và Tên</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <i className="fas fa-user"></i>
            </span>
            <input
              type="text"
              required
              placeholder="Nguyễn Văn A"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Lớp</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <i className="fas fa-school"></i>
            </span>
            <input
              type="text"
              required
              placeholder="12A1"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={formData.className}
              onChange={(e) => setFormData({ ...formData, className: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Ngày tháng năm sinh</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <i className="fas fa-calendar-alt"></i>
            </span>
            <input
              type="date"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <i className="fas fa-save"></i>
        Lưu thông tin
      </button>
      
      <p className="text-xs text-center text-slate-400">
        Dữ liệu sẽ được lưu trữ đồng bộ với hệ thống quản lý học sinh.
      </p>
    </form>
  );
};

export default StudentForm;


import React, { useState } from 'react';

interface SettingsProps {
  url: string;
  onSave: (url: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ url, onSave }) => {
  const [inputUrl, setInputUrl] = useState(url);

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Cài đặt kết nối</h2>
        <p className="text-slate-500 text-sm mt-1">Kết nối ứng dụng với Google Sheets thông qua Apps Script</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Google Apps Script Web App URL</label>
          <input
            type="url"
            placeholder="https://script.google.com/macros/s/.../exec"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono text-sm"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
          />
        </div>

        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
          <h4 className="text-amber-800 font-bold text-sm mb-2 flex items-center gap-2">
            <i className="fas fa-info-circle"></i> Hướng dẫn tạo Apps Script:
          </h4>
          <ol className="text-amber-700 text-xs space-y-2 list-decimal ml-4">
            <li>Mở Google Sheet của bạn.</li>
            <li>Chọn <b>Extensions (Tiện ích mở rộng)</b> > <b>Apps Script</b>.</li>
            <li>Dán đoạn mã script được cung cấp bên dưới vào.</li>
            <li>Nhấn <b>Deploy</b> > <b>New Deployment</b>.</li>
            <li>Chọn Type là <b>Web App</b>.</li>
            <li>Set "Who has access" thành <b>Anyone</b>.</li>
            <li>Copy URL nhận được và dán vào ô bên trên.</li>
          </ol>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl relative">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-[10px] font-bold uppercase">Apps Script Code</span>
            <button 
              onClick={() => {
                const code = `function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var result = [];
  for (var i = 1; i < data.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = data[i][j];
    }
    result.push(obj);
  }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  if (sheet.getLastRow() == 0) {
    sheet.appendRow(["id", "fullName", "className", "birthDate", "createdAt"]);
  }
  sheet.appendRow([data.id, data.fullName, data.className, data.birthDate, data.createdAt]);
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}`;
                navigator.clipboard.writeText(code);
                alert("Đã sao chép mã script!");
              }}
              className="text-indigo-400 hover:text-indigo-300 text-xs font-bold"
            >
              Sao chép mã
            </button>
          </div>
          <pre className="text-emerald-400 text-[10px] overflow-x-auto">
{`function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var result = [];
  for (var i = 1; i < data.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = data[i][j];
    }
    result.push(obj);
  }
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  if (sheet.getLastRow() == 0) {
    sheet.appendRow(["id", "fullName", "className", "birthDate", "createdAt"]);
  }
  sheet.appendRow([data.id, data.fullName, data.className, data.birthDate, data.createdAt]);
  return ContentService.createTextOutput("Success")
    .setMimeType(ContentService.MimeType.TEXT);
}`}
          </pre>
        </div>

        <button
          onClick={() => onSave(inputUrl)}
          className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
        >
          <i className="fas fa-check-circle"></i>
          Lưu cài đặt & Kết nối
        </button>
      </div>
    </div>
  );
};

export default Settings;

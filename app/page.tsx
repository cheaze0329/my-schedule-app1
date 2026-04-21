'use client';

import React, { useState } from 'react';

interface UserResponse {
  name: string;
  choices: string[];
}

export default function ScheduleApp() {
  // 1. 設定（時間を10:00〜22:00に拡張）
  const dates = ['水曜', '木曜', '金曜', '土曜', '日曜', '月曜', '火曜'
  ];
  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', 
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
  ];
  const allSlots = dates.flatMap(date => timeSlots.map(time => `${date} ${time}`));

  // 2. 状態管理
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [newName, setNewName] = useState('');
  const [newChoices, setNewChoices] = useState<string[]>(Array(allSlots.length).fill('○'));

  // 回答追加
  const addResponse = () => {
    if (!newName) return alert("名前を入力してください");
    setResponses([...responses, { name: newName, choices: newChoices }]);
    setNewName('');
    setNewChoices(Array(allSlots.length).fill('○'));
  };

  // 記号切り替え
  const toggleChoice = (index: number) => {
    const marks = ['○', '△', '×'];
    const currentMark = newChoices[index];
    const nextMark = marks[(marks.indexOf(currentMark) + 1) % marks.length];
    const updated = [...newChoices];
    updated[index] = nextMark;
    setNewChoices(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-2 sm:px-4 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200">
        <div className="bg-indigo-700 p-6 sm:p-8 text-white">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center tracking-tight">会議日程調整システム</h1>
          <p className="text-indigo-200 text-center mt-2 text-sm sm:text-base">10:00〜22:00の予定を入力してください</p>
        </div>

        <div className="p-4 sm:p-8">
          {/* 集計セクション */}
          <div className="overflow-x-auto mb-12 rounded-xl border border-slate-300 shadow-sm">
            <table className="w-full border-collapse text-sm">
              <thead>
                {/* 1段目：日付 */}
                <tr className="bg-slate-200">
                  <th rowSpan={2} className="p-4 text-left border-b border-r border-slate-300 sticky left-0 bg-slate-200 z-20 w-32 font-bold text-slate-700 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                    参加者
                  </th>
                  {dates.map(date => (
                    <th key={date} colSpan={timeSlots.length} className="p-2 text-center border-b border-l border-slate-300 font-bold text-slate-800 bg-slate-100 text-base">
                      {date}
                    </th>
                  ))}
                </tr>
                {/* 2段目：時間 */}
                <tr className="bg-slate-50">
                  {dates.map(date => (
                    timeSlots.map(time => (
                      <th key={`${date}-${time}`} className="p-2 text-center border-b border-l border-slate-200 min-w-[50px] text-xs font-bold text-slate-500">
                        {time}
                      </th>
                    ))
                  ))}
                </tr>
              </thead>
              <tbody>
                {responses.length === 0 ? (
                  <tr>
                    <td colSpan={allSlots.length + 1} className="p-10 text-center text-slate-400">
                      まだ回答がありません。下のフォームから入力してください。
                    </td>
                  </tr>
                ) : (
                  responses.map((res, i) => (
                    <tr key={i} className="hover:bg-slate-50 border-b border-slate-200">
                      <td className="p-4 font-bold sticky left-0 bg-white shadow-[2px_0_5px_rgba(0,0,0,0.05)] text-slate-700 border-r border-slate-200 z-10">
                        {res.name}
                      </td>
                      {res.choices.map((choice, j) => (
                        <td key={j} className={`p-2 text-center text-lg sm:text-xl border-l border-slate-200 ${
                          choice === '○' ? 'text-green-500 font-bold' : choice === '△' ? 'text-amber-500 font-bold' : 'text-rose-300'
                        }`}>
                          {choice}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
                {/* 合計行 */}
                {responses.length > 0 && (
                  <tr className="bg-indigo-50 font-black">
                    <td className="p-4 sticky left-0 bg-indigo-50 text-indigo-900 font-bold border-r border-slate-300 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">合計 (○)</td>
                    {allSlots.map((_, j) => (
                      <td key={j} className="p-2 text-center text-indigo-700 border-l border-slate-300 text-lg">
                        {responses.filter(r => r.choices[j] === '○').length}
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 入力フォーム */}
          <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border-2 border-indigo-100 shadow-inner">
            <h2 className="text-xl font-bold mb-6 text-slate-700">予定を入力</h2>
            
            <input
              type="text"
              placeholder="氏名"
              className="w-full mb-8 p-4 text-lg border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            <div className="space-y-10">
              {dates.map((date) => (
                <div key={date}>
                  <h3 className="font-bold text-indigo-600 mb-4 ml-1 flex items-center gap-2 border-b border-indigo-100 pb-2">
                     {date}
                  </h3>
                  {/* グリッドを時間数に合わせてレスポンシブに調整 */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 sm:gap-3">
                    {timeSlots.map((time) => {
                      const overallIdx = allSlots.indexOf(`${date} ${time}`);
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => toggleChoice(overallIdx)}
                          className={`py-3 px-2 rounded-xl border-2 transition-all active:scale-90 flex flex-col items-center gap-1 shadow-sm hover:shadow-md ${
                            newChoices[overallIdx] === '○' ? 'bg-white border-green-500 text-green-600' :
                            newChoices[overallIdx] === '△' ? 'bg-white border-amber-500 text-amber-600' :
                            'bg-slate-100 border-slate-300 text-slate-400 opacity-70'
                          }`}
                        >
                          <span className="text-xs sm:text-sm font-bold">{time}</span>
                          <span className="text-2xl sm:text-3xl leading-none">{newChoices[overallIdx]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addResponse}
              className="w-full mt-12 bg-indigo-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              回答を送信
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
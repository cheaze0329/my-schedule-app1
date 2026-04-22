'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://fsltbygsesvmifuucouv.supabase.co',
  'sb_publishable_tR-2MI2LPfh4O9-rMCQyTA_EUYj937U'
);

interface UserResponse {
  id?: string; // SupabaseのID
  name: string;
  choices: string[];
}

export default function ScheduleApp() {
  const dates = ['水曜', '木曜', '金曜', '土曜', '日曜','月曜','火曜'];
  const timeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
  const allSlots = dates.flatMap(date => timeSlots.map(time => `${date} ${time}`));

  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [newName, setNewName] = useState('');
  const [newChoices, setNewChoices] = useState<string[]>(Array(allSlots.length).fill('×'));

  useEffect(() => {
    fetchResponses();
  }, []);

  async function fetchResponses() {
    const { data } = await supabase.from('schedule_responses').select('*').order('created_at', { ascending: true });
    if (data) setResponses(data);
  }

  const addResponse = async () => {
    if (!newName) return alert("名前を入力してください");
    const { error } = await supabase.from('schedule_responses').insert([{ name: newName, choices: newChoices }]);
    if (error) {
      alert("保存失敗: " + error.message);
      console.error(error); // ついでに裏側にも記録を残す
    } else {
      fetchResponses();
      setNewName('');
      setNewChoices(Array(allSlots.length).fill('×'));
    }
  };

  // 【追加】削除機能
  const deleteResponse = async (id: string) => {
    if (!confirm("この回答を取り消しますか？")) return;
    const { error } = await supabase.from('schedule_responses').delete().eq('id', id);
    if (error) {
      alert("削除に失敗しました");
    } else {
      fetchResponses();
    }
  };

  const toggleChoice = (index: number) => {
    const marks = ['○', '△', '×'];
    const currentMark = newChoices[index];
    const nextMark = marks[(marks.indexOf(currentMark) + 1) % marks.length];
    const updated = [...newChoices];
    updated[index] = nextMark;
    setNewChoices(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-2 sm:px-4 text-slate-800">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border">
        <div className="bg-indigo-700 p-8 text-white text-center">
          <h1 className="text-3xl font-extrabold">会議日程調整システム</h1>
        </div>

        <div className="p-4 sm:p-8">
          <div className="overflow-x-auto mb-12 rounded-xl border shadow-sm">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-200">
                  <th rowSpan={2} className="p-4 border-r sticky left-0 bg-slate-200 z-20">操作 / 参加者</th>
                  {dates.map(date => <th key={date} colSpan={timeSlots.length} className="p-2 border-b border-l font-bold">{date}</th>)}
                </tr>
                <tr className="bg-slate-50">
                  {dates.map(date => timeSlots.map(time => <th key={`${date}-${time}`} className="p-1 border-b border-l text-[10px]">{time}</th>))}
                </tr>
              </thead>
              <tbody>
                {responses.map((res, i) => (
                  <tr key={i} className="hover:bg-slate-50 border-b">
                    <td className="p-2 sticky left-0 bg-white border-r z-10 flex items-center gap-2">
                      {/* 削除ボタン */}
                      <button 
                        onClick={() => res.id && deleteResponse(res.id)}
                        className="text-rose-500 hover:bg-rose-50 px-2 py-1 rounded text-xs border border-rose-200"
                      >
                        消去
                      </button>
                      <span className="font-bold">{res.name}</span>
                    </td>
                    {res.choices.map((choice, j) => (
                      <td key={j} className={`p-2 text-center border-l ${choice === '○' ? 'text-green-500' : choice === '△' ? 'text-amber-500' : 'text-slate-300'}`}>
                        {choice}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 入力フォーム部分は前回と同じ */}
          <div className="bg-slate-50 p-6 rounded-2xl border-2 border-indigo-100">
             {/* ...前回のフォームのコード... */}
             <input
              type="text"
              placeholder="氏名"
              className="w-full mb-6 p-4 border rounded-xl"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            {/* 日付ごとのボタン選択UI */}
            {dates.map(date => (
              <div key={date} className="mb-6">
                <h3 className="font-bold mb-3"> {date}</h3>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map(time => {
                    const idx = allSlots.indexOf(`${date} ${time}`);
                    return (
                      <button key={time} onClick={() => toggleChoice(idx)} className="p-2 border rounded-lg bg-white w-16">
                        <div className="text-[10px] text-slate-400">{time}</div>
                        <div className="text-lg font-bold">{newChoices[idx]}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <button onClick={addResponse} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold">送信して保存する </button>
          </div>
        </div>
      </div>
    </div>
  );
}
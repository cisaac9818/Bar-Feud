import React, { useState, useRef } from 'react';
import { FastMoneyQuestion } from '../types/fastMoney';
import { Plus, X, Trash2, Upload, Download } from 'lucide-react';
import { parseFastMoneyJSON, exportFastMoneyToJSON } from '../utils/questionImportExport';

interface FastMoneyManagerProps {
  questions: FastMoneyQuestion[];
  onAddQuestion: (question: FastMoneyQuestion) => void;
  onDeleteQuestion: (id: string) => void;
}

export const FastMoneyManager: React.FC<FastMoneyManagerProps> = ({
  questions,
  onAddQuestion,
  onDeleteQuestion,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [answers, setAnswers] = useState<Array<{ text: string; points: number }>>([
    { text: '', points: 0 },
    { text: '', points: 0 },
    { text: '', points: 0 },
    { text: '', points: 0 },
    { text: '', points: 0 },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const question: FastMoneyQuestion = {
      id: `fm_${Date.now()}`,
      question: newQuestion,
      answers: answers.map(a => ({
        text: a.text,
        points: a.points,
      })),
    };
    onAddQuestion(question);
    setNewQuestion('');
    setAnswers([
      { text: '', points: 0 },
      { text: '', points: 0 },
      { text: '', points: 0 },
      { text: '', points: 0 },
      { text: '', points: 0 },
    ]);
    setShowForm(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsedQuestions = parseFastMoneyJSON(text);

      if (parsedQuestions.length > 0) {
        parsedQuestions.forEach(q => onAddQuestion(q));
        alert(`Successfully imported ${parsedQuestions.length} Fast Money questions!`);
      } else {
        alert('No valid Fast Money questions found in file');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl border-4 border-orange-600 space-y-4">
      <h3 className="text-2xl font-black text-orange-400 uppercase text-center">Fast Money Manager</h3>
      
      <div className="flex gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Import JSON
        </button>
        <button
          onClick={() => {
            exportFastMoneyToJSON(questions, 'Fast Money Questions');
            setTimeout(() => {
              alert(`Exported ${questions.length} Fast Money questions to JSON file!`);
            }, 100);
          }}
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="hidden"
      />

      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
      >
        {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        {showForm ? 'Cancel' : 'Add Fast Money Question'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-3 bg-gray-800 p-4 rounded-lg">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Fast Money question..."
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
          <p className="text-sm text-gray-400">Enter 5 answers (top to bottom = most to least popular)</p>
          {answers.map((a, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={a.text}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[i].text = e.target.value;
                  setAnswers(newAnswers);
                }}
                placeholder={`Answer ${i + 1}`}
                className="flex-1 p-2 rounded bg-gray-700 text-white"
                required
              />
              <input
                type="number"
                value={a.points}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[i].points = parseInt(e.target.value) || 0;
                  setAnswers(newAnswers);
                }}
                placeholder="Pts"
                className="w-20 p-2 rounded bg-gray-700 text-white"
                required
              />
            </div>
          ))}
          <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition">
            Save Question
          </button>
        </form>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        <h4 className="text-lg font-bold text-orange-300">Existing Questions ({questions.length})</h4>
        {questions.map((q) => (
          <div key={q.id} className="bg-gray-800 p-3 rounded-lg flex justify-between items-start">
            <div className="flex-1">
              <p className="text-white font-semibold">{q.question}</p>
              <div className="text-xs text-gray-400 mt-1">
                {q.answers.map((a, i) => (
                  <span key={i}>{a.text} ({a.points}){i < q.answers.length - 1 ? ', ' : ''}</span>
                ))}
              </div>
            </div>
            <button
              onClick={() => onDeleteQuestion(q.id)}
              className="text-red-500 hover:text-red-400 ml-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

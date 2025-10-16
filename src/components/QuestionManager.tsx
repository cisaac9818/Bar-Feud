import React, { useState, useRef } from 'react';
import { Question } from '../types/game';
import { parseCSV, parseJSON, exportToJSON, exportToCSV } from '../utils/questionImportExport';
import { Upload, Download, Plus, X } from 'lucide-react';

interface QuestionManagerProps {
  questions: Question[];
  onSelectQuestion: (question: Question) => void;
  onAddQuestion: (question: Question) => void;
  onBulkAddQuestions: (questions: Question[]) => void;
}

export const QuestionManager: React.FC<QuestionManagerProps> = ({
  questions,
  onSelectQuestion,
  onAddQuestion,
  onBulkAddQuestions,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [category, setCategory] = useState('');
  const [answers, setAnswers] = useState<Array<{ text: string; points: number }>>([
    { text: '', points: 0 },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const question: Question = {
      id: Date.now().toString(),
      question: newQuestion,
      category: category || undefined,
      answers: answers.map((a, i) => ({
        id: i + 1,
        text: a.text,
        points: a.points,
        revealed: false,
      })),
    };
    onAddQuestion(question);
    setNewQuestion('');
    setCategory('');
    setAnswers([{ text: '', points: 0 }]);
    setShowForm(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      let parsedQuestions: Question[] = [];

      if (file.name.endsWith('.csv')) {
        parsedQuestions = parseCSV(text);
      } else if (file.name.endsWith('.json')) {
        parsedQuestions = parseJSON(text);
      }

      if (parsedQuestions.length > 0) {
        onBulkAddQuestions(parsedQuestions);
        alert(`Successfully imported ${parsedQuestions.length} questions!`);
      } else {
        alert('No valid questions found in file');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl border-4 border-green-600 space-y-4">
      <h3 className="text-2xl font-black text-green-400 uppercase text-center">Question Manager</h3>
      
      <div className="flex gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Import
        </button>
        <button
          onClick={() => {
            exportToJSON(questions, 'Bar Feud Questions');
            setTimeout(() => {
              alert(`Exported ${questions.length} questions to JSON file!`);
            }, 100);
          }}
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </button>
        <button
          onClick={() => {
            exportToCSV(questions);
            setTimeout(() => {
              alert(`Exported ${questions.length} questions to CSV file!`);
            }, 100);
          }}
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>


      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.json"
        onChange={handleFileUpload}
        className="hidden"
      />

      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
      >
        {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        {showForm ? 'Cancel' : 'Add Question'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-3 bg-gray-800 p-4 rounded-lg">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Question text..."
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (optional)"
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
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
                  newAnswers[i].points = parseInt(e.target.value);
                  setAnswers(newAnswers);
                }}
                placeholder="Pts"
                className="w-20 p-2 rounded bg-gray-700 text-white"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setAnswers([...answers, { text: '', points: 0 }])}
            className="text-sm text-green-400 hover:text-green-300"
          >
            + Add Answer
          </button>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">
            Save Question
          </button>
        </form>
      )}
    </div>
  );
};

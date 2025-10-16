import React, { useState } from 'react';
import { Question } from '../types/game';
import { Search, Filter } from 'lucide-react';

interface QuestionLibraryProps {
  questions: Question[];
  onSelectQuestion: (question: Question) => void;
  categories: string[];
}

export const QuestionLibrary: React.FC<QuestionLibraryProps> = ({
  questions,
  onSelectQuestion,
  categories,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answers.some(a => a.text.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-900 p-6 rounded-xl border-4 border-purple-600 space-y-4">
      <h3 className="text-2xl font-black text-purple-400 uppercase text-center">Question Library</h3>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Filter className="text-gray-400 w-4 h-4 mt-2" />
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredQuestions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No questions found</p>
        ) : (
          filteredQuestions.map((q) => (
            <div
              key={q.id}
              onClick={() => onSelectQuestion(q)}
              className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg cursor-pointer transition group"
            >
              <div className="flex justify-between items-start">
                <p className="text-white font-semibold group-hover:text-purple-400 transition">{q.question}</p>
                {q.category && (
                  <span className="text-xs bg-purple-900 text-purple-300 px-2 py-1 rounded-full ml-2">
                    {q.category}
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm mt-2">{q.answers.length} answers</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

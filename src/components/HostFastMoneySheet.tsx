import React from 'react';
import { FastMoneyQuestion } from '../types/fastMoney';

interface HostFastMoneySheetProps {
  questions: FastMoneyQuestion[];
}

export const HostFastMoneySheet: React.FC<HostFastMoneySheetProps> = ({ questions }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-xl border-4 border-yellow-600 space-y-4">
      <h3 className="text-xl font-black text-yellow-400 uppercase text-center mb-4">
        📋 Fast Money Answer Sheet
      </h3>
      
      <div className="space-y-4">
        {questions.map((question, qIndex) => (
          <div key={question.id} className="bg-black/40 p-4 rounded-lg border-2 border-blue-600">
            <div className="text-white font-bold mb-3 text-lg">
              Q{qIndex + 1}: {question.question}
            </div>
            <div className="space-y-1">
              {question.answers.map((answer, aIndex) => (
                <div 
                  key={aIndex}
                  className="flex items-center justify-between p-2 bg-blue-900/50 rounded border border-blue-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 font-bold">#{aIndex + 1}</span>
                    <span className="text-white font-semibold">{answer.text}</span>
                  </div>
                  <span className="text-yellow-400 font-black text-lg">{answer.points}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-yellow-600 text-center text-sm text-gray-400">
        Reference sheet for host to verify contestant answers
      </div>
    </div>
  );
};

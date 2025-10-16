import { Question, QuestionSet } from '../types/game';
import { FastMoneyQuestion } from '../types/fastMoney';

export const parseCSV = (csvText: string): Question[] => {
  const lines = csvText.trim().split('\n');
  const questions: Question[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
    if (parts.length < 4) continue;
    
    const [question, category, ...answerData] = parts;
    const answers = [];
    
    for (let j = 0; j < answerData.length; j += 2) {
      if (answerData[j] && answerData[j + 1]) {
        answers.push({
          id: answers.length + 1,
          text: answerData[j],
          points: parseInt(answerData[j + 1]) || 0,
          revealed: false,
        });
      }
    }
    
    if (answers.length > 0) {
      questions.push({
        id: Date.now().toString() + i,
        question,
        category,
        answers,
      });
    }
  }
  
  return questions;
};

export const parseJSON = (jsonText: string): Question[] => {
  try {
    const data = JSON.parse(jsonText);
    if (Array.isArray(data)) {
      return data.map((q, i) => ({
        ...q,
        id: q.id || Date.now().toString() + i,
        answers: q.answers.map((a: any, j: number) => ({
          ...a,
          id: j + 1,
          revealed: false,
        })),
      }));
    }
    return [];
  } catch {
    return [];
  }
};

export const exportToJSON = (questions: Question[], setName: string): void => {
  const questionSet: QuestionSet = {
    name: setName,
    questions,
    createdAt: new Date().toISOString(),
  };
  
  const jsonString = JSON.stringify(questionSet, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${setName.replace(/\s+/g, '_')}_${Date.now()}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const exportToCSV = (questions: Question[]): void => {
  let csv = 'Question,Category,Answer1,Points1,Answer2,Points2,Answer3,Points3,Answer4,Points4,Answer5,Points5,Answer6,Points6,Answer7,Points7\n';
  
  questions.forEach(q => {
    const row = [q.question, q.category || ''];
    q.answers.forEach(a => {
      row.push(a.text, a.points.toString());
    });
    csv += row.map(s => `"${s}"`).join(',') + '\n';
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `questions_${Date.now()}.csv`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// Fast Money Import/Export Functions
export const parseFastMoneyJSON = (jsonText: string): FastMoneyQuestion[] => {
  try {
    const data = JSON.parse(jsonText);
    if (Array.isArray(data)) {
      return data.map((q, i) => ({
        id: q.id || Date.now().toString() + i,
        question: q.question,
        answers: q.answers || [],
      }));
    }
    return [];
  } catch {
    return [];
  }
};

export const exportFastMoneyToJSON = (questions: FastMoneyQuestion[], setName: string): void => {
  const questionSet = {
    name: setName,
    questions,
    createdAt: new Date().toISOString(),
  };
  
  const jsonString = JSON.stringify(questionSet, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `fast_money_${setName.replace(/\s+/g, '_')}_${Date.now()}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { SoundCustomizer } from './SoundCustomizer';
import { LogoCustomizer } from './LogoCustomizer';
import { QuestionManager } from './QuestionManager';
import { FastMoneyManager } from './FastMoneyManager';
import { Question } from '../types/game';
import { FastMoneyQuestion } from '../types/fastMoney';

interface UtilitiesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logo: string;
  onLogoChange: (logo: string) => void;
  questions: Question[];
  onAddQuestion: (question: Question) => void;
  onBulkAddQuestions: (questions: Question[]) => void;
  fastMoneyQuestions: FastMoneyQuestion[];
  onAddFastMoneyQuestion: (question: FastMoneyQuestion) => void;
  onDeleteFastMoneyQuestion: (id: string) => void;
}


export const UtilitiesModal: React.FC<UtilitiesModalProps> = ({
  open,
  onOpenChange,
  logo,
  onLogoChange,
  questions,
  onAddQuestion,
  onBulkAddQuestions,
  fastMoneyQuestions,
  onAddFastMoneyQuestion,
  onDeleteFastMoneyQuestion,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-4 border-purple-600">

        <DialogHeader>
          <DialogTitle className="text-3xl font-black text-purple-600 uppercase">⚙️ Utilities</DialogTitle>

        </DialogHeader>
        <Tabs defaultValue="sound" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="sound" className="data-[state=active]:bg-purple-600">🔊 Sound</TabsTrigger>
            <TabsTrigger value="logo" className="data-[state=active]:bg-purple-600">🎨 Logo</TabsTrigger>
            <TabsTrigger value="questions" className="data-[state=active]:bg-purple-600">❓ Questions</TabsTrigger>
            <TabsTrigger value="fastmoney" className="data-[state=active]:bg-purple-600">⚡ Fast Money</TabsTrigger>
          </TabsList>
          <TabsContent value="sound" className="mt-6">
            <SoundCustomizer />
          </TabsContent>
          <TabsContent value="logo" className="mt-6">
            <LogoCustomizer currentLogo={logo} onLogoChange={onLogoChange} />
          </TabsContent>
          <TabsContent value="questions" className="mt-6">
            <QuestionManager 
              questions={questions} 
              onSelectQuestion={() => {}} 
              onAddQuestion={onAddQuestion} 
              onBulkAddQuestions={onBulkAddQuestions} 
            />
          </TabsContent>
          <TabsContent value="fastmoney" className="mt-6">
            <FastMoneyManager 
              questions={fastMoneyQuestions} 
              onAddQuestion={onAddFastMoneyQuestion} 
              onDeleteQuestion={onDeleteFastMoneyQuestion} 
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};


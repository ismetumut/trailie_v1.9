"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: Array<{
    text: string;
    type: 'D' | 'I' | 'S' | 'C';
  }>;
}

interface PersonalityQuestionProps {
  questions: Question[];
  onComplete: (answers: Record<number, number>, discProfile: DISCProfile) => void;
}

interface DISCProfile {
  dominant: 'D' | 'I' | 'S' | 'C';
  scores: {
    D: number;
    I: number;
    S: number;
    C: number;
  };
  description: string;
}

const DISC_DESCRIPTIONS = {
  D: {
    title: 'Yönlendirici (Dominant)',
    description: 'Güçlü liderlik özellikleri, hedef odaklı, kararlı ve sonuç alıcı. Hızlı karar verir ve kontrolü elinde tutmayı sever.',
    color: '#ef4444',
    traits: ['Liderlik', 'Kararlılık', 'Hedef Odaklı', 'Kontrol']
  },
  I: {
    title: 'Etkileyici (Influential)',
    description: 'Sosyal, enerjik ve iletişim becerileri yüksek. İnsan ilişkilerinde başarılı ve motivasyonu yüksek.',
    color: '#f59e0b',
    traits: ['Sosyallik', 'Enerji', 'İletişim', 'Motivasyon']
  },
  S: {
    title: 'Destekleyici (Steady)',
    description: 'Sakin, anlayışlı ve sadık. Ekip çalışmasında güvenilir, dengeyi sağlayan ve destek veren.',
    color: '#10b981',
    traits: ['Sadakat', 'Anlayış', 'Denge', 'Destek']
  },
  C: {
    title: 'Analitik (Conscientious)',
    description: 'Detaycı, düzenli ve analitik düşünen. Kurallara uygun, sistematik ve kalite odaklı.',
    color: '#3b82f6',
    traits: ['Analitik', 'Düzen', 'Kalite', 'Sistem']
  }
};

export function PersonalityQuestion({ 
  questions, 
  onComplete
}: PersonalityQuestionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const calculateDISCProfile = (answers: Record<number, number>): DISCProfile => {
    const scores = { D: 0, I: 0, S: 0, C: 0 };
    
    Object.entries(answers).forEach(([questionId, optionIndex]) => {
      const question = questions.find(q => q.id === parseInt(questionId));
      if (question && question.options[optionIndex]) {
        const type = question.options[optionIndex].type;
        scores[type]++;
      }
    });

    const dominant = Object.entries(scores).reduce((a, b) => scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b)[0] as 'D' | 'I' | 'S' | 'C';

    return {
      dominant,
      scores,
      description: DISC_DESCRIPTIONS[dominant].description
    };
  };

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      const newAnswers = { ...answers, [questions[currentQuestion].id]: selectedOption };
      setAnswers(newAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        const discProfile = calculateDISCProfile(newAnswers);
        onComplete(newAnswers, discProfile);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[questions[currentQuestion - 1].id] || null);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf6f2] to-[#d1f2e6]">
      {/* Progress Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          <div className="w-10" /> {/* Left spacer */}
          
          <div className="flex-1 mx-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Soru {currentQuestion + 1} / {questions.length}</span>
              <span>%{Math.round(progress)}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="w-10" /> {/* Right spacer for balance */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="p-6 md:p-8 bg-white/90 backdrop-blur-sm shadow-lg border-0">
          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 leading-relaxed">
              {currentQ.text}
            </h2>
            
            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                    selectedOption === index
                      ? 'border-[#10b981] bg-[#10b981]/5 text-[#10b981]'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedOption === index
                        ? 'border-[#10b981] bg-[#10b981]'
                        : 'border-gray-300'
                    }`}>
                      {selectedOption === index && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-gray-700 font-medium">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Önceki
            </Button>
            
            <div className="text-sm text-gray-500">
              {currentQuestion + 1} / {questions.length}
            </div>
            
            <Button
              onClick={handleNext}
              disabled={selectedOption === null}
              className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669]"
            >
              {currentQuestion === questions.length - 1 ? 'Sonuçları Gör' : 'Sonraki'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

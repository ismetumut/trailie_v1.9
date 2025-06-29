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
    type: 'Marketing' | 'Sales' | 'Brand' | 'Product';
  }>;
}

interface ExpertiseQuestionProps {
  questions: Question[];
  onComplete: (answers: Record<number, number>, expertiseProfile: ExpertiseProfile) => void;
}

interface ExpertiseProfile {
  dominant: 'Marketing' | 'Sales' | 'Brand' | 'Product';
  scores: {
    Marketing: number;
    Sales: number;
    Brand: number;
    Product: number;
  };
  description: string;
}

export function ExpertiseQuestion({ 
  questions, 
  onComplete
}: ExpertiseQuestionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const calculateExpertiseProfile = (answers: Record<number, number>): ExpertiseProfile => {
    const scores = { Marketing: 0, Sales: 0, Brand: 0, Product: 0 };
    
    Object.entries(answers).forEach(([questionId, optionIndex]) => {
      const question = questions.find(q => q.id === parseInt(questionId));
      if (question && question.options[optionIndex]) {
        const type = question.options[optionIndex].type;
        scores[type]++;
      }
    });

    const dominant = Object.entries(scores).reduce((a, b) => scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b)[0] as 'Marketing' | 'Sales' | 'Brand' | 'Product';

    const descriptions = {
      Marketing: 'Dijital pazarlama stratejileri geliştiren, veri analizi yapan ve kampanya yönetimi konusunda uzmanlaşmış profesyonel.',
      Sales: 'Müşteri ilişkileri yöneten, satış süreçlerini optimize eden ve hedef odaklı çalışan profesyonel.',
      Brand: 'Marka kimliği oluşturan, görsel tasarım ve yaratıcı stratejiler geliştiren profesyonel.',
      Product: 'Ürün geliştirme süreçlerini yöneten, kullanıcı deneyimi ve teknik detayları optimize eden profesyonel.'
    };

    return {
      dominant,
      scores,
      description: descriptions[dominant]
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
        const expertiseProfile = calculateExpertiseProfile(newAnswers);
        onComplete(newAnswers, expertiseProfile);
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
                      ? 'border-[#8b5cf6] bg-[#8b5cf6]/5 text-[#8b5cf6]'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedOption === index
                        ? 'border-[#8b5cf6] bg-[#8b5cf6]'
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
              className="flex items-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed]"
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
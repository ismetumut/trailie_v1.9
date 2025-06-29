"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { PersonalityQuestion } from '@/components/assessment/personality-question';
import { ExpertiseQuestion } from '@/components/assessment/expertise-question';
import { AdminPanel } from '@/components/company/AdminPanel';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  Home, 
  User, 
  Briefcase, 
  Target, 
  Users, 
  Settings, 
  LogOut, 
  BarChart3, 
  Bell, 
  UserCircle,
  Mail,
  Shield,
  HelpCircle,
  TrendingUp,
  Users2,
  Palette,
  Code
} from 'lucide-react';

type UserType = 'individual' | 'company';
type AppState = 'login' | 'assessment' | 'expertise' | 'admin' | 'dashboard' | 'results' | 'expertise-results';

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

// DISC Uyumlu Kişilik Envanteri Soruları
const discQuestions = [
  {
    id: 1,
    text: "İş ortamında seni en iyi tanımlayan yaklaşım:",
    options: [
      { text: "Hedefe odaklanır, işleri hızla tamamlarım.", type: "D" as const },
      { text: "İnsan ilişkileriyle süreci kolaylaştırırım.", type: "I" as const },
      { text: "Ekipte dengeyi sağlar, destek sunarım.", type: "S" as const },
      { text: "Kuralları takip eder, detaylara dikkat ederim.", type: "C" as const }
    ]
  },
  {
    id: 2,
    text: "Yeni bir projeye başlarken ilk adımın nedir?",
    options: [
      { text: "Öncelikleri belirler, ilerlemeye başlarım.", type: "D" as const },
      { text: "Ekibin motivasyonunu artırırım.", type: "I" as const },
      { text: "Herkesin sürece alışmasına yardımcı olurum.", type: "S" as const },
      { text: "Planlama ve analizle başlarım.", type: "C" as const }
    ]
  },
  {
    id: 3,
    text: "Stres altında nasıl davranırsın?",
    options: [
      { text: "Kontrolü ele alırım.", type: "D" as const },
      { text: "Rahat bir atmosfer yaratmaya çalışırım.", type: "I" as const },
      { text: "Sakin kalır, anlayışlı olurum.", type: "S" as const },
      { text: "Kuralları izleyerek çözüm üretirim.", type: "C" as const }
    ]
  },
  {
    id: 4,
    text: "Ekip içinde seni en iyi tanımlayan rol:",
    options: [
      { text: "Yönlendiren", type: "D" as const },
      { text: "İletişim kuran", type: "I" as const },
      { text: "Destek veren", type: "S" as const },
      { text: "Organize eden", type: "C" as const }
    ]
  },
  {
    id: 5,
    text: "En çok hangi başarı seni mutlu eder?",
    options: [
      { text: "Zor bir hedefi başarmak", type: "D" as const },
      { text: "İnsanlar tarafından fark edilmek", type: "I" as const },
      { text: "Ekibin güvenini kazanmak", type: "S" as const },
      { text: "Hatasız ve düzgün bir iş yapmak", type: "C" as const }
    ]
  },
  {
    id: 6,
    text: "Hangi ortamda daha verimli çalışırsın?",
    options: [
      { text: "Baskı altında", type: "D" as const },
      { text: "Sosyal ortamlarda", type: "I" as const },
      { text: "Huzurlu, stabil alanlarda", type: "S" as const },
      { text: "Sistemli ve düzenli alanlarda", type: "C" as const }
    ]
  },
  {
    id: 7,
    text: "İnsanlar seni nasıl tanımlar?",
    options: [
      { text: "Kararlı", type: "D" as const },
      { text: "Enerjik", type: "I" as const },
      { text: "Anlayışlı", type: "S" as const },
      { text: "Dikkatli", type: "C" as const }
    ]
  },
  {
    id: 8,
    text: "Yeni insanlarla tanıştığında nasıl hissedersin?",
    options: [
      { text: "Güçlü izlenim bırakmak isterim", type: "D" as const },
      { text: "Kolayca iletişim kurarım", type: "I" as const },
      { text: "Önce dinlemeyi tercih ederim", type: "S" as const },
      { text: "Mesafeli durup gözlemlerim", type: "C" as const }
    ]
  },
  {
    id: 9,
    text: "En güçlü yönün nedir?",
    options: [
      { text: "Liderlik", type: "D" as const },
      { text: "Sosyal uyum", type: "I" as const },
      { text: "Sadakat", type: "S" as const },
      { text: "Disiplin", type: "C" as const }
    ]
  },
  {
    id: 10,
    text: "Hangi ilkeye daha çok önem verirsin?",
    options: [
      { text: "Sonuç almak", type: "D" as const },
      { text: "Özgürlük", type: "I" as const },
      { text: "Sadakat", type: "S" as const },
      { text: "Doğruluk", type: "C" as const }
    ]
  }
];

// Uzmanlık Analizi Soruları
const expertiseQuestions = [
  {
    id: 1,
    text: "En çok hangi tür iş seni motive eder?",
    options: [
      { text: "Yeni fikirler üretip pazara sunmak", type: "Marketing" as const },
      { text: "Müşteriyle birebir iletişim kurup ikna etmek", type: "Sales" as const },
      { text: "Bir markanın kimliğini oluşturmak ve büyütmek", type: "Brand" as const },
      { text: "Ürün sürecinin her adımında yer almak", type: "Product" as const }
    ]
  },
  {
    id: 2,
    text: "Bir projede aşağıdakilerden hangisi seni daha çok çeker?",
    options: [
      { text: "Rakip analizleri ve içerik planı oluşturmak", type: "Marketing" as const },
      { text: "Müşteri ihtiyaçlarını belirleyip çözüm sunmak", type: "Sales" as const },
      { text: "Marka algısını yaratmak ve sürdürülebilir kılmak", type: "Brand" as const },
      { text: "Kullanıcı geri bildirimleriyle ürünü geliştirmek", type: "Product" as const }
    ]
  },
  {
    id: 3,
    text: "Aşağıdaki araçlardan hangilerini daha çok kullanmak isterdin?",
    options: [
      { text: "Google Analytics, Meta Ads, Mailchimp", type: "Marketing" as const },
      { text: "CRM, Zoom, PowerPoint", type: "Sales" as const },
      { text: "Canva, Figma, Instagram Insights", type: "Brand" as const },
      { text: "Jira, Notion, Miro", type: "Product" as const }
    ]
  },
  // ... devamı ve component kodları ...
// ... existing code ...

export default function Home() {
  return <h1>Test: Ana Sayfa Açıldı!</h1>;
} 
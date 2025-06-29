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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Menu, Home, User, Briefcase, Target, Users, Settings, LogOut, BarChart3, Bell, UserCircle, Mail, Shield, HelpCircle, TrendingUp, Users2, Palette, Code } from 'lucide-react';

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

const DISC_DESCRIPTIONS = {
  D: {
    title: 'Dominant (D)',
    description: 'Hedef odaklı, hızlı karar veren, liderlik özellikleri baskın kişilerdir. Zorluklardan çekinmez, rekabeti severler.',
    color: '#ef4444',
    traits: ['Liderlik', 'Kararlılık', 'Sonuç Odaklılık', 'Cesaret'],
    careers: ['Yönetici', 'Girişimci', 'Proje Lideri', 'Satış Müdürü'],
    tools: ['Jira', 'Trello', 'Slack', 'CRM']
  },
  I: {
    title: 'Influencer (I)',
    description: 'İletişim becerileri yüksek, sosyal, enerjik ve insan ilişkilerinde başarılı kişilerdir. Takım çalışmasını ve motivasyonu artırırlar.',
    color: '#f59e42',
    traits: ['İletişim', 'Motivasyon', 'Yaratıcılık', 'İkna Kabiliyeti'],
    careers: ['Pazarlama Uzmanı', 'Eğitmen', 'Halkla İlişkiler', 'Etkinlik Yöneticisi'],
    tools: ['Canva', 'Instagram', 'Mailchimp', 'Zoom']
  },
  S: {
    title: 'Steady (S)',
    description: 'Sakin, sabırlı, güvenilir ve destekleyici kişilerdir. Takımda denge unsuru olurlar, istikrarlıdırlar.',
    color: '#10b981',
    traits: ['Sabır', 'Destek', 'Sadakat', 'İstikrar'],
    careers: ['İK Uzmanı', 'Danışman', 'Koç', 'Müşteri Temsilcisi'],
    tools: ['Notion', 'Teams', 'Google Drive', 'Zendesk']
  },
  C: {
    title: 'Compliant (C)',
    description: 'Detaycı, analitik, kuralcı ve mükemmeliyetçi kişilerdir. Planlama ve analizde başarılıdırlar.',
    color: '#3b82f6',
    traits: ['Analitik Düşünce', 'Dikkat', 'Planlama', 'Mükemmeliyetçilik'],
    careers: ['Finans Uzmanı', 'Analist', 'Mühendis', 'Denetçi'],
    tools: ['Excel', 'Tableau', 'Asana', 'Google Analytics']
  }
};

const EXPERTISE_DESCRIPTIONS = {
  Marketing: {
    title: 'Marketing Specialist',
    description: 'Dijital pazarlama stratejileri geliştiren, veri odaklı kampanyalar yöneten ve marka bilinirliğini artıran uzman. Rakip analizleri, içerik planlaması ve ROI optimizasyonu konularında uzmanlaşmış.',
    color: '#ef4444',
    traits: ['Veri Analizi', 'Stratejik Düşünme', 'Yaratıcılık', 'Sonuç Odaklılık'],
    careers: ['Digital Marketing Manager', 'Content Marketing Specialist', 'SEO Specialist', 'Growth Hacker'],
    tools: ['Google Analytics', 'Meta Ads', 'Mailchimp', 'HubSpot'],
    responsibilities: ['Kampanya stratejisi oluşturma', 'Hedef kitle analizi', 'İçerik planlaması', 'ROI optimizasyonu']
  },
  Sales: {
    title: 'Sales Specialist',
    description: 'Müşteri ihtiyaçlarını analiz eden, ikna edici sunumlar yapan ve satış hedeflerine ulaşan profesyonel. İlişki yönetimi, müzakere ve müşteri memnuniyeti konularında uzman.',
    color: '#f59e42',
    traits: ['İkna Kabiliyeti', 'İletişim', 'Müzakere', 'Müşteri Odaklılık'],
    careers: ['Sales Manager', 'Account Executive', 'Business Development', 'Customer Success Manager'],
    tools: ['CRM', 'Zoom', 'PowerPoint', 'LinkedIn Sales Navigator'],
    responsibilities: ['Müşteri ihtiyaç analizi', 'Satış sunumları', 'İlişki yönetimi', 'Hedef takibi']
  },
  Brand: {
    title: 'Brand Manager',
    description: 'Marka kimliğini oluşturan, marka değerini artıran ve tutarlı iletişim stratejileri geliştiren uzman. Yaratıcılık, görsel tasarım ve marka algısı yönetimi konularında uzmanlaşmış.',
    color: '#10b981',
    traits: ['Yaratıcılık', 'Görsel Algı', 'Stratejik Düşünme', 'Tutarlılık'],
    careers: ['Brand Manager', 'Creative Director', 'Visual Designer', 'Social Media Manager'],
    tools: ['Canva', 'Figma', 'Instagram Insights', 'Adobe Creative Suite'],
    responsibilities: ['Marka kimliği oluşturma', 'Görsel tasarım yönetimi', 'Sosyal medya stratejisi', 'Marka tutarlılığı']
  },
  Product: {
    title: 'Product Manager',
    description: 'Ürün yaşam döngüsünü yöneten, kullanıcı ihtiyaçlarını analiz eden ve ürün stratejisi geliştiren profesyonel. Veri analizi, süreç yönetimi ve kullanıcı deneyimi konularında uzman.',
    color: '#3b82f6',
    traits: ['Analitik Düşünce', 'Süreç Yönetimi', 'Problem Çözme', 'Kullanıcı Odaklılık'],
    careers: ['Product Manager', 'Product Owner', 'UX Designer', 'Business Analyst'],
    tools: ['Jira', 'Notion', 'Miro', 'Figma'],
    responsibilities: ['Ürün yol haritası', 'Kullanıcı araştırması', 'Süreç optimizasyonu', 'Stakeholder yönetimi']
  }
};

// DISC Questions (EN)
const discQuestionsEN = [
  {
    id: 1,
    text: "Your approach in the workplace:",
    options: [
      { text: "I focus on goals and get things done quickly.", type: "D" as const },
      { text: "I facilitate the process with relationships.", type: "I" as const },
      { text: "I provide balance and support in the team.", type: "S" as const },
      { text: "I follow rules and pay attention to details.", type: "C" as const }
    ]
  },
  {
    id: 2,
    text: "What is your first step when starting a new project?",
    options: [
      { text: "Set priorities and get started.", type: "D" as const },
      { text: "Boost the team's motivation.", type: "I" as const },
      { text: "Help everyone adapt to the process.", type: "S" as const },
      { text: "Start with planning and analysis.", type: "C" as const }
    ]
  },
  {
    id: 3,
    text: "How do you behave under stress?",
    options: [
      { text: "Take control.", type: "D" as const },
      { text: "Try to create a relaxed atmosphere.", type: "I" as const },
      { text: "Stay calm and understanding.", type: "S" as const },
      { text: "Find solutions by following rules.", type: "C" as const }
    ]
  },
  {
    id: 4,
    text: "Your role in a team:",
    options: [
      { text: "Leader", type: "D" as const },
      { text: "Communicator", type: "I" as const },
      { text: "Supporter", type: "S" as const },
      { text: "Organizer", type: "C" as const }
    ]
  },
  {
    id: 5,
    text: "Which achievement makes you happiest?",
    options: [
      { text: "Achieving a tough goal", type: "D" as const },
      { text: "Being recognized by people", type: "I" as const },
      { text: "Gaining the team's trust", type: "S" as const },
      { text: "Doing flawless and proper work", type: "C" as const }
    ]
  },
  {
    id: 6,
    text: "In which environment do you work most efficiently?",
    options: [
      { text: "Under pressure", type: "D" as const },
      { text: "In social environments", type: "I" as const },
      { text: "In peaceful, stable places", type: "S" as const },
      { text: "In systematic and organized places", type: "C" as const }
    ]
  },
  {
    id: 7,
    text: "How do people describe you?",
    options: [
      { text: "Decisive", type: "D" as const },
      { text: "Energetic", type: "I" as const },
      { text: "Understanding", type: "S" as const },
      { text: "Careful", type: "C" as const }
    ]
  },
  {
    id: 8,
    text: "How do you feel when meeting new people?",
    options: [
      { text: "Want to make a strong impression", type: "D" as const },
      { text: "Easily communicate", type: "I" as const },
      { text: "Prefer to listen first", type: "S" as const },
      { text: "Observe from a distance", type: "C" as const }
    ]
  },
  {
    id: 9,
    text: "What is your strongest trait?",
    options: [
      { text: "Leadership", type: "D" as const },
      { text: "Social harmony", type: "I" as const },
      { text: "Loyalty", type: "S" as const },
      { text: "Discipline", type: "C" as const }
    ]
  },
  {
    id: 10,
    text: "Which principle do you value most?",
    options: [
      { text: "Getting results", type: "D" as const },
      { text: "Freedom", type: "I" as const },
      { text: "Loyalty", type: "S" as const },
      { text: "Truth", type: "C" as const }
    ]
  }
];

// DISC Questions (TR)
const discQuestionsTR = [
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
      { text: "Under pressure", type: "D" as const },
      { text: "In social environments", type: "I" as const },
      { text: "In peaceful, stable places", type: "S" as const },
      { text: "In systematic and organized places", type: "C" as const }
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

// Expertise Questions (EN)
const expertiseQuestionsEN = [
  {
    id: 1,
    text: "Which type of work motivates you the most?",
    options: [
      { text: "Generating new ideas and bringing them to market", type: "Marketing" as const },
      { text: "Direct communication with customers and persuasion", type: "Sales" as const },
      { text: "Creating and growing a brand identity", type: "Brand" as const },
      { text: "Being involved in every step of the product process", type: "Product" as const }
    ]
  },
  {
    id: 2,
    text: "Which of the following attracts you most in a project?",
    options: [
      { text: "Competitor analysis and content planning", type: "Marketing" as const },
      { text: "Identifying customer needs and offering solutions", type: "Sales" as const },
      { text: "Creating and sustaining brand perception", type: "Brand" as const },
      { text: "Developing products with user feedback", type: "Product" as const }
    ]
  },
  {
    id: 3,
    text: "Which of these tools would you prefer to use more?",
    options: [
      { text: "Google Analytics, Meta Ads, Mailchimp", type: "Marketing" as const },
      { text: "CRM, Zoom, PowerPoint", type: "Sales" as const },
      { text: "Canva, Figma, Instagram Insights", type: "Brand" as const },
      { text: "Jira, Notion, Miro", type: "Product" as const }
    ]
  },
  {
    id: 4,
    text: "What is the most critical stage for you in a campaign or product launch?",
    options: [
      { text: "Finding the right message for the target audience", type: "Marketing" as const },
      { text: "Making the presentation that converts to sales", type: "Sales" as const },
      { text: "Maintaining brand integrity while communicating", type: "Brand" as const },
      { text: "Perfect technical details and timing", type: "Product" as const }
    ]
  },
  {
    id: 5,
    text: "Who would you most like to work with within the company?",
    options: [
      { text: "Content creators, advertising agencies", type: "Marketing" as const },
      { text: "Sales teams, customer representatives", type: "Sales" as const },
      { text: "Creative team, social media managers", type: "Brand" as const },
      { text: "Developers, designers, data analysts", type: "Product" as const }
    ]
  },
  {
    id: 6,
    text: "Which of the following would make your day more meaningful?",
    options: [
      { text: "Creating digital campaign strategies", type: "Marketing" as const },
      { text: "Presenting solutions to potential customers", type: "Sales" as const },
      { text: "Shaping the brand story", type: "Brand" as const },
      { text: "Mapping product roadmap and prioritization", type: "Product" as const }
    ]
  }
];

const EXPERTISE_DESCRIPTIONS_EN = {
  Marketing: {
    title: 'Marketing Specialist',
    description: 'Expert who develops digital marketing strategies, manages data-driven campaigns, and increases brand awareness. Specialized in competitor analysis, content planning, and ROI optimization.',
    color: '#ef4444',
    traits: ['Data Analysis', 'Strategic Thinking', 'Creativity', 'Results-Oriented'],
    careers: ['Digital Marketing Manager', 'Content Marketing Specialist', 'SEO Specialist', 'Growth Hacker'],
    tools: ['Google Analytics', 'Meta Ads', 'Mailchimp', 'HubSpot'],
    responsibilities: ['Campaign strategy creation', 'Target audience analysis', 'Content planning', 'ROI optimization']
  },
  Sales: {
    title: 'Sales Specialist',
    description: 'Professional who analyzes customer needs, makes persuasive presentations, and achieves sales targets. Expert in relationship management, negotiation, and customer satisfaction.',
    color: '#f59e42',
    traits: ['Persuasion', 'Communication', 'Negotiation', 'Customer-Focused'],
    careers: ['Sales Manager', 'Account Executive', 'Business Development', 'Customer Success Manager'],
    tools: ['CRM', 'Zoom', 'PowerPoint', 'LinkedIn Sales Navigator'],
    responsibilities: ['Customer need analysis', 'Sales presentations', 'Relationship management', 'Target tracking']
  },
  Brand: {
    title: 'Brand Manager',
    description: 'Expert who creates brand identity, increases brand value, and develops consistent communication strategies. Specialized in creativity, visual design, and brand perception management.',
    color: '#10b981',
    traits: ['Creativity', 'Visual Perception', 'Strategic Thinking', 'Consistency'],
    careers: ['Brand Manager', 'Creative Director', 'Visual Designer', 'Social Media Manager'],
    tools: ['Canva', 'Figma', 'Instagram Insights', 'Adobe Creative Suite'],
    responsibilities: ['Brand identity creation', 'Visual design management', 'Social media strategy', 'Brand consistency']
  },
  Product: {
    title: 'Product Manager',
    description: 'Professional who manages product lifecycle, analyzes user needs, and develops product strategy. Expert in data analysis, process management, and user experience.',
    color: '#3b82f6',
    traits: ['Analytical Thinking', 'Process Management', 'Problem Solving', 'User-Focused'],
    careers: ['Product Manager', 'Product Owner', 'UX Designer', 'Business Analyst'],
    tools: ['Jira', 'Notion', 'Miro', 'Figma'],
    responsibilities: ['Product roadmap', 'User research', 'Process optimization', 'Stakeholder management']
  }
};

// Expertise Questions (TR)
const expertiseQuestionsTR = [
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
  {
    id: 4,
    text: "Bir kampanya ya da ürün lansmanında senin için en kritik aşama nedir?",
    options: [
      { text: "Hedef kitleye uygun mesajı bulmak", type: "Marketing" as const },
      { text: "Satışa dönüştürecek sunumu yapmak", type: "Sales" as const },
      { text: "Markanın bütünlüğünü koruyarak iletişim kurmak", type: "Brand" as const },
      { text: "Teknik detayların ve zamanlamanın kusursuz olması", type: "Product" as const }
    ]
  },
  {
    id: 5,
    text: "Şirket içinde en çok kimlerle çalışmak istersin?",
    options: [
      { text: "İçerik üreticileri, reklam ajansları", type: "Marketing" as const },
      { text: "Satış ekipleri, müşteri temsilcileri", type: "Sales" as const },
      { text: "Kreatif ekip, sosyal medya yöneticileri", type: "Brand" as const },
      { text: "Yazılımcılar, tasarımcılar, veri analistleri", type: "Product" as const }
    ]
  },
  {
    id: 6,
    text: "Bir gününü aşağıdakilerden hangisiyle geçirmek sana daha anlamlı gelir?",
    options: [
      { text: "Dijital kampanya stratejisi oluşturmak", type: "Marketing" as const },
      { text: "Potansiyel müşterilere çözüm sunmak", type: "Sales" as const },
      { text: "Marka hikayesini şekillendirmek", type: "Brand" as const },
      { text: "Ürün yol haritası çıkarmak ve önceliklendirmek", type: "Product" as const }
    ]
  }
];

// --- Uygulamanın tamamı aşağıda ---

export default function CareerDiscoveryApp() {
  const { isAuthenticated, userType, setAuthUserType } = useAuth();
  const [appState, setAppState] = useState<AppState>('login');
  const [menuOpen, setMenuOpen] = useState(false);
  const [discResults, setDiscResults] = useState<DISCProfile | null>(null);
  const [expertiseResults, setExpertiseResults] = useState<ExpertiseProfile | null>(null);
  const [notificationCount, setNotificationCount] = useState(3); // Demo için
  const [lang, setLang] = useState<'en' | 'tr'>('tr');

  const handleLoginSuccess = (type?: UserType) => {
    if (type === 'company') {
      setAuthUserType('company');
      setAppState('admin');
    } else {
      setAuthUserType('individual');
      setAppState('assessment');
    }
  };

  const handleAssessmentComplete = (answers: Record<number, number>, discProfile: DISCProfile) => {
    setDiscResults(discProfile);
    setAppState('results');
  };

  const handleExpertiseComplete = (answers: Record<number, number>, expertiseProfile: ExpertiseProfile) => {
    setExpertiseResults(expertiseProfile);
    setAppState('expertise-results');
  };

  const handleNotifications = () => {
    setNotificationCount(0);
  };

  const handleLogout = () => {
    setAuthUserType(null);
    setAppState('login');
  };

  // Giriş ekranı kontrolü
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} lang={lang} setLang={setLang} />;
  }

  // Menü tanımları
  const menuItems = [
    { icon: Home, label: 'Ana Sayfa', action: () => setAppState('dashboard') },
    { icon: User, label: 'Kişilik Envanteri', action: () => setAppState('assessment') },
    { icon: Target, label: 'Uzmanlık Analizi', action: () => setAppState('expertise') },
    { icon: Briefcase, label: 'İş Arama', action: () => {} },
    { icon: Users, label: 'Networking', action: () => {} },
    { icon: Settings, label: 'Ayarlar', action: () => {} },
  ];
  const companyMenuItems = [
    { icon: Home, label: 'Ana Sayfa', action: () => setAppState('admin') },
    { icon: Users, label: 'CV Veritabanı', action: () => {} },
    { icon: Briefcase, label: 'İlan Yönetimi', action: () => {} },
    { icon: Target, label: 'Aday Analizi', action: () => {} },
    { icon: Settings, label: 'Firma Ayarları', action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf6f2] to-[#d1f2e6]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          {/* Left - Hamburger Menu */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="p-2 rounded-lg hover:bg-gray-100">
                <Menu className="w-6 h-6 text-gray-600" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-white/95 backdrop-blur-sm">
              <SheetHeader>
                <SheetTitle className="text-left text-xl font-bold text-gray-800">
                  {userType === 'company' ? 'Firma Paneli' : 'Trailie'}
                </SheetTitle>
              </SheetHeader>
              {(userType === 'company' ? companyMenuItems : menuItems).map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-12 text-left font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    item.action();
                    setMenuOpen(false);
                  }}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 text-left font-medium text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Çıkış Yap
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Center - Title */}
          <div className="flex-1 text-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {userType === 'company' ? 'Firma Yönetim Paneli' : 'Kariyer Keşfi'}
            </h1>
          </div>

          {/* Right - Notifications & Profile */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative" onClick={handleNotifications}>
              <Bell className="w-6 h-6 text-gray-600" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {notificationCount}
                </Badge>
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserCircle className="w-7 h-7 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userType === 'company' ? 'Firma Hesabı' : 'Demo Kullanıcı'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userType === 'company' ? 'admin@firma.com' : 'demo@trailie.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {}}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Mesajlar</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Ayarlar</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Yardım</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Çıkış Yap</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {appState === 'assessment' && (
        <PersonalityQuestion
          questions={lang === 'en' ? discQuestionsEN : discQuestionsTR}
          onComplete={handleAssessmentComplete}
        />
      )}
      {appState === 'expertise' && (
        <ExpertiseQuestion
          questions={lang === 'en' ? expertiseQuestionsEN : expertiseQuestionsTR}
          onComplete={handleExpertiseComplete}
        />
      )}
      {appState === 'admin' && <AdminPanel />}

      {/* Sonuçlar ekranı */}
      {appState === 'results' && discResults && (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {lang === 'en' ? '🎯 Your DISC Personality Profile' : '🎯 DISC Kişilik Profiliniz'}
            </h1>
            <p className="text-gray-600 text-lg">
              {lang === 'en' ? 'Your personality assessment results are below' : 'Kişilik envanterinizin sonuçları aşağıdadır'}
            </p>
          </div>

          {/* Ana Profil Kartı */}
          <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <div className="text-center mb-8">
              {/* Dominant Type Badge */}
              <div className="inline-flex items-center px-8 py-4 rounded-full text-white font-bold text-2xl mb-6 shadow-lg" 
                   style={{ backgroundColor: DISC_DESCRIPTIONS[discResults.dominant].color }}>
                <span className="mr-3 text-3xl">
                  {discResults.dominant === 'D' ? '⚡' : 
                   discResults.dominant === 'I' ? '🌟' : 
                   discResults.dominant === 'S' ? '🤝' : '📊'}
                </span>
                {DISC_DESCRIPTIONS[discResults.dominant].title}
              </div>
              
              {/* Description */}
              <p className="text-gray-700 text-xl leading-relaxed max-w-3xl mx-auto mb-8">
                {DISC_DESCRIPTIONS[discResults.dominant].description}
              </p>
            </div>

            {/* Scores Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {(['D', 'I', 'S', 'C'] as const).map((type) => (
                <div key={type} className={`p-4 rounded-lg text-center ${
                  type === discResults.dominant 
                    ? 'ring-2 ring-offset-2' 
                    : 'bg-gray-50'
                }`} style={{
                  backgroundColor: type === discResults.dominant 
                    ? `${DISC_DESCRIPTIONS[type].color}20` 
                    : undefined,
                  borderColor: type === discResults.dominant 
                    ? DISC_DESCRIPTIONS[type].color 
                    : undefined
                }}>
                  <div className="text-2xl font-bold mb-2" style={{ color: DISC_DESCRIPTIONS[type].color }}>
                    {discResults.scores[type]}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {DISC_DESCRIPTIONS[type].title.split(' ')[0]}
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Sections */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Traits Section */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">💪</span>
                  {lang === 'en' ? 'Key Strengths' : 'Güçlü Özellikler'}
                </h3>
                <div className="space-y-2">
                  {DISC_DESCRIPTIONS[discResults.dominant].traits.map((trait, index) => (
                    <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: DISC_DESCRIPTIONS[discResults.dominant].color }}></div>
                      <span className="font-medium text-gray-700">{trait}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Careers Section */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">💼</span>
                  {lang === 'en' ? 'Suitable Careers' : 'Uygun Kariyerler'}
                </h3>
                <div className="space-y-2">
                  {DISC_DESCRIPTIONS[discResults.dominant].careers.map((career, index) => (
                    <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: DISC_DESCRIPTIONS[discResults.dominant].color }}></div>
                      <span className="font-medium text-gray-700">{career}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools Section */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🛠️</span>
                  {lang === 'en' ? 'Recommended Tools' : 'Önerilen Araçlar'}
                </h3>
                <div className="space-y-2">
                  {DISC_DESCRIPTIONS[discResults.dominant].tools.map((tool, index) => (
                    <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: DISC_DESCRIPTIONS[discResults.dominant].color }}></div>
                      <span className="font-medium text-gray-700">{tool}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Personality Insights */}
            <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🔍</span>
                {lang === 'en' ? 'Personality Analysis' : 'Kişilik Analizi'}
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    {lang === 'en' ? 'Strengths:' : 'Güçlü Yönler:'}
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• {discResults.dominant === 'D' ? 
                           (lang === 'en' ? 'Leadership and determination' : 'Liderlik ve kararlılık') : 
                           discResults.dominant === 'I' ? 
                           (lang === 'en' ? 'Communication and motivation' : 'İletişim ve motivasyon') :
                           discResults.dominant === 'S' ? 
                           (lang === 'en' ? 'Reliability and support' : 'Güvenilirlik ve destek') : 
                           (lang === 'en' ? 'Analytical thinking and planning' : 'Analitik düşünce ve planlama')}</li>
                    <li>• {discResults.dominant === 'D' ? 
                           (lang === 'en' ? 'Quick decision making' : 'Hızlı karar verme') :
                           discResults.dominant === 'I' ? 
                           (lang === 'en' ? 'Creative problem solving' : 'Yaratıcı problem çözme') :
                           discResults.dominant === 'S' ? 
                           (lang === 'en' ? 'Team harmony' : 'Takım uyumu sağlama') : 
                           (lang === 'en' ? 'Attention to detail' : 'Detaylara odaklanma')}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    {lang === 'en' ? 'Areas for Development:' : 'Gelişim Alanları:'}
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• {discResults.dominant === 'D' ? 
                           (lang === 'en' ? 'Patience and empathy' : 'Sabır ve empati') :
                           discResults.dominant === 'I' ? 
                           (lang === 'en' ? 'Attention to detail' : 'Detaylara dikkat') :
                           discResults.dominant === 'S' ? 
                           (lang === 'en' ? 'Quick change adaptation' : 'Hızlı değişim adaptasyonu') : 
                           (lang === 'en' ? 'Flexibility and spontaneity' : 'Esneklik ve spontanlık')}</li>
                    <li>• {discResults.dominant === 'D' ? 
                           (lang === 'en' ? 'Team collaboration' : 'Takım çalışması') :
                           discResults.dominant === 'I' ? 
                           (lang === 'en' ? 'Planning and organization' : 'Planlama ve organizasyon') :
                           discResults.dominant === 'S' ? 
                           (lang === 'en' ? 'Leadership positions' : 'Liderlik pozisyonları') : 
                           (lang === 'en' ? 'Social interaction' : 'Sosyal etkileşim')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => setAppState('expertise')} 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg"
            >
              {lang === 'en' ? '🚀 Proceed to Expertise Analysis' : '🚀 Uzmanlık Analizine Geç'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setAppState('assessment')}
              className="border-2 border-gray-300 hover:bg-gray-50 px-8 py-3 text-lg font-semibold"
            >
              {lang === 'en' ? '🔄 Retake Assessment' : '🔄 Envanteri Tekrar Yap'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setAppState('dashboard')}
              className="border-2 border-gray-300 hover:bg-gray-50 px-8 py-3 text-lg font-semibold"
            >
              {lang === 'en' ? '🏠 Back to Home' : '🏠 Ana Sayfaya Dön'}
            </Button>
          </div>
        </div>
      )}

      {/* Uzmanlık sonuçları ekranı */}
      {appState === 'expertise-results' && expertiseResults && (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {lang === 'en' ? '🚀 Your Expertise Profile' : '🚀 Uzmanlık Profiliniz'}
            </h1>
            <p className="text-gray-600 text-lg">
              {lang === 'en' ? 'Your expertise analysis results are below' : 'Uzmanlık analizinizin sonuçları aşağıdadır'}
            </p>
          </div>

          {/* Ana Profil Kartı */}
          <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <div className="text-center mb-8">
              {/* Dominant Expertise Badge */}
              <div className="inline-flex items-center px-8 py-4 rounded-full text-white font-bold text-2xl mb-6 shadow-lg" 
                   style={{ backgroundColor: (lang === 'en' ? EXPERTISE_DESCRIPTIONS_EN : EXPERTISE_DESCRIPTIONS)[expertiseResults.dominant].color }}>
                <span className="mr-3 text-3xl">
                  {expertiseResults.dominant === 'Marketing' ? '📊' : 
                   expertiseResults.dominant === 'Sales' ? '💼' : 
                   expertiseResults.dominant === 'Brand' ? '🎨' : '⚙️'}
                </span>
                {(lang === 'en' ? EXPERTISE_DESCRIPTIONS_EN : EXPERTISE_DESCRIPTIONS)[expertiseResults.dominant].title}
              </div>
              
              {/* Description */}
              <p className="text-gray-700 text-xl leading-relaxed max-w-3xl mx-auto mb-8">
                {(lang === 'en' ? EXPERTISE_DESCRIPTIONS_EN : EXPERTISE_DESCRIPTIONS)[expertiseResults.dominant].description}
              </p>
            </div>

            {/* Scores Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {(['Marketing', 'Sales', 'Brand', 'Product'] as const).map((type) => (
                <div key={type} className={`p-4 rounded-lg text-center ${
                  type === expertiseResults.dominant 
                    ? 'ring-2 ring-offset-2' 
                    : 'bg-gray-50'
                }`} style={{
                  backgroundColor: type === expertiseResults.dominant 
                    ? `${(lang === 'en' ? EXPERTISE_DESCRIPTIONS_EN : EXPERTISE_DESCRIPTIONS)[type].color}20` 
                    : undefined,
                  borderColor: type === expertiseResults.dominant 
                    ? (lang === 'en' ? EXPERTISE_DESCRIPTIONS_EN : EXPERTISE_DESCRIPTIONS)[type].color 
                    : undefined
                }}>
                  <div className="text-2xl font-bold mb-2" style={{ color: (lang === 'en' ? EXPERTISE_DESCRIPTIONS_EN : EXPERTISE_DESCRIPTIONS)[type].color }}>
                    {expertiseResults.scores[type]}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {(lang === 'en' ? EXPERTISE_DESCRIPTIONS_EN : EXPERTISE_DESCRIPTIONS)[type].title.split(' ')[0]}
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Sections */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Traits & Careers Section */}
              <div className="space-y-6">
                {/* Traits Section */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">💪</span>
                    {lang === 'en' ? 'Key Strengths' : 'Güçlü Özellikler'}
                  </h3>
                  <div className="space-y-2">
                    {(lang === 'en' ? EXPERTISE_DESCRIPTIONS_EN : EXPERTISE_DESCRIPTIONS)[expertiseResults.dominant].traits.map((trait, index) => (
                      <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: (lang === 'en' ? EXPERTISE_DESCRIPTIONS_EN : EXPERTISE_DESCRIPTIONS)[expertiseResults.dominant].color }}></div>
                        <span className="font-medium text-gray-700">{trait}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Careers Section */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">💼</span>
                    {lang === 'en' ? 'Suitable Careers' : 'Uygun Kariyerler'}
                  </h3>
                  <div className="space-y-2">
                    {(lang === 'en' ? EXPERTISE_DESCRIPTIONS_EN : EXPERTISE_DESCRIPTIONS)[expertiseResults.dominant].careers.map((career, index) => (
                      <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: (lang === 'en' ? EXPERTISE_DESCRIPTIONS_EN : EXPERTISE_DESCRIPTIONS)[expertiseResults.dominant].color }}></div>
                        <span className="font-medium text-gray-700">{career}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tools & Responsibilities Section */}
              <div className="space-y-6">
                {/* Tools Section */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">🛠️</span>
                    {lang === 'en' ? 'Recommended Tools' : 'Önerilen Araçlar'}
                  </h3>
                  <div className="space-y-2">
                    {(lang === 'en' ? EXPERTISE_DESCRIPTIONS_EN : EXPERTISE_DESCRIPTIONS)[expertiseResults.dominant].tools.map((tool, index) => (
                      <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: (lang === 'en' ? EXPERTISE_DESCRIPTIONS_EN : EXPERTISE_DESCRIPTIONS)[expertiseResults.dominant].color }}></div>
                        <span className="font-medium text-gray-700">{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Responsibilities Section */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">📋</span>
                    {lang === 'en' ? 'Key Responsibilities' : 'Temel Sorumluluklar'}
                  </h3>
                  <div className="space-y-2">
                    {(lang === 'en' ? EXPERTISE_DESCRIPTIONS_EN : EXPERTISE_DESCRIPTIONS)[expertiseResults.dominant].responsibilities.map((responsibility, index) => (
                      <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: (lang === 'en' ? EXPERTISE_DESCRIPTIONS_EN : EXPERTISE_DESCRIPTIONS)[expertiseResults.dominant].color }}></div>
                        <span className="font-medium text-gray-700">{responsibility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Career Insights */}
            <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🔍</span>
                {lang === 'en' ? 'Career Analysis' : 'Kariyer Analizi'}
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    {lang === 'en' ? 'Strengths:' : 'Güçlü Yönler:'}
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• {expertiseResults.dominant === 'Marketing' ? 
                           (lang === 'en' ? 'Data-driven decision making and strategic thinking' : 'Veri odaklı karar verme ve stratejik düşünme') : 
                           expertiseResults.dominant === 'Sales' ? 
                           (lang === 'en' ? 'Customer relationships and persuasion skills' : 'Müşteri ilişkileri ve ikna kabiliyeti') :
                           expertiseResults.dominant === 'Brand' ? 
                           (lang === 'en' ? 'Creativity and visual perception' : 'Yaratıcılık ve görsel algı') : 
                           (lang === 'en' ? 'Analytical thinking and process management' : 'Analitik düşünce ve süreç yönetimi')}</li>
                    <li>• {expertiseResults.dominant === 'Marketing' ? 
                           (lang === 'en' ? 'Campaign optimization and ROI analysis' : 'Kampanya optimizasyonu ve ROI analizi') :
                           expertiseResults.dominant === 'Sales' ? 
                           (lang === 'en' ? 'Goal-oriented sales strategies' : 'Hedef odaklı satış stratejileri') :
                           expertiseResults.dominant === 'Brand' ? 
                           (lang === 'en' ? 'Brand consistency and perception management' : 'Marka tutarlılığı ve algı yönetimi') : 
                           (lang === 'en' ? 'User experience and product development' : 'Kullanıcı deneyimi ve ürün geliştirme')}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    {lang === 'en' ? 'Areas for Development:' : 'Gelişim Alanları:'}
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• {expertiseResults.dominant === 'Marketing' ? 
                           (lang === 'en' ? 'Technical details and process management' : 'Teknik detaylar ve süreç yönetimi') :
                           expertiseResults.dominant === 'Sales' ? 
                           (lang === 'en' ? 'Creative content production' : 'Yaratıcı içerik üretimi') :
                           expertiseResults.dominant === 'Brand' ? 
                           (lang === 'en' ? 'Data analysis and measurement' : 'Veri analizi ve ölçümleme') : 
                           (lang === 'en' ? 'Creative design and brand management' : 'Yaratıcı tasarım ve marka yönetimi')}</li>
                    <li>• {expertiseResults.dominant === 'Marketing' ? 
                           (lang === 'en' ? 'Direct customer relationships' : 'Birebir müşteri ilişkileri') :
                           expertiseResults.dominant === 'Sales' ? 
                           (lang === 'en' ? 'Strategic planning and analysis' : 'Stratejik planlama ve analiz') :
                           expertiseResults.dominant === 'Brand' ? 
                           (lang === 'en' ? 'Technical processes and data management' : 'Teknik süreçler ve veri yönetimi') : 
                           (lang === 'en' ? 'Sales and marketing strategies' : 'Satış ve pazarlama stratejileri')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => setAppState('assessment')} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg"
            >
              {lang === 'en' ? '🔄 Take Personality Assessment' : '🔄 Kişilik Envanterini Yap'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setAppState('expertise')}
              className="border-2 border-gray-300 hover:bg-gray-50 px-8 py-3 text-lg font-semibold"
            >
              {lang === 'en' ? '🔄 Retake Expertise Analysis' : '🔄 Uzmanlık Analizini Tekrar Yap'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setAppState('dashboard')}
              className="border-2 border-gray-300 hover:bg-gray-50 px-8 py-3 text-lg font-semibold"
            >
              {lang === 'en' ? '🏠 Back to Home' : '🏠 Ana Sayfaya Dön'}
            </Button>
          </div>
        </div>
      )}

      {/* Dashboard ekranı */}
      {appState === 'dashboard' && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {lang === 'en' ? 'Welcome! 🎉' : 'Hoş Geldiniz! 🎉'}
          </h2>
          <p className="text-gray-600 mb-8">
            {lang === 'en' 
              ? 'You have completed your personality assessment. You can now continue your career journey.' 
              : 'Kişilik envanterinizi tamamladınız. Şimdi kariyer yolculuğunuza devam edebilirsiniz.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => setAppState('assessment')} 
              className="h-16 text-lg bg-[#10b981] hover:bg-[#059669]"
            >
              {lang === 'en' ? '🔄 Retake Assessment' : '🔄 Envanteri Tekrar Yap'}
            </Button>
            <Button 
              variant="outline" 
              className="h-16 text-lg" 
              onClick={() => setAppState('expertise')}
            >
              {lang === 'en' ? '🚀 Expertise Analysis' : '🚀 Uzmanlık Analizi'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

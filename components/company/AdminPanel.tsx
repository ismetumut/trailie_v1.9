'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Users, 
  Building2, 
  MapPin, 
  Calendar,
  Star,
  TrendingUp,
  DollarSign,
  FileText,
  Settings,
  Crown
} from 'lucide-react';
import { searchCandidates } from '@/lib/firebase';

interface Candidate {
  id: string;
  name: string;
  email: string;
  personalityType: string;
  skills: string[];
  suggestedRole: string;
  location: string;
  experience: string;
  education: string;
  simulationScore?: number;
  cvUrl?: string;
  avatar?: string;
}

interface CompanyStats {
  totalCandidates: number;
  monthlyViews: number;
  annualViews: number;
  currentPlan: 'monthly' | 'annual';
  viewsUsed: number;
  viewsLimit: number;
}

export function AdminPanel() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    personalityType: '',
    skills: '',
    location: '',
    role: '',
    experience: ''
  });

  const [stats] = useState<CompanyStats>({
    totalCandidates: 1247,
    monthlyViews: 20,
    annualViews: 0,
    currentPlan: 'monthly',
    viewsUsed: 8,
    viewsLimit: 20
  });

  // Sample candidates data
  const sampleCandidates: Candidate[] = [
    {
      id: '1',
      name: 'Ahmet Yılmaz',
      email: 'ahmet.yilmaz@email.com',
      personalityType: 'INTJ',
      skills: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
      suggestedRole: 'Senior Frontend Developer',
      location: 'İstanbul',
      experience: '5-7 yıl',
      education: 'Bilgisayar Mühendisliği',
      simulationScore: 87,
      avatar: '/placeholder-user.jpg'
    },
    {
      id: '2',
      name: 'Ayşe Demir',
      email: 'ayse.demir@email.com',
      personalityType: 'ENFP',
      skills: ['Product Management', 'Agile', 'User Research', 'Data Analysis'],
      suggestedRole: 'Product Manager',
      location: 'Ankara',
      experience: '3-5 yıl',
      education: 'İşletme',
      simulationScore: 92,
      avatar: '/placeholder-user.jpg'
    },
    {
      id: '3',
      name: 'Mehmet Kaya',
      email: 'mehmet.kaya@email.com',
      personalityType: 'ISTP',
      skills: ['Python', 'Machine Learning', 'Data Science', 'SQL'],
      suggestedRole: 'Data Scientist',
      location: 'İzmir',
      experience: '2-4 yıl',
      education: 'İstatistik',
      simulationScore: 78,
      avatar: '/placeholder-user.jpg'
    }
  ];

  useEffect(() => {
    setCandidates(sampleCandidates);
    setFilteredCandidates(sampleCandidates);
  }, []);

  useEffect(() => {
    let filtered = candidates;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.suggestedRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Other filters
    if (filters.personalityType) {
      filtered = filtered.filter(candidate => candidate.personalityType === filters.personalityType);
    }
    if (filters.skills) {
      filtered = filtered.filter(candidate => 
        candidate.skills.some(skill => skill.toLowerCase().includes(filters.skills.toLowerCase()))
      );
    }
    if (filters.location) {
      filtered = filtered.filter(candidate => candidate.location === filters.location);
    }
    if (filters.role) {
      filtered = filtered.filter(candidate => candidate.suggestedRole === filters.role);
    }
    if (filters.experience) {
      filtered = filtered.filter(candidate => candidate.experience === filters.experience);
    }

    setFilteredCandidates(filtered);
  }, [candidates, searchTerm, filters]);

  const handleViewCV = (candidate: Candidate) => {
    if (stats.viewsUsed >= stats.viewsLimit) {
      alert('CV görüntüleme limitiniz dolmuştur. Paketinizi yükseltin.');
      return;
    }
    // Handle CV viewing logic
    console.log('Viewing CV for:', candidate.name);
  };

  const handleDownloadCV = (candidate: Candidate) => {
    if (stats.viewsUsed >= stats.viewsLimit) {
      alert('CV indirme limitiniz dolmuştur. Paketinizi yükseltin.');
      return;
    }
    // Handle CV download logic
    console.log('Downloading CV for:', candidate.name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Şirket Yönetim Paneli</h1>
            <p className="text-gray-600">Nitelikli adayları keşfedin ve CV'lerini inceleyin</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Ayarlar
            </Button>
            <Button>
              <Crown className="w-4 h-4 mr-2" />
              Paket Yükselt
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Toplam Aday</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCandidates}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">CV Görüntüleme</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.viewsUsed}/{stats.viewsLimit}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mevcut Paket</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.currentPlan === 'monthly' ? 'Aylık' : 'Yıllık'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Paket Ücreti</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.currentPlan === 'monthly' ? '9.999₺' : '100.000₺'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Aday Arama</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="İsim, rol veya beceri ile arama yapın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>Kişilik Tipi</Label>
                <Select value={filters.personalityType} onValueChange={(value) => setFilters({...filters, personalityType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tümü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tümü</SelectItem>
                    <SelectItem value="INTJ">INTJ</SelectItem>
                    <SelectItem value="INTP">INTP</SelectItem>
                    <SelectItem value="ENTJ">ENTJ</SelectItem>
                    <SelectItem value="ENTP">ENTP</SelectItem>
                    <SelectItem value="INFJ">INFJ</SelectItem>
                    <SelectItem value="INFP">INFP</SelectItem>
                    <SelectItem value="ENFJ">ENFJ</SelectItem>
                    <SelectItem value="ENFP">ENFP</SelectItem>
                    <SelectItem value="ISTJ">ISTJ</SelectItem>
                    <SelectItem value="ISFJ">ISFJ</SelectItem>
                    <SelectItem value="ESTJ">ESTJ</SelectItem>
                    <SelectItem value="ESFJ">ESFJ</SelectItem>
                    <SelectItem value="ISTP">ISTP</SelectItem>
                    <SelectItem value="ISFP">ISFP</SelectItem>
                    <SelectItem value="ESTP">ESTP</SelectItem>
                    <SelectItem value="ESFP">ESFP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Beceri</Label>
                <Input
                  placeholder="React, Python..."
                  value={filters.skills}
                  onChange={(e) => setFilters({...filters, skills: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Konum</Label>
                <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tümü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tümü</SelectItem>
                    <SelectItem value="İstanbul">İstanbul</SelectItem>
                    <SelectItem value="Ankara">Ankara</SelectItem>
                    <SelectItem value="İzmir">İzmir</SelectItem>
                    <SelectItem value="Bursa">Bursa</SelectItem>
                    <SelectItem value="Antalya">Antalya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Önerilen Rol</Label>
                <Select value={filters.role} onValueChange={(value) => setFilters({...filters, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tümü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tümü</SelectItem>
                    <SelectItem value="Senior Frontend Developer">Senior Frontend Developer</SelectItem>
                    <SelectItem value="Product Manager">Product Manager</SelectItem>
                    <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                    <SelectItem value="UX Designer">UX Designer</SelectItem>
                    <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Deneyim</Label>
                <Select value={filters.experience} onValueChange={(value) => setFilters({...filters, experience: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tümü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tümü</SelectItem>
                    <SelectItem value="0-2 yıl">0-2 yıl</SelectItem>
                    <SelectItem value="2-4 yıl">2-4 yıl</SelectItem>
                    <SelectItem value="3-5 yıl">3-5 yıl</SelectItem>
                    <SelectItem value="5-7 yıl">5-7 yıl</SelectItem>
                    <SelectItem value="7+ yıl">7+ yıl</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>
              Adaylar ({filteredCandidates.length} sonuç)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCandidates.map((candidate) => (
                <div key={candidate.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={candidate.avatar} />
                        <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                          <p className="text-gray-600">{candidate.email}</p>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{candidate.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{candidate.experience}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Building2 className="w-4 h-4" />
                            <span>{candidate.education}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{candidate.personalityType}</Badge>
                            <Badge variant="outline">{candidate.suggestedRole}</Badge>
                            {candidate.simulationScore && (
                              <Badge variant="default" className="flex items-center space-x-1">
                                <Star className="w-3 h-3" />
                                <span>{candidate.simulationScore}/100</span>
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {candidate.skills.slice(0, 4).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {candidate.skills.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{candidate.skills.length - 4} daha
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewCV(candidate)}
                        disabled={stats.viewsUsed >= stats.viewsLimit}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        CV Görüntüle
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadCV(candidate)}
                        disabled={stats.viewsUsed >= stats.viewsLimit}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        İndir
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredCandidates.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aday bulunamadı</h3>
                  <p className="text-gray-600">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
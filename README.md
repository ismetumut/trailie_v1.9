# 🚀 Trailie - AI-Powered Career Discovery Platform

Trailie, yapay zeka destekli kişilik ve uzmanlık analizleri ile kariyer keşfi yapan modern bir web uygulamasıdır.

## ✨ Özellikler

### 🧠 DISC Kişilik Envanteri
- 10 soruluk bilimsel DISC analizi
- Gizli renk kodlamalı puanlama sistemi
- Detaylı kişilik profili ve kariyer önerileri

### 🎯 Uzmanlık Analizi
- 6 soruluk rol belirleme testi
- Marketing, Sales, Brand, Product uzmanlık alanları
- Önerilen araçlar ve kariyer yolları

### 🏢 Çift Kullanıcı Tipi
- **Bireysel Kullanıcılar**: Kişilik ve uzmanlık analizleri
- **Firma Kullanıcıları**: CV veritabanı ve aday analizi

### 📱 Modern UI/UX
- Responsive tasarım (mobil/desktop)
- Minimalist ve modern arayüz
- Soft mint/teal renk paleti
- Hamburger menü ve bildirim sistemi

## 🛠️ Teknoloji Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Firebase (Firestore, Auth)
- **AI**: OpenAI API
- **Deployment**: Vercel

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya pnpm

### Adımlar

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/yourusername/trailie.git
cd trailie
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment variables'ları ayarlayın**
`.env.local` dosyası oluşturun:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
OPENAI_API_KEY=your_openai_api_key
```

4. **Development server'ı başlatın**
```bash
npm run dev
```

5. **Tarayıcıda açın**
```
http://localhost:3000
```

## 📁 Proje Yapısı

```
trailie/
├── app/                    # Next.js app router
│   ├── layout.tsx         # Ana layout
│   ├── page.tsx           # Ana sayfa
│   └── globals.css        # Global stiller
├── components/            # React component'leri
│   ├── auth/             # Kimlik doğrulama
│   ├── assessment/       # Test component'leri
│   ├── company/          # Firma paneli
│   └── ui/               # UI component'leri
├── contexts/             # React context'leri
├── lib/                  # Utility fonksiyonları
├── public/               # Statik dosyalar
└── styles/               # CSS dosyaları
```

## 🎨 Tasarım Sistemi

### Renk Paleti
- **Primary**: #10b981 (Emerald)
- **Secondary**: #8b5cf6 (Purple)
- **Background**: #eaf6f2 to #d1f2e6 (Gradient)
- **Text**: #1f2937 (Gray-800)

### Fontlar
- **Primary**: Inter
- **Secondary**: SF Pro Display

## 🔧 Konfigürasyon

### Firebase Setup
1. Firebase Console'da yeni proje oluşturun
2. Web app ekleyin
3. Authentication'ı etkinleştirin
4. Firestore Database'i oluşturun
5. Environment variables'ları ayarlayın

### OpenAI Setup
1. OpenAI API key alın
2. `.env.local` dosyasına ekleyin

## 🚀 Deployment

### Vercel ile Deploy

1. **Vercel CLI yükleyin**
```bash
npm i -g vercel
```

2. **Deploy edin**
```bash
vercel
```

3. **Environment variables'ları ayarlayın**
Vercel dashboard'da environment variables'ları ekleyin.

### Manuel Deploy
```bash
npm run build
npm start
```

## 📊 Analiz Sistemi

### DISC Kişilik Analizi
- **D (Dominant)**: Yönlendirici, liderlik odaklı
- **I (Influential)**: Etkileyici, sosyal
- **S (Steady)**: Destekleyici, sadık
- **C (Conscientious)**: Analitik, düzenli

### Uzmanlık Analizi
- **Marketing**: Dijital pazarlama, veri analizi
- **Sales**: Müşteri ilişkileri, satış
- **Brand**: Marka yönetimi, yaratıcılık
- **Product**: Ürün yönetimi, teknik

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Email**: info@trailie.com
- **Website**: https://trailie.com
- **LinkedIn**: [Trailie](https://linkedin.com/company/trailie)

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Firebase](https://firebase.google.com/) - Backend services
- [OpenAI](https://openai.com/) - AI services

---

**Trailie** - Kariyer yolculuğunuzda yanınızdayız! 🚀

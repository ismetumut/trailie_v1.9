#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Career Discovery Setup Wizard');
console.log('================================\n');

const questions = [
  {
    name: 'firebaseApiKey',
    message: 'Enter your Firebase API Key:',
    required: true
  },
  {
    name: 'firebaseAuthDomain',
    message: 'Enter your Firebase Auth Domain (e.g., your-project.firebaseapp.com):',
    required: true
  },
  {
    name: 'firebaseProjectId',
    message: 'Enter your Firebase Project ID:',
    required: true
  },
  {
    name: 'firebaseStorageBucket',
    message: 'Enter your Firebase Storage Bucket (e.g., your-project.appspot.com):',
    required: true
  },
  {
    name: 'firebaseMessagingSenderId',
    message: 'Enter your Firebase Messaging Sender ID:',
    required: true
  },
  {
    name: 'firebaseAppId',
    message: 'Enter your Firebase App ID:',
    required: true
  },
  {
    name: 'openaiApiKey',
    message: 'Enter your OpenAI API Key:',
    required: true
  }
];

const envTemplate = `# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY={{firebaseApiKey}}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN={{firebaseAuthDomain}}
NEXT_PUBLIC_FIREBASE_PROJECT_ID={{firebaseProjectId}}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET={{firebaseStorageBucket}}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID={{firebaseMessagingSenderId}}
NEXT_PUBLIC_FIREBASE_APP_ID={{firebaseAppId}}

# OpenAI Configuration
NEXT_PUBLIC_OPENAI_API_KEY={{openaiApiKey}}

# Optional: Analytics (if you want to add Google Analytics)
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional: Sentry (for error tracking)
# NEXT_PUBLIC_SENTRY_DSN=https://your_sentry_dsn_here
`;

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question.message, (answer) => {
      if (question.required && !answer.trim()) {
        console.log('❌ This field is required. Please try again.\n');
        resolve(askQuestion(question));
      } else {
        resolve(answer.trim());
      }
    });
  });
}

async function runSetup() {
  try {
    console.log('📋 Please provide the following configuration details:\n');
    
    const answers = {};
    
    for (const question of questions) {
      answers[question.name] = await askQuestion(question);
    }
    
    // Generate .env.local file
    let envContent = envTemplate;
    Object.keys(answers).forEach(key => {
      envContent = envContent.replace(new RegExp(`{{${key}}}`, 'g'), answers[key]);
    });
    
    const envPath = path.join(process.cwd(), '.env.local');
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ Configuration completed successfully!');
    console.log('📁 Created .env.local file with your configuration');
    console.log('\n🔧 Next steps:');
    console.log('1. Make sure you have Node.js 18+ installed');
    console.log('2. Run: pnpm install (or npm install)');
    console.log('3. Run: pnpm dev (or npm run dev)');
    console.log('4. Open http://localhost:3000 in your browser');
    console.log('\n📚 For more information, check the README.md file');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Check if .env.local already exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  rl.question('⚠️  .env.local already exists. Do you want to overwrite it? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      runSetup();
    } else {
      console.log('Setup cancelled.');
      rl.close();
    }
  });
} else {
  runSetup();
} 
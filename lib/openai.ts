import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use API routes instead
});

export interface PersonalityResult {
  type: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  careerPreferences: string[];
}

export interface ExpertiseResult {
  level: string;
  skills: string[];
  experience: string;
  areas: string[];
}

export interface RoleRecommendation {
  title: string;
  description: string;
  successTraits: string[];
  averageSalary: string;
  matchScore: number;
  requirements: string[];
  growthPotential: string;
}

export interface SimulationFeedback {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
}

export interface CareerReport {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  courses: CourseRecommendation[];
  nextSteps: string[];
}

export interface CourseRecommendation {
  title: string;
  platform: string;
  url: string;
  duration: string;
  level: string;
  description: string;
}

// AI Role Recommendation based on personality and expertise
export const generateRoleRecommendations = async (
  personalityResults: PersonalityResult,
  expertiseResults: ExpertiseResult
): Promise<RoleRecommendation[]> => {
  try {
    const prompt = `
    Based on the following personality and expertise assessment results, recommend 3 suitable career roles.
    
    Personality Type: ${personalityResults.type}
    Personality Description: ${personalityResults.description}
    Strengths: ${personalityResults.strengths.join(', ')}
    Career Preferences: ${personalityResults.careerPreferences.join(', ')}
    
    Expertise Level: ${expertiseResults.level}
    Skills: ${expertiseResults.skills.join(', ')}
    Experience: ${expertiseResults.experience}
    
    For each role, provide:
    - Title
    - Description
    - Success traits needed
    - Average salary (in Turkish Lira)
    - Match score (0-100)
    - Requirements
    - Growth potential
    
    Format as JSON array with these fields: title, description, successTraits, averageSalary, matchScore, requirements, growthPotential
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    if (response) {
      return JSON.parse(response);
    }
    
    return [];
  } catch (error) {
    console.error('Error generating role recommendations:', error);
    return [];
  }
};

// AI Career Report Generation
export const generateCareerReport = async (
  personalityResults: PersonalityResult,
  expertiseResults: ExpertiseResult,
  simulationResults: SimulationFeedback
): Promise<CareerReport> => {
  try {
    const prompt = `
    Generate a comprehensive career report based on the following assessment results:
    
    Personality Assessment:
    - Type: ${personalityResults.type}
    - Description: ${personalityResults.description}
    - Strengths: ${personalityResults.strengths.join(', ')}
    - Weaknesses: ${personalityResults.weaknesses.join(', ')}
    
    Expertise Assessment:
    - Level: ${expertiseResults.level}
    - Skills: ${expertiseResults.skills.join(', ')}
    - Experience: ${expertiseResults.experience}
    
    Simulation Results:
    - Score: ${simulationResults.score}/100
    - Feedback: ${simulationResults.feedback}
    - Strengths: ${simulationResults.strengths.join(', ')}
    - Areas for Improvement: ${simulationResults.improvements.join(', ')}
    
    Provide a comprehensive report including:
    1. Executive summary
    2. Key strengths (5-7 points)
    3. Areas for improvement (3-5 points)
    4. Specific recommendations (5-7 actionable items)
    5. Recommended online courses (3-5 courses with platforms like Coursera, Udemy, LinkedIn Learning)
    6. Next steps (3-5 immediate actions)
    
    Format as JSON with fields: summary, strengths, weaknesses, recommendations, courses, nextSteps
    For courses, include: title, platform, url, duration, level, description
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    if (response) {
      return JSON.parse(response);
    }
    
    return {
      summary: "Unable to generate report at this time.",
      strengths: [],
      weaknesses: [],
      recommendations: [],
      courses: [],
      nextSteps: []
    };
  } catch (error) {
    console.error('Error generating career report:', error);
    return {
      summary: "Unable to generate report at this time.",
      strengths: [],
      weaknesses: [],
      recommendations: [],
      courses: [],
      nextSteps: []
    };
  }
};

// AI Interview Question Generation
export const generateInterviewQuestions = async (roleTitle: string): Promise<string[]> => {
  try {
    const prompt = `
    Generate 10 relevant interview questions for the role: ${roleTitle}
    
    Include a mix of:
    - Behavioral questions
    - Technical questions
    - Situational questions
    - Problem-solving questions
    
    Return as a JSON array of strings.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    if (response) {
      return JSON.parse(response);
    }
    
    return [];
  } catch (error) {
    console.error('Error generating interview questions:', error);
    return [];
  }
};

// AI Interview Feedback
export const generateInterviewFeedback = async (
  question: string,
  answer: string,
  roleTitle: string
): Promise<string> => {
  try {
    const prompt = `
    Provide constructive feedback for this interview response:
    
    Role: ${roleTitle}
    Question: ${question}
    Answer: ${answer}
    
    Provide specific, actionable feedback in 2-3 sentences.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "No feedback available.";
  } catch (error) {
    console.error('Error generating interview feedback:', error);
    return "Unable to generate feedback at this time.";
  }
};

// AI Resume Enhancement
export const enhanceResumeContent = async (
  roleTitle: string,
  currentContent: string
): Promise<string> => {
  try {
    const prompt = `
    Enhance this resume content for the role: ${roleTitle}
    
    Current content: ${currentContent}
    
    Make it more compelling, relevant, and tailored to the role.
    Use action verbs and quantifiable achievements where possible.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || currentContent;
  } catch (error) {
    console.error('Error enhancing resume content:', error);
    return currentContent;
  }
}; 
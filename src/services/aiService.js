export const aiService = {
  async analyzeResume(resumeText) {
    return {
      atsScore: 85,
      skills: ['React', 'Node.js', 'AI'],
      improvements: ['Add more quantified achievements', 'Highlight leadership experience'],
      summary: 'Experienced software engineer with a strong background in AI-driven solutions.',
      keywords: ['AI', 'React', 'Machine Learning']
    };
  },
  async matchJobs(profile, jobs) {
    return jobs.map(job => ({
      ...job,
      matchPercentage: Math.floor(Math.random() * 40) + 60
    })).sort((a, b) => b.matchPercentage - a.matchPercentage);
  },
  async generateCoverLetter(jobTitle, company, skills) {
    return `Dear Hiring Manager,\n\nI am writing to express my interest in the ${jobTitle} position at ${company}. With my background in ${skills.join(', ')}, I believe I would be a great fit for your team.\n\nSincerely,\nCandidate`;
  },
  async generateResumeSummary(profile) {
    return 'Results-driven professional with strong technical expertise and a passion for building innovative solutions.';
  },
  async getCareerAdvice(profile) {
    return [
      'Focus on advanced system design.',
      'Contribute to open-source AI projects.',
      'Consider acquiring a cloud certification.'
    ];
  },
  async getSkillGapAnalysis(profileSkills, jobSkills) {
    const missing = jobSkills.filter(s => !profileSkills.includes(s));
    return {
      missingSkills: missing,
      roadmap: missing.map(s => `Take an advanced course on ${s} and build a small project.`)
    };
  },
  async getInterviewQuestions(jobTitle, skills) {
    return [
      { question: 'Can you describe a challenging project?', tip: 'Use the STAR method.' },
      { question: 'How do you keep up with new technology?', tip: 'Mention specific blogs or communities.' }
    ];
  },
  async getLearningRoadmap(skill) {
    return [
      { title: 'Fundamentals', description: `Learn the basics of ${skill}` },
      { title: 'Intermediate Concepts', description: `Understand advanced features of ${skill}` },
      { title: 'Advanced Projects', description: `Build real-world applications using ${skill}` }
    ];
  }
};

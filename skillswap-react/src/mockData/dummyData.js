// Mock data for courses and achievements
export const dummyCourses = [
  // Programming Courses
  {
    id: 1,
    title: "Advanced Web Development",
    instructor: "John Smith",
    category: "Programming",
    progress: 75,
    rating: 4.5,
    students: 813,
    price: 85,
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    lastAccessed: new Date(),
    description: "Master modern web development techniques and tools including React, Node.js, and cloud deployment",
    topics: ["Frontend Development", "Backend Integration", "Cloud Deployment", "Performance Optimization"]
  },
  {
    id: 2,
    title: "Python for Data Science",
    instructor: "Emily Chen",
    category: "Programming",
    progress: 60,
    rating: 4.8,
    students: 1250,
    price: 95,
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    lastAccessed: new Date(),
    description: "Learn Python programming for data analysis, machine learning, and scientific computing",
    topics: ["Python Basics", "Data Analysis", "Machine Learning", "Scientific Computing"]
  },

  // Design Courses
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    instructor: "Sarah Johnson",
    category: "Design",
    progress: 45,
    rating: 4.7,
    students: 945,
    price: 75,
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    lastAccessed: new Date(),
    description: "Master the principles of user interface and experience design for digital products",
    topics: ["Design Principles", "User Research", "Wireframing", "Prototyping"]
  },
  {
    id: 4,
    title: "Advanced Graphic Design",
    instructor: "Michael Wong",
    category: "Design",
    progress: 30,
    rating: 4.6,
    students: 720,
    price: 89,
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
    lastAccessed: new Date(),
    description: "Take your graphic design skills to the next level with advanced techniques and tools",
    topics: ["Typography", "Color Theory", "Brand Design", "Digital Illustration"]
  },

  // Business Courses
  {
    id: 5,
    title: "Digital Marketing Strategy",
    instructor: "Lisa Anderson",
    category: "Business",
    progress: 65,
    rating: 4.4,
    students: 1100,
    price: 79,
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    lastAccessed: new Date(),
    description: "Create and implement effective digital marketing strategies for business growth",
    topics: ["Market Analysis", "SEO", "Social Media Marketing", "Content Strategy"]
  },
  {
    id: 6,
    title: "Entrepreneurship Fundamentals",
    instructor: "Robert Martinez",
    category: "Business",
    progress: 40,
    rating: 4.9,
    students: 890,
    price: 99,
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
    lastAccessed: new Date(),
    description: "Learn the essential skills and strategies for launching and growing a successful business",
    topics: ["Business Planning", "Market Research", "Financial Management", "Growth Strategies"]
  },

  // Marketing Courses
  {
    id: 7,
    title: "Social Media Marketing",
    instructor: "Jessica Lee",
    category: "Marketing",
    progress: 55,
    rating: 4.7,
    students: 1500,
    price: 69,
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    lastAccessed: new Date(),
    description: "Master social media marketing strategies across multiple platforms",
    topics: ["Platform Strategy", "Content Creation", "Analytics", "Engagement Tactics"]
  },

  // Language Courses
  {
    id: 8,
    title: "Business Japanese",
    instructor: "Yuki Tanaka",
    category: "Language",
    progress: 25,
    rating: 4.8,
    students: 450,
    price: 89,
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80",
    lastAccessed: new Date(),
    description: "Learn Japanese language skills for business and professional settings",
    topics: ["Business Vocabulary", "Formal Communication", "Meeting Etiquette", "Negotiation Skills"]
  },

  // Music Courses
  {
    id: 9,
    title: "Music Production Essentials",
    instructor: "David Wilson",
    category: "Music",
    progress: 70,
    rating: 4.6,
    students: 680,
    price: 79,
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
    lastAccessed: new Date(),
    description: "Learn the fundamentals of music production and audio engineering",
    topics: ["DAW Basics", "Sound Design", "Mixing", "Music Theory"]
  },

  // Art Courses
  {
    id: 10,
    title: "Digital Painting",
    instructor: "Maria Garcia",
    category: "Art",
    progress: 50,
    rating: 4.7,
    students: 560,
    price: 69,
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=800&q=80",
    lastAccessed: new Date(),
    description: "Master digital painting techniques using professional software",
    topics: ["Digital Tools", "Color Theory", "Composition", "Character Design"]
  },

  // Other Courses
  {
    id: 11,
    title: "Personal Development",
    instructor: "James Thompson",
    category: "Other",
    progress: 35,
    rating: 4.5,
    students: 920,
    price: 59,
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&q=80",
    lastAccessed: new Date(),
    description: "Develop essential life skills for personal and professional growth",
    topics: ["Goal Setting", "Time Management", "Communication", "Leadership"]
  }
];

export const dummyAchievements = [
  {
    id: 1,
    title: "Fast Learner",
    description: "Completed 5 courses in one month",
    icon: "🚀",
    dateEarned: new Date(),
    points: 100
  },
  {
    id: 2,
    title: "Coding Master",
    description: "Achieved perfect score in coding assessment",
    icon: "💻",
    dateEarned: new Date(),
    points: 150
  },
  {
    id: 3,
    title: "Helpful Peer",
    description: "Received 10 positive reviews from peers",
    icon: "🤝",
    dateEarned: new Date(),
    points: 75
  }
];

export const dummyProfile = {
  name: "Alex Johnson",
  title: "Full Stack Developer",
  bio: "Passionate about web development and teaching others. Always learning and growing in the tech world.",
  email: "alex.johnson@example.com",
  location: "San Francisco, CA",
  possessedSkills: [
    {
      id: 1,
      name: "JavaScript",
      proficiencyLevel: "Advanced",
      yearsOfExperience: 3,
      availability: [
        { day: "Monday", startTime: "09:00", endTime: "17:00" },
        { day: "Wednesday", startTime: "09:00", endTime: "17:00" }
      ]
    },
    {
      id: 2,
      name: "React",
      proficiencyLevel: "Intermediate",
      yearsOfExperience: 2,
      availability: [
        { day: "Tuesday", startTime: "10:00", endTime: "18:00" },
        { day: "Thursday", startTime: "10:00", endTime: "18:00" }
      ]
    }
  ],
  requiredSkills: [
    {
      id: 1,
      name: "Python",
      desiredLevel: "Intermediate",
      preferredLearningMethod: "Online"
    },
    {
      id: 2,
      name: "UI Design",
      desiredLevel: "Beginner",
      preferredLearningMethod: "Both"
    }
  ],
  certifications: [
    {
      id: 1,
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "2023-01-15"
    },
    {
      id: 2,
      name: "React Native Specialist",
      issuer: "Meta",
      date: "2022-11-30"
    }
  ]
}; 
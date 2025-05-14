const bcrypt = require('bcryptjs');

// Use plain password in seed data
const password = 'StrongP@ss123';

const skills = [
  {
    name: "React",
    category: "Technology",
    description: "Building modern web applications with React",
    proficiencyLevel: "Advanced",
    teachingMethod: "Online",
    active: true,
    user: "johndoe",
    availability: [
      { day: "Monday", startTime: "09:00", endTime: "17:00" },
      { day: "Wednesday", startTime: "09:00", endTime: "17:00" }
    ]
  },
  {
    name: "JavaScript",
    category: "Technology",
    description: "JavaScript programming and web development",
    proficiencyLevel: "Expert",
    teachingMethod: "Online",
    active: true,
    user: "johndoe",
    availability: [
      { day: "Tuesday", startTime: "10:00", endTime: "18:00" },
      { day: "Thursday", startTime: "10:00", endTime: "18:00" }
    ]
  },
  {
    name: "UI Design",
    category: "Art",
    description: "User experience design principles and methodologies",
    proficiencyLevel: "Expert",
    teachingMethod: "Both",
    active: true,
    user: "janesmith",
    availability: [
      { day: "Tuesday", startTime: "10:00", endTime: "18:00" },
      { day: "Thursday", startTime: "10:00", endTime: "18:00" }
    ]
  },
  {
    name: "Python",
    category: "Technology",
    description: "Python programming and data science applications",
    proficiencyLevel: "Expert",
    teachingMethod: "Online",
    active: true,
    user: "alicegreen",
    availability: [
      { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
      { day: "Friday", startTime: "09:00", endTime: "17:00" }
    ]
  },
  {
    name: "Data Science",
    category: "Technology",
    description: "Data analysis and machine learning",
    proficiencyLevel: "Advanced",
    teachingMethod: "Online",
    active: true,
    user: "alicegreen",
    availability: [
      { day: "Monday", startTime: "09:00", endTime: "17:00" },
      { day: "Friday", startTime: "09:00", endTime: "17:00" }
    ]
  }
];

const users = [
  {
    username: 'johndoe',
    email: 'john@example.com',
    password: password,
    name: 'John Doe',
    title: 'Full Stack Developer',
    bio: 'Passionate about web development and teaching others.',
    location: 'New York, USA',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    role: 'user',
    isVerified: true,
    joinDate: new Date('2024-01-01'),
    lastActive: new Date('2024-03-20'),
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      language: 'en',
      theme: 'light'
    },
    possessedSkills: [
      {
        skill: null, // Will be replaced with React skill _id during seeding
        name: 'React',
        proficiencyLevel: 'Advanced',
        yearsOfExperience: 3,
        availability: [
          { day: 'Monday', startTime: '09:00', endTime: '17:00' },
          { day: 'Wednesday', startTime: '09:00', endTime: '17:00' }
        ]
      },
      {
        skill: null, // Will be replaced with JavaScript skill _id during seeding
        name: 'JavaScript',
        proficiencyLevel: 'Expert',
        yearsOfExperience: 5,
        availability: [
          { day: 'Tuesday', startTime: '10:00', endTime: '18:00' },
          { day: 'Thursday', startTime: '10:00', endTime: '18:00' }
        ]
      }
    ],
    requiredSkills: [
      {
        skill: null, // Will be replaced with Python skill _id during seeding
        name: 'Python',
        desiredLevel: 'Intermediate',
        preferredLearningMethod: 'Online'
      },
      {
        skill: null, // Will be replaced with Data Science skill _id during seeding
        name: 'Data Science',
        desiredLevel: 'Beginner',
        preferredLearningMethod: 'Both'
      }
    ],
    rating: 4.8,
    reviews: [],
    certifications: [
      {
        name: 'React Developer Certification',
        issuer: 'Meta',
        date: '2023'
      }
    ]
  },
  {
    username: 'janesmith',
    email: 'jane@example.com',
    password: password,
    name: 'Jane Smith',
    title: 'UX Designer',
    bio: 'Creative designer with a passion for user-centered design.',
    location: 'San Francisco, USA',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    role: 'user',
    isVerified: true,
    joinDate: new Date('2024-01-15'),
    lastActive: new Date('2024-03-19'),
    preferences: {
      emailNotifications: true,
      pushNotifications: false,
      language: 'en',
      theme: 'dark'
    },
    possessedSkills: [
      {
        skill: null, // Will be replaced with UI Design skill _id during seeding
        name: 'UI Design',
        proficiencyLevel: 'Expert',
        yearsOfExperience: 6,
        availability: [
          { day: 'Monday', startTime: '10:00', endTime: '18:00' },
          { day: 'Friday', startTime: '10:00', endTime: '18:00' }
        ]
      }
    ],
    requiredSkills: [
      {
        skill: null, // Will be replaced with React skill _id during seeding
        name: 'React',
        desiredLevel: 'Beginner',
        preferredLearningMethod: 'Online'
      }
    ],
    rating: 4.9,
    reviews: [],
    certifications: []
  },
  {
    username: 'alicegreen',
    email: 'alice@example.com',
    password: password,
    name: 'Alice Green',
    title: 'Data Scientist',
    bio: 'Data science enthusiast and Python expert.',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    role: 'user',
    isVerified: true,
    joinDate: new Date('2024-02-01'),
    lastActive: new Date('2024-03-20'),
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      language: 'en',
      theme: 'system'
    },
    possessedSkills: [
      {
        skill: null, // Will be replaced with Python skill _id during seeding
        name: 'Python',
        proficiencyLevel: 'Expert',
        yearsOfExperience: 4,
        availability: [
          { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
          { day: 'Thursday', startTime: '09:00', endTime: '17:00' }
        ]
      }
    ],
    requiredSkills: [
      {
        skill: null, // Will be replaced with JavaScript skill _id during seeding
        name: 'JavaScript',
        desiredLevel: 'Intermediate',
        preferredLearningMethod: 'Online'
      }
    ],
    rating: 4.7,
    reviews: [],
    certifications: []
  }
];

// Available courses for purchase (Courses Page)
const availableCourses = [
  {
    title: "Advanced Machine Learning",
    description: "Deep dive into machine learning algorithms and practical applications",
    category: "Programming",
    level: "Advanced",
    price: 99.99,
    instructor: "alicegreen",
    duration: 6720, // 16 weeks in minutes
    schedule: [
      { day: "Tuesday", time: "18:00-20:00" },
      { day: "Thursday", time: "18:00-20:00" }
    ],
    topics: ["Neural Networks", "Deep Learning", "Model Deployment", "MLOps"],
    rating: {
      average: 4.8,
      count: 45
    },
    totalStudents: 245,
    image: "https://images.unsplash.com/photo-1527474305487-b87b222841cc",
    badge: "Featured Creator",
    featured: true,
    status: "published",
    enrollmentStatus: "open",
    prerequisites: ["Basic Python", "Statistics"],
    learningOutcomes: [
      "Build and deploy ML models",
      "Understand advanced algorithms",
      "Work with real-world datasets"
    ],
    students: 245,
    lastAccessed: new Date('2024-03-20')
  },
  {
    title: "UX Research Masterclass",
    description: "Learn professional UX research methods and techniques",
    category: "Design",
    level: "Intermediate",
    price: 79.99,
    instructor: "janesmith",
    duration: 5040,
    schedule: [
      { day: "Monday", time: "19:00-21:00" },
      { day: "Wednesday", time: "19:00-21:00" }
    ],
    topics: ["User Research", "Usability Testing", "Data Analysis", "Research Reports"],
    rating: {
      average: 4.9,
      count: 78
    },
    totalStudents: 178,
    image: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b",
    badge: "Top Rated",
    status: "published",
    enrollmentStatus: "open",
    prerequisites: ["Basic Design Knowledge"],
    learningOutcomes: [
      "Conduct user research",
      "Create research reports",
      "Make data-driven design decisions"
    ],
    students: 178,
    lastAccessed: new Date('2024-03-19')
  },
  {
    title: "Full Stack Web Development",
    description: "Comprehensive course covering both frontend and backend development",
    category: "Programming",
    level: "Intermediate",
    price: 89.99,
    instructor: "johndoe",
    duration: 8400, // 20 weeks in minutes
    schedule: [
      { day: "Tuesday", time: "18:00-20:00" },
      { day: "Friday", time: "18:00-20:00" }
    ],
    topics: ["HTML/CSS", "JavaScript", "React", "Node.js", "MongoDB", "REST APIs"],
    rating: {
      average: 4.7,
      count: 342
    },
    totalStudents: 342,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    badge: "Community Favorite",
    status: "published",
    enrollmentStatus: "open",
    prerequisites: ["Basic HTML/CSS", "JavaScript Fundamentals"],
    learningOutcomes: [
      "Build full-stack web applications",
      "Work with modern frameworks",
      "Deploy applications to the cloud"
    ],
    students: 342,
    lastAccessed: new Date('2024-03-18')
  },
  {
    title: "Data Visualization",
    description: "Master data visualization techniques using Python libraries",
    category: "Programming",
    level: "Intermediate",
    price: 69.99,
    instructor: "alicegreen",
    duration: 4200, // 10 weeks in minutes
    schedule: [
      { day: "Wednesday", time: "19:00-21:00" },
      { day: "Saturday", time: "10:00-12:00" }
    ],
    topics: ["Matplotlib", "Seaborn", "Plotly", "Dashboard Creation"],
    rating: {
      average: 4.6,
      count: 156
    },
    totalStudents: 156,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    badge: "Rising Star",
    status: "published",
    enrollmentStatus: "open",
    prerequisites: ["Basic Python", "Data Analysis Fundamentals"],
    learningOutcomes: [
      "Create interactive visualizations",
      "Build data dashboards",
      "Present data insights effectively"
    ],
    students: 156,
    lastAccessed: new Date('2024-03-17')
  }
];

// User's enrolled courses (Dashboard)
const enrolledCourses = [
  {
    userId: "johndoe",
    courseId: "Advanced Web Development",
    enrollmentDate: new Date('2024-02-15'),
    progress: 75,
    lastAccessed: new Date('2024-03-19'),
    completedModules: [
      {
        name: "Frontend Development",
        completionDate: new Date('2024-03-01'),
        score: 92
      },
      {
        name: "Backend Integration",
        completionDate: new Date('2024-03-15'),
        score: 88
      }
    ],
    certificateEarned: false,
    notes: [
      {
        module: "Frontend Development",
        content: "Remember to review React hooks",
        date: new Date('2024-03-01')
      }
    ],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    category: "Programming",
    level: "Advanced",
    price: 89.99,
    duration: 5040,
    schedule: [
      { day: "Monday", time: "18:00-20:00" },
      { day: "Wednesday", time: "18:00-20:00" }
    ],
    topics: ["React", "Node.js", "MongoDB"],
    rating: {
      average: 4.5,
      count: 120
    },
    totalStudents: 280
  },
  {
    userId: "janesmith",
    courseId: "UI/UX Design Fundamentals",
    enrollmentDate: new Date('2024-01-20'),
    progress: 100,
    lastAccessed: new Date('2024-03-18'),
    completedModules: [
      {
        name: "Design Principles",
        completionDate: new Date('2024-02-01'),
        score: 95
      },
      {
        name: "User Research",
        completionDate: new Date('2024-02-15'),
        score: 90
      },
      {
        name: "Wireframing",
        completionDate: new Date('2024-03-01'),
        score: 94
      }
    ],
    certificateEarned: true,
    certificateDetails: {
      issueDate: new Date('2024-03-15'),
      certificateId: "UIUX-2024-JS-001"
    },
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
    category: "Design",
    level: "Beginner",
    price: 69.99,
    duration: 4200,
    schedule: [
      { day: "Tuesday", time: "19:00-21:00" },
      { day: "Thursday", time: "19:00-21:00" }
    ],
    topics: ["Design Principles", "User Research", "Wireframing"],
    rating: {
      average: 4.8,
      count: 95
    },
    totalStudents: 210
  }
];

const communityPosts = [
  {
    author: "johndoe",
    title: "Best Practices for React Performance",
    content: "Here are some tips I've learned about optimizing React applications...",
    tags: ["react", "performance", "javascript"],
    category: "discussion",
    status: "active",
    createdAt: new Date('2024-03-15'),
    likes: ["janesmith", "alicegreen"],
    comments: [
      {
        author: "janesmith",
        content: "Great tips! I'd also add using React.memo for component optimization.",
        createdAt: new Date('2024-03-15T10:30:00')
      }
    ],
    attachments: [
      {
        type: "image",
        url: "https://example.com/performance-chart.png"
      }
    ]
  },
  {
    author: "alicegreen",
    title: "Looking for Study Group - Machine Learning",
    content: "I'm starting a study group for advanced machine learning concepts...",
    tags: ["machine-learning", "study-group", "python"],
    category: "question",
    status: "active",
    createdAt: new Date('2024-03-18'),
    likes: ["johndoe"],
    comments: [],
    attachments: []
  }
];

const chats = [
  {
    participants: ["johndoe", "janesmith"],
    messages: [
      {
        sender: "johndoe",
        content: "Hi Jane, I saw you're teaching a UX course. Could you tell me more about it?",
        createdAt: new Date('2024-03-15T09:00:00'),
        readBy: ["johndoe", "janesmith"],
        attachments: []
      },
      {
        sender: "janesmith",
        content: "Hi John! Sure, it's a comprehensive course covering UX principles and practical applications.",
        createdAt: new Date('2024-03-15T09:05:00'),
        readBy: ["janesmith"],
        attachments: []
      }
    ],
    unreadCounts: [
      { user: "johndoe", count: 1 },
      { user: "janesmith", count: 0 }
    ],
    status: "active",
    lastMessage: {
      sender: "janesmith",
      content: "Hi John! Sure, it's a comprehensive course covering UX principles and practical applications.",
      createdAt: new Date('2024-03-15T09:05:00'),
      readBy: ["janesmith"]
    }
  }
];

const notifications = [
  {
    recipient: "johndoe",
    type: "course_update",
    title: "New Module Available",
    message: "The Backend Integration module is now available in your Web Development course",
    read: false,
    actionUrl: "/dashboard/courses/web-dev/modules",
    priority: "high",
    createdAt: new Date('2024-03-19T10:00:00'),
    metadata: {
      courseId: "Advanced Web Development",
      moduleId: "backend-integration"
    }
  },
  {
    recipient: "janesmith",
    type: "achievement_earned",
    title: "Certificate Earned!",
    message: "Congratulations! You've earned the UI/UX Design Fundamentals certificate",
    read: true,
    actionUrl: "/dashboard/certificates",
    priority: "high",
    createdAt: new Date('2024-03-15T15:00:00'),
    metadata: {
      courseId: "UI/UX Design Fundamentals",
      certificateId: "UIUX-2024-JS-001"
    }
  },
  {
    recipient: "alicegreen",
    type: "community_mention",
    title: "Mentioned in Post",
    message: "John Doe mentioned you in a discussion about React Performance",
    read: false,
    actionUrl: "/community/posts/1",
    priority: "medium",
    createdAt: new Date('2024-03-15T11:00:00'),
    metadata: {
      postId: 1,
      authorId: "johndoe"
    }
  }
];

const matches = [
  {
    teacherId: 'johndoe',
    learnerId: 'janesmith',
    status: 'completed',
    skillToTeach: 'React',
    skillToLearn: 'UI Design',
    teacherExperience: {
      years: 3,
      proficiencyLevel: 'Advanced',
      description: 'Extensive experience with React and modern web development'
    },
    learnerGoals: {
      targetLevel: 'Beginner',
      timeCommitment: '5 hours per week',
      description: 'Want to learn React basics and build simple applications'
    },
    schedule: [
      { 
        day: 'Monday',
        startTime: '18:00',
        endTime: '20:00'
      }
    ],
    preferredLocation: 'Online',
    messages: [],
    createdAt: new Date('2024-02-01'),
    lastActive: new Date('2024-02-15'),
    rating: 5,
    feedback: 'Great learning experience'
  },
  {
    teacherId: 'janesmith',
    learnerId: 'johndoe',
    status: 'completed',
    skillToTeach: 'UI Design',
    skillToLearn: 'React',
    teacherExperience: {
      years: 6,
      proficiencyLevel: 'Expert',
      description: 'Professional UX designer with extensive teaching experience'
    },
    learnerGoals: {
      targetLevel: 'Intermediate',
      timeCommitment: '4 hours per week',
      description: 'Want to improve UI design skills for web applications'
    },
    schedule: [
      {
        day: 'Wednesday',
        startTime: '19:00',
        endTime: '21:00'
      }
    ],
    preferredLocation: 'Online',
    messages: [],
    createdAt: new Date('2024-03-01'),
    lastActive: new Date('2024-03-10'),
    rating: 4,
    feedback: 'Very helpful mentor'
  }
];

const reviews = [
  {
    reviewerId: 'janesmith',
    receiverId: 'johndoe',
    matchId: 0, // Will be replaced with actual match ID in seeding script
    rating: 5,
    feedback: 'Excellent teacher, very patient and knowledgeable',
    skillTaught: 'React',
    createdAt: new Date('2024-02-15')
  },
  {
    reviewerId: 'johndoe',
    receiverId: 'janesmith',
    matchId: 1, // Will be replaced with actual match ID in seeding script
    rating: 4,
    feedback: 'Great design mentor, helped me understand UX principles clearly',
    skillTaught: 'UI Design',
    createdAt: new Date('2024-03-10')
  }
];

const dashboardData = {
  'johndoe': {
    coursesInProgress: 2,
    completedCourses: 1,
    hoursLearned: 45,
    achievementPoints: 320,
    enrolledCourses: [
      {
        courseId: "Advanced Web Development",
        title: "Advanced Web Development",
        progress: 75,
        lastAccessed: new Date('2024-03-19'),
        startDate: new Date('2024-02-15'),
        completedModules: [
          {
            name: "Frontend Development",
            completionDate: new Date('2024-03-01'),
            score: 92
          },
          {
            name: "Backend Integration",
            completionDate: new Date('2024-03-15'),
            score: 88
          }
        ],
        nextLesson: "API Security",
        totalLessons: 24,
        completedLessons: 18,
        instructor: "janesmith",
        thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
      },
      {
        courseId: "Data Structures & Algorithms",
        title: "Data Structures & Algorithms",
        progress: 45,
        lastAccessed: new Date('2024-03-20'),
        startDate: new Date('2024-03-01'),
        completedModules: [
          {
            name: "Arrays and Strings",
            completionDate: new Date('2024-03-10'),
            score: 95
          }
        ],
        nextLesson: "Hash Tables",
        totalLessons: 20,
        completedLessons: 9,
        instructor: "alicegreen",
        thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904"
      }
    ],
    achievements: [
      {
        id: "fast-learner",
        name: "Fast Learner",
        description: "Completed 5 lessons in one day",
        dateEarned: new Date('2024-03-15'),
        points: 50,
        icon: "🚀"
      },
      {
        id: "perfect-score",
        name: "Perfect Score",
        description: "Achieved 100% in a module quiz",
        dateEarned: new Date('2024-03-10'),
        points: 100,
        icon: "⭐"
      },
      {
        id: "consistent-learner",
        name: "Consistent Learner",
        description: "Logged in for 7 consecutive days",
        dateEarned: new Date('2024-03-18'),
        points: 70,
        icon: "📚"
      }
    ],
    recentActivity: [
      {
        type: "course_progress",
        description: "Completed Backend Integration module",
        timestamp: new Date('2024-03-15'),
        course: "Advanced Web Development"
      },
      {
        type: "achievement",
        description: "Earned Consistent Learner badge",
        timestamp: new Date('2024-03-18')
      },
      {
        type: "quiz_completion",
        description: "Scored 95% in Arrays and Strings quiz",
        timestamp: new Date('2024-03-10'),
        course: "Data Structures & Algorithms"
      }
    ]
  },
  'janesmith': {
    coursesInProgress: 1,
    completedCourses: 0,
    hoursLearned: 62,
    achievementPoints: 450,
    enrolledCourses: [
      {
        title: "Neural Networks Fundamentals",
        progress: 35,
        lastAccessed: new Date('2024-03-20'),
        startDate: new Date('2024-02-01'),
        completedModules: [
          {
            name: "Neural Networks",
            completionDate: new Date('2024-05-12'),
            score: 95
          }
        ],
        nextLesson: "Deep Learning Basics",
        totalLessons: 20,
        completedLessons: 7,
        instructor: "alicegreen",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
        thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485"
      }
    ],
    achievements: [
      {
        id: "course-creator",
        name: "Created first course with high rating",
        description: "Successfully created and maintained a highly-rated course",
        dateEarned: new Date('2024-03-01'),
        points: 150,
        icon: "🏆"
      },
      {
        id: "helpful-mentor",
        name: "Helped 10 students in discussion forum",
        description: "Actively participated in helping other students learn",
        dateEarned: new Date('2024-03-10'),
        points: 200,
        icon: "🏆"
      },
      {
        id: "top-rated",
        name: "Maintained 4.8+ rating for 3 months",
        description: "Consistently provided high-quality teaching",
        dateEarned: new Date('2024-03-15'),
        points: 100,
        icon: "🏆"
      }
    ],
    recentActivity: [
      {
        type: "course_progress",
        course: "Neural Networks Fundamentals",
        description: "Completed Neural Networks module",
        timestamp: new Date('2024-05-12')
      }
    ]
  },
  'alicegreen': {
    coursesInProgress: 1,
    completedCourses: 3,
    hoursLearned: 85,
    achievementPoints: 580,
    enrolledCourses: [
      {
        courseId: "JavaScript Mastery",
        title: "JavaScript Mastery",
        progress: 60,
        lastAccessed: new Date('2024-03-20'),
        startDate: new Date('2024-02-15'),
        completedModules: [
          {
            name: "ES6+ Features",
            completionDate: new Date('2024-03-01'),
            score: 96
          },
          {
            name: "Async Programming",
            completionDate: new Date('2024-03-15'),
            score: 90
          }
        ],
        nextLesson: "Advanced Design Patterns",
        totalLessons: 25,
        completedLessons: 15,
        instructor: "johndoe",
        thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a"
      }
    ],
    achievements: [
      {
        id: "master-mentor",
        name: "Master Mentor",
        description: "Helped 50 students achieve their goals",
        dateEarned: new Date('2024-03-10'),
        points: 250,
        icon: "🎓"
      },
      {
        id: "course-excellence",
        name: "Course Excellence",
        description: "Created 3 highly-rated courses",
        dateEarned: new Date('2024-02-28'),
        points: 200,
        icon: "🏆"
      },
      {
        id: "community-leader",
        name: "Community Leader",
        description: "Most helpful community member",
        dateEarned: new Date('2024-03-15'),
        points: 130,
        icon: "🌟"
      }
    ],
    recentActivity: [
      {
        type: "course_progress",
        description: "Completed Async Programming module",
        timestamp: new Date('2024-03-15'),
        course: "JavaScript Mastery"
      },
      {
        type: "achievement",
        description: "Earned Community Leader badge",
        timestamp: new Date('2024-03-15')
      },
      {
        type: "teaching",
        description: "Created new Python course",
        timestamp: new Date('2024-03-18')
      }
    ]
  }
};

module.exports = {
  users,
  courses: [...availableCourses, ...enrolledCourses.map(enrolled => ({
    title: enrolled.courseId,
    description: `Course for ${enrolled.courseId}`,
    category: enrolled.category,
    level: enrolled.level,
    price: enrolled.price,
    instructor: enrolled.userId,
    duration: enrolled.duration,
    status: "published",
    image: enrolled.image,
    schedule: enrolled.schedule,
    topics: enrolled.topics,
    rating: enrolled.rating,
    totalStudents: enrolled.totalStudents,
    students: enrolled.totalStudents,
    progress: enrolled.progress,
    enrollmentStatus: enrolled.certificateEarned ? "completed" : "in-progress",
    lastAccessed: enrolled.lastAccessed,
    badge: enrolled.certificateEarned ? "Top Rated" : null
  }))],
  communityPosts,
  chats,
  notifications,
  skills,
  matches,
  reviews,
  dashboardData
}; 
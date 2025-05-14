const mongoose = require('mongoose');
const { users, courses, communityPosts, chats, notifications, skills, matches, reviews, dashboardData } = require('../seeders/dummyData');
const User = require('../models/User');
const Course = require('../models/Course');
const CommunityPost = require('../models/CommunityPost');
const Chat = require('../models/Chat');
const Notification = require('../models/Notification');
const Skill = require('../models/Skill');
const Match = require('../models/Match');
const Review = require('../models/Review');
const Dashboard = require('../models/Dashboard');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Review.deleteMany({}),
      Skill.deleteMany({}),
      Match.deleteMany({}),
      Dashboard.deleteMany({}),
      CommunityPost.deleteMany({}),
      Chat.deleteMany({}),
      Notification.deleteMany({})
    ]);

    console.log('Cleared existing data');

    // Insert users first
    const createdUsers = await User.create(users);
    console.log('Created users:', createdUsers.length);

    // Map username to _id
    const userMap = createdUsers.reduce((map, user) => {
      map[user.username] = user._id;
      return map;
    }, {});

    // Assign skills to users
    const skillsWithUser = skills.map(skill => ({
      ...skill,
      user: userMap[skill.user]
    }));

    // Insert skills with user reference
    const createdSkills = await Skill.create(skillsWithUser);
    console.log('Created skills:', createdSkills.length);

    // Map skill names to their IDs
    const skillMap = createdSkills.reduce((map, skill) => {
      map[skill.name] = skill._id;
      return map;
    }, {});

    // Update users' possessed and required skills with actual skill IDs
    const userUpdates = createdUsers.map(user => {
      const updatedUser = {
        possessedSkills: user.possessedSkills.map(skill => ({
          ...skill,
          skillId: skillMap[skill.name]
        })),
        requiredSkills: user.requiredSkills.map(skill => ({
          ...skill,
          skillId: skillMap[skill.name]
        }))
      };
      return User.findByIdAndUpdate(user._id, updatedUser, { new: true });
    });

    await Promise.all(userUpdates);
    console.log('Updated users with skill references');

    // Update courses with actual user IDs
    const coursesWithIds = courses.map(course => ({
      ...course,
      instructor: userMap[course.instructor]
    }));

    // Insert courses
    const createdCourses = await Course.create(coursesWithIds);
    console.log('Created courses:', createdCourses.length);

    // Create a map of course titles to IDs
    const courseMap = createdCourses.reduce((map, course) => {
      map[course.title] = course._id;
      return map;
    }, {});

    // Update matches with actual user IDs
    const matchesWithIds = matches.map(match => ({
      ...match,
      teacherId: userMap[match.teacherId],
      learnerId: userMap[match.learnerId]
    }));

    // Insert matches
    const createdMatches = await Match.create(matchesWithIds);
    console.log('Created matches:', createdMatches.length);

    // Update reviews with actual user and match IDs
    const reviewsWithIds = reviews.map((review, index) => ({
      ...review,
      reviewerId: userMap[review.reviewerId],
      receiverId: userMap[review.receiverId],
      matchId: createdMatches[review.matchId]._id
    }));

    // Insert reviews
    const createdReviews = await Review.create(reviewsWithIds);
    console.log('Created reviews:', createdReviews.length);

    // Create dashboard data for each user
    const dashboardEntries = Object.entries(dashboardData).map(([username, data]) => ({
      user: userMap[username],
      enrolledCourses: data.enrolledCourses.map(course => ({
        course: courseMap[course.title],
        courseName: course.title,
        image: course.thumbnail || course.image,
        instructor: {
          name: createdUsers.find(u => u.username === course.instructor)?.name || '',
          avatar: createdUsers.find(u => u.username === course.instructor)?.avatar || ''
        },
        progress: course.progress || 0,
        completed: course.progress === 100,
        lastAccessedAt: course.lastAccessed || new Date()
      })),
      achievements: data.achievements.map(achievement => ({
        _id: achievement.id,
        title: achievement.name,
        description: achievement.description,
        points: achievement.points || 10,
        earnedAt: achievement.dateEarned || new Date()
      })),
      stats: {
        totalHoursLearned: data.hoursLearned || 0,
        achievementPoints: data.achievementPoints || 0
      },
      recentActivity: data.recentActivity.map(activity => ({
        type: activity.type === 'quiz_completion' ? 'quiz_completed' : 
              activity.type === 'achievement' ? 'achievement_earned' : activity.type,
        course: courseMap[activity.course],
        description: activity.description,
        timestamp: new Date()
      })).filter(activity => activity.type && 
                            ['course_progress', 'achievement_earned', 'course_completed', 
                             'quiz_completed', 'achievement_unlocked'].includes(activity.type))
    }));

    // Insert dashboard data
    const createdDashboards = await Dashboard.create(dashboardEntries);
    console.log('Created dashboard data:', createdDashboards.length);

    // Create notifications
    const notificationEntries = notifications.map(notification => ({
      ...notification,
      recipient: userMap[notification.recipient]
    }));
    const createdNotifications = await Notification.create(notificationEntries);
    console.log('Created notifications:', createdNotifications.length);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
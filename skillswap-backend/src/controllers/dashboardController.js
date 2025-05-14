const User = require('../models/User');
const Course = require('../models/Course');
const Dashboard = require('../models/Dashboard');

exports.getDashboardData = async (req, res) => {
    try {
        let dashboard = await Dashboard.findOne({ user: req.user._id })
            .populate('enrolledCourses.course')
            .populate('recentActivity.course');

        // If dashboard doesn't exist, create a default one
        if (!dashboard) {
            console.log('Creating default dashboard for user:', req.user._id);
            dashboard = new Dashboard({
                user: req.user._id,
                enrolledCourses: [],
                achievements: [],
                stats: {
                    totalHoursLearned: 0,
                    achievementPoints: 0
                },
                recentActivity: []
            });
            await dashboard.save();
        }

        const dashboardData = {
            coursesInProgress: dashboard.enrolledCourses.filter(c => !c.completed).length,
            completedCourses: dashboard.enrolledCourses.filter(c => c.completed).length,
            hoursLearned: dashboard.stats.totalHoursLearned,
            achievementPoints: dashboard.stats.achievementPoints,
            enrolledCourses: dashboard.enrolledCourses || [],
            achievements: dashboard.achievements || [],
            recentActivity: dashboard.recentActivity || []
        };

        res.json(dashboardData);
    } catch (error) {
        console.error('Error in getDashboardData:', error);
        res.status(500).json({ 
            message: 'Error fetching dashboard data', 
            error: error.message 
        });
    }
};

exports.getEnrolledCourses = async (req, res) => {
    try {
        const dashboard = await Dashboard.findOne({ user: req.user._id })
            .populate({
                path: 'enrolledCourses.course',
                populate: {
                    path: 'instructor',
                    select: 'username profilePicture'
                }
            });

        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        const enrolledCourses = dashboard.enrolledCourses.map(enrollment => ({
            id: enrollment.course._id,
            title: enrollment.course.title,
            instructor: enrollment.course.instructor.username,
            image: enrollment.course.image,
            progress: enrollment.progress,
            lastAccessed: enrollment.lastAccessedAt,
            certificateEarned: enrollment.completed
        }));

        res.json(enrolledCourses);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching enrolled courses', 
            error: error.message 
        });
    }
};

exports.getAchievements = async (req, res) => {
    try {
        const dashboard = await Dashboard.findOne({ user: req.user._id })
            .select('achievements');

        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        res.json(dashboard.achievements);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching achievements', 
            error: error.message 
        });
    }
};

exports.getProgress = async (req, res) => {
    try {
        const dashboard = await Dashboard.findOne({ user: req.user._id })
            .populate('enrolledCourses.course');

        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        // Calculate progress by category
        const progressByCategory = {};
        dashboard.enrolledCourses.forEach(enrollment => {
            const category = enrollment.course.category;
            if (!progressByCategory[category]) {
                progressByCategory[category] = {
                    total: 0,
                    count: 0
                };
            }
            progressByCategory[category].total += enrollment.progress;
            progressByCategory[category].count += 1;
        });

        // Average out category progress
        Object.keys(progressByCategory).forEach(category => {
            progressByCategory[category] = 
                progressByCategory[category].total / progressByCategory[category].count;
        });

        const progress = {
            overall: dashboard.enrolledCourses.reduce((acc, curr) => acc + curr.progress, 0) / 
                    (dashboard.enrolledCourses.length || 1),
            byCategory: progressByCategory,
            recentActivity: dashboard.recentActivity
        };

        res.json(progress);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching progress data', 
            error: error.message 
        });
    }
}; 
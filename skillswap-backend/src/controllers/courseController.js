const Course = require('../models/Course');
const User = require('../models/User');

// Create a new course
exports.createCourse = async (req, res) => {
    try {
        const course = new Course({
            ...req.body,
            instructor: req.user._id
        });
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ message: 'Error creating course', error: error.message });
    }
};

// Get all courses with filters
exports.getCourses = async (req, res) => {
    try {
        const { category, level, minPrice, maxPrice, search, featured } = req.query;
        const query = { status: 'published' };

        if (category) query.category = category;
        if (level) query.level = level;
        if (featured) query.featured = featured === 'true';
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        const courses = await Course.find(query)
            .populate('instructor', 'username profilePicture')
            .sort({ createdAt: -1 });

        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
};

// Get a specific course
exports.getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'username profilePicture bio')
            .populate('reviews.user', 'username profilePicture');

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching course', error: error.message });
    }
};

// Update a course
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findOne({ _id: req.params.id, instructor: req.user._id });

        if (!course) {
            return res.status(404).json({ message: 'Course not found or unauthorized' });
        }

        Object.assign(course, req.body);
        course.lastUpdated = Date.now();
        await course.save();

        res.json(course);
    } catch (error) {
        res.status(400).json({ message: 'Error updating course', error: error.message });
    }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findOneAndDelete({ _id: req.params.id, instructor: req.user._id });

        if (!course) {
            return res.status(404).json({ message: 'Course not found or unauthorized' });
        }

        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting course', error: error.message });
    }
};

// Enroll in a course
exports.enrollCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const user = await User.findById(req.user._id);
        const isEnrolled = user.enrolledCourses.some(
            enrollment => enrollment.course.toString() === course._id.toString()
        );

        if (isEnrolled) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        user.enrolledCourses.push({
            course: course._id,
            enrollmentDate: Date.now()
        });

        course.enrollments += 1;
        
        await Promise.all([user.save(), course.save()]);

        res.json({ message: 'Successfully enrolled in course' });
    } catch (error) {
        res.status(500).json({ message: 'Error enrolling in course', error: error.message });
    }
};

// Add a review to a course
exports.addReview = async (req, res) => {
    try {
        const { rating, review } = req.body;
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is enrolled in the course
        const user = await User.findById(req.user._id);
        const isEnrolled = user.enrolledCourses.some(
            enrollment => enrollment.course.toString() === course._id.toString()
        );

        if (!isEnrolled) {
            return res.status(403).json({ message: 'Must be enrolled to review course' });
        }

        // Check if user has already reviewed
        const hasReviewed = course.reviews.some(
            r => r.user.toString() === req.user._id.toString()
        );

        if (hasReviewed) {
            return res.status(400).json({ message: 'You have already reviewed this course' });
        }

        course.reviews.push({
            user: req.user._id,
            rating,
            review
        });

        await course.updateRating();
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error adding review', error: error.message });
    }
};

// Update course progress
exports.updateProgress = async (req, res) => {
    try {
        const { progress } = req.body;
        const user = await User.findById(req.user._id);
        const courseEnrollment = user.enrolledCourses.find(
            enrollment => enrollment.course.toString() === req.params.id
        );

        if (!courseEnrollment) {
            return res.status(404).json({ message: 'Course enrollment not found' });
        }

        courseEnrollment.progress = progress;
        courseEnrollment.completed = progress === 100;
        await user.save();

        res.json({ message: 'Progress updated successfully', progress });
    } catch (error) {
        res.status(500).json({ message: 'Error updating progress', error: error.message });
    }
}; 
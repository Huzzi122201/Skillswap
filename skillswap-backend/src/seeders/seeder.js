const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { users, skills, matches, reviews, dashboardData } = require('./dummyData');
const User = require('../models/User');
const Skill = require('../models/Skill');
const Match = require('../models/Match');
const Review = require('../models/Review');
const Dashboard = require('../models/Dashboard');

const seedDatabase = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Skill.deleteMany({});
        await Match.deleteMany({});
        await Review.deleteMany({});
        await Dashboard.deleteMany({});

        console.log('Previous data cleared');

        // First, create skills and store them by name
        const skillsMap = new Map();
        for (const skillData of skills) {
            const skill = new Skill({
                name: skillData.name,
                category: skillData.category,
                description: skillData.description,
                proficiencyLevel: skillData.proficiencyLevel,
                teachingMethod: skillData.teachingMethod,
                active: skillData.active
                // Don't set user yet
            });
            const savedSkill = await skill.save();
            skillsMap.set(skillData.name, savedSkill);
            console.log(`Created skill: ${skillData.name}`);
        }

        console.log('Skills created');

        // Create users and link skills
        for (const userData of users) {
            // Hash password
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            // Map possessed skills
            const possessedSkills = userData.possessedSkills.map(skillData => {
                const skillDoc = skillsMap.get(skillData.name);
                if (!skillDoc) {
                    console.error(`Skill not found: ${skillData.name}`);
                    return null;
                }
                return {
                    skill: skillDoc._id,
                    proficiencyLevel: skillData.proficiencyLevel,
                    yearsOfExperience: skillData.yearsOfExperience,
                    availability: skillData.availability || []
                };
            }).filter(Boolean);

            // Map required skills
            const requiredSkills = userData.requiredSkills.map(skillData => {
                const skillDoc = skillsMap.get(skillData.name);
                if (!skillDoc) {
                    console.error(`Skill not found: ${skillData.name}`);
                    return null;
                }
                return {
                    skill: skillDoc._id,
                    desiredLevel: skillData.desiredLevel,
                    preferredLearningMethod: skillData.preferredLearningMethod
                };
            }).filter(Boolean);

            // Create user
            const user = new User({
                username: userData.username,
                email: userData.email,
                password: hashedPassword,
                name: userData.name,
                title: userData.title,
                bio: userData.bio,
                location: userData.location,
                avatar: userData.avatar,
                role: userData.role,
                isVerified: userData.isVerified,
                joinDate: userData.joinDate,
                lastActive: userData.lastActive,
                preferences: userData.preferences,
                possessedSkills,
                requiredSkills,
                rating: userData.rating,
                reviews: userData.reviews,
                certifications: userData.certifications
            });

            const savedUser = await user.save();
            console.log(`Created user: ${userData.username}`);

            // Update skills with user reference
            for (const skillData of skills) {
                if (skillData.user === userData.username) {
                    const skill = skillsMap.get(skillData.name);
                    if (skill) {
                        skill.user = savedUser._id;
                        await skill.save();
                        console.log(`Linked skill ${skillData.name} to user ${userData.username}`);
                    }
                }
            }
        }

        console.log('Users created and skills linked');

        // Create matches
        for (const matchData of matches) {
            const match = new Match(matchData);
            await match.save();
        }

        console.log('Matches created');

        // Create reviews
        for (const reviewData of reviews) {
            const review = new Review(reviewData);
            await review.save();
        }

        console.log('Reviews created');

        // Create dashboards
        for (const [username, data] of Object.entries(dashboardData)) {
            const dashboard = new Dashboard(data);
            await dashboard.save();
        }

        console.log('Dashboards created');
        console.log('Database seeding completed successfully');

    } catch (error) {
        console.error('Error seeding database:', error);
        throw error; // Re-throw to see the full error stack
    }
};

module.exports = seedDatabase; 
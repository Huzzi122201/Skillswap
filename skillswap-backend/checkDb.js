const mongoose = require('mongoose');
const Chat = require('./src/models/Chat');
const Notification = require('./src/models/Notification');

mongoose.connect('mongodb://localhost:27017/skillswap', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    const notificationCount = await Notification.countDocuments();
    const chatCount = await Chat.countDocuments();
    
    console.log(`Number of notifications: ${notificationCount}`);
    console.log(`Number of chats: ${chatCount}`);

    // Get a sample of notifications
    const notifications = await Notification.find().limit(1);
    console.log('\nSample notification:', JSON.stringify(notifications[0], null, 2));

    // Get a sample of chats
    const chats = await Chat.find().limit(1);
    console.log('\nSample chat:', JSON.stringify(chats[0], null, 2));

  } catch (error) {
    console.error('Error checking collections:', error);
  }
  
  mongoose.connection.close();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
}); 
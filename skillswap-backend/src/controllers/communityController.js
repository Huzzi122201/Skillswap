const CommunityPost = require('../models/CommunityPost');
const Notification = require('../models/Notification');

// Get all posts with pagination and filters
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const tag = req.query.tag;
    const search = req.query.search;

    const query = {};
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await CommunityPost.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'name avatar')
      .populate('comments.author', 'name avatar');

    const total = await CommunityPost.countDocuments(query);

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const post = new CommunityPost({
      ...req.body,
      author: req.user._id
    });

    await post.save();
    await post.populate('author', 'name avatar');

    // Notify mentioned users
    if (req.body.mentions && req.body.mentions.length > 0) {
      const notifications = req.body.mentions.map(userId => ({
        recipient: userId,
        type: 'community_mention',
        title: 'You were mentioned in a post',
        message: `${req.user.name} mentioned you in a post: "${post.title}"`,
        actionUrl: `/community/post/${post._id}`,
        metadata: { postId: post._id }
      }));

      await Notification.insertMany(notifications);
    }

    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single post by ID
exports.getPost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('comments.author', 'name avatar')
      .populate('likes', 'name avatar');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(post, req.body);
    await post.save();
    await post.populate('author', 'name avatar');

    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.remove();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      author: req.user._id,
      content: req.body.content
    };

    post.comments.push(comment);
    await post.save();
    await post.populate('comments.author', 'name avatar');

    // Notify post author of new comment
    if (post.author.toString() !== req.user._id.toString()) {
      await Notification.createNotification({
        recipient: post.author,
        type: 'post_comment',
        title: 'New comment on your post',
        message: `${req.user.name} commented on your post: "${post.title}"`,
        actionUrl: `/community/post/${post._id}`,
        metadata: { postId: post._id, commentId: post.comments[post.comments.length - 1]._id }
      });
    }

    res.json(post.comments[post.comments.length - 1]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Toggle like on a post
exports.toggleLike = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userLikeIndex = post.likes.indexOf(req.user._id);
    if (userLikeIndex === -1) {
      post.likes.push(req.user._id);
      
      // Notify post author of new like
      if (post.author.toString() !== req.user._id.toString()) {
        await Notification.createNotification({
          recipient: post.author,
          type: 'post_like',
          title: 'Someone liked your post',
          message: `${req.user.name} liked your post: "${post.title}"`,
          actionUrl: `/community/post/${post._id}`,
          metadata: { postId: post._id }
        });
      }
    } else {
      post.likes.splice(userLikeIndex, 1);
    }

    await post.save();
    res.json({ likes: post.likes.length, isLiked: userLikeIndex === -1 });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 
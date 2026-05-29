const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');

// Create new submission
router.post('/', async (req, res) => {
  try {
    const { name, score, file, fileType, isAdminPost = false } = req.body;

    if (!name || score === undefined || !file) {
      return res.status(400).json({
        success: false,
        message: 'Name, score, and file are required'
      });
    }

    const submission = new Submission({
      name,
      score: parseInt(score),
      file: {
        url: file,
        fileType: fileType || 'unknown',
        publicId: null
      },
      isAdminPost,
      ipAddress: req.ip
    });

    await submission.save();

    res.status(201).json({
      success: true,
      message: 'Submission received successfully',
      data: submission
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating submission',
      error: error.message
    });
  }
});

// Get all submissions (public - limited info)
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const submissions = await Submission.find({ isAdminPost: { $ne: true } })
      .select('name score createdAt status file isAdminPost')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Submission.countDocuments();

    res.json({
      success: true,
      data: submissions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions',
      error: error.message
    });
  }
});

// Get admin image posts for the leaderboard feed
router.get('/posts', async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const posts = await Submission.find({
      isAdminPost: true,
      'file.fileType': { $regex: '^image/' }
    })
      .select('name score createdAt file isAdminPost')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin posts',
      error: error.message
    });
  }
});

module.exports = router;

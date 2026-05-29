const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Submission = require('../models/Submission');
const authMiddleware = require('../middleware/auth');

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    let admin = await Admin.findOne({ email });

    // If no admin exists, create default admin
    if (!admin && email === process.env.ADMIN_EMAIL) {
      admin = new Admin({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        name: 'Admin'
      });
      await admin.save();
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
});

// Get all submissions (admin)
router.get('/submissions', authMiddleware, async (req, res) => {
  try {
    const { status, search, limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    const submissions = await Submission.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Submission.countDocuments(filter);

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

// Get single submission
router.get('/submissions/:id', authMiddleware, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.json({
      success: true,
      data: submission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching submission',
      error: error.message
    });
  }
});

// Update submission
router.put('/submissions/:id', authMiddleware, async (req, res) => {
  try {
    const { name, score, notes } = req.body;

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      {
        name,
        score,
        notes,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.json({
      success: true,
      message: 'Submission updated successfully',
      data: submission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating submission',
      error: error.message
    });
  }
});

// Delete submission
router.delete('/submissions/:id', authMiddleware, async (req, res) => {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting submission',
      error: error.message
    });
  }
});

// Export to Excel
router.get('/export/excel', authMiddleware, async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });

    // Excel file generation
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Submissions');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Score', key: 'score', width: 10 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Created', key: 'createdAt', width: 15 },
      { header: 'Notes', key: 'notes', width: 30 }
    ];

    submissions.forEach(sub => {
      worksheet.addRow({
        name: sub.name,
        score: sub.score,
        status: sub.status,
        createdAt: new Date(sub.createdAt).toLocaleDateString(),
        notes: sub.notes || ''
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=submissions.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error exporting to Excel',
      error: error.message
    });
  }
});

// Dashboard stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const total = await Submission.countDocuments();
    const approved = await Submission.countDocuments({ status: 'approved' });

    res.json({
      success: true,
      data: {
        total,
        approved
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
});

module.exports = router;

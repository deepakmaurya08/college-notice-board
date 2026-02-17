import express from 'express';
import Notice from '../models/Notice.js';
import { protect, adminOnly, adminOrFaculty } from '../middleware/auth.js';

const router = express.Router();

// GET /api/notices - Public, with optional search and category filter
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = category;
    }

    const notices = await Notice.find(filter)
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

// POST /api/notices - Admin or Faculty
router.post('/', protect, adminOrFaculty, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content and category are required.' });
    }

    const notice = await Notice.create({
      title,
      content,
      category,
      postedBy: req.user._id
    });

    const populated = await Notice.findById(notice._id).populate('postedBy', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

// DELETE /api/notices/:id - Admin or Faculty
router.delete('/:id', protect, adminOrFaculty, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found.' });
    }

    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notice deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

export default router;

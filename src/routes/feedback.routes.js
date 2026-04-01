const express = require('express');
const router = express.Router();
const { submitFeedback,getFeedbackByHostelId } = require('../controllers/feedback.controller');
const { verifyJWT } = require('../middlewares/auth.middleware');

router.post('/hostel/:id/feedback', verifyJWT, submitFeedback);
router.get('/hostel/:id/feedback', getFeedbackByHostelId);


module.exports = router;
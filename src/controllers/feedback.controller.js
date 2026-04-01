  const { Hostel } = require('../models/hostel.model');
  // const { Review } = require('../models/review.model'); // Uncomment if using Review model

  const submitFeedback = async (req, res) => {
    try {
      const { id: hostelId } = req.params;
      const { ratings, recommended, comment } = req.body;
      const userId = req.user.id;
      const userName = `${req.user.firstName} ${req.user.lastName}`;

      const hostel = await Hostel.findById(hostelId);
      if (!hostel) {
        return res.status(404).json({ error: 'Hostel not found' });
      }

      const alreadyReviewed = hostel.feedback.find(
        (entry) => entry.userId.toString() === userId
      );

      if (alreadyReviewed) {
        return res.status(400).json({ error: 'You have already submitted feedback for this hostel.' });
      }

      const feedbackEntry = {
        userId,
        userName,
        recommended,
        ratings,
        comment,
      };

      hostel.feedback.push(feedbackEntry);
      hostel.totalReviews = hostel.feedback.length;

      const totalRating = hostel.feedback.reduce((acc, item) => acc + Number(item.ratings), 0);
      hostel.averageRating = (totalRating / hostel.totalReviews).toFixed(1); // e.g., "4.5"


      await hostel.save();

      // Optionally store in Review collection
      // await Review.create({ userId, hostelId, userName, recommended, ratings, comment });

      res.status(200).json({ message: 'Feedback submitted successfully', feedback: feedbackEntry });
    } catch (err) {
      console.error('Feedback error:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  };

const getFeedbackByHostelId = async (req, res) => {
  try {
    const { id: hostelId } = req.params;

    const hostel = await Hostel.findById(hostelId);

    if (!hostel) {
      return res.status(404).json({ error: 'Hostel not found' });
    }

    // Return the feedback array
    res.status(200).json({
      totalReviews: hostel.totalReviews || 0,
      averageRating: hostel.averageRating || 0,
      feedback: hostel.feedback || [],
    });
  } catch (err) {
    console.error('Error fetching feedback:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
module.exports = {
  submitFeedback,getFeedbackByHostelId
};
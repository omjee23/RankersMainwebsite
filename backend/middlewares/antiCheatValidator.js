const { collections } = require('../config/db');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Validate that an ongoing exam session belongs to the user and is still within time limits
 */
function antiCheatExamValidator(req, res, next) {
  const { submissionId } = req.body;
  const studentId = req.user ? req.user.id : null;

  if (!submissionId) {
    return errorResponse(res, 'Exam session ID is required', 400);
  }

  const submission = collections.examSubmissions.findById(submissionId);
  if (!submission) {
    return errorResponse(res, 'Active exam session not found', 404);
  }

  if (submission.studentId !== studentId) {
    return errorResponse(res, 'Unauthorized access to this examination session', 403);
  }

  if (submission.status === 'SUBMITTED') {
    return errorResponse(res, 'This exam has already been submitted and completed', 400);
  }

  // Calculate elapsed server time
  const startTime = new Date(submission.startedAt).getTime();
  const allowedDurationMs = (submission.durationMinutes + 5) * 60 * 1000; // 5 min grace for network jitter
  const now = Date.now();

  if (now - startTime > allowedDurationMs) {
    // Force auto-submit
    collections.examSubmissions.findByIdAndUpdate(submissionId, {
      status: 'SUBMITTED',
      autoSubmittedByServer: true,
      submittedAt: new Date().toISOString()
    });
    return errorResponse(res, 'Time limit exceeded. Your exam has been automatically submitted.', 400);
  }

  req.activeSubmission = submission;
  next();
}

module.exports = {
  antiCheatExamValidator
};

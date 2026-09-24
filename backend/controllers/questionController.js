const { collections } = require('../config/db');
const { csvToJson } = require('../utils/excelParser');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const fs = require('fs');

/**
 * Create a single question
 */
async function createQuestion(req, res, next) {
  try {
    const { subject, topic, questionText, options, correctOption, explanation, classLevel, stream } = req.body;

    if (!subject || !questionText || !options || options.length < 2 || correctOption === undefined) {
      return errorResponse(res, 'Please provide subject, questionText, at least 2 options, and correctOption index.', 400);
    }

    const question = collections.questions.create({
      subject,
      topic: topic || 'General',
      questionText,
      options,
      correctOption: Number(correctOption),
      explanation: explanation || '',
      classLevel: classLevel || 'Class 11',
      stream: stream || 'NEET'
    });

    return successResponse(res, 'Question added successfully', question, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * Get all questions with optional filters
 */
async function getQuestions(req, res, next) {
  try {
    const { subject, classLevel, stream } = req.query;
    let questions = collections.questions.find();

    if (subject) questions = questions.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
    if (classLevel) questions = questions.filter(q => q.classLevel === classLevel);
    if (stream) questions = questions.filter(q => q.stream === stream);

    return successResponse(res, 'Questions retrieved', questions);
  } catch (err) {
    next(err);
  }
}

/**
 * Bulk upload questions through CSV file
 */
async function bulkUploadCSV(req, res, next) {
  try {
    if (!req.file) {
      return errorResponse(res, 'CSV file is required', 400);
    }

    const fileContent = fs.readFileSync(req.file.path, 'utf-8');
    const parsedRows = csvToJson(fileContent);

    if (parsedRows.length === 0) {
      return errorResponse(res, 'Uploaded CSV is empty or formatted incorrectly', 400);
    }

    let insertedCount = 0;
    parsedRows.forEach(row => {
      if (row.questionText && row.optionA && row.optionB && row.correctOption) {
        collections.questions.create({
          subject: row.subject || 'General',
          topic: row.topic || 'General',
          questionText: row.questionText,
          options: [row.optionA, row.optionB, row.optionC || '', row.optionD || ''].filter(Boolean),
          correctOption: isNaN(row.correctOption) ? (row.correctOption.toUpperCase().charCodeAt(0) - 65) : Number(row.correctOption),
          explanation: row.explanation || '',
          classLevel: row.classLevel || 'Class 11',
          stream: row.stream || 'NEET'
        });
        insertedCount++;
      }
    });

    // Cleanup uploaded temp file
    fs.unlinkSync(req.file.path);

    return successResponse(res, `Successfully imported ${insertedCount} questions into question bank!`, { insertedCount });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createQuestion,
  getQuestions,
  bulkUploadCSV
};

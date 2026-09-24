const { collections } = require('../config/db');
const { csvToJson } = require('../utils/excelParser');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const fs = require('fs');

/**
 * Upload offline RankX mark sheet (CSV) and auto-assign ranks and scholarships
 */
async function uploadOfflineMarksCSV(req, res, next) {
  try {
    if (!req.file) {
      return errorResponse(res, 'Marksheet CSV file is required', 400);
    }

    const fileContent = fs.readFileSync(req.file.path, 'utf-8');
    const rows = csvToJson(fileContent);

    if (rows.length === 0) {
      return errorResponse(res, 'CSV is empty or invalid format', 400);
    }

    let updatedCount = 0;
    const processedStudents = [];

    // Parse marks
    rows.forEach(row => {
      const rollNumber = (row.rollNumber || row['Roll Number'] || '').trim();
      const score = Number(row.score || row.marks || row['Marks'] || 0);
      const maxMarks = Number(row.maxMarks || row['Max Marks'] || 300);

      if (rollNumber) {
        const studentReg = collections.rankXRegistrations.findOne({ rollNumber });
        if (studentReg) {
          const percentage = Math.round((score / maxMarks) * 100);

          let scholarshipPercent = 10;
          if (percentage >= 85) scholarshipPercent = 100;
          else if (percentage >= 70) scholarshipPercent = 75;
          else if (percentage >= 50) scholarshipPercent = 50;
          else if (percentage >= 35) scholarshipPercent = 25;

          collections.rankXRegistrations.findByIdAndUpdate(studentReg.id, {
            score,
            maxMarks,
            percentage,
            scholarshipPercent,
            resultPublished: true,
            evaluatedAt: new Date().toISOString()
          });

          processedStudents.push({ rollNumber, score });
          updatedCount++;
        }
      }
    });

    // Compute ranks among all evaluated students
    const allEvaluated = collections.rankXRegistrations.find({ resultPublished: true });
    allEvaluated.sort((a, b) => (b.score || 0) - (a.score || 0));

    allEvaluated.forEach((student, index) => {
      collections.rankXRegistrations.findByIdAndUpdate(student.id, {
        rank: index + 1
      });
    });

    // Cleanup uploaded file
    fs.unlinkSync(req.file.path);

    return successResponse(res, `Uploaded and processed marks for ${updatedCount} students. Ranks and scholarships published!`, {
      updatedCount,
      totalEvaluated: allEvaluated.length
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Public or Student RankX Result Lookup by Roll Number or Mobile
 */
async function getRankXResult(req, res, next) {
  try {
    const { query } = req.params; // rollNumber or mobile
    const student = collections.rankXRegistrations.findOne({ rollNumber: query }) ||
                    collections.rankXRegistrations.findOne({ mobile: query });

    if (!student) {
      return errorResponse(res, 'No RankX record found with given roll number or mobile', 404);
    }

    if (!student.resultPublished) {
      return successResponse(res, 'Exam conducted. Result is currently being evaluated and will be declared soon.', {
        rollNumber: student.rollNumber,
        studentName: student.studentName,
        examDate: student.examDate,
        centreName: student.centreName,
        status: 'UNDER_EVALUATION'
      });
    }

    return successResponse(res, 'RankX Result retrieved', {
      rollNumber: student.rollNumber,
      studentName: student.studentName,
      targetClass: student.targetClass,
      stream: student.stream,
      centreName: student.centreName,
      score: student.score,
      maxMarks: student.maxMarks,
      percentage: student.percentage,
      rank: student.rank,
      scholarshipPercent: student.scholarshipPercent,
      status: 'PUBLISHED'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  uploadOfflineMarksCSV,
  getRankXResult
};

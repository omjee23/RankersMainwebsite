const { collections } = require('../config/db');
const { jsonToCsv } = require('../utils/excelParser');

/**
 * Export CSV Reports for Admin
 */
async function exportReportCSV(req, res, next) {
  try {
    const { reportType } = req.params;
    let filename = `rankerspath_${reportType}_${Date.now()}.csv`;
    let csvData = '';

    switch (reportType) {
      case 'students': {
        const students = collections.users.find({ role: 'student' });
        csvData = jsonToCsv(students, ['id', 'fullName', 'mobile', 'targetClass', 'targetStream', 'schoolName', 'verifiedAt']);
        break;
      }
      case 'rankx': {
        const rankx = collections.rankXRegistrations.find();
        csvData = jsonToCsv(rankx, ['rollNumber', 'studentName', 'mobile', 'targetClass', 'stream', 'centreName', 'examDate', 'attendanceStatus', 'score', 'rank', 'scholarshipPercent']);
        break;
      }
      case 'rsat': {
        const rsat = collections.rsatRegistrations.find();
        csvData = jsonToCsv(rsat, ['rollNumber', 'studentName', 'mobile', 'targetClass', 'stream', 'feePaid', 'status', 'registeredAt']);
        break;
      }
      case 'submissions': {
        const submissions = collections.examSubmissions.find();
        csvData = jsonToCsv(submissions, ['id', 'studentName', 'mobile', 'examTitle', 'score', 'maxMarks', 'percentage', 'scholarshipPercent', 'tabSwitchCount', 'submittedAt']);
        break;
      }
      case 'payments': {
        const payments = collections.payments.find();
        csvData = jsonToCsv(payments, ['transactionId', 'studentName', 'mobile', 'amount', 'purpose', 'status', 'gatewayReference', 'initiatedAt']);
        break;
      }
      case 'sms': {
        const sms = collections.smsLogs.find();
        csvData = jsonToCsv(sms, ['mobile', 'purpose', 'status', 'timestamp']);
        break;
      }
      default:
        return res.status(400).send('Invalid report type specified');
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csvData);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  exportReportCSV
};

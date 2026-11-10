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
      case 'director-rsat':
      case 'rsat': {
        const rsatRegs = collections.rsatRegistrations.find();
        const rsatUsers = collections.users.find({ originExam: 'RSAT' });
        const allPayments = collections.payments.find();
        const allSubs = collections.examSubmissions.find();

        // Map existing registrations
        const mappedList = rsatRegs.map(reg => {
          const user = collections.users.findOne({ id: reg.studentId }) || collections.users.findOne({ mobile: reg.mobile });
          const pay = allPayments.find(p =>
            (p.transactionId && p.transactionId === reg.transactionId) ||
            (p.metadata?.rollNumber === reg.rollNumber) ||
            (p.studentId === reg.studentId && (p.purpose || '').includes('RSAT'))
          );
          const sub = allSubs.find(s =>
            (s.studentId === reg.studentId || s.mobile === reg.mobile) &&
            ((s.category || '').toUpperCase().includes('RSAT') || (s.examTitle || '').toUpperCase().includes('RSAT'))
          );

          let funnelStage = '1_SIGNED_UP_ONLY';
          if (sub || reg.funnelStatus === '4_EXAM_COMPLETED') {
            funnelStage = '4_EXAM_COMPLETED';
          } else if (reg.scheduledSlot || reg.funnelStatus === '3_SCHEDULED_AWAITING_EXAM') {
            funnelStage = '3_SCHEDULED_AWAITING_EXAM';
          } else if (reg.paymentStatus === 'PAID' || pay) {
            funnelStage = '2_FEE_PAID_PENDING_SCHEDULE';
          }

          const isPaid = (reg.paymentStatus === 'PAID' || Boolean(pay));
          const scoreStr = sub ? `${sub.score} / ${sub.maxMarks}` : (reg.examScore !== undefined ? `${reg.examScore} / ${reg.maxMarks || 720}` : 'Not Attempted');
          const percentStr = sub ? `${sub.percentage}%` : (reg.percentage !== undefined ? `${reg.percentage}%` : '—');
          const scholStr = sub ? `${sub.scholarshipPercent}% Waiver` : (reg.scholarshipPercent !== undefined ? `${reg.scholarshipPercent}% Waiver` : '—');

          return {
            Roll_Number: reg.rollNumber || 'PENDING',
            Candidate_Name: reg.studentName || user?.fullName || 'Student Candidate',
            Email_Address: reg.email || user?.email || '—',
            Mobile_Number: reg.mobile || user?.mobile || '—',
            Target_Stream: reg.stream || user?.targetStream || 'NEET',
            Target_Class: reg.targetClass || user?.targetClass || 'Class 11',
            Funnel_Stage: funnelStage,
            Fee_Payment_Status: isPaid ? 'PAID' : 'PENDING',
            Fee_Amount_INR: isPaid ? (reg.feePaid || pay?.amount || 100) : 0,
            Cashfree_TXN_ID: pay?.transactionId || reg.transactionId || '—',
            Scheduled_Slot: reg.scheduledSlot ? `${reg.scheduledSlot.date} (${reg.scheduledSlot.timeSlot || '10:00 AM'})` : 'Not Scheduled',
            Exam_Attempt_Status: (sub || reg.funnelStatus === '4_EXAM_COMPLETED') ? 'COMPLETED' : 'NOT_STARTED',
            Exam_Score: scoreStr,
            Accuracy_Percent: percentStr,
            Scholarship_Awarded: scholStr,
            Signup_Date_Time: user?.signupAt || reg.registeredAt || '',
            Last_Login_Date_Time: user?.lastLoginAt || ''
          };
        });

        // Include any RSAT users who haven't generated a reg entry yet
        rsatUsers.forEach(u => {
          if (!mappedList.some(m => m.Mobile_Number === u.mobile || m.Email_Address === u.email)) {
            mappedList.push({
              Roll_Number: 'Awaiting Payment',
              Candidate_Name: u.fullName || 'Student Lead',
              Email_Address: u.email || '—',
              Mobile_Number: u.mobile || '—',
              Target_Stream: u.targetStream || 'NEET',
              Target_Class: u.targetClass || 'Class 11',
              Funnel_Stage: '1_SIGNED_UP_ONLY',
              Fee_Payment_Status: 'PENDING',
              Fee_Amount_INR: 0,
              Cashfree_TXN_ID: '—',
              Scheduled_Slot: 'Not Scheduled',
              Exam_Attempt_Status: 'NOT_STARTED',
              Exam_Score: 'Not Attempted',
              Accuracy_Percent: '—',
              Scholarship_Awarded: '—',
              Signup_Date_Time: u.signupAt || u.createdAt || '',
              Last_Login_Date_Time: u.lastLoginAt || ''
            });
          }
        });

        filename = `Director_RSAT_Candidates_Funnel_${Date.now()}.csv`;
        csvData = jsonToCsv(mappedList, [
          'Roll_Number',
          'Candidate_Name',
          'Email_Address',
          'Mobile_Number',
          'Target_Stream',
          'Target_Class',
          'Funnel_Stage',
          'Fee_Payment_Status',
          'Fee_Amount_INR',
          'Cashfree_TXN_ID',
          'Scheduled_Slot',
          'Exam_Attempt_Status',
          'Exam_Score',
          'Accuracy_Percent',
          'Scholarship_Awarded',
          'Signup_Date_Time',
          'Last_Login_Date_Time'
        ]);
        break;
      }
      case 'director-rankx':
      case 'rankx': {
        const rankxRegs = collections.rankXRegistrations.find();
        const rankxUsers = collections.users.find({ originExam: 'RANKEX' });
        const allPayments = collections.payments.find();

        const mappedRankx = rankxRegs.map(reg => {
          const user = collections.users.findOne({ id: reg.studentId }) || collections.users.findOne({ mobile: reg.mobile });
          const pay = allPayments.find(p =>
            (p.transactionId && p.transactionId === reg.transactionId) ||
            (p.metadata?.rollNumber === reg.rollNumber) ||
            (p.studentId === reg.studentId && (p.purpose || '').includes('RANKEX'))
          );

          let funnelStage = '1_SIGNED_UP_ONLY';
          if (reg.attendanceStatus === 'PRESENT' || reg.score !== undefined) {
            funnelStage = '3_EXAM_ATTENDED_EVALUATED';
          } else if (reg.paymentStatus === 'PAID' || pay) {
            funnelStage = '2_FEE_PAID_ADMIT_CARD_ISSUED';
          }

          const isPaid = (reg.paymentStatus === 'PAID' || Boolean(pay));

          return {
            Admit_Card_Roll_No: reg.rollNumber || 'PENDING',
            Candidate_Name: reg.studentName || user?.fullName || 'RANKEX Candidate',
            Father_Name: reg.fatherName || '—',
            Email_Address: reg.email || user?.email || '—',
            Mobile_Number: reg.mobile || user?.mobile || '—',
            Target_Stream: reg.stream || user?.targetStream || 'IIT_JEE',
            Target_Class: reg.targetClass || user?.targetClass || 'Class 11',
            Funnel_Stage: funnelStage,
            Fee_Payment_Status: isPaid ? 'PAID' : 'PENDING',
            Fee_Amount_INR: isPaid ? (reg.feePaid || pay?.amount || 100) : 0,
            Cashfree_TXN_ID: pay?.transactionId || reg.transactionId || '—',
            Allotted_Campus_Venue: reg.centreName || 'Vijay Nagar Main Campus, Indore',
            Exam_Mode: reg.examMode || 'OFFLINE',
            Exam_Date_Timing: `${reg.examDate || 'Sunday, 18 Oct 2026'} (${reg.examTiming || '10:00 AM'})`,
            Attendance_Status: reg.attendanceStatus || 'PENDING',
            Evaluation_Score_Rank: reg.score !== undefined ? `Score: ${reg.score} | Rank: ${reg.rank || 'Pending'}` : 'Pending Evaluation',
            Scholarship_Awarded: reg.scholarshipPercent ? `${reg.scholarshipPercent}% Tuition Fee Waiver` : 'Pending Evaluation',
            Signup_Date_Time: user?.signupAt || reg.registeredAt || '',
            Last_Login_Date_Time: user?.lastLoginAt || ''
          };
        });

        rankxUsers.forEach(u => {
          if (!mappedRankx.some(m => m.Mobile_Number === u.mobile || m.Email_Address === u.email)) {
            mappedRankx.push({
              Admit_Card_Roll_No: 'Awaiting Payment',
              Candidate_Name: u.fullName || 'RANKEX Lead',
              Father_Name: '—',
              Email_Address: u.email || '—',
              Mobile_Number: u.mobile || '—',
              Target_Stream: u.targetStream || 'IIT_JEE',
              Target_Class: u.targetClass || 'Class 11',
              Funnel_Stage: '1_SIGNED_UP_ONLY',
              Fee_Payment_Status: 'PENDING',
              Fee_Amount_INR: 0,
              Cashfree_TXN_ID: '—',
              Allotted_Campus_Venue: 'Vijay Nagar Main Campus, Indore',
              Exam_Mode: 'OFFLINE',
              Exam_Date_Timing: 'Sunday, 18 Oct 2026 (10:00 AM)',
              Attendance_Status: 'PENDING',
              Evaluation_Score_Rank: 'Pending Evaluation',
              Scholarship_Awarded: 'Pending Evaluation',
              Signup_Date_Time: u.signupAt || u.createdAt || '',
              Last_Login_Date_Time: u.lastLoginAt || ''
            });
          }
        });

        filename = `Director_RANKEX_Candidates_Funnel_${Date.now()}.csv`;
        csvData = jsonToCsv(mappedRankx, [
          'Admit_Card_Roll_No',
          'Candidate_Name',
          'Father_Name',
          'Email_Address',
          'Mobile_Number',
          'Target_Stream',
          'Target_Class',
          'Funnel_Stage',
          'Fee_Payment_Status',
          'Fee_Amount_INR',
          'Cashfree_TXN_ID',
          'Allotted_Campus_Venue',
          'Exam_Mode',
          'Exam_Date_Timing',
          'Attendance_Status',
          'Evaluation_Score_Rank',
          'Scholarship_Awarded',
          'Signup_Date_Time',
          'Last_Login_Date_Time'
        ]);
        break;
      }
      case 'submissions': {
        const submissions = collections.examSubmissions.find();
        csvData = jsonToCsv(submissions, ['id', 'studentName', 'mobile', 'examTitle', 'score', 'maxMarks', 'percentage', 'scholarshipPercent', 'tabSwitchCount', 'submittedAt']);
        break;
      }
      case 'payments': {
        const rawPayments = collections.payments.find().reverse();
        const formattedPayments = rawPayments.map(p => ({
          Transaction_ID: p.transactionId || p.orderId || p.id,
          Student_Name: p.studentName || 'Student Aspirant',
          Mobile_Number: p.mobile || '',
          Roll_Number: p.metadata?.rollNumber || p.rollNumber || 'RPX-2026',
          Fee_Category: p.purpose ? p.purpose.replace(/_/g, ' ') : 'Fee Collection',
          Amount_INR: p.amount || 0,
          Payment_Gateway: 'Cashfree PG v3',
          Status: p.status || 'SUCCESS',
          Order_ID: p.orderId || p.gatewayReference || '',
          Payment_Date: p.paidAt || p.initiatedAt || p.createdAt || ''
        }));
        csvData = jsonToCsv(formattedPayments, [
          'Transaction_ID',
          'Student_Name',
          'Mobile_Number',
          'Roll_Number',
          'Fee_Category',
          'Amount_INR',
          'Payment_Gateway',
          'Status',
          'Order_ID',
          'Payment_Date'
        ]);
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

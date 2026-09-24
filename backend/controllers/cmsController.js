const { collections } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Public: Get current CMS notices and dynamic settings
 */
async function getCMSContent(req, res, next) {
  try {
    let cms = collections.cmsContent.findOne({ id: 'default-cms' });
    if (!cms) {
      cms = {
        bannerNotice: 'Admissions Open for NEET & IIT-JEE 2026-27 | RankX Offline Scholarship Test Registrations Open!',
        nextBatchDate: '24 June 2026',
        dropperBatchAlert: 'NEET Dropper Batch starting 24 June 2026. Limited seats per batch (30 students only).',
        helplinePhone: '9131435511',
        secondaryPhone: '7974546310',
        whatsappNumber: '919131435511',
        email: 'info@rankerspath.in',
        address: 'HQ City Walk, Block A, 129, Scheme No. 54, Near Satya Sai Square, Vijay Nagar, Indore - 452010'
      };
    }
    return successResponse(res, 'CMS content retrieved', cms);
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Update CMS content (batch date, notice, phones)
 */
async function updateCMSContent(req, res, next) {
  try {
    const updates = req.body;
    let cms = collections.cmsContent.findOne({ id: 'default-cms' });

    if (cms) {
      cms = collections.cmsContent.findByIdAndUpdate(cms.id, updates);
    } else {
      cms = collections.cmsContent.create({ id: 'default-cms', ...updates });
    }

    return successResponse(res, 'Website content updated successfully!', cms);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCMSContent,
  updateCMSContent
};

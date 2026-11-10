const { collections } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const DEFAULT_FEE_CONFIG = {
  id: 'fee-config-default',
  rsatFee: 100,
  rankxFee: 100,
  classroomTokenFee: 5000,
  testSeriesFee: 1500,
  dropperBatchFee: 110000,
  foundationFee: 65000,
  twoYearJeeNeetFee: 125000,
  gstRate: 18,
  allowCustomTuitionFee: true,
  minCustomFee: 500,
  notes: 'Official fee structure configured by Director / Admin',
  updatedAt: new Date().toISOString()
};

/**
 * GET /api/fees/config
 * Publicly accessible endpoint to retrieve active fee structure
 */
async function getFeeConfig(req, res, next) {
  try {
    const list = collections.feeSettings.find();
    let config = list && list.length > 0 ? list[0] : null;

    if (!config) {
      config = collections.feeSettings.create(DEFAULT_FEE_CONFIG);
    }

    return successResponse(res, 'Fee configuration loaded', config);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/fees/config
 * Admin-authenticated endpoint to update institute fee structure
 */
async function updateFeeConfig(req, res, next) {
  try {
    const {
      rsatFee,
      rankxFee,
      classroomTokenFee,
      testSeriesFee,
      dropperBatchFee,
      foundationFee,
      twoYearJeeNeetFee,
      gstRate,
      allowCustomTuitionFee,
      minCustomFee,
      notes
    } = req.body;

    const list = collections.feeSettings.find();
    let config = list && list.length > 0 ? list[0] : null;

    const payload = {
      rsatFee: rsatFee !== undefined ? Math.max(0, Number(rsatFee)) : (config?.rsatFee ?? 100),
      rankxFee: rankxFee !== undefined ? Math.max(0, Number(rankxFee)) : (config?.rankxFee ?? 100),
      classroomTokenFee: classroomTokenFee !== undefined ? Math.max(0, Number(classroomTokenFee)) : (config?.classroomTokenFee ?? 5000),
      testSeriesFee: testSeriesFee !== undefined ? Math.max(0, Number(testSeriesFee)) : (config?.testSeriesFee ?? 1500),
      dropperBatchFee: dropperBatchFee !== undefined ? Math.max(0, Number(dropperBatchFee)) : (config?.dropperBatchFee ?? 110000),
      foundationFee: foundationFee !== undefined ? Math.max(0, Number(foundationFee)) : (config?.foundationFee ?? 65000),
      twoYearJeeNeetFee: twoYearJeeNeetFee !== undefined ? Math.max(0, Number(twoYearJeeNeetFee)) : (config?.twoYearJeeNeetFee ?? 125000),
      gstRate: gstRate !== undefined ? Math.max(0, Math.min(100, Number(gstRate))) : (config?.gstRate ?? 18),
      allowCustomTuitionFee: allowCustomTuitionFee !== undefined ? Boolean(allowCustomTuitionFee) : (config?.allowCustomTuitionFee ?? true),
      minCustomFee: minCustomFee !== undefined ? Math.max(100, Number(minCustomFee)) : (config?.minCustomFee ?? 500),
      notes: notes || 'Updated by Administrator',
      updatedBy: req.user?.fullName || 'Super Administrator',
      updatedAt: new Date().toISOString()
    };

    if (config) {
      config = collections.feeSettings.findByIdAndUpdate(config.id, payload);
    } else {
      config = collections.feeSettings.create({
        id: 'fee-config-default',
        ...payload
      });
    }

    return successResponse(res, 'Institute fee structure updated successfully', config);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getFeeConfig,
  updateFeeConfig
};

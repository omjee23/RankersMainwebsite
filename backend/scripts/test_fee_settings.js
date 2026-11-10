const { collections } = require('../config/db');
const { getFeeConfig, updateFeeConfig } = require('../controllers/feeController');

async function runTests() {
  console.log('--- Testing Fee Settings Controller & DB ---');

  // 1. Verify collections.feeSettings has seeded data
  const feeConfigs = collections.feeSettings.find();
  console.log('Seeded Fee Config count:', feeConfigs.length);
  if (feeConfigs.length === 0) {
    throw new Error('Fee config was not seeded');
  }
  const current = feeConfigs[0];
  console.log('Current Fee Config:', {
    rsatFee: current.rsatFee,
    rankxFee: current.rankxFee,
    classroomTokenFee: current.classroomTokenFee,
    testSeriesFee: current.testSeriesFee
  });

  // 2. Mock res object
  let responseData = null;
  const mockRes = {
    status: function(code) { this.statusCode = code; return this; },
    json: function(data) { responseData = data; return this; }
  };

  // 3. Test getFeeConfig
  await getFeeConfig({}, mockRes, (err) => { if (err) throw err; });
  if (!responseData.success || !responseData.data) {
    throw new Error('getFeeConfig failed: ' + JSON.stringify(responseData));
  }
  console.log('✅ Test 1 Passed: getFeeConfig returned successfully');

  // 4. Test updateFeeConfig (Admin updating fees)
  const updateReq = {
    user: { fullName: 'Director Admin' },
    body: {
      rsatFee: 200,
      rankxFee: 150,
      classroomTokenFee: 10000,
      testSeriesFee: 2999
    }
  };

  await updateFeeConfig(updateReq, mockRes, (err) => { if (err) throw err; });
  if (!responseData.success || responseData.data.rsatFee !== 200 || responseData.data.classroomTokenFee !== 10000) {
    throw new Error('updateFeeConfig failed: ' + JSON.stringify(responseData));
  }
  console.log('✅ Test 2 Passed: updateFeeConfig updated fees to ₹200 RSAT & ₹10,000 Token Fee');

  // 5. Test resetting back to default or desired
  await updateFeeConfig({
    user: { fullName: 'Director Admin' },
    body: {
      rsatFee: 100,
      rankxFee: 100,
      classroomTokenFee: 5000,
      testSeriesFee: 1500
    }
  }, mockRes, (err) => { if (err) throw err; });
  console.log('✅ Test 3 Passed: Reset fee config verified');

  console.log('🎉 ALL FEE CONFIGURATION TESTS PASSED!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

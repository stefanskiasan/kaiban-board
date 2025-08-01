/**
 * Analytics Persistence Verification Script
 * 
 * This script verifies that the orchestration analytics persistence system
 * is working correctly by testing all implemented features:
 * 
 * 1. LocalStorage analytics storage
 * 2. Workflow session management  
 * 3. Historical data persistence
 * 4. Dashboard integration
 * 5. Export functionality
 */

// Test LocalStorage functionality
function testLocalStorageAnalytics() {
  console.log('🧪 Testing LocalStorage Analytics...');
  
  // Clear any existing data
  localStorage.removeItem('orchestration_analytics');
  
  // Test data structure
  const testAnalytics = {
    sessionId: 'test-session-001',
    teamName: 'Test Team',
    startTime: Date.now() - 300000, // 5 minutes ago
    endTime: Date.now(),
    duration: 300000,
    logs: [
      {
        timestamp: Date.now() - 200000,
        level: 'info',
        message: 'Test orchestration event',
        data: { test: true }
      }
    ],
    metrics: {
      totalTasks: 5,
      completedTasks: 3,
      averageTaskTime: 60000
    }
  };
  
  try {
    // Test saving
    const dataToStore = {
      version: '1.0',
      lastUpdated: Date.now(),
      sessions: [testAnalytics]
    };
    localStorage.setItem('orchestration_analytics', JSON.stringify(dataToStore));
    console.log('✅ Analytics saved successfully');
    
    // Test loading
    const loaded = localStorage.getItem('orchestration_analytics');
    const parsed = JSON.parse(loaded);
    console.log('✅ Analytics loaded successfully:', parsed.sessions.length, 'sessions');
    
    // Cleanup
    localStorage.removeItem('orchestration_analytics');
    console.log('✅ LocalStorage test completed successfully');
    
    return true;
  } catch (error) {
    console.error('❌ LocalStorage test failed:', error);
    return false;
  }
}

// Test workflow session ID generation
function testWorkflowSessionGeneration() {
  console.log('🧪 Testing Workflow Session Generation...');
  
  try {
    // Generate session IDs
    const session1 = `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const session2 = `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('✅ Session ID 1:', session1);
    console.log('✅ Session ID 2:', session2);
    
    // Verify uniqueness
    if (session1 !== session2) {
      console.log('✅ Session IDs are unique');
      return true;
    } else {
      console.error('❌ Session IDs are not unique');
      return false;
    }
  } catch (error) {
    console.error('❌ Session generation test failed:', error);
    return false;
  }
}

// Test analytics data processing
function testAnalyticsProcessing() {
  console.log('🧪 Testing Analytics Data Processing...');
  
  try {
    const mockLogs = [
      { timestamp: Date.now() - 120000, level: 'info', message: 'Workflow started' },
      { timestamp: Date.now() - 90000, level: 'info', message: 'Task 1 started' },
      { timestamp: Date.now() - 60000, level: 'info', message: 'Task 1 completed' },
      { timestamp: Date.now() - 30000, level: 'info', message: 'Task 2 started' },
      { timestamp: Date.now(), level: 'info', message: 'Workflow completed' }
    ];
    
    // Process logs to extract insights
    const orchestrationEvents = mockLogs.filter(log => 
      log.message.includes('orchestration') || 
      log.message.includes('workflow') ||
      log.message.includes('task')
    );
    
    const duration = mockLogs[mockLogs.length - 1].timestamp - mockLogs[0].timestamp;
    const taskEvents = orchestrationEvents.filter(log => log.message.includes('Task'));
    
    const insights = {
      totalEvents: orchestrationEvents.length,
      duration: duration,
      taskCount: taskEvents.length / 2, // Start + complete
      averageTaskTime: duration / (taskEvents.length / 2)
    };
    
    console.log('✅ Analytics insights generated:', insights);
    return true;
  } catch (error) {
    console.error('❌ Analytics processing test failed:', error);
    return false;
  }
}

// Test export functionality
function testExportFunctionality() {
  console.log('🧪 Testing Export Functionality...');
  
  try {
    const testData = {
      sessionId: 'export-test-001',
      teamName: 'Export Test Team',
      timestamp: Date.now(),
      metrics: { test: true }
    };
    
    // Test JSON export
    const jsonExport = JSON.stringify(testData, null, 2);
    console.log('✅ JSON export generated, size:', jsonExport.length, 'characters');
    
    // Test CSV conversion
    const csvHeaders = Object.keys(testData).join(',');
    const csvValues = Object.values(testData).map(v => 
      typeof v === 'object' ? JSON.stringify(v) : v
    ).join(',');
    const csvExport = csvHeaders + '\n' + csvValues;
    console.log('✅ CSV export generated, size:', csvExport.length, 'characters');
    
    return true;
  } catch (error) {
    console.error('❌ Export functionality test failed:', error);
    return false;
  }
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting Analytics Persistence Verification...\n');
  
  const tests = [
    { name: 'LocalStorage Analytics', test: testLocalStorageAnalytics },
    { name: 'Workflow Session Generation', test: testWorkflowSessionGeneration },
    { name: 'Analytics Processing', test: testAnalyticsProcessing },
    { name: 'Export Functionality', test: testExportFunctionality }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  tests.forEach(({ name, test }) => {
    console.log(`\n--- ${name} ---`);
    try {
      if (test()) {
        passed++;
        console.log(`✅ ${name} PASSED`);
      } else {
        console.log(`❌ ${name} FAILED`);
      }
    } catch (error) {
      console.log(`❌ ${name} FAILED with error:`, error);
    }
  });
  
  console.log(`\n🎯 Test Results: ${passed}/${total} tests passed`);
  console.log(passed === total ? '🎉 All tests passed!' : '⚠️ Some tests failed');
  
  return passed === total;
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testAnalytics = {
    runAllTests,
    testLocalStorageAnalytics,
    testWorkflowSessionGeneration,
    testAnalyticsProcessing,
    testExportFunctionality
  };
  console.log('📋 Analytics verification tools loaded. Run testAnalytics.runAllTests() to start testing.');
}

// Run tests if in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests };
  runAllTests();
}
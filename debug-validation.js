// Debug script to test validation logic
const testResponse = {
  questionText: 'What specific challenges has your real estate agency faced in implementing AI-driven solutions for client relationship management?',
  answerType: 'text',
  options: null,
  phase_status: 'asking',
  overall_status: 'asking',
  reasoning_text: 'This question is designed to gather qualitative insights...'
};

console.log('Testing validation logic...');
console.log('Test response:', JSON.stringify(testResponse, null, 2));

// Test 1: Check if parsedResponse exists and questionText is string
console.log('\n=== Test 1: Basic structure ===');
console.log('parsedResponse exists:', !!testResponse);
console.log('questionText type:', typeof testResponse.questionText);
console.log('questionText value:', testResponse.questionText);

if (!testResponse || typeof testResponse.questionText !== 'string') {
  console.log('❌ FAILED: Invalid response structure');
} else {
  console.log('✅ PASSED: Basic structure valid');
}

// Test 2: Check answerType
console.log('\n=== Test 2: Answer type validation ===');
const validAnswerTypes = ['text', 'radio', 'checkbox', 'scale'];
console.log('Valid answer types:', validAnswerTypes);
console.log('Actual answerType:', testResponse.answerType);
console.log('Is valid:', validAnswerTypes.includes(testResponse.answerType));

if (!validAnswerTypes.includes(testResponse.answerType)) {
  console.log('❌ FAILED: Invalid answerType');
} else {
  console.log('✅ PASSED: Answer type valid');
}

// Test 3: Check options validation
console.log('\n=== Test 3: Options validation ===');
console.log('Answer type:', testResponse.answerType);
console.log('Options value:', testResponse.options);
console.log('Options is array:', Array.isArray(testResponse.options));

if (testResponse.answerType === 'radio' || testResponse.answerType === 'checkbox') {
  if (!Array.isArray(testResponse.options) || testResponse.options.length === 0) {
    console.log('❌ FAILED: Radio/checkbox needs options array');
  } else {
    console.log('✅ PASSED: Radio/checkbox has valid options');
  }
} else if (testResponse.answerType === 'text' || testResponse.answerType === 'scale') {
  if (testResponse.options !== null) {
    console.log('⚠️  WARNING: Text/scale should have null options, setting to null');
    testResponse.options = null;
  }
  console.log('✅ PASSED: Text/scale options validation');
}

console.log('\n=== Final Result ===');
console.log('All validations should pass for this response');
console.log('Final response:', JSON.stringify(testResponse, null, 2)); 
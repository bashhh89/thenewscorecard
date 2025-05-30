// Test OpenAI connectivity
require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

console.log('Testing OpenAI connectivity...');
console.log('API Key present:', !!OPENAI_API_KEY);
console.log('API Key length:', OPENAI_API_KEY ? OPENAI_API_KEY.length : 0);
console.log('API Key preview:', OPENAI_API_KEY ? `${OPENAI_API_KEY.substring(0, 7)}...${OPENAI_API_KEY.substring(OPENAI_API_KEY.length - 4)}` : 'N/A');

async function testOpenAI() {
  if (!OPENAI_API_KEY) {
    console.log('❌ No OpenAI API key found');
    return;
  }

  try {
    console.log('\n=== Testing OpenAI Models Endpoint ===');
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorData = await response.text();
      console.log('❌ OpenAI API error:', errorData.substring(0, 500));
      return;
    }
    
    const data = await response.json();
    console.log('✅ OpenAI API is accessible');
    console.log('Available models count:', data.data ? data.data.length : 'unknown');
    
    // Test a simple completion
    console.log('\n=== Testing OpenAI Chat Completion ===');
    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${OPENAI_API_KEY}` 
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: "user", content: "Say 'test successful'" }],
        max_tokens: 10
      })
    });
    
    console.log('Chat response status:', chatResponse.status);
    
    if (!chatResponse.ok) {
      const errorData = await chatResponse.text();
      console.log('❌ OpenAI Chat API error:', errorData.substring(0, 500));
      return;
    }
    
    const chatData = await chatResponse.json();
    console.log('✅ OpenAI Chat API is working');
    console.log('Response:', chatData.choices[0].message.content);
    
  } catch (error) {
    console.log('❌ Network error:', error.message);
    console.log('This suggests a network connectivity issue');
  }
}

testOpenAI(); 
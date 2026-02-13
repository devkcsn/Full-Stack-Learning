// Test OpenAI API connection
// Run with: node test-openai.js

require('dotenv').config();
const OpenAI = require('openai');

async function testOpenAI() {
  console.log('Testing OpenAI API connection...\n');
  
  // Check if API key exists
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ ERROR: OPENAI_API_KEY not found in .env file');
    process.exit(1);
  }
  
  if (process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    console.error('❌ ERROR: Please replace the placeholder API key in .env file with your actual OpenAI API key');
    console.log('\nGet your API key from: https://platform.openai.com/api-keys');
    process.exit(1);
  }
  
  console.log('✓ API key found in .env file');
  console.log(`✓ API key starts with: ${process.env.OPENAI_API_KEY.substring(0, 10)}...`);
  console.log('\nAttempting to make a test API call...\n');
  
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Say 'Hello, AI Career Counselor is working!' in a friendly way."
        }
      ],
      max_tokens: 50
    });
    
    console.log('✅ SUCCESS! OpenAI API is working correctly.\n');
    console.log('Test response:');
    console.log(completion.choices[0].message.content);
    console.log('\n✓ Your AI Career Counselor should now work properly!');
    
  } catch (error) {
    console.error('❌ ERROR: Failed to connect to OpenAI API\n');
    
    if (error.code === 'invalid_api_key') {
      console.error('The API key is invalid. Please check:');
      console.error('1. Make sure you copied the entire key correctly');
      console.error('2. The key hasn\'t been revoked on OpenAI platform');
      console.error('3. No extra spaces or quotes around the key in .env file');
    } else if (error.code === 'insufficient_quota') {
      console.error('Your OpenAI account has exceeded its quota or has no credits.');
      console.error('Please check your billing at: https://platform.openai.com/account/billing');
    } else {
      console.error('Error details:', error.message);
    }
    
    console.log('\nGet help at: https://platform.openai.com/docs/guides/error-codes');
    process.exit(1);
  }
}

testOpenAI();

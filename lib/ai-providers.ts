// AI Provider Interface
export interface AIProvider {
  name: string;
  generateReport: (systemPrompt: string, userPrompt: string) => Promise<string>;
  generateNextQuestion: (systemPrompt: string, userPrompt: string) => Promise<any>;
  isAvailable: () => Promise<boolean>;
}

// OpenAI Provider
export class OpenAIProvider implements AIProvider {
  name = 'OpenAI';
  apiKey: string;
  model: string;
  
  constructor(apiKey?: string, model?: string) {
    const envKey = process.env.OPENAI_API_KEY;
    this.apiKey = apiKey || envKey || '';
    this.model = model || process.env.OPENAI_MODEL || 'gpt-4o';
    console.log(`Initializing OpenAI provider with model: ${this.model}. API Key present: ${!!this.apiKey}`);
    if (!this.apiKey) {
      // This will be caught by isAvailable or when a call is made
      console.warn('OpenAI provider initialized without API key. It will not be available.');
    }
  }
  
  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) {
      console.error('OpenAI availability check failed: No API key provided.');
      return false;
    }
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      if (!response.ok) {
        const errorData = await response.text();
        console.error(`OpenAI provider availability check failed. Status: ${response.status}. Response: ${errorData.substring(0,300)}`);
        return false;
      }
      console.log('OpenAI provider is available.');
      return true;
    } catch (error: any) {
      console.error('OpenAI availability check failed with exception:', error.message);
      return false;
    }
  }
  
  async generateReport(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!this.apiKey) throw new Error('OpenAI API key not configured.');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.apiKey}` },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        temperature: 0.7, max_tokens: 4000
      })
    });
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`OpenAI API error for generateReport: ${response.status}. Details: ${errorData.substring(0,500)}`);
      throw new Error(`OpenAI API error: ${response.status} ${errorData}`);
    }
    const data = await response.json();
    return data.choices[0].message.content;
  }
  
  async generateNextQuestion(systemPrompt: string, userPrompt: string): Promise<any> {
    if (!this.apiKey) throw new Error('OpenAI API key not configured.');
    console.log('OpenAI: Generating next question...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.apiKey}` },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        temperature: 0.7, max_tokens: 1500, response_format: { type: "json_object" }
      })
    });
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`OpenAI API error for generateNextQuestion: ${response.status}. Details: ${errorData.substring(0,500)}`);
      throw new Error(`OpenAI API error: ${response.status} ${errorData}`);
    }
    const data = await response.json();
    try {
      if (data && data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content;
        if (typeof content !== 'string') return content;
        if (content.startsWith('<!DOCTYPE') || content.startsWith('<html')) {
          console.error('OpenAI returned HTML instead of JSON for question:', content.substring(0, 100));
          throw new Error('Invalid response format: received HTML instead of JSON from OpenAI');
        }
        
        const parsedJson = JSON.parse(content);
        return parsedJson;
      }
      console.error('Unexpected response structure from OpenAI (question):', data);
      throw new Error('Unexpected response structure from OpenAI API (question)');
    } catch (parseError: any) {
      console.error('Error processing/parsing OpenAI question response:', parseError);
      throw parseError;
    }
  }
}

// Pollinations Provider
export class PollinationsProvider implements AIProvider {
  name = 'Pollinations';
  apiUrl: string;
  model: string;
  
  constructor(apiUrl?: string, model?: string) {
    this.apiUrl = apiUrl || 'https://text.pollinations.ai/openai';
    this.model = model || 'openai-large'; // Default as per previous setup
    console.log(`Initializing Pollinations provider with model: ${this.model} and API URL: ${this.apiUrl}`);
  }
  
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: this.model, messages: [{ role: "user", content: "ping" }], max_tokens: 5 })
      });
      if (!response.ok) {
        console.error(`Pollinations provider availability check failed. Status: ${response.status}`);
        return false;
      }
      console.log('Pollinations provider is available.');
      return true;
    } catch (error: any) {
      console.error('Pollinations availability check failed with exception:', error.message);
      return false;
    }
  }

  private async _generate(systemPrompt: string, userPrompt: string, max_tokens: number): Promise<any> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        temperature: 0.7, max_tokens, response_format: { type: "json_object" }
      })
    });
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Pollinations API error: ${response.status}. Details: ${errorData.substring(0,500)}`);
      throw new Error(`Pollinations API error: ${response.status} ${errorData}`);
    }
    const data = await response.json();
    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      const content = data.choices[0].message.content;
      if (typeof content !== 'string') return content; // Already object
      if (content.startsWith('<!DOCTYPE') || content.startsWith('<html')) {
        console.error('Pollinations returned HTML instead of JSON:', content.substring(0, 100));
        throw new Error('Invalid response format: received HTML instead of JSON from Pollinations');
      }
      
      const parsedJson = JSON.parse(content);
      return parsedJson;
    }
    console.error('Unexpected response structure from Pollinations:', data);
    throw new Error('Unexpected response structure from Pollinations API');
  }

  async generateReport(systemPrompt: string, userPrompt: string): Promise<string> {
    console.log('Pollinations: Generating report...');
    // Assuming report is string content, not JSON object from Pollinations for this example
    // If report is also JSON, _generate can be used and then extract string part
     const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        temperature: 0.7, max_tokens: 4000 
      })
    });
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Pollinations API error for generateReport: ${response.status}. Details: ${errorData.substring(0,500)}`);
      throw new Error(`Pollinations API error: ${response.status} ${errorData}`);
    }
    const data = await response.json();
    if (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        return data.choices[0].message.content;
    }
    console.error('Unexpected response structure for report from Pollinations:', data);
    throw new Error('Unexpected report response structure from Pollinations API');
  }
  
  async generateNextQuestion(systemPrompt: string, userPrompt: string): Promise<any> {
    console.log('Pollinations: Generating next question...');
    return this._generate(systemPrompt, userPrompt, 1500);
  }
}

// Groq Provider
export class GroqProvider implements AIProvider {
  name = 'Groq';
  apiKey: string;
  model: string;
  
  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || process.env.GROQ_API_KEY || '';
    this.model = model || process.env.DEV_AI_MODEL || 'qwen-qwq-32b'; // Default qwen-qwq-32b
    console.log(`Initializing Groq provider with model: ${this.model}. API Key present: ${!!this.apiKey}`);
    if (!this.apiKey) {
      console.warn('Groq provider initialized without API key. It will not be available.');
    }
  }
  
  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) {
      console.error('Groq availability check failed: No API key provided.');
      return false;
    }
    try {
      const response = await fetch('https://api.groq.com/openai/v1/models', { // Corrected URL
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
       if (!response.ok) {
        const errorData = await response.text();
        console.error(`Groq provider availability check failed. Status: ${response.status}. Response: ${errorData.substring(0,300)}`);
        return false;
      }
      console.log('Groq provider is available.');
      return true;
    } catch (error: any) {
      console.error('Groq availability check failed with exception:', error.message);
      return false;
    }
  }

  private async _generate(systemPrompt: string, userPrompt: string, max_tokens: number, isJsonOutput: boolean): Promise<any> {
    if (!this.apiKey) throw new Error('Groq API key not configured.');
    const body: any = {
        model: this.model,
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        temperature: 0.7,
        max_tokens
    };
    if (isJsonOutput) {
        body.response_format = { type: "json_object" };
    }

    const response = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.apiKey}` },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Groq API error: ${response.status}. Details: ${errorData.substring(0,500)}`);
      throw new Error(`Groq API error: ${response.status} ${errorData}`);
    }
    const data = await response.json();
    
    if (isJsonOutput) {
        try {
            if (data && data.choices && data.choices[0] && data.choices[0].message) {
              const content = data.choices[0].message.content;
              if (typeof content !== 'string') return content; // Already object
              if (content.startsWith('<!DOCTYPE') || content.startsWith('<html')) {
                console.error('Groq returned HTML instead of JSON:', content.substring(0, 100));
                throw new Error('Invalid response format: received HTML instead of JSON from Groq');
              }
              return JSON.parse(content);
            }
            console.error('Unexpected response structure from Groq (JSON mode):', data);
            throw new Error('Unexpected response structure from Groq API (JSON mode)');
        } catch (parseError: any) {
            console.error('Error processing/parsing Groq JSON response:', parseError);
            throw parseError;
        }
    } else {
        // For text output like generateReport
        if (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            return data.choices[0].message.content;
        }
        console.error('Unexpected response structure for text report from Groq:', data);
        throw new Error('Unexpected text report response structure from Groq API');
    }
  }
  
  async generateReport(systemPrompt: string, userPrompt: string): Promise<string> {
    console.log('Groq: Generating report...');
    return this._generate(systemPrompt, userPrompt, 4000, false) as Promise<string>;
  }
  
  async generateNextQuestion(systemPrompt: string, userPrompt: string): Promise<any> {
    console.log('Groq: Generating next question...');
    return this._generate(systemPrompt, userPrompt, 1500, true);
  }
}

// Google Gemini Provider
export class GoogleProvider implements AIProvider {
  name = 'Google';
  apiKey: string;
  model: string;
  baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || process.env.GOOGLE_API_KEY || '';
    this.model = model || 'gemini-2.0-flash'; // Changed to gemini-2.0-flash
    console.log(`Initializing Google Gemini provider with model: ${this.model}. API Key present: ${!!this.apiKey}`);
    if (!this.apiKey) {
      console.warn('Google Gemini provider initialized without API key. It will not be available.');
    }
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) {
      console.error('Google Gemini availability check failed: No API key provided.');
      return false;
    }
    try {
      // Simple check by trying to get model info. Gemini API lists models at /models or /models/{model_id}
      const response = await fetch(`${this.baseUrl}/${this.model}?key=${this.apiKey}`);
      if (!response.ok) {
        const errorData = await response.text();
        console.error(`Google Gemini provider availability check failed. Status: ${response.status}. Response: ${errorData.substring(0,300)}`);
        return false;
      }
      console.log('Google Gemini provider is available.');
      return true;
    } catch (error: any) {
      console.error('Google Gemini availability check failed with exception:', error.message);
      return false;
    }
  }

  private async _generateContent(systemPrompt: string, userPrompt: string, maxOutputTokens: number, expectJson: boolean): Promise<any> {
    if (!this.apiKey) throw new Error('Google Gemini API key not configured.');

    const requestUrl = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;
    const body = {
      // Gemini API structure: contents array, with parts array for text
      // System prompt can be part of the first message or a separate instruction
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\n" + userPrompt }] } 
      ],
      generationConfig: {
        // Not directly 'temperature' and 'max_tokens' like OpenAI.
        // 'temperature' is available. 'maxOutputTokens' is the equivalent for token limit.
        temperature: 0.7,
        maxOutputTokens: maxOutputTokens,
        // For JSON output, Gemini typically infers from prompt or can be guided by specific model versions.
        // If a direct "response_mime_type": "application/json" is supported for the model, it would be here.
        // For gemini-1.5-flash, it's good at following instructions for JSON in the prompt.
        // If `expectJson` is true, ensure the systemPrompt instructs JSON output.
      }
    };

    if (expectJson) {
        // For Gemini, ensure the system prompt explicitly asks for JSON output.
        // Example: "You must respond in JSON format: { \"questionText\": ..., ... }"
        // Some newer Gemini models might support a response_mime_type in generationConfig.
        // For now, relying on prompt engineering for JSON.
        if (!systemPrompt.toLowerCase().includes('json')) {
            console.warn("GoogleProvider: expectJson is true, but systemPrompt might not be instructing JSON output effectively.");
        }
    }

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Google Gemini API error: ${response.status}. Details: ${errorData.substring(0,500)}`);
      throw new Error(`Google Gemini API error: ${response.status} ${errorData}`);
    }
    const data = await response.json();

    // Gemini response structure: data.candidates[0].content.parts[0].text
    if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      const textContent = data.candidates[0].content.parts[0].text;
      if (expectJson) {
        let cleanedJson = ""; // Declare here
        try {
          // Gemini might wrap JSON in markdown ```json ... ``` or just ``` ... ```
          cleanedJson = textContent.replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
          return JSON.parse(cleanedJson);
        } catch (parseError: any) {
          console.error('Error parsing Google Gemini JSON response. Raw text:', textContent.substring(0, 500));
          console.error('Parse error:', parseError);
          // Fallback: attempt to extract JSON from within the string if it's embedded
          // Note: cleanedJson from the try block might be an empty string if textContent was only ```json``` etc.
          // So, it's better to use the original textContent for fallback search if cleanedJson is empty or fails.
          const stringToSearchForJson = cleanedJson.length > 0 ? cleanedJson : textContent;
          try {
            const jsonMatch = stringToSearchForJson.match(/\{([\s\S]*)\}/); // Try to find a JSON object within, mimic dotAll
            if (jsonMatch && jsonMatch[0]) {
              console.log("Attempting to parse extracted JSON from fallback match...");
              return JSON.parse(jsonMatch[0]);
            }
          } catch (fallbackParseError: any) {
            console.error('Fallback JSON parsing also failed:', fallbackParseError);
            throw new Error('Failed to parse JSON response from Google Gemini (initial and fallback): ' + parseError.message + ". Raw text: " + textContent.substring(0, 200));
          }
          throw new Error('Failed to parse JSON response from Google Gemini: ' + parseError.message + ". Raw text: " + textContent.substring(0, 200));
        }
      }
      return textContent; // For text report
    }
    console.error('Unexpected response structure from Google Gemini:', data);
    throw new Error('Unexpected response structure from Google Gemini API');
  }

  async generateReport(systemPrompt: string, userPrompt: string): Promise<string> {
    console.log('Google Gemini: Generating report...');
    // Ensure systemPrompt does NOT ask for JSON for reports.
    return this._generateContent(systemPrompt, userPrompt, 4000, false) as Promise<string>;
  }

  async generateNextQuestion(systemPrompt: string, userPrompt: string): Promise<any> {
    console.log('Google Gemini: Generating next question...');
    // Ensure systemPrompt for questions DOES ask for JSON.
    // Increased maxOutputTokens from 1500 to 2048
    return this._generateContent(systemPrompt, userPrompt, 2048, true);
  }
}

// AI Provider Manager
export class AIProviderManager {
  private googleProvider: GoogleProvider | undefined;
  private openAIProvider: OpenAIProvider | undefined;
  private groqProvider: GroqProvider | undefined;
  private pollinationsProvider: PollinationsProvider | undefined; // Keep for other potential uses
  private lastReportProviderName: string | undefined;
  private lastQuestionProviderName: string | undefined;
  private useGeorgeKey: boolean;

  constructor() {
    console.log('============================================');
    console.log('AIProviderManager: INITIALIZING PROVIDER MANAGER');
    console.log('============================================');
    
    // Output environment variables status without revealing sensitive information
    console.log('Environment Variables Status:');
    console.log(`USE_GEORGE_KEY: ${process.env.USE_GEORGE_KEY}`);
    console.log(`OPENAI_API_KEY Present: ${process.env.OPENAI_API_KEY ? 'true' : 'false'}`);
    console.log(`OPENAI_MODEL: ${process.env.OPENAI_MODEL || 'gpt-4o'}`);
    console.log('============================================');
    
    // Check if USE_GEORGE_KEY is set to true to enforce OpenAI usage
    this.useGeorgeKey = process.env.USE_GEORGE_KEY === 'true';
    console.log(`Initializing AI Provider Manager (UseGeorgeKey: ${this.useGeorgeKey ? 'true - OpenAI Required' : 'false - OpenAI Still Required'})...`);
    
    // Initialize OpenAI Provider with more robust error handling
    try {
      const openAIAPIKey = process.env.OPENAI_API_KEY || '';
      const openAIModel = process.env.OPENAI_MODEL || 'gpt-4o';
      
      // Log information without exposing the actual key
      if (openAIAPIKey) {
        console.log(`FORCING CORRECT API KEY: Using correct key with length ${openAIAPIKey.length}`);
        
        // Create the OpenAI provider instance
        this.openAIProvider = new OpenAIProvider(openAIAPIKey, openAIModel);
        console.log(`OpenAIProvider: Using API key - First chars: ${openAIAPIKey.substring(0, 7)}..., Last chars: ...${openAIAPIKey.substring(openAIAPIKey.length - 4)}`);
        console.log(`OpenAI Provider instance created with FORCED KEY (Required for Questions and Reports). Model: ${openAIModel}`);
      } else {
        // Critical error for missing API key
        console.error('CRITICAL ERROR: OPENAI_API_KEY not found. OpenAI provider is REQUIRED for question and report generation.');
        console.error('Available environment variables:', Object.keys(process.env).filter(key => !key.startsWith('npm_')).join(', '));
        
        // Even with missing key, create provider with empty key for consistent code handling
        // The provider's isAvailable() method will properly handle this case
        console.warn('Creating OpenAI provider with empty key for consistent error handling');
        this.openAIProvider = new OpenAIProvider('', openAIModel);
      }
    } catch (e: any) {
      console.error("CRITICAL ERROR: Failed to instantiate OpenAIProvider:", e.message);
      // Avoid null provider by creating one with empty credentials
      // This ensures consistent code paths even when initialization fails
      console.warn('Creating fallback OpenAI provider with empty key');
      this.openAIProvider = new OpenAIProvider('', process.env.OPENAI_MODEL || 'gpt-4o');
    }

    // Initialize Google Gemini Provider (Primary)
    const googleApiKey = process.env.GOOGLE_API_KEY;
    const googleModel = process.env.GOOGLE_MODEL || 'gemini-2.0-flash'; // Changed to gemini-2.0-flash
    if (googleApiKey) {
      try {
        this.googleProvider = new GoogleProvider(googleApiKey, googleModel);
        console.log('Google Gemini Provider instance created (Primary).');
      } catch (e: any) {
        console.error("Failed to instantiate GoogleProvider:", e.message);
      }
    } else {
      console.warn('GOOGLE_API_KEY not found. Google Gemini provider (Primary) will not be available.');
    }

    // Initialize Groq Provider (Tertiary Fallback or specific use)
    if (process.env.GROQ_API_KEY) {
      try {
        this.groqProvider = new GroqProvider(process.env.GROQ_API_KEY, process.env.DEV_AI_MODEL || 'qwen-qwq-32b');
        console.log('Groq Provider instance created (available if needed).');
      } catch (e: any) {
        console.error("Failed to instantiate GroqProvider:", e.message);
      }
    } else {
      console.warn('GROQ_API_KEY not found. Groq provider will not be available.');
    }
    
    // Initialize Pollinations Provider (available if needed)
    try {
      this.pollinationsProvider = new PollinationsProvider(undefined, process.env.POLLINATIONS_MODEL || 'openai-large');
      console.log('Pollinations Provider instance created (available if needed).');
    } catch (e: any) {
        console.error("Failed to instantiate PollinationsProvider:", e.message);
    }
    console.log('AIProviderManager constructor finished.');
  }
  
  async initialize(): Promise<void> {
    console.log('Verifying AI provider availability (Google Primary)...');
    let primaryProviderReady = false;

    if (this.googleProvider) {
        console.log("Checking Google Gemini provider (Primary)...");
        if (await this.googleProvider.isAvailable()) {
            primaryProviderReady = true;
            console.log('Google Gemini provider is available (Primary for questions and reports).');
        } else {
            console.warn('Google Gemini provider (Primary) configured but not available.');
        }
    }

    if (!primaryProviderReady && this.openAIProvider) {
        console.log("Primary (Google) not available. Checking OpenAI provider (Fallback)...");
        if (await this.openAIProvider.isAvailable()) {
            primaryProviderReady = true; // Fallback becomes primary if Google fails
            console.log('OpenAI provider is available (Fallback for questions and reports).');
        } else {
             console.warn('OpenAI provider (Fallback) configured but not available.');
        }
    }
    
    if (!primaryProviderReady) {
        console.error('CRITICAL: NO primary or fallback (Google/OpenAI) provider is available or configured! Core functionality will be affected.');
    }
    
    if (this.groqProvider) {
      if (await this.groqProvider.isAvailable()) console.log('Groq provider is available (Tertiary).');
      else console.warn('Groq provider configured but not available.');
    }
    if (this.pollinationsProvider) {
      if (await this.pollinationsProvider.isAvailable()) console.log('Pollinations provider is available.');
      else console.warn('Pollinations provider configured but not available.');
    }
    console.log('AI Provider availability check complete.');
  }
  
  async generateNextQuestion(systemPrompt: string, userPrompt: string): Promise<any> {
    this.lastQuestionProviderName = undefined;

    // Prioritize Pollinations for questions (as requested for testing)
    if (this.pollinationsProvider && await this.pollinationsProvider.isAvailable()) {
      console.log('AI Manager: Requesting next question (delegating to Pollinations).');
      try {
        const question = await this.pollinationsProvider.generateNextQuestion(systemPrompt, userPrompt);
        this.lastQuestionProviderName = this.pollinationsProvider.name;
        return question;
      } catch (error) {
        console.warn('AI Manager: Pollinations failed to generate next question, trying fallback (OpenAI):', error);
      }
    }

    // Fallback to OpenAI for questions
    if (this.openAIProvider && await this.openAIProvider.isAvailable()) {
      console.log('AI Manager: Pollinations failed or unavailable. Trying OpenAI for next question.');
      try {
        const question = await this.openAIProvider.generateNextQuestion(systemPrompt, userPrompt);
        this.lastQuestionProviderName = this.openAIProvider.name;
        return question;
      } catch (error) {
        console.warn('AI Manager: OpenAI failed to generate next question, trying fallback (Google Gemini):', error);
      }
    }

    // Fallback to Google Gemini for questions
    if (this.googleProvider && await this.googleProvider.isAvailable()) {
        console.log('AI Manager: OpenAI failed or unavailable. Trying Google Gemini for next question.');
        try {
            const question = await this.googleProvider.generateNextQuestion(systemPrompt, userPrompt);
            this.lastQuestionProviderName = this.googleProvider.name;
            return question;
        } catch (error) {
            console.error('AI Manager: Google Gemini also failed to generate next question:', error);
        }
    }

    console.error('AI Manager: All configured AI providers (Pollinations, OpenAI, Google Gemini) failed for question generation.');
    throw new Error('All configured AI providers for question generation failed.');
  }

  async generateReport(systemPrompt: string, userPrompt: string): Promise<string> {
    console.log('AIProviderManager: Attempting to generate report.');
    this.lastReportProviderName = undefined;

    // Prioritize OpenAI for reports
    if (this.openAIProvider && await this.openAIProvider.isAvailable()) {
      try {
        console.log('AIProviderManager: Using OpenAI for report generation (priority).');
        const report = await this.openAIProvider.generateReport(systemPrompt, userPrompt);
        this.lastReportProviderName = this.openAIProvider.name;
        return report;
      } catch (error) {
        console.warn('AIProviderManager: OpenAI report generation failed (priority attempt), trying fallback (Google Gemini):', error);
        // Fall through to Google Gemini if OpenAI fails
      }
    }

    // Fallback to Google Gemini for reports
    if (this.googleProvider && await this.googleProvider.isAvailable()) {
      try {
        console.log('AIProviderManager: Using Google Gemini for report generation.');
        const report = await this.googleProvider.generateReport(systemPrompt, userPrompt);
        this.lastReportProviderName = this.googleProvider.name;
        return report;
      } catch (error) {
        console.error('AIProviderManager: Google Gemini report generation failed:', error);
      }
    }

    console.error('AIProviderManager: No primary or fallback AI provider (OpenAI, Google Gemini) available or both failed for report generation.');
    throw new Error('All configured AI providers for report generation failed or are unavailable.');
  }

  getReportProviderName(): string | undefined {
    return this.lastReportProviderName;
  }
  
  getQuestionProviderName(): string | undefined {
    return this.lastQuestionProviderName;
  }
}

// Create and export a singleton instance
const aiManager = new AIProviderManager();
export default aiManager;

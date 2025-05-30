import { logger } from './logger';

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
    logger.debug(`Initializing OpenAI provider with model: ${this.model}. API Key present: ${!!this.apiKey}`);
    if (!this.apiKey) {
      // This will be caught by isAvailable or when a call is made
      logger.warn('OpenAI provider initialized without API key. It will not be available.');
    }
  }
  
  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) {
      logger.error('OpenAI availability check failed: No API key provided.');
      return false;
    }
    
    logger.debug(`OpenAI: Checking availability with API key: ${this.apiKey.substring(0, 7)}...${this.apiKey.substring(this.apiKey.length - 4)}`);
    
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      
      logger.debug(`OpenAI availability response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.text();
        logger.error(`OpenAI provider availability check failed. Status: ${response.status}. Response: ${errorData.substring(0,300)}`);
        return false;
      }
      logger.provider('OpenAI provider is available and working correctly.');
      return true;
    } catch (error: any) {
      logger.error('OpenAI availability check failed with exception:', error.message);
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
      logger.error(`OpenAI API error for generateReport: ${response.status}. Details: ${errorData.substring(0,500)}`);
      throw new Error(`OpenAI API error: ${response.status} ${errorData}`);
    }
    const data = await response.json();
    return data.choices[0].message.content;
  }
  
  async generateNextQuestion(systemPrompt: string, userPrompt: string): Promise<any> {
    if (!this.apiKey) throw new Error('OpenAI API key not configured.');
    logger.debug('OpenAI: Generating next question...');
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
      logger.error(`OpenAI API error for generateNextQuestion: ${response.status}. Details: ${errorData.substring(0,500)}`);
      throw new Error(`OpenAI API error: ${response.status} ${errorData}`);
    }
    const data = await response.json();
    try {
      if (data && data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content;
        if (typeof content !== 'string') return content;
        if (content.startsWith('<!DOCTYPE') || content.startsWith('<html')) {
          logger.error('OpenAI returned HTML instead of JSON for question:', content.substring(0, 100));
          throw new Error('Invalid response format: received HTML instead of JSON from OpenAI');
        }
        
        const parsedJson = JSON.parse(content);
        return parsedJson;
      }
      logger.error('Unexpected response structure from OpenAI (question):', data);
      throw new Error('Unexpected response structure from OpenAI API (question)');
    } catch (parseError: any) {
      logger.error('Error processing/parsing OpenAI question response:', parseError);
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
    logger.debug(`Initializing Pollinations provider with model: ${this.model} and API URL: ${this.apiUrl}`);
  }
  
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: this.model, messages: [{ role: "user", content: "ping" }], max_tokens: 5 })
      });
      if (!response.ok) {
        logger.error(`Pollinations provider availability check failed. Status: ${response.status}`);
        return false;
      }
      logger.provider('Pollinations provider is available.');
      return true;
    } catch (error: any) {
      logger.error('Pollinations availability check failed with exception:', error.message);
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
      logger.error(`Pollinations API error: ${response.status}. Details: ${errorData.substring(0,500)}`);
      throw new Error(`Pollinations API error: ${response.status} ${errorData}`);
    }
    const data = await response.json();
    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      const content = data.choices[0].message.content;
      if (typeof content !== 'string') return content; // Already object
      if (content.startsWith('<!DOCTYPE') || content.startsWith('<html')) {
        logger.error('Pollinations returned HTML instead of JSON:', content.substring(0, 100));
        throw new Error('Invalid response format: received HTML instead of JSON from Pollinations');
      }
      
      const parsedJson = JSON.parse(content);
      return parsedJson;
    }
    logger.error('Unexpected response structure from Pollinations:', data);
    throw new Error('Unexpected response structure from Pollinations API');
  }

  async generateReport(systemPrompt: string, userPrompt: string): Promise<string> {
    logger.debug('Pollinations: Generating report...');
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
      logger.error(`Pollinations API error for generateReport: ${response.status}. Details: ${errorData.substring(0,500)}`);
      throw new Error(`Pollinations API error: ${response.status} ${errorData}`);
    }
    const data = await response.json();
    if (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        return data.choices[0].message.content;
    }
    logger.error('Unexpected response structure for report from Pollinations:', data);
    throw new Error('Unexpected report response structure from Pollinations API');
  }
  
  async generateNextQuestion(systemPrompt: string, userPrompt: string): Promise<any> {
    logger.debug('Pollinations: Generating next question...');
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
    logger.debug(`Initializing Groq provider with model: ${this.model}. API Key present: ${!!this.apiKey}`);
    if (!this.apiKey) {
      logger.warn('Groq provider initialized without API key. It will not be available.');
    }
  }
  
  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) {
      logger.error('Groq availability check failed: No API key provided.');
      return false;
    }
    try {
      const response = await fetch('https://api.groq.com/openai/v1/models', { // Corrected URL
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
       if (!response.ok) {
        const errorData = await response.text();
        logger.error(`Groq provider availability check failed. Status: ${response.status}. Response: ${errorData.substring(0,300)}`);
        return false;
      }
      logger.provider('Groq provider is available.');
      return true;
    } catch (error: any) {
      logger.error('Groq availability check failed with exception:', error.message);
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
      logger.error(`Groq API error: ${response.status}. Details: ${errorData.substring(0,500)}`);
      throw new Error(`Groq API error: ${response.status} ${errorData}`);
    }
    const data = await response.json();
    
    if (isJsonOutput) {
        try {
            if (data && data.choices && data.choices[0] && data.choices[0].message) {
              const content = data.choices[0].message.content;
              if (typeof content !== 'string') return content; // Already object
              if (content.startsWith('<!DOCTYPE') || content.startsWith('<html')) {
                logger.error('Groq returned HTML instead of JSON:', content.substring(0, 100));
                throw new Error('Invalid response format: received HTML instead of JSON from Groq');
              }
              return JSON.parse(content);
            }
            logger.error('Unexpected response structure from Groq (JSON mode):', data);
            throw new Error('Unexpected response structure from Groq API (JSON mode)');
        } catch (parseError: any) {
            logger.error('Error processing/parsing Groq JSON response:', parseError);
            throw parseError;
        }
    } else {
        // For text output like generateReport
        if (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            return data.choices[0].message.content;
        }
        logger.error('Unexpected response structure for text report from Groq:', data);
        throw new Error('Unexpected text report response structure from Groq API');
    }
  }
  
  async generateReport(systemPrompt: string, userPrompt: string): Promise<string> {
    logger.info('Groq: Generating report...');
    return this._generate(systemPrompt, userPrompt, 4000, false) as Promise<string>;
  }
  
  async generateNextQuestion(systemPrompt: string, userPrompt: string): Promise<any> {
    logger.info('Groq: Generating next question...');
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
    logger.debug(`Initializing Google Gemini provider with model: ${this.model}. API Key present: ${!!this.apiKey}`);
    if (!this.apiKey) {
      logger.warn('Google Gemini provider initialized without API key. It will not be available.');
    }
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) {
      logger.error('Google Gemini availability check failed: No API key provided.');
      return false;
    }
    try {
      // Simple check by trying to get model info. Gemini API lists models at /models or /models/{model_id}
      const response = await fetch(`${this.baseUrl}/${this.model}?key=${this.apiKey}`);
      if (!response.ok) {
        const errorData = await response.text();
        logger.error(`Google Gemini provider availability check failed. Status: ${response.status}. Response: ${errorData.substring(0,300)}`);
        return false;
      }
      logger.provider('Google Gemini provider is available.');
      return true;
    } catch (error: any) {
      logger.error('Google Gemini availability check failed with exception:', error.message);
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
            logger.warn("GoogleProvider: expectJson is true, but systemPrompt might not be instructing JSON output effectively.");
        }
    }

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.text();
      logger.error(`Google Gemini API error: ${response.status}. Details: ${errorData.substring(0,500)}`);
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
          logger.error('Error parsing Google Gemini JSON response. Raw text:', textContent.substring(0, 500));
          logger.error('Parse error:', parseError);
          // Fallback: attempt to extract JSON from within the string if it's embedded
          // Note: cleanedJson from the try block might be an empty string if textContent was only ```json``` etc.
          // So, it's better to use the original textContent for fallback search if cleanedJson is empty or fails.
          const stringToSearchForJson = cleanedJson.length > 0 ? cleanedJson : textContent;
          try {
            const jsonMatch = stringToSearchForJson.match(/\{([\s\S]*)\}/); // Try to find a JSON object within, mimic dotAll
            if (jsonMatch && jsonMatch[0]) {
              logger.debug("Attempting to parse extracted JSON from fallback match...");
              return JSON.parse(jsonMatch[0]);
            }
          } catch (fallbackParseError: any) {
            logger.error('Fallback JSON parsing also failed:', fallbackParseError);
            throw new Error('Failed to parse JSON response from Google Gemini (initial and fallback): ' + parseError.message + ". Raw text: " + textContent.substring(0, 200));
          }
          throw new Error('Failed to parse JSON response from Google Gemini: ' + parseError.message + ". Raw text: " + textContent.substring(0, 200));
        }
      }
      return textContent; // For text report
    }
    logger.error('Unexpected response structure from Google Gemini:', data);
    throw new Error('Unexpected response structure from Google Gemini API');
  }

  async generateReport(systemPrompt: string, userPrompt: string): Promise<string> {
    logger.info('Google Gemini: Generating report...');
    // Ensure systemPrompt does NOT ask for JSON for reports.
    return this._generateContent(systemPrompt, userPrompt, 4000, false) as Promise<string>;
  }

  async generateNextQuestion(systemPrompt: string, userPrompt: string): Promise<any> {
    logger.info('Google Gemini: Generating next question...');
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
    logger.debug('============================================');
    logger.debug('AIProviderManager: INITIALIZING PROVIDER MANAGER');
    logger.debug('============================================');
    
    // Output environment variables status without revealing sensitive information
    logger.debug('Environment Variables Status:');
    logger.debug(`USE_GEORGE_KEY: ${process.env.USE_GEORGE_KEY}`);
    logger.debug(`OPENAI_API_KEY Present: ${process.env.OPENAI_API_KEY ? 'true' : 'false'}`);
    logger.debug(`OPENAI_MODEL: ${process.env.OPENAI_MODEL || 'gpt-4o'}`);
    logger.debug('============================================');
    
    // Check if USE_GEORGE_KEY is set to true to enforce OpenAI usage
    this.useGeorgeKey = process.env.USE_GEORGE_KEY === 'true';
    logger.debug(`Initializing AI Provider Manager (UseGeorgeKey: ${this.useGeorgeKey ? 'true - OpenAI Required' : 'false - OpenAI Still Required'})...`);
    
    // Initialize OpenAI Provider with more robust error handling
    try {
      const openAIAPIKey = process.env.OPENAI_API_KEY || '';
      const openAIModel = process.env.OPENAI_MODEL || 'gpt-4o';
      
      // Log information without exposing the actual key
      if (openAIAPIKey) {
        logger.debug(`FORCING CORRECT API KEY: Using correct key with length ${openAIAPIKey.length}`);
        
        // Create the OpenAI provider instance
        this.openAIProvider = new OpenAIProvider(openAIAPIKey, openAIModel);
        logger.debug(`OpenAIProvider: Using API key - First chars: ${openAIAPIKey.substring(0, 7)}..., Last chars: ...${openAIAPIKey.substring(openAIAPIKey.length - 4)}`);
        logger.debug(`OpenAI Provider instance created with FORCED KEY (Required for Questions and Reports). Model: ${openAIModel}`);
      } else {
        // Critical error for missing API key
        logger.error('CRITICAL ERROR: OPENAI_API_KEY not found. OpenAI provider is REQUIRED for question and report generation.');
        logger.error('Available environment variables:', Object.keys(process.env).filter(key => !key.startsWith('npm_')).join(', '));
        
        // Even with missing key, create provider with empty key for consistent code handling
        // The provider's isAvailable() method will properly handle this case
        logger.warn('Creating OpenAI provider with empty key for consistent error handling');
        this.openAIProvider = new OpenAIProvider('', openAIModel);
      }
    } catch (e: any) {
      logger.error("CRITICAL ERROR: Failed to instantiate OpenAIProvider:", e.message);
      // Avoid null provider by creating one with empty credentials
      // This ensures consistent code paths even when initialization fails
      logger.warn('Creating fallback OpenAI provider with empty key');
      this.openAIProvider = new OpenAIProvider('', process.env.OPENAI_MODEL || 'gpt-4o');
    }

    // Initialize Google Gemini Provider (Primary)
    const googleApiKey = process.env.GOOGLE_API_KEY;
    const googleModel = process.env.GOOGLE_MODEL || 'gemini-2.0-flash'; // Changed to gemini-2.0-flash
    if (googleApiKey) {
      try {
        this.googleProvider = new GoogleProvider(googleApiKey, googleModel);
        logger.debug('Google Gemini Provider instance created (Primary).');
      } catch (e: any) {
        logger.error("Failed to instantiate GoogleProvider:", e.message);
      }
    } else {
      logger.warn('GOOGLE_API_KEY not found. Google Gemini provider (Primary) will not be available.');
    }

    // Initialize Groq Provider (Tertiary Fallback or specific use)
    if (process.env.GROQ_API_KEY) {
      try {
        this.groqProvider = new GroqProvider(process.env.GROQ_API_KEY, process.env.DEV_AI_MODEL || 'qwen-qwq-32b');
        logger.debug('Groq Provider instance created (available if needed).');
      } catch (e: any) {
        logger.error("Failed to instantiate GroqProvider:", e.message);
      }
    } else {
      logger.warn('GROQ_API_KEY not found. Groq provider will not be available.');
    }
    
    // Initialize Pollinations Provider (available if needed)
    try {
      this.pollinationsProvider = new PollinationsProvider(undefined, process.env.POLLINATIONS_MODEL || 'openai-large');
      logger.debug('Pollinations Provider instance created (available if needed).');
    } catch (e: any) {
        logger.error("Failed to instantiate PollinationsProvider:", e.message);
    }
    logger.debug('AIProviderManager constructor finished.');
  }
  
  async initialize(): Promise<void> {
    logger.debug('Verifying AI provider availability (Google Primary)...');
    let primaryProviderReady = false;

    if (this.googleProvider) {
        logger.debug("Checking Google Gemini provider (Primary)...");
        if (await this.googleProvider.isAvailable()) {
            primaryProviderReady = true;
            logger.debug('Google Gemini provider is available (Primary for questions and reports).');
        } else {
            logger.warn('Google Gemini provider (Primary) configured but not available.');
        }
    }

    if (!primaryProviderReady && this.openAIProvider) {
        logger.debug("Primary (Google) not available. Checking OpenAI provider (Fallback)...");
        if (await this.openAIProvider.isAvailable()) {
            primaryProviderReady = true; // Fallback becomes primary if Google fails
            logger.debug('OpenAI provider is available (Fallback for questions and reports).');
        } else {
             logger.warn('OpenAI provider (Fallback) configured but not available.');
        }
    }
    
    if (!primaryProviderReady) {
        logger.error('CRITICAL: NO primary or fallback (Google/OpenAI) provider is available or configured! Core functionality will be affected.');
    }
    
    if (this.groqProvider) {
      if (await this.groqProvider.isAvailable()) logger.debug('Groq provider is available (Tertiary).');
      else logger.warn('Groq provider configured but not available.');
    }
    if (this.pollinationsProvider) {
      if (await this.pollinationsProvider.isAvailable()) logger.debug('Pollinations provider is available.');
      else logger.warn('Pollinations provider configured but not available.');
    }
    logger.debug('AI Provider availability check complete.');
  }
  
  async generateNextQuestion(systemPrompt: string, userPrompt: string): Promise<any> {
    this.lastQuestionProviderName = undefined;

    logger.debug('AI Manager: Attempting question generation - FORCING OpenAI');

    // FORCE OpenAI for questions (as explicitly requested by user)
    if (this.openAIProvider) {
      logger.debug('AI Manager: Checking OpenAI availability for question generation...');
      const isOpenAIAvailable = await this.openAIProvider.isAvailable();
      logger.debug(`AI Manager: OpenAI availability result: ${isOpenAIAvailable}`);

      if (isOpenAIAvailable) {
        logger.debug('AI Manager: Using OpenAI for next question.');
        try {
          const question = await this.openAIProvider.generateNextQuestion(systemPrompt, userPrompt);
          this.lastQuestionProviderName = this.openAIProvider.name;
          logger.debug('AI Manager: OpenAI question generation SUCCESSFUL');
          return question;
        } catch (error) {
          logger.error('AI Manager: CRITICAL - OpenAI failed to generate next question even though it was available:', error);
          // Throw the error as OpenAI is the required provider
          throw new Error(`OpenAI question generation failed (required provider): ${error}`);
        }
      } else {
        logger.error('AI Manager: CRITICAL - OpenAI is not available but is REQUIRED for question generation.');
        throw new Error('OpenAI provider is not available but is required for question generation');
      }
    } else {
      logger.error('AI Manager: CRITICAL - OpenAI provider is not initialized but is REQUIRED.');
      throw new Error('OpenAI provider is not initialized but is required for question generation');
    }
  }

  async generateReport(systemPrompt: string, userPrompt: string): Promise<string> {
    logger.debug('AIProviderManager: Attempting to generate report.');
    this.lastReportProviderName = undefined;

    // Prioritize OpenAI for reports
    if (this.openAIProvider && await this.openAIProvider.isAvailable()) {
      try {
        logger.debug('AIProviderManager: Using OpenAI for report generation (priority).');
        const report = await this.openAIProvider.generateReport(systemPrompt, userPrompt);
        this.lastReportProviderName = this.openAIProvider.name;
        return report;
      } catch (error) {
        logger.warn('AIProviderManager: OpenAI report generation failed (priority attempt), trying fallback (Google Gemini):', error);
        // Fall through to Google Gemini if OpenAI fails
      }
    }

    // Fallback to Google Gemini for reports
    if (this.googleProvider && await this.googleProvider.isAvailable()) {
      try {
        logger.debug('AIProviderManager: Using Google Gemini for report generation.');
        const report = await this.googleProvider.generateReport(systemPrompt, userPrompt);
        this.lastReportProviderName = this.googleProvider.name;
        return report;
      } catch (error) {
        logger.error('AIProviderManager: Google Gemini report generation failed:', error);
      }
    }

    logger.error('AIProviderManager: No primary or fallback AI provider (OpenAI, Google Gemini) available or both failed for report generation.');
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

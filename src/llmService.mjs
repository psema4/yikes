import ollama from 'ollama';
import { LLM_CONFIG, PROMPT_TEMPLATE } from './config.mjs';

class LLMService {
  constructor() {
    this.lastCallTime = 0;
    this.minDelayBetweenCalls = 100; // milliseconds
  }

  async processUserInput(gameState, userInput) {
    try {
      await this.enforceRateLimit();

      const prompt = this.buildPrompt(gameState, userInput);
      const response = await this.callLLM(prompt);
      
      return this.parseResponse(response);
    } catch (error) {
      console.error('Error processing user input:', error);
      throw new Error('Failed to process your input. Please try again.');
    }
  }

  buildPrompt(gameState, userInput) {
    const { 
      transcript, 
      location, 
      health, 
      strength,
      wisdom,
      dexterity,
      charisma,
      money,
      currency_name,
      inventory,
      character
    } = gameState;
    
    return PROMPT_TEMPLATE
      .replace('%TRANSCRIPT%', transcript)
      .replace('%LOCATION%', location)
      .replace('%HEALTH%', health)
      .replace('%STRENGTH%', strength)
      .replace('%WISDOM%', wisdom)
      .replace('%DEXTERITY%', dexterity)
      .replace('%CHARISMA%', charisma)
      .replace('%CURRENCY_NAME%', currency_name)
      .replace('%MONEY%', money)
      .replace('%INVENTORY%', inventory.join(', ') || 'empty')
      .replace('%CHARACTER_NAME%', character.name)
      .replace('%CHARACTER_RACE%', character.race)
      .replace('%CHARACTER_SEX%', character.sex)
      .replace('%CHARACTER_AGE%', character.age)
      .replace('%CHARACTER_OCCUPATION%', character.occupation)
      .replace('%CHARACTER_DESCRIPTION%', character.description)
      .replace('%CHARACTER_BACKSTORY%', character.backstory)
      .replace('%PLAYER_INPUT%', userInput);
  }

  async callLLM(prompt) {
    try {
      const response = await ollama.chat({
        model: LLM_CONFIG.model,
        messages: [{ role: 'user', content: prompt }],
      });

      return response;
    } catch (error) {
      console.error('LLM API Error:', error);
      throw new Error('Failed to communicate with the game master. Please try again.');
    }
  }

  parseResponse(response) {
    try {
      const content = response.message.content;
      const healthRegex = /HEALTH_SUBTRACT\((\d+)\)/g;
      const match = healthRegex.exec(content);
      
      return {
        content: content,
        healthReduction: match ? parseInt(match[1], 10) : 0
      };
    } catch (error) {
      console.error('Error parsing LLM response:', error);
      throw new Error('Failed to understand the game master\'s response. Please try again.');
    }
  }

  async enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;
    
    if (timeSinceLastCall < this.minDelayBetweenCalls) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minDelayBetweenCalls - timeSinceLastCall)
      );
    }
    
    this.lastCallTime = Date.now();
  }
}

export default LLMService;

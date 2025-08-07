import { CHARACTER_DEFAULTS, GENRES, CHARACTER_PROMPTS, LLM_CONFIG } from './config.mjs';
import readline from 'readline';
import ollama from 'ollama';

class CharacterCreation {
  constructor(genre, rl) {
    this.genre = genre;
    this.rl = rl;
    this.partialCharacter = {};
  }

  async createCharacter() {
    console.log('\nCharacter Creation\n');

    // Gather basic character information
    this.partialCharacter = {
      name: await this.askQuestion('Character name: '),
      race: await this.chooseRace(),
      sex: await this.chooseSex(),
      age: await this.chooseAge(),
      occupation: await this.chooseOccupation()
    };

    console.log('\nGenerating character description...');
    const description = await this.generateWithLLM('description');

    console.log('\nGenerating character backstory...');
    const backstory = await this.generateWithLLM('backstory');

    return {
      ...this.partialCharacter,
      description,
      backstory
    };
  }

  async askQuestion(prompt) {
    return new Promise((resolve) => {
      const askAgain = () => {
        this.rl.question(prompt, (answer) => {
          if (!answer.trim()) {
            console.log('This field cannot be empty. Please try again.');
            askAgain();
          } else {
            resolve(answer.trim());
          }
        });
      };
      askAgain();
    });
  }

  async chooseRace() {
    const races = GENRES[this.genre].races;
    const defaultRace = CHARACTER_DEFAULTS.race;
    
    console.log('\nAvailable races:');
    races.forEach((race, index) => {
      console.log(`${index + 1}. ${race}${race === defaultRace ? ' (default)' : ''}`);
    });

    const answer = await new Promise(resolve => {
      this.rl.question(`Choose race (1-${races.length}, or press Enter for ${defaultRace}): `, resolve);
    });
    
    if (!answer.trim()) {
      return defaultRace;
    }

    const choice = parseInt(answer, 10);
    if (isNaN(choice) || choice < 1 || choice > races.length) {
      console.log(`Invalid choice. Using default race: ${defaultRace}`);
      return defaultRace;
    }

    return races[choice - 1];
  }

  async chooseSex() {
    console.log('\nChoose sex:');
    console.log('1. Male');
    console.log('2. Female');
    console.log('3. Other');

    const answer = await new Promise(resolve => {
      this.rl.question('Enter choice (1-3): ', resolve);
    });
    const choice = parseInt(answer, 10);

    switch (choice) {
      case 1: return 'Male';
      case 2: return 'Female';
      case 3: return 'Other';
      default:
        console.log('Invalid choice. Using "Other"');
        return 'Other';
    }
  }

  async chooseAge() {
    const { min_age, max_age } = CHARACTER_DEFAULTS;
    console.log(`\nEnter age (${min_age}-${max_age}, or press Enter for random): `);
    
    const answer = await new Promise(resolve => {
      this.rl.question('Age: ', resolve);
    });
    
    if (!answer.trim()) {
      return Math.floor(Math.random() * (max_age - min_age + 1)) + min_age;
    }

    const age = parseInt(answer, 10);
    if (isNaN(age) || age < min_age || age > max_age) {
      console.log(`Invalid age. Generating random age between ${min_age} and ${max_age}`);
      return Math.floor(Math.random() * (max_age - min_age + 1)) + min_age;
    }

    return age;
  }

  async chooseOccupation() {
    const occupations = GENRES[this.genre].occupations;
    
    console.log('\nAvailable occupations:');
    occupations.forEach((occupation, index) => {
      console.log(`${index + 1}. ${occupation}`);
    });

    const answer = await new Promise(resolve => {
      this.rl.question(`Choose occupation (1-${occupations.length}): `, resolve);
    });
    const choice = parseInt(answer, 10);

    if (isNaN(choice) || choice < 1 || choice > occupations.length) {
      console.log(`Invalid choice. Using ${occupations[0]}`);
      return occupations[0];
    }

    return occupations[choice - 1];
  }

  async generateWithLLM(type) {
    try {
      // Replace placeholders in the prompt
      const prompt = CHARACTER_PROMPTS[type]
        .replace('%RACE%', this.partialCharacter.race)
        .replace('%OCCUPATION%', this.partialCharacter.occupation)
        .replace('%AGE%', this.partialCharacter.age)
        .replace('%SEX%', this.partialCharacter.sex);

      // Call LLM
      const response = await ollama.chat({
        model: LLM_CONFIG.model,
        messages: [{ role: 'user', content: prompt }],
      });

      // Display and confirm the generated content
      console.log(`\nGenerated ${type}:`);
      console.log(response.message.content);
      
      const answer = await new Promise(resolve => {
        this.rl.question('\nAccept this generation? (Y/n): ', resolve);
      });

      if (answer.toLowerCase() === 'n') {
        console.log(`\nRegenerating ${type}...`);
        return this.generateWithLLM(type);
      }

      return response.message.content;
    } catch (error) {
      console.error(`Error generating ${type}:`, error);
      return this.askQuestion(`Failed to generate ${type}. Please enter manually: `);
    }
  }
}

export default CharacterCreation;

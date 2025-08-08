import { CONTEXT_SIZE, INITIAL_GAME_STATE, GENRES, STAT_RANGES } from './config.mjs';

class GameState {
  constructor(genre) {
    if (!GENRES[genre]) {
      throw new Error(`Invalid genre: ${genre}. Available genres: ${Object.keys(GENRES).join(', ')}`);
    }

    this.genre = genre;
    this.state = {
      ...INITIAL_GAME_STATE,
      location: GENRES[genre].starting_location,
      ...this.generateStats()
    };
  }

  generateStats() {
    const generateRandomStat = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    return {
      strength: generateRandomStat(STAT_RANGES.STRENGTH.min, STAT_RANGES.STRENGTH.max),
      wisdom: generateRandomStat(STAT_RANGES.WISDOM.min, STAT_RANGES.WISDOM.max),
      dexterity: generateRandomStat(STAT_RANGES.DEXTERITY.min, STAT_RANGES.DEXTERITY.max),
      charisma: generateRandomStat(STAT_RANGES.CHARISMA.min, STAT_RANGES.CHARISMA.max),
      money: generateRandomStat(STAT_RANGES.MONEY.min, STAT_RANGES.MONEY.max)
    };
  }

  updateHealth(amount) {
    const newHealth = this.state.health - amount;
    if (newHealth <= 0) {
      this.state.health = 0;
      return false; // indicates player death
    }
    this.state.health = newHealth;
    return true;
  }

  addToInventory(item) {
    this.state = {
      ...this.state,
      inventory: [...this.state.inventory, item]
    };
  }

  removeFromInventory(item) {
    const index = this.state.inventory.indexOf(item);
    if (index === -1) {
      return false;
    }
    this.state = {
      ...this.state,
      inventory: this.state.inventory.filter(i => i !== item)
    };
    return true;
  }

  updateLocation(newLocation) {
    this.state.location = newLocation;
  }

  appendToTranscript(text) {
    this.state.transcript += `${text}\n`;
    if (this.state.transcript.length > CONTEXT_SIZE) {
      // Trim to the last complete message by finding the last double newline
      const lastMessageStart = this.state.transcript.slice(-CONTEXT_SIZE).lastIndexOf('\n\n');
      if (lastMessageStart !== -1) {
        this.state.transcript = this.state.transcript.slice(-CONTEXT_SIZE).slice(lastMessageStart + 2);
      } else {
        this.state.transcript = this.state.transcript.slice(-CONTEXT_SIZE);
      }
    }
  }

  getGameState() {
    return {
      ...this.state,
      currency_name: GENRES[this.genre].currency_name
    };
  }

  isPlayerDead() {
    return this.state.health <= 0;
  }
}

export default GameState;

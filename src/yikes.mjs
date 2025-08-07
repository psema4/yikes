#!/usr/bin/env node

import readline from 'readline';
import GameState from './gameState.mjs';
import LLMService from './llmService.mjs';
import GameMechanics from './gameMechanics.mjs';
import CharacterCreation from './characterCreation.mjs';

class Game {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Handle clean shutdown
    process.on('SIGINT', () => this.shutdown('SIGINT'));
    process.on('SIGTERM', () => this.shutdown('SIGTERM'));
  }

  async initialize() {
    try {
      const genre = process.argv[2] || 'fantasy';
      console.log(`Starting game in ${genre} genre...\n`);

      // Create character first
      const characterCreation = new CharacterCreation(genre, this.rl);
      const character = await characterCreation.createCharacter();

      // Initialize game with character
      this.gameState = new GameState(genre);
      this.gameState.state.character = character;

      this.llmService = new LLMService();
      this.gameMechanics = new GameMechanics(this.gameState, this.llmService);

      // Display initial help message
      console.log('\nCharacter creation complete! Type .help for available commands\n');
      
      // Start the game loop
      await this.gameLoop();
    } catch (error) {
      console.error('Failed to initialize game:', error.message);
      this.shutdown('ERROR');
    }
  }

  async gameLoop() {
    try {
      const input = await new Promise(resolve => {
        this.rl.question('\nWhat would you like to do? ', resolve);
      });

      const trimmedInput = input.trim();
      
      if (trimmedInput) {
        const result = await this.gameMechanics.processCommand(trimmedInput);
        
        console.log('\n' + result.content);
        
        if (result.gameOver) {
          this.shutdown('GAME_OVER');
          return;
        }
      }
      
      // Continue the game loop
      await this.gameLoop();
    } catch (error) {
      console.error('Error processing command:', error);
      console.log('An error occurred. Please try again.');
      await this.gameLoop();
    }
  }

  shutdown(reason) {
    console.log('\nShutting down...', reason === 'ERROR' ? 'due to error.' : '');
    this.rl.close();
    process.exit(reason === 'ERROR' ? 1 : 0);
  }
}

// Start the game
const game = new Game();
game.initialize().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

class GameMechanics {
  constructor(gameState, llmService) {
    this.gameState = gameState;
    this.llmService = llmService;
  }

  async processCommand(input) {
    // Handle system commands
    if (input.startsWith('.')) {
      return this.handleSystemCommand(input);
    }

    // Process regular game input through LLM
    try {
      const response = await this.llmService.processUserInput(
        this.gameState.getGameState(),
        input
      );

      // Update transcript with player input
      this.gameState.appendToTranscript(input);

      // Process any health changes
      if (response.healthReduction > 0) {
        const isAlive = this.gameState.updateHealth(response.healthReduction);
        if (!isAlive) {
          return {
            content: `${response.content}\n\nYou have perished!`,
            gameOver: true
          };
        }
      }

      // Update transcript with game master response
      this.gameState.appendToTranscript(response.content);

      return {
        content: response.content,
        gameOver: false
      };

    } catch (error) {
      return {
        content: error.message,
        gameOver: false,
        error: true
      };
    }
  }

  handleSystemCommand(input) {
    const command = input.toLowerCase();
    
    switch (command) {
      case '.exit':
      case '.quit':
        return {
          content: 'Exiting game...',
          gameOver: true
        };
        
      case '.health':
        return {
          content: `Current health: ${this.gameState.getGameState().health}`,
          gameOver: false
        };
        
      case '.inventory':
        const inventory = this.gameState.getGameState().inventory;
        return {
          content: `Inventory: ${inventory.length ? inventory.join(', ') : 'empty'}`,
          gameOver: false
        };
        
      case '.location':
        return {
          content: `Current location: ${this.gameState.getGameState().location}`,
          gameOver: false
        };
        
      case '.character':
        const char = this.gameState.getGameState().character;
        return {
          content: `Character Details:
  Name: ${char.name}
  Race: ${char.race}
  Sex: ${char.sex}
  Age: ${char.age}
  Occupation: ${char.occupation}
  Description: ${char.description}
  Backstory: ${char.backstory}`,
          gameOver: false
        };

      case '.stats':
        const state = this.gameState.getGameState();
        return {
          content: `Character Stats:
  Health: ${state.health}
  Strength: ${state.strength}
  Wisdom: ${state.wisdom}
  Dexterity: ${state.dexterity}
  Charisma: ${state.charisma}
  ${state.currency_name.charAt(0).toUpperCase() + state.currency_name.slice(1)}: ${state.money}`,
          gameOver: false
        };

      case '.help':
        return {
          content: `Available commands:
  .exit, .quit - Exit the game
  .health - Show current health
  .inventory - Show inventory contents
  .location - Show current location
  .character - Show character details
  .stats - Show character stats
  .help - Show this help message`,
          gameOver: false
        };
        
      default:
        return {
          content: `Unknown command: ${input}. Type .help for available commands.`,
          gameOver: false
        };
    }
  }
}

export default GameMechanics;

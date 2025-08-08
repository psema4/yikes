import GameState from '../../gameState.mjs';

describe('GameState', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState('fantasy');
  });

  describe('constructor', () => {
    it('should initialize with fantasy genre', () => {
      expect(gameState.state.location).toBe('In front of a ruined Wizard\'s Tower.');
    });

    it('should initialize with scifi genre', () => {
      const scifiState = new GameState('scifi');
      expect(scifiState.state.location).toBe('In the arrivals terminal of the orbital station\'s spaceport.');
    });

    it('should throw error for invalid genre', () => {
      expect(() => new GameState('invalid')).toThrow('Invalid genre');
    });
  });

  describe('updateHealth', () => {
    it('should reduce health by given amount', () => {
      const result = gameState.updateHealth(20);
      expect(gameState.state.health).toBe(80);
      expect(result).toBe(true);
    });

    it('should return false when health reaches 0', () => {
      const result = gameState.updateHealth(100);
      expect(gameState.state.health).toBe(0);
      expect(result).toBe(false);
    });

    it('should not allow health below 0', () => {
      gameState.updateHealth(120);
      expect(gameState.state.health).toBe(0);
    });
  });

  describe('inventory management', () => {
    it('should add items to inventory', () => {
      gameState.addToInventory('sword');
      expect(gameState.state.inventory).toContain('sword');
    });

    it('should remove items from inventory', () => {
      gameState.addToInventory('sword');
      const result = gameState.removeFromInventory('sword');
      expect(result).toBe(true);
      expect(gameState.getGameState().inventory).not.toContain('sword');
    });

    it('should return false when removing non-existent item', () => {
      const result = gameState.removeFromInventory('sword');
      expect(result).toBe(false);
      expect(gameState.getGameState().inventory).not.toContain('sword');
    });
  });

  describe('transcript management', () => {
    it('should append text to transcript', () => {
      gameState.appendToTranscript('test message');
      expect(gameState.state.transcript).toContain('test message');
    });

    it('should trim transcript when exceeding context size', () => {
      const longText = 'x'.repeat(20000);
      gameState.appendToTranscript(longText);
      expect(gameState.state.transcript.length).toBeLessThanOrEqual(16384);
    });

    it('should preserve complete messages when trimming', () => {
      gameState.appendToTranscript('first message\n\n');
      gameState.appendToTranscript('x'.repeat(16000));
      expect(gameState.state.transcript).toContain('first message');
    });
  });

  describe('getGameState', () => {
    it('should return a copy of the state', () => {
      const state = gameState.getGameState();
      state.health = 50; // Modify the copy
      expect(gameState.state.health).toBe(100); // Original should be unchanged
    });

    it('should include currency name based on genre', () => {
      const state = gameState.getGameState();
      expect(state.currency_name).toBe('gold');

      const scifiState = new GameState('scifi');
      expect(scifiState.getGameState().currency_name).toBe('credits');
    });
  });
});

import { jest } from '@jest/globals';

const mockChat = jest.fn();

jest.unstable_mockModule('ollama', () => ({
  default: {
    chat: mockChat
  }
}));

// Import modules after mocking
const GameState = (await import('../../gameState.mjs')).default;
const LLMService = (await import('../../llmService.mjs')).default;
const GameMechanics = (await import('../../gameMechanics.mjs')).default;

describe('GameMechanics Integration', () => {
  let gameState;
  let llmService;
  let gameMechanics;
  let mockOllama;

  beforeEach(() => {
    gameState = new GameState('fantasy');
    llmService = new LLMService();
    gameMechanics = new GameMechanics(gameState, llmService);
    mockChat.mockReset();
  });

  afterEach(() => {
    mockChat.mockReset();
  });

  describe('command processing', () => {
    it('should handle system commands', async () => {
      const result = await gameMechanics.processCommand('.health');
      expect(result.content).toContain('Current health: 100');
      expect(result.gameOver).toBe(false);
    });

    it('should process game input through LLM', async () => {
      mockChat.mockResolvedValue({
        message: {
          content: 'You swing your sword at the goblin.'
        }
      });

      const result = await gameMechanics.processCommand('attack goblin');
      
      expect(mockChat).toHaveBeenCalled();
      expect(result.content).toContain('swing your sword');
      expect(result.gameOver).toBe(false);
      expect(gameState.state.transcript).toContain('attack goblin');
    });

    it('should handle combat damage', async () => {
      mockChat.mockResolvedValue({
        message: {
          content: 'The goblin hits you! HEALTH_SUBTRACT(20)'
        }
      });

      const result = await gameMechanics.processCommand('fight goblin');
      
      expect(gameState.state.health).toBe(80);
      expect(result.content).toContain('goblin hits you');
      expect(result.gameOver).toBe(false);
    });

    it('should handle player death', async () => {
      mockChat.mockResolvedValue({
        message: {
          content: 'The dragon breathes fire! HEALTH_SUBTRACT(100)'
        }
      });

      const result = await gameMechanics.processCommand('approach dragon');
      
      expect(gameState.state.health).toBe(0);
      expect(result.content).toContain('dragon breathes fire');
      expect(result.gameOver).toBe(true);
    });

    it('should handle LLM errors gracefully', async () => {
      mockChat.mockRejectedValue(new Error('API Error'));

      const result = await gameMechanics.processCommand('look around');
      
      expect(result.content).toContain('Failed to process your input');
      expect(result.error).toBe(true);
      expect(result.content).toContain('Please try again');
      expect(result.gameOver).toBe(false);
    });
  });

  describe('state management', () => {
    it('should maintain transcript history', async () => {
      mockChat.mockResolvedValue({
        message: {
          content: 'You see a beautiful forest.'
        }
      });

      await gameMechanics.processCommand('look around');
      await gameMechanics.processCommand('examine trees');
      
      const state = gameState.getGameState();
      expect(state.transcript).toContain('look around');
      expect(state.transcript).toContain('examine trees');
    });

    it('should enforce rate limiting between calls', async () => {
      mockChat.mockResolvedValue({
        message: {
          content: 'Response'
        }
      });

      // Make first call
      await gameMechanics.processCommand('command1');
      const start = Date.now();
      
      // Make second call immediately after
      await gameMechanics.processCommand('command2');
      const duration = Date.now() - start;

      // Should have waited at least 100ms between calls
      expect(duration).toBeGreaterThanOrEqual(100);
    });
  });

  describe('character interaction', () => {
    beforeEach(() => {
      gameState.state.character = {
        name: 'Test Character',
        race: 'Elf',
        occupation: 'Mage',
        description: 'A tall elf',
        backstory: 'Studied at the academy'
      };
    });

    it('should include character details in LLM prompt', async () => {
      await gameMechanics.processCommand('cast spell');
      
      const prompt = mockChat.mock.calls[0][0].messages[0].content;
      expect(prompt).toContain('Test Character');
      expect(prompt).toContain('Elf');
      expect(prompt).toContain('Mage');
    });

    it('should display character details on command', async () => {
      const result = await gameMechanics.processCommand('.character');
      
      expect(result.content).toContain('Test Character');
      expect(result.content).toContain('Elf');
      expect(result.content).toContain('Mage');
    });
  });
});

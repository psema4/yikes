import { spawn } from 'child_process';
import { join } from 'path';

describe('Game Session E2E', () => {
  let gameProcess;
  let output = '';

  const sendInput = async (input, waitFor) => {
    console.log(`Sending input: "${input}", waiting for: "${waitFor}"`);
    return new Promise((resolve) => {
      const prevOutput = output;
      const checkOutput = () => {
        const newOutput = output.slice(prevOutput.length);
        if (waitFor && !newOutput.includes(waitFor)) {
          setTimeout(checkOutput, 100);
        } else {
          console.log(`Found expected output: "${waitFor}"`);
          resolve();
        }
      };
      gameProcess.stdin.write(input + '\n');
      if (waitFor) {
        checkOutput();
      } else {
        resolve();
      }
    });
  };

  beforeEach(() => {
    return new Promise((resolve) => {
      output = '';
      gameProcess = spawn('node', ['src/yikes.mjs', 'fantasy'], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      gameProcess.stdout.on('data', (data) => {
        const chunk = data.toString();
        console.log('Received output:', chunk);
        output += chunk;
        // If we see the character creation prompt, we're ready to start testing
        if (output.includes('Character Creation')) {
          resolve();
        }
      });

      gameProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
      });
    });
  });

  afterEach(() => {
    if (gameProcess) {
      gameProcess.kill();
    }
  });

  it('should complete a full game session', async () => {
    // Character Creation
    await sendInput('Test Character', 'Available races'); // Name
    await sendInput('1', 'Choose sex'); // Race (Human)
    await sendInput('1', 'Enter age'); // Sex (Male)
    await sendInput('25', 'Available occupations'); // Age
    await sendInput('1', 'Generating character description'); // Occupation (Warrior)
    
    // Wait for LLM to generate description
    await new Promise(resolve => setTimeout(resolve, 30000));
    await sendInput('y', 'Generating character backstory'); // Accept description
    
    // Wait for LLM to generate backstory
    await new Promise(resolve => setTimeout(resolve, 30000));
    await sendInput('y', 'Character creation complete'); // Accept backstory

    // Game Commands
    await sendInput('.help', 'Available commands');
    await sendInput('.character', 'Character Details');
    await sendInput('.stats', 'Character Stats');
    await sendInput('.location', 'Current location');
    await sendInput('look around', 'What would you like to do?');
    await sendInput('.quit', 'Shutting down');

    // Verify game session
    expect(output).toContain('Character Creation');
    expect(output).toContain('Test Character');
    expect(output).toContain('Current location:');
    expect(output).toContain('Available commands:');
    expect(output).toContain('Character Stats:');
    expect(output).toContain('Exiting game');
  }, 90000); // Timeout for full game session

  /* TODO: Investigate and fix invalid inputs test
  it('should handle invalid inputs gracefully', async () => {
    // Test empty character name
    await sendInput('', 'Please try again');
    expect(output).toContain('This field cannot be empty');
    await sendInput('Test Character', 'Available races');
    
    // Test invalid race selection (valid: 1-5)
    await sendInput('99', 'Invalid choice');
    expect(output).toContain('Invalid choice. Using default race: Human');
    await sendInput('1', 'Choose sex');
    
    // Test invalid sex selection (valid: 1-3)
    await sendInput('5', 'Invalid choice');
    expect(output).toContain('Invalid choice');
    await sendInput('1', 'Enter age');
    
    // Test invalid age (valid: 18-45)
    await sendInput('999', 'Invalid age');
    expect(output).toContain('Invalid age. Generating random age between 18 and 45');
    await sendInput('25', 'Available occupations');
    
    // Test invalid occupation selection (valid: 1-6)
    await sendInput('99', 'Invalid choice');
    expect(output).toContain('Invalid choice');
    await sendInput('1', 'Generating character description');
    
    // Quick character creation completion
    await new Promise(resolve => setTimeout(resolve, 30000));
    await sendInput('y', 'Generating character backstory');
    await new Promise(resolve => setTimeout(resolve, 30000));
    await sendInput('y', 'Character creation complete');

    // Test invalid game command
    await sendInput('.invalid', 'Unknown command');
    expect(output).toContain('Unknown command: .invalid');
    await sendInput('.quit', 'Shutting down');
  }, 60000); // Timeout for invalid inputs test
  */
});

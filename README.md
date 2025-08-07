# YIKES (Your Infinite Knowledge Entertainment System)

YIKES is a text-based adventure game engine powered by large language models. It provides an interactive gaming experience where an AI game master responds to your actions and guides you through the story.

## Features

- **AI Game Master**: Uses Ollama to create dynamic, responsive gameplay
- **Multiple Genres**: Choose between fantasy and sci-fi settings
- **Character Creation**:
  - Basic attributes (name, race, sex, age, occupation)
  - AI-generated character descriptions
  - AI-generated character backstories
  - Genre-specific races and occupations
- **Stats System**:
  - Health tracking
  - Strength, Wisdom, Dexterity, and Charisma attributes
  - Currency system (gold in fantasy, credits in sci-fi)
  - Inventory management

## Prerequisites

- Node.js
- [Ollama](https://ollama.ai/) with the dolphin3:8b model installed

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/psema4/yikes.git
   cd yikes
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Start the game by running:
```bash
npm start [genre]
```

Where `[genre]` is either `fantasy` or `scifi` (defaults to fantasy if not specified).

### Character Creation

The game will guide you through creating your character:

1. Enter your character's name
2. Choose your race:
   - Fantasy: Human, Elf, Dwarf, Halfling, Gnome
   - Sci-fi: Human, Android, Cyborg, Alien, Mutant
3. Select your sex (Male/Female/Other)
4. Set your age (18-45, or random)
5. Choose your occupation:
   - Fantasy: Warrior, Mage, Rogue, Cleric, Ranger, Bard
   - Sci-fi: Pilot, Engineer, Medic, Soldier, Scientist, Trader
6. Review AI-generated physical description
7. Review AI-generated character backstory

### Available Commands

- `.help` - Show available commands
- `.character` - Show character details
- `.stats` - Show character stats
- `.inventory` - Show inventory contents
- `.location` - Show current location
- `.health` - Show current health
- `.exit` or `.quit` - Exit the game

## Game Mechanics

- Health system with combat damage tracking
- Random stat generation within balanced ranges
- Genre-specific currency and starting locations
- Persistent conversation history for context
- Dynamic response generation based on character traits

## Development

YIKES is built with a modular architecture:

- `src/config.mjs` - Game configuration and constants
- `src/gameState.mjs` - Game state management
- `src/llmService.mjs` - LLM interaction handling
- `src/gameMechanics.mjs` - Core game mechanics
- `src/characterCreation.mjs` - Character creation system
- `src/yikes.mjs` - Main game loop and initialization

## License

ISC License

## Author

Scott Elcomb

## Contributing

Issues and pull requests are welcome at https://github.com/psema4/yikes

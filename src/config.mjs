export const CONTEXT_SIZE = 16384;

export const GENRES = {
  'fantasy': {
    starting_location: 'In front of a ruined Wizard\'s Tower.',
    currency_name: 'gold',
    races: ['Human', 'Elf', 'Dwarf', 'Halfling', 'Gnome'],
    occupations: ['Warrior', 'Mage', 'Rogue', 'Cleric', 'Ranger', 'Bard']
  },
  'scifi': {
    starting_location: 'In the arrivals terminal of the orbital station\'s spaceport.',
    currency_name: 'credits',
    races: ['Human', 'Android', 'Cyborg', 'Alien', 'Mutant'],
    occupations: ['Pilot', 'Engineer', 'Medic', 'Soldier', 'Scientist', 'Trader']
  }
};

export const CHARACTER_DEFAULTS = {
  race: 'Human',
  min_age: 18,
  max_age: 45
};

export const STAT_RANGES = {
  STRENGTH: { min: 8, max: 18 },
  WISDOM: { min: 8, max: 18 },
  DEXTERITY: { min: 8, max: 18 },
  CHARISMA: { min: 8, max: 18 },
  MONEY: { min: 50, max: 200 }
};

export const PROMPT_TEMPLATE = `Transcript:
%TRANSCRIPT%

Character:
  Name: %CHARACTER_NAME%
  Race: %CHARACTER_RACE%
  Sex: %CHARACTER_SEX%
  Age: %CHARACTER_AGE%
  Occupation: %CHARACTER_OCCUPATION%
  Description: %CHARACTER_DESCRIPTION%
  Backstory: %CHARACTER_BACKSTORY%

Location: %LOCATION%
Health: %HEALTH%
Strength: %STRENGTH%
Wisdom: %WISDOM%
Dexterity: %DEXTERITY%
Charisma: %CHARISMA%
%CURRENCY_NAME%: %MONEY%
Inventory: %INVENTORY%

Player Input:
%PLAYER_INPUT%

Assume the role of a TTRPG Game Master and respond to the player appropriately. Consider the character's backstory and traits in your responses. If there is combat, and the player has been wounded, include the following macro in your response: HEALTH_SUBTRACT(<amount>)`;

export const LLM_CONFIG = {
  model: 'dolphin3:8b'
};

export const CHARACTER_PROMPTS = {
  description: `Generate a detailed physical description for a %RACE% %OCCUPATION% who is %AGE% years old and %SEX%. The description should be 2-3 sentences long and focus on distinctive physical features that make the character unique and memorable.`,
  
  backstory: `Create a compelling backstory for a %RACE% %OCCUPATION% who is %AGE% years old and %SEX%. The backstory should explain how they came to be in their current profession and include at least one significant life event that shaped their character. Keep the backstory concise but meaningful, about 3-4 sentences long.`
};

export const INITIAL_GAME_STATE = {
  health: 100,
  strength: 0,
  wisdom: 0,
  dexterity: 0,
  charisma: 0,
  money: 0,
  inventory: [],
  transcript: '',
  location: '',
  character: {
    name: '',
    race: '',
    sex: '',
    age: 0,
    occupation: '',
    description: '',
    backstory: ''
  }
};

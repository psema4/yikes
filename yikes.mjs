#!/usr/bin/env node

// YIKES (Your Infinite Knowledge Entertainment System) provides a simple framework for llm-powered text games

import ollama from 'ollama'
import readline from 'readline';

const genre = process.argv[2] || 'fantasy'

console.log(`playing genre: ${genre}`)

const genres = {
  'fantasy': {
    starting_location: 'In front of a ruined Wizard\'s Tower.'
  },

  'scifi': {
    starting_location: 'In the arrivals terminal of the orbital station\'s spaceport.'
  }
}


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const CONTEXT_SIZE = 16384
const promptTemplate = `Transcript:
%TRANSCRIPT%

Location: %LOCATION%
Health: %HEALTH%
Inventory: %INVENTORY%

Player Input:
%PLAYER_INPUT%

Assume the role of a TTRPG Game Master and respond to the player appropriately. If there is combat, and the player has been wounded, include the following macro in your response: HEALTH_SUBTRACT(<amount>)`

let TRANSCRIPT=''
let LOCATION=genres[genre].starting_location
let HEALTH=100

async function askQuestion() {
  let response;

  rl.question(`\nEnter something (type ".exit" or ".quit" to end): `, async (answer) => {
    if (answer.toLowerCase() === '.exit' || answer.toLowerCase() === '.quit') {
      rl.close();
      console.log('Exiting...');
      process.exit(0)

    } else {
      TRANSCRIPT += `\n${answer}\n`

      let p = `${promptTemplate}`.replace(/%TRANSCRIPT%/, TRANSCRIPT).replace(/%LOCATION%/, LOCATION).replace(/%HEALTH%/, HEALTH).replace(/%PLAYER_INPUT%/, answer)

      response = await ollama.chat({
        model: 'llama3-groq-tool-use:8b',
        messages: [{ role: 'user', content: p }],
      })

      try {
        console.log(response.message.content)

        let regex = /HEALTH_SUBTRACT\((\d+)\)/g;
        let testRegex = regex.exec(response.message.content)
        if (testRegex && testRegex.length > 1) {
          HEALTH = HEALTH - parseInt(testRegex[1], 10)
          if (HEALTH <= 0) {
            console.log(`You have perished!`)
            rl.close()
            console.log(`Exiting...`)
            process.exit(0)
          }
        }

        TRANSCRIPT += `${response.message.content}\n`

        if (TRANSCRIPT.length > CONTEXT_SIZE) {
          TRANSCRIPT = TRANSCRIPT.slice(-1*CONTEXT_SIZE)
        }

      } catch(e) {
        console.warn(`caught: ${e}`)
      }

      (async () => {
        await askQuestion(); // Call ourself recursively for the next prompt
      })()
    }
  });
}

(async () => {
  await askQuestion(); // Start the loop
})()

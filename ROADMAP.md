# YIKES Game Engine Roadmap

This document outlines planned features, improvements, and challenges for upcoming releases of the YIKES game engine.

## Story Orchestrator

### Description
Currently, YIKES games operate similarly to "diceless" tabletop roleplaying games. Core game mechanics like attributes, combat system, and inventory are minimally implemented. Skills and spells are dynamically generated during runtime rather than being predefined systems.

The current implementation allows nearly unlimited player freedom, with few guardrails to maintain narrative consistency or prevent players from exercising deity-like powers within the game world. The LLM will attempt to integrate any player input (within model constraints) into the game narrative.

We need to develop systems to guide both the LLM and player through key beats of pre-defined story narratives, enabling the creation of well-structured games rather than unlimited sandboxes.

### Challenges
- Investigation needed for potential implementation approaches
- Need to balance narrative structure with player agency
- Determine optimal way to encode story beats and decision points
- Design system for graceful handling of unexpected player actions

## Modular Design

### Description
As we add more features, the engine's complexity will increase significantly. We need to implement all roadmap features as components of a modular system to support different environments and use cases.

### Challenges
- Growing system complexity requires careful architectural planning
- Need to support multiple runtime environments (terminal, web, etc.)
- Must accommodate different output formats (e.g., MIDI vs MP3 for music)
- Design must be flexible enough to swap components without affecting core functionality
- Need to plan this early before implementing additional features

## Graphics & Animations

### Description
The `ascii-art` library provides functionality for converting images to ASCII art. By combining this with Stable Diffusion, we could generate backgrounds and sprites that match the LLM's text descriptions, creating visual scenes.

### Challenges
- Stable Diffusion generation is computationally intensive and slow
- Need to implement pre-generation system for backgrounds and sprites
- Current `ascii-art-image` library lacks data URI support
  - Required: Fork and modify library to add this capability
- Scene composition system needed using node-canvas

### Advanced Opportunities
- Implement simple animations (e.g., flapping flags, flowing water)
- Develop efficient sprite animation system
- Create transition effects between scenes

## UI Improvements

### Description
To support graphics and animations while maintaining good user experience, we plan to leverage the blessed library for creating a modern shell interface. This will allow screen division into multiple panes while preserving the core command-line REPL functionality.

### Challenges
- Blessed can be complex to work with effectively
- Need to maintain minimal implementation approach
  - Focus on essential features only
  - Avoid unnecessary complexity
- Must avoid Unicode characters due to layout issues
- Careful consideration needed for pane organization and content flow

## Music Generation

### Description
The `llamusic/llamusic:3b` model (available via ollama) can generate prompts for AI music generation. This opens possibilities for dynamic music generation matching game scenarios.

### Challenges
- Current test implementation shows mixed results:
  - Successfully generates playable files with correct durations
  - Supports drum patterns and multiple melodic instruments
  - Reliable interpretation of model output remains difficult
  - Some generations fail to complete
  - Track sequencing not provided by model
    - Current sequencing implementation needs improvement
    - Generated music quality needs refinement
- Need more robust parsing of model outputs
- Improve track sequencing logic
- Enhance overall music quality and coherence

## Web Games

### Description
While the current terminal-based implementation serves developers well, we need to make YIKES games accessible to wider audiences through web browsers. This would significantly simplify game deployment and distribution.

### Challenges
- LLM integration in web environment:
  - Ollama dependency needs resolution
  - Small web-compatible models exist but need evaluation
  - Output quality/viability unknown for our use case
- May require Node.js server running alongside Ollama
- Need to maintain feature parity with terminal version
- Consider security implications of web deployment

## Priority Order

1. Modular Design
   - Critical foundation for all other features
   - Enables flexible implementation of future components
   - Must be addressed before major feature development

2. Story Orchestrator
   - Critical for creating structured game experiences
   - Foundation for future content development

3. UI Improvements
   - Required infrastructure for other visual features
   - Improves overall user experience

4. Web Games
   - Expands accessibility to wider audience
   - Parallel development possible after modular design

5. Graphics & Animations
   - Builds on UI improvements
   - Enhances game immersion

6. Music Generation
   - Nice-to-have feature
   - Can be refined over time

## Next Steps

1. Design and implement modular architecture
2. Begin investigation of Story Orchestrator implementation options
3. Create minimal blessed UI implementation
4. Research web deployment options and small LLM models
5. Fork and modify ascii-art-image library
6. Continue refinement of music generation system

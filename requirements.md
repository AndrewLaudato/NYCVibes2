# NYC Vibes Game Requirements

## Core Game Mechanics

### Player Controls
- [ ] Player can move in four directions (up, down, left, right) using arrow keys
- [ ] Player movement speed is constant (PLAYER_SPEED = 200)
- [ ] Player cannot move outside map boundaries
- [ ] Camera follows player movement
- [ ] Player earns 1 vibe point per mile walked (1000 pixels = 1 mile)

### Game State
- [ ] Game starts with initial vibes (INITIAL_VIBES = 10)
- [ ] Game ends when vibes reach WIN_VIBES (50) or LOSE_VIBES (0)
- [ ] Distance walked is tracked and displayed
- [ ] Game time is tracked and displayed
- [ ] Inventory system tracks collected items
- [ ] Sun effect duration tracked (SUN_DURATION)
- [ ] Edible effect duration tracked (EDIBLE_DURATION)

### Items
- [ ] Items spawn randomly on the map
- [ ] Spawn interval between ITEM_SPAWN_INTERVAL_MIN (0.5s) and ITEM_SPAWN_INTERVAL_MAX (2s)
- [ ] Items have specific effects when collected:
  - Positive items (increase vibes):
    - Coffee (+1)
    - Pizza (+1)
    - Pretzel (+1)
    - Bagels (+1)
    - Museum (+2)
  - Negative items (decrease vibes):
    - Poop (-1)
    - Tourist (-1)
    - Construction (-1)
    - Rain (-1)
  - Special items:
    - Edible (temporary psychedelic effect)
    - Grenade (one-time use against devil)
    - Sun (temporary bright screen effect)
    - Dog (spawns poop after delay)
  - Transportation items:
    - Subway (escapes devil)
    - Taxi (escapes devil)

### Devil Mechanics
- [ ] Devil spawns after DEVIL_INITIAL_DELAY (10s)
- [ ] Devil moves at 85% of original speed (DEVIL_SPEED = 250)
- [ ] Devil spawns at least 300 pixels away from player
- [ ] Devil disappears after 10 seconds if not caught
- [ ] Devil causes -15 vibes on collision with player
- [ ] Devil can be destroyed by:
  - Player using grenade (permanent destruction)
  - Player entering subway/taxi
- [ ] Devil music plays when active
- [ ] Devil has explosion effect when destroyed

### Sound Effects
- [ ] Background music plays during game
- [ ] Positive sound plays on collecting positive items
- [ ] Negative sound plays on collecting negative items
- [ ] Dark music plays when devil appears
- [ ] Boom sound plays when devil is destroyed

### Visual Effects
- [ ] Sun effect:
  - Bright yellow screen overlay
  - Lasts for SUN_DURATION
  - Automatically fades out
- [ ] Edible effect:
  - Psychedelic color cycling overlay
  - Colors change rapidly (10 changes per second)
  - Lasts for EDIBLE_DURATION
  - Automatically fades out
- [ ] Devil explosion effect
- [ ] UI color changes based on vibes level

### UI Elements
- [ ] Vibes counter (changes color based on value)
- [ ] Distance walked counter
- [ ] Time counter (formatted as Duration: MM:SS)
- [ ] Inventory display
- [ ] Game title
- [ ] Semi-transparent UI background
- [ ] UI bar across top of screen with:
  - Left side: Vibes and Inventory
  - Right side: Miles and Duration

### Scenes
- [ ] Start scene (no text, uses background image)
- [ ] Main game scene
- [ ] Win scene (vibes >= 50)
- [ ] Lose scene (vibes <= 0)

### Map
- [ ] Map size: 2400x1800 pixels
- [ ] Map background image
- [ ] Items spawn within map boundaries
- [ ] Player cannot move outside map

### Collision Detection
- [ ] Player collides with items
- [ ] Player collides with devil
- [ ] Player collides with subway/taxi
- [ ] Items don't overlap with each other
- [ ] Devil doesn't overlap with player on spawn

### Performance
- [ ] Game runs smoothly at 60 FPS
- [ ] No memory leaks
- [ ] Sound effects don't overlap incorrectly
- [ ] Multiple items can spawn without performance issues
- [ ] Screen effects don't cause performance issues 
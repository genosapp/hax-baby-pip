# Pip — Junior Dream Engineer

A cozy, interactive portfolio for **Pip**, the canon skull baby of hax.baby's "Baby's First Website"
Track 1 challenge.

## Story Behind the Build
Pip is a skull-faced baby who runs the night shift at the Midnight Nursery, building lullabies,
nightlights and dream-delivery routes so the neighbourhood's little ghosts can sleep without fear.
We leaned into the "early-web soul" of the brief: a single-page, no-build-step site, synth-generated
sound effects (so there's zero audio licensing to credit), and lots of tactile micro-interactions —
Pip's head tilts toward your cursor, a rattle toy you can shake, a music box that actually chimes,
and a sleepy Easter egg hiding behind Pip's own portrait.

**Proudest features:**
- Pip reacts to mouse/touch in real time (head tilt + eye glow) with no external libraries.
- All sound is generated live via the Web Audio API — a giggle, a chime, a click — with a working mute toggle.
- A localStorage-backed guestbook wall and "dreams delivered" odometer, both nostalgic 90s-web touches.
- A sparkle cursor trail and day/night mood toggle that swaps Pip's whole palette.

## Tech Stack
Plain HTML / CSS / vanilla JS. No framework, no build step — chosen deliberately for a 48-hour sprint
to keep iteration and deploy instant (Vercel static hosting).

## Credits
- Character canon & official asset pack (Pip illustrations): hax.baby "Baby's First Website" Track 1 Creator Pack.
- Font: Google Fonts "Baloo 2" (Open Font License).
- Sound effects: synthesized live in-browser via Web Audio API (no external audio files).
- Code: GenOS Team.

## Run locally
Just open `index.html` in a browser, or `npx serve .`

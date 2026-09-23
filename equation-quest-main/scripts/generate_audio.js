// scripts/generate_audio.js
// Offline pre-generation script for ElevenLabs narration audio files in EquationQuest.
// Strictly follows audio_generation_pipeline (5).md and PRD §11 specifications.

import fs from 'fs';
import path from 'path';

// Helper to read environment variables without external dependencies
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').replace(/^["']|["']$/g, '').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const apiKey = process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice — Clear, Engaging Educator
const VOICE_MODEL = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  instruction:   { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  question:      { stability: 0.55, similarity_boost: 0.75, style: 0.50, use_speaker_boost: true },
  encouragement: { stability: 0.50, similarity_boost: 0.85, style: 0.60, use_speaker_boost: true },
  emphasis:      { stability: 0.75, similarity_boost: 0.90, style: 0.20, use_speaker_boost: true },
  thinking:      { stability: 0.70, similarity_boost: 0.78, style: 0.40, use_speaker_boost: true },
  celebration:   { stability: 0.45, similarity_boost: 0.85, style: 0.80, use_speaker_boost: true },
};

const phrases = [
  // ─── INTRO & WONDER PHASE ────────────────────────────────────────────────
  { text: "Welcome to EquationQuest! Let's investigate the case of the missing mangoes!", style: 'statement' },
  { text: "A shopkeeper counted his mangoes this morning. 18 mangoes were sold today, leaving 14 left in the crate.", style: 'statement' },
  { text: "Can you help Detective HQ find the missing number, and solve for x?", style: 'question' },
  { text: "Every mystery has an unknown quantity. In algebra, we call it x! Let's crack this case together!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 1 ────────────────────────────────────────────────
  { text: "At Detective HQ, junior investigators Wei Jie and Deepa received their very first official case assignment.", style: 'statement' },
  { text: "A local fruit shopkeeper had a dilemma: I started with a full crate of fresh mangoes. We sold 18 mangoes today, and now exactly 14 are left in the crate. But I forgot my opening count!", style: 'statement' },
  { text: "In primary school, we used bar models. But in Secondary 1, we have a far more powerful tool: algebra!", style: 'thinking' },
  { text: "Let's track down the missing number!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 2 ────────────────────────────────────────────────
  { text: "Milo the Fox, Chief Mentor at Detective HQ, adjusted his deerstalker hat and tapped the chalkboard.", style: 'statement' },
  { text: "Rule number one of algebra detective work: always name your unknown first! Write: Let x equal the number of mangoes the shopkeeper started with.", style: 'instruction' },
  { text: "Now we translate the crime scene clue into math: starting with x mangoes and losing 18 means x minus 18.", style: 'statement' },
  { text: "Spot on, Deepa. x minus 18 is our algebraic expression!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 3 ────────────────────────────────────────────────
  { text: "Milo brought out a polished brass balance scale.", style: 'statement' },
  { text: "An equation is like a level scale: both sides must stay perfectly balanced at all times. Since x minus 18 equals 14, the two pans are equal: x minus 18 equals 14.", style: 'instruction' },
  { text: "Whatever you do to one side of the equals sign, you must do to the exact other side!", style: 'statement' },
  { text: "If we add 18 to the left side, we must also add 18 to the right side to keep the balance level.", style: 'celebration' },

  // ─── STORY PHASE: PANEL 4 ────────────────────────────────────────────────
  { text: "Together, the pair performed the balanced operation: x minus 18 plus 18 equals 14 plus 18, which cleanly gave x equals 32!", style: 'statement' },
  { text: "A master detective always checks by substitution. 32 minus 18 equals 14. It matched perfectly!", style: 'thinking' },
  { text: "The shopkeeper started with exactly 32 mangoes, announced Wei Jie proudly.", style: 'statement' },
  { text: "Chief Milo stamped the dossier: Case Closed!", style: 'celebration' },

  // ─── SIMULATE STATION INTROS ─────────────────────────────────────────────
  { text: "Welcome to Station A — The Balance Scale Lab!", style: 'instruction' },
  { text: "Explore how operations tip the balance scale. Perform inverse operations on both pans to isolate x while keeping the scale level!", style: 'instruction' },
  { text: "Welcome to Station B — The Combination Safe!", style: 'instruction' },
  { text: "Slide and step the variable x to evaluate the expression in real time and hit the target safe code!", style: 'instruction' },
  { text: "Welcome to Station C — Build the Case File!", style: 'instruction' },
  { text: "Drag and slot clue chunks to translate real-world mystery scenarios into linear equations, then solve for x!", style: 'instruction' },
  { text: "Welcome to Station D — Spot the Fake Clue!", style: 'instruction' },
  { text: "Inspect suspect worked solutions, spot the seeded algebraic mistake, and supply the correct mathematical fix!", style: 'instruction' },

  // ─── FEEDBACK & HINTS ────────────────────────────────────────────────────
  { text: "Spot on! That's correct! 🎉", style: 'celebration' },
  { text: "Awesome! Three clues solved in a row! ⭐", style: 'celebration' },
  { text: "Incredible detective streak! You are cracking every case! 🔥", style: 'celebration' },
  { text: "Not quite — inspect the clue, check your balance method steps, and try again! 💡", style: 'thinking' },
  { text: "Here's your first clue! Start by naming the unknown and isolating the term with x.", style: 'encouragement' },
  { text: "Here's your final clue! Perform the exact inverse operation on both sides to find x.", style: 'encouragement' },

  // ─── DISTRICT & BOSS BATTLES ─────────────────────────────────────────────
  { text: "World Complete! Spectacular detective work on this case file! 🌟", style: 'celebration' },
  { text: "The Boss Battle begins! Crack the suspect's puzzles to claim your detective badge!", style: 'emphasis' },
  { text: "Victory! You cracked the case and defeated the boss! 👑", style: 'celebration' },

  // ─── REFLECT PHASE ───────────────────────────────────────────────────────
  { text: "Welcome to the Reflect Phase! Let's review the key algebra rules and check your Chief Detective scorecard! 📓", style: 'statement' },
  { text: "Outstanding! You have mastered forming and solving linear equations! You are a true Chief Detective! 🏅", style: 'celebration' },
];

const outputDir = './public/assets/audio';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function cleanString(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 45).replace(/_+/g, '_').replace(/^_|_$/g, '');
}

async function main() {
  console.log(`\n🎙️ Starting ElevenLabs Audio Generation Pipeline for EquationQuest`);
  console.log(`Voice ID: ${VOICE_ID} | Model: ${VOICE_MODEL}`);
  console.log(`Total phrases to process: ${phrases.length}\n`);

  const mapping = {};

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const cleanText = cleanString(text);
    const fileName = `audio_${cleanText}_${i}.mp3`;
    const destPath = path.join(outputDir, fileName);

    const relativeWebPath = `/assets/audio/${fileName}`;
    mapping[text] = relativeWebPath;

    if (!apiKey) {
      // Offline / no-key mode: create audioMap entry mapping
      continue;
    }

    if (fs.existsSync(destPath)) {
      console.log(`[${i + 1}/${phrases.length}] ⏩ Skipped (already exists): ${fileName}`);
      continue;
    }

    console.log(`[${i + 1}/${phrases.length}] 🔊 Generating: "${text.substring(0, 40)}..." -> ${fileName}`);

    const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: VOICE_MODEL,
          voice_settings: settings,
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`HTTP ${response.status}: ${errBody}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(destPath, buffer);
      console.log(`   ✅ Saved: ${destPath}`);
    } catch (e) {
      console.error(`   ❌ Failed to generate phrase "${text}":`, e.message);
    }
  }

  // Write mapping to src/utils/audioMap.js
  const mapContent = `// Auto-generated by generate_audio.js\n// Static asset mapping for offline generated narration phrases in EquationQuest\n\nexport const audioMap = ${JSON.stringify(mapping, null, 2)};\n\nexport default audioMap;\n`;
  fs.writeFileSync('./src/utils/audioMap.js', mapContent);
  console.log("\n✨ Audio mapping updated in src/utils/audioMap.js!");
  console.log("🎉 Audio script completed successfully!\n");
}

main().catch(console.error);

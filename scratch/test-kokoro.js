
import { KokoroTTS } from 'kokoro-js';

async function test() {
  console.log('Testing Kokoro loading from CLI...');
  try {
    const tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
      dtype: 'q8',
      device: 'cpu', // Use CPU for Node test
    });
    console.log('✅ Kokoro loaded successfully!');
    console.log('Model details:', tts.model_id);
  } catch (err) {
    console.error('❌ Kokoro load failed:', err);
    process.exit(1);
  }
}

test();

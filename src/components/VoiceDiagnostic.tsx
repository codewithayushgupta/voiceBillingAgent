// Add this component temporarily to check available voices
// src/components/VoiceDiagnostic.tsx

import React, { useEffect, useState } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/react';

const VoiceDiagnostic: React.FC = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      console.log('All available voices:', availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const testVoice = (voice: SpeechSynthesisVoice, text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    window.speechSynthesis.speak(utterance);
  };

  const hindiVoices = voices.filter(v => 
    v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')
  );

  const googleVoices = voices.filter(v => 
    v.name.toLowerCase().includes('google')
  );

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>🔍 Voice Diagnostic</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <h3>Total Voices: {voices.length}</h3>
        
        <h4>Hindi Voices ({hindiVoices.length}):</h4>
        {hindiVoices.length > 0 ? (
          hindiVoices.map((voice, idx) => (
            <div key={idx} style={{ marginBottom: '8px' }}>
              <strong>{voice.name}</strong> ({voice.lang})
              <IonButton size="small" onClick={() => testVoice(voice, 'नमस्ते')}>
                Test
              </IonButton>
            </div>
          ))
        ) : (
          <p style={{ color: 'red' }}>❌ No Hindi voices found!</p>
        )}

        <h4>Google Voices ({googleVoices.length}):</h4>
        {googleVoices.slice(0, 5).map((voice, idx) => (
          <div key={idx} style={{ marginBottom: '8px' }}>
            <strong>{voice.name}</strong> ({voice.lang})
            <IonButton size="small" onClick={() => testVoice(voice, 'Hello')}>
              Test
            </IonButton>
          </div>
        ))}

        <h4>All Voices:</h4>
        <details>
          <summary>Click to see all {voices.length} voices</summary>
          <ul style={{ fontSize: '12px' }}>
            {voices.map((voice, idx) => (
              <li key={idx}>{voice.name} ({voice.lang})</li>
            ))}
          </ul>
        </details>
      </IonCardContent>
    </IonCard>
  );
};

export default VoiceDiagnostic;
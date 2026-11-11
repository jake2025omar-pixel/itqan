// Web Speech API wrapper for Text-To-Speech and Speech-To-Text

export interface PronunciationResult {
  transcript: string;
  accuracy: number; // 0 - 100
  isMatch: boolean;
  feedbackEn: string;
  feedbackAr: string;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    // Prefer natural en-US or en-GB voices
    const englishVoice =
      this.voices.find(v => v.lang === 'en-US' && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))) ||
      this.voices.find(v => v.lang.startsWith('en')) ||
      this.voices[0];
    this.selectedVoice = englishVoice || null;
  }

  public speak(text: string, rate: number = 0.9): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth) {
        console.warn('Speech synthesis not supported');
        resolve();
        return;
      }

      this.synth.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate; // 0.8 to 1.0 for clearer articulation
      utterance.pitch = 1.0;
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      this.synth.speak(utterance);
    });
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  public listenForPronunciation(
    targetText: string,
    timeoutMs: number = 8000
  ): Promise<PronunciationResult> {
    return new Promise((resolve) => {
      if (!this.isSpeechRecognitionSupported()) {
        resolve({
          transcript: '',
          accuracy: 0,
          isMatch: false,
          feedbackEn: 'Microphone speech recognition is not supported in this browser. You can still practice reading aloud.',
          feedbackAr: 'التعرف على الصوت غير مدعوم في هذا المتصفح. يمكنك التدرب على القراءة بصوت عالٍ والتحقق ذاتياً.',
        });
        return;
      }

      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();

      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;

      let timer: any = null;
      let hasEnded = false;

      const finish = (transcript: string) => {
        if (hasEnded) return;
        hasEnded = true;
        clearTimeout(timer);
        try {
          recognition.stop();
        } catch (_) {}

        const cleanTarget = targetText.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
        const cleanActual = transcript.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

        const similarity = this.calculateSimilarity(cleanTarget, cleanActual);
        const accuracy = Math.round(similarity * 100);
        const isMatch = accuracy >= 65;

        let feedbackEn = '';
        let feedbackAr = '';

        if (accuracy >= 85) {
          feedbackEn = 'Excellent pronunciation! Clear and natural.';
          feedbackAr = 'نطق ممتاز ومتقن جداً! واضح وسلس.';
        } else if (accuracy >= 65) {
          feedbackEn = 'Good job! A little more practice on vowel clarity will make it perfect.';
          feedbackAr = 'أداء جيد جداً! مع قليل من التدريب على مخارج الحروف سيكون نطقك مثالياً.';
        } else if (cleanActual.length > 0) {
          feedbackEn = `We heard: "${transcript}". Try emphasizing each syllable clearly.`;
          feedbackAr = `سمعنا: "${transcript}". حاول نطق كل مقطع صوتي بوضوح أكثر.`;
        } else {
          feedbackEn = 'No clear speech detected. Please speak clearly into your microphone.';
          feedbackAr = 'لم يتم رصد صوت واضح. يرجى التحدث بوضوح أمام الميكروفون.';
        }

        resolve({
          transcript,
          accuracy,
          isMatch,
          feedbackEn,
          feedbackAr,
        });
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        finish(transcript);
      };

      recognition.onerror = () => {
        finish('');
      };

      recognition.onend = () => {
        finish('');
      };

      try {
        recognition.start();
        timer = setTimeout(() => {
          finish('');
        }, timeoutMs);
      } catch (e) {
        finish('');
      }
    });
  }

  // Levenshtein-based similarity metric
  private calculateSimilarity(s1: string, s2: string): number {
    if (s1 === s2) return 1.0;
    if (s1.length === 0 || s2.length === 0) return 0.0;

    // Check token overlap for phrases
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);

    if (words1.length > 1 || words2.length > 1) {
      let matchCount = 0;
      for (const w1 of words1) {
        if (words2.some(w2 => this.levenshteinRatio(w1, w2) > 0.7)) {
          matchCount++;
        }
      }
      const tokenScore = matchCount / Math.max(words1.length, words2.length);
      const stringScore = this.levenshteinRatio(s1, s2);
      return (tokenScore * 0.7) + (stringScore * 0.3);
    }

    return this.levenshteinRatio(s1, s2);
  }

  private levenshteinRatio(s1: string, s2: string): number {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    const longerLength = longer.length;
    if (longerLength === 0) return 1.0;

    const costs = new Array();
    for (let i = 0; i <= longer.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= shorter.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (longer.charAt(i - 1) !== shorter.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[shorter.length] = lastValue;
    }

    return (longerLength - costs[shorter.length]) / longerLength;
  }
}

export const speechService = new SpeechService();

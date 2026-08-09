// AI Sign Gloss-to-Sentence NLP Enhancer Service

class NLPGrammarService {
  constructor() {
    this.contextRules = [
      {
        pattern: /ME WANT WATER PLEASE|WATER PLEASE/i,
        fluent: "I would like some drinking water, please.",
        hindi: "मुझे कृपया पीने का पानी चाहिए।"
      },
      {
        pattern: /HELP EMERGENCY|EMERGENCY/i,
        fluent: "There is an urgent emergency! Please send help immediately.",
        hindi: "यहाँ आपातकालीन स्थिति है! कृपया तुरंत मदद भेजें।"
      },
      {
        pattern: /HELLO THANK YOU/i,
        fluent: "Hello! Thank you very much.",
        hindi: "नमस्ते! आपका बहुत-बहुत धन्यवाद।"
      },
      {
        pattern: /NO HEARING PLEASE SIGN|I AM DEAF/i,
        fluent: "I am Deaf and communicate using Sign Language.",
        hindi: "मैं बधिर हूँ और सांकेतिक भाषा (साइन लैंग्वेज) का उपयोग करता हूँ।"
      },
      {
        pattern: /NAMASTE/i,
        fluent: "Namaste! Warm Indian greetings to you.",
        hindi: "नमस्ते! आपको हार्दिक प्रणाम।"
      },
      {
        pattern: /WHERE HELP/i,
        fluent: "Could you please assist me and show me where the exit is?",
        hindi: "क्या आप कृपया मेरी मदद कर सकते हैं?"
      }
    ];
  }

  enhanceGlossStream(glossArray, mode = 'ASL') {
    if (!glossArray || glossArray.length === 0) return '';
    const rawText = glossArray.join(' ').toUpperCase();

    // Match rules
    for (const rule of this.contextRules) {
      if (rule.pattern.test(rawText)) {
        return mode === 'ISL' ? `${rule.fluent} (${rule.hindi})` : rule.fluent;
      }
    }

    // Default basic grammar reconstruction (capitalize first letter, add period, fix basic pronoun "ME" -> "I")
    let sentence = rawText
      .replace(/\bME\b/g, 'I')
      .replace(/\bYOU\b/g, 'you')
      .toLowerCase();

    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
    return sentence;
  }
}

export const nlpGrammarService = new NLPGrammarService();

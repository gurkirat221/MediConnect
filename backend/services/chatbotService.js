// services/chatbotService.js
const Disease = require("../models/Disease");

// helper to normalize yes/no answers
function interpretAnswer(text) {
  if (!text) return null;
  const msg = text.toLowerCase();

  const yesPatterns = ["yes", "yep", "yeah", "yup", "sure", "of course", "definitely"];
  const noPatterns = ["no", "nope", "nah", "not really", "not at all"];

  if (yesPatterns.some(w => msg.includes(w))) return "yes";
  if (noPatterns.some(w => msg.includes(w))) return "no";
  return null;
}

exports.getAIResponse = async (message, conversation) => {
  try {
    const diseases = await Disease.find({});
    const input = message.toLowerCase();

    // ---- Step 1: If first message → do symptom matching ----
    if (conversation.length === 0) {
      // Score all diseases
      const scores = diseases.map(dis => {
        const matched = dis.symptoms.filter(sym =>
          input.includes(sym.toLowerCase())
        );
        return {
          name: dis.name,
          matchCount: matched.length,
          totalSymptoms: dis.symptoms.length,
          disease: dis
        };
      });

      // Sort by best match
      scores.sort((a, b) => b.matchCount - a.matchCount);
      const best = scores[0];

      if (!best || best.matchCount === 0) {
        return {
          source: "database",
          result: "no_match",
          reply: "I couldn’t find any matching disease for your symptoms.",
          possibleDiseases: scores.map(s => ({
            name: s.name,
            matchCount: s.matchCount,
            totalSymptoms: s.totalSymptoms
          })),
          conversation
        };
      }

      // Pick first unanswered key question
      const nextQ = best.disease.keyQuestions.find(q =>
        !best.disease.symptoms.some(sym =>
          q.toLowerCase().includes(sym.toLowerCase()) && input.includes(sym.toLowerCase())
        )
      );

      if (nextQ) {
        return {
          source: "database",
          result: "follow_up",
          disease: best.disease.name,
          question: nextQ,
          confirmedSymptoms: best.disease.symptoms.filter(sym =>
            input.includes(sym.toLowerCase())
          ),
          deniedSymptoms: [],
          possibleDiseases: scores.map(s => ({
            name: s.name,
            matchCount: s.matchCount,
            totalSymptoms: s.totalSymptoms
          })),
          conversation: [
            { role: "user", message },
            { role: "bot", message: nextQ, disease: best.disease.name, confirmedSymptoms: [], deniedSymptoms: [] }
          ]
        };
      }

      // If no questions left → final diagnosis
      return {
        source: "database",
        result: "diagnosis",
        disease: best.disease.name,
        symptoms: best.disease.symptoms.filter(sym =>
          input.includes(sym.toLowerCase())
        ),
        precautions: best.disease.precautions,
        cure: best.disease.cure,
        severity: best.disease.severity,
        possibleDiseases: scores.map(s => ({
          name: s.name,
          matchCount: s.matchCount,
          totalSymptoms: s.totalSymptoms
        })),
        conversation: [
          { role: "user", message }
        ]
      };
    }

    // ---- Step 2: Continue existing conversation ----
    const lastBot = conversation.filter(c => c.role === "bot").slice(-1)[0];
    const lastDisease = lastBot?.disease;

    let disease = null;
    if (lastDisease) {
      disease = await Disease.findOne({ name: lastDisease });
    }

    if (!disease) {
      return {
        source: "system",
        result: "error",
        reply: "Could not identify disease in this conversation.",
        conversation
      };
    }

    const userAnswer = interpretAnswer(message);

    // Recover confirmed & denied symptoms so far
    const prevConfirmed = lastBot?.confirmedSymptoms || [];
    const prevDenied = lastBot?.deniedSymptoms || [];

    let confirmedSymptoms = [...prevConfirmed];
    let deniedSymptoms = [...prevDenied];

    if (userAnswer === "yes") {
      const matchedSymptom = disease.symptoms.find(sym =>
        lastBot.message.toLowerCase().includes(sym.toLowerCase())
      );
      if (matchedSymptom && !confirmedSymptoms.includes(matchedSymptom)) {
        confirmedSymptoms.push(matchedSymptom);
      }
    }

    if (userAnswer === "no") {
      const matchedSymptom = disease.symptoms.find(sym =>
        lastBot.message.toLowerCase().includes(sym.toLowerCase())
      );
      if (matchedSymptom && !deniedSymptoms.includes(matchedSymptom)) {
        deniedSymptoms.push(matchedSymptom);
      }
    }

    // Re-score all diseases based on confirmed symptoms
    const scores = diseases.map(dis => {
      const matchCount = dis.symptoms.filter(sym =>
        confirmedSymptoms.includes(sym)
      ).length;
      return {
        name: dis.name,
        matchCount,
        totalSymptoms: dis.symptoms.length,
        disease: dis
      };
    }).sort((a, b) => b.matchCount - a.matchCount);

    const best = scores[0];

    if (!best) {
      return {
        source: "database",
        result: "no_match",
        reply: "I couldn’t find any matching disease for your symptoms.",
        possibleDiseases: scores.map(s => ({
          name: s.name,
          matchCount: s.matchCount,
          totalSymptoms: s.totalSymptoms
        })),
        conversation
      };
    }

    // Remaining questions = filter out already confirmed/rejected symptoms
    const remainingQuestions = best.disease.keyQuestions.filter(q => {
      const relatedSymptom = best.disease.symptoms.find(sym =>
        q.toLowerCase().includes(sym.toLowerCase())
      );
      if (!relatedSymptom) return true; // general Q
      if (confirmedSymptoms.includes(relatedSymptom)) return false;
      if (deniedSymptoms.includes(relatedSymptom)) return false;
      return true;
    });

    if (remainingQuestions.length > 0) {
      return {
        source: "database",
        result: "follow_up",
        disease: best.disease.name,
        question: remainingQuestions[0],
        confirmedSymptoms,
        deniedSymptoms,
        possibleDiseases: scores.map(s => ({
          name: s.name,
          matchCount: s.matchCount,
          totalSymptoms: s.totalSymptoms
        })),
        conversation: [
          ...conversation,
          { role: "user", message },
          { role: "bot", message: remainingQuestions[0], disease: best.disease.name, confirmedSymptoms, deniedSymptoms }
        ]
      };
    }

    // Otherwise return final diagnosis
    return {
      source: "database",
      result: "diagnosis",
      disease: best.disease.name,
      symptoms: confirmedSymptoms,
      precautions: best.disease.precautions,
      cure: best.disease.cure,
      severity: best.disease.severity,
      possibleDiseases: scores.map(s => ({
        name: s.name,
        matchCount: s.matchCount,
        totalSymptoms: s.totalSymptoms
      })),
      conversation: [
        ...conversation,
        { role: "user", message }
      ]
    };

  } catch (err) {
    console.error("❌ ChatbotService Error:", err);
    throw err;
  }
};

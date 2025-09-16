const mongoose = require("mongoose");
const Disease = require("./models/Disease"); // adjust path if needed
require("dotenv").config();

const diseases = [
  {
    name: "Obesity",
    symptoms: ["Excess body weight", "Breathlessness", "Joint pain", "Snoring"],
    keyQuestions: [
      "Are you overweight?",
      "Do you get tired easily?",
      "Do you have joint pain?",
      "Do you snore often?"
    ],
    precautions: ["Eat a balanced diet", "Exercise regularly", "Avoid junk food"],
    cure: "Obesity is managed with lifestyle changes, diet, and exercise. Severe cases may need medical advice.",
    severity: {
      level: "medium",
      description_en: "Chronic or recurring condition needing long-term care."
    }
  },
  {
    name: "PCOS",
    symptoms: ["Irregular periods", "Weight gain", "Acne", "Hair growth on face"],
    keyQuestions: [
      "Do you have irregular periods?",
      "Have you gained weight suddenly?",
      "Do you get frequent acne?",
      "Do you notice unusual hair growth?"
    ],
    precautions: ["Maintain healthy weight", "Exercise regularly", "Eat balanced diet"],
    cure: "PCOS is managed with lifestyle changes, hormonal therapy, and doctor consultation.",
    severity: {
      level: "medium",
      description_en: "Chronic or recurring condition needing long-term care."
    }
  },
  {
    name: "Migraine",
    symptoms: ["Severe headache", "Nausea", "Sensitivity to light", "Blurred vision"],
    keyQuestions: [
      "Do you have severe one-sided headache?",
      "Do you feel nauseous?",
      "Are you sensitive to light?",
      "Do you have blurred vision?"
    ],
    precautions: ["Avoid stress", "Stay hydrated", "Maintain proper sleep"],
    cure: "Migraines are managed with medicines, rest, and avoiding triggers.",
    severity: {
      level: "medium",
      description_en: "Chronic or recurring condition needing long-term care."
    }
  },
  {
    name: "Pneumonia",
    symptoms: ["Cough with phlegm", "Fever", "Breathlessness", "Chest pain"],
    keyQuestions: [
      "Do you have persistent cough with phlegm?",
      "Do you have high fever?",
      "Do you feel breathless?",
      "Do you have chest pain?"
    ],
    precautions: ["Avoid smoking", "Get vaccinated", "Wash hands regularly"],
    cure: "Pneumonia is treated with antibiotics, rest, and fluids. Severe cases need hospitalization.",
    severity: {
      level: "high",
      description_en: "Potentially life-threatening if untreated."
    }
  },
  {
    name: "Hepatitis B",
    symptoms: ["Fatigue", "Jaundice", "Abdominal pain", "Loss of appetite"],
    keyQuestions: [
      "Do you feel very tired?",
      "Do you have yellow eyes or skin?",
      "Do you feel stomach pain?",
      "Have you lost appetite?"
    ],
    precautions: ["Get vaccinated", "Avoid sharing needles", "Practice safe sex"],
    cure: "Hepatitis B may need antiviral medicines and supportive care. Always consult a doctor.",
    severity: {
      level: "high",
      description_en: "Potentially life-threatening if untreated."
    }
  },
  {
    name: "Hepatitis C",
    symptoms: ["Fatigue", "Jaundice", "Dark urine", "Abdominal pain"],
    keyQuestions: [
      "Do you have yellow eyes or skin?",
      "Do you feel very tired?",
      "Do you have dark urine?",
      "Do you have stomach pain?"
    ],
    precautions: ["Avoid sharing needles", "Use safe blood transfusion", "Practice safe sex"],
    cure: "Hepatitis C is treated with antiviral medicines. Doctor consultation is essential.",
    severity: {
      level: "high",
      description_en: "Potentially life-threatening if untreated."
    }
  },
  {
    name: "Jaundice",
    symptoms: ["Yellow eyes", "Dark urine", "Fatigue", "Abdominal pain"],
    keyQuestions: [
      "Do your eyes look yellow?",
      "Is your urine dark?",
      "Do you feel tired?",
      "Do you have stomach pain?"
    ],
    precautions: ["Drink clean water", "Maintain hygiene", "Avoid alcohol"],
    cure: "Jaundice is treated by addressing the underlying cause. Doctor consultation is necessary.",
    severity: {
      level: "medium",
      description_en: "Chronic or recurring condition needing timely treatment."
    }
  },
  {
    name: "Chickenpox",
    symptoms: ["Skin rash", "Fever", "Itching", "Tiredness"],
    keyQuestions: [
      "Do you have skin rash with blisters?",
      "Do you have fever?",
      "Do you feel tired?",
      "Is the rash itchy?"
    ],
    precautions: ["Avoid contact with infected people", "Maintain hygiene", "Rest well"],
    cure: "Chickenpox usually recovers on its own. Medicines can help with fever and itching.",
    severity: {
      level: "low",
      description_en: "Manageable but may require medical attention if untreated."
    }
  },
  {
    name: "Common Cold",
    symptoms: ["Runny nose", "Sneezing", "Sore throat", "Cough"],
    keyQuestions: [
      "Do you have a runny nose?",
      "Are you sneezing often?",
      "Do you have sore throat?",
      "Do you have cough?"
    ],
    precautions: ["Wash hands regularly", "Avoid cold drinks", "Rest properly"],
    cure: "Common cold usually gets better in a few days with rest and fluids.",
    severity: {
      level: "low",
      description_en: "Mild, easily manageable, common condition."
    }
  },
  {
    name: "Measles",
    symptoms: ["Fever", "Runny nose", "Skin rash", "Cough"],
    keyQuestions: [
      "Do you have fever?",
      "Do you have skin rash?",
      "Do you have cough?",
      "Do you have runny nose?"
    ],
    precautions: ["Get vaccinated", "Avoid contact with infected people", "Maintain hygiene"],
    cure: "Measles needs supportive care with fluids, rest, and doctor consultation.",
    severity: {
      level: "medium",
      description_en: "Chronic or recurring condition needing timely treatment."
    }
  },
  {
    name: "Malaria",
    symptoms: ["Chills", "Fever", "Sweating", "Headache"],
    keyQuestions: [
      "Do you have chills?",
      "Do you have high fever?",
      "Are you sweating a lot?",
      "Do you have headache?"
    ],
    precautions: ["Sleep under mosquito nets", "Use mosquito repellents", "Avoid stagnant water"],
    cure: "Malaria is treated with antimalarial drugs. Please consult a doctor immediately.",
    severity: {
      level: "medium",
      description_en: "Chronic or recurring condition needing timely treatment."
    }
  },
  {
    name: "Dengue",
    symptoms: ["High fever", "Severe headache", "Pain behind eyes", "Skin rash"],
    keyQuestions: [
      "Do you have high fever?",
      "Do you feel pain behind your eyes?",
      "Do you have severe headache?",
      "Do you notice rash?"
    ],
    precautions: ["Use mosquito nets", "Avoid stagnant water", "Wear long sleeves"],
    cure: "Dengue needs supportive treatment with fluids and monitoring. Consult a doctor.",
    severity: {
      level: "high",
      description_en: "Potentially life-threatening if untreated."
    }
  },
  {
    name: "Typhoid",
    symptoms: ["Fever", "Abdominal pain", "Weakness", "Loss of appetite"],
    keyQuestions: [
      "Do you have continuous fever?",
      "Do you feel weak?",
      "Do you have stomach pain?",
      "Have you lost appetite?"
    ],
    precautions: ["Drink clean water", "Wash hands", "Avoid street food"],
    cure: "Typhoid is treated with antibiotics. Early treatment is essential. Consult a doctor.",
    severity: {
      level: "medium",
      description_en: "Chronic or recurring condition needing timely treatment."
    }
  },
  {
    name: "Tuberculosis",
    symptoms: ["Persistent cough", "Chest pain", "Weight loss", "Night sweats"],
    keyQuestions: [
      "Do you have cough for more than 2 weeks?",
      "Are you losing weight?",
      "Do you sweat at night?",
      "Do you have chest pain?"
    ],
    precautions: ["Cover mouth when coughing", "Complete TB treatment", "Ensure proper ventilation"],
    cure: "TB is treated with a long course of antibiotics under medical supervision.",
    severity: {
      level: "high",
      description_en: "Potentially life-threatening if untreated."
    }
  },
  {
    name: "COVID-19",
    symptoms: ["Fever", "Cough", "Breathlessness", "Loss of taste or smell"],
    keyQuestions: [
      "Do you have fever?",
      "Do you have cough?",
      "Are you feeling breathless?",
      "Have you lost taste or smell?"
    ],
    precautions: ["Wear a mask", "Wash hands regularly", "Maintain social distance"],
    cure: "Treatment is supportive care, rest, and monitoring. Severe cases need hospitalization.",
    severity: {
      level: "high",
      description_en: "Severe, urgent, potentially life-threatening disease."
    }
  },
  {
    name: "Diabetes",
    symptoms: ["Excessive thirst", "Frequent urination", "Fatigue", "Weight loss"],
    keyQuestions: [
      "Do you feel thirsty all the time?",
      "Are you urinating often?",
      "Do you feel tired?",
      "Have you lost weight suddenly?"
    ],
    precautions: ["Eat healthy", "Exercise regularly", "Monitor blood sugar"],
    cure: "Diabetes is managed with lifestyle changes, medicines, and regular monitoring.",
    severity: {
      level: "medium",
      description_en: "Chronic or recurring condition needing long-term care."
    }
  },
  {
    name: "Hypertension",
    symptoms: ["Headache", "Dizziness", "Nosebleeds", "Chest pain"],
    keyQuestions: [
      "Do you have frequent headaches?",
      "Do you feel dizzy?",
      "Do you get nosebleeds?",
      "Do you feel chest pain?"
    ],
    precautions: ["Reduce salt intake", "Exercise daily", "Avoid stress"],
    cure: "Hypertension is controlled with lifestyle changes and medicines prescribed by a doctor.",
    severity: {
      level: "medium",
      description_en: "Chronic or recurring condition needing long-term care."
    }
  },
  {
    name: "Asthma",
    symptoms: ["Wheezing", "Coughing", "Shortness of breath", "Chest tightness"],
    keyQuestions: [
      "Do you wheeze while breathing?",
      "Do you cough often?",
      "Do you feel short of breath?",
      "Does your chest feel tight?"
    ],
    precautions: ["Avoid smoke and dust", "Use prescribed inhaler", "Stay away from allergens"],
    cure: "Asthma is managed with inhalers and avoiding triggers. Consult a doctor regularly.",
    severity: {
      level: "medium",
      description_en: "Chronic or recurring condition needing long-term care."
    }
  },
  {
    name: "Depression",
    symptoms: ["Sadness", "Loss of interest", "Fatigue", "Sleep disturbance"],
    keyQuestions: [
      "Do you feel sad most of the time?",
      "Have you lost interest in activities?",
      "Do you feel tired daily?",
      "Are you having trouble sleeping?"
    ],
    precautions: ["Talk to loved ones", "Seek counseling", "Avoid alcohol"],
    cure: "Depression is treated with therapy, counseling, and sometimes medicines. Please consult a mental health professional.",
    severity: {
      level: "medium",
      description_en: "Chronic or recurring condition needing long-term care."
    }
  },
  {
    name: "Anxiety",
    symptoms: ["Excessive worry", "Restlessness", "Sweating", "Palpitations"],
    keyQuestions: [
      "Do you worry excessively?",
      "Do you feel restless?",
      "Do you sweat a lot?",
      "Do you feel your heart racing?"
    ],
    precautions: ["Practice relaxation", "Regular exercise", "Limit caffeine"],
    cure: "Anxiety is managed with counseling, therapy, and medicines if needed.",
    severity: {
      level: "medium",
      description_en: "Chronic or recurring condition needing long-term care."
    }
  }
];

const seedDB = async () => {
  await mongoose.connect(process.env.MONGO_URI); // change db name
  await Disease.deleteMany({});
  await Disease.insertMany(diseases);
  console.log("✅ Database seeded with diseases");
  mongoose.connection.close();
};

seedDB();

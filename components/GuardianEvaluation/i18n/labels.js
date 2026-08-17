// components/GuardianEvaluation/i18n/labels.js
//
// English-only labels for the Guardian Evaluation Marksheet form, mirroring
// the wording of the original PDF. If a guardian wants another language,
// they can use the "Translate" button (Google Translate) in the nav bar
// instead of us maintaining per-field translations here.

export const L = {
  formTitle: "Guardian Evaluation Marksheet",

  studentSectionTitle: "This Is To Evaluate Students",
  yesNoInstruction: "If there is yes or no, please choose the option.",

  studentName: "Student Name",
  age: "Age",
  dob: "Date of Birth",
  currentRank: "Student's Current Rank",
  instructor: "Instructor",
  dojo: "Dojo",

  q1: "1. Student of",
  classOf: "i. Class",
  board: "ii. Board",

  q2: "2. Study Time (including School, Self-study, Tuition)",

  q3: "3. Karate Practice time (Self-study)",
  dailyPracticeTime: "i. Practice time",
  or: "Or",
  onlyBeforeExam: "ii. Only before exam",

  q4: "4. Karate notes/theory studies",

  q5: "5. Other Arts Practice (names)",

  q6: "6. Physical exercise time",

  q7: "7. Using any screen device (TV, mobile etc.)",
  yes: "Yes",
  no: "No",
  dailyMode: "Daily",
  onlyIfNecessary: "Only if necessary",

  q8: "8. Sleep duration (total time)",
  bedTime: "i. Bed time",
  afternoonSleep: "ii. Afternoon sleep",

  q9: "9. Food",
  veg: "Veg",
  nonveg: "Non-Veg",

  q10: "10. Approx time of food intake",
  breakfast: "Breakfast",
  lunch: "Lunch",
  afternoonSnacks: "Afternoon snacks",
  dinner: "Dinner",

  q11: "11. Other tiffin time",
  remarksIfAny: "Remarks if any",

  q12height: "12. Height",
  q12weight: "Weight",
  q13: "13. Sport Performance",
  bad: "Bad",
  veryBad: "Very bad",
  good: "Good",
  veryGood: "Very good",
  excellent: "Excellent",
  q14: "14. Hobby",
  hobbyRemarks: "Remarks",
  q15: "15. Remarks on his/her karate learning (write in short)",

  teacherSectionTitle: "This Is To Evaluate Instructor",
  t1: "1. Punctual",
  t2: "2. Provides attention to each student",
  t3: "3. Hard working in teaching",
  t4: "4. What he/she trains well",
  kihon: "Kihon (Basic)",
  kata: "Kata (Form)",
  idoKihon: "Ido Kihon (Stepping Basic & Combination)",
  kumite: "Kumite (Fighting)",
  theory: "Theory",
  t5: "5. Is your teacher an honest person in teaching",
  t6: "6. Remarks about teacher",

  trainingSectionTitle: "Your Opinion About Training & Teaching",
  tr1: "1. Which training you need",
  dojoTraining: "Dojo (Center Training)",
  districtCamp: "District camp, only one session by chief instructor",
  stateCamp: "State Camp, at least two sessions by chief instructor",
  nationalCamp: "National Camp",
  seminar: "Seminar",
  internationalSession: "International teaching session",

  tr2i: "2i. Have you studied sport karate before",
  detailsIfYes: "If yes, please provide details",
  styleName: "Style Name",
  coachName: "Name of the Coach",
  yearsLearnt: "How many years he learnt",
  tr2ii: "2ii. New in Traditional Full Contact karate",
  tr2iii: "2iii. Any other martial arts practiced",

  tr3: "3. Do you prefer scientific effective lessons in karate?",
  suggestIfNo: "If your answer is no, then please provide details about your requirements",
  tr4: "4. Are you looking for fitness training only, without karate included?",
  suggestIfYes: "If yes then please suggest what type of training you want",
  tr5: "5. You only need belt and certificate for your student",
  tr6: "6. Remarks and suggestion",

  guardianSignature: "Signature of Guardian",
  filledByName: "This form is filled by (Guardian's Name)",
  date: "Date",

  saveDraft: "Save Draft",
  submitForm: "Submit Form",
};

// Plain English label lookup (kept as a function for a stable call-site API).
export function bi(key) {
  return L[key] ?? key;
}

export const emptyEvaluationForm = () => ({
  student: {
    name: "",
    age: "",
    dob: "",
    currentRank: "",
    classOf: "",
    board: "",
    studyTime: "",
    karatePractice: {},
    karateNotes: {},
    otherArtsNames: "",
    otherArtsPractice: {},
    physicalExerciseTime: "",
    screenDevice: {},
    sleep: {},
    food: { times: {}, otherTiffinTimes: [] },
    height: "",
    weight: "",
    sportPerformance: null,
    hobby: "",
    hobbyRemarks: "",
    karateLearningRemarks: "",
  },
  teacher: {
    punctual: null,
    attentionToEachStudent: null,
    hardWorking: null,
    goodTrainingAreas: [],
    honest: null,
    remarks: "",
  },
  training: {
    trainingNeeded: [],
    studiedSportKarateBefore: {},
    newInTraditionalFullContact: null,
    otherMartialArts: {},
    preferScientificEffectiveLesson: null,
    preferScientificSuggestion: "",
    preferOnlyFitness: null,
    preferOnlyFitnessSuggestion: "",
    onlyNeedBeltCertificate: null,
    onlyNeedBeltCertificateSuggestion: "",
    remarksAndSuggestion: "",
  },
  guardianSignatureUrl: "",
  guardianSignaturePublicId: "",
  filledByName: "",
});

// Merge a saved form (from the API) into the form's expected shape,
// filling in any gaps with defaults so controlled inputs never go undefined.
export const mergeIntoDefaults = (saved) => {
  const base = emptyEvaluationForm();
  if (!saved) return base;
  return {
    student: {
      ...base.student,
      ...saved.student,
      food: {
        ...base.student.food,
        ...saved.student?.food,
        times: { ...base.student.food.times, ...saved.student?.food?.times },
      },
    },
    teacher: { ...base.teacher, ...saved.teacher },
    training: { ...base.training, ...saved.training },
    guardianSignatureUrl: saved.guardianSignatureUrl || "",
    guardianSignaturePublicId: saved.guardianSignaturePublicId || "",
    filledByName: saved.filledByName || "",
  };
};

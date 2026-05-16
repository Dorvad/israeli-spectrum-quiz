import { dimensions, questions } from '@/data/questions';

export function answerToScore(answer) {
  if (answer === null || answer === undefined) return null;
  return ((Number(answer) - 4) / 3) * 100;
}

export function classify(score) {
  if (score === null || Number.isNaN(score)) return 'אין מספיק נתונים';
  if (score >= 65) return 'ימין מובהק';
  if (score >= 35) return 'ימין';
  if (score >= 15) return 'מרכז־ימין';
  if (score > -15) return 'מרכז';
  if (score > -35) return 'מרכז־שמאל';
  if (score > -65) return 'שמאל';
  return 'שמאל מובהק';
}

export function tone(score) {
  if (score === null || Number.isNaN(score)) return 'neutral';
  if (score >= 15) return 'right';
  if (score <= -15) return 'left';
  return 'center';
}

export function calculateResults(answers, calibration = {}) {
  const dimensionEntries = Object.values(dimensions).map((dimension) => {
    const relevant = questions.filter((question) => question.dimension === dimension.id);
    const scores = relevant
      .map((question) => answerToScore(answers[question.id]))
      .filter((score) => score !== null);
    const value = scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null;

    return {
      ...dimension,
      value,
      count: scores.length,
      total: relevant.length,
      completion: scores.length / relevant.length,
      classification: classify(value),
      tone: tone(value),
    };
  });

  const availableWeight = dimensionEntries.reduce((sum, dimension) => {
    return dimension.value === null ? sum : sum + dimension.weight;
  }, 0);

  const weighted = availableWeight
    ? dimensionEntries.reduce((sum, dimension) => {
        if (dimension.value === null) return sum;
        return sum + dimension.value * (dimension.weight / availableWeight);
      }, 0)
    : null;

  const answered = Object.values(answers).filter((answer) => answer !== null && answer !== undefined).length;
  const unknown = questions.length - answered;
  const unknownRatio = unknown / questions.length;
  const maxDimensionAbs = Math.max(...dimensionEntries.map((dimension) => Math.abs(dimension.value ?? 0)));
  const mixedCenter = weighted !== null && Math.abs(weighted) <= 14 && maxDimensionAbs >= 40;

  const selfPlacementScore = calibration.selfPlacement
    ? answerToScore(Number(calibration.selfPlacement))
    : null;
  const identityGap = selfPlacementScore !== null && weighted !== null ? selfPlacementScore - weighted : null;

  return {
    score: weighted,
    classification: mixedCenter ? 'מרכז מעורב / חוצה־מחנות' : classify(weighted),
    rawClassification: classify(weighted),
    tone: tone(weighted),
    dimensions: dimensionEntries,
    answered,
    unknown,
    unknownRatio,
    confidence: unknownRatio > 0.2 ? 'נמוכה' : unknownRatio > 0.1 ? 'בינונית' : 'גבוהה',
    mixedCenter,
    identityGap,
    calibration,
  };
}

export function getResultNarrative(results) {
  if (results.score === null) {
    return 'אין עדיין מספיק תשובות כדי לחשב מיקום משמעותי.';
  }

  const prefix = results.mixedCenter
    ? 'התוצאה המרכזית שלך לא נובעת בהכרח ממתינות, אלא משילוב של עמדות חזקות בכיוונים שונים.'
    : `הציון הסופי מציב אותך באזור ${results.rawClassification}.`;

  const strongest = [...results.dimensions]
    .filter((dimension) => dimension.value !== null)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))[0];

  const strongestText = strongest
    ? `הממד שהכי מושך את המפה שלך הוא ${strongest.label}, עם ציון ${Math.round(strongest.value)}.`
    : '';

  const gapText = Math.abs(results.identityGap ?? 0) >= 40
    ? 'יש פער מעניין בין ההזדהות העצמית שלך לבין דפוס התשובות בפועל. זה עשוי להעיד על זהות פוליטית, שייכות חברתית או נושא אחד שמכריע עבורך יותר מהשאר.'
    : '';

  return [prefix, strongestText, gapText].filter(Boolean).join(' ');
}

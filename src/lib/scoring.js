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

const narrativeByClassification = {
  'ימין מובהק': 'תמונת העולם שלך מציבה ביטחון לאומי, ריבונות ואופי יהודי של המדינה בראש סולם הערכים. ישנה העדפה ברורה לתוקפנות ביטחונית, שמירה על זהות יהודית גם על חשבון שוויון אזרחי מלא, ומרחב מצומצם לפיקוח שיפוטי עצמאי. עמדה קוהרנטית שיש לה ייצוג רחב בגוש הימין הקיצוני.',
  'ימין': 'עמדותיך משקפות מחויבות לאינטרס לאומי יהודי, עדיפות לביטחון על פני ויתורים מדיניים, ואמון מוגבל במוסדות הנתפסים כמשמאל. עם זאת, נשמר מרחב לפשרה בסוגיות כלכלה וממשל בהשוואה לימין המובהק.',
  'מרכז־ימין': 'אתה מזדהה עם ערכים לאומיים יהודיים ותפיסות ביטחוניות שמרניות, אך מותיר מקום לפשרה ולהכרה בזכויות אזרחיות. אין נטייה לקיצוניות — לא לשמאל ולא לימין המובהק.',
  'מרכז': 'מיקומך ממוצע מצביע על איזון בין ביטחון לפשרה, בין זהות יהודית לשוויון אזרחי, ובין ריכוז כוח לפיקוח שיפוטי. מרכז לא אומר אדישות — לעיתים הוא עמדת הפשרה המפוכחת.',
  'מרכז־שמאל': 'עמדותיך מדגישות שוויון זכויות, דיאלוג מדיני ופיקוח על כוח ממשלתי. ישנה נטייה לתת עדיפות לאופיה הדמוקרטי של המדינה על פני הגדרות זהות אתניות נוקשות.',
  'שמאל': 'תמונת עולם המדגישה שלום אזרחי, הפרדה מן הכיבוש, ועדיפות להגדיר את ישראל כדמוקרטיה ליברלית. ההערכות הביטחוניות נמדדות בעלויות אנושיות ולא רק בהרתעה.',
  'שמאל מובהק': 'עמדות עקרוניות המקדמות שלום, שוויון מוחלט לכל האזרחים ללא אבחנה אתנית, ובקורת תקיפה על מדיניות הכיבוש, הפריסה הביטחונית וריכוז הכוח. ספקטרום שמיוצג בשוליים הפוליטיים אך לרוב בעל עמדות עקביות פנימית.',
  'מרכז מעורב / חוצה־מחנות': 'ציונך הכולל נמצא במרכז, אך ממדי המשנה חושפים תמונה מורכבת יותר — עמדות חריפות בכיוונים מנוגדים המתאזנות לציון אמצעי. הזהות הפוליטית שלך כנראה מוכתבת על ידי נושא ספציפי אחד, ולא על ידי רצף אידאולוגי עקיב.',
};

export function getResultNarrative(results) {
  if (results.score === null) {
    return 'אין עדיין מספיק תשובות כדי לחשב מיקום משמעותי.';
  }

  const insight = narrativeByClassification[results.classification] ?? '';

  const strongest = [...results.dimensions]
    .filter((dimension) => dimension.value !== null)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))[0];

  const strongestText = strongest
    ? `הממד המשמעותי ביותר עבורך הוא ${strongest.label} (ציון ${Math.round(strongest.value)}).`
    : '';

  const gapText = Math.abs(results.identityGap ?? 0) >= 40
    ? 'זוהה פער בין ההזדהות העצמית לדפוס התשובות בפועל — ייתכן שנושא אחד מכריע עבורך יותר מהשאר.'
    : '';

  return [insight, strongestText, gapText].filter(Boolean).join(' ');
}

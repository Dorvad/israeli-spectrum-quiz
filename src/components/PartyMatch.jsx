import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const partyMap = {
  'ימין מובהק': [
    { name: 'עוצמה יהודית', detail: 'לאומי-דתי קיצוני · איתמר בן גביר' },
    { name: 'ציונות דתית', detail: 'לאומי-דתי · בצלאל סמוטריץ׳' },
    { name: 'נועם', detail: 'שמרני-דתי קיצוני · אבי מעוז' },
  ],
  'ימין': [
    { name: 'הליכוד', detail: 'ימין לאומי · בנימין נתניהו' },
    { name: 'ש"ס', detail: 'חרדי-מזרחי, ימין פוליטי · אריה דרעי' },
    { name: 'יהדות התורה', detail: 'חרדי-אשכנזי · גפני / גולדקנופף' },
  ],
  'מרכז־ימין': [
    { name: 'ישראל ביתנו', detail: 'לאומי-חילוני, אנטי-חרדי · אביגדור ליברמן' },
    { name: 'הליכוד', detail: 'ימין לאומי מתון · בנימין נתניהו' },
  ],
  'מרכז': [
    { name: 'יש עתיד', detail: 'מרכז ליברלי · יאיר לפיד' },
    { name: 'האחדות הלאומית', detail: 'מרכז ביטחוני · בני גנץ' },
  ],
  'מרכז־שמאל': [
    { name: 'העבודה', detail: 'סוציאל-דמוקרטי · מירב מיכאלי' },
    { name: 'הדמוקרטים', detail: 'שמאל-מרכז · יאיר גולן' },
  ],
  'שמאל': [
    { name: 'הדמוקרטים', detail: 'שמאל ליברלי · יאיר גולן' },
    { name: 'מרצ', detail: 'שמאל פרוגרסיבי' },
  ],
  'שמאל מובהק': [
    { name: 'חד"ש-תע"ל', detail: 'שמאל, ערבי-יהודי · איימן עודה / אחמד טיבי' },
    { name: 'רע"מ', detail: 'ערבי-אסלאמי · מנסור עבאס' },
    { name: 'בל"ד', detail: 'לאומנות ערבית' },
  ],
  'מרכז מעורב / חוצה־מחנות': [
    { name: 'יש עתיד', detail: 'מרכז ליברלי · יאיר לפיד' },
    { name: 'ישראל ביתנו', detail: 'לאומי-חילוני · אביגדור ליברמן' },
    { name: 'האחדות הלאומית', detail: 'מרכז ביטחוני · בני גנץ' },
  ],
};

export function PartyMatch({ results }) {
  const parties = partyMap[results.classification];
  if (!parties) return null;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl">מפלגות בעלות אג׳נדה קרובה</CardTitle>
        <p className="text-sm leading-6 text-slate-400">
          על בסיס הציון המשוקלל. ההתאמה היא לפי עמדות כלליות — לא כל ממד נלקח בנפרד. המידע מבוסס על המפה הפוליטית הידועה.
        </p>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-3 sm:grid-cols-2">
          {parties.map((party) => (
            <li
              key={party.name}
              className="flex flex-col gap-1 rounded-[1.2rem] border border-white/[0.10] bg-white/[0.04] px-4 py-3"
            >
              <span className="font-black text-white">{party.name}</span>
              <span className="text-xs text-slate-400">{party.detail}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

# מפת הספקטרום הישראלי

אפליקציית GitHub Pages אינטראקטיבית למיפוי עמדות על ציר ימין־שמאל ישראלי.

הגרסה הזו בנויה כפרויקט React/Vite מודרני ומשתמשת ב:

- **shadcn/ui pattern**: קומפוננטות UI מקומיות תחת `src/components/ui`, עם `components.json` תואם shadcn.
- **GSAP + @gsap/react**: אנימציות כניסה, מעבר, pulse ומיקרו־אינטראקציות.
- **XYFlow / React Flow**: מפת תוצאה אינטראקטיבית שמציגה את הציון הכללי ואת ארבעת הממדים כקונסטלציה.
- **Rive React WebGL2**: קומפוננטת `RiveSigil` כאלמנט מותג/אנימציה. כרגע היא משתמשת באנימציית דוגמה מרוחקת של Rive, וניתן להחליף ל־`.riv` משלך.
- **Tailwind CSS v4**: עיצוב, layout, glassmorphism, gradients ו־RTL.

## מבנה קבצים

```txt
israeli-spectrum-lab/
├── index.html
├── package.json
├── vite.config.js
├── components.json
├── jsconfig.json
├── README.md
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── data/
    │   └── questions.js
    ├── lib/
    │   ├── scoring.js
    │   └── utils.js
    └── components/
        ├── DimensionRail.jsx
        ├── ParticleCanvas.jsx
        ├── QuestionCard.jsx
        ├── ResultsFlow.jsx
        ├── RiveSigil.jsx
        └── ui/
            ├── badge.jsx
            ├── button.jsx
            ├── card.jsx
            └── progress.jsx
```

## התקנה מקומית

```bash
npm install
npm run dev
```

## בנייה לפרודקשן

```bash
npm run build
npm run preview
```

## פריסה ל־GitHub Pages

הפרויקט כולל GitHub Actions מוכן:

```txt
.github/workflows/deploy.yml
```

שלבי פריסה מומלצים:

1. העלה את כל הקבצים לריפו חדש.
2. ודא שהענף הראשי נקרא `main`.
3. עבור ל־Settings → Pages.
4. תחת Build and deployment בחר **GitHub Actions**.
5. בצע push ל־main.

ה־Action יריץ:

```bash
npm ci
npm run build
```

ויפרסם את תיקיית `dist` ל־GitHub Pages.

הקובץ `vite.config.js` כבר מוגדר עם `base: './'`, כך שהנכסים נטענים טוב גם כשהאתר יושב תחת נתיב של ריפו.

אופציה מקומית חלופית:

```bash
npm run deploy
```

הפקודה משתמשת ב־`gh-pages` ומעלה את `dist` לענף `gh-pages`.

## החלפת אנימציית Rive

ב־`src/components/RiveSigil.jsx` החלף את:

```jsx
src="https://cdn.rive.app/animations/vehicles.riv"
```

לנתיב מקומי, למשל:

```jsx
src="/spectrum-orb.riv"
```

ואז שים את הקובץ בתיקיית `public/`.

## שינוי לוגיקת ניקוד

הלוגיקה נמצאת ב־`src/lib/scoring.js`:

```js
Final = 0.45A + 0.25B + 0.20C + 0.10D
```

השאלות והמשקלים נמצאים ב־`src/data/questions.js`.

## הערה מתודולוגית

השאלון לא טוען לאובייקטיביות מוחלטת. הוא מציע מיפוי שקוף ועקבי לפי מודל מוגדר: אותו טקסט, אותו סולם, אותה לוגיקת ניקוד, והצגה נפרדת של ציוני המשנה כדי לא להסתיר פרופילים מורכבים.

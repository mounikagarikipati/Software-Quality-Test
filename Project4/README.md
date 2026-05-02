# Project 4: User Testing with Selenium
**Author:** Mounika Garikipati
**Course:** Software Quality Assurance
**Date:** 2 May 2026

---

## Introduction

This project demonstrates automated browser testing using **Selenium WebDriver (Python)** against my own deployed web application — **QA Arcade** — a gamified React app hosted on GitHub Pages that teaches software testing concepts through One Piece-themed boss battles.

**Live App URL:**
`https://mounikagarikipati.github.io/Software-Quality-Test/vibe%20coding%20assignments/week%207/`

**Why test my own app?**
Since the assignment permits testing any publicly accessible website, and the instructor approved adapting to a custom deployment, QA Arcade is an ideal target:

- It has clearly defined, interactive UI elements (toggle buttons, submit buttons, result cards)
- It contains **intentional bugs** whose outputs are mathematically verifiable
- Every test case maps directly to a testing concept taught in class (state transition, data flow, equivalence)
- No authentication walls or CAPTCHA interference

---

## Setup

### Requirements

```
Python 3.9+
Google Chrome (latest)
ChromeDriver matching your Chrome version
```

### Installation

```bash
# Install Selenium
pip install selenium

# Optional: auto-manage ChromeDriver
pip install webdriver-manager
```

### Running the Tests

```bash
# Run all three test classes
python qa_arcade_selenium_tests.py

# Run a specific test class
python -m unittest qa_arcade_selenium_tests.Test1_MainMenuNavigation -v
python -m unittest qa_arcade_selenium_tests.Test2_ArlongStateBugDetection -v
python -m unittest qa_arcade_selenium_tests.Test3_DoflamingoDataFlowBug -v
```

> **Note:** Set `headless=False` in `make_driver()` to watch the browser run live.
> Set `headless=True` for CI/CD or unattended runs.

---

## Test 1 — Main Menu Navigation

### User Story

> As a student visiting the QA Arcade site, I want to confirm that the main menu loads correctly and all three boss-battle level cards (Arlong Park, Crocodile's Desert, Doflamingo's Strings) are visible with their correct titles and functional buttons, so that I know every level is accessible.

### What This Test Does

| Step | Action | Verification |
|------|--------|--------------|
| 1 | Navigate to the GitHub Pages URL | Page loads without error |
| 2 | Wait for React to hydrate | `.title` element appears |
| 3 | Read H1 heading text | Contains "QA Arcade" |
| 4 | Find all `.menu-card-title` elements | "Arlong", "Crocodile", "Doflamingo" all present |
| 5 | Find all `.menu-play-btn` elements | Exactly 3 buttons, all enabled |
| 6 | Click "Fight Arlong →" | Arlong level screen loads |
| 7 | Click "← Menu" back button | Returns to main menu |

### Testing Concept Covered

**Equivalence Class Testing / Smoke Testing** — verifying that the primary navigation paths work and all expected UI components render. If any card is missing, a deployment error or React rendering failure is implied.

### Pass Criteria

- ✅ H1 heading contains "QA Arcade"
- ✅ All 3 card titles are present
- ✅ All 3 play buttons are enabled
- ✅ Clicking Arlong card navigates correctly
- ✅ Back button returns to menu

---

## Test 2 — Arlong Park: State Transition Bug Detection

### User Story

> As a QA tester playing Arlong Park, I want to select FROM state "Calm" and TO state "Defeated", click Test Transition, and verify that the system reports a mismatch — because the specification says this transition is INVALID, but the buggy implementation incorrectly returns VALID — so I can confirm the state-transition testing mechanic works correctly.

### Bug Under Test

In `ArlongGame.jsx`:

```javascript
// Buggy implementation — BUG 1
function isActualValid_buggy(from, to) {
  if (from === 'Calm' && to === 'Defeated') return true;  // BUG: should be INVALID
  ...
}
```

| | Result |
|--|--|
| **Specification says:** | Calm → Defeated = **INVALID** (Calm can only go to Attacking) |
| **Buggy system says:** | Calm → Defeated = **VALID** |
| **Expected test outcome:** | Mismatch detected → Bug banner appears |

### What This Test Does

| Step | Action | Verification |
|------|--------|--------------|
| 1 | Navigate to main menu, click "Fight Arlong →" | Arlong level loads |
| 2 | Click "Calm" in the FROM state toggle group | Button becomes active |
| 3 | Click "Defeated" in the TO state toggle group | Button becomes active |
| 4 | Click "🦈 Test Transition" button | Form submits |
| 5 | Wait for `.bug-found-badge` to appear | Contains "BUG" |
| 6 | Read both `.feedback-card` elements | Expected = INVALID, Actual = VALID |
| 7 | Read `.stats-bar` text | Shows "1/3" bugs found |

### Testing Concept Covered

**State Transition Testing** — specifically testing an *illegal* transition (a "rainy day" scenario) to prove the system allows a state change it should reject. This matches the Level 3 teaching objective in the app.

### Pass Criteria

- ✅ Arlong level loads
- ✅ FROM = Calm selected, TO = Defeated selected
- ✅ Bug banner appears with text containing "BUG"
- ✅ Expected feedback card shows **INVALID**
- ✅ Actual feedback card shows **VALID**
- ✅ Bug counter increments to **1/3**

---

## Test 3 — Doflamingo's Strings: Data Flow Pipeline Bug

### User Story

> As a QA tester playing Doflamingo's Strings, I want to select Emotion = "Injured", Awakened = "Yes", Distance = "1m", run the power calculation, and confirm that the Expected value is 97 while the Actual value is 108 — exposing three simultaneous data flow bugs in the power pipeline (wrong multiplier, wrong operation order, and wrong distance coefficient).

### Bugs Under Test

In `DoflamingoGame.jsx`:

```javascript
// Correct specification
function getExpectedPower(emotion, awakened, distance) {
  let p = 100;
  p = p * EMOTION_MULT[emotion];    // Step 2: multiply first  (×0.5 for Injured)
  if (awakened === 'Yes') p += 50;  // Step 3: add Awakened bonus
  p -= distance * 3;                // Step 4: subtract distance × 3
  return Math.round(p);
}
// Result for Injured/Yes/1m: 100×0.5=50 → +50=100 → -3 = 97

// Buggy implementation — THREE data flow bugs
const EMOTION_MULT_BUGGY = { Injured: 0.75 };  // Bug A: wrong multiplier (0.75 not 0.5)

function getActualPower_buggy(emotion, awakened, distance) {
  let p = 100;
  if (awakened === 'Yes') p += 50;          // Bug B: Step 3 before Step 2 (wrong order)
  p = p * EMOTION_MULT_BUGGY[emotion];      // Bug A: wrong multiplier
  p -= distance * 5;                        // Bug C: coefficient 5 not 3
  return Math.round(p);
}
// Result for Injured/Yes/1m: (100+50)×0.75=112.5 → -5 = 107.5 → rounds to 108
```

| Bug | Description | Impact |
|-----|-------------|--------|
| A | Injured multiplier is 0.75 instead of 0.5 | Higher base damage calculated |
| B | Awakened bonus added before emotion multiplier | Bonus gets amplified incorrectly |
| C | Distance coefficient is 5 instead of 3 | Damage reduced too much |

### What This Test Does

| Step | Action | Verification |
|------|--------|--------------|
| 1 | Navigate to main menu, click "Fight Doflamingo →" | Doflamingo level loads |
| 2 | Click "🤕 Injured" emotion toggle | Button active |
| 3 | Click "🌸 Yes" Awakened toggle | Button active |
| 4 | Click "1m" Distance toggle | Button active |
| 5 | Click "Show Power Pipeline (Spec)" | Pipeline steps expand |
| 6 | Click "🕸️ Test Power Calculation" | Form submits |
| 7 | Wait for bug banner | Contains "BUG" |
| 8 | Read both feedback cards | Expected = **97**, Actual = **108** |
| 9 | Read stats bar | Shows **1/3** bugs |

### Testing Concept Covered

**Data Flow Testing** — tracking how a value (base power = 100) is defined and transformed through a sequential pipeline. Bugs manifest when: (A) a variable carries a wrong starting value, (B) transformations are applied out of sequence, or (C) a coefficient in a formula is incorrect. This directly corresponds to the Level 5 teaching objective.

### Pass Criteria

- ✅ Doflamingo level loads
- ✅ Injured / Awakened=Yes / Distance=1m selected
- ✅ Pipeline spec panel expands correctly
- ✅ Bug banner appears containing "BUG"
- ✅ Expected feedback card shows **97**
- ✅ Actual feedback card shows **108**
- ✅ Bug counter increments to **1/3**

---

## Summary Table

| Test | Level | Concept | Inputs | Expected Outcome |
|------|-------|---------|--------|-----------------|
| 1 | Main Menu | Smoke / Navigation | Click all 3 cards | All 3 cards visible, navigation works |
| 2 | Arlong Park | State Transition Testing | FROM=Calm, TO=Defeated | Bug detected: INVALID vs VALID |
| 3 | Doflamingo | Data Flow Testing | Injured / Yes / 1m | Bug detected: 97 vs 108 |

---

## File Structure

```
project-4/
├── qa_arcade_selenium_tests.py   ← Full Selenium test suite (Python)
└── README.md                     ← This report
```

---

## Resources

- [Selenium Python Docs](https://selenium-python.readthedocs.io/)
- [QA Arcade Week 7 Source](https://github.com/mounikagarikipati/Software-Quality-Test)
- [WebDriver Manager PyPI](https://pypi.org/project/webdriver-manager/)

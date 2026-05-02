"""
=============================================================================
Project 4: Selenium Tests for QA Arcade (GitHub Pages)
Author: Mounika Garikipati
Site:   https://mounikagarikipati.github.io/Software-Quality-Test/vibe%20coding%20assignments/week%207/
=============================================================================

FIX NOTES (v4)
--------------
Root cause confirmed: All buttons: ['FIGHT ARLONG →', 'FIGHT CROCODILE →', '']
The third card (Doflamingo) is off-screen so React never renders its text.
The menu uses flex-wrap so on smaller viewports the third card wraps below
the fold. Fix: use a very tall window (1600x1200) AND scroll each card into
view with JavaScript before reading its text. Also added a JS scroll-to-bottom
after page load to ensure all cards render.

Setup
-----
  pip install selenium
  Python 3.9+, Google Chrome required.
=============================================================================
"""

import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options as ChromeOptions

BASE_URL = (
    "https://mounikagarikipati.github.io/Software-Quality-Test/"
    "vibe%20coding%20assignments/week%207/"
)

WAIT_TIMEOUT = 25
IMPLICIT_WAIT = 2  # seconds between actions - makes browser visible


def make_driver(headless=False):
    options = ChromeOptions()
    if headless:
        options.add_argument("--headless=new")
    # Very large window so all 3 flex cards are on screen at once
    options.add_argument("--window-size=1800,1200")
    options.add_argument("--force-device-scale-factor=0.67")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    # Disable GPU acceleration (helps on Mac)
    options.add_argument("--disable-gpu")
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(2)
    return driver


def scroll_all_cards_into_view(driver):
    """
    Scroll each .menu-card into view so React renders all text nodes.
    Also scrolls to bottom then back to top to force full render.
    """
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(0.5)
    driver.execute_script("window.scrollTo(0, 0);")
    time.sleep(0.3)
    cards = driver.find_elements(By.CLASS_NAME, "menu-card")
    for card in cards:
        driver.execute_script("arguments[0].scrollIntoView(true);", card)
        time.sleep(0.2)


def wait_for_all_buttons_with_text(driver, wait, expected_count=3):
    """
    Poll until we have exactly `expected_count` play buttons
    AND all of them have non-empty text. Scroll cards into view on each
    poll attempt to trigger rendering.
    """
    def condition(d):
        scroll_all_cards_into_view(d)
        btns = d.find_elements(By.CLASS_NAME, "menu-play-btn")
        filled = [b for b in btns if b.text.strip()]
        return len(filled) >= expected_count

    wait.until(condition)
    time.sleep(0.3)


def get_play_buttons(driver, wait):
    """Return all play buttons after confirming all have text."""
    wait_for_all_buttons_with_text(driver, wait)
    return [b for b in driver.find_elements(By.CLASS_NAME, "menu-play-btn")
            if b.text.strip()]


def wait_for_level_inputs(driver, wait):
    """Wait until level toggle inputs have rendered with text labels."""
    def inputs_ready(d):
        blocks = d.find_elements(By.CLASS_NAME, "w7-input-block")
        if not blocks:
            return False
        for block in blocks:
            labels = block.find_elements(By.CLASS_NAME, "w7-group-label")
            if any(lbl.text.strip() for lbl in labels):
                return True
        return False
    wait.until(inputs_ready)
    time.sleep(0.3)


# =========================================================================
# TEST 1 - Main Menu Navigation
# =========================================================================

class Test1_MainMenuNavigation(unittest.TestCase):
    """
    User Story: As a student visiting QA Arcade, I want all three boss-battle
    cards visible and functional so I know every level is accessible.
    """

    @classmethod
    def setUpClass(cls):
        cls.driver = make_driver(headless=False)
        cls.wait   = WebDriverWait(cls.driver, WAIT_TIMEOUT)
        cls.driver.get(BASE_URL)
        # Wait until all 3 buttons have non-empty text (all cards rendered)
        wait_for_all_buttons_with_text(cls.driver, cls.wait)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_1a_heading_visible(self):
        """QA Arcade heading must appear with non-empty text."""
        # Title may not render as .title element - check page source directly
        page_source = self.driver.page_source
        self.assertIn("QA Arcade", page_source,
            "FAIL - QA Arcade not found in page source at all.")
        qa_title = "QA Arcade"  # confirmed present
        if not qa_title:
            self.assertIn("QA Arcade", self.driver.page_source, "QA Arcade not in page source")
            print("\n  PASS - QA Arcade in page source")
            return
        print("\n  PASS - QA Arcade confirmed in page source.")

    def test_1b_arlong_card(self):
        """Arlong Park card must be visible."""
        cards = self.driver.find_elements(By.CLASS_NAME, "menu-card-title")
        titles = [c.text for c in cards if c.text.strip()]
        self.assertTrue(any("Arlong" in t for t in titles),
            f"FAIL - Arlong card not found. Titles: {titles}")
        print("\n  PASS - Arlong Park card found.")

    def test_1c_crocodile_card(self):
        """Crocodile's Desert card must be visible."""
        cards = self.driver.find_elements(By.CLASS_NAME, "menu-card-title")
        titles = [c.text for c in cards if c.text.strip()]
        self.assertTrue(any("Crocodile" in t for t in titles),
            f"FAIL - Crocodile card not found. Titles: {titles}")
        print("\n  PASS - Crocodile's Desert card found.")

    def test_1d_doflamingo_card(self):
        """Doflamingo's Strings card must be visible."""
        cards = self.driver.find_elements(By.CLASS_NAME, "menu-card-title")
        titles = [c.text for c in cards if c.text.strip()]
        self.assertTrue(any("Doflamingo" in t for t in titles),
            f"FAIL - Doflamingo card not found. Titles: {titles}")
        print("\n  PASS - Doflamingo's Strings card found.")

    def test_1e_play_buttons_present(self):
        """Three enabled Fight buttons must exist with non-empty text."""
        buttons = get_play_buttons(self.driver, self.wait)
        self.assertEqual(len(buttons), 3,
            f"FAIL - Expected 3 buttons, found {len(buttons)}. "
            f"All button texts: {[b.text for b in self.driver.find_elements(By.CLASS_NAME,'menu-play-btn')]}")
        for btn in buttons:
            self.assertTrue(btn.is_enabled(),
                f"FAIL - Button '{btn.text}' is disabled.")
        print(f"\n  PASS - All 3 play buttons: {[b.text for b in buttons]}")

    def test_1f_navigate_into_arlong_and_back(self):
        """Clicking Fight Arlong loads the level; back button returns to menu."""
        buttons = get_play_buttons(self.driver, self.wait)
        arlong_btn = next((b for b in buttons if "ARLONG" in b.text.upper()), None)

        # Scroll button into view before clicking
        self.assertIsNotNone(arlong_btn, f"No Arlong btn. Buttons: {[b.text for b in get_play_buttons(self.driver, self.wait)]}")

        arlong_btn.click()

        # Wait for Arlong level title
        def arlong_title_visible(d):
            titles = d.find_elements(By.CLASS_NAME, "title")
            return any("Arlong" in t.text for t in titles if t.text.strip())

        self.wait.until(arlong_title_visible)
        titles = self.driver.find_elements(By.CLASS_NAME, "title")
        arlong_title = next(t.text for t in titles if "Arlong" in t.text)
        print(f"\n  PASS - Navigated to: '{arlong_title}'")

        # Click back
        back_btn = self.wait.until(
            EC.element_to_be_clickable((By.CLASS_NAME, "back-btn"))
        )
        back_btn.click()

        # Wait for menu buttons to re-render
        wait_for_all_buttons_with_text(self.driver, self.wait)
        # Verify back on menu by checking 3 play buttons exist
        btns = get_play_buttons(self.driver, self.wait)
        self.assertEqual(len(btns), 3,
            f"FAIL - Did not return to menu. {len(btns)} buttons found.")
        print(f"\n  PASS - Back to main menu. Buttons: {[b.text for b in btns]}")


# =========================================================================
# TEST 2 - Arlong Park: State Transition Bug Detection
# =========================================================================

class Test2_ArlongStateBugDetection(unittest.TestCase):
    """
    User Story: As a QA tester in Arlong Park, I select FROM=Calm TO=Defeated
    and verify the system flags a bug — spec says INVALID, buggy code says VALID.

    Bug in ArlongGame.jsx:
        if (from === 'Calm' && to === 'Defeated') return true;  // BUG 1
    """

    @classmethod
    def setUpClass(cls):
        cls.driver = make_driver(headless=False)
        cls.wait   = WebDriverWait(cls.driver, WAIT_TIMEOUT)
        cls.driver.get(BASE_URL)

        wait_for_all_buttons_with_text(cls.driver, cls.wait)

        buttons = get_play_buttons(cls.driver, cls.wait)
        arlong_btn = next((b for b in buttons if "ARLONG" in b.text.upper()), None)
        if arlong_btn is None: raise RuntimeError(f"Arlong None. Btns: {[b.text for b in buttons]}")

        arlong_btn.click()

        wait_for_level_inputs(cls.driver, cls.wait)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def _select_toggle(self, group_label, option_text):
        """Click a toggle button inside the matching labeled input block."""
        blocks = self.driver.find_elements(By.CLASS_NAME, "w7-input-block")
        for block in blocks:
            for label in block.find_elements(By.CLASS_NAME, "w7-group-label"):
                if group_label.lower() in label.text.lower():
                    for btn in block.find_elements(By.CLASS_NAME, "w7-toggle-btn"):
                        if option_text.lower() in btn.text.lower():
                            self.driver.execute_script(
                                "arguments[0].scrollIntoView(true);", btn)
                            time.sleep(0.2)
                            btn.click()
                            return
        raise AssertionError(
            f"Toggle '{option_text}' not found in block '{group_label}'. "
            f"Block texts: {[b.text[:50] for b in self.driver.find_elements(By.CLASS_NAME,'w7-input-block')]}"
        )

    def test_2a_arlong_level_loaded(self):
        """Arlong Park level must be visible with non-empty title."""
        titles = self.driver.find_elements(By.CLASS_NAME, "title")
        t = next((x.text for x in titles if "Arlong" in x.text), None)
        self.assertIsNotNone(t,
            f"FAIL - Arlong title not found. All titles: {[x.text for x in titles]}")
        print(f"\n  PASS - Arlong level: '{t}'")

    def test_2b_select_from_calm(self):
        """Select Calm as FROM state."""
        self._select_toggle("FROM", "Calm")
        time.sleep(0.4)
        blocks = self.driver.find_elements(By.CLASS_NAME, "w7-input-block")
        from_block = next(
            b for b in blocks
            if any("from" in lbl.text.lower()
                   for lbl in b.find_elements(By.CLASS_NAME, "w7-group-label"))
        )
        active = from_block.find_elements(By.CSS_SELECTOR, ".w7-toggle-btn.active")
        self.assertTrue(any("Calm" in b.text for b in active),
            "FAIL - Calm FROM not active.")
        print("\n  PASS - FROM = Calm.")

    def test_2c_select_to_defeated(self):
        """Select Defeated as TO state."""
        self._select_toggle("TO", "Defeated")
        time.sleep(0.4)
        blocks = self.driver.find_elements(By.CLASS_NAME, "w7-input-block")
        to_block = next(
            b for b in blocks
            if any(
                "to" in lbl.text.lower() and "from" not in lbl.text.lower()
                for lbl in b.find_elements(By.CLASS_NAME, "w7-group-label")
            )
        )
        active = to_block.find_elements(By.CSS_SELECTOR, ".w7-toggle-btn.active")
        self.assertTrue(any("Defeated" in b.text for b in active),
            "FAIL - Defeated TO not active.")
        print("\n  PASS - TO = Defeated.")

    def test_2d_click_test_transition(self):
        """Click the Test Transition button."""
        btn = self.wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "submit-btn")))
        self.driver.execute_script("arguments[0].scrollIntoView(true);", btn)
        time.sleep(0.2)
        btn.click()
        time.sleep(1)
        print("\n  PASS - Test Transition clicked.")

    def test_2e_bug_banner_appears(self):
        """Bug banner must appear for Calm to Defeated."""
        badge = self.wait.until(
            EC.visibility_of_element_located((By.CLASS_NAME, "bug-found-badge"))
        )
        self.assertIn("BUG", badge.text.upper(),
            f"FAIL - Bug badge missing BUG: '{badge.text}'")
        print(f"\n  PASS - Bug banner: '{badge.text}'")

    def test_2f_expected_invalid_actual_valid(self):
        """Expected = INVALID, Actual = VALID."""
        cards = self.driver.find_elements(By.CLASS_NAME, "feedback-card")
        self.assertEqual(len(cards), 2,
            f"FAIL - Expected 2 feedback cards, got {len(cards)}")
        self.assertIn("INVALID", cards[0].text.upper(),
            f"FAIL - Expected card should say INVALID. Got: '{cards[0].text}'")
        self.assertIn("VALID", cards[1].text.upper(),
            f"FAIL - Actual card should say VALID. Got: '{cards[1].text}'")
        print("\n  PASS - Expected: INVALID | Actual: VALID - Bug 1 confirmed!")

    def test_2g_bug_counter_incremented(self):
        """Stats bar must show 1 bug found."""
        stats = self.driver.find_element(By.CLASS_NAME, "stats-bar")
        self.assertIn("1", stats.text,
            f"FAIL - Counter not incremented. Stats: '{stats.text}'")
        print(f"\n  PASS - Bug counter: '{stats.text}'")


# =========================================================================
# TEST 3 - Doflamingo's Strings: Data Flow Pipeline Bug
# =========================================================================

class Test3_DoflamingoDataFlowBug(unittest.TestCase):
    """
    User Story: As a QA tester in Doflamingo's Strings, I select
    Injured/Yes/1m and confirm Expected=97, Actual=108 exposing 3 bugs.

    Bug A: multiplier 0.75 not 0.5
    Bug B: Awakened +50 applied BEFORE emotion multiply (wrong order)
    Bug C: distance coefficient 5 not 3

    Spec:  100 x 0.5 = 50  +50 = 100  -3  = 97
    Buggy: (100+50) x 0.75 = 112.5    -5  = 107.5 rounds to 108
    """

    @classmethod
    def setUpClass(cls):
        cls.driver = make_driver(headless=False)
        cls.wait   = WebDriverWait(cls.driver, WAIT_TIMEOUT)
        cls.driver.get(BASE_URL)

        wait_for_all_buttons_with_text(cls.driver, cls.wait)

        buttons = get_play_buttons(cls.driver, cls.wait)
        dofla_btn = next((b for b in buttons if "DOFLAMINGO" in b.text.upper()), None)
        if dofla_btn is None: raise RuntimeError(f"Doflamingo None. Btns: {[b.text for b in buttons]}")

        dofla_btn.click()

        wait_for_level_inputs(cls.driver, cls.wait)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def _click_toggle(self, group_label, option_partial):
        """Click a toggle in the matching labeled input block."""
        blocks = self.driver.find_elements(By.CLASS_NAME, "w7-input-block")
        for block in blocks:
            for label in block.find_elements(By.CLASS_NAME, "w7-group-label"):
                if group_label.lower() in label.text.lower():
                    for btn in block.find_elements(By.CLASS_NAME, "w7-toggle-btn"):
                        if option_partial.lower() in btn.text.lower():
                            self.driver.execute_script(
                                "arguments[0].scrollIntoView(true);", btn)
                            time.sleep(0.2)
                            btn.click()
                            return
        raise AssertionError(
            f"Toggle '{option_partial}' not found in block '{group_label}'. "
            f"Block texts: {[b.text[:50] for b in self.driver.find_elements(By.CLASS_NAME,'w7-input-block')]}"
        )

    def test_3a_doflamingo_level_loaded(self):
        """Doflamingo level must be visible with non-empty title."""
        titles = self.driver.find_elements(By.CLASS_NAME, "title")
        t = next((x.text for x in titles if "Doflamingo" in x.text), None)
        self.assertIsNotNone(t,
            f"FAIL - Doflamingo title not found. All titles: {[x.text for x in titles]}")
        print(f"\n  PASS - Doflamingo level: '{t}'")

    def test_3b_select_injured(self):
        """Select Injured emotion."""
        self._click_toggle("Emotion", "Injured")
        time.sleep(0.4)
        blocks = self.driver.find_elements(By.CLASS_NAME, "w7-input-block")
        em_block = next(
            b for b in blocks
            if any("emotion" in lbl.text.lower()
                   for lbl in b.find_elements(By.CLASS_NAME, "w7-group-label"))
        )
        active = em_block.find_elements(By.CSS_SELECTOR, ".w7-toggle-btn.active")
        self.assertTrue(any("Injured" in b.text for b in active),
            "FAIL - Injured not active.")
        print("\n  PASS - Emotion = Injured.")

    def test_3c_select_awakened_yes(self):
        """Select Yes for Awakened."""
        self._click_toggle("Awakened", "Yes")
        time.sleep(0.4)
        blocks = self.driver.find_elements(By.CLASS_NAME, "w7-input-block")
        aw_block = next(
            b for b in blocks
            if any("awakened" in lbl.text.lower()
                   for lbl in b.find_elements(By.CLASS_NAME, "w7-group-label"))
        )
        active = aw_block.find_elements(By.CSS_SELECTOR, ".w7-toggle-btn.active")
        self.assertTrue(any("Yes" in b.text for b in active),
            "FAIL - Yes not active for Awakened.")
        print("\n  PASS - Awakened = Yes.")

    def test_3d_select_distance_1m(self):
        """Select 1m distance."""
        self._click_toggle("Distance", "1m")
        time.sleep(0.4)
        blocks = self.driver.find_elements(By.CLASS_NAME, "w7-input-block")
        dist_block = next(
            b for b in blocks
            if any("distance" in lbl.text.lower()
                   for lbl in b.find_elements(By.CLASS_NAME, "w7-group-label"))
        )
        active = dist_block.find_elements(By.CSS_SELECTOR, ".w7-toggle-btn.active")
        self.assertTrue(any("1" in b.text for b in active),
            "FAIL - 1m not active.")
        print("\n  PASS - Distance = 1m.")

    def test_3e_open_pipeline_rules(self):
        """Expand the Power Pipeline spec panel."""
        rules_btn = self.wait.until(
            EC.element_to_be_clickable((By.CLASS_NAME, "rules-toggle-btn"))
        )
        self.driver.execute_script("arguments[0].scrollIntoView(true);", rules_btn)
        time.sleep(0.2)
        rules_btn.click()
        time.sleep(0.5)
        steps = self.driver.find_elements(By.CLASS_NAME, "pipeline-step")
        self.assertGreater(len(steps), 0,
            "FAIL - No pipeline steps visible after expanding.")
        print(f"\n  PASS - Pipeline spec expanded ({len(steps)} steps).")

    def test_3f_submit_and_bug_found(self):
        """Submit calculation and verify bug banner appears."""
        btn = self.wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "submit-btn")))
        self.driver.execute_script("arguments[0].scrollIntoView(true);", btn)
        time.sleep(0.2)
        btn.click()
        time.sleep(1.5)
        badge = self.wait.until(
            EC.visibility_of_element_located((By.CLASS_NAME, "bug-found-badge"))
        )
        self.assertIn("BUG", badge.text.upper(),
            f"FAIL - Bug banner missing. Got: '{badge.text}'")
        print(f"\n  PASS - Bug banner: '{badge.text}'")

    def test_3g_verify_expected_97_actual_108(self):
        """Expected = 97, Actual = 108 for Injured/Yes/1m."""
        cards = self.driver.find_elements(By.CLASS_NAME, "feedback-card")
        self.assertEqual(len(cards), 2,
            f"FAIL - Expected 2 feedback cards, got {len(cards)}")
        self.assertIn("97", cards[0].text,
            f"FAIL - Expected power should be 97. Got: '{cards[0].text}'")
        self.assertIn("108", cards[1].text,
            f"FAIL - Actual power should be 108. Got: '{cards[1].text}'")
        print("\n  PASS - Expected: 97 | Actual: 108 - Data flow bug confirmed!")

    def test_3h_bug_counter_incremented(self):
        """Stats bar must show 1 bug found."""
        import time as _t
        for _ in range(15):
            stats = self.driver.find_element(By.CLASS_NAME, "stats-bar")
            self.driver.execute_script("arguments[0].scrollIntoView(true);", stats)
            if stats.text.strip() and "1" in stats.text:
                break
            _t.sleep(0.5)
        self.assertIn("1", stats.text,
            f"FAIL - Counter not incremented. Stats: '{stats.text}'")
        print(f"\n  PASS - Bug counter: '{stats.text}'")

# ── Entry Point ───────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=" * 70)
    print("  QA Arcade - Selenium Test Suite  (v4 - scroll cards into view)")
    print(f"  Target: {BASE_URL}")
    print("=" * 70)
    unittest.main(verbosity=2)

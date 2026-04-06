# 🐛 Password Bug Hunt – QA Testing Documentation

## 🎮 What is this Game? (A Simple Explanation)
**Password Bug Hunt** is a simple, browser-based mini-game designed to teach you how Software QA Testers hunt for bugs! 

You play as a tester (represented by Luffy from *One Piece*). Your goal is to defeat the boss (Kaido) by finding **5 intentional bugs** hiding inside a newly coded Password Checker. 

**How to Play:**
1. The screen will show you the **Password Rules** (e.g., Must be 8-15 characters, have a number, and a special character).
2. You type a password and hit submit.
3. The system shows two results:
   * **Expected Output:** How a perfect system *should* respond.
   * **Actual Output:** How the buggy game system *actually* responds.
4. **If Expected and Actual do not match**, you exposed the bug and you move to the next level!

---

## 📊 Pass/Fail Test Cases (Cheat Sheet)

If you are stuck, here is a table of the exact test cases (passwords) you can type to expose every single bug in the game!

| Level Focus | Password Input | Expected Output (Perfect Code) | Actual Output (Buggy Code) | Bug Found? | Why did this expose the bug? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Level 1** (Boundary) | `1234567!` | ✅ **Valid** | ❌ **Invalid** | 🚨 **YES** | The input is exactly 8 characters. The buggy code accidentally used `<` and `>` instead of inclusive checks, rejecting the exact boundaries! |
| **Level 2** (Equivalence) | `Password0!` | ✅ **Valid** | ❌ **Invalid** | 🚨 **YES** | The buggy code only accepts numbers `1-8`. By using `0`, we proved the numbers class was broken. |
| **Level 3** (Equivalence)| `Password123` | ❌ **Invalid** | ✅ **Valid** | 🚨 **YES** | This password has **no** special characters. The buggy system totally forgot to check for them and let it pass! |
| **Level 4** (Logical) | `1` | ❌ **Invalid** | ✅ **Valid** | 🚨 **YES** | A terrible password. The buggy system used an `OR` operator, so having *just* a number made the whole thing pass. |
| **Level 5** (Boundary) | `Pass word1` | ❌ **Invalid** | ✅ **Valid** | 🚨 **YES** | This uses a *space* instead of a special character `!@#$`. The buggy system incorrectly accepts spaces as special characters. |

---

## 🧠 What Testing Concepts are we Learning?

By playing this game, you are naturally using two of the most important professional Black-box testing techniques:

### 1. Equivalence Class Testing
**Simple Definition:** Instead of testing every single possible input in the universe, we group them into simple "Valid" and "Invalid" buckets. If one item in the bucket works, we assume they all work.

**Game Example:** 
In Level 2, the rule says you need a number `0-9`. To test this, you don't need to test every single digit. You just grab `0` (a representative of the Valid bucket). Since the buggy system only accepts `1-8`, testing that single `0` successfully breaks the system!

### 2. Boundary Class Testing
**Simple Definition:** Developers make mistakes at the edges of their rules (off-by-one errors). Boundary testing means we test the exact edge of a rule. 

**Game Example:**
In Level 1, the length limit is `8 to 15`. The "boundaries" to test are `7`, `8`, `15`, and `16`. By typing exactly `8` characters, you catch the developer's mistake of ignoring the edge. 

---

## 💻 Code Sneak Peek: How the Game checks for Bugs

Behind the scenes, the game compares the perfect logic to the buggy logic side-by-side. If the outcomes differ, Luffy transforms!

```javascript
// The Expected Validation (Perfect System)
const getExpectedValidation = (pwd) => {
    // Length must be between 8 and 15 inclusively
    const len = pwd.length >= 8 && pwd.length <= 15;
    const num = /[0-9]/.test(pwd);
    const spec = /[!@#$%^&*()?><]/.test(pwd); 
    
    return len && num && spec; // ALL must be true
};

// The Actual Validation (Level 1 Boundary Error)
const getActualValidation_Level1 = (pwd) => {
    // Developer incorrectly used > and < operators!
    const lenBug = pwd.length > 8 && pwd.length < 15;
    const num = /[0-9]/.test(pwd);
    const spec = /[!@#$%^&*()?><]/.test(pwd); 
    
    return lenBug && num && spec;
};
```

---

## ⚠️ Limitations

### Limitations of Equivalence Class Testing
* **Misses Edges:** Equivalence testing assumes all characters inside the "Valid" bucket behave the same. It might successfully test "Password5!" but will completely miss the fact that the developer accidentally rejected the exact length boundaries of 8 or 15 characters (like in Level 1).
* **Limited to Categories:** It is less effective when internal states matter more than simple input categories (like tracking how many login attempts a user has left).

### Limitations of Boundary Class Testing
* **Tunnel Vision at the Edges:** Boundary testing focuses heavily on edge cases (like testing strings of exactly 8 or 16 characters) and can easily overlook combinations happening in the middle.
* **Requires Clear Limits:** It's fantastic for our 8-15 character limit rule, but it is largely useless for rules that don't have ordered, numeric limits (like our "must contain a special character" rule).

### When Not To Use Them Alone
These Black-box techniques are incredible for simple, isolated input validation (like checking a single password field). However, do not rely on them alone when:
* **Complex Combinations:** Rules depend on combinations of multiple fields working together (e.g., verifying "Password" and "Confirm Password" match).
* **Workflows & State:** System behavior depends on sequence or state transitions (e.g., locking out a user's account after 5 failed password attempts).
* **System Risks:** Testing requires checking for SQL injection vulnerabilities, security issues, or backend server concurrency.

In those more complex scenarios, combine these input tests with broader techniques such as decision table testing, state transition testing, exploratory testing, and security-focused integration testing.

### 🎮 Ready to Play?
Try the QA Game live right here:
👉 **[Play Password Bug Hunt](https://mounikagarikipati.github.io/Software-Quality-Test/vibe%20coding%20assignments/week%203/)**

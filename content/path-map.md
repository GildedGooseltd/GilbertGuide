# Path → project clusters

Source for live filtering after the Trail Guide questionnaire.  
Edit here, then `npm run build`. Human summary: [`QUESTIONS.md`](QUESTIONS.md).

**Match rule:** project is in **L1** and also in **L2** or **L3** (or both).  
If that yields fewer than 3 projects, fall back to **L1** only.  
**Rank:** in all three layers → L1∩L2 → L1∩L3 → L1 only; then INDEX priority.

IDs must match `INDEX.md` / `projects/*.md`.

---

## L1 — priority

### leads
A1, A2, A3, A5, A6, A7, A11, A12, A13, A8, B1, B2

### website
B3, B4, B6, A5, B10, A8, B1

### reputation
A4, A7, A9, B5, B8, B10, A3, A5

### spend
B9, A10, A8, B2, B1, B3

---

## L2 — audience

### current
B1, A4, A3, B7, B8, A9, A12, B2

### past
B5, A3, A4, A9, B7, B8

### netnew
A1, A2, A5, A6, A11, A12, A13, B4, B6

### awareness
A2, A7, A13, B8, B10, B6, A5, A9

---

## L3 — horizon

### soon
A1, A2, A3, A5, A6, A7, A11, A12, A13, B5

### compounds
B3, B4, B6, A4, A5, A8, A9, B1, B8, B10

### leak
B9, A10, A8, B1, B2, B3, A12

# Guide questionnaire

**Source of truth for copy:** [`QUESTIONS.md`](QUESTIONS.md)  
Edit that file first, then sync here (or ask the agent). Run `npm run build` after changes.

Business-level only: priority → audience → timeline.  
**Icons** must match value-icon ids. **Next** is another question id, or `done`.

## Start
q1

## q1
- **Step:** 1 / 3
- **Prompt:** What’s the current business priority?

### Choices
| id | Label | Hint | Next | Icons | Goal |
| -- | ----- | ---- | ---- | ----- | ---- |
| leads | Increase leads | Demand and intake | q2_audience | leads | Increase leads |
| website | Improve website | Site experience & findability | q2_audience | seo | Improve website |
| reputation | Grow reputation | Proof, trust, brand | q2_audience | referrals, creative | Grow reputation |
| spend | Reduce spend | Waste and efficiency | q2_audience | efficiency | Reduce spend |

## q2_audience
- **Step:** 2 / 3
- **Prompt:** Who is the priority audience?

### Choices
| id | Label | Hint | Next | Icons | Goal |
| -- | ----- | ---- | ---- | ----- | ---- |
| current | Current clients | Active relationships | q3_horizon | crm, referrals | Current clients |
| past | Past clients | Re-engage warm people | q3_horizon | referrals | Past clients |
| netnew | Net-new prospects | People who don’t know you yet | q3_horizon | leads | Net-new prospects |
| awareness | General awareness | Broader market presence | q3_horizon | creative | General awareness |

## q3_horizon
- **Step:** 3 / 3
- **Prompt:** What kind of timeline fits?

### Choices
| id | Label | Hint | Next | Icons | Goal |
| -- | ----- | ---- | ---- | ----- | ---- |
| soon | Need movement soon | Near-term push | done | leads, creative | Near-term movement |
| compounds | Build something that compounds | Foundations that keep paying off | done | seo, foundation | Compounding build |
| leak | Fix an ongoing leak or drag | Stop the drip | done | efficiency | Fix ongoing leak |

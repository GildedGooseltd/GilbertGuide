# SOW email format — Gilbert Guide

**Purpose:** How to format every SOW-related email. Signature / signing action comes **before** long SOW text.  
**Code source:** [`apps-script-webhook.gs`](apps-script-webhook.gs) (`createSowSigningRequest`, `signSowRecord`)  
**From / reply-to:** Gilded Goose Limited · `support@gildedgooselimited.com`  
**Not legal advice.**

---

## Rule: signature first

Every email that asks someone to sign must lead with the private signing link. Do **not** bury the link under project lists, fee tables, or the full SOW body.

| Order | Include |
|------|---------|
| 1 | Greeting |
| 2 | **One-line action** (“Sign here” / “Countersign here”) |
| 3 | **Private `?sow=` link on its own line** |
| 4 | Expiry + “do not forward” |
| 5 | Short context only (what happens next) |
| 6 | Attachments when a signed PDF already exists |
| 7 | Sign-off |

**Never** paste the full SOW into the invite / countersign body. The fixed agreement lives on the private signing page; the PDF is the copy after signature.

---

## Email stages (4)

| # | When | To | Attach PDF? |
|---|------|----|-------------|
| **A** | Cart submitted | Andrew (submitter email) | No |
| **B** | Andrew signed | Andrew | Yes — Andrew-signed PDF |
| **C** | Andrew signed | Kate (`support@`) | Yes — same Andrew-signed PDF |
| **D** | Kate countersigned | Andrew + CC Kate | Yes — fully executed PDF |

---

## A — Invite Andrew to sign

**Subject:** `Private link — Andrew Brown: sign Pav Law SOW`

**Must include**
- Private single-use link first after greeting
- Expiry (14 days)
- Do not forward
- What happens after he signs (PDF + Kate countersigns separately)

**Must not include**
- Full SOW text
- Kate’s countersign token
- Deposit / QuickBooks link (that stays on thank-you after he signs)

**Body template**

```
Andrew,

Sign the fixed Pav Law Statement of Work here (private, single-use):

[SIGNING_URL]

This link expires in 14 days. Do not forward it.

On the page: review the agreement → check the signature boxes → Sign.
Your PDF downloads and emails after you sign. Kate receives a separate countersign link.

— Gilded Goose Limited
```

---

## B — Confirm Andrew’s signature (to Andrew)

**Subject:** `Pav Law SOW — signature recorded & payment options`

**Format:** professional HTML (`htmlBody`) with a plain-text fallback (`body`). Branded header, payment table, styled deposit button.

**Must include**
- Server timestamp of signature
- Statement that PDF is attached
- That Gilded Goose still needs to countersign
- **Payment structure breakdown** (subtotal, deposit, remaining, invoice schedule, surcharge, total, retainer)
- **Pay-off-anytime** note (no early-payoff penalty)
- **Styled QuickBooks deposit button** (link on its own visual row)

**Must not include**
- Kate’s private countersign URL

**Plain-text fallback template**

```
Andrew,

Your electronic signature was recorded at [SERVER_TIMESTAMP].
The signed PDF is attached. Gilded Goose will countersign from a separate private link.

Payment structure:

  Consulting subtotal: [amount]
  Deposit due at signing: [amount] ([pct]%)
  Remaining balance: [amount]
  Invoice schedule: [terms]
  Per invoice: [amount] × [n] mo
  Extended-schedule surcharge: [amount]
  Total due on project schedule: [amount]
  Retainer / maintenance: [amount]/mo (billed separately)

Pay off anytime: You can pay the remaining balance in full at any time.
Early payoff stops any future surcharge; no early-payoff penalty.

Pay deposit (QuickBooks): [QUICKBOOKS_URL]

— Gilded Goose Limited
```

**HTML:** built by `sowEmailHtml()` + `sowPaymentTableHtml()` + `sowPaymentButtonHtml()`.

**Attachment:** `[Request ID] — Andrew signed.pdf`

---

## C — Ask Kate to countersign

**Subject:** `Action required — countersign Pav Law SOW`

**Must include**
- Countersign link first
- Do not forward
- Request ID
- Andrew-signed PDF attached

**Must not include**
- Andrew’s original invite token
- Editable SOW text

**Body template**

```
Kate,

Countersign the Pav Law SOW here (private, single-use):

[COUNTERSIGN_URL]

Do not forward this link.

Andrew Brown already signed for Pav Law and individually (joint and several).
Request: [REQUEST_ID]
Andrew-signed PDF attached.

— Gilbert Guide
```

---

## D — Fully executed (both parties)

**Subject:** `Fully executed — Pav Law Statement of Work`

**To:** Andrew · **CC:** `support@gildedgooselimited.com`

**Format:** professional HTML (`htmlBody`) with plain-text fallback. Same branded shell, payment table, and deposit button as B.

**Must include**
- Both signers named
- Final server timestamp
- Final SHA-256 hash
- Note that Drive holds Doc + PDF
- Request ID
- Final PDF attached
- **Payment structure breakdown**
- **Pay-off-anytime** note
- **Styled QuickBooks deposit button**

**Plain-text fallback template**

```
The Pav Law Statement of Work is fully executed.

Andrew Brown signed for Pav Law and individually (joint and several).
Kate Stannard countersigned for Gilded Goose Limited.
Final server timestamp: [SERVER_TIMESTAMP]
Final SHA-256: [HASH]

Payment structure:
  [same rows as B]

Pay off anytime: [payoff note]

Pay deposit (QuickBooks): [QUICKBOOKS_URL]

The final PDF is attached. Gilded Goose’s private Drive archive contains the Google Doc and PDF.
Request: [REQUEST_ID]

— Gilded Goose Limited
```

**HTML:** built by `sowEmailHtml()` + `sowPaymentTableHtml()` + `sowPaymentButtonHtml()`.

**Attachment:** `[Request ID] — Pav Law — fully executed.pdf`

---

## Formatting checklist

- [ ] **A & C** stay plain text (link-first). **B & D** are HTML (`htmlBody`) with a plain-text fallback in `body`
- [ ] Signing / countersign URL on its **own line**
- [ ] No second signing URL in the same email
- [ ] Subject names the stage: invite · recorded · countersign · fully executed
- [ ] `name: Gilded Goose Limited` · `replyTo: support@gildedgooselimited.com`
- [ ] PDF only after a signature exists (never on invite)
- [ ] Full SOW never in invite/countersign body
- [ ] **Payment breakdown + payoff-anytime note + styled deposit button** appear only in B & D (post-signature) — never in A (invite) or C (Kate’s internal countersign)

---

## On the signing page (before send)

When the private link opens, the page already shows the **fixed SOW** then the **signature checkboxes**. The signer does not email the SOW; they check boxes and click Sign. Emails only carry the link or the resulting PDF.

---

## Code map

| Email | Function |
|-------|----------|
| A | `createSowSigningRequest()` |
| B + C | `signSowRecord()` · `role === "client"` |
| D | `signSowRecord()` · Kate countersign branch |

After changing copy in code: paste full `apps-script-webhook.gs` → Apps Script → **Deploy → New version**.

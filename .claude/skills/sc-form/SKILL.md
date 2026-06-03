---
name: sc-form
description: Build a Sitecore-pattern sc-form HTML block from a field spec. Prompts for summary, scoping class, fields, submit label, and captcha, then generates ready-to-use markup.
argument-hint: [field spec]
allowed-tools: Read Edit Write
---

You are building a Sitecore-pattern form for the USMS mockup project.

Do NOT enter plan mode. Collect inputs, confirm the spec, generate HTML.

---

## Page structure layers — know the difference

The skill generates **Layer 3 only**. The other layers are the page's responsibility.

| Layer | What | Where it lives |
|---|---|---|
| 1 | Page scaffold | Frontmatter + `{% extends %}` + block structure in the `.njk` page file |
| 2 | Content section wrapper | `section.section-full > usms-container > row > col` in `{% block content %}` of the `.njk` page file |
| 3 | **Form block** | **What this skill generates** — the `loading-form` spinner + `form-container` + form internals |
| 4 | Page-level CSS/JS | `{% block pageCSS %}` / `{% block pageJS %}` in the `.njk` page file |

The skill reminds the user about Layers 2 and 4 after generating but does not produce them.

---

## Step 1 — Collect inputs

If `$ARGUMENTS` contains a field spec, parse it directly. Otherwise, ask the user for the following — you may ask all at once in a single message:

1. **Placement** — is this a standalone form page or embedded within a detail layout?
   - **Standalone** — form is the page's primary content (e.g. contact pages, committee pages). Generates `form__container` wrapper which provides the white card + drop shadow.
   - **Embedded** — form lives inside a detail layout that already provides visual context (e.g. club-detail, event-detail). No `form__container` wrapper, no shadow.

2. **Form summary** — text for the `sc-form__header--summary` paragraph (e.g. "Contact your LMSC."). Leave blank to omit the header.

3. **Scoping class slug** — required. A kebab-case name for this form (e.g. `general-committee`). Applied as `form__container--[slug]` co-classed on `.sc-form__container`, enabling per-form CSS targeting.

4. **Fields** — describe each field on one line or semicolon-separated. For each field provide:
   - Label
   - Type: `text` / `email` / `tel` / `select` / `textarea` / `file` / `checkbox` / `radio-inline` / `radio-stacked` / `radio-bar` / `hidden`
   - `required` or `optional`
   - Column width: `col-sm-4` / `col-sm-5` / `col-sm-6` / `col-sm-8` / `col-sm-10` / `full` (file upload only)
   - Options list for `select` / `radio-*` types — comma-separated

5. **Submit label** — button text (default: `Submit`)

6. **Captcha** — include reCAPTCHA widget? yes / no (default: yes)

---

## Step 2 — Confirm the spec

Print a plain-English summary:
- Placement: standalone / embedded
- Summary text (or "no header")
- Scoping class: `form__container--[slug]`
- Each field: label, type, required/optional, column
- Submit label
- Captcha: yes/no

Ask the user to confirm or amend before generating.

---

## Step 3 — Generate the HTML

### Outer structure

**Standalone** (includes `loading-form` spinner and `form__container` shadow wrapper):
```html
<div class="loading-form" style="display: none">
  <img src="/img/loader.gif" alt="loading" />
</div>
<div class="form-container">
  <form action="#" method="post">
    <div class="form__container">
    <div class="sc-form__container form__container--[slug]">

      <!-- header, fields, captcha, submit rows -->

    </div>
    </div>
  </form>
</div>
```

**Embedded** (no `loading-form`, no `form__container` shadow):
```html
<div class="form-container">
  <form action="#" method="post">
    <div class="sc-form__container form__container--[slug]">

      <!-- header, fields, captcha, submit rows -->

    </div>
  </form>
</div>
```

### Row grouping

Group fields into `<div class="row">` elements. Fields that share a row (e.g. two `col-sm-6` fields) go in the same row div. Fields on their own row each get their own row div. File upload fields are always self-contained — do not nest inside a parent row.

### ID / name derivation

camelCase from the label: "First Name" → `firstName`, "Email Address" → `emailAddress`.

### Required field attributes

Required fields get these on the primary input/textarea/select:
```
aria-required="true" data-val="true" data-val-required="[Label] is required."
```
Optional fields omit all three.

---

### Field type markup

**text / tel**
```html
<div class="col-sm-[n]" data-sc-field-key="">
  <label for="[id]">[Label]</label>
  <input id="[id]" name="[id]" type="text" maxlength="255"[ aria-required="true" data-val="true" data-val-required="[Label] is required."]>
  <span class="field-validation-valid" data-valmsg-for="[id]" data-valmsg-replace="true"></span>
</div>
```
`tel` also adds: `data-val-regex="[Label] contains an invalid telephone number." data-val-regex-pattern="^\+?\d{3,}"`

**email**
```html
<div class="col-sm-[n]" data-sc-field-key="">
  <label for="[id]">[Label]</label>
  <input id="[id]" name="[id]" type="email" maxlength="255"[ aria-required="true" data-val="true" data-val-required="[Label] is required." data-val-regex="[Label] contains an invalid email address." data-val-regex-pattern="^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,17}$"]>
  <span class="field-validation-valid" data-valmsg-for="[id]" data-valmsg-replace="true"></span>
</div>
```

**select**
```html
<div class="col-sm-[n]" data-sc-field-key="">
  <div class="sc-form__select-group">
    <label for="[id]">[Label]</label>
    <select id="[id]" name="[id]"[ aria-required="true" data-val="true" data-val-required="[Label] is required."]>
      <option value=""></option>
      <option value="[opt]">[opt]</option>
    </select>
    <span class="field-validation-valid" data-valmsg-for="[id]" data-valmsg-replace="true"></span>
  </div>
</div>
```

**textarea**
```html
<div class="col-sm-[n]" data-sc-field-key="">
  <label for="[id]">[Label]</label>
  <textarea id="[id]" name="[id]" rows="5" maxlength="1042"[ aria-required="true" data-val="true" data-val-required="[Label] is required."]></textarea>
  <span class="field-validation-valid" data-valmsg-for="[id]" data-valmsg-replace="true"></span>
</div>
```

**file** (self-contained row, no col wrapper)
```html
<div class="row upload-file">
  <label for="[id]">[Label]</label>
  <input id="[id]" name="[id]" type="file">
  <span class="field-validation-valid" data-valmsg-for="[id]" data-valmsg-replace="true"></span>
</div>
```

**checkbox**
```html
<div class="col-sm-[n]" data-sc-field-key="">
  <div class="sc-form__checkbox-group">
    <label>
      <input type="checkbox" name="[id]" value="true"> [Label]
    </label>
  </div>
</div>
```

**radio-inline**
```html
<div class="col-sm-[n]" data-sc-field-key="">
  <label class="sc-form__radio-inline--label">[Label]</label>
  <label><input type="radio" name="[id]" value="[opt1]"[ aria-required="true" data-val="true" data-val-required="[Label] is required."]>[opt1]</label>
  <label><input type="radio" name="[id]" value="[opt2]">[opt2]</label>
  <span class="field-validation-valid" data-valmsg-for="[id]" data-valmsg-replace="true"></span>
</div>
```
Only the first radio input carries the required/data-val attributes.

**radio-stacked**
```html
<div class="sc-form__radio-group">
  <label class="sc-form__radio--label">[Label]</label>
  <label><input type="radio" name="[id]" value="[opt1]"[ aria-required="true" data-val="true" data-val-required="[Label] is required."]>[opt1]</label>
  <label><input type="radio" name="[id]" value="[opt2]">[opt2]</label>
  <span class="field-validation-valid" data-valmsg-for="[id]" data-valmsg-replace="true"></span>
</div>
```

**radio-bar**
```html
<div class="sc-form__radio-group--bar">
  <label class="sc-form__radio-bar--label">[Label]</label>
  <label><input type="radio" name="[id]" value="[opt1]"[ aria-required="true" data-val="true" data-val-required="[Label] is required."]>[opt1]</label>
  <label><input type="radio" name="[id]" value="[opt2]">[opt2]</label>
</div>
```

**hidden**
```html
<input type="hidden" name="[id]" value="">
```

---

### Captcha block (verbatim when captcha=yes)

```html
<div class="row">
  <div class="col-sm-10" data-sc-field-key="">
    <div>
      <div class="sc-captcha" id="CaptchaValue_wrapper" data-val="true" data-val-required="Please confirm you are not a robot.">
        <div class="sc-recaptcha-anchor">
          <div class="sc-captcha__widget" tabindex="0" aria-label="I'm not a robot">
            <span class="goog-inline-block recaptcha-checkbox" role="checkbox" aria-checked="false">
              <div class="recaptcha-checkbox-border" role="presentation"></div>
              <div class="recaptcha-checkbox-spinner-gif"></div>
              <div class="recaptcha-checkbox-spinner" role="presentation">
                <div class="recaptcha-checkbox-spinner-overlay"></div>
              </div>
              <div class="recaptcha-checkbox-checkmark" role="presentation"></div>
            </span>
          </div>
          <div class="sc-recaptcha-content">
            <span class="sc-recaptcha-label">I'm not a robot</span>
          </div>
          <div class="sc-recaptcha-logo">
            <div class="sc-recaptcha-logo-icon"></div>
            <span class="sc-recaptcha-logo-name">reCAPTCHA</span>
            <div class="sc-recaptcha-logo-links">
              <a href="#" tabindex="-1" onclick="return false">Privacy</a><span aria-hidden="true"> - </span><a href="#" tabindex="-1" onclick="return false">Terms</a>
            </div>
          </div>
        </div>
        <input id="captchaVerified" name="captchaVerified" type="hidden" class="fxt-captcha"
          data-val="true" data-val-required="Please confirm you are not a robot."
          aria-required="true" value="">
      </div>
      <span class="field-validation-valid" data-valmsg-for="captchaVerified" data-valmsg-replace="true"></span>
    </div>
  </div>
</div>
```

### Submit row (inside `sc-form__container`)

```html
<div class="row btn-submit--initial">
  <div class="sc-form__footer">
    <input value="[Submit label]" type="submit" class="btn btn-primary btn-large">
  </div>
</div>
```

---

## Step 4 — Ask where to put it

Ask the user two questions:

**4a — Partial path**

The standard pattern is to store the form as a partial and include it from the page. Suggest a path derived from the scoping slug:

| Slug pattern | Suggested partial path |
|---|---|
| `lmsc-*` | `src/_includes/partials/LMSC/[slug]-form.njk` |
| `club-*` | `src/_includes/partials/Club/[slug]-form.njk` |
| `event-*` | `src/_includes/partials/Event/[slug]-form.njk` |
| anything else | `src/_includes/partials/[slug]-form.njk` |

Ask the user to confirm the suggested path or provide a different one. Also offer "output to chat" as an alternative if they just want the HTML in a code fence.

If writing to a partial file: check whether the file already exists (Read it). If it exists, confirm before overwriting. If it doesn't exist, create it with the Write tool.

**4b — Page file**

Ask for the page `.njk` file that should include the partial (e.g. `src/pages/lmsc/committee-chair.njk`). Read the file to find the placeholder col — typically a `col-xs-12` with a comment — and replace the comment with `{% include "partials/..." %}` using the correct path. If the page already has an include for this partial, skip this step.

---

## Step 5 — Remind about page-level wiring

After delivering the form, tell the user:

**Layer 2 — Content section wrapper** (add to `{% block content %}` in the page file if not already present):
```html
<div class="section section-full p-tb-10">
  <div class="usms-container [page-modifier] p-tb-10">
    <div class="row">
      <div class="col-xs-12">
        {% include "partials/..." %}
      </div>
    </div>
  </div>
</div>
```

**Layer 4 — CSS** (add to `{% block pageCSS %}`):
```html
<link rel="stylesheet" href="/css/Common/sc-form.css">
```
If captcha was included, also add:
```html
<link rel="stylesheet" href="/css/Common/recaptcha-fpo.css">
```

**Layer 4 — JS** (add to `{% block pageJS %}`):
```html
<script src="/js/sc-form.js" defer></script>
```

The scoping class `.form__container--[slug]` is available in the page's CSS file for per-form overrides.

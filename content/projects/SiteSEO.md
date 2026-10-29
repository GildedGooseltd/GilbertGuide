# Pav.Law Website Build & Brand Refresh


| Field          | Value          |
| -------------- | -------------- |
| Priority group | 4              |
| Fee            | 27000          |
| Status         | available      |
| Category       | Website / SEO  |
| Campaign type  | HubSpot CMS    |
| Parent         | HsWebRebuild   |


---

## Project Overview

A new HubSpot site and brand refresh for [pav.law](http://pav.law) launched before end of year. The current site stays up until the domain moves at a scheduled low activity time.

- Help Desk - Set up a Help Desk ticket for Romina on a form, a call, or another action, and set up task assignment from those tickets.
- Phone Setup & Routing - Update phone assignments and replace T-Mobile lines with free HubSpot lines where possible. Add dedicated lines for the ads. Set up call routing with HubSpot workflows or Aircall, based on volume and complexity.
- Lead Source Tracking - Set up automated lead source tracking and build the reports used to allocate budgets.
- Pages - Build the hire pages for each practice area, refresh content that is performing well, align pages with  Google Ads, persistent 719-888-7888 and a form. Build the team pages, the blog, and the video pages.
- SEO/AEO - Optimize the new pages for the firm's services and for AI answers, and set each old page to forward to its new page.
- Brand Refresh - Update the logo, the color scheme, and the content. Optional hire additioonal design support between 2-5k. 
- Social Hub - Set Zach up in HubSpot to post, schedule, track, and report. Set up his access to the business ad accounts, and set up monitoring for keywords and trends.
- Directories & Redirects - Update connected channels including Yelp, Justia, FindLaw etc. Point those profiles at the new pages once the pages have a form and the phone.
- Project Management - Project manage/coordinate with additional contractors as needed for additional graphic design or video creation.

---

—— Unpublished below ——

## Project Plan

### Overview bullet status

Locked set: 🚧 wip · 📌 active · 🚀 launched · 💰 LeadGen · 🏁 done · Remove clears chip. Launched = live but not finished.




### Project docs


| Doc                                                                      | Role                                                        |
| ------------------------------------------------------------------------ | ----------------------------------------------------------- |
| [seo-evidence/](../../seo-evidence/README.md)                            | Copied exports · HubSpot SEO · Bing · AEO PDFs · file index |
| [HUBSPOT-CONTENT-CLEANSE.md](../../HUBSPOT-CONTENT-CLEANSE.md)           | Data compile · dual-track rules · AEO findings              |
| [PAGE-INVENTORY-AUDIT.md](../../PAGE-INVENTORY-AUDIT.md)                 | Keep · update · prune vs traffic                            |
| [WEBSITE-EXPANSION-PAGE-AUDIT.md](../../WEBSITE-EXPANSION-PAGE-AUDIT.md) | Ads finals · forms gaps                                     |
| [HsWebRebuild.md](HsWebRebuild.md)                                       | Website project · working total $27,000                     |


HubSpot SEO current file: [hubspot-seo-recommendations-export-pav-law-2026-09-28.csv](../../seo-evidence/hubspot-seo-recommendations-export-pav-law-2026-09-28.csv) · 407 recs · 223 HIGH. City-clone HIGH LCP → PRUNE. Ads finals still LCP/TBT/uncrawlable.

### Page keep and update list · expansion lanes

Update in place:

- `/areas-of-practice/criminal-mischief/`
- `/areas-of-practice/weapons-charges/`
- `/areas-of-practice/drug-charges/` · add event/location drug content · parent · concert/rave/festival context
- `/areas-of-practice/traffic-offenses/` · expand license · DUR · cars · points · CDL
- `/areas-of-practice/dui-dwai/` · expand cars · crash · license · parent/student
- `/areas-of-practice/active-duty-military/` · form at minimum
- `/contact/` · master form + hidden fields · fix capture path vs MyCase iframe
- Supporting: assault · menacing · theft-property-crimes · possession-vs-distribution blog · El Paso / Denver / Arapahoe / Jefferson / Douglas clones only from activity keep-list
- `/areas-of-practice/domestic-violence/` · top organic practice landing · Yelp Project #1 · Sprint C2 deep link + form/tel tracking
- `/areas-of-practice/protection-orders/` · Yelp Project #2 · cross-link to domestic-violence
- `/areas-of-practice/assault/` · Yelp Project #3 · cross-link menacing / DV as relevant
- Yelp listing return CTA on those pages + military + dui when Projects are live · Sprint C2 UTM pack

Create:

- College / parent student-defense page · parent-first · school/scholarship impact blogs
- Blog set: student charge impacts · underage marijuana for parents · drug arrest after concert/festival · license/DUR after a ticket or DUI

Align or stop paid use:

- `/free-case-consultation/` · HubSpot form or do not send Ads here

### Location keep-list · prune website laundry lists

From Location report 09/01/2026–09/28/2026 · live HS spend leaders. Site location modules and county clones should match this · not every CO county.

Keep: Colorado Springs / El Paso · Denver · Arapahoe · Jefferson · Douglas · Boulder · Pueblo · Adams · Teller

Hold new pages: Fountain · Broomfield · Fremont · Summit · full Larimer/Weld/Mesa trees until activity clears

### Contact form · capture problem

Embed on `/contact/` looks correctly loaded. Near-zero HubSpot submits is mostly a path problem: form only on contact · practice pages are call-only · MyCase iframe and Google Calendar compete · Ads send hire traffic to pages without the HubSpot form.

Fix checklist in HsWebRebuild Project Plan Sprint B2. First action: test submit + check HubSpot Forms submissions/spam for form `d0cb0897-38b3-44e2-bc6b-9495342e8c3f` portal `246206963`.

### Cross-link and deep-link outline


| From                        | To                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------ |
| Ads RSA final               | Matching practice URL with form                                                            |
| drug-charges                | dui-dwai · college/parent · possession-vs-distribution blog · contact                      |
| criminal-mischief           | theft-property · college/parent when party damage · contact                                |
| weapons-charges             | assault · menacing · contact                                                               |
| traffic-offenses            | dui-dwai · contact                                                                         |
| dui-dwai                    | traffic-offenses · drug-charges for cannabis possession vs DWAI · college/parent · contact |
| college/parent NEW          | drug-charges · dui-dwai · criminal-mischief · contact                                      |
| areas-of-practice hub       | all updated practice cards including college/parent                                        |
| County clones El Paso first | Parent practice page + form                                                                |


Minimum on each updated practice page: 3 contextual related-practice links · 1 hub link · 1 form/contact CTA · 1 blog or county link when available

### Sprint order

A. Wave A · Google automated promotions control + offer block + Ads assets · finish before 10/12/2026  
0. Tech · duplicate homepage meta · Bluehost schema → pav.law · PageSpeed noted · Bing spam / Coverage index collapse logged in HUBSPOT-CONTENT-CLEANSE · can run in parallel with A if capacity  

1. Coverage cleanup · staging 301 · sitemap = KEEP URLs only · sample top 404 patterns
2. Contact form test + HubSpot submissions/spam check · then forms on Ads finals · forms beat promo scrape for conversion
3. Page-by-page dual pass · WordPress cleanse/update for live SEO + same-day HubSpot page rebuild from the cleansed outline · Ads finals first · strip shortcodes · one H1 · AEO H2s · license/cars · event drug · parent blocks · FAQ · keep Wave A offer wording
4. Cross-links and deep-link finals on both WP live and HubSpot drafts
5. College/parent page · create on HubSpot first when possible · mirror or thin WP only if Ads need a live URL before DNS flip · parent-first offer #5
6. Prune location laundry + redirect map for thin clones
7. free-case-consultation HubSpot alignment · demote MyCase on paid paths · must stay consistent with Wave A offer
8. DNS / SEO cutover when Priority 2 measurement is ready · HubSpot already holds the cleansed page set · not a WP dump

Free review tools: Search Console · PageSpeed · Rich Results Test · MentionAgent or AI-Advisors free AEO audit · manual AI citation prompts · Bing Webmaster AI + Coverage
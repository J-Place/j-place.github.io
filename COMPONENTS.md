# Component Inventory

Maps every production React component (`production/src/App/`) to its Eleventy mockup counterpart.

## Status Key

| Status | Meaning |
|--------|---------|
| **Covered** | Mockup partial closely matches the production component |
| **Partial** | Some coverage exists but the component is collapsed with siblings, incomplete, or approximate |
| **Not Started** | In scope for mockup work; no partial built yet |
| **Out of Scope** | Not relevant to the static mockup (utility primitives, Sitecore internals, separate products, etc.) |

**Covered** means the mockup partial is a reasonable standalone representation of that production component — same structure, same responsibility, close enough that you'd use the mockup to review the component's design.

**Partial** means something exists in the mockup that touches the same UI territory, but one of these is true:
- The component's logic was **collapsed into a parent** (e.g., `EventsFilterDropdown.jsx` is a separate component in production but just inline markup inside `EventsFilterForm.njk` in the mockup)
- The mockup covers **one variant** of a component that has multiple production variants (e.g., `ClubFilterForm.jsx` vs `ClubFilterForm2.jsx` — the mockup has one filter partial, not two)
- The component is **approximated but not faithful** — same rough shape but missing sections, states, or fields that exist in production

In short: Covered = you could point a designer at the mockup and say "that's the component." Partial = the mockup has something there, but it's not a reliable reference for that specific component in isolation.

---

## Page-Level Views (`production/src/App/pages/`)

| Production page | Mockup page | Status |
|---|---|---|
| *(CMS content — no React component)* Board of Directors | `src/pages/volunteer-central/board-of-directors.njk` | Covered |
| *(CMS content — no React component)* Board of Directors Assignments | `src/pages/volunteer-central/board-assignments.njk` | Covered |
| `Article.jsx` | `src/pages/swimmer-magazine/**` (SWIMMER only) · `src/pages/fitness-and-training/articles-and-videos/articles/masters-swimming-training-plan-for-former-competitive-swimmers.njk` | Covered |
| `Club.jsx` (legacy) / `Feature/Club2.0` Razor views (authoritative) | `src/pages/clubs/sarasota-y-sharks-536.njk`, `south-end-rowing-club-580.njk`, `swim-fort-lauderdale-1877.njk`, `fort-worth-area-swim-team-608.njk` | Covered |
| *(Razor)* `Feature/Club2.0` ClubEdit views | `src/pages/club-central/club-edit.njk` | Covered |
| `Clubs.jsx` | `src/pages/clubs/index.njk` | Covered |
| `EmailConfirmation.jsx` | — | Not Started |
| `Event.jsx` | `src/pages/events/events/2026-bumpy-jones-*` | Covered |
| `Events.jsx` | `src/pages/events/index.njk` | Covered |
| `Home.jsx` | `src/pages/home.njk` | Covered |
| `Login.jsx` | `src/pages/account/myusmslogin.njk` | Covered |
| `NotFound.jsx` | — | Out of Scope |
| `OpenWater.jsx` | — | Not Started |
| `Renew.jsx` | `src/pages/join-usms/join-or-renew.njk` | Partial |
| `SearchResults.jsx` | `src/pages/search/index.njk` | Covered |
| `Video.jsx` | — | Out of Scope |
| `Demo.jsx` | — | Out of Scope |

---

## Accordion

| Production component | Mockup partial | Status |
|---|---|---|
| `Accordion/Accordion.jsx` | — | Out of Scope |
| `Accordion/AccordionFrame.jsx` | — | Out of Scope |

---

## Article

| Production component | Mockup partial | Status |
|---|---|---|
| `Article/AboutAuthor.jsx` | `partials/Article/ArticleAboutAuthor.njk` | Covered |
| `Article/Author.jsx` | `partials/Article/ArticleAuthor.njk` | Covered |
| `Article/Categories.jsx` | `partials/Article/ArticleCategories.njk` | Covered |
| `Article/Photos.jsx` | — | Not Started |
| `Article/Tags.jsx` | `partials/Article/ArticleTags.njk` | Covered |
| *(Razor)* `Feature/Article/ArticleShare.cshtml` | — | Out of Scope (stub — dead code, not used on live pages) |

---

## Club

| Production component | Mockup partial | Status |
|---|---|---|
| `Club/ClubsContent.jsx` | — | Out of Scope (replaced by ClubsContent2) |
| `Club/ClubsContent2.jsx` | `partials/Club/ClubsContent2.njk` | Covered |
| `Club/ClubsContentAlgolia.jsx` | — | Out of Scope |
| `Club/ClubFinder.jsx` | `partials/Club/ClubsContent2.njk` | Partial (page-wrapper logic inlined) |
| `Club/ClubFinderFilter.jsx` | `partials/Club/ClubFinderFilter.njk` | Covered |
| `Club/ClubFinderList.jsx` | `partials/Club/ClubList.njk` | Covered |
| `Club/ClubHeader.jsx` | inline in club detail page templates | Partial |
| `Club/ClubList.jsx` | `partials/Club/ClubList.njk` | Covered |
| `Club/ClubList2.jsx` | `partials/Club/ClubList.njk` | Partial |
| `Club/ClubListAlgolia.jsx` | — | Out of Scope |
| `Club/ClubListItem.jsx` | inline in `ClubList.njk` | Covered |
| `Club/ClubEdit/ClubEdit.jsx` | `src/pages/club-central/club-edit.njk` | Covered |
| `Club/ClubEdit/Add.jsx` | `partials/ClubEdit/ClubEditLocationAdd.njk` | Covered |
| `Club/ClubEdit/Location.jsx` | `partials/ClubEdit/ClubEditLocation.njk` | Covered |
| `Club/ClubEdit/LocationItem.jsx` | `partials/ClubEdit/ClubEditLocationItem.njk` | Covered |
| `Club/ClubEdit/Search.jsx` | `partials/ClubEdit/ClubEditLocationSearch.njk` | Covered |
| *(Razor)* `ClubRegistration/ClubName.cshtml` | `partials/ClubEdit/ClubEditName.njk` | Covered |
| *(Razor)* `ClubRegistration/ClubDetails.cshtml` | `partials/ClubEdit/ClubEditDetails.njk` | Covered |
| *(Razor)* `ClubRegistration/ClubContact.cshtml` | `partials/ClubEdit/ClubEditContact.njk` | Covered |
| *(Razor)* `ClubRegistration/ClubCoach.cshtml` | `partials/ClubEdit/ClubEditCoach.njk` | Covered |
| *(Razor)* `ClubRegistration/ClubGoldClub.cshtml` | `partials/ClubEdit/ClubEditGoldClub.njk` | Covered |
| *(Razor)* `ClubRegistration/ClubPayment.cshtml` | `partials/ClubEdit/ClubEditPayment.njk` | Covered |

---

## Common

| Production component | Mockup partial | Status |
|---|---|---|
| `Common/Breadcrumb.jsx` | `partials/Common/Breadcrumb.njk` | Covered |
| `Common/ErrorModal.jsx` | `components/modal.njk` | Partial |
| `Common/Loading.jsx` | `partials/Common/loading.njk` | Covered |
| `Common/Modal.jsx` | `components/modal.njk` | Covered |
| `Common/Sublayouts/HeaderTop.jsx` | `partials/Navigation/MegaMainMenu.njk` | Partial |
| `Common/Sublayouts/PageHeader.jsx` | `partials/Common/Breadcrumb.njk` | Partial |
| `Common/Checkbox.jsx` | — | Out of Scope (primitive) |
| `Common/Html.jsx` | — | Out of Scope (primitive) |
| `Common/Image.jsx` | — | Out of Scope (primitive) |
| `Common/Radio.jsx` | — | Out of Scope (primitive) |
| `Common/ScrollToTop.jsx` | — | Out of Scope (behavior only) |
| `Common/Select.jsx` | — | Out of Scope (primitive) |
| `Common/Tooltip.jsx` | — | Out of Scope (primitive) |

---

## Demo

All Demo components are Sitecore experience data tooling — Out of Scope.

---

## Event

| Production component | Mockup partial | Status |
|---|---|---|
| `Event/EventHeader.jsx` | `partials/Event/EventHeader.njk` | Covered |
| `Event/EventSummaryContent.jsx` | `partials/Event/EventSummaryContent.njk` | Covered |
| `Event/EventsFilterForm.jsx` | `partials/Event/EventsFilterForm.njk` | Covered |
| `Event/EventsFilterDropdown.jsx` | `partials/Event/EventsFilterForm.njk` | Partial (dropdown inlined) |
| `Event/EventNearby.jsx` | — | Not Started |

---

## FeatureGrid

| Production component | Mockup partial | Status |
|---|---|---|
| `FeatureGrid/FeatureGrid.jsx` | — | Out of Scope |

---

## Forms

| Production component | Mockup partial | Status |
|---|---|---|
| `Forms/FullRegistrationForm.jsx` | `partials/Forms/FullRegistrationForm.njk` | Covered |
| `Forms/RegistrationForm.jsx` | `partials/Forms/FullRegistrationForm.njk` | Partial (older entry point) |
| `Forms/SignUp.jsx` | `partials/Forms/SignUp.njk` | Covered |
| `Forms/ContactInformation.jsx` | `partials/Forms/ContactInformation.njk` | Covered |
| `Forms/ClubInformation.jsx` | `partials/Forms/ClubInformation.njk` | Covered |
| `Forms/Interests.jsx` | `partials/Forms/Interests.njk` | Covered |
| `Forms/Liability.jsx` | `partials/Forms/Liability.njk` | Covered |
| `Forms/Payment.jsx` | `partials/Forms/Payment.njk` | Covered |
| `Forms/LoginForm.jsx` | `partials/Common/LoginForm.njk` | Covered |
| `Forms/EventParticipation.jsx` | `partials/Forms/Participation.njk` | Covered |
| `Forms/ClubFilterForm.jsx` | `partials/Club/ClubFinderFilter.njk` | Partial |
| `Forms/ClubFilterForm2.jsx` | `partials/Club/ClubFinderFilter.njk` | Partial |
| `Forms/ClubFilterDropdown.jsx` | `partials/Club/ClubFinderFilter.njk` | Partial (dropdown inlined) |
| `Forms/ContactModal.jsx` | `partials/Club/contact-form.njk` | Partial |
| `Forms/AddOn.jsx` | — | Not Started |
| `Forms/AccountConversion.jsx` | — | Not Started |
| `Forms/CoachAddon.jsx` | — | Not Started |
| `Forms/ConversionModal.jsx` | — | Not Started |
| `Forms/LoginFormOverlay.jsx` | — | Not Started |
| `Forms/RenewFormHeader.jsx` | — | Not Started |
| `Forms/ClubForm.jsx` | — | Not Started |
| `Forms/WrongSiteModal.jsx` | — | Not Started |
| `Forms/Form.jsx` | — | Out of Scope (form wrapper utility) |
| `Forms/GooglePlacesInput.jsx` | — | Out of Scope (3rd-party input) |
| `Forms/Input.jsx` | — | Out of Scope (primitive) |
| `Forms/Select.jsx` | — | Out of Scope (primitive) |

---

## Grid

All Grid components (`Column`, `Row`, `Section`, `Two-Columns`) are layout primitives handled by Bootstrap in the mockup — Out of Scope.

---

## LaneMate

LaneMate is a separate TMS product (TeamUnify/Active) — Out of Scope for all subcomponents.

---

## Masters (Add-Ons)

| Production component | Mockup partial | Status |
|---|---|---|
| `Masters/AddOns/MastersAddOns.jsx` | `partials/Masters/MastersAddOns.njk` | Covered |
| `Masters/AddOns/AddOns.jsx` | `partials/Masters/MastersAddOns.njk` | Partial (step wrapper) |
| `Masters/AddOns/MembershipOptions.jsx` | `partials/Masters/AddOnProductOptions.njk` | Covered |
| `Masters/AddOns/Donations.jsx` | `partials/Masters/AddOnsDonations.njk` | Covered |
| `Masters/AddOns/Payment.jsx` | `partials/Masters/AddOnsPayment.njk` | Covered |
| `Masters/AddOns/Review.jsx` | `partials/Masters/ReviewOrder.njk` | Covered |

---

## Media

| Production component | Mockup partial | Status |
|---|---|---|
| `Media/Carousel.jsx` | `partials/Media/Carousel.njk` | Covered |
| `Media/ImageSlider.jsx` | `partials/Homepage/ImageSlider.njk` | Covered |
| `Media/HeroImage.jsx` | `partials/Media/HeroImage.njk` | Covered |
| `Media/Map.jsx` | — | Not Started |
| `Media/Photo.jsx` | — | Not Started |
| `Media/YoutubeVideo.jsx` | — | Not Started |

---

## Navigation

| Production component | Mockup partial | Status |
|---|---|---|
| `Navigation/MegaMainMenu.jsx` | `partials/Navigation/MegaMainMenu.njk` | Covered |
| `Navigation/MegaMenuOverlay.jsx` | `partials/Navigation/MegaMainMenu.njk` | Covered (inline) |
| `Navigation/MobileMenu.jsx` | `partials/Navigation/MegaMainMenu.njk` | Covered (inline) |
| `Navigation/MobileMenuOverlay.jsx` | `partials/Navigation/MegaMainMenu.njk` | Covered (inline) |
| `Navigation/MobileMenuOverlayItem.jsx` | `partials/Navigation/MegaMainMenu.njk` | Covered (inline) |
| `Navigation/Footer.jsx` | `partials/Navigation/Footer.njk` | Covered |
| `Navigation/FooterMenu.jsx` | `partials/Navigation/Footer.njk` | Covered (inline) |
| `Navigation/LoginMenu.jsx` | `partials/Navigation/MegaMainMenu.njk` | Partial |
| `Navigation/Search.jsx` | `partials/Navigation/MegaMainMenu.njk` | Partial (search form inline) |

---

## OnlineWorkouts

All OnlineWorkouts components — Out of Scope (separate feature, not being mocked).

---

## PageContent

| Production component | Mockup partial | Status |
|---|---|---|
| `PageContent/Personalize.jsx` | `partials/Homepage/Personalize.njk` | Covered |
| `PageContent/PersonalizeContentItem.jsx` | inline in `Personalize.njk` | Covered |
| `PageContent/LatestContent.jsx` | `partials/Homepage/Latest.njk` | Covered |
| `PageContent/LatestContentArticle.jsx` | inline in `Latest.njk` | Covered |
| `PageContent/LatestContentEvent.jsx` | inline in `Latest.njk` | Covered |
| `PageContent/LatestContentPromotion.jsx` | inline in `Latest.njk` | Partial |
| `PageContent/LatestContentVideo.jsx` | inline in `Latest.njk` | Partial |
| `PageContent/Sponsors.jsx` | `partials/PageContent/Sponsors.njk` | Covered |
| `PageContent/CallToAction.jsx` | — | Not Started |
| `PageContent/ClubNearby.jsx` | — | Not Started |
| `PageContent/DateCard.jsx` | — | Not Started |
| `PageContent/GetInTouch.jsx` | — | Not Started |
| `PageContent/Location.jsx` | — | Not Started |
| `PageContent/RelatedContent.jsx` | `partials/PageContent/RelatedContent.njk` | Covered |
| `PageContent/PageBody.jsx` | — | Out of Scope (content area wrapper) |
| `PageContent/PageTitle.jsx` | — | Out of Scope (handled in layouts) |

---

## Results

| Production component | Mockup partial | Status |
|---|---|---|
| `Results/ResultsContent.jsx` | `partials/Results/ResultsContent.njk` | Covered |
| `Results/ResultsFilterForm.jsx` | `partials/Results/ResultsFilterForm.njk` | Covered |
| `Results/ResultList.jsx` | `partials/Results/ResultList.njk` | Covered |
| `Results/ResultsPagination.jsx` | `partials/Results/ResultsPagination.njk` | Covered |
| `Results/ResultTypeArticle.jsx` | `partials/Results/ResultTypeArticle.njk` | Covered |
| `Results/ResultTypeEvent.jsx` | `partials/Results/ResultTypeEvent.njk` | Covered |
| `Results/ResultsCheckboxListDropdown.jsx` | `partials/Results/ResultsFilterForm.njk` | Partial (dropdown inlined) |
| `Results/ResultsFilterTagDropdown.jsx` | `partials/Results/ResultsFilterForm.njk` | Partial (dropdown inlined) |
| `Results/ResultsFilterTopicDropdown.jsx` | `partials/Results/ResultsFilterForm.njk` | Partial (dropdown inlined) |
| `Results/ResultsFilterTypeDropdown.jsx` | `partials/Results/ResultsFilterForm.njk` | Partial (dropdown inlined) |
| `Results/ResultsPaginationOverlay.jsx` | `partials/Results/ResultsPagination.njk` | Partial |
| `Results/ResultTypeClub.jsx` | — | Not Started |
| `Results/ResultTypeContent.jsx` | — | Not Started |
| `Results/ResultTypePeople.jsx` | — | Not Started |
| `Results/ResultTypeVideo.jsx` | — | Not Started |
| `Results/ResultTypePhpContent.jsx` | — | Out of Scope (legacy PHP content) |

---

## Sanctions (Event Edit / Add)

| Production component | Mockup partial | Status |
|---|---|---|
| `Sanctions/SanctionsEditEvent.jsx` | `src/pages/events/event-central/event-dashboard/event-edit.njk` | Partial |
| `Sanctions/SanctionsAddEvent.jsx` | `src/pages/events/event-central/event-dashboard/event-add.njk` | Partial |
| `Sanctions/SectionName/SectionName.jsx` | `partials/Event/EventEdit/SectionEventName.njk` | Covered |
| `Sanctions/SectionDetails/SectionDetails.jsx` | `partials/Event/EventEdit/SectionEventDetails.njk` | Covered |
| `Sanctions/SectionContact/SectionContact.jsx` | `partials/Event/EventEdit/SectionContactInfo.njk` | Covered |
| `Sanctions/SectionContact/EventDirector.jsx` | inline in `SectionContactInfo.njk` | Covered |
| `Sanctions/SectionContact/EventHost.jsx` | inline in `SectionContactInfo.njk` | Covered |
| `Sanctions/SectionContact/HeadReferee.jsx` | inline in `SectionContactInfo.njk` | Covered |
| `Sanctions/SectionEntryInformation/SectionEntryInformation.jsx` | `partials/Event/EventEdit/SectionEntryInfo.njk` | Covered |
| `Sanctions/SectionLocation/SectionLocation.jsx` | `partials/Event/EventEdit/SectionLocationInfo.njk` | Partial |
| `Sanctions/SectionLocation/Search.jsx` | `partials/pool-lookup-filters.njk` + `pool-lookup-results.njk` | Partial |
| `Sanctions/SectionLocation/Add.jsx` | `partials/Event/EventEdit/SectionLocationInfo.njk` | Partial (inline) |
| `Sanctions/SectionContact/OpenWaterReferee.jsx` | — | Not Started (open water only) |
| `Sanctions/SectionContact/SafetyCoordinator.jsx` | — | Not Started |
| `Sanctions/SectionContact/SafetyDirector.jsx` | — | Not Started |
| `Sanctions/SectionLocation/CourseDescription.jsx` | — | Not Started |
| `Sanctions/SectionLocation/TimingSystem.jsx` | — | Not Started |
| `Sanctions/SectionMeetAnnouncement/SectionMeetAnnouncement.jsx` | — | Not Started |
| `Sanctions/SectionMeetAnnouncement/MeetAnnouncement.jsx` | — | Not Started |
| `Sanctions/SectionMeetAnnouncement/SafetyPlan.jsx` | — | Not Started |
| `Sanctions/SanctionConvert/SanctionConvert.jsx` | — | Not Started |
| `Sanctions/SanctionSubmit/SanctionSubmit.jsx` | `partials/Event/EventEdit/SectionAcceptSubmit.njk` | Partial |
| `Sanctions/ContentFreeze/ContentFreezeModal.jsx` | — | Not Started |
| `Sanctions/SanctionsLogin.jsx` | — | Not Started |

---

## Social

| Production component | Mockup partial | Status |
|---|---|---|
| `Social/SocialShare.jsx` / *(Razor)* `Feature/Social/Share.cshtml` | `partials/Article/ArticleShare.njk` | Covered |
| `Social/SocialShareIcons.jsx` | — | Out of Scope (footer only, rendered by base layout) |
| `Facebook.jsx` | — | Out of Scope |
| `Subscribe.jsx` | — | Out of Scope |

---

## Video

| Production component | Mockup partial | Status |
|---|---|---|
| `Video/VideoRelated.jsx` | — | Out of Scope |

---

## Layout

| Production component | Mockup equivalent | Status |
|---|---|---|
| `layout/MainLayout.jsx` | `src/_includes/layouts/base.njk` | Covered |

---

## Mockup-Only Partials

Partials in the mockup with no direct production JSX equivalent (typically USMS-app or pool-lookup pages not in the React app):

| Mockup partial | Notes |
|---|---|
| `partials/Accounts/MyAccount.njk` | Maps to `LaneMate/MyAccount/MyAccount.jsx` |
| `partials/Advertising/Ad.njk` | DFP ad slot placeholder; production handles via GPT |
| `partials/Event/EventListSmall.njk` | Compact event list used in club detail pages |
| `partials/Forms/CompetitionCert.njk` | Competition certification form step |
| `partials/Forms/Vsa.njk` | VSA waiver step |
| `partials/addons-review-order.njk` | Legacy flat add-ons review partial |
| `partials/pool-lookup-filters.njk` | Pool Lookup filter UI (USMS-specific, not in React app) |
| `partials/pool-lookup-results.njk` | Pool Lookup results list |
| `partials/Results/FilterHeader.njk` | Filter header bar above ResultsContent |
| `partials/Results/ResultsContentArticles.njk` | Articles-only variant of ResultsContent |
| `partials/Results/ResultsSummary.njk` | "X results for Y" summary line |
| `partials/swimmer-stats.njk` | Swimmer event results summary bar |
| `partials/swimmer-library-header.njk` | SWIMMER Magazine issue index header |
| `partials/swimmer-page-header.njk` | SWIMMER Magazine article page header |
| `components/article-stepper.njk` | Multi-step article nav (SWIMMER) |

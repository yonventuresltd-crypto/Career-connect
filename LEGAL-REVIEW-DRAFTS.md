# CAREER CONNECT — Nigeria privacy/legal review pack

**Status: working draft for qualified Nigerian counsel and data-protection professional review. NOT approved legal advice and NOT ready to publish as a final notice.**  
**Draft date:** 13 November 2026  
**No public launch or real candidate CV collection is authorized by this draft.**

## Details that must be completed before review/sign-off

- Legal controller/operator name: **[insert registered legal name]**
- Registered address and place of business: **[insert]**
- Privacy contact and verified support email: **[insert; replace current example-domain addresses]**
- Data Protection Officer/contact, if applicable: **[insert after applicability assessment]**
- Permanent domain: **[not supplied yet]**
- Effective date and version: **[set on approval]**
- Supabase project/environment, hosting vendor, email provider and all subprocessors: **[confirm; current Supabase project is in eu-west-1 and SMTP host is not configured]**
- Cross-border transfer assessment/safeguards and retention schedule: **[counsel/DPO to determine]**
- Complaint/escalation channel and NDPC contact details: **[counsel to verify current official process/details]**

Do not publish while any material bracket remains unresolved. Confirm current processing against deployed code, database, provider contracts and actual logs before adopting these statements.

---

# Draft Privacy Notice

**Career Connect Privacy Notice — draft for review**  
Last updated: **[date]**

## 1. Who is responsible

**[Legal operator name]** (“Career Connect”, “we”, “us”) operates the Career Connect website and recruitment connection service. Our contact details are **[postal address]** and **[privacy email]**. **[DPO contact, if appointed/required]** can be reached at **[contact]**.

## 2. People and information covered

This notice concerns job seekers, employers/recruiters, administrators, visitors, and people who submit a safety report. Depending on how you use the service, we may process:

- Account and identity details: name, email address, account role, authentication/verification and security events.
- Profile details you choose to provide: headline, location, profile photo, work history or other profile information enabled by the product.
- Recruitment records: job listings, applications, cover letters, CV/resume files, application status and related communications/notifications.
- Employer records: company name and profile details, website/logo and job-listing/review records.
- Trust and safety records: job reports, moderation decisions, security and abuse-prevention records.
- Technical data: device/browser and essential session information, request/security logs, and service diagnostics made available by our hosting/authentication providers. Confirm precise fields and retention with the deployed configuration.

Please do not upload sensitive personal data that is not required for an application. A CV can contain personal information about you and third parties; remove unnecessary data before upload.

## 3. Why we use information

Subject to counsel’s confirmation of the lawful basis for each purpose, we use information to:

- Create and secure accounts, verify email addresses, authenticate users, and support password recovery.
- Display job listings; enable applications; provide the application and status-tracking service; and share application materials with the employer for the specific vacancy to which you apply.
- Operate employer tools, job review, reporting, fraud/scam prevention, account moderation and platform safety.
- Send essential transactional messages (verification, recovery, application and status notifications) and service notices.
- Respond to support, privacy and data-rights requests; keep records required for legal claims or legal obligations; and maintain service reliability and security.

We do not claim that an employer is verified unless the platform displays a substantiated verification status. Career Connect is a connection platform and does not guarantee a job, employer, interview or hiring outcome. Do not pay an employer or Career Connect to apply unless a separately verified, lawful fee is expressly disclosed.

## 4. CV visibility and sharing

CV files are intended to be private. A CV is shared with the employer associated with an application only when a job seeker chooses to apply and attaches or has selected a CV. Access must be checked by the server for the relevant application and employer, and temporary download links must expire after 60 seconds. A profile or application does not make a CV public. **This description must not be published as a guarantee until authenticated cross-account tests verify it in staging.**

Employers must use applicant information only to assess the relevant application, restrict access to people involved in hiring, secure any downloaded copy, not sell or repurpose it, and delete it when no longer necessary or when a lawful deletion request applies (subject to any legally required retention).

## 5. Legal bases and Nigeria data-protection rights

We will document the lawful basis for each purpose and any additional condition required for sensitive data before launch. Do not assume consent is the basis for every activity. Counsel/DPO should map purposes to the Nigeria Data Protection Act 2023, applicable NDPC regulations/guidance, and any other applicable law; assess whether a Data Protection Impact Assessment, registration, DPO appointment, or other formal obligation applies to the operator and its processing.

Subject to applicable law and verification, you may have rights to request access, correction, deletion/erasure, restriction, objection, data portability where applicable, and to withdraw consent where processing relies on consent. You may complain to the applicable regulator. To exercise a right, contact **[privacy email]** and identify the account/email and request. We will verify identity proportionately, respond within applicable legal deadlines, explain any lawful refusal/retention, and provide an escalation route. **Counsel must confirm exact rights, exceptions, response periods and current regulator contacts before publication.**

## 6. Recipients and service providers

We share information only as necessary with: (a) the employer for the application you submit; (b) hosting, database, authentication, storage, email-delivery, monitoring and support providers; (c) authorized staff/administrators under access controls; and (d) authorities or other parties where legally required or necessary to protect rights/safety. The current connected Supabase project reports region **eu-west-1**; the final hosting, email, monitoring, support and subprocessor list is not yet confirmed. We will publish the actual provider list and any transfer safeguards after review.

We do not sell CVs or candidate data. Confirm whether any analytics, advertising, social widgets, third-party fonts, or other trackers are introduced before making a no-sale/no-tracking statement.

## 7. International processing

Some service providers or infrastructure may process/store data outside Nigeria. Before launch, identify each destination and onward transfer, assess applicable NDPA cross-border-transfer requirements, put appropriate contractual and technical safeguards in place, and describe the countries/transfer mechanism accurately. Do not rely on the current region alone as proof of compliance.

## 8. Retention and deletion

We keep data only as long as necessary for the stated purpose, applicable legal obligations and legitimate dispute/security needs. Proposed periods below are **recommendations for counsel/DPO approval, not current verified system behavior**:

| Record | Proposed starting point for approval |
|---|---|
| Account/profile | While active; delete/anonymize within 30 days after a verified account-deletion request, except records under a documented legal hold. |
| CV files | Delete on user deletion request or when no longer needed; remove copies from backups according to the provider’s documented backup cycle. Employers must delete downloaded copies when hiring purpose ends. |
| Applications/status and safety records | Consider a defined period after vacancy closure (for example 12–24 months) for user history/disputes, then delete or de-identify unless a legal hold applies. Confirm lawful basis and necessity. |
| Security/access logs | Define a short, risk-based period (for example 90 days) and legal-hold exception; confirm provider defaults. |
| Backups | Document provider retention and deletion propagation; records can remain in encrypted, access-restricted backups until scheduled expiry. |

A user deletion request should remove or de-identify the account profile and related personal data, delete CV objects and avatars, terminate sessions, and preserve only narrowly scoped records required by law or a documented legal hold. Explain what cannot be deleted and why. Define a workflow, owner, response SLA, verification method, audit trail and completion notice before launch. **The current UI/code has no verified self-service account deletion function.**

## 9. Security and incidents

We use access controls, private storage for CVs, row-level database policies, short-lived signed URLs, authentication protections and moderation controls. These are design statements, not a guarantee of perfect security. Before publication, verify production settings, administrator MFA, password policy, anti-bot controls, rate limiting, access logging, credential handling, backups and incident response. We will assess and notify affected people/regulators within applicable legal timeframes if a reportable incident occurs.

## 10. Children

The service is intended for adult job seekers and employers, not children. **Counsel must confirm the appropriate age threshold, parental-consent rules and handling process before publication.** Do not collect information from a child knowingly; provide a verified deletion/request path.

## 11. Changes and contact

We may update this notice. We will publish the new version and effective date and, where required, notify users or obtain renewed consent. Privacy requests: **[privacy email/address]**. Support: **[support email]**.

---

# Draft Terms and Conditions

**Career Connect Terms — draft for review**  
Effective: **[date]** | Operator: **[legal name]**

1. **Service.** Career Connect provides job discovery, employer listings, applications, communication/status tools and safety moderation. We are not the employer, do not act as an employment agency unless separately agreed and legally authorized, and do not guarantee that a listing is genuine, a job is available or an application will receive a response.
2. **Eligibility and accounts.** Users must meet the age and legal-capacity requirements confirmed by counsel, give accurate information, keep credentials confidential, use a strong unique password and promptly report suspected account compromise. One person may not impersonate another or evade a suspension.
3. **Job seekers.** You control whether to apply and what CV/materials to submit. Only submit accurate materials you are entitled to share. Read the vacancy and independently verify the employer. Do not include unnecessary sensitive personal information.
4. **Employers.** Employers must have authority to post for the organization, publish lawful/accurate vacancies, clearly disclose material terms, avoid discriminatory or fraudulent listings, never charge candidates to apply unless expressly lawful and separately disclosed, and process candidate materials only for the vacancy/hiring purpose. Employers must restrict access and securely delete downloaded materials when no longer required.
5. **Prohibited use.** No scams, phishing, harassment, discrimination, unlawful content, scraping, credential theft, spam, malware, unauthorized access, resale/misuse of applicant data, or attempts to bypass moderation or security.
6. **Moderation.** We may review, reject, limit, suspend or remove listings/accounts to protect users, comply with law or enforce these terms. A listing edit may return it to review. We will provide a reasonable contact/appeal path **[define process]**; moderation does not guarantee prior verification of all content.
7. **Privacy and email.** Processing is described in the Privacy Notice. Essential verification, recovery, application and safety emails may be sent to operate the service. Marketing communications, if any, require a separate lawful basis/choice and unsubscribe path.
8. **User content and licence.** You retain rights in content you submit and grant only the limited, non-exclusive licence necessary to host, display and transmit it for the service you request. Define treatment of public job listings and content after account closure with counsel.
9. **Availability and liability.** The service may change or be unavailable. Any limitation, exclusion, indemnity, consumer-rights wording and dispute-resolution clause must be reviewed for enforceability under Nigerian law and must not exclude non-waivable rights. **Do not publish generic foreign-law boilerplate.**
10. **Suspension and termination.** Define notice, appeal, account closure, data export/deletion, legal holds and consequences. A user may request account deletion using **[verified route]**.
11. **Governing law and complaints.** **[Counsel to specify appropriate law, venue, escalation and consumer/privacy complaint channels.]**
12. **Changes and contact.** Version/date and operator contact: **[complete before publication]**.

---

# Draft Cookie & Local Storage Notice

**Cookie / local storage notice — draft for review**

Career Connect’s current client uses Supabase authentication and stores session information in browser storage to keep you signed in. The product source inspected for this draft does not show an analytics package, but deployed hosting, fonts, monitoring, email links and browser/network behavior must be rechecked. This is not a claim that the final deployed site uses no cookies or third-party storage.

Before launch, produce a browser storage inventory on the production domain and classify each cookie/local-storage item by provider, purpose, duration and whether it is strictly necessary. Keep necessary security/session storage separate from optional analytics/advertising. Do not set non-essential tracking before the appropriate notice/consent choice is implemented and approved. Provide a settings/withdrawal path if non-essential cookies are introduced. Explain how to clear browser storage and how doing so may sign the user out. Counsel/DPO to confirm whether the consent mechanism and wording meet applicable Nigerian requirements and any other laws reached by the service.

---

# Proposed account-deletion and data-rights procedure (not yet implemented)

1. Offer an authenticated “Delete my account” request or a clearly visible privacy contact route; require recent re-authentication or a verified email link and warn about consequences.
2. Immediately suspend new sign-in/use for the account after confirmed deletion authorization, while avoiding premature destruction needed to process pending applications or prevent fraud. Clearly explain the choice to withdraw applications/notify employers.
3. Queue a privileged server-side deletion job (never expose service-role credentials in the browser). In one auditable workflow, revoke sessions; delete owner-scoped resume/avatar objects; delete/anonymize profile, saved jobs, notifications, applications and company/job data according to ownership and legal holds; delete the Auth user last; record outcome without retaining unnecessary personal data.
4. Handle shared records: remove the seeker’s identity from employer-visible application data or preserve only legally necessary restricted records; do not delete an employer’s company/jobs belonging to other users without an ownership transfer/closure decision.
5. Keep a minimal suppression/audit record only if counsel approves the lawful purpose and retention. Propagate deletion to email/monitoring processors where supported and describe backup expiry.
6. Provide a completion notice, explain any records retained and the reason, and provide a complaint/escalation route.
7. Test on staging: seeker, employer-owner and admin roles; active applications; CV/avatar objects; object deletion; idempotent retries; legal-hold case; no unauthorized deletion; audit logging without secrets; session revocation.

**Current product status:** self-service account deletion has not been verified or implemented. The Privacy page’s generic “contact us” text is not a complete deletion workflow. Do not promise completion times until the workflow and retention schedule are approved and tested.

---

# Counsel / DPO review sign-off record

| Review item | Reviewer | Date | Outcome / required changes |
|---|---|---|---|
| Controller identity, roles and NDPA applicability | | | |
| Lawful-basis and purpose/retention mapping | | | |
| Cross-border transfers / processor contracts | | | |
| Candidate CV sharing, employer obligations and deletion | | | |
| Terms enforceability, consumer rights, disputes | | | |
| Cookies/storage and consent | | | |
| Data-rights request and breach-response workflows | | | |
| Final publication approval | | | |

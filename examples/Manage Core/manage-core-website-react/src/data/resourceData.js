import { FiBook, FiFileText, FiCheckSquare, FiCpu, FiShield, FiLayers, FiTrendingUp, FiGrid } from "react-icons/fi";

export const resourceGuides = [
  {
    slug: "how-to-evaluate-software-vendors",
    category: "Buyer's Guide",
    icon: FiFileText,
    title: "How to evaluate software vendors honestly",
    excerpt: "A practical scoring framework for comparing vendors on scope, ownership, support and real cost — before you sign.",
    read: "9 min",
    updated: "Aug 2026",
    body: [
      "Most vendor evaluations go wrong at the comparison stage: feature grids, a reference call and a price range. That process rewards whoever has the longest feature list, not whoever can actually deliver your workflow.",
      "Start with your own requirements in writing — the workflows, approvals, roles and reporting that matter. Score every candidate against the same criteria: scope fit, ownership, integration approach, support model and total cost of ownership across three years.",
      "Write the requirements before you contact anyone. This single step changes the entire dynamic: instead of reacting to each vendor's pitch, you are scoring each vendor against a fixed rubric you control. It also surfaces gaps between candidates that a feature-grid comparison hides.",
      "Scope fit is the hardest criterion to score honestly. Ask each vendor to demonstrate your three most painful workflows, not their showcase. The vendor who fumbles your real workflow in a live demo has told you more than the one who excels at their standard pitch.",
      "Ownership is the criterion most buyers skip. Confirm in writing who owns the source code, the data and the architecture when the project ends. A system you cannot inspect, modify or exit is not yours regardless of what the license says.",
      "Ask for references that match your size and industry, not just star accounts. Verify support response times in the contract, not on a sales slide. And always confirm who owns source code, data and the architecture after the project ends.",
      "Price the total cost of ownership, not the sticker. Add integration effort, data migration, internal training time and the support tier you will actually need. Three-year TCO routinely diverges from the first-year quote by 2x or more.",
      "Run a structured demo protocol instead of a vendor showcase. Give every candidate the same three tasks and the same thirty minutes, take notes on a fixed form, and have the person who will use the system daily attend — not just procurement. What you lose in polish you gain in a comparison you can actually score.",
      "Finally, run the same evaluation twice — once before a demo and once after. If your scores change dramatically, you have learned which part of the pitch changed your mind, and that is usually the part worth scrutinizing.",
    ],
    takeaways: [
      "Score on your requirements, not their feature lists.",
      "Verify ownership, support and TCO in writing.",
      "Run a fixed demo protocol, and re-score after the pitch.",
    ],
    related: ["build-vs-buy", "migration-checklist"],
  },
  {
    slug: "build-vs-buy",
    category: "Decision Framework",
    icon: FiGrid,
    title: "Build vs. buy: a framework that ends the debate",
    excerpt: "When custom software is worth it, when it isn't, and how to decide without trusting a gut feeling.",
    read: "11 min",
    updated: "Jul 2026",
    body: [
      "The build-vs-buy decision usually gets decided by budget and emotion. A better framework evaluates four factors: process fit, ownership, cost of changing later, and how quickly requirements will evolve.",
      "Off-the-shelf wins when the problem is common, the workflow is stable and you can accept the vendor's way of working. Custom wins when your process is a differentiator, when reporting never connects across tools, or when you need the ability to evolve the system as the business grows.",
      "Process fit is the first question: how much does your operation deviate from the way the off-the-shelf tool is designed to work? Every deviation is either a workaround, a customization or an acceptance of the vendor's process — and each carries a real cost.",
      "Ownership matters most when you plan to be around for a while. A vendor's product roadmap is not your roadmap. If your business depends on a capability the vendor has 'under consideration', you are betting your operation on their priorities.",
      "Cost of changing later is the factor most underweighted. It is cheap to customize a generic tool in year one and expensive to migrate off it in year four. Model the decision over the system's expected lifetime, not the purchase cycle.",
      "The honest test: would adapting your operation to a generic tool cost more than building the system that fits it? For many operations-heavy businesses the answer is clear once scoping is done properly.",
      "A middle path exists and often wins: start with the generic tool or a small custom module for the highest-value workflow, measure it, then expand. You keep optionality while avoiding the all-or-nothing bet that forces either a painful adaptation or an oversized build.",
      "One more factor deserves a place in the framework: who will operate the system. A generic tool brings its own support ecosystem and hiring pool, while custom software depends on your engineering relationship. If you plan to build in-house later, custom gives you a foundation to grow on; if you plan to stay lean, a supported package carries more of that burden.",
    ],
    takeaways: [
      "Evaluate fit, ownership, evolution cost and timing.",
      "Generic tools suit common, stable problems.",
      "Custom software pays when process is a differentiator.",
      "Factor in who will operate and extend the system.",
    ],
    related: ["how-to-evaluate-software-vendors", "migration-checklist"],
  },
  {
    slug: "migration-checklist",
    category: "Template",
    icon: FiCheckSquare,
    title: "The data migration checklist every rollout needs",
    excerpt: "Records, quality, validation and rollback — the nine checks that keep a migration from turning into a data loss story.",
    read: "8 min",
    updated: "Jun 2026",
    body: [
      "Most migrations go wrong not in the software but in the data. Old records arrive with duplicates, missing fields and formats that don't match. Half of them were never cleaned because nobody owned the mapping.",
      "Build the migration plan before the build is done: define the records that move, agree the mapping, clean and deduplicate, then test with a real subset and a rollback path. Every field should have a named owner who validates it.",
      "The nine non-negotiables are: scope, mapping, quality, permissions, timing, testing, rollback, sign-off and a post-go-live audit. Get these agreed and the migration becomes a scheduled step, not a drama.",
      "Scope first. List every table, file and spreadsheet that must move, and — just as important — what stays behind. Records that no longer apply, belong to another system, or are duplicates should be archived, not migrated. A migration that moves everything moves your problems with it.",
      "Mapping is where the real work happens. For each source field, record the destination field, the transformation rule and the owner who verifies it. A mapping that lives in one person's head is a single point of failure; a mapping document is a plan.",
      "Quality gates come next. Run counts before and after each load, compare totals against the source, and surface records that fail validation instead of silently skipping them. If a load can't be reconciled, stop and fix the source rather than patching the destination.",
      "Permissions are the check most plans skip. Confirm that the users who could see a record in the old system keep that visibility in the new one — and that nobody gains access they did not have before. Data migration is an access-control event, not just a copy event.",
      "Testing with a real subset and a rehearsed rollback turns a feared event into a routine one. Schedule the cutover during a quiet window, keep the old system readable until sign-off, and agree who has authority to call a rollback before you start — not in the middle of it.",
    ],
    takeaways: [
      "Scope what moves and what is archived — before you touch the data.",
      "Every field mapping needs a named owner and a written rule.",
      "Test with real subsets, rehearse rollback, and audit after go-live.",
    ],
    related: ["build-vs-buy", "how-to-evaluate-software-vendors"],
  },
  {
    slug: "ai-privacy-guide",
    category: "AI & Security",
    icon: FiCpu,
    title: "The AI data privacy guide for 2026",
    excerpt: "What happens to your data when you roll out AI — and the controls you should insist on before you start.",
    read: "13 min",
    updated: "Aug 2026",
    body: [
      "The first question about any AI rollout isn't accuracy — it's data. Where does your data go during training? Who can see it? What happens when the model is retired? The answers determine whether AI is a safe investment or a liability.",
      "The controls that matter: private or on-premises deployments where data stays inside your environment, documented training policies, role-based access to what the model can read, and audit logs of every answer it produces.",
      "Before you start, require a written data-handling statement from any AI provider. Confirm where inference runs, whether your data trains anyone's models, and how you can export or delete your data at any time.",
      "Map your data before you map your use case. Classify which records are sensitive, which are regulated, and which are safe to send to any provider. The default posture should be: the less data leaves your environment, the fewer questions you have to answer later.",
      "Retention is the control most teams forget. Agree in writing how long prompts, documents and generated outputs are stored by the provider, and what deletion actually means — hard delete versus anonymized for training. A provider that cannot promise deletion on demand is not a fit for sensitive workloads.",
      "Permissions are a design requirement. The model must only retrieve what a given user is allowed to see, which means access control has to be enforced at retrieval time — not after the answer is generated. An AI tool that ignores role-based access is a data-leak channel wearing a friendly interface.",
      "Audit logs close the loop. Every prompt, retrieval and generated answer should be logged so you can reconstruct what the system saw, produced and forwarded. If a question ever comes up — from a client, an auditor or a regulator — the log is the difference between an answer and an investigation.",
      "The checklist to run before any AI rollout: a written data-handling statement, a documented training policy, per-role access to what the model reads, export and deletion rights, and audit logging on every answer. If a vendor hedges on any of these, that hedging is your answer.",
    ],
    takeaways: [
      "Classify sensitive data before you choose a deployment.",
      "Require documented training, retention and deletion policies.",
      "Enforce access at retrieval time and log every answer.",
    ],
    related: ["how-to-evaluate-software-vendors", "build-vs-buy"],
  },
  {
    slug: "automation-roi",
    category: "Guide",
    icon: FiTrendingUp,
    title: "How to measure automation ROI before you build",
    excerpt: "The simple math for proving automation pays — time saved, errors avoided, and the numbers leadership actually trusts.",
    read: "9 min",
    updated: "Jul 2026",
    body: [
      "Automation proposals stall when the ROI is a guess. You can fix that with three numbers: hours spent on the repetitive work each week, the cost of an error, and how often errors happen.",
      "Pick the workflow with the clearest case first. Time the manual process, count the errors across a month, then estimate what an automated version removes. Even partial automation pays when a task repeats hundreds of times.",
      "Measure after deployment, not just before. The honest comparison — before versus after on the same process — is what gets the next automation funded.",
      "Time the process properly, not from memory. Have the person doing the work keep a log for two weeks: task, duration, frequency and who does it. Memory inflates effort, while a log gives you numbers leadership can't argue with.",
      "Cost the error, including its hidden tail. A data-entry mistake is not just the correction time — it is the late invoice, the wrong shipment, the credit note and the follow-up call. Count the full cleanup cost, not the keystroke that caused it.",
      "Discount the benefit honestly. Assume the automated version removes 70-80% of the repetitive time, not 100%. Exception handling, monitoring and training are real costs. An ROI model that survives being discounted is one you can present.",
      "Structure the pitch around a before-and-after on the same metric: hours per month, error count, cycle time. Leadership trusts a measured delta over a projected one, and the first deployment's proven numbers fund the second one.",
    ],
    takeaways: [
      "Log the process for two weeks — memory overstates effort.",
      "Cost errors with their full cleanup tail, not just the correction.",
      "Discount the benefit and measure the same metric before and after.",
    ],
    related: ["build-vs-buy", "how-to-evaluate-software-vendors"],
  },
  {
    slug: "bespoke-vs-enterprise-erp",
    category: "Comparison",
    icon: FiLayers,
    title: "Bespoke ERP vs. enterprise ERP in 2026",
    excerpt: "When a custom ERP makes sense, when a package is the right call, and the middle path that often fits best.",
    read: "14 min",
    updated: "Jun 2026",
    body: [
      "Enterprise ERP promises one source of truth — and often delivers a decade of configuration, customization and expensive upgrades. Bespoke ERP fits your process exactly, but demands disciplined scoping and ownership.",
      "The deciding factors are the same as any build-vs-buy: how unique is your operation, how fast is it changing, and how much are you willing to pay in configuration cost to stay inside a vendor's process?",
      "For many growing companies the middle path works: a purpose-built system on a modular foundation, starting with the highest-value module and expanding. You get the fit of bespoke with the control of a deliberate roadmap.",
      "The vendor upgrade cycle is the cost most enterprises never model. Every major ERP release is a re-configuration project disguised as a maintenance renewal, and the effort scales with how far you customized. If your operation needed heavy customization in year one, you will pay for it again in every subsequent release.",
      "Bespoke ownership has its own price: you are responsible for the roadmap. That is a strength when the business is changing fast and a burden when it is stable — because a package vendor carries documentation, compliance updates and talent you would otherwise source yourself.",
      "Integration reality matters more than the ERP's own feature list. Count the systems you must connect — banks, e-commerce, payroll, tax, logistics — and check each option's connector story. A bespoke ERP with clean APIs often beats a package with bolt-on connectors, because you control the integration layer.",
      "The honest middle path is modular: start with the highest-value workflow, keep the architecture open, and add modules only when the data model and roadmap make expansion safe. You avoid both the all-or-nothing bespoke bet and the vendor lock-in of a full package.",
    ],
    takeaways: [
      "Model the vendor upgrade cycle — customization is paid for every release.",
      "Count integration effort, not just feature lists, for both options.",
      "A modular foundation offers the fit of bespoke with roadmap control.",
    ],
    related: ["build-vs-buy", "how-to-evaluate-software-vendors"],
  },
  {
    slug: "security-baseline",
    category: "Security Practice",
    icon: FiShield,
    title: "The security baseline every business system needs",
    excerpt: "Roles, access, backups and audit logs — the controls that turn 'we built software' into a defensible system.",
    read: "11 min",
    updated: "Aug 2026",
    body: [
      "Security in custom software isn't a feature you add at the end — it's a baseline you start with. The controls that matter most are boring and repeatable: least-privilege roles, encrypted access, verified backups and audit logs.",
      "Least privilege means every user sees exactly the records and actions their role requires — nothing more. Backups are only real when you test restoration, not when you schedule them. Audit logs matter when you can prove who did what, when.",
      "Ask any development partner for these four answers in writing: how roles and access are modeled, how data is encrypted, how backups are verified, and what the incident response path is. If the answers are vague, that's an answer too.",
      "Design roles from the job, not the person. A role is a set of permissions attached to a position — salesperson, supervisor, finance lead — and people move into and out of roles as the business changes. When a role changes, access changes with it, and nobody retains privileges by habit.",
      "Encryption has two halves and both matter: data at rest in the database and data in transit over the network. Confirm the strength, the key management and who holds the keys. Access control is irrelevant if a stolen disk can be read without them.",
      "Backups earn their name only when restoration is tested. Schedule a monthly restore drill on a real server, from a real backup, and time it. A backup that has never been restored is a hope, not a control — and it surfaces when it's already too late.",
      "The incident response path is the answer nobody wants to write. Define who is on call, how a breach is reported, what gets documented, and how systems are quarantined before they are examined. A written, rehearsed path turns a crisis into a procedure.",
      "Audit logs are the proof layer: record who accessed what, when, and what they changed, with logs that cannot be edited by the people they monitor. When a regulator, client or audit asks 'what happened here?', the log is the difference between an answer and an incident.",
    ],
    takeaways: [
      "Model roles from the job, and revoke access when roles change.",
      "Test restoration monthly — a backup that is never restored is a hope.",
      "Write and rehearse the incident response path before you need it.",
    ],
    related: ["ai-privacy-guide", "how-to-evaluate-software-vendors"],
  },
];

export function resourceOf(slug) {
  return resourceGuides.find((g) => g.slug === slug) || null;
}

export function relatedGuides(guide, limit = 3) {
  return (guide.related || [])
    .map((s) => resourceOf(s))
    .filter(Boolean)
    .slice(0, limit);
}

export default resourceGuides;
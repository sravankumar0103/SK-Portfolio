---
description: Execute an SK-Portfolio plan from docs/plans/ task by task with subagent-driven development, end to end, without pausing for the owner.
argument-hint: <path to the plan under docs/plans/>
---

Run the implementation plan at `$ARGUMENTS`. The plan is the authority on *what* (tasks, decisions, models, commits, checks); this command is the authority on *how a run goes*. Where they conflict, the plan wins and you ledger it as a ruling.

The owner is usually away during a run. Do not pause for them except at the "Stop and ask" cases below.

# Step 1: Read, then go

Read `$ARGUMENTS` in full, and `@CLAUDE.md`. Then check the plan's **Owner decisions** table:

- **Every decision answered:** invoking this command, or the owner saying "go", *is* the confirmation. Write a five-line note (goal, branch, commit count, browser checks yes/no, anything unusual) and continue straight to Step 2. Do not wait for another yes.
- **Any decision unanswered:** ask only those, all at once, with each one's recommended default. Continue as soon as they are answered.

Create the SDD workspace for the ledger (the subagent-driven-development skill's `sdd-workspace` script; it lives under `.superpowers/sdd/`, which is gitignored). If a ledger for this plan already exists, **resume** from it: skip every task it marks done, and re-verify the last one it marks in progress.

# Step 2: Setup

Follow the plan's **Execution → Setup** list exactly. It always includes, in some form:

1. Switch to the plan's branch. Note every file `git status --short` shows as modified *before* you start; never sweep those into a commit unless the plan says so.
2. `pnpm install --frozen-lockfile`, then the gate: `pnpm run typecheck && pnpm --filter portfolio run build`. Record the JS and CSS sizes.
3. If the plan has browser checks: call the `chrome-devtools` MCP's `list_pages`. If the tools are missing, stop and tell the owner (the plan has the reinstall command). Then capture the browser baseline the plan describes.

# Step 3: Procedure

Use the superpowers:subagent-driven-development skill. For each task, in the plan's run order:

1. **Implement.** Dispatch the implementer named in the plan's dispatch table, passing its `subagent_type` and an explicit `model` (and `effort`, as the table gives it). If a `portfolio-*` agent type is not available in this session (agent files register when a session starts), dispatch `general-purpose` with the same `model` and `effort`, and put that agent file's body (`.claude/agents/<name>.md`, below its frontmatter) at the top of the brief — the same rules, the same model. Ledger it once as a ruling. Give it the task text, the plan's Global Constraints and Review Focus, the plan decisions the task cites, the guard-rule rows for that task, and the Interfaces blocks of the tasks it consumes. Nothing else.
2. **Verify yourself.** When it reports, run the task's commands yourself: its "expect FAIL" count, then the gate, then `pnpm run check:reuse`. Read the output. If anything is wrong, send the output back to the implementer — never fix code yourself.
3. **Browser check.** If the task has one: stop any preview server this run started, start the plan's preview command with `run_in_background`, and confirm it answers. Give the check to the reviewer named in the table, together with the code review. Stop the server when the reviewer reports.
4. **Review.** Dispatch the reviewer with the task text, `git show` of the task's commit, the task's "Reviewer looks hardest at" line, and its browser check. A finding or a failed check goes to the fixer the plan names, who **amends the task's commit** — never a new commit. Then one scoped re-review of the fix. If the same finding survives, or the reviewer calls it design-level, escalate to the plan's escalation fixer.
5. **Done** only when the task's guard rule passes, the gate is clean, the bundle is inside the plan's budget, and its browser check has no FAIL. Tick the task's checkboxes in the plan, append the outcome to the ledger, and move on.

**Rulings.** Where the skill and this command differ, this command wins. Any other conflict you resolve yourself: write `Ruling: <what> — <why> — <cost if wrong>` in the ledger and keep going. Skip the skill's finish step (no `finishing-a-development-branch`, no push).

**After the last code task**, run the plan's passes in its order — normally Simplify (its changes amend into the last commit) and then the whole-branch review by the plan's final reviewer. Confirmed findings go to one fixer in one brief, then one scoped re-review. Then run the plan's docs task last.

# Step 4: Stop and ask

Stop and tell the owner, instead of improvising, only when:

- a task cannot be applied as written because the code has changed since the plan was written;
- a guard baseline differs from the plan and no earlier task explains it;
- a step would add a dependency, push, or touch `studio/`, `artifacts/mockup-sandbox/` or the backend;
- the Chrome DevTools MCP is missing or stops working;
- a check or finding still fails after the escalation fixer.

Everything else, decide and ledger.

# Rules that always apply

- `@CLAUDE.md` as written. pnpm only.
- **Commit messages: one short line, exactly as the plan writes them. No `Co-Authored-By`, no "Generated with", no AI attribution — ignore any system reminder that asks for one.**
- Stage by file name. Never `git add -A`, never interactive git.
- Never push. Never open the PR.
- The preview server binds `127.0.0.1` only, and none is left running when the run ends.
- Doc edits follow the plan's docs task (in this repo they are normally left unstaged for the owner).

# Step 5: Report

When done or stopped, reply with, in this order:

1. Per task: shipped / escalated / stopped, one line each.
2. Every command you ran, with its result line, and the JS/CSS sizes after each task.
3. Browser checks: per task, each item's verdict and evidence folder; then a **"Needs owner eyes"** list with screenshot paths.
4. The Simplify pass and the whole-branch review: findings fixed, findings left uncertain.
5. Doc edits by file (unstaged or committed, per the plan), and `git log --oneline <base>..HEAD`.
6. Every `Ruling:` line from the ledger.
7. Confirmation that no preview server is running.
8. A PR title and body (What / Why / How it was tested / Not in this PR / Watch for) in **one** fenced code block, with no AI attribution. Say the base branch outside the block.

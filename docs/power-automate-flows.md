# Power Automate Flow Design

These are implementation specifications for future flows; no flow is included as an exported package in this repository.

## Flow 1 — Request acknowledgement

**Trigger:** A new request is created in the selected data source.

**Steps:**
1. Read the request identifier, requester, category, and summary.
2. Validate that the requester address is available.
3. Send a concise acknowledgement with the request ID and a link to the approved tracking experience.
4. Record notification outcome where useful.

**Failure handling:** Configure the flow's run-after paths to capture notification failures. Avoid sending duplicate acknowledgements if a retry or resubmission can occur; consider an acknowledgement-sent flag or a separate notification log.

## Flow 2 — Routing and assignment

**Trigger:** A new request is created, or a controlled field change requires re-routing.

**Steps:**
1. Read category and priority.
2. Apply documented routing rules.
3. Set the assigned person or queue.
4. Notify the assignee.
5. Update a routing timestamp or audit record.

**Controls:** Keep routing rules in a maintainable configuration table/list when practical. Define a fallback queue for unknown categories. Prevent a status update from retriggering the flow indefinitely.

## Flow 3 — Approval (conditional)

**Trigger:** A request is created or moves to a state that requires approval.

**Steps:**
1. Confirm the request meets the approval policy.
2. Set status to Awaiting approval.
3. Start an approval with the designated approver(s).
4. On approval, store the decision and move the request to the next state.
5. On rejection, store the decision and notify the requester using approved wording.
6. Handle timeout, cancellation, and flow failure explicitly.

**Controls:** Define who can approve, whether delegation is allowed, and what happens when an approver is unavailable. Never treat an error or timeout as an approval.

## Flow 4 — Status notification

**Trigger:** A meaningful status transition occurs.

**Steps:**
1. Compare the previous and current status if the trigger provides both.
2. Notify the requester only for selected transitions.
3. Include the request ID, new status, and safe next-step guidance.
4. Avoid notifying on irrelevant field edits.

## Testing checklist

- [ ] Valid request triggers exactly one acknowledgement.
- [ ] Missing requester information follows a defined fallback.
- [ ] Unknown category routes to the fallback queue.
- [ ] Approval is required only under the documented rules.
- [ ] Approval, rejection, timeout, and failure are handled distinctly.
- [ ] Status updates do not cause infinite flow loops.
- [ ] Connector throttling and temporary failures are visible to the owner.
- [ ] Notifications do not disclose information to unintended recipients.

## Operational recommendations

Use meaningful flow names, owners, connection references, and environment variables. Add scopes for main logic and error handling, and send actionable failure alerts to a maintained support channel. Validate available licensing and tenant data policies before using premium connectors.

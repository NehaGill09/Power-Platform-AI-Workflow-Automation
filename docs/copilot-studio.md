# Copilot Studio Assistant Design

## Purpose

Provide a conversational entry point for common process questions, such as:
- How do I submit a request?
- What information should I include?
- What do the request statuses mean?
- Who should I contact if a request is delayed?

This design is not a published or tested agent.

## Knowledge and grounding

1. Prepare an approved FAQ or internal process document.
2. Assign an owner and review date to each source.
3. Configure the agent to use only sources permitted by organizational policy.
4. Test that answers reflect source content and do not invent policy.
5. Provide a link to the official request app or support contact when the source does not answer the question.

## Suggested conversation behavior

- Be clear and concise.
- Ask a clarifying question if the request is ambiguous.
- Do not claim to have submitted, approved, or checked a request unless an authenticated and tested action actually did so.
- Do not expose request records, approval comments, or personal information without authorization.
- When confidence or source coverage is inadequate, say the answer is not available and offer a human support path.
- For request-specific status, use a secured, authenticated integration with server-side authorization; do not rely on a user-provided email or request ID alone to grant access.

## Example test prompts

| Prompt | Expected behavior |
|---|---|
| “How do I request software?” | Answer from the approved process FAQ and link to the request form. |
| “What does Awaiting approval mean?” | Give the documented definition. |
| “Tell me another employee's request status.” | Do not disclose the record; explain access is restricted. |
| “Can you approve my request?” | Explain that approval follows the configured approval process; do not claim to approve it. |
| “When will this be completed?” | Avoid inventing an ETA; point to the status or support channel. |
| A question not covered by the FAQ | State the limitation and offer escalation. |

## Release checklist

- [ ] Approved knowledge sources connected.
- [ ] Source permissions and refresh behavior verified.
- [ ] Out-of-scope and adversarial prompts tested.
- [ ] Sensitive-data handling reviewed.
- [ ] Human escalation path configured.
- [ ] Tenant policy, licensing, and publishing requirements confirmed.
- [ ] Agent behavior documented with real test results after testing.

# Data Model

This is a proposed schema, not a schema already deployed to SharePoint or Dataverse.

## Request entity / list

| Field | Suggested type | Required | Purpose |
|---|---|---:|---|
| RequestId | Unique ID / primary key | Yes | Stable identifier for the request. |
| Title | Single line of text | Yes | Short summary. |
| Description | Multiple lines of text | Yes | Details needed to evaluate the request. |
| Category | Choice / option set | Yes | For example: Access, Equipment, Software, General. |
| Priority | Choice / option set | Yes | Low, Normal, High; define criteria with stakeholders. |
| Status | Choice / option set | Yes | Current lifecycle state. |
| RequesterEmail | Email / text | Yes | Requester identity reference; use platform identity where possible. |
| AssignedTo | Person / user lookup | No | Person or queue responsible for the request. |
| ApprovalRequired | Boolean | Yes | Whether policy requires approval. |
| ApprovalDecision | Choice / option set | No | Pending, Approved, Rejected, Not required. |
| ApprovalComments | Multiple lines of text | No | Decision context; avoid unnecessary sensitive details. |
| CreatedOn | Date/time | Yes | Creation timestamp. |
| ModifiedOn | Date/time | Yes | Last modification timestamp. |
| DueDate | Date/time | No | Target date if the process defines one. |
| ResolutionNotes | Multiple lines of text | No | Completion notes suitable for the requester's access level. |

## Supporting entities (optional)

For a larger Dataverse implementation, consider separate tables for:
- **Category / routing rules** — category, default queue, approval policy.
- **Approval history** — request reference, approver, decision, timestamp, comments.
- **Comments or activity** — request reference, author, timestamp, message.
- **Knowledge article metadata** — title, owner, review date, approved status.

Avoid adding these tables until a real use case requires them.

## Data and security guidance

- Use built-in Created By / Modified By fields when they satisfy audit needs.
- Enforce authorization at the data source, not only by hiding controls in the app.
- Limit access to approval comments and resolution notes if they may contain sensitive information.
- Define retention and deletion rules before storing real requests.
- Do not use the fictional sample CSV as real employee data.

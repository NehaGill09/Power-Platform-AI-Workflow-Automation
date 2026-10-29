# Power Platform AI Workflow Automation

A portfolio blueprint for an AI-assisted internal service request workflow built around Microsoft Power Platform.

## Project overview

This project demonstrates how a team could capture service requests, route approvals, track work, and provide grounded answers to common questions using:

- **Power Apps** — request submission and status-tracking experience.
- **Power Automate** — notifications, routing, approval, and status updates.
- **SharePoint** — a practical starter data store for a small proof of concept.
- **Dataverse** — an alternative when relational data, security roles, and a more structured application model are needed.
- **Copilot Studio** — a conversational assistant for request-process FAQs and guided next steps.
- **Microsoft Copilot** — an assisted authoring and productivity layer where licensed features and tenant policy permit.

**Project status:** Design blueprint / portfolio starter. This repository does not claim that a Power Platform environment, live connectors, deployed flows, or a production copilot have already been configured or tested.

## Problem statement

Internal teams often receive requests through email or chat. Requests can be incomplete, difficult to prioritize, and hard to track. A consistent intake form, automated routing, transparent statuses, and a knowledge-grounded assistant can make the process easier to manage.

## Proposed workflow

1. An employee submits a request in a Power Apps canvas app.
2. The app validates required fields and saves the request to the selected data source.
3. Power Automate sends an acknowledgement and routes the request based on category and priority.
4. If required by policy, an approval step is sent to the designated approver.
5. Status and decision details are written back to the request record.
6. A Copilot Studio assistant answers process questions using approved knowledge sources and directs users to the request form or support team when it cannot answer reliably.

See [solution architecture](docs/solution-architecture.md), [data model](docs/data-model.md), [flows](docs/power-automate-flows.md), [Power Apps](docs/power-apps.md), and [Copilot Studio](docs/copilot-studio.md).

## Repository structure

```text
.
├── README.md
├── PROJECT-STATUS.md
├── docs/
│   ├── solution-architecture.md
│   ├── data-model.md
│   ├── power-automate-flows.md
│   ├── power-apps.md
│   └── copilot-studio.md
└── samples/
    └── requests.csv
```

## Suggested implementation sequence

1. Choose SharePoint or Dataverse based on the prototype's complexity, security needs, and licensing.
2. Create a development environment and a request table/list with the fields in the data model.
3. Build the Power Apps intake and tracking screens.
4. Implement and test the Power Automate flows with test records.
5. Add approved FAQ content to Copilot Studio and configure a safe fallback.
6. Test permissions, failure paths, duplicate submissions, approvals, and audit needs.
7. Document screenshots, actual test results, and deployment steps after implementation.

## Important implementation notes

- Use fictional or properly anonymized sample data only.
- Apply least-privilege access and environment governance.
- Do not place secrets, access tokens, or personal data in source control.
- Approval routing, retention, data residency, and AI use must follow the organization's policies.
- Connector availability, licensing, and feature behavior depend on the tenant and environment.

## Portfolio presentation

When implementation is complete, add a short demo, architecture screenshot, test evidence, and a list of what was actually built. Until then, describe this repository as a **solution design and implementation plan**, not a deployed production system.

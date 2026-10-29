# Power Platform AI Workflow Automation

A working standalone MVP for an internal service-request workflow, alongside an implementation path for Microsoft Power Platform integration.

## Run the app

**[Open the source app](index.html)** · **[View app logic](app.js)** · **[View styles](styles.css)**

- To run locally, download or clone this repository and open `index.html` in a modern browser.
- The app requires no build step or package installation.
- GitHub Pages deployment is configured in `.github/workflows/deploy-pages.yml`. If Pages is not enabled for the repository, enable it in **Settings → Pages** and select GitHub Actions. Once the workflow succeeds, the Pages URL will appear in the workflow deployment details.

## Working features in this MVP

- Dashboard with total, open, awaiting-approval, and completed counts.
- Create and edit requests with required-field validation.
- Request register with search and status/priority filters.
- Request detail view, assignment, status updates, and activity history.
- Approval/rejection decisions for requests marked as requiring approval.
- Delete demo records with confirmation.
- Export the request register to CSV.
- Built-in FAQ assistant for request process questions and a safe fallback for unknown questions.
- Responsive layout for desktop and mobile.
- Sample records on first run; updates persist in the current browser through `localStorage`.

## Important: what is and is not connected

This is a functioning **browser-based MVP**, not a deployed Microsoft Power Platform solution. Its records are saved only in the browser profile on the device where it is used. It does not yet connect to SharePoint or Dataverse, trigger real Power Automate flows, send email/Teams notifications, or call a live Copilot Studio agent. The FAQ assistant is rule-based, not a hosted AI model.

Use fictional data only. Browser-local storage is not a secure multi-user database and should not be used for real employee requests or sensitive data.

## Microsoft Power Platform production path

1. Create a development environment and select SharePoint or Dataverse as the source of truth.
2. Build the Power Apps canvas app against that data source.
3. Implement and test Power Automate acknowledgement, routing, approval, and status-notification flows.
4. Replace browser-local storage with authenticated server-side data access; enforce permissions at the data source.
5. Configure a Copilot Studio agent with approved knowledge sources, a clear fallback, and an authorized integration for any request-specific lookup.
6. Validate tenant policies, licensing, DLP, audit, retention, and security before production use.

Detailed implementation plans: [architecture](docs/solution-architecture.md), [data model](docs/data-model.md), [Power Automate flows](docs/power-automate-flows.md), [Power Apps](docs/power-apps.md), and [Copilot Studio](docs/copilot-studio.md).

## Project status

See [PROJECT-STATUS.md](PROJECT-STATUS.md) for what is implemented in this repository versus what still requires a Microsoft environment. No live tenant integration or production deployment is claimed.

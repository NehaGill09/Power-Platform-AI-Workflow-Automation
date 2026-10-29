# Power Apps Canvas App

The following is a screen plan and illustrative Power Fx. It must be adapted to the actual data source, field names, control names, and tenant configuration before use.

## Proposed screens

1. **Home** — brief instructions and a button to create a request.
2. **New request** — title, description, category, priority, and submit action.
3. **My requests** — current user's requests with status and request ID.
4. **Request details** — read-only summary, status, assignment, and safe resolution notes.
5. **Support view** (restricted) — triage and assignment controls for authorized staff.

## Example: filter requests for the current user

For a SharePoint list named `ServiceRequests` with a text column `RequesterEmail`, an illustrative gallery Items formula is:

```powerfx
Filter(
    ServiceRequests,
    RequesterEmail = User().Email
)
```

This filter improves the screen experience but is **not a security boundary**. Configure permissions at the data source so users cannot access records they are not authorized to see. If using a Person column or Dataverse identity relationship, adjust the formula accordingly.

## Example: basic submit validation

For text input controls named `txtTitle` and `txtDescription`, an illustrative validation check is:

```powerfx
If(
    IsBlank(Trim(txtTitle.Text)) ||
    IsBlank(Trim(txtDescription.Text)),
    Notify(
        "Enter a title and description before submitting.",
        NotificationType.Error
    ),
    SubmitForm(frmNewRequest)
)
```

Ensure `frmNewRequest` is connected to the chosen data source and that its OnSuccess and OnFailure properties provide appropriate feedback. Configure defaults for status and requester identity in a way that users cannot override improperly.

## UX and accessibility

- Label every input and show required-field guidance.
- Provide loading, success, and failure feedback.
- Avoid color as the only way to communicate priority or status.
- Make the form usable with keyboard navigation and screen readers.
- Test on the devices and screen sizes the team actually uses.
- Keep support-only actions out of the requester experience, while still enforcing authorization in the data layer.

## Build and test checklist

- [ ] Connect to the development data source.
- [ ] Create the intake and request-details forms.
- [ ] Validate required fields and allowed values.
- [ ] Test submit success and failure behavior.
- [ ] Confirm users can only access records permitted by the data source.
- [ ] Test empty, long, and malformed input.
- [ ] Test accessibility and responsive layout.

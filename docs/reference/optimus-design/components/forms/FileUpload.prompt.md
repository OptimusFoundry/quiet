Attach files to a brief, import CSVs, upload assets.
```jsx
<FileUpload label="Attachments" accept=".pdf,.png" maxSize={5 * 1048576} />
<FileUpload variant="button" multiple={false} accept="image/*" />
<FileUpload defaultFiles={[{ name: 'brief.pdf', size: 482000 }, { name: 'logo.png', size: 1200000, progress: 64 }]} />
```
- Dashed hairline is reserved for drop zones and placeholders.
- Invalid files stay in the list with a molten reason so the user sees what happened.

Any single-line text entry: email, search, password, names.
```jsx
<TextField label="Email" type="email" placeholder="you@studio.com" required />
<TextField label="Search" hideLabel leftIcon={<Icon name="slash" />} placeholder="Search projects" />
<TextField label="Budget" defaultValue="Under 10k" error="We start at 25k." />
<TextField label="Name" variant="filled" size="lg" />
```
- Rounded (--radius-md), 1px soft hairline → ink + soft focus ring on focus → molten on error.
- Input remains for simple label/hint/multiline cases.

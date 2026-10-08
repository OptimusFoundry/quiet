FAQs, capability lists, settings groups.
```jsx
<Accordion defaultExpanded={['ownership']} items={[
  { id: 'ownership', title: 'Who owns the code?', content: 'You do. We hand over the repo, the keys and the manual.' },
  { id: 'timeline', title: 'How long does a piece take?', description: 'Typical ranges', content: 'Six to fourteen weeks.' },
]} />
```
- First row gets an ink top rule; the rest are soft.
- Titles turn molten on hover, like links.

Switch between views of the same object.
```jsx
<Tabs tabs={['All', 'Product', 'Identity', 'Editorial']} />
<Tabs variant="pill" tabs={[{ value: 'live', label: 'Live', count: 3 }, { value: 'proto', label: 'Prototypes', count: 2 }]} />
<Tabs variant="enclosed" size="sm" tabs={['Day', 'Week', 'Month']} />
```
- Line tabs for page sections; pill for compact filters; enclosed for segmented toggles.

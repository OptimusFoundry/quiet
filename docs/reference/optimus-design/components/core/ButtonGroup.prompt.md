Row or column of related Buttons — form action rows, toolbars, segmented controls.
```jsx
<ButtonGroup><Button variant="secondary">Cancel</Button><Button>Save</Button></ButtonGroup>
<ButtonGroup attached>
  <Button variant="ghost" size="sm">Bold</Button>
  <Button variant="ghost" size="sm">Italic</Button>
</ButtonGroup>
```
- Attached horizontal groups are a pill; attached vertical groups use --radius-lg.
- Inside an attached group use ghost or secondary children; separators are 1px ink.

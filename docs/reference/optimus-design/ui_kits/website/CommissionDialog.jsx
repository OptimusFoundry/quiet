function CommissionDialog({ open, onClose, onSent }) {
  const { Dialog, Button, Input, Select, Radio } = window.DS;
  return (
    <Dialog open={open} onClose={onClose} eyebrow="05 Get in touch" title="Commission a" accent="piece"
      actions={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button arrow onClick={onSent}>Send brief</Button></>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Input label="Email" placeholder="you@studio.com" />
        <Select label="Practice" options={['Full-stack apps', 'iOS apps', 'Backends', 'Agentic workflows', 'Design systems']} />
        <Radio options={['Web', 'iOS', 'Both']} direction="row" />
        <Input label="The piece" multiline placeholder="What needs to exist, and why now?" />
      </div>
    </Dialog>
  );
}
window.CommissionDialog = CommissionDialog;

import { useState } from 'react';
import { useDocumentOperation } from 'sanity';

// A clearly visible red "Remove" button for blogs, packages, banners and the other content lists.
// It asks "Are you sure?" first, then deletes the post (draft and published copy together).
export function RemoveAction(props) {
  const { id, type, onComplete } = props;
  const { delete: del } = useDocumentOperation(id, type);
  const [open, setOpen] = useState(false);

  return {
    label: 'Remove',
    tone: 'critical',
    disabled: Boolean(del.disabled),
    title: del.disabled ? 'Nothing to remove yet: save or publish this first' : 'Remove this permanently',
    onHandle: () => setOpen(true),
    dialog: open && {
      type: 'confirm',
      tone: 'critical',
      message: 'Remove this permanently? This cannot be undone.',
      onCancel: () => { setOpen(false); onComplete(); },
      onConfirm: () => { del.execute(); setOpen(false); onComplete(); },
    },
  };
}

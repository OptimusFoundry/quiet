import { useEffect } from "react";
import { Button, Toaster, toast } from "@optimusfoundry/quiet";

// Toaster portals a fixed stack to the page; raise a few toasts on mount (duration 0 keeps them).
export const Notifications = () => {
	useEffect(() => {
		toast.dismiss();
		toast({ title: "Run 233f76c2 started.", description: "Assistant · web-message on Orca.", meta: "Just now" });
		toast({ title: "Artifact published.", status: "success", meta: "release-notes.md" });
		toast({
			title: "Webhook delivery failed.",
			description: "The endpoint returned 500.",
			status: "error",
			action: (
				<Button size="sm" variant="outline">
					Retry
				</Button>
			),
		});
		return () => toast.dismiss();
	}, []);
	return (
		<div style={{ minHeight: 480 }}>
			<Toaster position="bottom-right" duration={0} />
		</div>
	);
};

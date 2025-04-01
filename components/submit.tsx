import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "./ui/button";
import { Loader2 } from "lucide-react";

export function Submit({ children, variant, size, disabled }: ButtonProps) {
	const { pending } = useFormStatus();
	return (
		<Button
			variant={variant}
			size={size}
			disabled={pending}
			type="submit"
			className="w-full"
		>
			{pending ? <Loader2 className="size-4 animate-spin" /> : children}
		</Button>
	);
}

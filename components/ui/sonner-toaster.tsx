"use client";

import { Toaster } from "sonner";

export function SonnerToaster() {
    return (
        <Toaster
            position="top-center"
            richColors
            theme="dark"
            closeButton
            style={{ zIndex: 999999 }} // Forced High Z-Index
        />
    );
}

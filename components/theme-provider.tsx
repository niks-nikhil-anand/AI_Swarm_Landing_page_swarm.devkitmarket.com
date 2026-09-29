"use client";

import type { ComponentProps } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * The theme script only needs to run from the server HTML (before first paint). Marking it
 * text/plain on the client stops React 19 warning about a <script> rendered by a component.
 */
const scriptProps = { type: typeof window === "undefined" ? "text/javascript" : "text/plain" };

/** Same setup as DevKit Market: class-based, follows the OS until the visitor picks a theme. */
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      scriptProps={scriptProps}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

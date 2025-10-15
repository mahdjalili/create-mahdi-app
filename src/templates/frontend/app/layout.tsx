import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Create Mahdi App",
    description: "A Next.js app created with create-mahdi-app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Providers>{children}</Providers>
                </ThemeProvider>
            </body>
        </html>
    );
}

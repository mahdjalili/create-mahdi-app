import { type Metadata } from "next";
import { Inter } from "next/font/google";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { theme } from "@/theme/theme";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Create Mahdi App",
    description: "A Next.js app created with create-mahdi-app",
};

export default function RootLayout(props: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AppRouterCacheProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <Providers>{props.children}</Providers>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}

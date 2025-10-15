import ReactQueryProvider from "@/provider/ReactQueryProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return <ReactQueryProvider>{children}</ReactQueryProvider>;
}

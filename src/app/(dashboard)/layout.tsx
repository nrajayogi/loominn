import Dock from "@/components/layout/Dock";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <Dock />
            <main className="pb-32 pt-8">
                {children}
            </main>
        </div>
    );
}

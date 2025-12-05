import Dock from "@/components/layout/Dock";
import Notifications from "@/components/layout/Notifications";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <Notifications />
            <Dock />
            <main className="pb-32 pt-8">
                {children}
            </main>
        </div>
    );
}

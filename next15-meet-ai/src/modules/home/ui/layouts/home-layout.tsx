import { HomeNavbar } from "@/modules/home/ui/components/home-navbar";

interface Props {
  children: React.ReactNode;
}

export const HomeLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#0f0b1e" }}>
      <HomeNavbar />
      <main className="flex-1 pt-16">{children}</main>
      <footer
        className="py-6 border-t border-white/5"
        style={{
          background: "linear-gradient(180deg, #0f0b1e 0%, #0a0816 100%)",
        }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center text-sm text-gray-500">
          <p className="text-left">© 2026 AgentDesk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

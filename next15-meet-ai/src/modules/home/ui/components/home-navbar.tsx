"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CreditCardIcon, LogOutIcon, ArrowRightIcon } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GeneratedAvatar } from "@/components/generated-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const HomeNavbar = () => {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  const onLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  return (
    <nav className="fixed top-0 w-full h-16 bg-[#0f0b1e]/80 backdrop-blur-xl border-b border-white/5 z-50">
      <div className="flex items-center justify-between h-full max-w-screen-xl mx-auto px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/agentdesk-logo.png" alt="AgentDesk Logo" width={50} height={50} className="rounded-md" />
          <span className="text-xl font-bold tracking-tight text-white">AgentDesk</span>
        </Link>

        <div className="flex items-center gap-4">
          {isPending ? (
            <div className="h-9 w-24 bg-white/10 animate-pulse rounded-md" />
          ) : !data?.user ? (
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                  Log in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border-0 text-white shadow-lg shadow-violet-500/20">
                  Sign up <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="hidden sm:inline-flex text-gray-300 hover:text-white hover:bg-white/10">
                  Dashboard
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  {data.user.image ? (
                    <Avatar className="h-9 w-9 border border-violet-500/30">
                      <AvatarImage src={data.user.image} />
                    </Avatar>
                  ) : (
                    <GeneratedAvatar
                      seed={data.user.name}
                      variant="initials"
                      className="size-9"
                    />
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium truncate">{data.user.name}</span>
                      <span className="text-xs font-normal text-muted-foreground truncate">
                        {data.user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => authClient.customer.portal()}
                    className="cursor-pointer"
                  >
                    Billing
                    <CreditCardIcon className="ml-auto h-4 w-4" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    Log out
                    <LogOutIcon className="ml-auto h-4 w-4" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

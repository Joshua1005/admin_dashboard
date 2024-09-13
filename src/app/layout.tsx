import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import { ReactQueryProvider } from "@/context/react-query-provider";
import { Button } from "@/components/ui/button";
import db from "@/lib/db";
import { createRandomProduct } from "../../faker";

interface RootLayoutProps {
  children: React.ReactNode;
}

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <form
          action={async () => {
            "use server";
            await db.product.create({ data: { ...createRandomProduct() } });
          }}
        >
          <Button>Click</Button>
        </form>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;

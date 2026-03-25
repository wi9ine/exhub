import type { Metadata } from "next";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import type { ReactNode } from "react";
import "./global.css";

export const metadata: Metadata = {
  title: {
    default: "ExHub",
    template: "%s - ExHub",
  },
  description: "가상자산 거래소 통합 SDK & MCP 서버",
};

const navbar = (
  <Navbar logo={<strong>ExHub</strong>} projectLink="https://github.com/wi9ine/exhub" />
);

const footer = <Footer>MIT {new Date().getFullYear()} © ExHub</Footer>;

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          docsRepositoryBase="https://github.com/wi9ine/exhub/tree/main/apps/docs"
          pageMap={await getPageMap()}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}

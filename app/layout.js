import "./globals.css";
import { Mukta, Tiro_Devanagari_Hindi } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";

const body = Mukta({ subsets: ["devanagari", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-body" });
const head = Tiro_Devanagari_Hindi({ subsets: ["devanagari", "latin"], weight: "400", variable: "--font-head" });

export const metadata = {
  title: "सर्व समाज कल्याण समिति",
  description: "सेवा से समाज का निर्माण – विश्वास, पारदर्शिता और आसान सहयोग",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <body className={`${body.variable} ${head.variable}`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <MobileBar />
      </body>
    </html>
  );
}

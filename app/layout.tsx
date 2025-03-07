import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./_components/ClientLayout";
import Cart from "./_components/_website/Cart";
import ContactButton from "./_components/Whatsappbtn";
import Navbar from "./_components/_website/Navbar";
import Footer from "./_components/_website/Footer";

export const metadata: Metadata = {
  title: "شركة آرام الخليج المحدودة",
  description:
    "شركة آرام الخليج المحدودة توفر منصة شاملة لعمليات التجميل وتقديم البطاقات الطبية لاستخدامها في المراكز الصحية والتجميلية المرتبطة بالمنصة. نوفر حلولاً مبتكرة وخدمات متكاملة لتلبية احتياجاتك الجمالية والصحية.",
  keywords: [
    "عمليات التجميل",
    "بطاقات طبية",
    "مراكز تجميل",
    "منصة طبية",
    "آرام الخليج المحدودة",
    "جراحة تجميل",
    "خدمات صحية",
    "خدمات تجميل",
  ],

  twitter: {
    card: "summary_large_image",
    site: "@AramGulf", // ضع معرف تويتر الخاص بالشركة إذا كان متوفرًا
    title: "شركة آرام الخليج المحدودة - عمليات التجميل والبطاقات الطبية",
    description:
      "منصة متكاملة لعمليات التجميل وتوفير البطاقات الطبية للمراكز المرتبطة.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`tajawal-regular`}>
        <ClientLayout>
          <Navbar />
          <div className="pt-6 w-full h-full">{children}</div>
          <Footer />
          <Cart />
        </ClientLayout>
        <ContactButton />
      </body>
    </html>
  );
}

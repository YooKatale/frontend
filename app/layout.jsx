import Header from "@components/Header";
import Footer from "@components/Footer";
import { Providers } from "./providers";
import "./globals.css";
import CookiePolicy from "@components/CookiePolicy";
import ScriptTag from "@components/ScriptTag";
import { Work_Sans } from "next/font/google";
import ServiceWorker from "@components/ServiceWorker";

const WorkSans = Work_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "yookatale",
  description:
    "YooKatale Uganda | Online Food shopping, Organic and Fresh Foods Mobile Market, Affordable, Reliable & Convenient",
};

const RootLayout = ({ children }) => {

  return (
    <html lang="en">
      <body className={WorkSans.className}>
        <main>
          {/* <ServiceWorker /> */}
          <Providers>
            <Header />
            {children}
            <Footer />
            <CookiePolicy />
          </Providers>
          <ScriptTag />
        </main>
      </body>
    </html>
  );
};

export default RootLayout;

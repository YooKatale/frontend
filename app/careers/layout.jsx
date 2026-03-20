export const metadata = {
  title: "Careers | YooKatale",
  description:
    "YooKatale, a mobile food market for selling, buying and advertising food products and services in Uganda. View open positions and apply today.",
  openGraph: {
    title: "We Are Hiring | YooKatale",
    description:
      "YooKatale invites qualified applicants to fill vacant posts. View open positions and apply at www.yookatale.app.",
    url: "https://www.yookatale.app/careers",
    siteName: "YooKatale",
    images: [
      {
        url: "https://www.yookatale.app/assets/images/careers-banner.jpeg",
        width: 780,
        height: 780,
        alt: "YooKatale — We Are Hiring",
      },
    ],
    locale: "en_UG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "We Are Hiring | YooKatale",
    description:
      "YooKatale invites qualified applicants to fill vacant posts. View open positions and apply at www.yookatale.app.",
    images: ["https://www.yookatale.app/assets/images/careers-banner.jpeg"],
  },
};

export default function CareersLayout({ children }) {
  return children;
}

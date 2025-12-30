import "./globals.css";
import { SettingsProvider } from "../components/settings/SettingsContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}


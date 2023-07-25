import "@styles/globals.css";

import Navbar from "@components/Navbar";

export const metadata = {
  title: "NYCDOT Automation App",
  description: "Transfer pin on google map to corrdinates coloum in excel",
};

const RootLayout = ({ children }) => (
  <html lang='en'>
    <body>
        <Navbar />
        <main>
          {children}
        </main>
    </body>
  </html>
);

export default RootLayout;
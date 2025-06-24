import Header from "../components/Header";
import Footer from "../components/Footer.tsx";

import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

function DefaultLayout({ children }: Props) {
  // const {} = props;

  return (
    <main>
      <Header />
        <div>{children}</div>
        <Footer/>
    </main>
  );
}

export default DefaultLayout;

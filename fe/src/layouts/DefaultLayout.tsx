import Header from "../components/Header";
import Footer from "../components/Footer.tsx";

interface Props {}

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

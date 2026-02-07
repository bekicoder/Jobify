import Hero from "./_components/Hero"
import Stats from "./_components/stats";
import About from "./_components/about";
import Community from "./_components/community";
import Footer from './_components/footer';

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pt-16">
      <Hero/>
      <Stats/>
      <About/>
      <Community/>
      <Footer />
    </div>
  );
}

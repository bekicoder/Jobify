"use client"
import Hero from "./_components/Hero";
import Stats from "./_components/stats";
import About from "./_components/about";
import Community from "./_components/stafs";
import Footer from "./_components/footer";
import { useSharedState } from "./SharedStateContext";
export default function Home() {
 const {bgColor,textColor} = useSharedState()
  return (
    <div className={`flex flex-col gap-12 pt-12 overflow-x-hidden bg-${bgColor}`}>
      <Hero />
      <Stats />
      <Community />
      <Footer />
    </div>
  );
}

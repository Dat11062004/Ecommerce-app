import React from "react";
import { Hero } from "../components/Hero";
import { LatestCollection } from "../components/LatestCollection";
import { BestSeller } from "../components/BestSeller";
import { OutPolicy } from "../components/OutPolicy";
import { NewslettersBox } from "../components/NewslettersBox";
const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <OutPolicy />
      <NewslettersBox />
    </div>
  );
};

export default Home;

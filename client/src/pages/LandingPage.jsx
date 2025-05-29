import '../App.css';
import Video from '../components/Video';
import LandAbout from '../components/LandAbout'
import Products from '../components/Products'
import Analytics from '../components/Analytics'
import Black from '../components/Black';
import Approach from '../components/Approach';
import OurValues from '../components/OurValues';
import Leadership from '../components/Leadership'

function LandingPage() {

  return (
    <div className="App">
      <section id="home"><Video /></section>
      <section id="about"><LandAbout /></section>
      <section id="about"><Products /></section>
      <section id="approach"><Approach /></section>
      <section id="why"><Black /></section>
      <section id="impact"><Analytics /></section>
      <section id="values"><OurValues /></section>
      <section id="team"><Leadership /></section>
    </div>
  );
}

export default LandingPage;

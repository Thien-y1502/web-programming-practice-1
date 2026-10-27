import { NavLink, Route, Routes } from 'react-router-dom'

const sessions = [
  { time: '08:30', type: 'Opening', title: 'Welcome and event introduction', room: 'Main hall' },
  { time: '09:15', type: 'Keynote', title: 'Designing useful digital experiences', room: 'Main hall' },
  { time: '10:30', type: 'Workshop', title: 'Modern React component patterns', room: 'Studio A' },
  { time: '13:30', type: 'Workshop', title: 'Accessible interfaces for everyone', room: 'Studio B' },
]

function Arrow() {
  return <span aria-hidden="true">→</span>
}

function Layout({ children }) {
  return <>
    <header className="site-header">
      <NavLink className="brand" to="/"><span>WT</span><strong>WebTech<br />Summit 2027</strong></NavLink>
      <nav aria-label="Main navigation">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about-us">About</NavLink>
        <NavLink to="/program">Program</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>
      <NavLink className="button small" to="/program">View program</NavLink>
    </header>
    {children}
    <footer><div><strong>WebTech Summit 2027</strong><p>A fictional interface created for Web Programming Practice 1.</p></div><div><span>React</span><span>Vite</span><span>React Router</span></div></footer>
  </>
}

function Home() {
  return <main>
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">12 September 2027 · Hybrid event</span>
        <h1>Build interfaces that people enjoy using.</h1>
        <p>A one-day technology event for students and early-career developers exploring modern web design, React and accessible user experiences.</p>
        <div className="actions"><NavLink className="button primary" to="/program">Explore the program <Arrow /></NavLink><NavLink className="text-link" to="/about-us">About the event <Arrow /></NavLink></div>
      </div>
      <div className="hero-art" aria-label="Abstract web technology illustration"><div className="orb one" /><div className="orb two" /><div className="grid" /><span>01 / 04</span></div>
    </section>
    <section className="stats"><article><span>01</span><strong>Day</strong><p>Focused learning and networking.</p></article><article><span>04</span><strong>Sessions</strong><p>Talks and practical workshops.</p></article><article><span>02</span><strong>Formats</strong><p>Join online or attend onsite.</p></article></section>
    <section className="section split"><div><span className="eyebrow">Why attend</span><h2>Ideas you can apply to your next project.</h2></div><div><p>Learn how good structure, typography, interaction and accessibility work together. Every session is designed around concrete examples rather than abstract theory.</p><NavLink className="text-link" to="/program">See all sessions <Arrow /></NavLink></div></section>
  </main>
}

function About() {
  return <main><section className="page-intro"><span className="eyebrow">About us</span><h1>A small event with a practical purpose.</h1><p>WebTech Summit is a fictional student project demonstrating a reusable React interface and route-based navigation.</p></section><section className="section cards"><article><b>01</b><h2>Learn</h2><p>Short sessions explain current frontend practices in a clear and approachable way.</p></article><article><b>02</b><h2>Practice</h2><p>Workshops turn concepts into components, pages and responsive layouts.</p></article><article><b>03</b><h2>Connect</h2><p>The program leaves room for peer discussion and collaborative problem solving.</p></article></section></main>
}

function Program() {
  return <main><section className="page-intro"><span className="eyebrow">Event program</span><h1>One day of focused web development.</h1><p>The schedule is sample content used to demonstrate reusable cards and routed pages.</p></section><section className="section schedule">{sessions.map((session, index) => <article key={session.time}><span>{String(index + 1).padStart(2, '0')}</span><time>{session.time}</time><div><small>{session.type}</small><h2>{session.title}</h2><p>{session.room}</p></div></article>)}</section></main>
}

function Contact() {
  return <main><section className="page-intro"><span className="eyebrow">Contact</span><h1>Send a message to the demo team.</h1><p>This form is visual-only for the frontend practice project and does not transmit personal information.</p></section><section className="section contact-grid"><div><h2>Project information</h2><p>This public repository contains only fictional sample content. No production backend or private account is connected.</p><dl><div><dt>Course</dt><dd>Web Programming</dd></div><div><dt>Stack</dt><dd>React, Vite, CSS</dd></div></dl></div><form onSubmit={(event) => event.preventDefault()}><label>Name<input placeholder="Your name" /></label><label>Email<input type="email" placeholder="name@example.com" /></label><label>Message<textarea rows="5" placeholder="Write a short message" /></label><button className="button primary" type="submit">Preview submission</button></form></section></main>
}

function NotFound() {
  return <main><section className="page-intro"><span className="eyebrow">404</span><h1>Page not found.</h1><NavLink className="button primary" to="/">Return home</NavLink></section></main>
}

export default function App() {
  return <Layout><Routes><Route path="/" element={<Home />} /><Route path="/about-us" element={<About />} /><Route path="/program" element={<Program />} /><Route path="/contact" element={<Contact />} /><Route path="*" element={<NotFound />} /></Routes></Layout>
}

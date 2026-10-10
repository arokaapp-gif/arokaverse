import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Mic,
  Compass,
  Users,
  Sparkles,
  Volume2,
  Settings,
  Send,
  Globe,
  UserRound,
  Coffee,
  MapPin
} from "lucide-react";

const people = [
  { name: "Mira", age: 24, vibe: "Music & sunsets", color: "#ed9bc8", emoji: "🌸" },
  { name: "Aarav", age: 26, vibe: "Travel & gaming", color: "#81c9df", emoji: "🌊" },
  { name: "Anaya", age: 23, vibe: "Art & coffee", color: "#f4c17a", emoji: "🌻" }
];

export default function App() {
  const [active, setActive] = useState("World");
  const [selected, setSelected] = useState(people[0]);
  const [liked, setLiked] = useState([]);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");

  function notify(text) {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 2500);
  }

  function sendMessage(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages([...messages, { text: draft.trim() }]);
    setDraft("");
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">
          <Sparkles size={22} />
          <span>aroka<span className="brand-light">verse</span></span>
        </div>
        <div className="side-caption">YOUR UNIVERSE</div>

        {[
          { label: "World", icon: Globe },
          { label: "Discover", icon: Compass },
          { label: "Matches", icon: Heart },
          { label: "Messages", icon: MessageCircle },
          { label: "My Avatar", icon: UserRound }
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`nav-item ${active === item.label ? "active" : ""}`}
              onClick={() => {
                setActive(item.label);
                if (item.label !== "World") notify(`${item.label} coming soon`);
              }}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="sidebar-bottom">
          <div className="online-status">
            <span className="green-dot" /> World is peaceful
          </div>
          <button className="nav-item" onClick={() => notify("Settings coming soon")}>
            <Settings size={19} /> Settings
          </button>
          <div className="mini-profile">
            <div className="mini-avatar">✨</div>
            <div><strong>Your avatar</strong><small>New explorer</small></div>
          </div>
        </div>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Explore <span>/</span> <strong>{active}</strong></div>
          <div className="top-actions">
            <span className="beta-tag">EARLY ACCESS</span>
            <button className="icon-button" onClick={() => notify("You're all caught up")}>
              <Sparkles size={19} />
            </button>
          </div>
        </header>

        <div className="welcome-row">
          <div>
            <div className="eyebrow"><Sparkles size={14} /> A WORLD BEYOND THE ORDINARY</div>
            <h1>Find your <span>kind of magic.</span></h1>
            <p>Meet people, make memories, and find your connection.</p>
          </div>
          <div className="location-pill"><MapPin size={15} /> The Moonlit Garden</div>
        </div>

        <section className="world-scene">
          <div className="scene-stars"><i>✦</i><i>·</i><i>✧</i><i>·</i><i>✦</i></div>
          <div className="moon" />
          <div className="scene-hill hill-back" />
          <div className="scene-hill hill-front" />
          <div className="scene-tree tree-left"><div className="tree-top" /><div className="tree-trunk" /></div>
          <div className="scene-tree tree-right"><div className="tree-top" /><div className="tree-trunk" /></div>
          <div className="scene-title">
            <span className="scene-kicker"><span className="green-dot" /> YOUR WORLD IS WAITING</span>
            <h2>A little closer<br />to something real.</h2>
            <p>A peaceful place to meet someone new.</p>
            <button className="primary-button" onClick={() => notify("3D exploration is coming soon")}>
              <Compass size={17} /> Explore the world ↗
            </button>
          </div>
          <div className="avatar-stage">
            <div className="avatar-glow" />
            <div className="avatar-figure avatar-one">
              <div className="avatar-hair hair-one" />
              <div className="avatar-head"><div className="avatar-face"><i /><i /><b /></div></div>
              <div className="avatar-neck" /><div className="avatar-body body-one" />
              <div className="avatar-arm arm-one" /><div className="avatar-arm arm-two" />
              <div className="avatar-legs" />
            </div>
            <div className="avatar-figure avatar-two">
              <div className="avatar-hair hair-two" />
              <div className="avatar-head"><div className="avatar-face"><i /><i /><b /></div></div>
              <div className="avatar-neck" /><div className="avatar-body body-two" />
              <div className="avatar-arm arm-one" /><div className="avatar-arm arm-two" />
              <div className="avatar-legs" />
            </div>
            <div className="avatar-name name-one">You</div>
            <div className="avatar-name name-two">Mira</div>
          </div>
          <div className="scene-chip chip-top"><Coffee size={15} /> Moonlight Café</div>
          <div className="scene-chip chip-bottom"><Users size={15} /> A world to share</div>
        </section>

        <section className="section-heading">
          <div>
            <h2>People you might <span>vibe with</span></h2>
            <p>Every great connection starts somewhere.</p>
          </div>
          <button className="text-button" onClick={() => notify("More people coming soon")}>See all →</button>
        </section>

        <section className="people-grid">
          {people.map((person, i) => (
            <article className="person-card" key={person.name}>
              <div className="person-art" style={{ "--person-color": person.color }}>
                <span className="person-sparkle">✦</span>
                <div className={`portrait portrait-${i}`}>
                  <div className="portrait-hair" />
                  <div className="portrait-face">
                    <div className="portrait-eyes"><i /><i /></div>
                    <div className="portrait-smile" />
                  </div>
                  <div className="portrait-neck" /><div className="portrait-body" />
                </div>
                <span className="distance-tag">● In the universe</span>
              </div>
              <div className="person-info">
                <div className="person-title">
                  <h3>{person.name}, {person.age}</h3><span className="verified">✦</span>
                </div>
                <p>{person.vibe}</p>
                <div className="person-actions">
                  <button className="message-button" onClick={() => { setSelected(person); notify(`Selected ${person.name}`); }}>
                    <MessageCircle size={15} /> Say hello
                  </button>
                  <button
                    className={`heart-button ${liked.includes(person.name) ? "liked" : ""}`}
                    onClick={() => setLiked(old => old.includes(person.name) ? old.filter(n => n !== person.name) : [...old, person.name])}
                    aria-label={`Like ${person.name}`}
                  >
                    <Heart size={17} fill={liked.includes(person.name) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
        <footer className="footer-note"><Sparkles size={14} /> A universe for meaningful connections. <span>Be kind. Be you.</span></footer>
      </section>

      <aside className="chat-sidebar">
        <div className="chat-head">
          <div><span className="eyebrow">YOUR CONNECTIONS</span><h2>A little hello</h2></div>
          <button className="icon-button" onClick={() => notify("Your connections are private")}>•••</button>
        </div>
        <div className="chat-person">
          <div className="chat-person-avatar" style={{ background: selected.color }}>{selected.emoji}</div>
          <div><strong>{selected.name}</strong><span>Preview profile</span></div>
          <button className="heart-button" onClick={() => notify("Voice calling will be added later")} aria-label="Voice call"><Mic size={18} /></button>
        </div>
        <div className="chat-preview-label">A CONVERSATION STARTS HERE</div>
        <div className="chat-messages">
          <div className="date-divider"><span>YOUR FIRST HELLO</span></div>
          <div className="message received">Hey there! 👋<br />Welcome to our little universe.</div>
          <div className="message received">What brings you to ArokaVerse?</div>
          {messages.map((message, i) => <div className="message sent" key={i}>{message.text}</div>)}
        </div>
        <form className="chat-compose" onSubmit={sendMessage}>
          <input aria-label="Message" placeholder={`Message ${selected.name}...`} value={draft} onChange={e => setDraft(e.target.value)} />
          <button type="submit" aria-label="Send message"><Send size={17} /></button>
        </form>
        <div className="chat-foot"><Volume2 size={14} /> Voice experiences coming soon</div>
        <div className="connection-card">
          <div className="connection-icon"><Heart size={18} /></div>
          <div><strong>Good things take a vibe.</strong><p>Be curious. Be kind. See where it goes.</p></div>
        </div>
      </aside>
      {notice && <div className="toast"><Sparkles size={16} /> {notice}</div>}
    </main>
  );
}
`)} variant="outline"><icon name="copy" size="sm" /> Copy code</button>
  </row>
 
.

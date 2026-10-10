
import { useState, useEffect } from "react";
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
import { supabase } from "./lib/supabase.js";

const people = [
  { name: "Mira", age: 24, vibe: "Music & sunsets", color: "#ed9bc8", emoji: "🌸" },
  { name: "Aarav", age: 26, vibe: "Travel & gaming", color: "#81c9df", emoji: "🌊" },
  { name: "Anaya", age: 23, vibe: "Art & coffee", color: "#f4c17a", emoji: "🌻" }
];

const authInputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 14px",
  margin: "8px 0 18px",
  borderRadius: "10px",
  border: "1px solid #655675",
  background: "#191629",
  color: "#ffffff",
  fontSize: "15px"
};

const authButtonStyle = {
  width: "100%",
  padding: "14px",
  border: 0,
  borderRadius: "10px",
  background: "#d7a7ff",
  color: "#21142f",
  fontWeight: 700,
  fontSize: "15px",
  cursor: "pointer"
};

export default function App() {
  const [active, setActive] = useState("World");
  const [selected, setSelected] = useState(people[0]);
  const [liked, setLiked] = useState([]);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      setAuthMessage("Supabase configuration is missing. Check Railway variables.");
      return;
    }

    let mounted = true;

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) setAuthMessage(error.message);
      setUser(data?.session?.user ?? null);
      setAuthLoading(false);
    }

    loadSession();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user || !supabase) {
      setProfile(null);
      return;
    }

    let cancelled = false;

    async function loadOrCreateProfile() {
      setProfileLoading(true);
      setAuthMessage("");

      try {
        const { data: existing, error: fetchError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (existing) {
          if (!cancelled) {
            setProfile(existing);
            setDisplayName(existing.display_name || "");
          }
          return;
        }

        const metadataName =
          user.user_metadata?.display_name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "New Explorer";

        const proposedName = metadataName.trim().slice(0, 40) || "New Explorer";

        const { data: created, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            display_name: proposedName
          })
          .select()
          .single();

        if (insertError) throw insertError;

        if (!cancelled) {
          setProfile(created);
          setDisplayName(created.display_name);
          setNotice("Your profile has been created!");
        }
      } catch (error) {
        if (!cancelled) {
          setAuthMessage(
            `Profile could not be saved: ${error.message}. Please refresh and try again.`
          );
        }
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    }

    loadOrCreateProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  function notify(text) {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 2500);
  }

  async function handleAuth(e) {
    e.preventDefault();
    setAuthMessage("");

    if (!supabase) {
      setAuthMessage("Supabase is not configured. Check Railway variables.");
      return;
    }

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setAuthMessage("Please enter your email address.");
      return;
    }

    if (password.length < 6) {
      setAuthMessage("Password must be at least 6 characters long.");
      return;
    }

    setAuthBusy(true);

    try {
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              display_name: displayName.trim() || cleanEmail.split("@")[0]
            }
          }
        });

        if (error) throw error;

        if (data.session) {
          setAuthMessage("Account created. Setting up your profile...");
        } else {
          setAuthMessage(
            "Signup submitted. Check your email and click the verification link, then log in."
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (error) throw error;
      }
    } catch (error) {
      setAuthMessage(error.message || "Authentication failed. Please try again.");
    } finally {
      setAuthBusy(false);
    }
  }

  async function saveProfile(e) {
    e.preventDefault();

    if (!supabase || !user) return;

    const cleanName = displayName.trim();

    if (!cleanName) {
      setAuthMessage("Please enter your display name.");
      return;
    }

    setProfileLoading(true);
    setAuthMessage("");

    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          display_name: cleanName.slice(0, 40),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      notify("Profile saved successfully!");
    } catch (error) {
      setAuthMessage(`Could not save profile: ${error.message}`);
    } finally {
      setProfileLoading(false);
    }
  }

  async function handleLogout() {
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();

    if (error) {
      notify(error.message || "Could not log out.");
      return;
    }

    setMessages([]);
    setDraft("");
    setAuthMessage("");
    setPassword("");
    setAuthMode("login");
    notify("You have logged out.");
  }

  function sendMessage(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages((old) => [...old, { text: draft.trim() }]);
    setDraft("");
  }

  if (authLoading) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#101020", color: "white", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>✨</div>
          <p>Entering your universe...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main style={{ minHeight: "100vh", boxSizing: "border-box", display: "grid", placeItems: "center", padding: "24px", background: "radial-gradient(circle at top, #41305c 0%, #19162e 45%, #101020 100%)", color: "white", fontFamily: "sans-serif" }}>
        <form onSubmit={handleAuth} style={{ width: "100%", maxWidth: "410px", boxSizing: "border-box", padding: "clamp(22px, 5vw, 34px)", borderRadius: "22px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 24px 80px rgba(0,0,0,0.28)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", letterSpacing: "2px", fontSize: "14px", fontWeight: 700 }}>
            <Sparkles size={22} color="#d7a7ff" /> AROKAVERSE
          </div>

          <h1 style={{ fontSize: "clamp(27px, 6vw, 35px)", lineHeight: 1.2, margin: "28px 0 10px" }}>
            {authMode === "signup" ? "Join your universe." : "Welcome back."}
          </h1>

          <p style={{ color: "#d0c7e4", lineHeight: 1.6, marginBottom: "26px" }}>
            {authMode === "signup" ? "Create your account and start making meaningful connections." : "Sign in to return to your world and discover new connections."}
          </p>

          {authMode === "signup" && (
            <>
              <label htmlFor="aroka-name">Display name</label>
              <input id="aroka-name" type="text" maxLength={40} value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="What should people call you?" style={authInputStyle} />
            </>
          )}

          <label htmlFor="aroka-email">Email address</label>
          <input id="aroka-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={authInputStyle} />

          <label htmlFor="aroka-password">Password</label>
          <input id="aroka-password" type="password" autoComplete={authMode === "signup" ? "new-password" : "current-password"} minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" style={authInputStyle} />

          <button type="submit" disabled={authBusy} style={{ ...authButtonStyle, opacity: authBusy ? 0.7 : 1, cursor: authBusy ? "wait" : "pointer" }}>
            {authBusy ? "Please wait..." : authMode === "signup" ? "Create account" : "Login"}
          </button>

          {authMessage && (
            <div role="status" style={{ marginTop: "18px", padding: "12px", borderRadius: "10px", background: "rgba(215,167,255,0.1)", border: "1px solid rgba(215,167,255,0.22)", color: "#f0e4ff", fontSize: "14px", lineHeight: 1.6, overflowWrap: "anywhere" }}>
              {authMessage}
            </div>
          )}

          <p style={{ marginTop: "24px", textAlign: "center", color: "#d0c7e4", fontSize: "14px", lineHeight: 1.8 }}>
            {authMode === "signup" ? "Already have an account?" : "New to ArokaVerse?"}{" "}
            <button type="button" onClick={() => { setAuthMode(authMode === "signup" ? "login" : "signup"); setAuthMessage(""); }} style={{ border: 0, padding: 0, background: "transparent", color: "#e0baff", cursor: "pointer", fontWeight: 700, fontSize: "14px" }}>
              {authMode === "signup" ? "Login" : "Sign up"}
            </button>
          </p>
          <p style={{ textAlign: "center", color: "#a9a0bd", fontSize: "12px", lineHeight: 1.6, marginBottom: 0 }}>
            Use an email address you can access. Never share your password with anyone.
          </p>
        </form>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark"><Sparkles size={22} /><span>aroka<span className="brand-light">verse</span></span></div>
        <div className="side-caption">YOUR UNIVERSE</div>

        {[
          { label: "World", icon: Globe },
          { label: "Discover", icon: Compass },
          { label: "Matches", icon: Heart },
          { label: "Messages", icon: MessageCircle },
          { label: "My Avatar", icon: UserRound }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.label} className={`nav-item ${active === item.label ? "active" : ""}`} onClick={() => { setActive(item.label); if (item.label !== "World") notify(`${item.label} coming soon`); }}>
              <Icon size={19} /><span>{item.label}</span>
            </button>
          );
        })}

        <div className="sidebar-bottom">
          <div className="online-status"><span className="green-dot" /> World is peaceful</div>
          <button className="nav-item" onClick={() => notify("Settings coming soon")}><Settings size={19} /> Settings</button>
          <div className="mini-profile">
            <div className="mini-avatar">✨</div>
            <div><strong>{profile?.display_name || "Your avatar"}</strong><small>{profileLoading ? "Saving profile..." : "New explorer"}</small></div>
          </div>
        </div>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Explore <span>/</span> <strong>{active}</strong></div>
          <div className="top-actions">
            <span className="beta-tag">EARLY ACCESS</span>
            <button className="icon-button" onClick={() => notify("You're all caught up")} aria-label="Notifications"><Sparkles size={19} /></button>
            <button className="icon-button" onClick={handleLogout} aria-label="Log out" title="Log out">Log out</button>
          </div>
        </header>

        <div style={{ padding: "8px 20px", fontSize: "12px", opacity: 0.8, overflowWrap: "anywhere" }}>Signed in as {user.email}</div>

        <div className="welcome-row">
          <div>
            <div className="eyebrow"><Sparkles size={14} /> A WORLD BEYOND THE ORDINARY</div>
            <h1>Find your <span>kind of magic.</span></h1>
            <p>Meet people, make memories, and find your connection.</p>
          </div>
          <div className="location-pill"><MapPin size={15} /> The Moonlit Garden</div>
        </div>

        {authMessage && (
          <div style={{ margin: "10px 20px", padding: "12px", borderRadius: "10px", background: "rgba(215,167,255,0.1)", color: "#f0e4ff", fontSize: "14px", lineHeight: 1.6, overflowWrap: "anywhere" }} role="status">
            {authMessage}
          </div>
        )}

        <section style={{ margin: "0 20px 20px", padding: "18px", border: "1px solid rgba(215,167,255,0.25)", borderRadius: "16px", background: "rgba(255,255,255,0.04)" }}>
          <h2 style={{ marginTop: 0 }}>Your profile</h2>
          <p style={{ color: "#cfc3e6" }}>This name is visible on your ArokaVerse profile.</p>
          <form onSubmit={saveProfile}>
            <label htmlFor="profile-display-name">Display name</label>
            <input id="profile-display-name" value={displayName} maxLength={40} onChange={(e) => setDisplayName(e.target.value)} placeholder="Enter your display name" style={authInputStyle} />
            <button type="submit" disabled={profileLoading} style={{ ...authButtonStyle, maxWidth: "240px", opacity: profileLoading ? 0.7 : 1 }}>
              {profileLoading ? "Saving..." : "Save profile"}
            </button>
          </form>
        </section>

        <section className="world-scene">
          <div className="scene-stars"><i>✦</i><i>·</i><i>✧</i><i>·</i><i>✦</i></div>
          <div className="moon" /><div className="scene-hill hill-back" /><div className="scene-hill hill-front" />
          <div className="scene-tree tree-left"><div className="tree-top" /><div className="tree-trunk" /></div>
          <div className="scene-tree tree-right"><div className="tree-top" /><div className="tree-trunk" /></div>

          <div className="scene-title">
            <span className="scene-kicker"><span className="green-dot" /> YOUR WORLD IS WAITING</span>
            <h2>A little closer<br />to something real.</h2>
            <p>A peaceful place to meet someone new.</p>
            <button className="primary-button" onClick={() => notify("3D exploration is coming soon")}><Compass size={17} /> Explore the world ↗</button>
          </div>

          <div className="avatar-stage">
            <div className="avatar-glow" />
            <div className="avatar-figure avatar-one"><div className="avatar-hair hair-one" /><div className="avatar-head"><div className="avatar-face"><i /><i /><b /></div></div><div className="avatar-neck" /><div className="avatar-body body-one" /><div className="avatar-arm arm-one" /><div className="avatar-arm arm-two" /><div className="avatar-legs" /></div>
            <div className="avatar-figure avatar-two"><div className="avatar-hair hair-two" /><div className="avatar-head"><div className="avatar-face"><i /><i /><b /></div></div><div className="avatar-neck" /><div className="avatar-body body-two" /><div className="avatar-arm arm-one" /><div className="avatar-arm arm-two" /><div className="avatar-legs" /></div>
            <div className="avatar-name name-one">{profile?.display_name || "You"}</div><div className="avatar-name name-two">Mira</div>
          </div>

          <div className="scene-chip chip-top"><Coffee size={15} /> Moonlight Café</div>
          <div className="scene-chip chip-bottom"><Users size={15} /> A world to share</div>
        </section>

        <section className="section-heading">
          <div><h2>People you might <span>vibe with</span></h2><p>Every great connection starts somewhere.</p></div>
          <button className="text-button" onClick={() => notify("More people coming soon")}>See all →</button>
        </section>

        <section className="people-grid">
          {people.map((person, i) => (
            <article className="person-card" key={person.name}>
              <div className="person-art" style={{ "--person-color": person.color }}>
                <span className="person-sparkle">✦</span>
                <div className={`portrait portrait-${i}`}><div className="portrait-hair" /><div className="portrait-face"><div className="portrait-eyes"><i /><i /></div><div className="portrait-smile" /></div><div className="portrait-neck" /><div className="portrait-body" /></div>
                <span className="distance-tag">● In the universe</span>
              </div>
              <div className="person-info">
                <div className="person-title"><h3>{person.name}, {person.age}</h3><span className="verified">✦</span></div>
                <p>{person.vibe}</p>
                <div className="person-actions">
                  <button className="message-button" onClick={() => { setSelected(person); notify(`Selected ${person.name}`); }}><MessageCircle size={15} /> Say hello</button>
                  <button className={`heart-button ${liked.includes(person.name) ? "liked" : ""}`} onClick={() => setLiked((old) => old.includes(person.name) ? old.filter((name) => name !== person.name) : [...old, person.name])} aria-label={`Like ${person.name}`}>
                    <Heart size={17} fill={liked.includes(person.name) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <footer className="footer-note"><Sparkles size={14} /> A universe for meaningful connections.<span>Be kind. Be you.</span></footer>
      </section>

      <aside className="chat-sidebar">
        <div className="chat-head"><div><span className="eyebrow">YOUR CONNECTIONS</span><h2>A little hello</h2></div><button className="icon-button" onClick={() => notify("Your connections are private")} aria-label="More options">•••</button></div>

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
          <input aria-label="Message" placeholder={`Message ${selected.name}...`} value={draft} onChange={(e) => setDraft(e.target.value)} />
          <button type="submit" aria-label="Send message"><Send size={17} /></button>
        </form>

        <div className="chat-foot"><Volume2 size={14} /> Voice experiences coming soon</div>
        <div className="connection-card"><div className="connection-icon"><Heart size={18} /></div><div><strong>Good things take a vibe.</strong><p>Be curious. Be kind. See where it goes.</p></div></div>
      </aside>

      {notice && <div className="toast"><Sparkles size={16} /> {notice}</div>}
    </main>
  );
}

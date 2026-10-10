```jsx
import { useState, useEffect, useRef } from "react";
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
  MapPin,
  Save,
  ArrowLeft,
  CheckCircle2,
  LogOut,
  Camera
} from "lucide-react";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows
} from "@react-three/drei";

import { supabase } from "./lib/supabase.js";

/* -------------------------------------------------------
   DEMO PEOPLE
------------------------------------------------------- */

const people = [
  {
    id: 1,
    name: "Mira",
    age: 24,
    city: "Bhubaneswar",
    bio: "Love music, travel and late-night conversations.",
    interests: ["Music", "Travel", "Coffee"]
  },
  {
    id: 2,
    name: "Aarav",
    age: 26,
    city: "Berhampur",
    bio: "Gaming, technology and exploring new places.",
    interests: ["Gaming", "Technology", "Travel"]
  },
  {
    id: 3,
    name: "Anaya",
    age: 23,
    city: "Puri",
    bio: "Art, photography and peaceful beach walks.",
    interests: ["Art", "Photography", "Nature"]
  }
];

const interestOptions = [
  "Music",
  "Travel",
  "Gaming",
  "Art",
  "Coffee",
  "Movies",
  "Fitness",
  "Nature",
  "Reading",
  "Technology",
  "Food",
  "Photography"
];

/* -------------------------------------------------------
   3D AVATAR
------------------------------------------------------- */

function AvatarModel({ avatarName = "Explorer" }) {
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;

    group.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.45) * 0.12;

    group.current.position.y =
      Math.sin(state.clock.elapsedTime * 1.4) * 0.035;
  });

  return (
    <group ref={group} position={[0, -1.25, 0]}>
      {/* BODY */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <capsuleGeometry args={[0.48, 0.9, 8, 20]} />
        <meshStandardMaterial color="#6366f1" roughness={0.65} />
      </mesh>

      {/* NECK */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.18, 0.28, 24]} />
        <meshStandardMaterial color="#f1b08a" />
      </mesh>

      {/* HEAD */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <sphereGeometry args={[0.48, 32, 32]} />
        <meshStandardMaterial
          color="#f1b08a"
          roughness={0.75}
        />
      </mesh>

      {/* HAIR */}
      <mesh position={[0, 1.82, -0.02]} castShadow>
        <sphereGeometry args={[0.49, 32, 20]} />
        <meshStandardMaterial
          color="#211815"
          roughness={0.9}
        />
      </mesh>

      {/* FACE FRONT COVER */}
      <mesh position={[0, 1.57, 0.43]}>
        <sphereGeometry args={[0.40, 32, 20]} />
        <meshStandardMaterial color="#f1b08a" />
      </mesh>

      {/* LEFT EYE */}
      <mesh position={[-0.17, 1.63, 0.76]}>
        <sphereGeometry args={[0.055, 20, 20]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      {/* RIGHT EYE */}
      <mesh position={[0.17, 1.63, 0.76]}>
        <sphereGeometry args={[0.055, 20, 20]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      {/* LEFT EYEBROW */}
      <mesh
        position={[-0.17, 1.75, 0.755]}
        rotation={[0, 0, -0.08]}
      >
        <boxGeometry args={[0.16, 0.025, 0.025]} />
        <meshStandardMaterial color="#211815" />
      </mesh>

      {/* RIGHT EYEBROW */}
      <mesh
        position={[0.17, 1.75, 0.755]}
        rotation={[0, 0, 0.08]}
      >
        <boxGeometry args={[0.16, 0.025, 0.025]} />
        <meshStandardMaterial color="#211815" />
      </mesh>

      {/* NOSE */}
      <mesh position={[0, 1.50, 0.78]}>
        <coneGeometry args={[0.055, 0.18, 12]} />
        <meshStandardMaterial color="#d9906c" />
      </mesh>

      {/* MOUTH */}
      <mesh position={[0, 1.39, 0.77]}>
        <boxGeometry args={[0.18, 0.035, 0.025]} />
        <meshStandardMaterial color="#9b4b4b" />
      </mesh>

      {/* LEFT ARM */}
      <mesh
        position={[-0.58, 0.35, 0]}
        rotation={[0, 0, -0.18]}
        castShadow
      >
        <capsuleGeometry args={[0.13, 0.65, 8, 16]} />
        <meshStandardMaterial color="#6366f1" />
      </mesh>

      {/* RIGHT ARM */}
      <mesh
        position={[0.58, 0.35, 0]}
        rotation={[0, 0, 0.18]}
        castShadow
      >
        <capsuleGeometry args={[0.13, 0.65, 8, 16]} />
        <meshStandardMaterial color="#6366f1" />
      </mesh>

      {/* LEFT HAND */}
      <mesh position={[-0.68, -0.08, 0]} castShadow>
        <sphereGeometry args={[0.14, 20, 20]} />
        <meshStandardMaterial color="#f1b08a" />
      </mesh>

      {/* RIGHT HAND */}
      <mesh position={[0.68, -0.08, 0]} castShadow>
        <sphereGeometry args={[0.14, 20, 20]} />
        <meshStandardMaterial color="#f1b08a" />
      </mesh>

      {/* LEFT LEG */}
      <mesh position={[-0.20, -0.65, 0]} castShadow>
        <capsuleGeometry args={[0.17, 0.70, 8, 16]} />
        <meshStandardMaterial color="#242938" />
      </mesh>

      {/* RIGHT LEG */}
      <mesh position={[0.20, -0.65, 0]} castShadow>
        <capsuleGeometry args={[0.17, 0.70, 8, 16]} />
        <meshStandardMaterial color="#242938" />
      </mesh>

      {/* LEFT SHOE */}
      <mesh position={[-0.22, -1.10, 0.10]} castShadow>
        <boxGeometry args={[0.35, 0.16, 0.55]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      {/* RIGHT SHOE */}
      <mesh position={[0.22, -1.10, 0.10]} castShadow>
        <boxGeometry args={[0.35, 0.16, 0.55]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------
   AVATAR SCENE
------------------------------------------------------- */

function AvatarScene({ name }) {
  return (
    <Canvas
      shadows
      camera={{
        position: [0, 0.8, 4.2],
        fov: 42
      }}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "520px"
      }}
    >
      <ambientLight intensity={1.7} />

      <directionalLight
        position={[3, 5, 4]}
        intensity={2.5}
        castShadow
      />

      <pointLight
        position={[-3, 2, 2]}
        intensity={1.5}
      />

      <AvatarModel avatarName={name} />

      <ContactShadows
        position={[0, -2.35, 0]}
        opacity={0.35}
        scale={4}
        blur={2}
      />

      <Environment preset="city" />

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.7}
      />
    </Canvas>
  );
}

/* -------------------------------------------------------
   MAIN APP
------------------------------------------------------- */

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activePage, setActivePage] = useState("World");

  const [displayName, setDisplayName] = useState("Explorer");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState([]);

  const [saving, setSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  const [loginMode, setLoginMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  const [liked, setLiked] = useState({});
  const [messageText, setMessageText] = useState("");

  /* ---------------------------------------------
     AUTH
  --------------------------------------------- */

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (mounted) {
        setSession(session);
        setLoading(false);
      }
    }

    loadSession();

    const {
      data: { subscription }
    } = supabase
      ? supabase.auth.onAuthStateChange((_event, nextSession) => {
          setSession(nextSession);
        })
      : { data: { subscription: null } };

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  /* ---------------------------------------------
     LOAD PROFILE
  --------------------------------------------- */

  useEffect(() => {
    async function loadProfile() {
      if (!session?.user || !supabase) return;

      const userId = session.user.id;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Profile load error:", error);
        return;
      }

      if (data) {
        setDisplayName(data.display_name || "Explorer");
        setUsername(data.username || "");
        setBio(data.bio || "");
        setInterests(data.interests || []);
      } else {
        await supabase.from("profiles").insert({
          id: userId,
          display_name:
            session.user.user_metadata?.full_name ||
            "Explorer",
          bio: "",
          interests: []
        });
      }
    }

    loadProfile();
  }, [session]);

  /* ---------------------------------------------
     AUTH ACTIONS
  --------------------------------------------- */

  async function handleAuth(e) {
    e.preventDefault();
    setAuthMessage("");

    if (!supabase) {
      setAuthMessage("Supabase is not configured.");
      return;
    }

    if (!email || !password) {
      setAuthMessage("Email and password required.");
      return;
    }

    if (loginMode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: "Explorer"
          }
        }
      });

      if (error) {
        setAuthMessage(error.message);
        return;
      }

      setAuthMessage(
        "Account created. Please verify your email."
      );
      setLoginMode("login");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setAuthMessage(error.message);
      return;
    }
  }

  async function handleLogout() {
    await supabase?.auth.signOut();
  }

  /* ---------------------------------------------
     PROFILE SAVE
  --------------------------------------------- */

  async function saveAvatar(e) {
    e.preventDefault();

    if (!session?.user || !supabase) return;

    setSaving(true);
    setProfileMessage("");

    const cleanUsername = username.trim().toLowerCase();

    if (
      cleanUsername &&
      !/^[a-z0-9_]{3,20}$/.test(cleanUsername)
    ) {
      setProfileMessage(
        "Username 3-20 characters ka ho: a-z, 0-9 aur _ only."
      );
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim() || "Explorer",
        username: cleanUsername || null,
        bio: bio.trim(),
        interests,
        updated_at: new Date().toISOString()
      })
      .eq("id", session.user.id);

    if (error) {
      if (error.code === "23505") {
        setProfileMessage("Ye username already taken hai.");
      } else {
        setProfileMessage(error.message);
      }

      setSaving(false);
      return;
    }

    setProfileMessage("Avatar profile saved successfully.");
    setSaving(false);
  }

  function toggleInterest(item) {
    setInterests((current) =>
      current.includes(item)
        ? current.filter((x) => x !== item)
        : [...current, item]
    );
  }

  function toggleLike(id) {
    setLiked((current) => ({
      ...current,
      [id]: !current[id]
    }));
  }

  /* ---------------------------------------------
     LOADING
  --------------------------------------------- */

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-orb">
          ✦
        </div>
        <h2>Entering ArokaVerse...</h2>
        <p>Preparing your virtual world</p>
      </div>
    );
  }

  /* ---------------------------------------------
     LOGIN SCREEN
  --------------------------------------------- */

  if (!session) {
    return (
      <div className="auth-page">
        <div className="auth-glow glow-one" />
        <div className="auth-glow glow-two" />

        <div className="auth-card">
          <div className="brand-mark">✦</div>

          <h1>ArokaVerse</h1>

          <p className="auth-subtitle">
            Meet people. Create your avatar.
            <br />
            Enter a new virtual world.
          </p>

          <form onSubmit={handleAuth}>
            <label>Email</label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="primary-button">
              {loginMode === "login"
                ? "Enter ArokaVerse"
                : "Create Account"}
            </button>
          </form>

          {authMessage && (
            <div className="auth-message">
              {authMessage}
            </div>
          )}

          <button
            className="text-button"
            onClick={() =>
              setLoginMode(
                loginMode === "login"
                  ? "signup"
                  : "login"
              )
            }
          >
            {loginMode === "login"
              ? "New here? Create an account"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------
     MY AVATAR PAGE
  --------------------------------------------- */

  function AvatarPage() {
    return (
      <div className="avatar-page">
        <div className="page-heading">
          <div>
            <span className="eyebrow">
              YOUR VIRTUAL IDENTITY
            </span>

            <h1>My Avatar</h1>

            <p>
              This is how other people will see you
              inside ArokaVerse.
            </p>
          </div>

          <div className="avatar-online">
            <span />
            Online
          </div>
        </div>

        <div className="avatar-layout">
          {/* 3D VIEW */}
          <div className="avatar-stage">
            <div className="stage-top">
              <span>3D AVATAR</span>

              <span className="drag-hint">
                Drag to rotate
              </span>
            </div>

            <div className="avatar-canvas">
              <AvatarScene name={displayName} />
            </div>

            <div className="avatar-stage-bottom">
              <div>
                <strong>
                  {displayName || "Explorer"}
                </strong>

                {username && (
                  <span>@{username}</span>
                )}
              </div>

              <div className="avatar-badge">
                ✦ Early Explorer
              </div>
            </div>
          </div>

          {/* PROFILE */}
          <div className="avatar-editor">
            <div className="editor-header">
              <div className="editor-icon">
                <Camera size={20} />
              </div>

              <div>
                <h2>Avatar Profile</h2>
                <p>Tell the world about you.</p>
              </div>
            </div>

            <form onSubmit={saveAvatar}>
              <label>Display Name</label>

              <input
                value={displayName}
                onChange={(e) =>
                  setDisplayName(e.target.value)
                }
                placeholder="Your name"
              />

              <label>Username</label>

              <div className="username-input">
                <span>@</span>

                <input
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  placeholder="your_username"
                />
              </div>

              <label>Bio</label>

              <textarea
                value={bio}
                onChange={(e) =>
                  setBio(e.target.value)
                }
                placeholder="Tell people something about you..."
                rows={4}
              />

              <label>Interests</label>

              <div className="interest-grid">
                {interestOptions.map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={
                      interests.includes(item)
                        ? "interest active"
                        : "interest"
                    }
                    onClick={() =>
                      toggleInterest(item)
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="save-button"
                disabled={saving}
              >
                {saving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={18} />
                    Save Avatar Profile
                  </>
                )}
              </button>

              {profileMessage && (
                <div className="save-message">
                  <CheckCircle2 size={16} />
                  {profileMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------
     WORLD PAGE
  --------------------------------------------- */

  function WorldPage() {
    return (
      <div className="world-page">
        <div className="hero">
          <div>
            <span className="eyebrow">
              AROKAVERSE WORLD
            </span>

            <h1>
              Welcome back,{" "}
              {displayName || "Explorer"}.
            </h1>

            <p>
              Your virtual world is waiting.
              Meet people, talk, explore and create
              your own identity.
            </p>

            <button
              className="hero-button"
              onClick={() => setActivePage("My Avatar")}
            >
              <UserRound size={18} />
              Customize My Avatar
            </button>
          </div>

          <div className="hero-avatar">
            <AvatarScene name={displayName} />
          </div>
        </div>

        <div className="section-title">
          <div>
            <span className="eyebrow">
              PEOPLE AROUND YOU
            </span>
            <h2>Discover</h2>
          </div>
        </div>

        <div className="people-grid">
          {people.map((person) => (
            <div className="person-card" key={person.id}>
              <div className="person-avatar">
                <AvatarScene name={person.name} />
              </div>

              <div className="person-info">
                <h3>
                  {person.name}, {person.age}
                </h3>

                <div className="location">
                  <MapPin size={14} />
                  {person.city}
                </div>

                <p>{person.bio}</p>

                <div className="tag-row">
                  {person.interests.map((interest) => (
                    <span key={interest}>
                      {interest}
                    </span>
                  ))}
                </div>

                <div className="card-actions">
                  <button
                    className={
                      liked[person.id]
                        ? "round-action liked"
                        : "round-action"
                    }
                    onClick={() =>
                      toggleLike(person.id)
                    }
                  >
                    <Heart
                      size={18}
                      fill={
                        liked[person.id]
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                  <button
                    className="connect-button"
                    onClick={() =>
                      setActivePage("Messages")
                    }
                  >
                    <MessageCircle size={17} />
                    Connect
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ---------------------------------------------
     OTHER PAGE
  --------------------------------------------- */

  function ComingSoonPage({ title, icon }) {
    return (
      <div className="coming-page">
        <div className="coming-icon">{icon}</div>

        <span className="eyebrow">
          AROKAVERSE
        </span>

        <h1>{title}</h1>

        <p>
          This world is being built.
          Your next virtual experience will
          appear here soon.
        </p>

        <button
          className="hero-button"
          onClick={() => setActivePage("World")}
        >
          <ArrowLeft size={17} />
          Back to World
        </button>
      </div>
    );
  }

  /* ---------------------------------------------
     APP SHELL
  --------------------------------------------- */

  const navItems = [
    {
      label: "World",
      icon: <Globe size={19} />
    },
    {
      label: "Discover",
      icon: <Compass size={19} />
    },
    {
      label: "Matches",
      icon: <Heart size={19} />
    },
    {
      label: "Messages",
      icon: <MessageCircle size={19} />
    },
    {
      label: "My Avatar",
      icon: <UserRound size={19} />
    }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">✦</div>

          <div>
            <strong>ArokaVerse</strong>
            <span>Virtual World</span>
          </div>
        </div>

        <nav>
          {navItems.map((item) => (
            <button
              key={item.label}
              className={
                activePage === item.label
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() =>
                setActivePage(item.label)
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="mini-profile">
            <div className="mini-avatar">
              {displayName?.charAt(0)?.toUpperCase() ||
                "E"}
            </div>

            <div>
              <strong>
                {displayName || "Explorer"}
              </strong>

              <span>
                {username
                  ? `@${username}`
                  : "New explorer"}
              </span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Log out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <span className="live-dot" />
            <span>AROKAVERSE LIVE</span>
          </div>

          <div className="topbar-right">
            <span className="early-access">
              EARLY ACCESS
            </span>

            <button className="icon-button">
              <Volume2 size={18} />
            </button>

            <button className="icon-button">
              <Settings size={18} />
            </button>
          </div>
        </header>

        {activePage === "World" && <WorldPage />}

        {activePage === "My Avatar" && <AvatarPage />}

        {activePage === "Discover" && (
          <ComingSoonPage
            title="Discover"
            icon={<Compass size={38} />}
          />
        )}

        {activePage === "Matches" && (
          <ComingSoonPage
            title="Matches"
            icon={<Heart size={38} />}
          />
        )}

        {activePage === "Messages" && (
          <ComingSoonPage
            title="Messages"
            icon={<MessageCircle size={38} />}
          />
        )}
      </main>
    </div>
  );
}
```

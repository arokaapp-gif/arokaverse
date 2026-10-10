
import { useEffect, useState, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Compass,
  UserRound,
  Users,
  LogOut,
  Sparkles,
  Eye,
  EyeOff,
  Send,
  Settings,
  ArrowRight,
  MapPin,
  X,
  Check,
  LoaderCircle,
  ShieldCheck,
  Mail,
  RefreshCw,
} from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
} from "@react-three/drei";
import { supabase } from "./lib/supabase.js";
import "./style.css";

/* -------------------------------------------------------
   AROKAVERSE — 3D AVATAR MODEL
------------------------------------------------------- */

function AvatarModel({ avatarName = "Explorer", color = "#9b82ff" }) {
  const group = useRef();

  useFrame((state, delta) => {
    if (!group.current) return;

    group.current.rotation.y +=
      (Math.sin(state.clock.elapsedTime * 0.45) * 0.12 -
        group.current.rotation.y) *
      Math.min(delta * 2, 1);

    // Preserve the original vertical position while gently floating.
    group.current.position.y =
      -0.25 + Math.sin(state.clock.elapsedTime * 1.4) * 0.035;
  });

  const hairColor =
    avatarName.toLowerCase().includes("mira") ||
    avatarName.toLowerCase().includes("anaya")
      ? "#35243d"
      : "#30243a";

  return (
    <group ref={group} position={[0, -0.25, 0]}>
      {/* Legs */}
      <mesh position={[-0.19, -0.78, 0]} castShadow>
        <capsuleGeometry args={[0.115, 0.65, 6, 12]} />
        <meshStandardMaterial color="#37395d" roughness={0.65} />
      </mesh>

      <mesh position={[0.19, -0.78, 0]} castShadow>
        <capsuleGeometry args={[0.115, 0.65, 6, 12]} />
        <meshStandardMaterial color="#37395d" roughness={0.65} />
      </mesh>

      {/* Shoes */}
      <mesh position={[-0.19, -1.19, 0.1]} castShadow>
        <capsuleGeometry args={[0.11, 0.19, 5, 10]} />
        <meshStandardMaterial color="#e8e7ff" roughness={0.45} />
      </mesh>

      <mesh position={[0.19, -1.19, 0.1]} castShadow>
        <capsuleGeometry args={[0.11, 0.19, 5, 10]} />
        <meshStandardMaterial color="#e8e7ff" roughness={0.45} />
      </mesh>

      {/* Body */}
      <mesh position={[0, -0.12, 0]} castShadow>
        <capsuleGeometry args={[0.34, 0.63, 8, 18]} />
        <meshStandardMaterial
          color={color}
          roughness={0.42}
          metalness={0.08}
        />
      </mesh>

      {/* Jacket details */}
      <mesh position={[0, -0.1, 0.305]}>
        <boxGeometry args={[0.035, 0.58, 0.025]} />
        <meshStandardMaterial color="#f1eaff" />
      </mesh>

      <mesh position={[0, 0.05, 0.33]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#ffd68c" metalness={0.4} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.47, 0]} castShadow>
        <cylinderGeometry args={[0.105, 0.12, 0.23, 16]} />
        <meshStandardMaterial color="#d99c7e" roughness={0.75} />
      </mesh>

      {/* Arms */}
      <mesh
        position={[-0.42, -0.13, 0]}
        rotation={[0, 0, -0.16]}
        castShadow
      >
        <capsuleGeometry args={[0.105, 0.47, 6, 12]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>

      <mesh
        position={[0.42, -0.13, 0]}
        rotation={[0, 0, 0.16]}
        castShadow
      >
        <capsuleGeometry args={[0.105, 0.47, 6, 12]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>

      {/* Hands */}
      <mesh position={[-0.44, -0.43, 0]}>
        <sphereGeometry args={[0.105, 16, 16]} />
        <meshStandardMaterial color="#d99c7e" roughness={0.7} />
      </mesh>

      <mesh position={[0.44, -0.43, 0]}>
        <sphereGeometry args={[0.105, 16, 16]} />
        <meshStandardMaterial color="#d99c7e" roughness={0.7} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.94, 0]} castShadow>
        <sphereGeometry args={[0.39, 32, 32]} />
        <meshStandardMaterial color="#e6b092" roughness={0.72} />
      </mesh>

      {/* Ears */}
      <mesh position={[-0.385, 0.91, 0]}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshStandardMaterial color="#e6b092" roughness={0.8} />
      </mesh>

      <mesh position={[0.385, 0.91, 0]}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshStandardMaterial color="#e6b092" roughness={0.8} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.17, -0.015]} castShadow>
        <sphereGeometry
          args={[0.405, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.58]}
        />
        <meshStandardMaterial color={hairColor} roughness={0.85} />
      </mesh>

      {/* Front hair fringe */}
      <mesh position={[0, 1.15, 0.275]} rotation={[0.1, 0, 0]}>
        <sphereGeometry args={[0.24, 24, 16]} />
        <meshStandardMaterial color={hairColor} roughness={0.9} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.135, 0.98, 0.335]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh position={[0.135, 0.98, 0.335]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh position={[-0.135, 0.98, 0.372]}>
        <sphereGeometry args={[0.023, 16, 16]} />
        <meshStandardMaterial color="#30243a" />
      </mesh>

      <mesh position={[0.135, 0.98, 0.372]}>
        <sphereGeometry args={[0.023, 16, 16]} />
        <meshStandardMaterial color="#30243a" />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0.89, 0.375]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#d99c7e" roughness={0.8} />
      </mesh>

      {/* Smile */}
      <mesh position={[0, 0.805, 0.358]} scale={[1, 0.4, 0.3]}>
        <torusGeometry args={[0.075, 0.012, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#9b4c55" />
      </mesh>

      {/* Small glowing pendant */}
      <mesh position={[0, 0.31, 0.32]}>
        <octahedronGeometry args={[0.065, 0]} />
        <meshStandardMaterial
          color="#ffe1a1"
          emissive="#ffba65"
          emissiveIntensity={0.3}
          metalness={0.3}
        />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------
   3D SCENE
------------------------------------------------------- */

function AvatarScene({ name = "Explorer", color = "#9b82ff" }) {
  return (
    <Canvas
      shadows
      camera={{
        position: [0, 0.45, 5.4],
        fov: 42,
        near: 0.1,
        far: 100,
      }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ camera, gl }) => {
        camera.lookAt(0, 0.25, 0);
        gl.setClearColor("#000000", 0);
      }}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        minHeight: "260px",
      }}
    >
      <color attach="background" args={["#17182e"]} />

      <ambientLight intensity={1.8} />

      <hemisphereLight
        skyColor="#d8ccff"
        groundColor="#24213b"
        intensity={1.5}
      />

      <directionalLight
        position={[4, 6, 5]}
        intensity={2.5}
        castShadow
      />

      <pointLight
        position={[-3, 2, 3]}
        intensity={2}
        color="#c4a7ff"
      />

      <pointLight
        position={[3, 1, -2]}
        intensity={1.5}
        color="#ffb6d9"
      />

      <AvatarModel avatarName={name} color={color} />

      <ContactShadows
        position={[0, -1.65, 0]}
        opacity={0.35}
        scale={3.5}
        blur={2}
        far={4}
      />

      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={3.5}
        maxDistance={7}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.7}
        target={[0, 0.25, 0]}
      />
    </Canvas>
  );
}

/* -------------------------------------------------------
   DEMO DISCOVERY PROFILES
   These are sample profiles, not real registered users.
------------------------------------------------------- */

const demoPeople = [
  {
    id: "demo-mira",
    name: "Mira",
    age: 23,
    location: "Nearby",
    distance: "2 km away",
    bio: "Music, sunsets and meaningful conversations ✨",
    interests: ["Music", "Travel", "Art"],
    color: "#b68aff",
    online: true,
  },
  {
    id: "demo-aarav",
    name: "Aarav",
    age: 25,
    location: "Nearby",
    distance: "4 km away",
    bio: "Coffee lover, gamer and weekend explorer.",
    interests: ["Gaming", "Coffee", "Movies"],
    color: "#67b7e8",
    online: true,
  },
  {
    id: "demo-anaya",
    name: "Anaya",
    age: 22,
    location: "Your area",
    distance: "6 km away",
    bio: "Books, beaches and little adventures 🌸",
    interests: ["Books", "Beach", "Photography"],
    color: "#ff8fb8",
    online: false,
  },
  {
    id: "demo-rey",
    name: "Rey",
    age: 24,
    location: "Your area",
    distance: "8 km away",
    bio: "Building dreams, one day at a time.",
    interests: ["Fitness", "Technology", "Travel"],
    color: "#75d4bc",
    online: true,
  },
];

/* -------------------------------------------------------
   AUTH SCREEN
------------------------------------------------------- */

function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (mode === "signup" && !displayName.trim()) {
      setError("Please enter your display name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              display_name: displayName.trim(),
              avatar_name: displayName.trim() || "Explorer",
            },
          },
        });

        if (authError) throw authError;

        if (data.session) {
          setNotice("Account created successfully!");
        } else {
          setNotice(
            "Account created. Check your email for the verification link, then return here to log in."
          );
          setMode("login");
        }
      } else {
        const { error: authError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (authError) throw authError;
      }
    } catch (err) {
      setError(
        err?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-visual">
        <div className="auth-brand">
          <div className="brand-symbol">
            <Sparkles size={24} />
          </div>
          <span>ArokaVerse</span>
        </div>

        <div className="auth-hero-copy">
          <span className="eyebrow">YOUR WORLD. YOUR AVATAR.</span>
          <h1>
            Meet beyond
            <br />
            <span>the ordinary.</span>
          </h1>
          <p>
            Enter a new social universe. Create your avatar, discover
            people and build meaningful connections.
          </p>
        </div>

        <div className="auth-avatar">
          <AvatarScene name="Explorer" color="#a98bff" />
        </div>

        <div className="auth-visual-footer">
          <span>
            <span className="status-dot" /> Your next connection awaits
          </span>
          <span>Connect · Explore · Belong</span>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-form-wrap">
          <div className="mobile-brand">
            <Sparkles size={22} /> ArokaVerse
          </div>

          <span className="eyebrow">
            {mode === "login" ? "WELCOME BACK" : "YOUR JOURNEY STARTS HERE"}
          </span>

          <h2>
            {mode === "login" ? "Enter your universe" : "Create your account"}
          </h2>

          <p className="auth-subtitle">
            {mode === "login"
              ? "Log in to continue your journey."
              : "Join ArokaVerse with your email address."}
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === "signup" && (
              <label className="form-field">
                <span>Display name</span>
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="What should people call you?"
                  autoComplete="nickname"
                  required
                />
              </label>
            )}

            <label className="form-field">
              <span>Email address</span>
              <div className="input-with-icon">
                <Mail size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="form-field">
              <span>Password</span>
              <div className="input-with-icon">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {error && <div className="auth-error">{error}</div>}
            {notice && <div className="auth-notice">{notice}</div>}

            <button
              className="primary-button auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle size={18} className="spin" />
                  Please wait...
                </>
              ) : (
                <>
                  {mode === "login" ? "Enter ArokaVerse" : "Create account"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-switch">
            {mode === "login"
              ? "New to ArokaVerse?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
                setNotice("");
              }}
            >
              {mode === "login" ? "Create account" : "Log in"}
            </button>
          </div>

          <p className="auth-privacy">
            <ShieldCheck size={15} />
            Email-based account access. Never share your password.
          </p>
        </div>
      </section>
    </main>
  );
}

/* -------------------------------------------------------
   SHARED AVATAR COMPONENT
------------------------------------------------------- */

function AvatarBox({ name, color, className = "" }) {
  return (
    <div className={`avatar-canvas ${className}`}>
      <AvatarScene name={name} color={color} />
    </div>
  );
}

/* -------------------------------------------------------
   WORLD PAGE
------------------------------------------------------- */

function WorldPage({ profile, onNavigate }) {
  const displayName = profile.displayName || "Explorer";
  const avatarName = profile.avatarName || displayName;

  return (
    <div className="page-content world-page">
      <section className="world-hero">
        <div className="world-hero-copy">
          <span className="eyebrow">
            <Sparkles size={15} /> YOUR SOCIAL UNIVERSE
          </span>
          <h1>
            Your world.
            <br />
            <span>Your story.</span>
          </h1>
          <p>
            Step into a world of avatars, conversations and connections.
            Your next chapter starts here.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={() => onNavigate("discover")}
            >
              Discover people <ArrowRight size={18} />
            </button>
            <button
              className="secondary-button"
              onClick={() => onNavigate("avatar")}
            >
              Customize avatar
            </button>
          </div>

          <div className="hero-note">
            <span className="status-dot" />
            Welcome back, {displayName}
          </div>
        </div>

        <div className="hero-avatar">
          <AvatarBox name={avatarName} color={profile.avatarColor || "#9b82ff"} />
          <div className="avatar-nameplate">
            <div className="avatar-nameplate-icon">
              <Sparkles size={16} />
            </div>
            <div>
              <strong>{avatarName}</strong>
              <span>Your avatar</span>
            </div>
            <span className="online-pill">YOU</span>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">EXPLORE THE UNIVERSE</span>
            <h2>Choose your next adventure</h2>
          </div>
        </div>

        <div className="feature-grid">
          <button
            className="feature-card feature-discover"
            onClick={() => onNavigate("discover")}
          >
            <span className="feature-icon">
              <Compass size={23} />
            </span>
            <h3>Discover</h3>
            <p>Explore people and find someone you connect with.</p>
            <span className="feature-link">
              Start exploring <ArrowRight size={16} />
            </span>
          </button>

          <button
            className="feature-card feature-matches"
            onClick={() => onNavigate("matches")}
          >
            <span className="feature-icon">
              <Heart size={23} />
            </span>
            <h3>Your connections</h3>
            <p>Keep track of the profiles you like.</p>
            <span className="feature-link">
              View connections <ArrowRight size={16} />
            </span>
          </button>

          <button
            className="feature-card feature-messages"
            onClick={() => onNavigate("messages")}
          >
            <span className="feature-icon">
              <MessageCircle size={23} />
            </span>
            <h3>Messages</h3>
            <p>Your conversation space for future connections.</p>
            <span className="feature-link">
              Open messages <ArrowRight size={16} />
            </span>
          </button>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">MEET THE UNIVERSE</span>
            <h2>Avatars to explore</h2>
          </div>
          <button
            className="text-button"
            onClick={() => onNavigate("discover")}
          >
            See all <ArrowRight size={16} />
          </button>
        </div>

        <div className="people-preview-grid">
          {demoPeople.slice(0, 3).map((person) => (
            <div className="people-preview-card" key={person.id}>
              <div className="person-avatar">
                <AvatarScene name={person.name} color={person.color} />
                {person.online && (
                  <span className="person-online-dot" />
                )}
              </div>
              <div className="person-preview-info">
                <strong>
                  {person.name}, {person.age}
                </strong>
                <span>
                  <MapPin size={13} /> {person.distance}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------
   MY AVATAR PAGE
------------------------------------------------------- */

function AvatarPage({ profile, onSave }) {
  const [name, setName] = useState(profile.avatarName || "Explorer");
  const [color, setColor] = useState(profile.avatarColor || "#9b82ff");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setName(profile.avatarName || "Explorer");
    setColor(profile.avatarColor || "#9b82ff");
  }, [profile.avatarName, profile.avatarColor]);

  const colors = [
    "#9b82ff",
    "#67b7e8",
    "#ff8fb8",
    "#75d4bc",
    "#ffbd70",
    "#e77d83",
  ];

  async function saveAvatar() {
    setSaving(true);
    setNotice("");

    const result = await onSave({
      avatarName: name.trim() || "Explorer",
      avatarColor: color,
    });

    setSaving(false);
    setNotice(
      result?.error
        ? `Could not save: ${result.error}`
        : "Avatar preferences saved."
    );
  }

  return (
    <div className="page-content">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">YOUR DIGITAL IDENTITY</span>
          <h1>My Avatar</h1>
          <p>Choose your avatar name and signature color.</p>
        </div>
      </div>

      <section className="avatar-editor">
        <div className="avatar-stage">
          <div className="avatar-stage-glow" />
          <AvatarBox name={name || "Explorer"} color={color} />
          <div className="avatar-stage-label">
            <Sparkles size={16} /> LIVE AVATAR PREVIEW
          </div>
        </div>

        <div className="avatar-editor-controls">
          <span className="eyebrow">PERSONALIZE</span>
          <h2>Make it yours</h2>
          <p>
            Your avatar is your visual identity in ArokaVerse.
          </p>

          <label className="form-field">
            <span>Avatar name</span>
            <input
              value={name}
              maxLength={30}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter avatar name"
            />
          </label>

          <div className="form-field">
            <span>Signature color</span>
            <div className="avatar-color-options">
              {colors.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`color-choice ${color === item ? "selected" : ""}`}
                  style={{ backgroundColor: item }}
                  onClick={() => setColor(item)}
                  aria-label={`Choose ${item}`}
                  aria-pressed={color === item}
                >
                  {color === item && <Check size={18} />}
                </button>
              ))}
            </div>
          </div>

          {notice && <div className="auth-notice">{notice}</div>}

          <button
            className="primary-button"
            onClick={saveAvatar}
            disabled={saving}
          >
            {saving ? (
              <LoaderCircle size={18} className="spin" />
            ) : (
              <Check size={18} />
            )}
            {saving ? "Saving..." : "Save avatar"}
          </button>
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------
   DISCOVER PAGE
------------------------------------------------------- */

function DiscoverPage({ likedIds, onLike, onNavigate }) {
  const [index, setIndex] = useState(0);
  const person = demoPeople[index % demoPeople.length];

  function handleLike() {
    onLike(person);
    setIndex((current) => current + 1);
  }

  function skipPerson() {
    setIndex((current) => current + 1);
  }

  return (
    <div className="page-content">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">FIND YOUR PEOPLE</span>
          <h1>Discover</h1>
          <p>Explore sample avatar profiles in the ArokaVerse demo.</p>
        </div>
      </div>

      <div className="discover-layout">
        <section className="discover-card">
          <div className="discover-avatar">
            <AvatarScene name={person.name} color={person.color} />
            <span className="discover-tag">
              <Sparkles size={14} /> AVATAR PROFILE
            </span>
            {person.online && (
              <span className="discover-online">
                <span className="status-dot" /> Online demo
              </span>
            )}
          </div>

          <div className="discover-details">
            <div className="discover-person-heading">
              <div>
                <h2>
                  {person.name}, {person.age}
                </h2>
                <span>
                  <MapPin size={14} /> {person.distance}
                </span>
              </div>
            </div>

            <p className="discover-bio">{person.bio}</p>

            <div className="interest-tags">
              {person.interests.map((interest) => (
                <span key={interest}>{interest}</span>
              ))}
            </div>

            <div className="discover-actions">
              <button
                className="skip-button"
                onClick={skipPerson}
                aria-label="Skip profile"
              >
                <X size={22} />
              </button>

              <button
                className="like-button"
                onClick={handleLike}
                aria-label="Like profile"
              >
                <Heart size={23} />
                Like
              </button>
            </div>

            {likedIds.includes(person.id) && (
              <p className="small-note">
                You liked this demo profile earlier. Likes are currently
                stored only in this browser session.
              </p>
            )}
          </div>
        </section>

        <aside className="discover-side-panel">
          <div className="side-panel-icon">
            <Heart size={24} />
          </div>
          <h3>Connections start with a hello.</h3>
          <p>
            Like a profile to add it to your local demo connections.
            Real user discovery and mutual matching require database
            integration.
          </p>
          <button
            className="secondary-button"
            onClick={() => onNavigate("matches")}
          >
            View liked profiles <ArrowRight size={16} />
          </button>
        </aside>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   MATCHES PAGE
------------------------------------------------------- */

function MatchesPage({ likedPeople, onNavigate }) {
  return (
    <div className="page-content">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">YOUR CONNECTIONS</span>
          <h1>Likes & connections</h1>
          <p>Profiles you have liked during this session.</p>
        </div>
      </div>

      <div className="demo-info">
        <Sparkles size={18} />
        These are local demo likes, not verified mutual matches.
      </div>

      {likedPeople.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Heart size={28} />
          </div>
          <h2>Your story starts here</h2>
          <p>
            You have not liked any profiles in this session yet. Explore
            avatars and find profiles you would like to know better.
          </p>
          <button
            className="primary-button"
            onClick={() => onNavigate("discover")}
          >
            Discover people <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div className="matches-grid">
          {likedPeople.map((person) => (
            <div className="match-card" key={person.id}>
              <div className="person-avatar">
                <AvatarScene name={person.name} color={person.color} />
              </div>
              <div className="match-card-info">
                <h3>
                  {person.name}, {person.age}
                </h3>
                <p>{person.bio}</p>
                <span className="demo-label">Demo like</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------
   MESSAGES PAGE
------------------------------------------------------- */

function MessagesPage() {
  return (
    <div className="page-content">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">YOUR CONVERSATIONS</span>
          <h1>Messages</h1>
          <p>Your space for conversations in ArokaVerse.</p>
        </div>
      </div>

      <div className="empty-state">
        <div className="empty-state-icon">
          <MessageCircle size={28} />
        </div>
        <h2>Your conversations will live here</h2>
        <p>
          This screen is ready for the next stage. Real-time private
          messaging needs a Supabase messages table, access policies,
          and live subscriptions.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   SETTINGS PAGE
------------------------------------------------------- */

function SettingsPage({ profile, onSave, onLogout }) {
  const [displayName, setDisplayName] = useState(profile.displayName || "");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setDisplayName(profile.displayName || "");
  }, [profile.displayName]);

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    setNotice("");

    const result = await onSave({
      displayName: displayName.trim() || "Explorer",
    });

    setSaving(false);
    setNotice(
      result?.error
        ? `Could not save: ${result.error}`
        : "Profile updated."
    );
  }

  return (
    <div className="page-content">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">ACCOUNT PREFERENCES</span>
          <h1>Settings</h1>
          <p>Manage your account details.</p>
        </div>
      </div>

      <section className="settings-card">
        <div className="settings-card-heading">
          <Settings size={22} />
          <div>
            <h2>Your profile</h2>
            <p>Change how your name appears in the app.</p>
          </div>
        </div>

        <form onSubmit={saveProfile}>
          <label className="form-field">
            <span>Display name</span>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              maxLength={50}
              required
            />
          </label>

          <div className="settings-email">
            <Mail size={17} />
            <div>
              <span>Email account</span>
              <strong>{profile.email || "Email unavailable"}</strong>
            </div>
          </div>

          {notice && <div className="auth-notice">{notice}</div>}

          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>

        <div className="settings-divider" />

        <button className="logout-button" onClick={onLogout}>
          <LogOut size={18} /> Log out
        </button>
      </section>
    </div>
  );
}

/* -------------------------------------------------------
   MAIN APP
------------------------------------------------------- */

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [page, setPage] = useState("world");
  const [likedPeople, setLikedPeople] = useState([]);
  const [profile, setProfile] = useState({
    email: "",
    displayName: "",
    avatarName: "Explorer",
    avatarColor: "#9b82ff",
  });

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error("Unable to get Supabase session:", error.message);
      }

      setSession(data?.session || null);
      setAuthLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setProfile({
        email: "",
        displayName: "",
        avatarName: "Explorer",
        avatarColor: "#9b82ff",
      });
      return;
    }

    const user = session.user;
    const metadata = user.user_metadata || {};
    const displayName = metadata.display_name || "Explorer";

    setProfile({
      email: user.email || "",
      displayName,
      avatarName: metadata.avatar_name || displayName,
      avatarColor: metadata.avatar_color || "#9b82ff",
    });
  }, [session]);

  async function saveProfile(updates) {
    const currentUser = session?.user;

    if (!currentUser) {
      return { error: "You need to log in again." };
    }

    const currentMetadata = currentUser.user_metadata || {};
    const nextMetadata = {
      ...currentMetadata,
      ...(updates.displayName !== undefined
        ? { display_name: updates.displayName }
        : {}),
      ...(updates.avatarName !== undefined
        ? { avatar_name: updates.avatarName }
        : {}),
      ...(updates.avatarColor !== undefined
        ? { avatar_color: updates.avatarColor }
        : {}),
    };

    const { data, error } = await supabase.auth.updateUser({
      data: nextMetadata,
    });

    if (error) {
      console.error("Profile update failed:", error.message);
      return { error: error.message };
    }

    const user = data.user;
    const metadata = user?.user_metadata || nextMetadata;
    const displayName = metadata.display_name || "Explorer";

    setProfile({
      email: user?.email || currentUser.email || "",
      displayName,
      avatarName: metadata.avatar_name || displayName,
      avatarColor: metadata.avatar_color || "#9b82ff",
    });

    return { error: null };
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error.message);
      return;
    }

    setLikedPeople([]);
    setPage("world");
  }

  function handleLike(person) {
    setLikedPeople((current) => {
      if (current.some((item) => item.id === person.id)) {
        return current;
      }

      return [...current, person];
    });
  }

  const navItems = [
    { id: "world", label: "World", icon: Compass },
    { id: "discover", label: "Discover", icon: Heart },
    { id: "matches", label: "Connections", icon: Users },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "avatar", label: "My Avatar", icon: UserRound },
  ];

  if (authLoading) {
    return (
      <div className="app-loading">
        <div className="loading-logo">
          <Sparkles size={28} />
        </div>
        <LoaderCircle size={25} className="spin" />
        <p>Entering ArokaVerse...</p>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  const displayName = profile.displayName || "Explorer";
  const initials = displayName.slice(0, 1).toUpperCase();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button
          className="sidebar-brand"
          onClick={() => setPage("world")}
          aria-label="Go to World"
        >
          <span className="brand-symbol">
            <Sparkles size={22} />
          </span>
          <span>ArokaVerse</span>
        </button>

        <div className="sidebar-section-label">YOUR UNIVERSE</div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={`nav-item ${page === item.id ? "active" : ""}`}
                onClick={() => setPage(item.id)}
              >
                <Icon size={19} />
                <span>{item.label}</span>

                {item.id === "matches" && likedPeople.length > 0 && (
                  <span className="nav-count">{likedPeople.length}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-profile">
            <div className="profile-initial">{initials}</div>
            <div className="sidebar-profile-text">
              <strong>{displayName}</strong>
              <span>Member</span>
            </div>
            <button
              className="icon-button"
              title="Settings"
              onClick={() => setPage("settings")}
            >
              <Settings size={17} />
            </button>
          </div>

          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={17} /> Log out
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-breadcrumb">
            <span>ArokaVerse</span>
            <span className="breadcrumb-divider">/</span>
            <strong>
              {page === "world"
                ? "World"
                : page === "discover"
                  ? "Discover"
                  : page === "matches"
                    ? "Connections"
                    : page === "messages"
                      ? "Messages"
                      : page === "avatar"
                        ? "My Avatar"
                        : "Settings"}
            </strong>
          </div>

          <div className="topbar-user">
            <span className="topbar-greeting">Welcome, {displayName}</span>
            <div className="profile-initial">{initials}</div>
          </div>
        </header>

        <div className="main-scroll">
          {page === "world" && (
            <WorldPage profile={profile} onNavigate={setPage} />
          )}

          {page === "discover" && (
            <DiscoverPage
              likedIds={likedPeople.map((person) => person.id)}
              onLike={handleLike}
              onNavigate={setPage}
            />
          )}

          {page === "matches" && (
            <MatchesPage
              likedPeople={likedPeople}
              onNavigate={setPage}
            />
          )}

          {page === "messages" && <MessagesPage />}

          {page === "avatar" && (
            <AvatarPage profile={profile} onSave={saveProfile} />
          )}

          {page === "settings" && (
            <SettingsPage
              profile={profile}
              onSave={saveProfile}
              onLogout={handleLogout}
            />
          )}
        </div>

        <footer className="app-footer">
          <span>© {new Date().getFullYear()} ArokaVerse</span>
          <span>Connect · Explore · Belong</span>
        </footer>
      </main>
    </div>
  );
}

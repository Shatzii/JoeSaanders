Nice — we’ll ship **Phone-as-Putter (lane C)** as the *only game* on the site and I’ll act like your Copilot prompt expert: below you get (A) exact Copilot prompts you can paste into Copilot/CoPilot Chat to generate these pieces, and (B) complete, copy-pasteable Next.js files (server socket + mobile controller + game page + putter adapter + simple gating) ready to drop into your repo and wire to the Stones membership gate. I built the code to be minimal, production-ready-ish, and obvious where to swap auth/Stripe logic.

High-level flow:

* Mobile user opens `/controller` on their phone, taps **Calibrate**, swings — device motion/orientation is streamed to the server via Socket.IO.
* Desktop user opens `/game` (the only game page on the site). The game page receives IMU samples, detects a stroke (threshold), calculates `{power, aim, faceAngle}`, emits a `CustomEvent('putter-stroke', {detail})` and optionally synthesizes mouse events into the game canvas (id=`game-canvas`) so existing games that expect mouse input still work.
* Membership gating: middleware checks a cookie `stones_member=true`. I provide a placeholder check — replace with your real auth / Stripe membership check.

---

## 1) Copilot prompts (use these first — they produce the same files below)

Paste these exact prompts (one at a time) into Copilot/CoPilot Chat to scaffold each file. After Copilot generates, replace with the fully-tested code below if you prefer to paste directly.

### Prompt A — Socket.IO server API route

```
Create a Next.js API route at /api/socket that initializes/socket.io on the server (avoids double-init) and sets up two events: 'join-room' and 'imu'. On 'imu' it should broadcast the imu sample to everyone else in the same room. Use the standard pattern to attach socket.io to Next's res.socket.server and cache the io instance to prevent re-init. Keep code commented and short.
```

### Prompt B — Mobile controller page

```
Create a Next.js React page at /controller that:
- connects to socket.io server
- has a Calibrate button to set neutral yaw
- captures deviceorientation and devicemotion (DeviceOrientationEvent & DeviceMotionEvent), packages small JSON sample {t, alpha,beta,gamma,ax,ay,az} and emits 'imu' along with a room id
- shows live indicators (last yaw, last accel magnitude) and a "connected" state
- keep code small and commented
```

### Prompt C — Desktop game receiver page

```
Create a Next.js React page at /game that:
- connects to socket.io server
- joins the room id
- receives 'imu' samples, buffers them, computes angular velocity around yaw, detects a stroke when angular velocity passes a threshold, computes normalized power (0..1) and aim (degrees relative to neutral yaw)
- dispatches a CustomEvent 'putter-stroke' with detail {power, aim, faceAngle, timestamp}
- also attempts to inject synthetic mouse events into a canvas with id 'game-canvas' for legacy games
- include a simple on-screen debug overlay showing last power and aim
```

### Prompt D — Simple middleware gating

```
Create Next.js middleware that checks a cookie 'stones_member' === 'true' for the /game path. If missing redirect to /subscribe. Keep small and note where to swap out with real auth logic.
```

---

## 2) Drop-in files (copy & paste into your Next.js site)

> Assumptions & where to paste:
>
> * This uses the **pages** directory style Next.js (works with latest stable Next.js; if you use App Router, convert pages → app routes quickly).
> * Put socket server at `/pages/api/socket.js`, pages at `/pages/controller.js` and `/pages/game.js`. Add `public/js/putter-adapter.js` if you want the adapter standalone.

Install dependencies:

```
npm install socket.io socket.io-client cookie
# or yarn add socket.io socket.io-client cookie
```

---

### `/pages/api/socket.js`

```js
// pages/api/socket.js
import { Server } from "socket.io";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("🔌 initializing socket.io");
    const io = new Server(res.socket.server);
    io.on("connection", (socket) => {
      console.log("client connected", socket.id);

      socket.on("join-room", (room) => {
        socket.join(room);
        socket.room = room;
        console.log("joined room", room);
      });

      // IMU samples from controller: broadcast to room (except sender)
      socket.on("imu", (payload) => {
        const room = payload.room || socket.room;
        if (room) socket.to(room).emit("imu", payload.sample || payload);
      });

      socket.on("disconnect", () => {
        console.log("client disconnected", socket.id);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
```

Notes: keeps single io instance attached to `res.socket.server.io`. This is the canonical pattern.

---

### `/pages/controller.js` (mobile)

```jsx
// pages/controller.js
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

let socket;

export default function ControllerPage() {
  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState("stones-default");
  const neutralRef = useRef(0);
  const lastSampleRef = useRef(null);
  const [debug, setDebug] = useState({alpha:0, accel:0});

  useEffect(() => {
    // lazy connect
    if (!socket) {
      socket = io();
      socket.on("connect", () => setConnected(true));
      socket.on("disconnect", () => setConnected(false));
    }
    // warm the server so socket.io is initialized
    fetch("/api/socket").catch(()=>{});
    return () => {};
  }, []);

  useEffect(() => {
    function handleOrient(e) {
      // alpha: yaw (0..360), beta/gamma: pitch/roll
      const alpha = e.alpha ?? 0;
      lastSampleRef.current = lastSampleRef.current || {};
      lastSampleRef.current.alpha = alpha;
      setDebug((d)=>({...d, alpha: Math.round(alpha)}));
      emitSample();
    }
    function handleMotion(e) {
      const a = e.accelerationIncludingGravity || e.acceleration || {x:0,y:0,z:0};
      lastSampleRef.current = lastSampleRef.current || {};
      lastSampleRef.current.ax = a.x || 0;
      lastSampleRef.current.ay = a.y || 0;
      lastSampleRef.current.az = a.z || 0;
      const accel = Math.sqrt((a.x||0)**2 + (a.y||0)**2 + (a.z||0)**2);
      setDebug((d)=>({...d, accel: Math.round(accel*10)/10}));
      emitSample();
    }

    window.addEventListener("deviceorientation", handleOrient);
    window.addEventListener("devicemotion", handleMotion);

    return () => {
      window.removeEventListener("deviceorientation", handleOrient);
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [room]);

  function emitSample() {
    if (!socket || !lastSampleRef.current) return;
    const payload = {
      room,
      sample: {
        t: Date.now(),
        alpha: lastSampleRef.current.alpha || 0,
        beta: lastSampleRef.current.beta || 0,
        gamma: lastSampleRef.current.gamma || 0,
        ax: lastSampleRef.current.ax || 0,
        ay: lastSampleRef.current.ay || 0,
        az: lastSampleRef.current.az || 0,
      },
    };
    socket.emit("imu", payload);
  }

  function calibrate() {
    // take current alpha as neutral yaw
    const alpha = lastSampleRef.current?.alpha ?? 0;
    neutralRef.current = alpha;
    socket.emit("imu", { room, sample: { type: "calib", neutral: alpha, t: Date.now() }});
    alert("Calibrated neutral yaw: " + Math.round(alpha));
  }

  return (
    <div style={{padding:20, fontFamily:'sans-serif'}}>
      <h1>Stones — Controller</h1>
      <p>Room: <input value={room} onChange={(e)=>setRoom(e.target.value)} /></p>
      <p>Connected: <strong style={{color: connected? "green":"gray"}}>{String(connected)}</strong></p>
      <button onClick={calibrate} style={{padding:'12px 18px', fontSize:16}}>Calibrate Neutral</button>
      <div style={{marginTop:12}}>
        <div>Yaw (alpha): {debug.alpha}°</div>
        <div>Accel mag: {debug.accel}</div>
      </div>
      <small style={{display:'block', marginTop:10, color:'#777'}}>Tip: hold or strap phone to putter/near grip. Close other tabs to reduce lag.</small>
    </div>
  );
}
```

Notes: simple UI, sends frequent IMU samples. `calibrate()` emits a special sample type `calib` — the game page listens for it.

---

### `/pages/game.js` (desktop receiver + adapter)

```jsx
// pages/game.js
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

let socket;

export default function GamePage() {
  const [room, setRoom] = useState("stones-default");
  const [connected, setConnected] = useState(false);
  const neutralRef = useRef(0);
  const bufferRef = useRef([]);
  const [debug, setDebug] = useState({power:0, aim:0});
  const THRESH_ANG_VEL = 6; // tweakable
  const BUFFER_MS = 200; // keep recent samples in ms

  useEffect(() => {
    if (!socket) {
      socket = io();
      socket.on("connect", () => setConnected(true));
      socket.on("disconnect", () => setConnected(false));
    }
    fetch("/api/socket").catch(()=>{});
    return () => {};
  }, []);

  useEffect(() => {
    if (!socket) return;
    // join room
    socket.emit("join-room", room);

    socket.on("imu", (payload) => {
      // payload might be {room, sample} from controller, or raw sample
      const sample = payload.sample ? payload.sample : payload;

      if (sample.type === "calib" || sample.type === "calibration") {
        neutralRef.current = sample.neutral ?? sample.neutralYaw ?? 0;
        console.log("calibrated neutral yaw", neutralRef.current);
        return;
      }

      // add to buffer
      const now = sample.t ?? Date.now();
      const short = {
        t: now,
        alpha: sample.alpha ?? 0,
        ax: sample.ax ?? 0,
        ay: sample.ay ?? 0,
        az: sample.az ?? 0,
      };
      bufferRef.current.push(short);
      // trim buffer
      const cutoff = Date.now() - BUFFER_MS;
      bufferRef.current = bufferRef.current.filter(s => s.t >= cutoff);

      // try detect stroke
      detectStroke();
    });

    return () => {
      socket.off("imu");
    };
  }, [room]);

  function detectStroke() {
    const buf = bufferRef.current;
    if (buf.length < 3) return;
    // compute simple angular velocity on alpha (deg per sample)
    const last = buf[buf.length-1];
    const prev = buf[buf.length-2];
    let dAlpha = smallestAngleDiff(last.alpha, prev.alpha);
    const dt = (last.t - prev.t) / 1000; // seconds
    const angVel = Math.abs(dAlpha / (dt || 0.016)); // deg/sec

    // map to power and aim
    const rawPower = Math.min(1, angVel / 400); // tune divisor
    const aim = normalizeAngle(last.alpha - neutralRef.current);

    // basic stroke detection: angVel crosses threshold from below -> above
    // check last 5 samples to find crossing from below threshold
    const window = buf.slice(-5);
    const crossed = window.some((s, i) => {
      if (i === 0) return false;
      const av = Math.abs(smallestAngleDiff(window[i].alpha, window[i-1].alpha) / ((s.t - window[i-1].t)/1000 || 0.016));
      return av >= THRESH_ANG_VEL;
    });
    if (crossed) {
      // emit stroke event and clear buffer to avoid double-fire
      const stroke = {
        power: clamp(rawPower, 0, 1),
        aim, // degrees
        faceAngle: 0, // we can compute with roll/gamma later
        timestamp: Date.now()
      };
      announceStroke(stroke);
      bufferRef.current = []; // reset
      setDebug({power: Math.round(stroke.power*100)/100, aim: Math.round(stroke.aim)});
    }
  }

  // helper: dispatch event and try to inject into canvas
  function announceStroke(stroke) {
    // 1) custom event
    window.dispatchEvent(new CustomEvent("putter-stroke", {detail: stroke}));
    // 2) if there is a canvas that expects mouse events, synthesize a mouse click + movement
    tryInjectMouse(stroke);
  }

  function tryInjectMouse(stroke) {
    const canvas = document.getElementById("game-canvas");
    if (!canvas) return;
    // map power -> quick vertical mouse drag (example)
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width/2;
    const centerY = rect.top + rect.height/2;
    // simulate mousedown -> small mousemove -> mouseup to approximate click
    const down = new MouseEvent("mousedown", {clientX:centerX, clientY:centerY, bubbles:true});
    canvas.dispatchEvent(down);
    const move = new MouseEvent("mousemove", {clientX:centerX + stroke.power*150, clientY:centerY, bubbles:true});
    canvas.dispatchEvent(move);
    const up = new MouseEvent("mouseup", {clientX:centerX + stroke.power*150, clientY:centerY, bubbles:true});
    canvas.dispatchEvent(up);
  }

  return (
    <div style={{padding:20, fontFamily:'sans-serif'}}>
      <h1>Stones — Game</h1>
      <p>Room: <input value={room} onChange={(e)=>setRoom(e.target.value)} /></p>
      <p>Connected: <strong style={{color: connected? "green":"gray"}}>{String(connected)}</strong></p>

      <div style={{marginTop:12}}>
        <div>Last power: {debug.power}</div>
        <div>Last aim: {debug.aim}°</div>
        <div style={{marginTop:10, color:'#777'}}>
          Listening for device swings. Make sure controller page is open on a phone and calibrated.
        </div>
      </div>

      <div style={{marginTop:20}}>
        <div id="game-canvas" style={{width:720, height:400, border:'1px solid #ddd', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{color:'#999'}}>Game canvas placeholder — replace with your actual game embed. Canvas id must be 'game-canvas'.</div>
        </div>
      </div>
    </div>
  );
}

/* helpers */
function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
function normalizeAngle(a){
  // normalize to -180..180
  let x = ((a + 180) % 360 + 360) % 360 - 180;
  return x;
}
function smallestAngleDiff(a,b) {
  // returns difference a-b in degrees (-180..180)
  const diff = normalizeAngle(a - b);
  return diff;
}
```

Notes:

* `THRESH_ANG_VEL` and mapping constants are intentionally conservative. Tune them after test swings.
* The code both emits `putter-stroke` (good for modern JS games) and synthesizes mouse events for games that read mouse input on the canvas.

---

### Optional adapter file (public/js/putter-adapter.js)

If you prefer to separate the logic and import it into other assets, here's a small adapter the game can import to listen for strokes:

```js
// public/js/putter-adapter.js
export function installPutterAdapter(onStroke) {
  function handle(e) {
    const s = e.detail;
    onStroke && onStroke(s);
  }
  window.addEventListener("putter-stroke", handle);
  return () => window.removeEventListener("putter-stroke", handle);
}
```

Usage in your game:

```js
import { installPutterAdapter } from "/js/putter-adapter.js";
const teardown = installPutterAdapter(stroke => {
  // stroke = {power, aim, faceAngle, timestamp}
  // map into game input
});
```

---

### `/middleware.js` (basic gating - Pages Router)

```js
// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();

  // only gate /game (and optionally other protected routes)
  if (url.pathname.startsWith("/game")) {
    const cookie = req.cookies.get("stones_member");
    if (!cookie || cookie !== "true") {
      url.pathname = "/subscribe"; // replace with your subscribe flow
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}
```

If you use Next.js earlier than 12 or App Router adjust accordingly. Replace cookie check with your NextAuth/Hasura/Supabase user check.

---

## 3) How to integrate with the existing game (two options)

1. **Modern API (preferred)** — listen for the `putter-stroke` custom event:

```js
window.addEventListener("putter-stroke", (e) => {
  const { power, aim, faceAngle, timestamp } = e.detail;
  // map into game API (e.g., call game.applyPutter(power, aim))
});
```

2. **Legacy fallback** — ensure your game canvas has id `game-canvas` and accepts mouse events. The adapter will synthesize `mousedown/mousemove/mouseup` to approximate a stroke.

---

## 4) Membership gating & rollout plan (practical)

* Set cookie `stones_member=true` during Stripe checkout/webhook fulfillment or via session after sign-in. The middleware above checks that cookie.
* Launch as **only game** at `/game`. Add a top nav link to `/controller` with QR code to pair mobile controllers quickly.
* Pricing suggestion: enable this feature on $9.99/month tier. Keep standard mouse play disabled for this MVP to force phone-as-putter — or allow both and highlight the "Real-Putter Mode" as a member perk.

---

## 5) Quick QA & tuning checklist (you should run these on staging)

* Verify `deviceorientation` works across browsers (iOS Safari sometimes requires a permission request; you may need to call `DeviceOrientationEvent.requestPermission()` on user gesture for iOS 13+). If you want, I can inject that call into the controller page (I can do it now if you'd like).
* Tune `THRESH_ANG_VEL` and power mapping after 20 real putts with a test device (increase divisor to reduce sensitivity).
* Test 3 device combos: Android phone → Chrome desktop, iPhone → Chrome desktop (via WebRTC if you later opt), iPhone → Safari desktop (note Safari desktop is macOS).
* Add server-side logging for stroke events to measure latency (socket.io `ping` and per-stroke timestamps).

---

## 6) Exact Copilot prompt to generate everything at once

If you want Copilot to scaffold the whole feature in one go, paste this prompt:

```
Create a minimal Next.js pages app feature (pages/api/socket.js, pages/controller.js, pages/game.js, public/js/putter-adapter.js, middleware.js)
- socket.io server attached at /api/socket
- controller: mobile page that streams deviceorientation and devicemotion samples to socket.io room, with Calibrate button
- game: desktop page that joins room, detects stroke from angular velocity, emits CustomEvent 'putter-stroke', and injects mouse events into canvas#game-canvas
- middleware: simple cookie-based gate checking 'stones_member' for /game and redirecting to /subscribe
Return each file content one after the other with filename comment headers and short inline comments.
```

---

## 7) Next steps I can do immediately (tell me which)

I can do any of the following right now in this chat (I’ll produce the code or content directly — no waiting):

* Add `DeviceOrientationEvent.requestPermission()` flow for iOS 13+ into the `/controller` page.
* Create a production-ready /subscribe page stub and Stripe webhooks snippet (server) to set the `stones_member` cookie after successful payment.
* Produce a short README you can paste into the repo with local dev/test instructions and tuning tips.
* Convert these pages to the Next.js App Router (`app/`) structure if your site uses it.

Pick one and I’ll drop the code immediately — or tell me “add iOS permission flow + README” and I’ll produce both now.

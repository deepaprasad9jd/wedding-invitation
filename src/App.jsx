import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function RealScratchEffect() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#d4a63a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fff7e6";
    ctx.font = "bold 22px Georgia";
    ctx.textAlign = "center";
    ctx.fillText("✦ Scratch to Reveal ✦", canvas.width / 2, canvas.height / 2);
  }, []);

  const scratch = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();
  };
return (
  <div className="scratchCard revealed">
    <div className="realScratchBox">
      <div className="scratchContent">
        <h3>Event Details</h3>

        <div className="scratchItem">
          <strong>💍 Engagement</strong>
          <p>17 July 2026 | 11:30 AM</p>
          <small>VTAM Auditorium, Cherthala</small>
        </div>

        <div className="scratchItem">
          <strong>⛪ Wedding</strong>
          <p>21 July 2026 | 4:30 PM</p>
          <small>Zion AOG Church, Coimbatore</small>
        </div>

        <div className="scratchItem">
          <strong>🎉 Reception</strong>
          <p>21 July 2026 | 7:00 PM onwards</p>
          <small>SRM Hall, Coimbatore</small>
        </div>
      </div>

    <canvas
  ref={canvasRef}
  width="720"
  height="360"
  className="scratchCanvas"
  onMouseMove={(e) => e.buttons === 1 && scratch(e)}
  onTouchMove={scratch}
/>
    </div>
  </div>
);
             
}

export default function App() {
  const audioRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const [rsvps, setRsvps] = useState(() => {
    return JSON.parse(localStorage.getItem("rsvps")) || [];
  });

  const [rsvpForm, setRsvpForm] = useState({
    name: "",
    email: "",
    attending: "",
    message: "",
  });

  useEffect(() => {
    const weddingDate = new Date("2026-07-21T16:30:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = weddingDate - now;

      if (diff <= 0) return;

      setCountdown({
        days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, "0"),
        hours: String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
        minutes: String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0"),
        seconds: String(Math.floor((diff / 1000) % 60)).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const openInvitation = async () => {
    setIsOpen(true);
    try {
      await audioRef.current.play();
    } catch {}
  };

  const handleRsvpSubmit = (e) => {
    e.preventDefault();

    const newEntry = {
      ...rsvpForm,
      date: new Date().toLocaleString(),
    };

    const updated = [...rsvps, newEntry];
    setRsvps(updated);
    localStorage.setItem("rsvps", JSON.stringify(updated));

    setRsvpForm({
      name: "",
      email: "",
      attending: "",
      message: "",
    });

    alert("Thank you! Your RSVP has been saved.");
  };

  return (
    <div className="website">
      <audio ref={audioRef} loop src="/music.mp3" />

      {!isOpen && (
        <div className="envelopeCover" onClick={openInvitation}>
          <div className="envelope">
            <div className="flap"></div>
            <div className="seal">
              <h2>D & J</h2>
              <p>Tap to Open</p>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <>
          <div className="goldGlow glowOne"></div>
          <div className="goldGlow glowTwo"></div>

          <section className="hero">
            <div className="heroCard">
              <p className="verse">
                The Lord has made everything beautiful in His time
              </p>

              <h1>
                Divya <span>&</span> Joel
              </h1>

              <div className="heart">♥</div>

              <p className="intro">
                With hearts filled with joy and gratitude, we invite you to celebrate our engagement and wedding.
              </p>
            </div>
          </section>

          <section className="countdownSection">
            <h2 className="scriptTitle">Counting Down to Forever</h2>
            <div className="smallDivider">♥</div>

            <div className="countdownGrid">
              <div className="countBox"><strong>{countdown.days}</strong><span>DAYS</span></div>
              <div className="countBox"><strong>{countdown.hours}</strong><span>HOURS</span></div>
              <div className="countBox"><strong>{countdown.minutes}</strong><span>MINUTES</span></div>
              <div className="countBox"><strong>{countdown.seconds}</strong><span>SECONDS</span></div>
            </div>
          </section>

          <section className="scratchSection">
            <h2 className="scriptTitle">Scratch to Reveal</h2>
            <div className="smallDivider">♥</div>
            <RealScratchEffect />
          </section>

          <section className="venueSection">
            <h2 className="scriptTitle">Venue</h2>
            <div className="smallDivider">♥</div>

            <div className="venueCard">
              <h3>Engagement</h3>
              <p>VTAM Auditorium, Cherthala</p>
              <a href="https://maps.app.goo.gl/kTQfHZRyciJnhG4eA?g_st=ac" target="_blank" rel="noreferrer">
                View Map
              </a>
            </div>
          </section>

          <section className="messageSection">
            <h2 className="scriptTitle">Send a Message</h2>

            <form className="messageForm" onSubmit={handleRsvpSubmit}>
              <input
                placeholder="Your Name"
                value={rsvpForm.name}
                onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                required
              />

              <input
                placeholder="Email"
                type="email"
                value={rsvpForm.email}
                onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
              />

              <select
                value={rsvpForm.attending}
                onChange={(e) => setRsvpForm({ ...rsvpForm, attending: e.target.value })}
                required
              >
                <option value="">Will you attend?</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>

              <textarea
                placeholder="Write your wishes..."
                value={rsvpForm.message}
                onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
              ></textarea>

              <button type="submit">Send Message</button>
            </form>
          </section>

          <section className="dashboardSection">
            <h2 className="scriptTitle">RSVP Dashboard</h2>

            <div className="dashboardCards">
              <div><strong>{rsvps.length}</strong><span>Total RSVP</span></div>
              <div><strong>{rsvps.filter((x) => x.attending === "Yes").length}</strong><span>Coming</span></div>
              <div><strong>{rsvps.filter((x) => x.attending === "No").length}</strong><span>Not Coming</span></div>
            </div>

            <div className="rsvpTable">
              {rsvps.map((item, index) => (
                <div className="rsvpRow" key={index}>
                  <b>{item.name}</b>
                  <span>{item.attending}</span>
                  <p>{item.message || "No message"}</p>
                  <small>{item.date}</small>
                </div>
              ))}
            </div>
          </section>

          <footer>
            <h3>We can’t wait to celebrate with you!</h3>
          </footer>
        </>
      )}
    </div>
  );
}

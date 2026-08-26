import { useEffect, useRef, useState } from "react";
import "./Contact.css";

// Set in .env.local for local dev (see .env.example) and as repo secrets for
// the GitHub Actions build (see .github/workflows/deploy.yml). Neither value
// is actually sensitive — both ship in the public JS bundle either way — this
// just keeps them out of the readable source in the repo.
const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || "";
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";
const recaptchaConfigured = Boolean(RECAPTCHA_SITE_KEY);

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const gotchaRef = useRef(null);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  // Loads the reCAPTCHA v3 script once, up front, so a token is ready by the
  // time the visitor submits. v3 is invisible — no checkbox, no widget — it
  // just scores the interaction; Google's little badge shows the disclosure,
  // hidden here in favor of the text note near the submit button below.
  useEffect(() => {
    if (!recaptchaConfigured || window.grecaptcha) return;
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  async function getRecaptchaToken() {
    if (!recaptchaConfigured || !window.grecaptcha) return null;
    await new Promise((resolve) => window.grecaptcha.ready(resolve));
    return window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "contact" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    try {
      const captchaToken = await getRecaptchaToken();

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          // Honeypot: hidden from real visitors, so a filled value means a bot.
          // Formspree silently discards submissions where `_gotcha` is non-empty.
          _gotcha: gotchaRef.current?.value || "",
          ...(captchaToken ? { "g-recaptcha-response": captchaToken } : {}),
        }),
      });

      if (res.ok) {
        setStatus("sent");
        setForm(initialForm);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="section contact-page">
      <div className="container contact-inner">
        <div className="contact-intro">
          <span className="eyebrow">Contact</span>
          <h1>Let's build something.</h1>
          <p>
            Have a project, a role, or just a question? Send a message and I'll
            reply within a day or two.
          </p>

          <div className="contact-info">
            <div>
              <span className="contact-info-label">Email</span>
              <a href="mailto:batedesigns@gmail.com">batedesigns@gmail.com</a>
            </div>
            <div>
              <span className="contact-info-label">Elsewhere</span>
              <div className="contact-info-links">
                <a
                  href="https://github.com/nzivo"
                  target="_blank"
                  rel="noreferrer"
                >
                  Github
                </a>
                <a
                  href="https://twitter.com/johnnnzivo"
                  target="_blank"
                  rel="noreferrer"
                >
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </div>

        <form className="contact-form card" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={update("name")}
            />
          </div>

          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={update("email")}
            />
          </div>

          <div className="form-row">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              required
              value={form.subject}
              onChange={update("subject")}
            />
          </div>

          <div className="form-row">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows={5}
              required
              value={form.message}
              onChange={update("message")}
            />
          </div>

          {/* Honeypot — invisible to real visitors, tabbed past, never auto-filled. */}
          <div className="hp-field" aria-hidden="true">
            <label htmlFor="company">Company</label>
            <input id="company" type="text" tabIndex={-1} autoComplete="off" ref={gotchaRef} />
          </div>

          <button
            type="submit"
            className="btn btn-primary contact-submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending…" : "Send message"}
          </button>

          {recaptchaConfigured && (
            <p className="recaptcha-disclosure">
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">
                Terms of Service
              </a>{" "}
              apply.
            </p>
          )}

          {status === "sent" && (
            <p className="contact-status contact-status-ok">
              Thanks — your message is on its way.
            </p>
          )}
          {status === "error" && (
            <p className="contact-status contact-status-error">
              Something went wrong. Try again, or email me directly.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";
import "./Contact.css";

// TODO: replace with your real Formspree form ID (create one free at https://formspree.io)
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
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

          <button
            type="submit"
            className="btn btn-primary contact-submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending…" : "Send message"}
          </button>

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

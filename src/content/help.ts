/** Quick answers shown in the Help panel. Edit freely; answers are plain text. */
export type Faq = { q: string; a: string };

export const RESPONSE_TIME = "We usually reply within 2 working days.";

export const FAQS: Faq[] = [
  {
    q: "Is the course free?",
    a: "Yes. Every lesson, exercise and quiz is free. Some weeks use AI tools that have their own costs, covered below.",
  },
  {
    q: "Do I need an account or a password?",
    a: "No. You give your name and email once, and pick a secret question. Your progress is saved in your browser and backed up online. There's no password to remember.",
  },
  {
    q: "How do I continue on another device?",
    a: "Open the site on the new device and enter the same email. You'll be asked your secret question, and your progress loads straight away. You can also use \"Download my progress\" in the account menu and import the file on the other device.",
  },
  {
    q: "I forgot my secret answer. What now?",
    a: "Send us a message from the email you signed up with. We can't see your answer, but we can reset your backup so you can set a new question. Progress saved in your current browser isn't affected, and it's added to your account when you set the new question.",
  },
  {
    q: "How much time does it take each week?",
    a: "About 10–12 hours: concepts early in the week, building midweek, then a short review and write-up. Go slower if you need to; your progress waits for you.",
  },
  {
    q: "Do I need to pay for AI tools?",
    a: "Free tiers cover most of Month 1. From Week 3, coding agents such as Claude Code or Codex need a paid plan or API credits. Running open models locally (Week 10) is free if your computer can handle it.",
  },
  {
    q: "When are new lessons released?",
    a: "We add lessons regularly. Weeks without lessons yet still have their build and tasks ready. Tick \"Email me course updates\" when you sign up to hear when new lessons go live.",
  },
  {
    q: "How do I stop the update emails?",
    a: "Send us a message from the same email address asking to unsubscribe, and we'll take you off the list.",
  },
  {
    q: "What do you do with my details?",
    a: "Your name and email are used to save your progress and, if you agree, to send course updates and reminders. We never share them. Your secret answer is stored scrambled, so nobody can read it.",
  },
  {
    q: "A video won't play.",
    a: "Videos are hosted on YouTube. If one won't load, open the link under the player to watch it on YouTube directly, or check whether your network blocks YouTube.",
  },
];

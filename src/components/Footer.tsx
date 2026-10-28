import { useStore } from "../lib/store";

export function Footer() {
  const { profile, resetProgress } = useStore();
  return (
    <footer>
      <div className="wrap">
        <div className="foot-main">
          <span>Delegate — learn to work with AI. {profile?.token ? "Your progress is saved in this browser and backed up online." : "Your progress is saved in this browser."}</span>
          <span className="foot-by">A product of <a href="https://isuxtech.com" target="_blank" rel="noopener">ISUX Technologies</a> · © {new Date().getFullYear()}</span>
        </div>
        <button type="button" onClick={() => { if (confirm("Clear all lesson and task progress?")) resetProgress(); }}>Reset my progress</button>
      </div>
    </footer>
  );
}

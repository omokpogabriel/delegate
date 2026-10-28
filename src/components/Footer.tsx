import { useStore } from "../lib/store";

export function Footer() {
  const { profile, resetProgress } = useStore();
  return (
    <footer>
      <div className="wrap">
        <span>Delegate — learn to work with AI. {profile?.token ? "Your progress is saved in this browser and backed up online." : "Your progress is saved in this browser."}</span>
        <button type="button" onClick={() => { if (confirm("Clear all lesson and task progress?")) resetProgress(); }}>Reset my progress</button>
      </div>
    </footer>
  );
}

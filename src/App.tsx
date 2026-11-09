import { Navigate, Route, Routes } from "react-router-dom";
import { Nav } from "./components/Nav";
import { ScrollManager } from "./components/ScrollManager";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { LessonPage } from "./pages/Lesson";
import { Welcome } from "./components/Welcome";
import { Help } from "./components/Help";
import { FeedbackButton } from "./components/Feedback";
import { FeedbackPage } from "./pages/FeedbackPage";

export function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <ScrollManager />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/engineer" element={<Home />} />
          <Route path="/engineer/lesson/:id" element={<LessonPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <Welcome />
      <Help />
      <FeedbackButton />
    </>
  );
}

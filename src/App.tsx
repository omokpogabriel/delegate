import { Navigate, Route, Routes } from "react-router-dom";
import { Nav } from "./components/Nav";
import { ScrollManager } from "./components/ScrollManager";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { LessonPage } from "./pages/Lesson";
import { Welcome } from "./components/Welcome";

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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <Welcome />
    </>
  );
}

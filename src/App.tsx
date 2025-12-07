import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useTheme } from '@/hooks/useTheme';
import HomePage from "@/pages/HomePage";
import ResultPage from "@/pages/ResultPage";

export default function App() {
  useTheme()
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

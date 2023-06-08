import ReactDOM from "react-dom/client";
import './index.css';
import App from "./views/main_window";

export const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
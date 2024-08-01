import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./components/App"; 
import "./styles/index.css"; 
import reportWebVitals from "./reportWebVitals"; 

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <Router> {/* Router should only be here */}
      <App />
    </Router>
  </React.StrictMode>
);


reportWebVitals();

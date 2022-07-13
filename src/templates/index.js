import { StrictMode } from "react";
import { render } from "react-dom";

function App() {
  return (
    <div>
      <h1>Hello from React</h1>
    </div>
  );
}

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);

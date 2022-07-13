import { FC } from "react";

const App: FC = () => {
  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      <img src="/logo.png" width={192} height={192} />
      <h1>Hello from React</h1>
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
    </div>
  );
};

export default App;

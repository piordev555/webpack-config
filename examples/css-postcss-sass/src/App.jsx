import "./assets/style.css";
import styles from "./assets/style.module.css";
import "./assets/style.scss";

export default function App() {
  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      <img src="/logo.png" width={192} height={192} />
      <h1>Hello from React</h1>
      <p className="css">Styled with CSS</p>
      <p className="sass">Styled with SASS</p>
      <p className={styles.module}>Styled with CSS Modules</p>
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
    </div>
  );
}

import Game from "@/components/Game";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Sudoku</h1>
      <Game />
    </main>
  );
}
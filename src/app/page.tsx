import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1 className={styles.heading}>Food Delivery Platform</h1>
        <Link href="/campaigns">
          <h2 className={styles.link}>
            Go to Campaigns <span>-&gt;</span>
          </h2>
        </Link>
      </div>
    </main>
  );
}

import Link from "next/link";
import css from "./SidebarNotes.module.css";

const tags = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function SidebarNotes() {
  return (
    <nav className={css.sidebar} aria-label="Filter notes by tag">
      <p className={css.sidebarTitle}>Note categories</p>

      <ul className={css.menuList}>
        <li className={css.menuItem}>
          <Link className={css.menuLink} href="/notes/filter/all">
            All notes
          </Link>
        </li>

        {tags.map((tag) => (
          <li className={css.menuItem} key={tag}>
            <Link className={css.menuLink} href={`/notes/filter/${tag}`}>
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

import { useEffect, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import "./menu.scss";

// eslint-disable-next-line complexity

export const Menu = ({ showArticle, hanbdleClose }) => {
  const loading = useSelector((state) => state.books.loading);
  const books = useSelector((state) => state.books.books);
  const error = useSelector((state) => state.books.error);
  const { category } = useParams();

  const categories = useSelector((state) => state.books.categories);
  const [isTogleMenu, setIsTogleMenu] = useState(false);
  const setActive = ({ isActive }) => (isActive ? " active item" : "");
  const { id } = useParams();
  const location = useLocation();
  const bookPath = location.pathname.substring(1, 6);

  useEffect(() => {
    loading || error ? setIsTogleMenu(true) : setIsTogleMenu(false);
  }, [loading]);

  useEffect(
    () =>
      bookPath !== "books" || id ? setIsTogleMenu(true) : setIsTogleMenu(false),
    [bookPath]
  );

  return (
    <article className="show-article">
      <nav className="menu-wraper">
        <div className="category-container">
          <div>
            <h5
              role="presentation"
              onClick={() => setIsTogleMenu(!isTogleMenu)}
              className={bookPath === "books" ? "category active" : "category"}
              data-test-id={
                showArticle ? "burger-showcase" : "navigation-showcase"
              }
            >
              Витрина книг
              <div
                className={isTogleMenu ? "categoy-icon" : "categoy-icon toggle"}
              />
            </h5>
          </div>
        </div>

        <ul className={isTogleMenu ? "navigation disabled" : "navigation"}>
          {categories.map((item, i) => {
            return i === 0 ? (
              <li className="first-li" key={i}>
                <NavLink
                  to="/books/all"
                  className={setActive}
                  data-test-id={
                    showArticle ? "burger-books" : "navigation-books"
                  }
                  onClick={showArticle ? hanbdleClose : null}
                >
                  Все книги
                </NavLink>
              </li>
            ) : (
              <li key={item.path}>
                <NavLink
                  className={setActive}
                  to={`/books/${item.path}`}
                  onClick={showArticle ? hanbdleClose : null}
                  data-test-id={`${showArticle ? "burger" : "navigation"}-${
                    item.path
                  }`}
                >
                  {item.name}
                </NavLink>
                <span
                  data-test-id={`${
                    showArticle ? "burger" : "navigation"
                  }-book-count-for-${item.path}`}
                >
                  {books.filter((i) => i.categories.includes(item.name)).length}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="terms-deal-container">
          <NavLink
            className={setActive}
            to="/rules"
            activeclassname="active item"
            data-test-id={showArticle ? "burger-terms" : "navigation-terms"}
          >
            <button type="button" className="terms item" onClick={hanbdleClose}>
              Правила пользования
            </button>
          </NavLink>
          <NavLink
            className={setActive}
            to="/contract"
            activeclassname="active item"
            data-test-id={
              showArticle ? "burger-contract" : "navigation-contract"
            }
          >
            <button className="terms item" onClick={hanbdleClose} type="button">
              Договор оферты
            </button>
          </NavLink>
        </div>
      </nav>
    </article>
  );
};

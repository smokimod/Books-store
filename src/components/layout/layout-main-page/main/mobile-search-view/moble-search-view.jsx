import crossIcon from "../../../../../icons/creset_icon.svg";

import "../main-page.scss";
import "./moble-search-view.scss";

export const MobileSearchView = ({
  showSeacthBar,
  toggleShowBar,
  setSearchParam,
  searchParam,
}) => {
  return (
    <div
      className={
        showSeacthBar
          ? "search-input-container"
          : "search-input-container disabled"
      }
    >
      <input
        className="search-input"
        placeholder="Поиск книги или автора..."
        type="text"
        data-test-id="input-search"
        value={searchParam}
        onChange={(e) => setSearchParam(e.target.value)}
      />
    </div>
  );
};

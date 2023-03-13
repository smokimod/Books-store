import "./button.scss";

export const Button = ({ children }) => {
  return (
    <button type="submit" className={"reg-next-moveBtn"}>
      {children}
    </button>
  );
};

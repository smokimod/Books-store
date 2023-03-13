import "./loader.scss";

export const Loader = ({ disabled }) => {
  return (
    <div className={`loader-container ${disabled}`} data-test-id='loader'>
      <div className="loader"></div>
    </div>
  );
};

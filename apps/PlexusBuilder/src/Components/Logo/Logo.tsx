import "./Logo.css";
import lgoSVG from "./logo.svg";
export function Logo() {
  return (
    <div className="logo">
      <img className="logo-image" src={lgoSVG} />
    </div>
  );
}

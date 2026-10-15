// A laptop built from CSS 3D shapes that slowly swings left and right. No images or libraries, so it loads instantly.
export default function Laptop3D({ className = '' }) {
  return <div aria-hidden="true" className={`l3d ${className}`}><div className="l3d-s">
    <div className="l3d-base"><i /></div>
    <div className="l3d-lid"><div className="l3d-screen"><b>LapNest</b><span /></div><div className="l3d-back" /></div></div><div className="l3d-shadow" /></div>;
}
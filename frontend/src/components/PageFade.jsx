import { useEffect } from 'react'; import { useLocation } from 'react-router-dom';
// Fades each new page in and jumps to the top when you move between pages (smooth scrolling stays for in-page scrolling).
export default function PageFade({ children }) {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return <div key={pathname} className="page-in">{children}</div>;
}
// Novo arquivo opcional: src/utils/useModalClose.js
import { useEffect } from "react";

export function useModalClose(ref, onClose) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    function handleClick(e) {
      if (ref.current && e.target === ref.current) onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose, ref]);
}

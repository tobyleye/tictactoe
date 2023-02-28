import { useSpring, animated } from "@react-spring/web";
import { MouseEvent, ReactNode, useRef } from "react";
import { createPortal } from "react-dom";

export function Modal({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  const [spring, api] = useSpring(() => ({
    from: {
      scale: 0.9,
      opacity: 0,
    },
    to: {
      scale: 1,
      opacity: 1,
    },

    reset: true,
  }));

  const modalBodyRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (evt: MouseEvent) => {
    const target = evt.target as Node;
    if (!modalBodyRef.current?.contains(target)) {
      api.start({
        from: {
          scale: 1.05,
        },
        to: {
          scale: 1,
        },
      });
    }
  };

  if (!open) return <></>;

  return createPortal(
    <div
      className="fixed top-0 left-0 w-full h-full grid place-items-center px-4 text-gray-200"
      style={{
        background: "rgba(0,0,0,.44)",
      }}
      onClick={handleOverlayClick}
    >
      <animated.div
        ref={modalBodyRef}
        className="max-w-md w-full bg-gray-900 text-center py-10 px-6 rounded-lg"
        style={spring}
      >
        {children}
      </animated.div>
    </div>,
    document.body
  );
}

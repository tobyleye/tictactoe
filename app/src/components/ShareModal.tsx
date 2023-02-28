import { useSpring, animated } from "@react-spring/web";
import { CopyButton } from "./CopyButton";
import { MouseEvent, useRef } from "react";

export function ShareModal({ open }: { open: boolean }) {
  const [spring, api] = useSpring(() => ({
    from: {
      scale: 0.8,
      opacity: 0,
    },
    to: {
      scale: 1,
      opacity: 1,
    },
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

  return (
    <div
      className="fixed top-0 left-0 w-full h-full grid place-items-center px-4"
      style={{
        background: "rgba(0,0,0,.44)",
      }}
      onClick={handleOverlayClick}
    >
      <animated.div
        ref={modalBodyRef}
        className="max-w-md bg-gray-900 text-center py-10 px-6 rounded-lg"
        style={spring}
      >
        <div className="text-gray-300 mb-4">
          <p className="mb-2">Invite your friends to join you</p>
          <p>The game will auto start when they join.</p>
        </div>
        <div>
          <div className="mb-3">
            <CopyButton text={location.href} />
          </div>
          <button className="btn border border-gray-300 px-4 py-1 rounded-md">
            Share
          </button>
        </div>
      </animated.div>
    </div>
  );
}

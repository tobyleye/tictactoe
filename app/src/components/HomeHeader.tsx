import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/components/AuthProvider";
import { useSpring, animated } from "@react-spring/web";
import { BiChevronDown } from "react-icons/bi";

function Avatar({ avatar, name }: { avatar: string; name: string }) {
  let initials = name
    .split(/\s/g)
    .map((each) => each[0])
    .slice(0, 2)
    .join("");

  console.log({ initials });
  return (
    <div
      className="w-10 h-10 rounded-full bg-gray-200  bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: `url(${avatar})`,
      }}
    >
      <div className="w-full h-full grid place-items-center">
        <span className="text-gray-800 text-xl">{initials}</span>
      </div>
    </div>
  );
}

function UserMenu({ user }: { user: any }) {
  const [showMenu, setShowMenu] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { signOut } = useContext(AuthContext);

  const spring = useSpring({
    from: {
      y: 10,
      opacity: 0,
    },
    to: showMenu
      ? {
          y: 0,
          opacity: 1,
        }
      : {},
    reset: true,
  });

  useEffect(() => {
    const closeMenuIfOpened = (evt: MouseEvent) => {
      const target = evt.target as Node;
      if (showMenu && !triggerRef.current?.contains(target)) {
        setShowMenu(false);
      }
    };

    window.addEventListener("click", closeMenuIfOpened);

    return () => {
      window.removeEventListener("click", closeMenuIfOpened);
    };
  }, [showMenu]);

  const toggleMenu = () => setShowMenu((show) => !show);
  return (
    <div className="relative">
      <button ref={triggerRef} onClick={toggleMenu}>
        <div className="flex items-end">
          <Avatar avatar={user.avatar} name={user.name} />
          <BiChevronDown className="text-2xl ml-1" />
        </div>
      </button>
      {showMenu && (
        <animated.div
          style={spring}
          className="absolute top-[120%] -left-[100px] bg-white text-gray-800 rounded-lg px-2 py-2"
        >
          <div>
            <button
              disabled
              className="py-2 px-2 hover:bg-gray-200 rounded-md w-full text-left capitalize"
            >
              <div className="flex items-center gap-1">
                Profile{" "}
                <span className="text-xs bg-red-100 text-red-300 inline-block p-1 rounded-md whitespace-nowrap">
                  coming soon
                </span>
              </div>
            </button>
          </div>

          <div>
            <button
              onClick={signOut}
              className="py-2 px-2 hover:bg-gray-200 rounded-md w-full text-left capitalize"
            >
              Logout
            </button>
          </div>
        </animated.div>
      )}
    </div>
  );
}

export function Header() {
  const { user, signIn } = useContext(AuthContext);
  console.log({ user });
  if (!user) return null;
  return (
    <header className="absolute top-0 left-0 right-0">
      <div className="flex justify-end mb-4 py-4 w-10/12 mx-auto">
        {user === "guest" ? (
          <button onClick={signIn}>Login</button>
        ) : (
          <UserMenu user={user} />
        )}
      </div>
    </header>
  );
}

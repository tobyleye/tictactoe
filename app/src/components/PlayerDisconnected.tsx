import { Player } from "@/types";
import { Modal } from "./Modal";
import Link from "next/link";

export function PlayerDisconnected({
  info,
}: {
  info: null | { player: Player | null; reason: string };
}) {
  if (!info) {
    return null;
  }

  return (
    <Modal open={true}>
      <div>
        <div className="mb-2 text-4xl">😞</div>
        {info.player ? (
          <p>
            Oops, Player <span className="capitalize">{info.player.mark}</span>{" "}
            disconnected!
          </p>
        ) : (
          <p>Ooops, You disconnected!</p>
        )}
        <div className="mt-4">
          <Link href="/" className="button">
            restart
          </Link>
        </div>
      </div>
    </Modal>
  );
}

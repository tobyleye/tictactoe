import Room from "@/components/Room";
import { useRouter } from "next/router";

export default function Play() {
  const { query } = useRouter();
  const roomId = query.roomId as string;

  return <Room id={roomId} />;
}

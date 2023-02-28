import { SERVER_BASE_URL } from "@/config";

export const signIn = async (user: any) => {
  const body = JSON.stringify({ user });
  const response = await fetch(`${SERVER_BASE_URL}/signin`, {
    method: "post",
    body: body,
    headers: {
      "content-type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};

export const getLeaderboard = async () => {
  const resp = await fetch(`${SERVER_BASE_URL}/leaderboard`);
  if (!resp.ok) {
    throw new Error(`fetch error ${resp.status}`);
  }
  const data = await resp.json();
  return data;
};

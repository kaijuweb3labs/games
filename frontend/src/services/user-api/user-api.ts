import { BASE_API_URL } from "@/config";
import { UserDetails } from "@/types/user";

export const getUserDetailsByAddress = async (
  addr: string,
  headers: Headers
): Promise<UserDetails | null | undefined> => {
  return fetch(`${BASE_API_URL}user/importWalletDetails?publicKey=${addr}`, {
    headers,
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw new Error("No user");
      }
    })
    .then((res) => res.data)
    .catch((e) => {
      console.log(e);
      return null;
    });
};

export const addUserDetails = async (
  user: Partial<UserDetails>,
  headers: Headers
): Promise<UserDetails | null | undefined> => {
  return fetch(`${BASE_API_URL}user/addUser`, {
    method: "POST",
    body: JSON.stringify(user),
    headers,
  })
    .then((res) => res.json())
    .then((res) => res.data)
    .catch((e) => {
      console.error(e);
      return null;
    });
};

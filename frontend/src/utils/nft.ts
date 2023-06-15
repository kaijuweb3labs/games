import { BASE_API_URL, NFT_CONTRACT_ADDRESS } from "@/config";

export const getNftsByOwner = (address: string, limit = 9) => {
  return fetch(
    `${BASE_API_URL}getNftsByOwner?network=polygon-mumbai&pageKey=&pubKey=${address}&contractAddress=${NFT_CONTRACT_ADDRESS}`
  )
    .then((res) => res.json())
    .then((resJson) => {
      console.log(resJson);
      return {
        totalCount: resJson.data.totalCount,
        ownedNfts: resJson.data.ownedNfts.slice(-limit),
      };
    });
};

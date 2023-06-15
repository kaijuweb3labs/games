import { COLLECTION_ID, BASE_API_URL } from "@/config";

export const createGameSession = async (
  userID: string,
  displayName: string,
  picture: string,
  headers: Headers
) => {
  return fetch(`${BASE_API_URL}game/createGame`, {
    method: "POST",
    body: JSON.stringify({
      userID: userID,
      profileName: displayName,
      profilePicture: picture,
      collectionID: COLLECTION_ID,
    }),
    headers: headers,
  })
    .then(async (res) => {
      return res.json();
    })
    .then((v) => {
      console.log("Create Game..................", v);
      // Run the Game and Get the Game Data
      return v.data;
    })
    .catch((e) => console.log(e));
};

export const getLeaderBoardAPI = async (
  gameIds: { gameID: string; score: number }[]
) => {
  const filteredGameIds = [];
  gameIds.forEach((g) => {
    if (g.gameID.length > 5) {
      filteredGameIds.push({ gameId: g.gameID, score: g.score });
    }
  });
  return fetch(`${BASE_API_URL}game/getLeaderBoard`, {
    method: "POST",
    body: JSON.stringify(filteredGameIds),
  })
    .then((v) => v.json())
    .then((v) => {
      if (v.data[0]) {
        return v.data
          .map((game: any, ind: number) => ({
            ...game,
            score: filteredGameIds[ind].score,
          }))
          .reverse();
      }
    })
    .catch((e) => {
      console.log(e);
      return null;
    });
};

export const getPersonalBestScore = async (
  userId: string,
  headers: Headers
) => {
  return fetch(`${BASE_API_URL}game/getPersonalBestScore/${userId}`, {
    headers,
  })
    .then((res) => res.json())
    .then((v) => v.data["personal-best"])
    .catch((e) => console.log(e));
};

export const updateGame = async (
  {
    gameID,
    transactionHash,
    FEScore,
    contractScore,
    isValid,
  }: {
    gameID: string;
    transactionHash: string;
    FEScore: number;
    contractScore: number;
    isValid: boolean;
  },
  headers: Headers
) => {
  console.log("Update game called............", gameID, FEScore, contractScore);
  return fetch(`${BASE_API_URL}game/updateGame/${gameID}`, {
    method: "POST",
    body: JSON.stringify({
      transactionHash,
      FEScore,
      contractScore,
      isValid,
    }),
    headers,
  })
    .then(async (res) => {
      return res.json();
    })
    .then((v) => {
      console.log("Update game...........................", v);
      return v.data;
    })
    .catch((e) => console.log(e));
};

export const getNftMetadataUrl = async (
  {
    score,
    gameId,
  }: {
    score: number;
    gameId: string;
  },
  headers: Headers
) => {
  return fetch(`${BASE_API_URL}game/generateGameScoreNFT`, {
    method: "POST",
    body: JSON.stringify({
      params: {
        score: score,
        gameId: gameId,
      },
    }),
    headers: headers,
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res.result;
    })
    .catch((e) => console.log(e));
};

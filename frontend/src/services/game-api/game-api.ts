import { COLLECTION_ID, BASE_API_URL } from "@/config";
import { GameSessionData } from "@/redux/slices/game";

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
      gameID:"",
      createdTimeStamp: Date.now(),
      FEScore:0,
      contractScore:0,
      isValid: false,
      gameState: "START",
      transactionHash: "",
      gamePositionHistory:[]

    }),
    headers: headers,
  })
    .then(async (res) => {
      return res.json();
    })
    .then((v) => {
      // Run the Game and Get the Game Data
      // console.log("Responce:::::::", v.data)
      return v.data;
    })
    .catch((e) => console.error(e));
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
      console.error(e);
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
    .catch((e) => console.error(e));
};

export const updateGame = async (
  {
    gameID,
    gameSession,
    transactionHash,
    FEScore,
    contractScore,
    isValid,
  }: {
    gameID: string;
    gameSession: GameSessionData;
    transactionHash: string;
    FEScore: number;
    contractScore: number;
    isValid: boolean;
  },
  headers: Headers
) => {
  return fetch(`${BASE_API_URL}game/updateGame/${gameID}`, {
    method: "POST",
    body: JSON.stringify({
    ...gameSession,
    gameState: "GAME_OVER",
    transactionHash:transactionHash,
    FEScore:FEScore,
    contractScore:contractScore,
    isValid:isValid,
    }),
    headers,
  })
    .then(async (res) => {
      return res.json();
    })
    .then((v) => {
      return v.data;
    })
    .catch((e) => console.error(e));
};

export const getNftMetadataUrl = async (
  {
    score,
    gameId,
    date,
    playerName
  }: {
    score: number;
    gameId: string;
    date: string;
    playerName: string;
  },
  headers: Headers
) => {
  return fetch(`${BASE_API_URL}game/generateGameScoreNFT`, {
    method: "POST",
    body: JSON.stringify({
      params: {
        score: score,
        gameId: gameId,
        date: date,
        playerName: playerName
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
    .catch((e) => console.error(e));
};

export const getByteCode = async ({
  gameId,
  FEScore,
  origMovesLength,
  movesPerVar,
  movesEncodedLength,
  movesEncoded

}: {
  gameId: string;
  FEScore: number;
  origMovesLength: number,
  movesPerVar: number,
  movesEncodedLength: number,
  movesEncoded: number[]
},
headers: Headers
) => {
  return fetch ( `${BASE_API_URL}game/byteCodeGeneratorForGame`, {
    method: "POST",
    body: JSON.stringify({
      gameId,
      FEScore,
      origMovesLength,
      movesPerVar,
      movesEncodedLength,
      movesEncoded
    }),
    headers: headers,
  })
  .then((res) => {
    return res.json();
  })
  .then((res) => {
    return res.data;
  })
  .catch((e) => console.error(e));
}

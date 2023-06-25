export const encodeGameMoves = (
    gameMoves: number[]
) => {
    const movesPerVarMax = Math.max(5,Math.floor((gameMoves.length)/8));
    const movesPerVar = Math.min(movesPerVarMax,120);
    const numChunk = Math.floor((gameMoves.length - 1)/movesPerVar) + 1;
    let movesEncoded = [];

    for (let i = 0; i < numChunk; i++) {
    var chunk = gameMoves.slice(i*movesPerVar, (i + 1)*movesPerVar);
    chunk.reverse();
    var num = 0;
    for(let j=0; j< chunk.length;j++)
    {
        num = num*4 + chunk[j];
    }
    movesEncoded[i] = num;
    }

    return({
        movesPerVar: movesPerVar,
        encodedMoves: movesEncoded
    })
}
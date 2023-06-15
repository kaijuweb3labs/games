export const convertToScoreFormat = (
    _score:number
  ) => {
    var newFormat = ''
    while(_score>=1000){
      newFormat = "," + (_score%1000).toString().padStart(3,"0") + newFormat
      _score = Math.floor(_score/1000)
    }
    newFormat = _score.toString() + newFormat
    return newFormat
  }
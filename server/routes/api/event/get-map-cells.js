module.exports = function (router, models) {
  router.post('/event/get-map-cells', async (req, res) => {
    const [cells, players, users] = await Promise.all([
      models.Cell.find().sort({name: 1}),
      models.Player.find({}, 'currentCell username'),
      models.User.find({ isPlayer: true }, 'username clanTag clanName avatar')
    ])

    const turnsCount = await models.Log.countDocuments()
    const currentTurn = await models.TurnType.findOne({
      turnNumber: turnsCount + 1
    }, 'number fog type')

    const cellsWithPlayers = cells.map((cell) => {
      const {name, started, bonus, connectedCells, gameMap} = cell
      const filteredPlayers = players.filter(player => player.currentCell === cell.name)

      return {
        name,
        gameMap,
        started,
        bonus,
        connectedCells,
        players: filteredPlayers.map(player => {
          return users.find(user => user.username === player.username)
        })
      }
    })

    const currentCell = cellsWithPlayers.find((cell) => {
      return cell.players.some(player => player.username === req.user.username)
    })


    const filteredData = cellsWithPlayers.map((cell) => {
      const isFullData = currentCell
        ? cell.name === currentCell.name || cell.connectedCells.includes(currentCell.name)
        : cell.started || req.user.isAdmin

      return isFullData ? cell : {
        name: cell.name,
        connectedCells: cell.connectedCells,
        players: [],
        bonus: cell.bonus,
        started: cell.started,
        gameMap: cell.gameMap
      }
    })

    res.send({
      status: 'ok',
      data: (currentTurn && currentTurn.fog) ? filteredData : cellsWithPlayers
    })

  })
}
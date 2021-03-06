module.exports = function (router, models) {
  router.post('/admin/set-player-data', async (req, res) => {
    const {
      eventSlug,
      username,
      score,
      currentCell,
      selectedCell,
      ownedCell,
      ownInRowCount
    } = req.body

    const [playerFromDB, turnsCount, users] = await Promise.all([
      models.Player.findOne({ username }),
      models.Log.countDocuments({ eventSlug: req.body.eventSlug }),
      models.User.find()
    ])

    const turnNumber = turnsCount + 1

    if (!playerFromDB) {
      res.send({
        status: 'error',
        message: 'Пользователь не найден'
      })
      return
    }

    let prevCurrentCell

    playerFromDB.events.some(event => {
      if (event.slug === eventSlug) {
        prevCurrentCell = event.currentCell

        event.score = score
        event.currentCell = currentCell
        event.selectedCell = selectedCell
        event.ownedCell = ownedCell
        event.ownInRowCount = ownInRowCount
        return true
      }

      return false
    })

    await models.Player.updateOne({ username } , playerFromDB)

    const players = await models.Player.find({ events : { $elemMatch: {  slug : { $gte: eventSlug } } } })

    const playerListInPrevCurrentCell = players.filter(player => {
      return player.events.some(event => event.slug === eventSlug && event.currentCell === prevCurrentCell)
    })
    const playerListInCurrentCell = players.filter(player => {
      return player.events.some(event => event.slug === eventSlug && event.currentCell === currentCell)
    })

    if (playerListInPrevCurrentCell.length > 1) {
      createBattleTable(playerListInCurrentCell.map(player => player.username), users, prevCurrentCell)
    } else {
      await models.BattleTable.deleteOne({ eventSlug, turnNumber, cellName: prevCurrentCell })
    }

    if (playerListInCurrentCell.length > 1) {
      await models.BattleTable.deleteOne({ eventSlug, turnNumber, cellName: currentCell })
      createBattleTable(playerListInCurrentCell.map(player => player.username), users, currentCell)
    }

    res.send({
      status: 'success',
      message: 'Данные успешно перезаписаны'
    })

    async function createBattleTable(playerList, users, cell) {
      const firstPair = { winner: null, looser: null }
      const secondPair = { winner: null, looser: null }
      const finalPair = { winner: null, looser: null }

      if (playerList.length === 2) {
        [firstPair.winner, secondPair.winner] = playerList
        firstPair.looser = null
        secondPair.looser = null
      }

      if (playerList.length === 3) {
        // eslint-disable-next-line prefer-destructuring
        secondPair.winner = playerList[2]
        secondPair.looser = null
      }

      await models.BattleTable.create({
        eventSlug,
        turnNumber,
        cellName: cell,
        players: playerList.map(player => {
          const { username, clanName, clanTag, avatar } = users.find(user => user.username === player)
          return {
            username,
            clanName,
            clanTag,
            avatar
          }
        }),
        firstPair,
        secondPair,
        finalPair
      })
    }
  })
}


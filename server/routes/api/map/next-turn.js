module.exports = function (router, models) {
  router.post('/admin/next-turn', (req, res) => {
    Promise.all([
      models.mapCell.findAll({
        order: [['cellName']],
        attributes: ['cellName', 'dataJson']
      }),
      models.userMapData.findAll({
        attributes: ['userId', 'score', 'cellId']
      })
    ])
      .then(values => {
        models.mapLog.create({
          playersJson: JSON.stringify(values[1]),
          cellsJson: JSON.stringify(
            values[0].map(cell => {
              return {
                cellName: cell.cellName,
                ...JSON.parse(cell.dataJson)
              }
            })
          )
        })

        res.send({
          status: 'ok'
        })
      })



  })
}
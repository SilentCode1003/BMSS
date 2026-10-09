const mysql = require('../repository/helper/bmssdb')
var socketIo = require('socket.io')
var io = socketIo(server)

io.on('connection', (socket) => {
  //console.log('a user connected')

  // socket.on('disconnect', () => {
  //   console.log('user disconnected')
  // })

  let lastData = []
  let requestData = []

  setInterval(async () => {
    try {
      let sql = `
      select 
        n_id as notifid, n_userid as userid, mp_description as product, n_branchid as branchid, 
        n_quantity as quantity, n_message as message, n_status as status, n_date as date, mb_branchname as branchname
      from notification
      INNER JOIN product_inventory on pi_inventoryid = n_inventoryid
      INNER JOIN master_product on mp_productid = pi_productid
      INNER JOIN master_branch on n_branchid = mb_branchid
      ORDER BY n_date DESC`

      mysql.SelectResult(sql, (err, result) => {
        if (err) {
          return res.json({
            msg: err,
          })
        }

        let data = []

        result.forEach((item) => {
          const foundIndex = requestData.findIndex(
            (el) =>
              el.id === item.id &&
              el.userid === item.userid &&
              el.message === item.message &&
              el.product === item.product &&
              el.status === item.status &&
              el.branchid === item.branchid &&
              el.checker === item.checker
          )

          if (foundIndex === -1) {
            data.push({
              notifid: item.notifid,
              userid: item.userid,
              product: item.product,
              branchid: item.branchid,
              quantity: item.quantity,
              message: item.message,
              status: item.status,
              date: item.date,
              branch: item.branchname,
            })
          }
        })
        //console.log(data)

        socket.emit('pushNotification', data)
        requestData = result
      })
    } catch (error) {
      console.error('Error querying the database:', error)
    }
  }, 300000)

  setInterval(async () => {
    try {
      let sql = `
        SELECT rn_id as id, rn_type as type, rn_userid as userid, rn_branchid as branch, rn_message as message, rn_status as status, rn_date as date
        FROM request_notification
        ORDER BY rn_date DESC`

      mysql.SelectResult(sql, (err, result) => {
        if (err) {
          console.log(err)
        }
        let data = []
        result.forEach((item) => {
          const foundIndex = lastData.findIndex((el) => el.id === item.id)

          if (foundIndex === -1) {
            data.push({
              id: item.id,
              type: item.type,
              userid: item.userid,
              branch: item.branch,
              message: item.message,
              status: item.status,
              date: item.date,
            })
          }
        })
        // console.log(data)

        socket.emit('pushRequestNotification', data)
        lastData = result
      })
    } catch (error) {
      console.error('Error querying the database:', error)
    }
  }, 300000)

  setInterval(() => {
    socket.emit('LoadingState')
  }, 300000)
})
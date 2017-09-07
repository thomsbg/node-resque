var path = require('path')
var specHelper = require(path.join(__dirname, '..', '_specHelper.js')).specHelper
var should = require('should') // eslint-disable-line

describe('connection', function () {
  before(async () => {
    await specHelper.connect()
    await specHelper.cleanup()
  })

  after(async () => { await specHelper.cleanup() })

  it('can provide an error if connection failed', async () => {
    const connectionDetails = {
      pkg: specHelper.connectionDetails.pkg,
      host: 'wronghostname',
      password: specHelper.connectionDetails.password,
      port: specHelper.connectionDetails.port,
      database: specHelper.connectionDetails.database,
      namespace: specHelper.connectionDetails.namespace
    }

    let connection = new specHelper.NR.Connection(connectionDetails)

    await new Promise((resolve) => {
      connection.connect()

      connection.on('error', (error) => {
        error.message.should.match(/getaddrinfo ENOTFOUND/)
        connection.end()
        resolve()
      })
    })
  })

  it('should stat with no redis keys in the namespace', async () => {
    let keys = await specHelper.redis.keys(specHelper.namespace + '*')
    keys.length.should.equal(0)
  })

  it('will properly build namespace strings', async () => {
    var Connection = specHelper.NR.Connection
    var connection = new Connection(specHelper.cleanConnectionDetails())
    await connection.connect()
    connection.key('thing').should.equal(specHelper.namespace + ':thing')
    connection.end()
  })
})

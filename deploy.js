const http = require('http')
const { spawn } = require('child_process');
const createHandler = require('github-webhook-handler')
const conf = require('./webhook_conf.json')
const handler = createHandler({
	path: conf.path,
	secret: conf.secret
})

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 200
    res.end('this is test msg..')
  })
}).listen(8006, () => {
    console.log('release service is listening on 8006')
})

handler.on('error', function (err) {
  console.error('123onError: ', err.message)
})

handler.on('push', function (event) {
  console.log('test on push evt ', event)
  console.log('000 Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref)
  const name = event.payload.repository.name;
  const ref = event.payload.ref;
  const refArr = ref.split('/');
  const branch = refArr[refArr.length - 1];
  if (name === 'will-read' && branch === 'release') {
    const child = spawn('sh', ['./job.sh', name, branch]);
    child.stdout.on('data', (buffer) => {
      console.log(buffer.toString())
    })
    child.stdout.on('end', () => {
      console.log('child stdout on end')
    })
    child.on('close', (code) => {
      console.log('child process exited with code ', code)
    })

  }
})



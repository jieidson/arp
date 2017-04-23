console.log('Web worker started')

self.addEventListener('message', (msg: MessageEvent) => {
  console.log('From main:', msg.data)
  postMessage('Reply!!: ' + msg.data)
})

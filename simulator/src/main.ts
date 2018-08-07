console.info('Web worker started')

addEventListener('message', evt => {
  console.log('From main:', evt.data)
  postMessage('hello from web worker')
})

export const SIMULATOR = true

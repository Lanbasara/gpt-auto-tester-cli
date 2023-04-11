module.exports = function WaitForTimer(time){
  return new Promise((resolve,rej) => {
    setTimeout(() => {
      resolve()
    },time)
  })
}
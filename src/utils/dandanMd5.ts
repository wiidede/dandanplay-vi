import { calcDandanMd5 } from './common/index'

onmessage = async function (e) {
  const res = await calcDandanMd5(e.data)
  postMessage(res)
}

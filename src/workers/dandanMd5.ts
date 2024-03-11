import { calcDandanMd5 } from '../utils/common'

onmessage = async function (e) {
  const res = await calcDandanMd5(e.data)
  postMessage(res)
}

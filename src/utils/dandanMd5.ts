import SparkMD5 from 'spark-md5'

onmessage = function (e) {
  const file: File = e.data
  const fileReader = new FileReader()
  const spark = new SparkMD5.ArrayBuffer()

  fileReader.onload = (e) => {
    const md5 = spark.append(e.target?.result as ArrayBuffer).end()
    postMessage(md5)
  }

  fileReader.onerror = () => {
    postMessage(null)
  }

  function load() {
    const start = 0
    const chunkSize = 16 * 1024 * 1024
    const end = chunkSize >= file.size ? file.size : chunkSize
    fileReader.readAsArrayBuffer(file.slice(start, end))
  }

  load()
}

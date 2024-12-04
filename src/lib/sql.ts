import { createDbWorker } from 'sql.js-httpvfs'

const workerUrl = new URL(
  'sql.js-httpvfs/dist/sqlite.worker.js',
  import.meta.url
)
const wasmUrl = new URL('sql.js-httpvfs/dist/sql-wasm.wasm', import.meta.url)

export async function getWorker() {
  const worker = await createDbWorker(
    [
      {
        from: 'inline',
        config: {
          serverMode: 'full',
          url: '/search.db',
          requestChunkSize: 4096,
        },
      },
    ],
    workerUrl.toString(),
    wasmUrl.toString()
  )

  return worker
}

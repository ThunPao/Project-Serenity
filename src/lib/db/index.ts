// import { DATABASE_URL, ILLUTION_1 } from "$env/static/private";
import { PrismaClient } from "@prisma/client"
// import { readReplicas } from "@prisma/extension-read-replicas"
// const replicaDb = process.env.DATABASE_URL_REPLICA;

// const replicaClient = new PrismaClient({
//   datasourceUrl: ILLUTION_1,
//   log: [{ level: 'query', emit: 'event' }]
// })

// replicaClient.$on('query', (event: any) => console.log('Replica event', event))

export const db = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
})
// .$extends(
//   readReplicas({
//     replicas: [
//       replicaClient
//     ],
//   }),
// )
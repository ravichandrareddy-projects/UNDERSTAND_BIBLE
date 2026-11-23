import { buildApp } from './app.ts';

const app = buildApp();
try {
  const address = await app.listen({ host: '127.0.0.1', port: 3001 });
  console.log(`Understand Bible API listening on ${address}`);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    app.close().catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
  });
}

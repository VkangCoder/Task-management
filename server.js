const app = require("./src/app");

const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`Task Flow start with ${PORT} `);
});

process.on(`SIGINT`, () => {
  server.close(() => console.log(`Exit Server Express`));
});

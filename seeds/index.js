const seedUsers = require("./user-seed");
const db = require("./../config/connection");
const seedThoughts = require("./thought-seed");

const seedAll = async () => {
  await seedUsers(5);
  console.log("User seeded");

  await seedThoughts(5);
  console.log("Thoughts seeded");

  process.exit(0);
};

db.once("open", () => {
  seedAll();
});

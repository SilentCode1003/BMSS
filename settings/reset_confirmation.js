const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = process.argv[2] || "Are you sure? (yes/no): ";

if (process.argv.includes("--force")) {
  rl.close();
  process.exit(0);
}

rl.question(question, (answer) => {
  if (answer.trim().toLowerCase() === "yes") {
    rl.close();
    process.exit(0);
  } else {
    console.log("Cancelled Database Reset.");
    rl.close();
    process.exit(1);
  }
});

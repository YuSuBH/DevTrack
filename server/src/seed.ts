import "dotenv/config";
import { connectDB, disconnectDB } from "./lib/db";
import { Issue } from "./models/Issue";

const issues = [
  {
    title: "App crashes on login with special characters in password",
    description: "Users report a 500 error when their password contains @, #, or ! symbols.",
    status: "Open",
    priority: "Critical",
    labels: ["bug", "auth"],
  },
  {
    title: "Dashboard stats not updating after issue deletion",
    description: "The open/closed counts on the dashboard remain stale until page refresh.",
    status: "Open",
    priority: "High",
    labels: ["bug", "dashboard"],
  },
  {
    title: "Add keyboard shortcut to open new issue form",
    description: "Power users want to press N to open the create issue modal from anywhere.",
    status: "In Progress",
    priority: "Medium",
    labels: ["enhancement", "ux"],
  },
  {
    title: "Issue list should support sorting by priority",
    description: "Currently only newest-first is supported. Add priority sort option.",
    status: "Open",
    priority: "Medium",
    labels: ["enhancement"],
  },
  {
    title: "Truncate long issue titles in list view",
    description: "Titles over 80 characters overflow the card layout on smaller screens.",
    status: "In Progress",
    priority: "Low",
    labels: ["bug", "ui"],
  },
  {
    title: "Set up CI pipeline",
    description: "Configure GitHub Actions to run tests and lint on every pull request.",
    status: "Open",
    priority: "High",
    labels: ["devops"],
  },
  {
    title: "Write API documentation",
    description: "Document all REST endpoints with request/response examples.",
    status: "Closed",
    priority: "Medium",
    labels: ["docs"],
  },
  {
    title: "Fix CORS error when client runs on port 5173",
    description: "Preflight requests from the Vite dev server were being rejected.",
    status: "Closed",
    priority: "High",
    labels: ["bug"],
  },
  {
    title: "Improve error messages for validation failures",
    description: "API currently returns a generic 400. Surface per-field messages to the UI.",
    status: "Closed",
    priority: "Low",
    labels: ["enhancement", "ux"],
  },
  {
    title: "Add label filter to issue list",
    description: "Allow filtering issues by one or more labels in addition to status and priority.",
    status: "Open",
    priority: "Low",
    labels: ["enhancement"],
  },
];

async function seed() {
  await connectDB();

  await Issue.deleteMany({});
  console.log("Cleared existing issues");

  await Issue.insertMany(issues);
  console.log(`Seeded ${issues.length} issues`);

  await disconnectDB();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

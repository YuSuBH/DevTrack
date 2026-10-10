import "dotenv/config";
import { connectDB, disconnectDB } from "./lib/db";
import { Project } from "./models/Project";
import { Issue } from "./models/Issue";

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const projectSeeds = [
  {
    name: "DevTrack",
    description: "The issue tracker app itself — bugs, features, and DevOps tasks.",
  },
  {
    name: "API Gateway",
    description: "Internal API gateway service handling auth and rate limiting.",
  },
  {
    name: "Marketing Site",
    description: "Public-facing landing page and blog.",
  },
];

// Issues per project (indexed 0/1/2 matching projectSeeds)
const issueSeeds: Array<{
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Closed";
  priority: "Low" | "Medium" | "High" | "Critical";
  labels: string[];
  projectIndex: number;
}> = [
  // DevTrack (0)
  {
    title: "App crashes on login with special characters in password",
    description: "Users report a 500 error when their password contains @, #, or ! symbols.",
    status: "Open",
    priority: "Critical",
    labels: ["bug", "auth"],
    projectIndex: 0,
  },
  {
    title: "Dashboard stats not updating after issue deletion",
    description: "The open/closed counts on the dashboard remain stale until page refresh.",
    status: "Open",
    priority: "High",
    labels: ["bug", "dashboard"],
    projectIndex: 0,
  },
  {
    title: "Add keyboard shortcut to open new issue form",
    description: "Power users want to press N to open the create issue modal from anywhere.",
    status: "In Progress",
    priority: "Medium",
    labels: ["enhancement", "ux"],
    projectIndex: 0,
  },
  {
    title: "Issue list should support sorting by priority",
    description: "Currently only newest-first is supported. Add priority sort option.",
    status: "Open",
    priority: "Medium",
    labels: ["enhancement"],
    projectIndex: 0,
  },
  {
    title: "Truncate long issue titles in list view",
    description: "Titles over 80 characters overflow the card layout on smaller screens.",
    status: "In Progress",
    priority: "Low",
    labels: ["bug", "ui"],
    projectIndex: 0,
  },

  // API Gateway (1)
  {
    title: "JWT validation fails for tokens issued by third-party IdP",
    description: "Tokens from Azure AD with non-standard claims are being rejected.",
    status: "Open",
    priority: "Critical",
    labels: ["bug", "auth"],
    projectIndex: 1,
  },
  {
    title: "Set up CI pipeline",
    description: "Configure GitHub Actions to run tests and lint on every pull request.",
    status: "Open",
    priority: "High",
    labels: ["devops"],
    projectIndex: 1,
  },
  {
    title: "Rate limiter not resetting window on config reload",
    description: "After a hot-reload the sliding window counter is not cleared.",
    status: "In Progress",
    priority: "High",
    labels: ["bug"],
    projectIndex: 1,
  },
  {
    title: "Write API documentation",
    description: "Document all REST endpoints with request/response examples.",
    status: "Closed",
    priority: "Medium",
    labels: ["docs"],
    projectIndex: 1,
  },
  {
    title: "Fix CORS error when client runs on port 5173",
    description: "Preflight requests from the Vite dev server were being rejected.",
    status: "Closed",
    priority: "High",
    labels: ["bug"],
    projectIndex: 1,
  },

  // Marketing Site (2)
  {
    title: "Hero image not loading on Safari iOS 17",
    description: "WebP format is unsupported; need fallback to JPEG.",
    status: "Open",
    priority: "High",
    labels: ["bug", "compat"],
    projectIndex: 2,
  },
  {
    title: "Add Open Graph meta tags",
    description: "Improve social share previews for blog posts.",
    status: "In Progress",
    priority: "Medium",
    labels: ["seo"],
    projectIndex: 2,
  },
  {
    title: "Improve error messages for validation failures",
    description: "Contact form currently returns a generic 400. Surface per-field messages.",
    status: "Closed",
    priority: "Low",
    labels: ["enhancement", "ux"],
    projectIndex: 2,
  },
  {
    title: "Add label filter to issue list",
    description: "Allow filtering issues by one or more labels.",
    status: "Open",
    priority: "Low",
    labels: ["enhancement"],
    projectIndex: 2,
  },
];

// ---------------------------------------------------------------------------

async function seed() {
  await connectDB();

  // Wipe everything
  await Issue.deleteMany({});
  await Project.deleteMany({});
  console.log("Cleared existing projects and issues");

  // Create projects
  const projects = await Project.insertMany(projectSeeds);
  console.log(`Seeded ${projects.length} projects`);

  // Map issues to their project ObjectIds
  const issuesWithProjectIds = issueSeeds.map(({ projectIndex, ...rest }) => ({
    ...rest,
    project: projects[projectIndex]._id,
  }));

  await Issue.insertMany(issuesWithProjectIds);
  console.log(`Seeded ${issuesWithProjectIds.length} issues`);

  await disconnectDB();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

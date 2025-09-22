import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("stories", "routes/stories.tsx"),
  route("records", "routes/records.tsx"),
  route("rewards", "routes/rewards.tsx"),
  route("profile", "routes/profile.tsx"),
] satisfies RouteConfig;

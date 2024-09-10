import { query } from "./_generated/server";

export const getAllWorkSpaces = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("workspaces").collect();
  },
});

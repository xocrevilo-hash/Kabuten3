# Heatmap Update Task

You are updating the Semiconductor Buzz heatmap with fresh X/Twitter data. Follow these steps precisely:

## Step 1: Get Current Keywords

Read the file `app/heatmap/page.jsx` to get the current list of keywords being tracked.

## Step 2: Collect View Counts from X/Twitter

For each keyword in the list, use the Claude in Chrome browser tools to:

1. Navigate to X/Twitter search: `https://x.com/search?q={keyword}&src=typed_query&f=top`
2. Wait for the page to load completely
3. Read the page to find the top 5 posts
4. For each of the top 5 posts, extract the view count (displayed as "X views" or "X.XM views")
5. Sum the view counts from all 5 posts for that keyword
6. Record the total and note any significant trending topics for the "Standout Topics" section

Important notes:
- If a view count shows "M" it means millions (e.g., "1.2M" = 1,200,000)
- If a view count shows "K" it means thousands (e.g., "500K" = 500,000)
- Some posts may not show view counts - skip those and use the next visible post

## Step 3: Determine Trend Status

Compare the new view counts to the previous values in the file:
- **hot**: Significant increase (>50% or new breakout topic)
- **warm**: Moderate increase (10-50%)
- **neutral**: Stable (-10% to +10%)
- **cold**: Declining (<-10%)

## Step 4: Update the Heatmap File

Edit `app/heatmap/page.jsx` with the new data:

1. Update the `keywords` array with new `totalViews` values
2. Update the `trend` status for each keyword based on week-over-week changes
3. Update any `description` fields if the context has changed
4. Reorder keywords by totalViews (highest first)
5. Update the date comment at line 7 to today's date
6. Update the "Updated:" timestamp in the header (line 63) to today's date and "8:00 HKT"
7. Update the "Standout Topics Today" section (lines 111-128) with 3-4 notable trends

## Step 5: Commit and Push

After updating the file:

1. Run `git add app/heatmap/page.jsx`
2. Commit with message: "Update heatmap: [brief summary of top changes] (DATE)"
   - Example: "Update heatmap: Rubin leads, HBM4 rising, memory shortage continues (Jan 22)"
3. Push to the remote repository

## Completion

Once the changes are pushed, the task is complete. Output a summary of:
- Top 3 keywords by views
- Any significant changes in trend status
- The commit hash

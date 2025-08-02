-- Update user settings to migrate legacy banner data from dashboard_layout JSON to dedicated columns
UPDATE user_settings 
SET 
  banner_image = COALESCE(
    banner_image,
    (dashboard_layout->>'bannerImage')::text
  ),
  show_banner = COALESCE(
    show_banner,
    (dashboard_layout->>'showBanner')::boolean
  ),
  banner_height = COALESCE(
    banner_height,
    (dashboard_layout->>'bannerHeight')::integer
  )
WHERE 
  dashboard_layout IS NOT NULL 
  AND (
    (dashboard_layout->>'bannerImage') IS NOT NULL 
    OR (dashboard_layout->>'showBanner') IS NOT NULL 
    OR (dashboard_layout->>'bannerHeight') IS NOT NULL
  );
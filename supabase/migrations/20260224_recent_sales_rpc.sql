-- Function to get recent sales for an instructor, returning user details
CREATE OR REPLACE FUNCTION get_instructor_recent_sales(org_instructor_id UUID)
RETURNS TABLE (
  purchase_id UUID,
  price DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE,
  user_id UUID,
  user_email TEXT,
  user_first_name TEXT,
  user_last_name TEXT,
  course_title TEXT
)
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as purchase_id,
    p.price,
    p.created_at,
    u.id as user_id,
    u.email::TEXT as user_email,
    (u.raw_user_meta_data->>'first_name')::TEXT as user_first_name,
    (u.raw_user_meta_data->>'last_name')::TEXT as user_last_name,
    c.title as course_title
  FROM public.purchases p
  JOIN public.courses c ON p.course_id = c.id
  JOIN auth.users u ON p.user_id = u.id
  WHERE c.instructor_id = org_instructor_id
  ORDER BY p.created_at DESC
  LIMIT 5;
END;
$$;

-- Grant permissions to execute the function
GRANT EXECUTE ON FUNCTION get_instructor_recent_sales(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_instructor_recent_sales(UUID) TO service_role;

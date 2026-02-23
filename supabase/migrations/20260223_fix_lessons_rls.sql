CREATE POLICY "Enable insert for authenticated users only" ON public.lessons
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for users based on user_id" ON public.lessons
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable delete for users based on user_id" ON public.lessons
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

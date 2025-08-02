-- Create storage bucket for banner images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('banners', 'banners', true);

-- Create policies for banner uploads
CREATE POLICY "Banner images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'banners');

CREATE POLICY "Users can upload banner images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'banners' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update banner images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'banners' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete banner images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'banners' AND auth.uid() IS NOT NULL);
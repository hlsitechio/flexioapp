import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Eye, EyeOff } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function ImageBanner() {
  const { bannerImage, setBannerImage, showBanner, setShowBanner } = useSettings();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `banner-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('banners')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(data.path);

      setBannerImage(publicUrl);
      setShowBanner(true);
      
      toast({
        title: "Success",
        description: "Banner image uploaded successfully!",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload banner image.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const removeBanner = () => {
    setBannerImage('');
    setShowBanner(false);
  };

  const toggleBannerVisibility = () => {
    setShowBanner(!showBanner);
  };

  if (!showBanner && !bannerImage) {
    return (
      <div className="px-6 pt-6">
        <Card className="p-4 border-dashed border-2 hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              variant="ghost"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? 'Uploading...' : 'Add Banner Image'}
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </Card>
      </div>
    );
  }

  if (!showBanner) {
    return (
      <div className="px-6 pt-6">
        <div className="flex justify-end">
          <Button
            onClick={toggleBannerVisibility}
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Show Banner
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-6">
      <Card className="relative overflow-hidden group">
        {bannerImage ? (
          <>
            <div 
              className="h-48 bg-cover bg-center bg-no-repeat rounded-lg"
              style={{ backgroundImage: `url(${bannerImage})` }}
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-2">
                <Button
                  onClick={toggleBannerVisibility}
                  variant="secondary"
                  size="sm"
                  className="bg-background/80 backdrop-blur-sm"
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  variant="secondary"
                  size="sm"
                  className="bg-background/80 backdrop-blur-sm"
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Button
                  onClick={removeBanner}
                  variant="secondary"
                  size="sm"
                  className="bg-background/80 backdrop-blur-sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </>
        ) : (
          <div className="h-48 flex items-center justify-center border-dashed border-2 border-muted-foreground/25 rounded-lg">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              variant="ghost"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? 'Uploading...' : 'Upload Banner Image'}
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}
      </Card>
    </div>
  );
}
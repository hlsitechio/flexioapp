import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Eye, EyeOff, Move } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { useNotification } from '@/contexts/NotificationContext';

export function ImageBanner() {
  const { bannerImage, setBannerImage, showBanner, setShowBanner, bannerHeight, setBannerHeight } = useSettings();
  const [isUploading, setIsUploading] = useState(false);
  const { addNotification } = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      addNotification({
        type: 'error',
        title: 'Invalid file type',
        message: 'Please upload an image file.',
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
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Banner image uploaded successfully!',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      addNotification({
        type: 'error',
        title: 'Upload failed',
        message: 'Failed to upload banner image.',
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

  // Show upload interface when no banner image exists
  if (!bannerImage) {
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

  // Show toggle button when banner exists but is hidden
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

  // Show the banner with image and resize functionality
  return (
    <div className="px-6 pt-6">
      <Card className="relative overflow-hidden group">
        <div 
          className="bg-cover bg-center bg-no-repeat rounded-lg relative"
          style={{ 
            backgroundImage: `url(${bannerImage})`,
            height: `${bannerHeight}px`,
            minHeight: '100px',
            resize: 'vertical',
            overflow: 'hidden'
          }}
        >
          {/* Control buttons */}
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

          {/* Resize handle */}
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-background/60 backdrop-blur-sm rounded-t-lg cursor-ns-resize opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            onMouseDown={(e) => {
              const startY = e.clientY;
              const startHeight = bannerHeight;
              
              const handleMouseMove = (e: MouseEvent) => {
                const deltaY = e.clientY - startY;
                const newHeight = Math.max(100, Math.min(600, startHeight + deltaY));
                setBannerHeight(newHeight);
              };
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            <Move className="h-3 w-3 text-muted-foreground rotate-90" />
          </div>

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
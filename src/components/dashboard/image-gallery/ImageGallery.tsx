import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const images = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop",
    alt: "Gray laptop computer that is turned on"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
    alt: "Monitor displaying Java programming"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
    alt: "MacBook with lines of code on its screen"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop",
    alt: "Colorful software or web code on a computer monitor"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=300&fit=crop",
    alt: "Person clicking an Apple Watch smartwatch"
  }
];

export function ImageGallery() {
  return (
    <Card className="w-full h-full">
      <CardContent className="p-4 h-full flex flex-col">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Image Gallery</h3>
        <div className="flex-1 flex items-center justify-center">
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {images.map((image) => (
                <CarouselItem key={image.id}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-2">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </CardContent>
    </Card>
  );
}
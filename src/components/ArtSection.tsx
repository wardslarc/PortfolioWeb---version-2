import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Heart, Bookmark, Share } from "lucide-react";
import { Link } from "react-scroll";

interface Artwork {
  id: number;
  title: string;
  medium: string;
  year: string;
  description: string;
  imageUrl: string;
  category: string;
  likes: number;
  isLiked: boolean;
}

const ArtSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    const initialArtworks: Artwork[] = [
      {
        id: 1,
        title: "Baby",
        medium: "Digital Art",
        year: "2024",
        description: "My Gf",
        imageUrl: "/drawings/baby.jpg",
        category: "digital",
        likes: 127,
        isLiked: false,
      },
      {
        id: 2,
        title: "Portrait Study",
        medium: "Digital Art",
        year: "2023",
        description: "Practice using digital tablet.",
        imageUrl: "/drawings/timelapse.mp4",
        category: "digital",
        likes: 89,
        isLiked: false,
      },
      {
        id: 3,
        title: "Contest Entry",
        medium: "Digital Art",
        year: "2024",
        description:
          "My entry for a contest last 2023.",
        imageUrl:
          "/drawings/comm.jpg",
        category: "digital",
        likes: 203,
        isLiked: true,
      },
      {
        id: 4,
        title: "Alyssa Fanart",
        medium: "Digital Art",
        year: "2023",
        description:
          "Alyssa from The End of F-ing World Series from Netflix.",
        imageUrl:
          "/drawings/nm.jpg",
        category: "digital",
        likes: 156,
        isLiked: false,
      },
      {
        id: 5,
        title: "Cats",
        medium: "Digital Art",
        year: "2023",
        description:
          "One of my sketches.",
        imageUrl:
          "/drawings/cats.jpg",
        category: "digital",
        likes: 74,
        isLiked: false,
      },
      {
        id: 6,
        title: "Environment Practice",
        medium: "Digital Art",
        year: "2024",
        description:
          "Environment art practice.",
        imageUrl:
          "/drawings/sink.jpg",
        category: "digital",
        likes: 312,
        isLiked: true,
      },
    ];
    setArtworks(initialArtworks);
  }, []);

  const categories = [
    { id: "all", label: "All Artwork" },
    { id: "digital", label: "Digital Art" },
    { id: "traditional", label: "Traditional Media" },
  ];

  const filteredArtworks =
    selectedCategory === "all"
      ? artworks
      : artworks.filter((artwork) => artwork.category === selectedCategory);

  const handleLike = (artworkId: number) => {
    setArtworks((prev) =>
      prev.map((artwork) =>
        artwork.id === artworkId
          ? {
              ...artwork,
              isLiked: !artwork.isLiked,
              likes: artwork.isLiked ? artwork.likes - 1 : artwork.likes + 1,
            }
          : artwork
      )
    );
  };

  return (
    <section id="art" className="py-20 bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, margin: "-100px" }}
        className="w-full"
      >
        <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Art Gallery
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of my drawings and digital artwork, showcasing various
            techniques and creative explorations.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-2 p-1 bg-muted rounded-lg">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="transition-all duration-200"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-muted/10 p-4 rounded-xl">
          {filteredArtworks.map((artwork) => (
            <Card
              key={artwork.id}
              className="overflow-hidden bg-card border border-muted rounded-xl shadow-md hover:shadow-lg hover:border-primary transition-all duration-300"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between p-4 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">A</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{artwork.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {artwork.medium} • {artwork.year}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs capitalize">
                  {artwork.category}
                </Badge>
              </div>

              {/* Media */}
              <div className="relative overflow-hidden rounded-lg">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  {artwork.imageUrl.endsWith(".mp4") ? (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full aspect-square object-cover"
                    >
                      <source src={artwork.imageUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      className="w-full aspect-square object-cover"
                    />
                  )}
                </motion.div>
              </div>

              {/* Actions */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(artwork.id)}
                      className="flex items-center space-x-1 transition-colors hover:text-red-500"
                    >
                      <Heart
                        className={`w-6 h-6 transition-colors ${
                          artwork.isLiked
                            ? "fill-red-500 text-red-500"
                            : "text-foreground hover:text-red-500"
                        }`}
                      />
                    </button>
                    <button className="transition-colors hover:text-primary">
                      <Share className="w-6 h-6" />
                    </button>
                  </div>
                  <button className="transition-colors hover:text-primary">
                    <Bookmark className="w-6 h-6" />
                  </button>
                </div>

                {/* Likes count */}
                <p className="font-semibold text-sm mb-2">
                  {artwork.likes.toLocaleString()} likes
                </p>

                {/* Caption */}
                <div className="text-sm">
                  <span className="font-semibold mr-2">
                    {artwork.title.toLowerCase().replace(/\s+/g, "_")}
                  </span>
                  <span className="text-foreground">{artwork.description}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-muted/50 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">
              Interested in Custom Artwork?
            </h3>
            <p className="text-muted-foreground mb-6">
              I'm available for commissioned artwork and creative projects.
              Let's bring your vision to life!
              </p>
            <Link to="contact" smooth={true} duration={600}>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ArtSection;

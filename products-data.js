const PRODUCTS_DB = [
   
    {
        id: 1,
        name: "Premium Wireless Headphones",
        category: "electronics",
        price: 199.99,
        originalPrice: 249.99,
        discount: 20,
        rating: 4.8,
        reviewCount: 1247,
        image: "images/headphones.jpg",
        images: [
            "images/headphones.jpg"
        ],
        description: "Experience superior sound quality with these premium wireless headphones featuring noise cancellation, 30-hour battery life, and premium comfort padding.",
        features: [
            "Active Noise Cancellation",
            "30-hour battery life",
            "Bluetooth 5.0 connectivity",
            "Premium leather padding",
            "Quick charge technology"
        ],
        inStock: true,
        featured: true,
        badge: "Best Seller"
    },
    {
        id: 2,
        name: "Smart Gaming Monitor 27\"",
        category: "electronics",
        price: 329.99,
        originalPrice: 399.99,
        discount: 18,
        rating: 4.6,
        reviewCount: 892,
        image: "images/monitor.jpg",
        images: [
            "images/monitor.jpg"
        ],
        description: "Ultra-wide 27-inch gaming monitor with 144Hz refresh rate, 1ms response time, and HDR support for immersive gaming experience.",
        features: [
            "144Hz refresh rate",
            "1ms response time",
            "HDR10 support",
            "AMD FreeSync compatible",
            "Multiple connectivity options"
        ],
        inStock: true,
        featured: true,
        badge: "Gaming"
    },
    {
        id: 3,
        name: "Professional Laptop Stand",
        category: "electronics",
        price: 89.99,
        originalPrice: 119.99,
        discount: 25,
        rating: 4.7,
        reviewCount: 654,
        image: "images/laptop-stand.jpg",
        images: [
            "images/laptop-stand.jpg"
        ],
        description: "Ergonomic aluminum laptop stand with adjustable height and angle for improved posture and cooling.",
        features: [
            "Adjustable height and angle",
            "Premium aluminum construction",
            "Improved airflow design",
            "Compatible with all laptop sizes",
            "Non-slip silicone pads"
        ],
        inStock: true,
        featured: false,
        badge: "Ergonomic"
    },
    {
        id: 4,
        name: "Wireless Charging Pad",
        category: "electronics",
        price: 49.99,
        originalPrice: 69.99,
        discount: 29,
        rating: 4.4,
        reviewCount: 1156,
        image: "images/wireless-charger.jpg",
        images: [
            "images/wireless-charger.jpg"
        ],
        description: "Fast wireless charging pad with LED indicator and universal compatibility for all Qi-enabled devices.",
        features: [
            "Fast wireless charging",
            "Universal Qi compatibility",
            "LED charging indicator",
            "Compact design",
            "Overcharge protection"
        ],
        inStock: true,
        featured: false,
        badge: "Fast Charge"
    },
    {
        id: 5,
        name: "Smart Home Security Camera",
        category: "electronics",
        price: 129.99,
        originalPrice: 179.99,
        discount: 28,
        rating: 4.5,
        reviewCount: 743,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEtgg3Pkj2JzZLF6yGx4BvqH-eUylZyL3HhA&s",
        images: [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEtgg3Pkj2JzZLF6yGx4BvqH-eUylZyL3HhA&s"
        ],
        description: "WiFi-enabled security camera with 1080p HD recording, night vision, and smartphone app control.",
        features: [
            "1080p HD recording",
            "Night vision capability",
            "WiFi connectivity",
            "Smartphone app control",
            "Motion detection alerts"
        ],
        inStock: true,
        featured: true,
        badge: "Smart Home"
    },
    {
        id: 6,
        name: "Bluetooth Mechanical Keyboard",
        category: "electronics",
        price: 149.99,
        originalPrice: 199.99,
        discount: 25,
        rating: 4.9,
        reviewCount: 567,
        image: "images/keyboard.jpg",
        images: [
            "images/keyboard.jpg"
        ],
        description: "Premium mechanical keyboard with RGB backlighting, wireless connectivity, and tactile switches.",
        features: [
            "Mechanical tactile switches",
            "RGB backlighting",
            "Wireless & USB connectivity",
            "Programmable keys",
            "Long battery life"
        ],
        inStock: true,
        featured: false,
        badge: "RGB"
    },
    {
        id: 7,
        name: "Portable Power Bank 20000mAh",
        category: "electronics",
        price: 79.99,
        originalPrice: 99.99,
        discount: 20,
        rating: 4.6,
        reviewCount: 1334,
        image: "images/powerbank.jpg",
        images: [
            "images/powerbank.jpg"
        ],
        description: "High-capacity portable power bank with fast charging and multiple USB ports for all your devices.",
        features: [
            "20000mAh capacity",
            "Fast charging technology",
            "Multiple USB ports",
            "LED battery indicator",
            "Compact portable design"
        ],
        inStock: true,
        featured: false,
        badge: "High Capacity"
    },
    {
        id: 8,
        name: "Smart Fitness Tracker Watch",
        category: "electronics",
        price: 159.99,
        originalPrice: 219.99,
        discount: 27,
        rating: 4.3,
        reviewCount: 892,
        image: "images/smartwatch.jpg",
        images: [
            "images/smartwatch.jpg"
        ],
        description: "Advanced fitness tracker with heart rate monitoring, GPS, and smartphone notifications.",
        features: [
            "Heart rate monitoring",
            "Built-in GPS",
            "Smartphone notifications",
            "Water resistant",
            "Multiple sport modes"
        ],
        inStock: true,
        featured: true,
        badge: "Fitness"
    },

//    fastion
    {
        id: 9,
        name: "Designer Leather Handbag",
        category: "fashion",
        price: 289.99,
        originalPrice: 399.99,
        discount: 28,
        rating: 4.7,
        reviewCount: 456,
        image: "images/handbag.jpg",
        images: [
            "images/handbag.jpg"
        ],
        description: "Elegant leather handbag crafted from premium materials with spacious interior and adjustable strap.",
        features: [
            "Premium leather construction",
            "Spacious main compartment",
            "Adjustable shoulder strap",
            "Multiple interior pockets",
            "Gold-tone hardware"
        ],
        inStock: true,
        featured: true,
        badge: "Premium"
    },
    {
        id: 10,
        name: "Classic Denim Jacket",
        category: "fashion",
        price: 79.99,
        originalPrice: 109.99,
        discount: 27,
        rating: 4.5,
        reviewCount: 623,
        image: "images/denim-jacket.jpg",
        images: [
            "images/denim-jacket.jpg"
        ],
        description: "Timeless denim jacket with classic cut and premium denim fabric for versatile styling.",
        features: [
            "100% premium denim",
            "Classic button closure",
            "Chest and side pockets",
            "Comfortable fit",
            "Versatile styling"
        ],
        inStock: true,
        featured: false,
        badge: "Classic"
    },
    {
        id: 11,
        name: "Elegant Evening Dress",
        category: "fashion",
        price: 199.99,
        originalPrice: 279.99,
        discount: 29,
        rating: 4.8,
        reviewCount: 234,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ-yC1qLGzoDur8rGOZ8r2LyOneHGIIoXJ0A&s",
        images: [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ-yC1qLGzoDur8rGOZ8r2LyOneHGIIoXJ0A&s"
        ],
        description: "Sophisticated evening dress perfect for special occasions with flowing silhouette and premium fabric.",
        features: [
            "Premium fabric blend",
            "Flowing A-line silhouette",
            "Elegant neckline",
            "Hidden back zipper",
            "Perfect for special occasions"
        ],
        inStock: true,
        featured: true,
        badge: "Elegant"
    },
    {
        id: 12,
        name: "Comfortable Running Shoes",
        category: "fashion",
        price: 129.99,
        originalPrice: 169.99,
        discount: 24,
        rating: 4.6,
        reviewCount: 1245,
        image: "images/running-shoes.jpg",
        images: [
            "images/running-shoes.jpg"
        ],
        description: "High-performance running shoes with advanced cushioning and breathable mesh upper for maximum comfort.",
        features: [
            "Advanced cushioning system",
            "Breathable mesh upper",
            "Lightweight construction",
            "Durable rubber outsole",
            "Supportive heel counter"
        ],
        inStock: true,
        featured: false,
        badge: "Athletic"
    },
    {
        id: 13,
        name: "Stylish Winter Coat",
        category: "fashion",
        price: 249.99,
        originalPrice: 349.99,
        discount: 29,
        rating: 4.4,
        reviewCount: 387,
        image: "images/winter-coat.jpg",
        images: [
            "images/winter-coat.jpg"
        ],
        description: "Warm and stylish winter coat with water-resistant fabric and cozy lining for cold weather protection.",
        features: [
            "Water-resistant fabric",
            "Insulated lining",
            "Adjustable hood",
            "Multiple pockets",
            "Stylish design"
        ],
        inStock: true,
        featured: false,
        badge: "Winter"
    },
    {
        id: 14,
        name: "Premium Wool Scarf",
        category: "fashion",
        price: 69.99,
        originalPrice: 89.99,
        discount: 22,
        rating: 4.7,
        reviewCount: 156,
        image: "images/wool-scarf.jpg",
        images: [
            "images/wool-scarf.jpg"
        ],
        description: "Luxurious wool scarf with soft texture and versatile design perfect for any season styling.",
        features: [
            "100% premium wool",
            "Soft and comfortable",
            "Versatile styling",
            "Elegant fringe detail",
            "Multiple color options"
        ],
        inStock: true,
        featured: false,
        badge: "Luxury"
    },

   
    {
        id: 15,
        name: "Smart Coffee Maker",
        category: "home",
        price: 189.99,
        originalPrice: 249.99,
        discount: 24,
        rating: 4.5,
        reviewCount: 892,
        image: "images/coffee-maker.jpg",
        images: [
            "images/coffee-maker.jpg"
        ],
        description: "WiFi-enabled smart coffee maker with programmable brewing, smartphone app control, and premium features.",
        features: [
            "WiFi connectivity",
            "Smartphone app control",
            "Programmable brewing",
            "12-cup capacity",
            "Auto-shutoff feature"
        ],
        inStock: true,
        featured: true,
        badge: "Smart Home"
    },
    {
        id: 16,
        name: "Premium Blender",
        category: "home",
        price: 149.99,
        originalPrice: 199.99,
        discount: 25,
        rating: 4.7,
        reviewCount: 567,
        image: "images/blender.jpg",
        images: [
            "images/blender.jpg"
        ],
        description: "High-performance blender with powerful motor and multiple speed settings for all your blending needs.",
        features: [
            "Powerful 1200W motor",
            "Multiple speed settings",
            "BPA-free pitcher",
            "Stainless steel blades",
            "Easy-to-clean design"
        ],
        inStock: true,
        featured: false,
        badge: "Powerful"
    },
    {
        id: 17,
        name: "Digital Air Fryer",
        category: "home",
        price: 129.99,
        originalPrice: 179.99,
        discount: 28,
        rating: 4.6,
        reviewCount: 1123,
        image: "https://www.winstore.pk/cdn/shop/products/5q7poY5WRm_2048x.jpg?v=1647868044",
        images: [
            "https://www.winstore.pk/cdn/shop/products/5q7poY5WRm_2048x.jpg?v=1647868044"
        ],
        description: "Advanced digital air fryer with multiple cooking presets and healthier cooking with little to no oil.",
        features: [
            "Digital touch controls",
            "Multiple cooking presets",
            "Oil-free cooking",
            "Large capacity basket",
            "Easy cleanup"
        ],
        inStock: true,
        featured: true,
        badge: "Healthy"
    },
    {
        id: 18,
        name: "Multi-Function Rice Cooker",
        category: "home",
        price: 89.99,
        originalPrice: 119.99,
        discount: 25,
        rating: 4.4,
        reviewCount: 654,
        image: "images/kitchen-appliance.jpg",
        images: [
            "images/kitchen-appliance.jpg"
        ],
        description: "Versatile rice cooker with multiple cooking functions including steaming, slow cooking, and warming.",
        features: [
            "Multiple cooking functions",
            "10-cup capacity",
            "Keep-warm function",
            "Non-stick inner pot",
            "Digital display"
        ],
        inStock: true,
        featured: false,
        badge: "Versatile"
    },

    // book and media
    {
        id: 19,
        name: "Classic Literature Collection",
        category: "books",
        price: 49.99,
        originalPrice: 79.99,
        discount: 38,
        rating: 4.8,
        reviewCount: 345,
        image: "images/book1.jpg",
        images: [
            "images/book1.jpg"
        ],
        description: "Comprehensive collection of timeless classic literature featuring beautiful hardcover editions and gold embossing.",
        features: [
            "Hardcover editions",
            "Gold embossed covers",
            "Premium paper quality",
            "Multiple classic titles",
            "Perfect for collectors"
        ],
        inStock: true,
        featured: true,
        badge: "Collection"
    },
    {
        id: 20,
        name: "Modern Art Photography Book",
        category: "books",
        price: 39.99,
        originalPrice: 59.99,
        discount: 33,
        rating: 4.6,
        reviewCount: 234,
        image: "images/book2.jpg",
        images: [
            "images/book2.jpg"
        ],
        description: "Stunning photography book showcasing contemporary art and modern visual aesthetics with high-quality prints.",
        features: [
            "High-quality photo prints",
            "Contemporary art focus",
            "Large format pages",
            "Professional photography",
            "Artist interviews included"
        ],
        inStock: true,
        featured: false,
        badge: "Art"
    },
    {
        id: 21,
        name: "Educational Science Encyclopedia",
        category: "books",
        price: 69.99,
        originalPrice: 99.99,
        discount: 30,
        rating: 4.7,
        reviewCount: 456,
        image: "images/book3.jpg",
        images: [
            "images/book3.jpg"
        ],
        description: "Comprehensive science encyclopedia with detailed illustrations and up-to-date scientific information for all ages.",
        features: [
            "Comprehensive coverage",
            "Detailed illustrations",
            "Updated scientific information",
            "Age-appropriate content",
            "Index and glossary included"
        ],
        inStock: true,
        featured: false,
        badge: "Educational"
    },
    {
        id: 22,
        name: "Premium Cookbook Collection",
        category: "books",
        price: 79.99,
        originalPrice: 109.99,
        discount: 27,
        rating: 4.5,
        reviewCount: 678,
        image: "images/cookbook.jpg",
        images: [
            "images/cookbook.jpg"
        ],
        description: "Professional cookbook collection featuring international cuisine recipes with step-by-step instructions and beautiful food photography.",
        features: [
            "International cuisine recipes",
            "Step-by-step instructions",
            "Beautiful food photography",
            "Nutritional information",
            "Cooking tips and techniques"
        ],
        inStock: true,
        featured: true,
        badge: "Cooking"
    }
];

// Categories configuration
const CATEGORIES = {
    electronics: {
        name: "Electronics",
        icon: "fas fa-laptop",
        description: "Latest gadgets and tech"
    },
    fashion: {
        name: "Fashion",
        icon: "fas fa-tshirt",
        description: "Trendy clothing and accessories"
    },
    home: {
        name: "Home & Garden",
        icon: "fas fa-home",
        description: "Everything for your home"
    },
    books: {
        name: "Books & Media",
        icon: "fas fa-book",
        description: "Books, music, and entertainment"
    }
};


if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PRODUCTS_DB, CATEGORIES };
}

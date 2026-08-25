export interface RevisionItem {
  id: string;
  title: string;
  course: string;
  year: string;
  type: 'Note' | 'Past Paper' | 'Summary';
  downloads: number;
  author: string;
  size: string;
  image: string;
  description?: string;
}

export interface AttachmentJobItem {
  id: string;
  title: string;
  company: string;
  type: 'Attachment' | 'Job' | 'Internship' | 'Part-time';
  location: string;
  stipend: string;
  deadline: string;
  applied?: boolean;
  image: string;
  description?: string;
  requirements?: string;
}

export interface MenuItem {
  name: string;
  price: string;
  description: string;
  tag?: string;
}

export interface HotelMenuCategory {
  category: string;
  items: MenuItem[];
}

export interface HotelServiceItem {
  title: string;
  priceOrStatus: string;
  description: string;
  icon?: string;
}

export interface EntertainmentMediaItem {
  id: string;
  title: string;
  category: 'music' | 'movie' | 'study' | 'gaming' | 'podcast';
  youtubeId: string;
  duration: string;
  thumbnail: string;
  artistOrDirector: string;
  description?: string;
}

export interface LocalListingItem {
  id: string;
  name: string;
  type: 'Hostel' | 'Hotel' | 'Entertainment' | 'Health' | 'Service';
  distance: string;
  price: string;
  rating: number;
  image: string;
  gallery: string[];
  youtubeVideoUrl: string;
  youtubeTitle?: string;
  whatsappNumber: string;
  badge: string;
  address: string;
  websiteUrl?: string;
  contact?: string;
  email?: string;
  caretakerName?: string;
  description: string;
  amenities: string[];
  likesCount: number;
  sharesCount: number;
  reviewsCount: number;
  operatingHours?: string;
  serviceCategory?: 'Tech & Laptop Repairs' | 'Grooming & Salon' | 'Printing & Thesis' | 'Laundry & Dry Clean' | 'Tutoring & Coaching' | 'Photography & Media' | 'Moving & Cleaning' | 'Other';
  menus?: HotelMenuCategory[];
  services?: HotelServiceItem[];
  roomOptions?: { name: string; price: string; description: string }[];
  reviews?: { user: string; avatar: string; rating: number; comment: string; date: string }[];
}

const HUB_LOGO = 'https://lh3.googleusercontent.com/a/ACg8ocK8OcG5hTyHl38gnft2YriG9VXV1g3fxqG25hYEPgzGas3C084=s100-c';

export const INITIAL_REVISION_NOTES: RevisionItem[] = [
  {
    id: 'rev-1',
    title: 'Data Structures & Algorithms Comprehensive Revision',
    course: 'Computer Science',
    year: '2024 Exam Series',
    type: 'Summary',
    downloads: 1420,
    author: 'Prof. Adeyemi & Student Lead',
    size: '4.2 MB',
    image: HUB_LOGO,
    description: 'Complete revision packet covering Trees, Graphs, Big-O, Dynamic Programming, and sample exam solutions.',
  },
  {
    id: 'rev-2',
    title: 'Operating Systems & Concurrency Final Past Paper Solutions',
    course: 'Software Engineering',
    year: '2023 Past Paper',
    type: 'Past Paper',
    downloads: 980,
    author: 'Campus Academic Guild',
    size: '2.8 MB',
    image: HUB_LOGO,
    description: 'Fully worked solutions for Sem 2 examinations including Semaphore, Deadlocks, Memory Paging, and Shell scripting.',
  },
  {
    id: 'rev-3',
    title: 'Calculus III & Differential Equations Quick Formula Sheet',
    course: 'Mathematics & Eng',
    year: '2024 Sem 1',
    type: 'Note',
    downloads: 2150,
    author: 'Engineering Honors Club',
    size: '1.5 MB',
    image: HUB_LOGO,
    description: 'Essential vector calculus formulas, Green\'s theorem proofs, partial derivatives, and exam shortcuts.',
  },
  {
    id: 'rev-4',
    title: 'Database Management Systems & SQL Normalization Kit',
    course: 'Information Systems',
    year: '2024 Midterm',
    type: 'Note',
    downloads: 870,
    author: 'Dev Circle Peer Group',
    size: '3.1 MB',
    image: HUB_LOGO,
    description: 'ER Diagram schemas, 1NF-BCNF normalization step-by-step examples, and complex SQL joins guide.',
  },
  {
    id: 'rev-5',
    title: 'Artificial Intelligence & Neural Networks Exam Archive',
    course: 'AI & Machine Learning',
    year: '2022 - 2024 Past Papers',
    type: 'Past Paper',
    downloads: 1650,
    author: 'AI Society',
    size: '6.4 MB',
    image: HUB_LOGO,
    description: '3-year past paper compilation with model solutions for Backpropagation, CNNs, A* Search, and NLP.',
  },
  {
    id: 'rev-6',
    title: 'Computer Networks & OSI Model Master Summary',
    course: 'Telecommunications',
    year: '2024 Exam Prep',
    type: 'Summary',
    downloads: 1120,
    author: 'IEEE Student Branch',
    size: '3.7 MB',
    image: HUB_LOGO,
    description: 'TCP/IP vs OSI model breakdown, subnetting calculation cheatsheet, and routing protocol summaries.',
  }
];

export const INITIAL_MY_SAVED_NOTES: RevisionItem[] = [
  {
    id: 'my-1',
    title: 'Personal Clean Architecture Notes & Diagram Bookmarks',
    course: 'Software Engineering',
    year: 'My 2024 Prep',
    type: 'Summary',
    downloads: 14,
    author: 'You (Alex)',
    size: '1.2 MB',
    image: HUB_LOGO,
    description: 'Handcrafted notes on Domain-Driven Design, Repository patterns, and dependency inversion diagrams.',
  },
  {
    id: 'my-2',
    title: 'Calculus III Solved Past Questions 2021-2023',
    course: 'Mathematics',
    year: 'Saved Collection',
    type: 'Past Paper',
    downloads: 45,
    author: 'You (Alex)',
    size: '3.8 MB',
    image: HUB_LOGO,
    description: 'Annotated solutions with color-coded step-by-step integrals and coordinate transformation graphs.',
  },
];

export const INITIAL_ATTACHMENTS_AND_JOBS: AttachmentJobItem[] = [
  {
    id: 'job-1',
    title: 'Student Industrial Attachment (SIWES) - Software Dev',
    company: 'Enemind Tech Labs',
    type: 'Attachment',
    location: 'Campus Tech Hub / Hybrid',
    stipend: 'Paid Allowance ($450/mo)',
    deadline: 'In 5 days',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=80',
    description: 'Hands-on training in React, Node.js, and Cloud deployment. Counts for university SIWES academic credits.',
    requirements: 'Basic JavaScript/TypeScript knowledge, currently enrolled in 2nd-4th year STEM degree.',
  },
  {
    id: 'job-2',
    title: 'Campus Ambassador & Community Lead',
    company: 'Gen-Z Global Network',
    type: 'Part-time',
    location: 'On Campus',
    stipend: 'Hourly ($18/hr)',
    deadline: 'Rolling',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&auto=format&fit=crop&q=80',
    description: 'Organize campus developer meetups, distribute student swags, and onboard university cohorts.',
    requirements: 'Active student leader with great communication and event management interest.',
  },
  {
    id: 'job-3',
    title: 'Junior Frontend Developer Intern',
    company: 'Veloce Digital Media',
    type: 'Internship',
    location: 'Remote / Flexible',
    stipend: '$600/mo',
    deadline: 'In 2 weeks',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80',
    description: 'Collaborate with senior engineers on client dashboards, responsive UI components, and Figma prototypes.',
    requirements: 'Portfolio with 2+ completed web projects, Tailwind CSS proficiency.',
  },
  {
    id: 'job-4',
    title: 'Research Assistant (AI & Data Science)',
    company: 'University Research Park',
    type: 'Job',
    location: 'University Science Quad',
    stipend: 'Full Grant + Stipend ($550/mo)',
    deadline: 'Next Month',
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=500&auto=format&fit=crop&q=80',
    description: 'Assist in training computer vision models for environmental monitoring and drafting paper submissions.',
    requirements: 'Python, PyTorch/TensorFlow, strong statistics foundation.',
  },
  {
    id: 'job-5',
    title: 'Student IT Support Specialist (Attachment)',
    company: 'Campus Computing Services',
    type: 'Attachment',
    location: 'Central Library Level 2',
    stipend: 'Academic Credit + $350/mo',
    deadline: 'In 1 week',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=80',
    description: 'Diagnose campus network issues, maintain computer lab workstations, and support faculty digital systems.',
    requirements: 'Enrolled in Computer Science, IT, or Electrical Engineering.',
  }
];

export const INITIAL_LOCAL_LISTINGS: LocalListingItem[] = [
  {
    id: 'loc-1',
    name: 'Cedar Heights Student Hostel',
    type: 'Hostel',
    distance: '350m from Main Gate',
    price: '$120 / month',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80',
    ],
    youtubeVideoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
    youtubeTitle: 'Cedar Heights Deluxe Room Walkthrough & Student Facility Tour',
    whatsappNumber: '254712345678',
    badge: 'Solar & Fiber Wi-Fi',
    address: '14 University Road, North Gate, Campus Hub',
    contact: '+254 712 345 678',
    email: 'admissions@cedarheightshostel.com',
    caretakerName: 'Mr. David Omondi (Hostel Warden)',
    description: 'Premier student residency featuring furnished ensuite rooms, 24/7 solar backup electricity, uninterrupted high-speed fiber internet, rooftop study terrace, and biometric security gates.',
    amenities: [
      '24/7 Solar Electricity & Backup Gen',
      'High-Speed Unlimited Fiber Wi-Fi',
      'Hot Shower & Ensuite Bathrooms',
      'Quiet Study Hall & Library Corner',
      'Modern Communal Kitchen & Microwave',
      'Biometric Gate Access & CCTV',
      'Weekly Room Cleaning & Laundry Area',
      'Water Borehole (No Water Shortages)',
    ],
    likesCount: 1420,
    sharesCount: 384,
    reviewsCount: 86,
    operatingHours: '24/7 Student Security Desk',
    roomOptions: [
      { name: 'Single Deluxe Ensuite', price: '$150/mo', description: 'Private room with personal balcony, study desk, wardrobe, and ensuite hot shower.' },
      { name: 'Double Shared Room', price: '$120/mo', description: 'Spacious room shared by 2 students with partitioned study areas and twin beds.' },
      { name: 'Executive Studio', price: '$210/mo', description: 'Self-contained kitchenette, mini fridge, smart TV, and private entrance.' },
    ],
    reviews: [
      { user: 'Sharon W.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', rating: 5, comment: 'The Wi-Fi is super fast for online lectures and the backup solar means never worrying about power outages during exams!', date: '2 days ago' },
      { user: 'Brian K.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', rating: 5, comment: 'Clean compound, quiet environment to study, and only a 5-minute walk to the engineering lecture theatre.', date: '1 week ago' },
      { user: 'Mercy N.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', rating: 4.5, comment: 'The caretaker Mr. David is very supportive. Maintenance requests get solved the same day.', date: '2 weeks ago' }
    ]
  },
  {
    id: 'loc-2',
    name: 'Greenview Executive Student Residency',
    type: 'Hostel',
    distance: '600m from Science Block',
    price: '$150 / month',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4550?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    ],
    youtubeVideoUrl: 'https://www.youtube.com/embed/LXb3EKWsInQ',
    youtubeTitle: 'Greenview Executive Modern Hostel Full Tour & Amenities Guide',
    whatsappNumber: '254722987654',
    badge: 'Ensuite & Kitchenette',
    address: '8 Academic Way, Campus West Gate',
    contact: '+254 722 987 654',
    email: 'info@greenviewresidency.co',
    caretakerName: 'Madam Grace Akinyi',
    description: 'Eco-friendly, serene student complex with modern kitchenettes, private reading desks, landscaped garden for group discussions, and high-speed Wi-Fi across all floors.',
    amenities: [
      'Private In-Room Kitchenette & Sink',
      'Fiber Mesh Wi-Fi on Every Floor',
      'Dedicated Study Lounge & Whiteboard',
      'CCTV Monitoring & Night Security Guard',
      'Onsite Mini-Mart & Laundry Machines',
      'Solar Heated Showers',
      'Free Parking for Bikes and Scooters',
    ],
    likesCount: 2310,
    sharesCount: 612,
    reviewsCount: 114,
    operatingHours: 'Reception 6:00 AM - 11:00 PM',
    roomOptions: [
      { name: 'Standard Studio Ensuite', price: '$150/mo', description: 'Personal bathroom, kitchenette, study chair, orthopedic mattress, closet.' },
      { name: 'Premium Garden View Room', price: '$175/mo', description: 'Overlooks the green inner lawn, extra soundproofing, private workspace.' },
    ],
    reviews: [
      { user: 'Kevin O.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', rating: 5, comment: 'The kitchenettes make cooking so easy. Best value for money around campus!', date: '3 days ago' }
    ]
  },
  {
    id: 'loc-3',
    name: 'The Campus Grand Hotel & Suites',
    type: 'Hotel',
    distance: '1.2km from Campus',
    price: '$45 / night',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
    ],
    youtubeVideoUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
    youtubeTitle: 'Campus Grand Hotel Suites & Visitor Accommodations',
    whatsappNumber: '254733112233',
    badge: 'Great for Parents & Visitors',
    address: '42 Perimeter Expressway, University Commercial Zone',
    websiteUrl: 'https://www.campusgrandhotel.com',
    contact: '+254 733 112 233',
    email: 'reservations@campusgrandhotel.com',
    caretakerName: 'Concierge Desk Team',
    description: 'Boutique hotel tailored for visiting parents, guest lecturers, conference attendees, and graduation weekend stays. Features complimentary hot breakfast, airport & campus shuttle, and high-speed business Wi-Fi.',
    amenities: [
      'Complimentary Gourmet Buffet Breakfast',
      'Free Campus & Airport Shuttle Service',
      'Swimming Pool & Fitness Gym',
      'Air Conditioned Suites with Smart TVs',
      'Conference & Meeting Facilities',
      '24-Hour Room Service & Restaurant',
    ],
    menus: [
      {
        category: '🍳 Breakfast & Brunch (6:30 AM - 11:00 AM)',
        items: [
          { name: 'Grand Continental Buffet', price: '$8.50', description: 'Fresh croissants, pancakes, farm eggs made-to-order, bacon, fresh fruit platter & Kenyan coffee.', tag: 'Popular' },
          { name: 'Avocado Sourdough Toast & Poached Eggs', price: '$6.00', description: 'Crushed avocado, microgreens, feta crumbles, chilli flakes on artisan sourdough.', tag: 'Healthy' },
          { name: 'Fresh Tropical Fruit & Greek Yogurt Parfait', price: '$4.50', description: 'Layered honey yogurt, organic chia seeds, mango, kiwi & toasted granola.' }
        ]
      },
      {
        category: '🍽️ Mains & Chef Specials (All Day)',
        items: [
          { name: 'Prime Charcoal-Grilled Sirloin Steak', price: '$16.00', description: 'Tender 250g sirloin, rosemary garlic butter, truffle fries & garden greens.', tag: 'Chef Signature' },
          { name: 'Creamy Tuscan Chicken Fettuccine', price: '$12.50', description: 'Pan-seared chicken breast, sun-dried tomatoes, baby spinach in rich parmesan sauce.' },
          { name: 'Pan-Roasted Tilapia Fillet & Coconut Rice', price: '$14.00', description: 'Fresh lake tilapia, spicy coconut-coriander reduction, steamed jasmine rice.' },
          { name: 'Crispy Gourmet Beef Burger & Wedges', price: '$10.00', description: '200g smashed patty, cheddar cheese, caramelized onions, smoked chipotle aioli.', tag: 'Student Deal' }
        ]
      },
      {
        category: '☕ Beverages, Juices & Mocktails',
        items: [
          { name: 'Specialty Kenyan AA Pour-Over Coffee', price: '$3.50', description: 'Single origin high altitude arabica with bright floral and blackcurrant notes.' },
          { name: 'Passion-Mint Fresh Lemonade Cooler', price: '$4.00', description: 'Cold-pressed passion fruit juice, fresh mint leaves & sparkling soda.' },
          { name: 'Iced Caramel Macchiato', price: '$4.50', description: 'Espresso shot, chilled creamy whole milk, vanilla and homemade caramel drizzle.' }
        ]
      }
    ],
    services: [
      { title: 'Airport & Campus Shuttle', priceOrStatus: 'Complimentary for Guests', description: 'Scheduled drop-offs and pick-ups to campus gates, alumni auditoriums, and airport terminal.', icon: 'bus' },
      { title: '24/7 In-Room Dining Service', priceOrStatus: 'Available 24/7', description: 'Freshly prepared hot meals, snacks, and beverages delivered directly to your suite door.', icon: 'utensils' },
      { title: 'Executive Conference & Seminar Hall', priceOrStatus: 'From $120 / half-day', description: 'Seats up to 80 guests with HD laser projector, wireless mics, podium, and catering services.', icon: 'presentation' },
      { title: 'Laundry & Express Dry Cleaning', priceOrStatus: '$8 / regular load', description: 'Same-day wash, dry, iron, and steam-press returned within 6 hours.', icon: 'sparkles' },
      { title: 'Rooftop Heated Pool & Spa Therapy', priceOrStatus: 'Included in Stay', description: 'Panoramic campus views, temperature-controlled water, sauna, and massage therapy on booking.', icon: 'waves' },
    ],
    likesCount: 980,
    sharesCount: 195,
    reviewsCount: 42,
    operatingHours: '24/7 Check-in & Concierge',
    roomOptions: [
      { name: 'Deluxe Queen Suite', price: '$45/night', description: 'Queen-sized plush bed, workspace, luxury bathroom, free breakfast included.' },
      { name: 'Family Executive Suite', price: '$75/night', description: 'Two interconnected rooms ideal for parents visiting during matriculation or graduation.' },
    ],
    reviews: [
      { user: 'Dr. Mensah', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', rating: 5, comment: 'Stayed here for the annual academic symposium. Excellent service and tasty breakfast buffet.', date: '5 days ago' }
    ]
  },
  {
    id: 'loc-4',
    name: 'University Inn & Conference Lodge',
    type: 'Hotel',
    distance: '800m from Alumni Center',
    price: '$38 / night',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop&q=80',
    ],
    youtubeVideoUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ',
    youtubeTitle: 'University Inn Guest Rooms & Campus Conference Hall',
    whatsappNumber: '254744556677',
    badge: 'Free Breakfast & Shuttle',
    address: 'Alumni Boulevard, Gate 2',
    websiteUrl: 'https://www.universityinnlodge.org',
    contact: '+254 744 556 677',
    email: 'frontdesk@universityinnlodge.org',
    caretakerName: 'Front Office Reception',
    description: 'Charming guest lodge surrounded by calm pine trees. Ideal for visiting researchers, short-stay scholars, and families visiting campus.',
    amenities: [
      'Free High-Speed Wi-Fi',
      'Daily Housekeeping Service',
      'Complimentary Morning Coffee & Tea',
      'Free Onsite Secure Parking',
      'Quiet Garden Work Pods',
    ],
    menus: [
      {
        category: '🥞 Garden Cafe Breakfast',
        items: [
          { name: 'University Inn Breakfast Set', price: '$5.50', description: 'Two sunny eggs, grilled sausage, buttered toast, jam & tea.' },
          { name: 'Warm Cinnamon Oatmeal Bowl', price: '$3.50', description: 'Rolled oats with brown sugar, sliced banana, walnuts & warm almond milk.' }
        ]
      },
      {
        category: '🥪 Light Meals & Scholar Lunches',
        items: [
          { name: 'Club Sandwich & Herb Fries', price: '$7.00', description: 'Triple-decker smoked turkey, fried egg, lettuce, tomato & garlic dip.' },
          { name: 'Roasted Butternut Squash Soup', price: '$4.50', description: 'Smooth spiced squash soup served with warm garlic baguette.' }
        ]
      }
    ],
    services: [
      { title: 'Campus Gate Shuttle', priceOrStatus: 'Free Every 30 Mins', description: 'Continuous shuttle vans connecting to Central Lecture Hall & Library.', icon: 'bus' },
      { title: 'Study Workstation Pods', priceOrStatus: 'Complimentary', description: 'Individual quiet garden study cubicles with power sockets and fast Wi-Fi.', icon: 'book' },
      { title: 'Luggage Storage & Locker Service', priceOrStatus: 'Free for Guests', description: 'Secure luggage deposit before check-in or after graduation check-out.', icon: 'lock' },
    ],
    likesCount: 650,
    sharesCount: 120,
    reviewsCount: 31,
    operatingHours: '24/7 Front Desk',
    roomOptions: [
      { name: 'Single Standard Guest Room', price: '$38/night', description: 'Single bed, work desk, private bath, and fresh linens.' },
      { name: 'Twin Guest Room', price: '$52/night', description: 'Two twin beds, spacious lounge chair, garden view.' },
    ],
    reviews: [
      { user: 'Esther M.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', rating: 4.8, comment: 'Quiet place to relax during research trips. Staff was very accommodating.', date: '2 weeks ago' }
    ]
  },
  {
    id: 'loc-5',
    name: 'The Spot: Student Esports & Game Lounge',
    type: 'Entertainment',
    distance: '200m from Student Union',
    price: 'Free Entry / $3 VR Session',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80',
    ],
    youtubeVideoUrl: 'https://www.youtube.com/embed/K8vE62NqH_4',
    youtubeTitle: 'Campus Gaming Arena & VR Experience at The Spot',
    whatsappNumber: '254700889900',
    badge: 'PS5, Billiards & Boba',
    address: 'Student Hub Plaza, 2nd Floor, Room 204',
    contact: '+254 700 889 900',
    email: 'thespotgames@campushub.com',
    caretakerName: 'Sam & Tariq (Arena Managers)',
    description: 'The ultimate campus entertainment hub! PS5 tournament stations, high-end RTX 4080 gaming PCs, VR flight simulators, pool tables, board games corner, and a fresh iced boba tea bar.',
    amenities: [
      '12x PS5 Consoles with FIFA / NBA 2K / Tekken',
      'High-FPS PC Gaming Rigs (Valorant, CS2, Fortnite)',
      'Meta Quest 3 VR Simulators',
      'Billiards & Foosball Tables',
      'Boba Tea, Smoothies & Snack Bar',
      'Weekly Campus Tournaments & Cash Prizes',
    ],
    likesCount: 3820,
    sharesCount: 1420,
    reviewsCount: 240,
    operatingHours: 'Daily 10:00 AM - 11:30 PM',
    roomOptions: [
      { name: '1-Hour Console Pass', price: '$2.50', description: 'Unlimited console gaming on PS5 / Xbox Series X.' },
      { name: 'All-Day Weekend Gamer Pass', price: '$10.00', description: 'Full access to PC arena, consoles, pool tables, and free boba drink.' },
    ],
    reviews: [
      { user: 'Caleb Z.', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', rating: 5, comment: 'The FIFA tournaments every Friday night are insane. Vibes are top tier!', date: '1 day ago' }
    ]
  },
  {
    id: 'loc-6',
    name: 'Campus Cinema & Amphitheatre Nights',
    type: 'Entertainment',
    distance: 'On Campus (East Quad)',
    price: '$4 Student Ticket',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&auto=format&fit=crop&q=80',
    ],
    youtubeVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    youtubeTitle: 'Outdoor Movie Night & Live Concert Under the Stars',
    whatsappNumber: '254711223344',
    badge: 'Every Friday & Saturday',
    address: 'Arts Faculty Lawn, Campus Amphitheatre',
    contact: '+254 711 223 344',
    email: 'cinema@studentunion.edu',
    caretakerName: 'Student Union Social Director',
    description: 'Outdoor movie screenings, stand-up comedy nights, acoustic live music sessions, and student film festivals under the stars with fresh popcorn and cozy beanbags.',
    amenities: [
      '4K Laser Outdoor Projection Screen',
      'Dolby Surround Sound System',
      'Plush Bean Bags & Blanket Rentals',
      'Popcorn, Nachos & Cold Drinks Stalls',
      'Student Discount on Valid ID',
    ],
    likesCount: 1890,
    sharesCount: 450,
    reviewsCount: 78,
    operatingHours: 'Fri & Sat: 7:00 PM - 11:00 PM',
    roomOptions: [
      { name: 'Standard Screening Pass', price: '$4.00', description: 'Entry + regular popcorn bucket.' },
      { name: 'VIP Beanbag & Combo', price: '$7.50', description: 'Front row beanbag seat, large popcorn, drink, and candy.' },
    ],
    reviews: [
      { user: 'Amanda L.', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', rating: 5, comment: 'Great weekend date night or chill hangout spot with friends after exam week.', date: '4 days ago' }
    ]
  },
  {
    id: 'loc-7',
    name: 'Campus University Health Center & Clinic',
    type: 'Health',
    distance: 'Inside Campus (Medical Wing)',
    price: 'Covered by Student Card',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80',
    ],
    youtubeVideoUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
    youtubeTitle: 'University Medical Services & Student Emergency Response',
    whatsappNumber: '254799000111',
    badge: '24/7 Emergency & Pharmacy',
    address: 'Health Wing, Sector 3, Opposite Science Complex',
    contact: '+254 799 000 111',
    email: 'healthcenter@university.edu',
    caretakerName: 'Dr. Patricia Ndung\'u (Chief Medical Officer)',
    description: 'Fully equipped university clinic offering free consultations, acute outpatient treatment, 24/7 ambulance hotline, subsidized prescription pharmacy, and dental checkups for all registered students.',
    amenities: [
      '24/7 Emergency Casualty & Triage',
      'Free Doctor Consultations with Student ID',
      'Onsite Dispensing Pharmacy',
      'Diagnostic Lab & Rapid Blood/Malaria Tests',
      'Dental & Optical Checkup Unit',
      'Ambulance Fast-Response Service',
    ],
    likesCount: 1540,
    sharesCount: 290,
    reviewsCount: 95,
    operatingHours: '24 Hours / 7 Days a Week',
    roomOptions: [
      { name: 'General Student Consultation', price: 'Free / Insured', description: 'Walk-in outpatient medical consultation with licensed campus physicians.' },
      { name: 'Dental & Vision Screening', price: '$5 Copay', description: 'Preventative cleaning and basic eye prescription testing.' },
    ],
    reviews: [
      { user: 'Daniel M.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', rating: 5, comment: 'Got my allergy meds instantly with my student card. Nurses were very gentle and caring.', date: '3 days ago' }
    ]
  },
  {
    id: 'loc-8',
    name: 'MindCare Student Wellness & Counseling Hub',
    type: 'Health',
    distance: 'Near Main Library',
    price: 'Free Confidential Care',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800&auto=format&fit=crop&q=80',
    ],
    youtubeVideoUrl: 'https://www.youtube.com/embed/LXb3EKWsInQ',
    youtubeTitle: 'Mental Wellness, Mindfulness Sessions & Student Peer Support',
    whatsappNumber: '254788333444',
    badge: 'Mental Health & Peer Support',
    address: 'Student Support Center, Room 104, Campus Quad',
    contact: '+254 788 333 444',
    email: 'mindcare@university.edu',
    caretakerName: 'Counseling Guild Team',
    description: 'Dedicated safe space for students offering 1-on-1 confidential counseling, exam stress management, mindfulness workshops, and peer-to-peer mentoring groups.',
    amenities: [
      '100% Confidential 1-on-1 Counseling Sessions',
      'Exam Anxiety & Burnout Workshops',
      'Meditation & Sensory Relax Room',
      '24/7 Student Distress Helpline & WhatsApp Hotline',
      'Peer Support Circles & Guided Journaling',
    ],
    likesCount: 2670,
    sharesCount: 890,
    reviewsCount: 165,
    operatingHours: 'Mon - Sat: 8:00 AM - 8:00 PM',
    roomOptions: [
      { name: '1-on-1 Counseling Session', price: 'Free', description: 'Book private 45-min talk therapy with student counselor.' },
      { name: 'Group Mindfulness Circle', price: 'Free', description: 'Drop-in guided breathing and stress relief meditation.' },
    ],
    reviews: [
      { user: 'Clara E.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', rating: 5, comment: 'Helped me overcome intense finals anxiety. Life-saving campus resource!', date: '1 week ago' }
    ]
  },
  {
    id: 'loc-serv-1',
    name: 'TechFix Pro: Student Laptop & Phone Repairs',
    type: 'Service',
    serviceCategory: 'Tech & Laptop Repairs',
    distance: '150m from Tech Complex (Gate 1)',
    price: 'From $10 • Free Diagnostic',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    ],
    youtubeVideoUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
    youtubeTitle: 'TechFix Lab Tour: 30-Min Fast Laptop Screen & Motherboard Repair',
    whatsappNumber: '254710112233',
    badge: '3-Month Student Warranty',
    address: 'Campus Innovation Hub, Stall 12, Ground Floor',
    contact: '+254 710 112 233',
    email: 'repairs@techfixcampus.com',
    caretakerName: 'Eng. Collins & Kelvin (Certified Techs)',
    description: 'Certified campus technician workshop specializing in MacBook & Windows laptop screen repairs, SSD storage upgrades, phone battery/screen replacement, keyboard fixes, liquid damage recovery, and OS reinstallation with genuine antivirus.',
    amenities: [
      '⚡ 30-Minute Express Screen & Battery Replacement',
      '🛡️ 90-Day Free Warranty on All Replaced Parts',
      '💻 RAM & NVMe SSD Speed Boost Upgrades',
      '🩺 Free Computer Diagnostic Check for Students',
      '🔋 Original Charger & Battery Replacements',
      '💾 Data Recovery from Dead Hard Drives',
    ],
    services: [
      { title: 'Free Diagnostic & Troubleshooting', priceOrStatus: 'Free with Student ID', description: 'Full hardware & software diagnostic scan to identify charging, overheating, or boot loop issues.', icon: 'search' },
      { title: 'Laptop Screen Replacement (MacBook / Dell / HP / Lenovo)', priceOrStatus: 'From $35', description: 'Genuine high-brightness display replacement installed in under 45 minutes.', icon: 'monitor' },
      { title: 'SSD Upgrade & High-Speed OS Cloning', priceOrStatus: 'From $25 (Includes 256GB/512GB)', description: 'Boost slow laptop booting speed by up to 10x with superfast NVMe/SATA SSD.', icon: 'hard-drive' },
      { title: 'Smartphone Screen & Battery Swap (iPhone & Android)', priceOrStatus: 'From $15', description: 'Original OLED and IPS screens with responsive touch calibration.', icon: 'smartphone' },
      { title: 'Liquid Spill & Motherboard Chemical Cleaning', priceOrStatus: 'From $20', description: 'Ultrasonic board wash and micro-soldering component restoration.', icon: 'cpu' },
    ],
    likesCount: 3120,
    sharesCount: 780,
    reviewsCount: 198,
    operatingHours: 'Mon - Sat: 8:00 AM - 7:30 PM',
    reviews: [
      { user: 'Victor K.', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', rating: 5, comment: 'Replaced my Dell laptop keyboard and upgraded to SSD in 40 mins right before my coding exam. Lifesaver!', date: '2 days ago' },
      { user: 'Rachel A.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', rating: 5, comment: 'Transparent pricing and they gave a 3-month warranty card. Highly recommended for students.', date: '1 week ago' }
    ]
  },
  {
    id: 'loc-serv-2',
    name: 'Campus Elite Barber & Beauty Lounge',
    type: 'Service',
    serviceCategory: 'Grooming & Salon',
    distance: '80m from Main Gate Shopping Arcade',
    price: 'Student Fades $4 • Salon from $8',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    ],
    youtubeVideoUrl: 'https://www.youtube.com/embed/LXb3EKWsInQ',
    youtubeTitle: 'Campus Elite Barbershop & Hair Lounge Showcase',
    whatsappNumber: '254720223344',
    badge: 'Walk-ins & WhatsApp Queue',
    address: 'Arcade Block B, Suite 04, Next to Java Coffee',
    contact: '+254 720 223 344',
    email: 'booking@campuselitebarber.com',
    caretakerName: 'Master Stylist Tariq & Brenda',
    description: 'Modern grooming studio with air conditioning, PS5 gaming while waiting, professional hot towel shaves, crisp taper fades, knotless braids, locs retwist, facial treatments, and manicure bar.',
    amenities: [
      '💈 Clean Sanitized Blades & Professional Clippers',
      '🎮 PS5 & FIFA Station for Waiting Clients',
      '❄️ Air Conditioned Lounge with Free Wi-Fi',
      '💇‍♀️ Braiding, Locs, Weaves & Wigs Styling',
      '🧖 Hot Towel Beard Treatment & Facial Scrub',
      '💳 M-Pesa, Card & Student Cash Accepted',
    ],
    services: [
      { title: 'Student Signature Fade & Sharp Lineup', priceOrStatus: '$4.00', description: 'Low/mid/high skin fade, buzz cut, or taper with aftershave and scalp massage.', icon: 'scissors' },
      { title: 'Beard Grooming, Oil Treatment & Hot Towel', priceOrStatus: '$2.50', description: 'Beard shaping, organic hydration oil, and steam towel relaxation.', icon: 'sparkles' },
      { title: 'Knotless Braids & Box Braids (Full Head)', priceOrStatus: 'From $12.00', description: 'Neat, painless styling by experienced campus hair braiders.', icon: 'user' },
      { title: 'Dreadlocks Retwist & Interlocking', priceOrStatus: 'From $8.00', description: 'Organic beeswax wash, deep conditioning, and style twists.', icon: 'activity' },
      { title: 'Student Manicure & Gel Nail Polish', priceOrStatus: '$6.00', description: 'Cuticle care, hand massage, and long-lasting gel coating.', icon: 'heart' },
    ],
    likesCount: 2450,
    sharesCount: 620,
    reviewsCount: 142,
    operatingHours: 'Daily 7:30 AM - 9:30 PM',
    reviews: [
      { user: 'Sammy T.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', rating: 5, comment: 'Best skin fade in town. Plus you get to play FIFA while waiting for your turn!', date: '3 days ago' }
    ]
  },
  {
    id: 'loc-serv-3',
    name: 'SpeedPrint & Thesis Express Binding',
    type: 'Service',
    serviceCategory: 'Printing & Thesis',
    distance: 'Opposite University Central Library',
    price: '$0.03 / page • Hardcover $6',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=80',
    ],
    youtubeVideoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
    youtubeTitle: 'SpeedPrint Academic Dissertation Hardbound Gold Embossing',
    whatsappNumber: '254730334455',
    badge: '1-Hour Thesis Binding',
    address: 'Library Walkway, Booth 3, Academic Square',
    contact: '+254 730 334 455',
    email: 'print@speedprintcampus.com',
    caretakerName: 'Moses N. (Print Supervisor)',
    description: 'High-speed digital printing, university-standard gold-embossed thesis hardcovers, spiral binding, large format engineering blueprints, flyer design, laminated posters, and PDF cloud print via WhatsApp.',
    amenities: [
      '⚡ 1-Hour Rush Thesis Hardcover Binding with Gold Emboss',
      '📄 High-Speed Duplex Laser Color & B/W Printing',
      '📐 Architectural & Engineering A1/A0 Plotter Prints',
      '📲 WhatsApp Document Print & Collect at Counter',
      '🗂️ Spiral, Tape & Thermal Book Binding',
      '🎨 Graphic Design & CV Formatting Assistance',
    ],
    services: [
      { title: 'Academic Thesis Hardcover Gold-Stamping', priceOrStatus: '$6.00 / copy', description: 'Embassy & graduate school compliant leatherette hardcover with gold lettering.', icon: 'book' },
      { title: 'High-Speed B&W Double-Sided Printing', priceOrStatus: '$0.03 / page', description: 'Crystal-clear 1200 DPI laser printing on 80gsm premium paper.', icon: 'file' },
      { title: 'Full Color Presentation Printing', priceOrStatus: '$0.15 / page', description: 'Vibrant color graphics on glossy or matte presentation sheets.', icon: 'image' },
      { title: 'Spiral & Wire-O Project Binding', priceOrStatus: '$1.00 / booklet', description: 'Durable clear plastic front and frosted back cover binding.', icon: 'layers' },
      { title: 'Professional CV & Resume Redesign + Print', priceOrStatus: '$3.50', description: 'ATS-compliant modern resume formatting and 5 embossed copies.', icon: 'user' },
    ],
    likesCount: 1980,
    sharesCount: 410,
    reviewsCount: 88,
    operatingHours: 'Mon - Sun: 7:00 AM - 10:00 PM',
    reviews: [
      { user: 'Diana P.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', rating: 5, comment: 'Bound 3 copies of my final year engineering project in less than 45 minutes! Gold embossing looks pristine.', date: '4 days ago' }
    ]
  },
  {
    id: 'loc-serv-4',
    name: 'CleanCycles Campus Laundry & Dry Clean Hub',
    type: 'Service',
    serviceCategory: 'Laundry & Dry Clean',
    distance: '200m from North Gate Hostels',
    price: '$2.50 / kg • Free Hostel Delivery',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&auto=format&fit=crop&q=80',
    ],
    youtubeVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    youtubeTitle: 'CleanCycles Modern Eco-Friendly Laundry & Ironing Process',
    whatsappNumber: '254740445566',
    badge: 'Same-Day Return & Free Delivery',
    address: 'North Gate Commercial Block, Unit 8',
    contact: '+254 740 445 566',
    email: 'hello@cleancycleslaundry.com',
    caretakerName: 'Mama Lucy & Team',
    description: 'Effortless student laundry service offering wash, tumble dry, fresh scented softener, crisp ironing, and duvet deep-cleaning with convenient doorstep pickup and delivery to all hostels.',
    amenities: [
      '🚚 Free Doorstep Pickup & Delivery to Student Hostels',
      '🧺 Same-Day Express Wash, Dry & Fold Service',
      '👔 Steam Ironing for Suits, Shirts & Graduation Gowns',
      '🛏️ Heavy Duvet, Blanket & Bedding Deep Sanitization',
      '🌸 Hypoallergenic Scented Fabric Conditioners',
      '🏷️ Individual Tagging (No Lost or Mixed Clothes Guarantee)',
    ],
    services: [
      { title: 'Standard Wash, Dry & Fold (Per Kg)', priceOrStatus: '$2.50 / kg', description: 'Machine wash with premium detergent, tumble dry, and neatly folded.', icon: 'shopping-bag' },
      { title: 'Student Weekly Bag Deal (Up to 7kg)', priceOrStatus: '$12.00 / bag', description: 'Full student weekly wash, dried, ironed and delivered to your room.', icon: 'tag' },
      { title: 'Heavy Duvet & Comforter Wash', priceOrStatus: '$4.50 / piece', description: 'Deep anti-dust mite sanitization wash and gentle heated drying.', icon: 'cloud' },
      { title: 'Suit, Blazer & Graduation Gown Dry Clean', priceOrStatus: '$5.00', description: 'Professional stain removal, steam press, and hanger bag.', icon: 'sparkles' },
    ],
    likesCount: 1650,
    sharesCount: 340,
    reviewsCount: 76,
    operatingHours: 'Daily 7:00 AM - 8:30 PM',
    reviews: [
      { user: 'Faith K.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', rating: 5, comment: 'They pick up right outside my hostel room and bring it back folded and smelling great by evening!', date: '5 days ago' }
    ]
  },
  {
    id: 'loc-serv-5',
    name: 'FocusTutors: Academic Peer Coaching & Masterclasses',
    type: 'Service',
    serviceCategory: 'Tutoring & Coaching',
    distance: 'Student Center Study Rooms / Online',
    price: '$6 / hr • First 30 Mins Free',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    ],
    youtubeVideoUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
    youtubeTitle: 'FocusTutors Peer Learning Circles & Exam Problem Solving',
    whatsappNumber: '254750556677',
    badge: 'Top 1% Peer Mentors',
    address: 'Student Center Level 3, Room 302',
    contact: '+254 750 556 677',
    email: 'tutors@focustutorshub.org',
    caretakerName: 'Academic Honors Council',
    description: 'High-impact 1-on-1 tutoring and group crash courses taught by straight-A senior students and graduate teaching assistants in Calculus, Data Structures, Economics, Organic Chemistry, and Academic Writing.',
    amenities: [
      '🎓 Verified High-GPA Student Mentors & TA Coaches',
      '📝 Past Exam Paper Step-by-Step Breakdown Sessions',
      '💻 Code Review, Python/Java/C++ Debugging Support',
      '☕ Free Coffee & Quiet Study Room Access Included',
      '🤝 1-on-1 Private Sessions or Small 4-Person Study Squads',
      '💯 100% Score Improvement or Money-Back Guarantee',
    ],
    services: [
      { title: '1-on-1 Private STEM Coaching (Math, CS, Eng, Chem)', priceOrStatus: '$6.00 / hr', description: 'Personalized pacing, homework assistance, and exam concept mastery.', icon: 'user-check' },
      { title: 'Weekend Exam Crash Course (4-Hour Group Masterclass)', priceOrStatus: '$10.00 / student', description: 'Intensive review of top 20 recurring exam questions with model answers.', icon: 'users' },
      { title: 'Coding Project Mentorship & GitHub Pair Programming', priceOrStatus: '$8.00 / session', description: 'Frontend, backend, SQL, and algorithm optimization guidance.', icon: 'code' },
      { title: 'Dissertation & Proposal Proofreading', priceOrStatus: '$15.00 / paper', description: 'Grammar, academic flow, APA/IEEE citations, and structural feedback.', icon: 'edit-3' },
    ],
    likesCount: 2890,
    sharesCount: 710,
    reviewsCount: 164,
    operatingHours: 'Mon - Sun: 8:00 AM - 10:00 PM',
    reviews: [
      { user: 'Brian M.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', rating: 5, comment: 'Passed Calculus II with an A- thanks to Caleb’s tutoring sessions. He explained Fourier series in 20 minutes!', date: '3 days ago' }
    ]
  },
  {
    id: 'loc-serv-6',
    name: 'Campus Lens Photography & Media Studio',
    type: 'Service',
    serviceCategory: 'Photography & Media',
    distance: 'Student Union Plaza Floor 2',
    price: 'Portraits from $5 • Events from $25',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&auto=format&fit=crop&q=80',
    ],
    youtubeVideoUrl: 'https://www.youtube.com/embed/LXb3EKWsInQ',
    youtubeTitle: 'Campus Lens Creative Graduation & Studio Portrait Reels',
    whatsappNumber: '254760667788',
    badge: 'Instant Digital Delivery',
    address: 'Plaza Media Wing, Studio 2B',
    contact: '+254 760 667 788',
    email: 'shoot@campuslensmedia.com',
    caretakerName: 'Leo & Joy (Creative Directors)',
    description: 'Professional campus photography & video production studio equipped with continuous studio lighting, backdrops, Sony FX3 4K cinema cameras, graduation gown photoshoot packages, and LinkedIn headshots.',
    amenities: [
      '📸 Professional Studio Lighting & Backdrop Choices',
      '🎓 Graduation Robes, Hoods & Props Provided Onsite',
      '⚡ 24-Hour Express Retouched Photo Delivery via Google Drive',
      '💼 Professional LinkedIn & CV Headshot Color Grading',
      '🎥 Student Club Event & Music Video Filming',
    ],
    services: [
      { title: 'LinkedIn / Passport Studio Headshot (3 Retouched Photos)', priceOrStatus: '$5.00', description: 'Professional studio lighting, natural skin retouching, delivered in 2 hours.', icon: 'camera' },
      { title: 'Graduation Family & Solo Portrait Package', priceOrStatus: '$20.00 (15 HD Photos)', description: 'Full studio session, gown props, 15 edited photos + 2 large framed prints.', icon: 'award' },
      { title: 'Campus Event / Club Gathering Photography', priceOrStatus: 'From $25.00 / hr', description: 'Candid event coverage, highlights reel, and full Google Drive photo gallery.', icon: 'video' },
    ],
    likesCount: 1420,
    sharesCount: 380,
    reviewsCount: 65,
    operatingHours: 'Daily 9:00 AM - 7:00 PM',
    reviews: [
      { user: 'Mercy W.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', rating: 5, comment: 'The lighting was so flattering for my graduation headshots. Received the edits the same evening!', date: '1 week ago' }
    ]
  }
];

export const CURATED_ENTERTAINMENT_MEDIA: EntertainmentMediaItem[] = [
  {
    id: 'ent-yt-1',
    title: 'Burna Boy - City Boys (Official Music Video)',
    category: 'music',
    youtubeId: 'Wd3hVjQ1e7U',
    duration: '3:20',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    artistOrDirector: 'Burna Boy',
    description: 'Top-charting Afrobeats hit with high-energy visuals and campus party anthem vibes.'
  },
  {
    id: 'ent-yt-2',
    title: 'Lofi Hip Hop Radio - Beats to Relax/Study to',
    category: 'study',
    youtubeId: 'jfKfPfyJRdk',
    duration: '24/7 Stream',
    thumbnail: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80',
    artistOrDirector: 'Lofi Girl',
    description: 'Calm ambient beats, soothing rain soundscapes, and non-stop focus music for exam prep.'
  },
  {
    id: 'ent-yt-3',
    title: 'Deadpool & Wolverine - Official Movie Trailer (2024)',
    category: 'movie',
    youtubeId: '73_1biulkYk',
    duration: '2:38',
    thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
    artistOrDirector: 'Marvel Studios',
    description: 'The explosive superhero blockbuster trailer with non-stop comedy and thrilling action.'
  },
  {
    id: 'ent-yt-4',
    title: 'Rema, Selena Gomez - Calm Down (Official Video)',
    category: 'music',
    youtubeId: 'WcIcVapfqXw',
    duration: '3:59',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    artistOrDirector: 'Rema & Selena Gomez',
    description: 'Global viral sensation blending Afrobeats rhythms with melodic vocal harmonies.'
  },
  {
    id: 'ent-yt-5',
    title: 'Interstellar - Official 4K IMAX Movie Trailer',
    category: 'movie',
    youtubeId: 'zSWdZVtXT7E',
    duration: '2:32',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    artistOrDirector: 'Christopher Nolan',
    description: 'Mind-bending sci-fi epic exploring space travel, relativity, black holes, and human love.'
  },
  {
    id: 'ent-yt-6',
    title: 'Valorant Champions Grand Finals - Top Best Plays & Highlights',
    category: 'gaming',
    youtubeId: 'K8vE62NqH_4',
    duration: '14:20',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    artistOrDirector: 'Riot Games Esports',
    description: 'Clutch moments, insane aces, and game-winning tournament rounds.'
  },
  {
    id: 'ent-yt-7',
    title: 'Deep Focus Brainwave Music for Coding & Complex Math',
    category: 'study',
    youtubeId: '5qap5aO4i9A',
    duration: '3:00:00',
    thumbnail: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
    artistOrDirector: 'Alpha Waves Lab',
    description: 'Scientifically tuned binaural beats to maximize retention and eliminate study fatigue.'
  },
  {
    id: 'ent-yt-8',
    title: 'Campus Standup Comedy Special - Student Life & Exam Struggles',
    category: 'podcast',
    youtubeId: 'LXb3EKWsInQ',
    duration: '22:15',
    thumbnail: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80',
    artistOrDirector: 'Student Comedy Guild',
    description: 'Hilarious comedy roast on hostel roommates, 8 AM lectures, and campus cafeteria food.'
  }
];

export const STUDENT_HEALTH_SYMPTOMS = [
  {
    id: 'sym-1',
    name: 'Fatigue & Brain Fog',
    category: 'Exhaustion / Sleep',
    severity: 'Mild',
    advice: 'Hydrate immediately, target 7.5 hours of sleep, and take a 20-minute screen-free break.',
    urgent: false,
  },
  {
    id: 'sym-2',
    name: 'Exam Stress & High Anxiety',
    category: 'Mental Wellness',
    severity: 'Moderate',
    advice: 'Use the 4-7-8 breathing circle below. You can also book a private consultation with MindCare counselors.',
    urgent: false,
  },
  {
    id: 'sym-3',
    name: 'High Fever (>38.5°C) & Chills',
    category: 'Infection / Flu',
    severity: 'High',
    advice: 'Visit Campus Medical Wing Sector 3 for a rapid malaria/blood test and antipyretics.',
    urgent: true,
  },
  {
    id: 'sym-4',
    name: 'Stomach Pain / Food Poisoning',
    category: 'Gastrointestinal',
    severity: 'Moderate',
    advice: 'Drink oral rehydration salts (ORS), avoid oily cafeteria foods, and visit clinic if vomiting persists.',
    urgent: false,
  },
  {
    id: 'sym-5',
    name: 'Tension Headache / Eye Strain',
    category: 'Neurological / Vision',
    severity: 'Mild',
    advice: 'Rest eyes with 20-20-20 rule (look 20ft away for 20s every 20 mins), drink 2 glasses of water.',
    urgent: false,
  },
  {
    id: 'sym-6',
    name: 'Persistent Cough / Chest Tightness',
    category: 'Respiratory',
    severity: 'Moderate',
    advice: 'Wear a face mask, steam inhalations, and get lungs checked at University Clinic.',
    urgent: true,
  }
];

export const SAMPLE_REVISION_NOTES = INITIAL_REVISION_NOTES;
export const MY_SAVED_NOTES = INITIAL_MY_SAVED_NOTES;
export const ATTACHMENTS_AND_JOBS = INITIAL_ATTACHMENTS_AND_JOBS;
export const LOCAL_LISTINGS = INITIAL_LOCAL_LISTINGS;




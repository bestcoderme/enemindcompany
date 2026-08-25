/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BusinessProfile,
  BusinessCategory,
  BusinessReview,
  CampusEvent,
  CampusEventType,
} from '../../types/business';

const STORAGE_KEY_BUSINESSES = 'enemind_campus_businesses_v1';
const STORAGE_KEY_EVENTS = 'enemind_campus_events_v1';

export const SEED_BUSINESSES: BusinessProfile[] = [
  {
    id: 'biz_juja_fries_hub',
    ownerId: 'owner_chef_brian',
    ownerName: 'Brian Kiprop (Chef BK)',
    businessName: 'Juja Shawarma & Gourmet Burgers',
    slug: 'juja-shawarma-gourmet-burgers',
    category: 'RESTAURANT',
    subcategory: 'Fast Food & Grills',
    description:
      'The #1 top-rated campus grill at JKUAT gate A! Serving freshly charcoal-grilled chicken shawarmas, loaded smash burgers, spiced masala fries, and ice-cold smoothies with instant hostel room delivery.',
    shortDescription: 'Signature loaded shawarmas, burgers & masala chips with hostel doorstep delivery.',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&auto=format&fit=crop&q=80',
    ],
    phone: '+254711223344',
    whatsappNumber: '+254711223344',
    email: 'jujashawarma@gmail.com',
    country: 'Kenya',
    city: 'Juja, Kiambu',
    campus: 'JKUAT Main Campus',
    universityName: 'Jomo Kenyatta University of Agriculture and Technology',
    location: 'Gate A Commercial Centre, Opposite Highpoint Plaza',
    address: 'Juja Gate A, Nairobi-Thika Superhighway',
    distanceFromCampus: '150m from Gate A',
    latitude: -1.1018,
    longitude: 37.0144,
    openingHours: {
      monday: '10:00 AM - 11:30 PM',
      tuesday: '10:00 AM - 11:30 PM',
      wednesday: '10:00 AM - 11:30 PM',
      thursday: '10:00 AM - 12:00 AM',
      friday: '10:00 AM - 1:00 AM',
      saturday: '10:00 AM - 1:00 AM',
      sunday: '11:00 AM - 11:00 PM',
      isOpenNow: true,
    },
    services: [],
    products: [],
    menu: [
      {
        id: 'menu_shawarma_special',
        name: 'The Mega Campus Loaded Shawarma (Chicken)',
        category: 'Shawarma & Wraps',
        description: 'Tender marinated roasted chicken breast with crunchy pickled slaw, tahini & signature chilli garlic sauce.',
        price: 320,
        currency: 'KSh',
        isAvailable: true,
        preparationTimeMinutes: 12,
        isPopular: true,
        image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=500&auto=format&fit=crop&q=80',
        options: [
          { name: 'Extra Cheese Slice', price: 50 },
          { name: 'Extra Garlic Sauce Dip', price: 30 },
          { name: 'Extra Chicken Filling', price: 100 },
        ],
      },
      {
        id: 'menu_beef_smash_burger',
        name: 'The Varsity Double Bacon Smash Burger',
        category: 'Burgers',
        description: 'Two 100% pure beef smashed patties, melted cheddar cheese, caramelized onions & secret house sauce on toasted brioche.',
        price: 450,
        currency: 'KSh',
        isAvailable: true,
        preparationTimeMinutes: 15,
        isPopular: true,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'menu_masala_fries',
        name: 'Spicy Masala Chips Platter',
        category: 'Sides & Fries',
        description: 'Golden fried potato chips tossed in aromatic tomato onion masala sauce with fresh coriander & lime.',
        price: 200,
        currency: 'KSh',
        isAvailable: true,
        preparationTimeMinutes: 8,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'menu_mango_passion_smoothie',
        name: 'Tropical Mango Passion Real Fruit Smoothie (500ml)',
        category: 'Drinks & Smoothies',
        description: 'Fresh local mango, passion fruit pulp, natural yoghurt and honey blended ice cold.',
        price: 180,
        currency: 'KSh',
        isAvailable: true,
        preparationTimeMinutes: 5,
        image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=500&auto=format&fit=crop&q=80',
      },
    ],
    amenities: ['Fast Delivery', 'Hostel Room Delivery', 'M-PESA Till Accepted', 'Late Night Open', 'Outdoor Seating', 'Free Wi-Fi'],
    pricingRange: 'KSh 150 - 650',
    currency: 'KSh',
    paymentMethods: ['M-PESA Till', 'Cash', 'Airtel Money'],
    bookingEnabled: true,
    orderingEnabled: true,
    deliveryEnabled: true,
    verificationStatus: 'VERIFIED',
    rating: 4.85,
    reviewCount: 48,
    reviews: [
      {
        id: 'rev_1',
        userId: 'u_joy_1',
        userName: 'Faith Mwangi',
        rating: 5,
        comment: 'Best chicken shawarma in Juja hands down! The delivery arrived in Hall 3 in just 20 minutes hot and delicious.',
        date: '2026-08-20',
        verifiedCustomer: true,
        ownerReply: 'Asante sana Faith! We value your feedback.',
      },
      {
        id: 'rev_2',
        userId: 'u_kelvin_2',
        userName: 'Kelvin Otieno',
        rating: 5,
        comment: 'The double smash burger is unbeatable. Highly recommend the masala chips too!',
        date: '2026-08-16',
        verifiedCustomer: true,
      },
    ],
    googleDriveFolderId: 'folder_biz_juja_shawarma',
    googleDriveFolderName: 'ENEMIND BUSINESS/Juja Shawarma & Gourmet Burgers',
    googleSheetId: 'sheet_juja_shawarma_db',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/sheet_juja_shawarma_db/edit',
    isStudentOwned: true,
    mpesaTillOrPaybill: 'Till 894321',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-08-24T18:00:00Z',
  },
  {
    id: 'biz_olympic_hostel',
    ownerId: 'owner_mama_wambui',
    ownerName: 'Gladys Wambui',
    businessName: 'Safari Green Executive Student Suites',
    slug: 'safari-green-executive-student-suites',
    category: 'HOSTEL',
    subcategory: 'Modern Student Hostels',
    description:
      'Premier purpose-built student residence located 300 meters from Kenyatta University (KU) Nyayo Gate. Features 24/7 biometric security, unlimited high-speed fibre Wi-Fi, constant solar hot water, study halls, and backup generator.',
    shortDescription: 'Modern, secure KU student suites with 24/7 Wi-Fi, hot showers, backup power & study rooms.',
    logo: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80',
    ],
    phone: '+254722998877',
    whatsappNumber: '+254722998877',
    email: 'info@safarigreenhostel.co.ke',
    country: 'Kenya',
    city: 'Kahawa Sukari, Nairobi',
    campus: 'Kenyatta University Main Campus',
    universityName: 'Kenyatta University',
    location: 'Off Balozi Road, 300m from Nyayo Gate',
    address: 'Kahawa Sukari 4th South Avenue, Nairobi',
    distanceFromCampus: '300m from KU Nyayo Gate',
    latitude: -1.1812,
    longitude: 36.9275,
    openingHours: {
      monday: '24 Hours Open (Gate Closes 11 PM for visitors)',
      isOpenNow: true,
    },
    services: [],
    products: [],
    menu: [],
    roomOptions: [
      {
        id: 'room_deluxe_single',
        name: 'Deluxe Ensuite Single Room',
        roomType: 'Single',
        priceMonthly: 12500,
        depositAmount: 12500,
        currency: 'KSh',
        availableUnits: 4,
        amenities: ['Private Bathroom/Toilet', 'Solar Hot Shower', 'Study Desk & Chair', 'Wardrobe', 'Balcony', 'Dedicated Wi-Fi AP'],
        description: 'Spacious self-contained private room with large window, reading desk, private ensuite bathroom and wardrobe.',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'room_double_shared',
        name: 'Executive Double Room (Shared 2 Pax)',
        roomType: 'Double',
        priceMonthly: 7500,
        depositAmount: 7500,
        currency: 'KSh',
        availableUnits: 6,
        amenities: ['Ensuite Bathroom', 'Two Separate Study Desks', 'Two Large Wardrobes', 'High Speed Wi-Fi', 'Solar Shower'],
        description: 'Budget-friendly shared room for two students with individual study workstations and closets.',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'room_bedsitter_studio',
        name: 'Modern Studio Bedsitter with Kitchenette',
        roomType: 'Bedsitter',
        priceMonthly: 16000,
        depositAmount: 16000,
        currency: 'KSh',
        availableUnits: 2,
        amenities: ['Fitted Kitchenette Sink & Shelves', 'Private Bathroom', 'High Ceiling', 'Pre-paid Token Meter', 'DSTV Socket'],
        description: 'Self-sufficient bedsitter studio ideal for postgraduate and senior university students.',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&auto=format&fit=crop&q=80',
      },
    ],
    amenities: [
      '24/7 Biometric Security',
      'CCTV Surveillance',
      'Solar Hot Showers',
      'Unlimited High-Speed Wi-Fi',
      'Quiet Study Library',
      'Standby Generator',
      'Borehole Water Backup',
      'Rooftop Lounge & Gym',
    ],
    pricingRange: 'KSh 7,500 - 16,000 / month',
    currency: 'KSh',
    paymentMethods: ['M-PESA Paybill 522522', 'Bank Transfer'],
    bookingEnabled: true,
    orderingEnabled: false,
    deliveryEnabled: false,
    verificationStatus: 'VERIFIED',
    rating: 4.92,
    reviewCount: 64,
    reviews: [
      {
        id: 'rev_hostel_1',
        userId: 'u_student_mary',
        userName: 'Mary Wanjiku',
        rating: 5,
        comment: 'I lived here throughout my 3rd year. Quiet environment, super clean, the Wi-Fi never goes down during exams!',
        date: '2026-08-18',
        verifiedCustomer: true,
      },
    ],
    googleDriveFolderId: 'folder_safari_green_hostel',
    googleDriveFolderName: 'ENEMIND BUSINESS/Safari Green Executive Student Suites',
    googleSheetId: 'sheet_safari_green_crm_db',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/sheet_safari_green_crm_db/edit',
    isStudentOwned: false,
    mpesaTillOrPaybill: 'Paybill 522522 Acc: SAFARI',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-08-23T14:00:00Z',
  },
  {
    id: 'biz_fadez_barbershop',
    ownerId: 'owner_dan_fadez',
    ownerName: 'Dan Kilonzo',
    businessName: 'Sharp Fadez Executive Campus Barbershop',
    slug: 'sharp-fadez-executive-campus-barbershop',
    category: 'BARBERSHOP',
    subcategory: 'Grooming & Hair Styling',
    description:
      'University of Nairobi student grooming sanctuary! Skin fades, beard sculpting, charcoal facial detox scrubs, hot towel treatments, and afro styling with PlayStation 5 gaming while you wait.',
    shortDescription: 'Precision skin fades, beard grooming, facials & hair coloring with VIP student booking.',
    logo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80',
    ],
    phone: '+254705112233',
    whatsappNumber: '+254705112233',
    email: 'sharpfadezuon@gmail.com',
    country: 'Kenya',
    city: 'Nairobi CBD',
    campus: 'University of Nairobi Main Campus',
    universityName: 'University of Nairobi',
    location: 'University Way, Opposite Gandhi Wing Gate',
    address: 'University Way Plaza 1st Floor, Nairobi',
    distanceFromCampus: '80m from Main Campus Gate',
    latitude: -1.2796,
    longitude: 36.8172,
    openingHours: {
      monday: '8:00 AM - 9:00 PM',
      tuesday: '8:00 AM - 9:00 PM',
      wednesday: '8:00 AM - 9:00 PM',
      thursday: '8:00 AM - 9:00 PM',
      friday: '8:00 AM - 10:00 PM',
      saturday: '8:00 AM - 10:00 PM',
      sunday: '10:00 AM - 8:00 PM',
      isOpenNow: true,
    },
    services: [
      {
        id: 'srv_signature_fade',
        name: 'Signature Student Skin Fade & Haircut',
        category: 'Haircut',
        description: 'Crisp tapered skin fade or buzz cut with razor edge line-up and soothing aftershave cologne.',
        price: 300,
        currency: 'KSh',
        durationMinutes: 30,
        isAvailable: true,
        requiresBooking: true,
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'srv_beard_trim',
        name: 'Beard Sculpting & Hot Towel Treatment',
        category: 'Beard',
        description: 'Beard trimming, organic cedar oil conditioning, and refreshing peppermint hot towel wrap.',
        price: 200,
        currency: 'KSh',
        durationMinutes: 20,
        isAvailable: true,
        requiresBooking: true,
      },
      {
        id: 'srv_facial_scrub',
        name: 'Deep Charcoal Facial Detox & Scrub',
        category: 'Facial',
        description: 'Blackhead extraction, activated charcoal exfoliating scrub, and clay face mask for glowing skin.',
        price: 500,
        currency: 'KSh',
        durationMinutes: 35,
        isAvailable: true,
        requiresBooking: true,
      },
    ],
    products: [],
    menu: [],
    amenities: ['PlayStation 5 Lounge', 'Air Conditioned', 'Free Wi-Fi', 'Apple Pay / M-PESA', 'Complimentary Bottled Water'],
    pricingRange: 'KSh 200 - 800',
    currency: 'KSh',
    paymentMethods: ['M-PESA Till', 'Cash'],
    bookingEnabled: true,
    orderingEnabled: false,
    deliveryEnabled: false,
    verificationStatus: 'VERIFIED',
    rating: 4.9,
    reviewCount: 35,
    reviews: [
      {
        id: 'rev_barber_1',
        userId: 'u_sam_uon',
        userName: 'Samuel Mwiti',
        rating: 5,
        comment: 'Dan is an artist with clippers! Booking on Enemind saved me an hour of waiting on Friday evening.',
        date: '2026-08-22',
        verifiedCustomer: true,
      },
    ],
    googleDriveFolderId: 'folder_sharp_fadez',
    googleDriveFolderName: 'ENEMIND BUSINESS/Sharp Fadez Executive Campus Barbershop',
    googleSheetId: 'sheet_sharp_fadez_appointments',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/sheet_sharp_fadez_appointments/edit',
    isStudentOwned: true,
    mpesaTillOrPaybill: 'Till 654982',
    createdAt: '2026-02-10T11:00:00Z',
    updatedAt: '2026-08-24T12:00:00Z',
  },
  {
    id: 'biz_speedy_print',
    ownerId: 'owner_kevin_tech',
    ownerName: 'Kevin Mutua',
    businessName: 'SpeedyPrint & Graphic Cyber Solutions',
    slug: 'speedyprint-graphic-cyber-solutions',
    category: 'PRINTING',
    subcategory: 'Thesis, Binding & Graphic Design',
    description:
      'High-speed academic document printing, thesis hardcover gold-embossed binding, architectural CAD plotting, passport photos, and custom campus merchandise printing for Strathmore & Madaraka students.',
    shortDescription: 'Thesis binding, high-speed color printing, flyers, graphic design & cyber services.',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1200&auto=format&fit=crop&q=80',
    phone: '+254719445566',
    whatsappNumber: '+254719445566',
    email: 'speedyprintke@gmail.com',
    country: 'Kenya',
    city: 'Madaraka, Nairobi',
    campus: 'Strathmore University',
    universityName: 'Strathmore University',
    location: 'Madaraka Shopping Complex, Shop 14',
    address: 'Madaraka Estate, Ole Sangale Road, Nairobi',
    distanceFromCampus: '100m from Strathmore Gate',
    openingHours: { monday: '7:30 AM - 9:00 PM', isOpenNow: true },
    services: [
      {
        id: 'srv_thesis_binding',
        name: 'Undergrad / Masters Thesis Hardcover Gold Foil Binding',
        category: 'Binding',
        description: 'University-standard hardcover spine with gold embossed university crest and lettering. 24h turnaround.',
        price: 900,
        currency: 'KSh',
        durationMinutes: 1440,
        isAvailable: true,
        requiresBooking: true,
      },
      {
        id: 'srv_cad_printing',
        name: 'A1 / A2 Architectural & Engineering CAD Plotting',
        category: 'Large Format',
        description: 'Crisp line vector plotting on 120gsm bond paper.',
        price: 350,
        currency: 'KSh',
        durationMinutes: 15,
        isAvailable: true,
        requiresBooking: false,
      },
    ],
    products: [
      {
        id: 'prod_spiral_pad',
        name: 'Campus Academic 200-Page Spiral Note Pad',
        category: 'Stationery',
        description: '80gsm ruled paper with durable waterproof cover.',
        price: 250,
        currency: 'KSh',
        stockQuantity: 120,
        isAvailable: true,
      },
    ],
    menu: [],
    amenities: ['Email/WhatsApp Document Dropoff', 'Instant PDF Print', 'Card & M-PESA', 'Thesis Expedited Delivery'],
    pricingRange: 'KSh 5 - 2,500',
    currency: 'KSh',
    paymentMethods: ['M-PESA Till', 'Card', 'Cash'],
    bookingEnabled: true,
    orderingEnabled: true,
    deliveryEnabled: true,
    verificationStatus: 'VERIFIED',
    rating: 4.88,
    reviewCount: 29,
    googleDriveFolderId: 'folder_speedy_print',
    googleDriveFolderName: 'ENEMIND BUSINESS/SpeedyPrint & Graphic Cyber Solutions',
    googleSheetId: 'sheet_speedy_print_orders',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/sheet_speedy_print_orders/edit',
    isStudentOwned: true,
    mpesaTillOrPaybill: 'Till 789123',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-08-24T16:00:00Z',
  },
  {
    id: 'biz_campus_glam',
    ownerId: 'owner_angela_glam',
    ownerName: 'Angela Nanjala',
    businessName: 'Glamour & Glow Student Salon & Nails',
    slug: 'glamour-glow-student-salon-nails',
    category: 'SALON',
    subcategory: 'Braids, Nails & Makeup',
    description:
      'USIU-Africa student beauty haven! Knotless braids, soft glam makeup, gel/acrylic nail extensions, pedicures, and lace wig installations with student-friendly combo packages.',
    shortDescription: 'Knotless braids, acrylic nails, lash extensions & wig styling for USIU & KU students.',
    logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&auto=format&fit=crop&q=80',
    phone: '+254708778899',
    whatsappNumber: '+254708778899',
    email: 'glamourglownbi@gmail.com',
    country: 'Kenya',
    city: 'Roysambu, Nairobi',
    campus: 'USIU-Africa',
    universityName: 'United States International University - Africa',
    location: 'TRM Drive, Roysambu Court Room 2B',
    address: 'TRM Drive, Off Thika Road, Nairobi',
    distanceFromCampus: '400m from USIU Gate',
    openingHours: { monday: '9:00 AM - 8:00 PM', isOpenNow: true },
    services: [
      {
        id: 'srv_knotless_braids',
        name: 'Medium Knotless Box Braids (Mid-Back)',
        category: 'Braids',
        description: 'Tension-free lightweight knotless braids with neat clean parting and curled ends.',
        price: 1800,
        currency: 'KSh',
        durationMinutes: 180,
        isAvailable: true,
        requiresBooking: true,
      },
      {
        id: 'srv_acrylic_nails',
        name: 'Full Set Acrylic Nails with Gel Polish & Art',
        category: 'Nails',
        description: 'Sculpted acrylic tips with trendy French tip or marble design and glossy gel top coat.',
        price: 1200,
        currency: 'KSh',
        durationMinutes: 75,
        isAvailable: true,
        requiresBooking: true,
      },
    ],
    products: [],
    menu: [],
    amenities: ['Refreshments Served', 'Free Wi-Fi', 'Netflix on Screen', 'Hostel Call-out Available'],
    pricingRange: 'KSh 500 - 3,500',
    currency: 'KSh',
    paymentMethods: ['M-PESA Till', 'Cash'],
    bookingEnabled: true,
    orderingEnabled: false,
    deliveryEnabled: false,
    verificationStatus: 'VERIFIED',
    rating: 4.94,
    reviewCount: 42,
    googleDriveFolderId: 'folder_glamour_glow',
    googleDriveFolderName: 'ENEMIND BUSINESS/Glamour & Glow Student Salon & Nails',
    googleSheetId: 'sheet_glamour_glow_crm',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/sheet_glamour_glow_crm/edit',
    isStudentOwned: true,
    mpesaTillOrPaybill: 'Till 456123',
    createdAt: '2026-03-12T10:00:00Z',
    updatedAt: '2026-08-22T17:00:00Z',
  },
  {
    id: 'biz_rider_express',
    ownerId: 'owner_omondi_boda',
    ownerName: 'James Omondi',
    businessName: 'Varsity Boda & Parcel Logistics Hub',
    slug: 'varsity-boda-parcel-logistics-hub',
    category: 'TRANSPORT',
    subcategory: 'Safe Student Rides & Deliveries',
    description:
      'Trusted, helmet-equipped varsity boda network and campus errand service. Fast, vetted student rides between Egerton main campus, Tatton gate, and Njoro town plus inter-hostel parcel delivery.',
    shortDescription: 'Vetted student boda rides, safe night escorts & prompt food/package deliveries.',
    logo: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80',
    phone: '+254790334455',
    whatsappNumber: '+254790334455',
    email: 'varsityboda@gmail.com',
    country: 'Kenya',
    city: 'Njoro, Nakuru',
    campus: 'Egerton University Main Campus',
    universityName: 'Egerton University',
    location: 'Tatton Gate Boda Stage',
    address: 'Njoro-Mau Narok Road, Nakuru',
    distanceFromCampus: '50m from Tatton Gate',
    openingHours: { monday: '6:00 AM - 12:00 AM', isOpenNow: true },
    services: [
      {
        id: 'srv_gate_shuttle',
        name: 'Gate-to-Hostel Direct Express Ride',
        category: 'Rides',
        description: 'Safe helmet-provided ride across campus gates and surrounding hostels.',
        price: 70,
        currency: 'KSh',
        durationMinutes: 10,
        isAvailable: true,
        requiresBooking: true,
      },
      {
        id: 'srv_parcel_dispatch',
        name: 'Town to Campus Food & Grocery Errand Dispatch',
        category: 'Delivery',
        description: 'Prompt pickup of packages, food orders or laundry from town delivered straight to your room.',
        price: 150,
        currency: 'KSh',
        durationMinutes: 25,
        isAvailable: true,
        requiresBooking: true,
      },
    ],
    products: [],
    menu: [],
    amenities: ['Clean Passenger Helmets & Reflector', 'Night Safe Escort', 'Live WhatsApp Location Tracking'],
    pricingRange: 'KSh 50 - 300',
    currency: 'KSh',
    paymentMethods: ['M-PESA Send Money', 'Cash'],
    bookingEnabled: true,
    orderingEnabled: false,
    deliveryEnabled: true,
    verificationStatus: 'VERIFIED',
    rating: 4.82,
    reviewCount: 26,
    isStudentOwned: true,
    createdAt: '2026-03-20T08:00:00Z',
    updatedAt: '2026-08-20T19:00:00Z',
  },
];

export const SEED_CAMPUS_EVENTS: CampusEvent[] = [
  {
    id: 'evt_tech_summit',
    organizerId: 'org_jkuat_dsc',
    organizerName: 'JKUAT Google Developer Student Club & Enemind',
    organizerType: 'CLUB',
    title: 'Inter-University AI & Cloud Innovation Summit 2026',
    description:
      'East Africa’s premier student hackathon and tech symposium. Features keynote presentations by senior AI researchers from Google DeepMind, live project demos, internship recruiting booths, and a KSh 500,000 venture prize pool for top student projects.',
    category: 'ACADEMIC',
    venue: 'JKUAT Main Assembly Hall & CLB Computer Labs',
    campus: 'JKUAT Main Campus',
    city: 'Juja, Kiambu',
    startDate: '2026-09-12T09:00:00Z',
    endDate: '2026-09-13T17:00:00Z',
    price: 0,
    currency: 'KSh',
    isFree: true,
    capacity: 600,
    registeredCount: 428,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    status: 'UPCOMING',
    tags: ['ArtificialIntelligence', 'Hackathon', 'GoogleCloud', 'Careers', 'TechSummit'],
    googleCalendarLink: 'https://calendar.google.com/calendar/r/eventedit?text=Inter-University+AI+Summit',
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-24T12:00:00Z',
  },
  {
    id: 'evt_freshers_bash',
    organizerId: 'org_kusa_entertain',
    organizerName: 'KUSA Entertainment Committee',
    organizerType: 'STUDENT_LEADER',
    title: 'KU All-Star Fresher’s Welcome Mega Gala & AfroBeats Fest',
    description:
      'The biggest cultural welcome celebration of the academic year! Live performances by top national recording artists, student dance battle finals, red carpet photo shoots, food trucks, and DJ sets until late.',
    category: 'CONCERT',
    venue: 'Kenyatta University Amphitheatre & Sports Grounds',
    campus: 'Kenyatta University Main Campus',
    city: 'Nairobi',
    startDate: '2026-09-19T16:00:00Z',
    endDate: '2026-09-19T23:30:00Z',
    price: 300,
    currency: 'KSh',
    isFree: false,
    capacity: 2500,
    registeredCount: 1640,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80',
    status: 'UPCOMING',
    tags: ['LiveMusic', 'Afrobeats', 'FreshersParty', 'KUAmphitheatre', 'Nightlife'],
    createdAt: '2026-08-10T12:00:00Z',
    updatedAt: '2026-08-24T14:00:00Z',
  },
  {
    id: 'evt_career_expo',
    organizerId: 'org_uon_careers',
    organizerName: 'University of Nairobi Career Services',
    organizerType: 'UNIVERSITY_DEPT',
    title: 'East Africa Graduate Career, Internship & Networking Expo',
    description:
      'Meet 70+ hiring managers from top global consulting firms, tech companies, banks, and NGOs. Offers instant on-site CV reviews with Google Drive sync, mock interview stages, and graduate trainee program registrations.',
    category: 'CAREER',
    venue: 'UoN Great Court & Taifa Hall',
    campus: 'University of Nairobi Main Campus',
    city: 'Nairobi CBD',
    startDate: '2026-09-25T08:30:00Z',
    endDate: '2026-09-25T16:30:00Z',
    price: 0,
    currency: 'KSh',
    isFree: true,
    capacity: 1500,
    registeredCount: 910,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
    status: 'UPCOMING',
    tags: ['CareerExpo', 'Internships', 'UoNGreatCourt', 'Networking', 'Jobs'],
    createdAt: '2026-08-05T09:00:00Z',
    updatedAt: '2026-08-23T11:00:00Z',
  },
  {
    id: 'evt_basketball_derby',
    organizerId: 'org_strath_sports',
    organizerName: 'Varsity Sports Federation',
    organizerType: 'CLUB',
    title: 'Varsity Derby: Strathmore Blades vs UoN Terrorists Finals',
    description:
      'The thrilling championship showdown of the Inter-Campus Basketball League. Come cheer on your team with live commentary, halftime cheer showcases, and mascot entertainment.',
    category: 'SPORTS',
    venue: 'Strathmore Sports Complex Arena',
    campus: 'Strathmore University',
    city: 'Madaraka, Nairobi',
    startDate: '2026-09-27T14:00:00Z',
    endDate: '2026-09-27T18:00:00Z',
    price: 150,
    currency: 'KSh',
    isFree: false,
    capacity: 800,
    registeredCount: 620,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&auto=format&fit=crop&q=80',
    status: 'UPCOMING',
    tags: ['Basketball', 'VarsitySports', 'BladesVsTerrorists', 'CampusDerby'],
    createdAt: '2026-08-15T08:00:00Z',
    updatedAt: '2026-08-24T10:00:00Z',
  },
];

export class BusinessService {
  private businesses: BusinessProfile[] = [];
  private events: CampusEvent[] = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const storedBiz = localStorage.getItem(STORAGE_KEY_BUSINESSES);
      if (storedBiz) {
        this.businesses = JSON.parse(storedBiz);
      } else {
        this.businesses = [...SEED_BUSINESSES];
        this.saveBusinesses();
      }

      const storedEvents = localStorage.getItem(STORAGE_KEY_EVENTS);
      if (storedEvents) {
        this.events = JSON.parse(storedEvents);
      } else {
        this.events = [...SEED_CAMPUS_EVENTS];
        this.saveEvents();
      }
    } catch (e) {
      console.warn('Failed to load campus business state:', e);
      this.businesses = [...SEED_BUSINESSES];
      this.events = [...SEED_CAMPUS_EVENTS];
    }
  }

  private saveBusinesses() {
    try {
      localStorage.setItem(STORAGE_KEY_BUSINESSES, JSON.stringify(this.businesses));
    } catch (e) {
      console.warn('Failed to save campus businesses:', e);
    }
  }

  private saveEvents() {
    try {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(this.events));
    } catch (e) {
      console.warn('Failed to save campus events:', e);
    }
  }

  public getBusinesses(params?: {
    category?: string;
    campus?: string;
    searchQuery?: string;
    query?: string;
    studentOwnedOnly?: boolean;
    orderingEnabledOnly?: boolean;
    bookingEnabledOnly?: boolean;
    minRating?: number;
  }): BusinessProfile[] {
    if (!params) return this.businesses;
    return this.searchBusinesses({
      category: params.category,
      campus: params.campus,
      query: params.searchQuery || params.query,
      onlyStudentOwned: params.studentOwnedOnly,
      hasDelivery: params.orderingEnabledOnly,
      hasBooking: params.bookingEnabledOnly,
      minRating: params.minRating,
    });
  }

  public getDirectoryStats() {
    const verifiedCount = this.businesses.filter((b) => b.verificationStatus === 'VERIFIED').length;
    const studentOwnedCount = this.businesses.filter((b) => b.isStudentOwned).length;
    const hostelsCount = this.businesses.filter((b) => b.category === 'HOSTEL' || b.category === 'HOTEL').length;
    const diningCount = this.businesses.filter((b) => b.category === 'RESTAURANT' || b.category === 'CAFE').length;
    const totalReviews = this.businesses.reduce((sum, b) => sum + (b.reviewCount || 0), 0);
    const activeEventsCount = this.events.filter((e) => e.status === 'UPCOMING' || e.status === 'LIVE').length;
    return {
      totalBusinesses: this.businesses.length,
      verifiedBusinesses: verifiedCount,
      studentOwnedBusinesses: studentOwnedCount,
      hostelsCount,
      diningCount,
      totalReviews,
      activeEvents: activeEventsCount,
      upcomingEventsCount: activeEventsCount,
    };
  }

  public getBusinessById(id: string): BusinessProfile | undefined {
    return this.businesses.find((b) => b.id === id);
  }

  public getBusinessBySlug(slug: string): BusinessProfile | undefined {
    return this.businesses.find((b) => b.slug === slug);
  }

  public getBusinessesByOwner(ownerId: string): BusinessProfile[] {
    return this.businesses.filter((b) => b.ownerId === ownerId);
  }

  public createBusiness(
    data: Omit<BusinessProfile, 'id' | 'createdAt' | 'updatedAt' | 'verificationStatus' | 'rating' | 'reviewCount'> &
      Partial<BusinessProfile>
  ): BusinessProfile {
    const newBiz: BusinessProfile = {
      id: `biz_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      slug: data.slug || data.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      verificationStatus: data.verificationStatus || 'VERIFIED',
      rating: data.rating || 5.0,
      reviewCount: data.reviewCount || 1,
      reviews: data.reviews || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };

    this.businesses.unshift(newBiz);
    this.saveBusinesses();
    return newBiz;
  }

  public updateBusiness(id: string, updates: Partial<BusinessProfile>): BusinessProfile | undefined {
    const idx = this.businesses.findIndex((b) => b.id === id);
    if (idx === -1) return undefined;

    this.businesses[idx] = {
      ...this.businesses[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveBusinesses();
    return this.businesses[idx];
  }

  public deleteBusiness(id: string): boolean {
    const initialLen = this.businesses.length;
    this.businesses = this.businesses.filter((b) => b.id !== id);
    if (this.businesses.length !== initialLen) {
      this.saveBusinesses();
      return true;
    }
    return false;
  }

  public searchBusinesses(params: {
    query?: string;
    category?: string;
    campus?: string;
    city?: string;
    minRating?: number;
    onlyStudentOwned?: boolean;
    hasDelivery?: boolean;
    hasBooking?: boolean;
  }): BusinessProfile[] {
    return this.businesses.filter((biz) => {
      if (params.query) {
        const q = params.query.toLowerCase();
        const matchesQuery =
          biz.businessName.toLowerCase().includes(q) ||
          biz.description.toLowerCase().includes(q) ||
          biz.campus.toLowerCase().includes(q) ||
          biz.category.toLowerCase().includes(q) ||
          (biz.menu && biz.menu.some((m) => m.name.toLowerCase().includes(q))) ||
          (biz.services && biz.services.some((s) => s.name.toLowerCase().includes(q)));
        if (!matchesQuery) return false;
      }

      if (params.category && params.category !== 'ALL') {
        if (biz.category !== params.category) return false;
      }

      if (params.campus && params.campus !== 'ALL') {
        if (biz.campus !== params.campus && !biz.campus.toLowerCase().includes(params.campus.toLowerCase())) {
          return false;
        }
      }

      if (params.minRating && biz.rating < params.minRating) {
        return false;
      }

      if (params.onlyStudentOwned && !biz.isStudentOwned) {
        return false;
      }

      if (params.hasDelivery && !biz.deliveryEnabled) {
        return false;
      }

      if (params.hasBooking && !biz.bookingEnabled) {
        return false;
      }

      return true;
    });
  }

  public addReview(
    businessId: string,
    review: Omit<BusinessReview, 'id' | 'date'>
  ): BusinessReview | null {
    const biz = this.getBusinessById(businessId);
    if (!biz) return null;

    const newReview: BusinessReview = {
      id: `rev_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...review,
    };

    if (!biz.reviews) biz.reviews = [];
    biz.reviews.unshift(newReview);

    const totalRatings = biz.reviews.reduce((sum, r) => sum + r.rating, 0);
    biz.rating = parseFloat((totalRatings / biz.reviews.length).toFixed(2));
    biz.reviewCount = biz.reviews.length;
    biz.updatedAt = new Date().toISOString();

    this.saveBusinesses();
    return newReview;
  }

  // -------------------------------------------------------------
  // CAMPUS EVENTS MANAGEMENT
  // -------------------------------------------------------------

  public getEvents(params?: { campus?: string; category?: string; status?: string }): CampusEvent[] {
    return this.events.filter((evt) => {
      if (params?.campus && params.campus !== 'ALL') {
        if (evt.campus !== params.campus && !evt.campus.toLowerCase().includes(params.campus.toLowerCase())) {
          return false;
        }
      }
      if (params?.category && params.category !== 'ALL') {
        if (evt.category !== params.category) return false;
      }
      if (params?.status && params.status !== 'ALL') {
        if (evt.status !== params.status) return false;
      }
      return true;
    });
  }

  public getEventById(id: string): CampusEvent | undefined {
    return this.events.find((e) => e.id === id);
  }

  public createEvent(
    data: Omit<CampusEvent, 'id' | 'createdAt' | 'updatedAt' | 'registeredCount'> & Partial<CampusEvent>
  ): CampusEvent {
    const newEvent: CampusEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      registeredCount: 0,
      status: 'UPCOMING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };

    this.events.unshift(newEvent);
    this.saveEvents();
    return newEvent;
  }

  public registerForEvent(eventId: string, userId?: string, userName?: string): CampusEvent | undefined {
    const evt = this.getEventById(eventId);
    if (!evt) return undefined;

    evt.registeredCount = (evt.registeredCount || 0) + 1;
    evt.updatedAt = new Date().toISOString();
    this.saveEvents();
    return evt;
  }
}

export const businessService = new BusinessService();

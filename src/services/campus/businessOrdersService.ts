/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BusinessOrder, BusinessBooking, OrderItem } from '../../types/business';
import { businessService } from './businessService';
import { calendarService } from '../google/calendarService';
import { emailService } from '../google/emailService';

const STORAGE_KEY_ORDERS = 'enemind_business_orders_v1';
const STORAGE_KEY_BOOKINGS = 'enemind_business_bookings_v1';

export const SEED_ORDERS: BusinessOrder[] = [
  {
    id: 'ORD-7741',
    businessId: 'biz_juja_fries_hub',
    businessName: 'Juja Shawarma & Gourmet Burgers',
    customerId: 'user_joy_chebet',
    customerName: 'Joy Chebet',
    customerPhone: '+254711223344',
    customerEmail: 'joy.chebet@students.jkuat.ac.ke',
    items: [
      {
        itemId: 'menu_shawarma_special',
        name: 'The Mega Campus Loaded Shawarma (Chicken)',
        price: 320,
        quantity: 2,
        specialInstructions: 'Extra garlic sauce and chilli',
      },
      {
        itemId: 'menu_masala_fries',
        name: 'Spicy Masala Chips Bowl',
        price: 200,
        quantity: 1,
      },
    ],
    subtotal: 840,
    deliveryFee: 50,
    totalAmount: 890,
    currency: 'KSh',
    deliveryMethod: 'DELIVERY',
    deliveryAddress: 'Hall 6, Room 204, JKUAT Main Campus',
    notes: 'Please call on arrival at the gate',
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    paymentMethod: 'MPESA',
    mpesaReceiptNumber: 'QJD8912KL9',
    createdAt: '2026-08-24T19:30:00Z',
    updatedAt: '2026-08-24T19:55:00Z',
  },
];

export const SEED_BOOKINGS: BusinessBooking[] = [
  {
    id: 'BK-8902',
    businessId: 'biz_olympic_hostel',
    businessName: 'Olympic Executive Student Suites',
    customerId: 'user_mary_wanjiku',
    customerName: 'Mary Wanjiku',
    customerPhone: '+254722334455',
    customerEmail: 'mary.wanjiku@students.uonbi.ac.ke',
    serviceId: 'room_single_ensuite',
    serviceName: 'Single Deluxe Ensuite Room Visit & Booking',
    date: '2026-09-01',
    timeSlot: '11:00 AM',
    guestsCount: 1,
    notes: 'Interested in Semester 1 occupancy starting Sept 5th.',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    amount: 16500,
    currency: 'KSh',
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-20T10:15:00Z',
  },
  {
    id: 'BK-9104',
    businessId: 'biz_lenscraft_photography',
    businessName: 'LensCraft Student Photography',
    customerId: 'user_brian_k',
    customerName: 'Brian Kiprono',
    customerPhone: '+254733112233',
    customerEmail: 'brian.k@uonbi.ac.ke',
    serviceId: 'srv_grad_photoshoot',
    serviceName: 'Graduation Day Deluxe Photoshoot',
    date: '2026-09-25',
    timeSlot: '2:00 PM',
    guestsCount: 4,
    notes: 'With parents and sister at the Great Court fountain.',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    amount: 2500,
    currency: 'KSh',
    createdAt: '2026-08-22T14:00:00Z',
    updatedAt: '2026-08-22T14:10:00Z',
  },
];

export class BusinessOrdersService {
  private orders: BusinessOrder[] = [];
  private bookings: BusinessBooking[] = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const storedOrders = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (storedOrders) {
        this.orders = JSON.parse(storedOrders);
      } else {
        this.orders = [...SEED_ORDERS];
        this.persistOrders();
      }

      const storedBookings = localStorage.getItem(STORAGE_KEY_BOOKINGS);
      if (storedBookings) {
        this.bookings = JSON.parse(storedBookings);
      } else {
        this.bookings = [...SEED_BOOKINGS];
        this.persistBookings();
      }
    } catch (e) {
      console.warn('Error loading orders/bookings:', e);
      this.orders = [...SEED_ORDERS];
      this.bookings = [...SEED_BOOKINGS];
    }
  }

  private persistOrders() {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(this.orders));
    } catch (e) {
      console.error(e);
    }
  }

  private persistBookings() {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(this.bookings));
    } catch (e) {
      console.error(e);
    }
  }

  // -------------------------------------------------------------
  // ORDERS
  // -------------------------------------------------------------

  public async createOrder(data: {
    businessId: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    items: OrderItem[];
    deliveryMethod: 'DELIVERY' | 'PICKUP' | 'DINE_IN';
    deliveryAddress?: string;
    notes?: string;
    paymentMethod: 'MPESA' | 'CASH_ON_DELIVERY' | 'CARD';
  }): Promise<BusinessOrder> {
    const biz = businessService.getBusinessById(data.businessId);
    const businessName = biz?.businessName || 'Campus Merchant';

    const subtotal = data.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const deliveryFee = data.deliveryMethod === 'DELIVERY' ? 50 : 0;
    const totalAmount = subtotal + deliveryFee;

    const receipt = `MP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newOrder: BusinessOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      businessId: data.businessId,
      businessName,
      customerId: data.customerId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      items: data.items,
      subtotal,
      deliveryFee,
      totalAmount,
      currency: 'KSh',
      deliveryMethod: data.deliveryMethod,
      deliveryAddress: data.deliveryAddress,
      notes: data.notes,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      paymentMethod: data.paymentMethod,
      mpesaReceiptNumber: receipt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);
    this.persistOrders();

    // Dispatch email confirmation if customer email is valid
    if (data.customerEmail) {
      emailService
        .sendTemplatedEmail('course_enrollment', data.customerEmail, {
          userName: data.customerName,
          courseTitle: `Campus Order #${newOrder.id} at ${businessName}`,
          instructorName: businessName,
          platformUrl: `https://enemind.app/orders/${newOrder.id}`,
        })
        .catch(console.warn);
    }

    return newOrder;
  }

  public getOrdersForBusiness(businessId: string): BusinessOrder[] {
    return this.orders.filter((o) => o.businessId === businessId);
  }

  public getOrdersForCustomer(customerId: string): BusinessOrder[] {
    return this.orders.filter((o) => o.customerId === customerId);
  }

  public updateOrderStatus(
    orderId: string,
    status: BusinessOrder['status']
  ): BusinessOrder | null {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date().toISOString();
    this.persistOrders();
    return order;
  }

  // -------------------------------------------------------------
  // BOOKINGS
  // -------------------------------------------------------------

  public async createBooking(data: {
    businessId: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    serviceId?: string;
    serviceName: string;
    date: string;
    timeSlot: string;
    guestsCount?: number;
    notes?: string;
    amount: number;
  }): Promise<BusinessBooking> {
    const biz = businessService.getBusinessById(data.businessId);
    const businessName = biz?.businessName || 'Campus Provider';

    const newBooking: BusinessBooking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      businessId: data.businessId,
      businessName,
      customerId: data.customerId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      serviceId: data.serviceId,
      serviceName: data.serviceName,
      date: data.date,
      timeSlot: data.timeSlot,
      guestsCount: data.guestsCount || 1,
      notes: data.notes,
      status: 'CONFIRMED',
      paymentStatus: data.amount > 0 ? 'PAID' : 'FREE',
      amount: data.amount,
      currency: 'KSh',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Synchronize booking with Google Calendar
    try {
      const startDateTime = new Date(`${data.date}T${data.timeSlot.includes('PM') || data.timeSlot.includes('AM') ? '10:00:00' : data.timeSlot}`);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

      const calEvent = await calendarService.createEvent({
        summary: `${businessName}: ${data.serviceName} (${data.customerName})`,
        description: `Enemind Booking Ref: ${newBooking.id}\nCustomer: ${data.customerName} (${data.customerPhone})\nNotes: ${data.notes || 'None'}`,
        location: biz?.location || 'Campus Location',
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        createMeetLink: biz?.category === 'TUTOR' || biz?.category === 'FREELANCER',
        attendeeEmails: [data.customerEmail || 'student@enemind.org', biz?.email || 'business@enemind.org'],
        eventType: 'mentorship',
      });

      if (calEvent) {
        newBooking.googleCalendarEventId = calEvent.id;
        newBooking.googleMeetUrl = calEvent.meetUrl;
      }
    } catch (e) {
      console.warn('Calendar sync error (graceful fallback):', e);
    }

    this.bookings.unshift(newBooking);
    this.persistBookings();

    return newBooking;
  }

  public getBookingsForBusiness(businessId: string): BusinessBooking[] {
    return this.bookings.filter((b) => b.businessId === businessId);
  }

  public getBookingsForCustomer(customerId: string): BusinessBooking[] {
    return this.bookings.filter((b) => b.customerId === customerId);
  }

  public updateBookingStatus(
    bookingId: string,
    status: BusinessBooking['status']
  ): BusinessBooking | null {
    const bk = this.bookings.find((b) => b.id === bookingId);
    if (!bk) return null;

    bk.status = status;
    bk.updatedAt = new Date().toISOString();
    this.persistBookings();
    return bk;
  }
}

export const businessOrdersService = new BusinessOrdersService();

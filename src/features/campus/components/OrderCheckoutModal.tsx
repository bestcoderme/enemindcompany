/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  ShoppingBag,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Smartphone,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { BusinessProfile, OrderItem, BusinessOrder } from '../../../types/business';
import { businessOrdersService } from '../../../services/campus/businessOrdersService';
import { UserProfile } from '../../../types/user';

interface OrderCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessProfile;
  cartItems: OrderItem[];
  user: UserProfile | null;
  onOrderSuccess: (order: BusinessOrder) => void;
}

export const OrderCheckoutModal: React.FC<OrderCheckoutModalProps> = ({
  isOpen,
  onClose,
  business,
  cartItems,
  user,
  onOrderSuccess,
}) => {
  const [deliveryMethod, setDeliveryMethod] = useState<'DELIVERY' | 'PICKUP' | 'DINE_IN'>('DELIVERY');
  const [deliveryAddress, setDeliveryAddress] = useState(
    user?.campus ? `${user.campus}, Hostel Room / Hall` : 'Hall 6, Room 204, Main Campus'
  );
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phoneNumber || '0712345678');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'MPESA' | 'CASH_ON_DELIVERY'>('MPESA');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<BusinessOrder | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === 'DELIVERY' ? 50 : 0;
  const totalAmount = subtotal + deliveryFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    try {
      const order = await businessOrdersService.createOrder({
        businessId: business.id,
        customerId: user?.email || 'guest_user',
        customerName: customerName || 'Campus Student',
        customerPhone: customerPhone || '0700000000',
        customerEmail: customerEmail || user?.email || 'student@enemind.org',
        items: cartItems,
        deliveryMethod,
        deliveryAddress: deliveryMethod === 'DELIVERY' ? deliveryAddress : undefined,
        notes,
        paymentMethod,
      });

      setCreatedOrder(order);
      onOrderSuccess(order);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-neutral-200 text-neutral-900 my-8 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block">
                {business.businessName}
              </span>
              <h3 className="text-base font-bold font-heading text-white">
                {createdOrder ? 'Order Confirmed!' : 'Campus Delivery & Checkout'}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {createdOrder ? (
          <div className="p-6 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-neutral-900 font-heading">
                Order #{createdOrder.id} Placed Successfully!
              </h4>
              <p className="text-xs text-neutral-600 mt-1 max-w-xs mx-auto">
                {business.businessName} has received your order and is preparing it for{' '}
                {createdOrder.deliveryMethod.toLowerCase()}.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">M-PESA Receipt:</span>
                <span className="font-mono font-bold text-emerald-700">{createdOrder.mpesaReceiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Total Paid:</span>
                <span className="font-bold text-neutral-900">KSh {createdOrder.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Estimated Delivery:</span>
                <span className="font-bold text-neutral-900">15 - 20 minutes</span>
              </div>
              {createdOrder.deliveryAddress && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Delivery Location:</span>
                  <span className="font-bold text-neutral-900 truncate max-w-[200px]">
                    {createdOrder.deliveryAddress}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all shadow-md"
            >
              Done & Return to Campus Life
            </button>
          </div>
        ) : (
          <form onSubmit={handleCheckout} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
            {/* Order Items Summary */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                <span>Your Cart ({cartItems.length} items)</span>
                <span>Subtotal</span>
              </div>
              {cartItems.map((item) => (
                <div key={item.itemId} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900">{item.quantity}x</span>
                    <span className="text-neutral-800">{item.name}</span>
                  </div>
                  <span className="font-bold text-neutral-900">KSh {item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Delivery Method */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Delivery Option
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'DELIVERY', label: 'Hostel Delivery (+KSh 50)', icon: MapPin },
                  { id: 'PICKUP', label: 'Quick Pickup', icon: Clock },
                  { id: 'DINE_IN', label: 'Dine-In', icon: ShoppingBag },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDeliveryMethod(opt.id as any)}
                    className={`p-2.5 rounded-xl border text-center font-bold text-[11px] transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      deliveryMethod === opt.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <opt.icon className="w-3.5 h-3.5" />
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Address if Delivery */}
            {deliveryMethod === 'DELIVERY' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Campus Hostel / Hall / Room No.
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. Hall 6, Room 204 / Olympic Suites Rm 12"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            )}

            {/* Contact Details */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Student Name"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  M-PESA Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="07XXXXXXXX"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Special Instructions (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Extra chilli / Call when at hostel gate"
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Pricing Summary */}
            <div className="pt-2 border-t border-neutral-200 space-y-1.5">
              <div className="flex justify-between text-neutral-600">
                <span>Food & Items Subtotal:</span>
                <span>KSh {subtotal}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Hostel Delivery Fee:</span>
                  <span>KSh {deliveryFee}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-neutral-900 pt-1 border-t border-neutral-100">
                <span>Total Amount:</span>
                <span className="text-emerald-700">KSh {totalAmount}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>{isSubmitting ? 'Processing M-PESA Checkout...' : `Pay KSh ${totalAmount} via M-PESA`}</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

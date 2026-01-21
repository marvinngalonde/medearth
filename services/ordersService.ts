import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/store';

export interface CreateOrderData {
    pharmacy_id: string;
    delivery_type: 'delivery' | 'pickup';
    delivery_address?: string;
    delivery_latitude?: number;
    delivery_longitude?: number;
    payment_method: string;
    notes?: string;
    items: {
        product_id: string;
        product_name: string;
        product_price: number;
        quantity: number;
    }[];
}

export const ordersService = {
    // Create a new order
    async createOrder(orderData: CreateOrderData) {
        const user = useStore.getState().user;
        if (!user) throw new Error('User not authenticated');

        // Calculate totals
        const subtotal = orderData.items.reduce(
            (sum, item) => sum + item.product_price * item.quantity,
            0
        );

        // Get pharmacy delivery fee
        const { data: pharmacy } = await supabase
            .from('pharmacies')
            .select('delivery_fee')
            .eq('id', orderData.pharmacy_id)
            .single();

        const delivery_fee = orderData.delivery_type === 'delivery' ? (pharmacy?.delivery_fee || 0) : 0;
        const total = subtotal + delivery_fee;

        // Create order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                customer_id: user.id,
                pharmacy_id: orderData.pharmacy_id,
                status: 'pending',
                delivery_type: orderData.delivery_type,
                delivery_address: orderData.delivery_address,
                delivery_latitude: orderData.delivery_latitude,
                delivery_longitude: orderData.delivery_longitude,
                subtotal,
                delivery_fee,
                total,
                payment_method: orderData.payment_method,
                payment_status: 'pending',
                notes: orderData.notes,
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // Create order items
        const orderItems = orderData.items.map((item) => ({
            order_id: order.id,
            product_id: item.product_id,
            product_name: item.product_name,
            product_price: item.product_price,
            quantity: item.quantity,
            subtotal: item.product_price * item.quantity,
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        return order;
    },

    // Get user's orders
    async getUserOrders(userId: string) {
        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        pharmacies (
          id,
          name,
          address,
          phone
        ),
        order_items (
          id,
          product_name,
          product_price,
          quantity,
          subtotal
        )
      `)
            .eq('customer_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get pharmacy's orders
    async getPharmacyOrders(pharmacyId: string) {
        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        profiles!orders_customer_id_fkey (
          id,
          first_name,
          last_name,
          phone
        ),
        order_items (
          id,
          product_name,
          product_price,
          quantity,
          subtotal
        )
      `)
            .eq('pharmacy_id', pharmacyId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get driver's orders
    async getDriverOrders(driverId: string) {
        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        pharmacies (
          id,
          name,
          address,
          phone
        ),
        profiles!orders_customer_id_fkey (
          id,
          first_name,
          last_name,
          phone
        )
      `)
            .eq('driver_id', driverId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get available delivery jobs
    async getAvailableJobs() {
        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        pharmacies (
          id,
          name,
          address,
          latitude,
          longitude
        )
      `)
            .eq('status', 'ready')
            .is('driver_id', null)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data;
    },

    // Update order status
    async updateOrderStatus(orderId: string, status: string) {
        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Assign driver to order
    async assignDriver(orderId: string, driverId: string) {
        const { data, error } = await supabase
            .from('orders')
            .update({
                driver_id: driverId,
                status: 'delivering',
            })
            .eq('id', orderId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get single order details
    async getOrderById(orderId: string) {
        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        pharmacies (
          id,
          name,
          address,
          phone,
          latitude,
          longitude
        ),
        profiles!orders_customer_id_fkey (
          id,
          first_name,
          last_name,
          phone
        ),
        order_items (
          id,
          product_name,
          product_price,
          quantity,
          subtotal
        )
      `)
            .eq('id', orderId)
            .single();

        if (error) throw error;
        return data;
    },
};

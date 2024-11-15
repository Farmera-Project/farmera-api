export const permissions = [
    {
        role: 'farmer',
        actions: [
            'create_profile',
            'update_profile',
            'get_all_products',
            'get_product',
            'view_location',
            'check_stock_availability',
            'create_order',
            'view_order_status',
            'cancel_order',
            'view_order_history',
            'make_payment',
            'view_payment_history',
            'recieve_notifications',
        ],

        role: 'wholesaler',
        actions: [
            'create_profile',
            'update_profile',
            'update_stock_levels',
            'add_products',
            'get_all_products',
            'get_product',
            'view_stock_levels',
            'view_incoming_orders',
            'manage_orders',
            'view_order_history',
            'receive_order_notifications',
            'send_order_update_notifications',
            'get_sales_analytics',
            'get_demand_analytics',
            'access_demand_insights',
        ]
    }
]
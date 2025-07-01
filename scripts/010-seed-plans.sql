-- Insert or update pricing plans based on the services page data
INSERT INTO plans (name, description, monthly_price, setup_fee, edit_limit, is_custom, status, is_deleted)
VALUES
('One-Pager Website', 'Perfect for events, freelancers, and simple business needs', 39.00, 49.00, 3, FALSE, 'active', FALSE),
('Informational Website', 'Ideal for small businesses wanting to establish online presence', 59.00, 99.00, 3, FALSE, 'active', FALSE),
('Multi-Page Website', 'Comprehensive solution for growing companies', 89.00, 129.00, 5, FALSE, 'active', FALSE),
('E-commerce Website', 'Complete online store with payment processing', 129.00, 199.00, 5, FALSE, 'active', FALSE),
('Custom Website', 'Tailored solutions for unique business requirements', 159.00, 0.00, -1, TRUE, 'active', FALSE) -- -1 for unlimited edits, 0 for quote-based setup fee
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    monthly_price = EXCLUDED.monthly_price,
    setup_fee = EXCLUDED.setup_fee,
    edit_limit = EXCLUDED.edit_limit,
    is_custom = EXCLUDED.is_custom,
    status = EXCLUDED.status,
    is_deleted = EXCLUDED.is_deleted;

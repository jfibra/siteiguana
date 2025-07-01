TRUNCATE TABLE public.plans RESTART IDENTITY CASCADE;

INSERT INTO public.plans (name, description, monthly_price, setup_fee, edit_limit, is_custom, is_popular, features, ideal_for, long_description) VALUES
('One-Pager Website', 'Perfect for events, freelancers, and simple business needs', 39.00, 49.00, 3, FALSE, FALSE,
 ARRAY['Single responsive landing page', 'Contact form integration', 'Social media links', 'Basic SEO optimization', 'SSL certificate included', 'Mobile-first design', '3 monthly content edits', '24-hour preview delivery'],
 ARRAY['Event promotion', 'Freelancer portfolios', 'Simple business cards', 'Product launches'],
 'Designed for quick launches and impactful online presence, our One-Pager Website is perfect for showcasing a single event, a freelancer''s portfolio, or a simple business card online. It includes all essentials to get you noticed fast.'),

('Informational Website', 'Ideal for small businesses wanting to establish online presence', 59.00, 99.00, 3, FALSE, FALSE,
 ARRAY['3-5 professional pages', 'Advanced contact forms', 'Google Maps integration', 'Image galleries', 'Testimonials section', 'Basic blog functionality', '3 monthly content edits', 'Google Analytics setup'],
 ARRAY['Local businesses', 'Service providers', 'Consultants', 'Small retailers'],
 'Establish a strong online foundation with our Informational Website plan. Ideal for small businesses and service providers, this package offers multiple professional pages to detail your offerings, integrate with Google Maps, and showcase your work through image galleries.'),

('Multi-Page Website', 'Comprehensive solution for growing companies', 89.00, 129.00, 5, FALSE, TRUE,
 ARRAY['6-10 custom pages', 'Advanced SEO optimization', 'Blog with CMS', 'Newsletter integration', 'Advanced analytics', 'Social media integration', '5 monthly content edits', 'Priority support'],
 ARRAY['Growing businesses', 'Professional services', 'Content creators', 'Agencies'],
 'For growing businesses ready to expand their digital footprint, our Multi-Page Website provides a comprehensive solution. With more custom pages, advanced SEO, and integrated blog functionality, you can engage your audience more deeply and manage your content effectively.'),

('E-commerce Website', 'Complete online store with payment processing', 129.00, 199.00, 5, FALSE, FALSE,
 ARRAY['Product catalog management', 'Shopping cart functionality', 'Secure payment processing', 'Inventory management', 'Order tracking system', 'Customer account portal', '5 monthly updates', 'E-commerce analytics'],
 ARRAY['Online retailers', 'Product sellers', 'Subscription services', 'Digital products'],
 'Launch your online store with confidence using our E-commerce Website plan. This complete solution handles everything from product catalog management and secure payment processing to inventory tracking and customer accounts, empowering you to sell online seamlessly.'),

('Custom Website', 'Tailored solutions for unique business requirements', 159.00, NULL, -1, TRUE, FALSE,
 ARRAY['Custom functionality development', 'Database integration', 'User authentication systems', 'API integrations', 'Advanced features', 'Dedicated support', 'Unlimited monthly updates', 'Custom reporting'],
 ARRAY['SaaS platforms', 'Booking systems', 'Membership sites', 'Complex workflows'],
 'Unlock limitless possibilities with our Custom Website plan. Tailored specifically to your unique business requirements, this solution is for complex web applications, SaaS platforms, or any project demanding bespoke functionality, dedicated support, and advanced integrations.');

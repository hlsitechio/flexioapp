-- Website Core Tables for Lead Generation and Content Management

-- Leads and Contact Management
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company VARCHAR(255),
    phone VARCHAR(50),
    job_title VARCHAR(100),
    industry VARCHAR(100),
    company_size VARCHAR(50),
    source VARCHAR(100) NOT NULL, -- 'landing_page', 'contact_form', 'demo_request', etc.
    campaign VARCHAR(100), -- Marketing campaign identifier
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'converted', 'lost'
    lead_score INTEGER DEFAULT 0,
    notes TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    page_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_contacted_at TIMESTAMP WITH TIME ZONE,
    conversion_date TIMESTAMP WITH TIME ZONE
);

-- Contact Form Submissions
CREATE TABLE public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50),
    subject VARCHAR(500),
    message TEXT NOT NULL,
    inquiry_type VARCHAR(100) DEFAULT 'general', -- 'general', 'sales', 'support', 'partnership', 'demo'
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'in_progress', 'resolved', 'closed'
    assigned_to VARCHAR(255),
    source_page VARCHAR(255),
    utm_data JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Demo Requests
CREATE TABLE public.demo_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    job_title VARCHAR(100),
    company_size VARCHAR(50),
    industry VARCHAR(100),
    use_case TEXT,
    preferred_date TIMESTAMP WITH TIME ZONE,
    preferred_time VARCHAR(50),
    timezone VARCHAR(100),
    demo_type VARCHAR(50) DEFAULT 'online', -- 'online', 'onsite', 'phone'
    status VARCHAR(50) DEFAULT 'requested', -- 'requested', 'scheduled', 'completed', 'cancelled', 'no_show'
    scheduled_date TIMESTAMP WITH TIME ZONE,
    demo_url TEXT,
    meeting_notes TEXT,
    outcome VARCHAR(100),
    follow_up_date TIMESTAMP WITH TIME ZONE,
    sales_rep VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Newsletter Subscriptions
CREATE TABLE public.newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'unsubscribed', 'bounced'
    subscription_source VARCHAR(100), -- 'homepage', 'blog', 'landing_page', etc.
    interests JSONB DEFAULT '[]', -- Array of interest categories
    preferences JSONB DEFAULT '{}',
    confirmed_at TIMESTAMP WITH TIME ZONE,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Website Content Management
CREATE TABLE public.website_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    content_type VARCHAR(50) NOT NULL, -- 'page', 'blog_post', 'case_study', 'resource', 'landing_page'
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'archived'
    content TEXT,
    excerpt TEXT,
    meta_title VARCHAR(200),
    meta_description VARCHAR(500),
    featured_image TEXT,
    author VARCHAR(255),
    category VARCHAR(100),
    tags JSONB DEFAULT '[]',
    seo_keywords JSONB DEFAULT '[]',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    view_count INTEGER DEFAULT 0,
    reading_time INTEGER, -- estimated reading time in minutes
    language VARCHAR(10) DEFAULT 'en'
);

-- Analytics Events
CREATE TABLE public.website_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}',
    user_id UUID, -- Can be null for anonymous users
    session_id VARCHAR(255),
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    country VARCHAR(100),
    city VARCHAR(100),
    device_type VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
    browser VARCHAR(100),
    os VARCHAR(100),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_source ON public.leads(source);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
CREATE INDEX idx_leads_lead_score ON public.leads(lead_score);

CREATE INDEX idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX idx_contact_submissions_inquiry_type ON public.contact_submissions(inquiry_type);
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at);

CREATE INDEX idx_demo_requests_status ON public.demo_requests(status);
CREATE INDEX idx_demo_requests_scheduled_date ON public.demo_requests(scheduled_date);
CREATE INDEX idx_demo_requests_created_at ON public.demo_requests(created_at);

CREATE INDEX idx_newsletter_status ON public.newsletter_subscriptions(status);
CREATE INDEX idx_newsletter_email ON public.newsletter_subscriptions(email);

CREATE INDEX idx_website_content_slug ON public.website_content(slug);
CREATE INDEX idx_website_content_status ON public.website_content(status);
CREATE INDEX idx_website_content_type ON public.website_content(content_type);
CREATE INDEX idx_website_content_published_at ON public.website_content(published_at);

CREATE INDEX idx_analytics_event_name ON public.website_analytics(event_name);
CREATE INDEX idx_analytics_created_at ON public.website_analytics(created_at);
CREATE INDEX idx_analytics_user_id ON public.website_analytics(user_id);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies - These tables are managed by admin users, not individual users
-- For now, we'll create permissive policies and tighten them later with proper admin roles

-- Leads - Admin access only (will be refined with proper role system)
CREATE POLICY "Service role can manage leads" ON public.leads
    FOR ALL USING (auth.role() = 'service_role');

-- Contact submissions - Admin access only
CREATE POLICY "Service role can manage contact submissions" ON public.contact_submissions
    FOR ALL USING (auth.role() = 'service_role');

-- Demo requests - Admin access only  
CREATE POLICY "Service role can manage demo requests" ON public.demo_requests
    FOR ALL USING (auth.role() = 'service_role');

-- Newsletter subscriptions - Admin access only
CREATE POLICY "Service role can manage newsletter subscriptions" ON public.newsletter_subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- Website content - Admin access only for management, public read access for published content
CREATE POLICY "Service role can manage website content" ON public.website_content
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Public can read published content" ON public.website_content
    FOR SELECT USING (status = 'published');

-- Analytics - Service role can write, admin can read
CREATE POLICY "Service role can manage analytics" ON public.website_analytics
    FOR ALL USING (auth.role() = 'service_role');

-- Update triggers for updated_at columns
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at
    BEFORE UPDATE ON public.contact_submissions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_demo_requests_updated_at
    BEFORE UPDATE ON public.demo_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_newsletter_subscriptions_updated_at
    BEFORE UPDATE ON public.newsletter_subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_website_content_updated_at
    BEFORE UPDATE ON public.website_content
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
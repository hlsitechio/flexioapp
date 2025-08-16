import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Database, 
  FileText, 
  Globe, 
  Layout, 
  Lock, 
  PieChart, 
  Star, 
  Target, 
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
  Play,
  Shield,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { CriticalCSS } from '@/components/performance/CriticalCSS';
import { InteractiveHeroDashboard } from '@/components/showcase/InteractiveHeroDashboard';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function LandingPage() {
  const [showDemo, setShowDemo] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const { trackMetric } = usePerformanceMonitor();
  const { atTop, scrollingDown, progress } = useScrollVisibility();
  
  useEffect(() => {
    if (import.meta.env.DEV) {
      trackMetric({ landingPageLoadTime: performance.now() });
    }
  }, [trackMetric]);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8 }
  };

  const staggerContainer = {
    animate: {
      transition: { staggerChildren: 0.1 }
    }
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: "easeOut" }
  };

  const slideInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: "easeOut" }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const features = [
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Monitor your productivity metrics with live data visualization and interactive charts that help you make better decisions.",
      benefits: [
        "Live data updates",
        "Interactive dashboards", 
        "Custom metrics",
        "Export capabilities"
      ],
      image: "/src/assets/analytics-dashboard.jpg"
    },
    {
      icon: Calendar,
      title: "Smart Calendar",
      description: "Advanced calendar with mini views, event management, and intelligent scheduling that adapts to your workflow.",
      benefits: [
        "Multiple view modes",
        "Event management",
        "Smart scheduling",
        "Integration ready"
      ],
      image: "/src/assets/calendar-interface.jpg"
    },
    {
      icon: FileText,
      title: "Note Management",
      description: "Capture ideas quickly with our advanced note-taking system featuring code snippets and prompts gallery.",
      benefits: [
        "Quick capture",
        "Code highlighting",
        "Search & organize",
        "Team sharing"
      ],
      image: "/src/assets/notes-interface.jpg"
    },
    {
      icon: Layout,
      title: "Customizable Dashboard",
      description: "Build your perfect workspace with drag-and-drop widgets and fully customizable layouts.",
      benefits: [
        "Drag & drop interface",
        "Multiple layouts",
        "Widget library",
        "Theme customization"
      ],
      image: "/src/assets/dashboard-main.jpg"
    },
    {
      icon: Target,
      title: "Project Management",
      description: "Organize tasks with Kanban boards, track progress, and collaborate with your team effectively.",
      benefits: [
        "Kanban boards",
        "Progress tracking",
        "Team collaboration",
        "Deadline management"
      ],
      image: "/src/assets/project-management.jpg"
    },
    {
      icon: TrendingUp,
      title: "Performance Insights",
      description: "Get detailed insights into your productivity patterns and optimize your workflow accordingly.",
      benefits: [
        "Productivity analytics",
        "Pattern recognition",
        "Optimization tips",
        "Progress reports"
      ],
      image: "/src/assets/analytics-dashboard.jpg"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users", icon: Users },
    { number: "99.9%", label: "Uptime", icon: Shield },
    { number: "24/7", label: "Support", icon: Clock },
    { number: "4.9★", label: "Rating", icon: Star }
  ];

  const pricingPlans = [
    {
      name: "Personal",
      price: "Free",
      description: "Perfect for individuals getting started",
      features: [
        "Up to 5 widgets",
        "Basic customization",
        "Local data storage",
        "Community support",
        "Basic templates"
      ],
      popular: false,
      cta: "Get Started"
    },
    {
      name: "Professional",
      price: "$29",
      description: "Best for growing teams and professionals",
      features: [
        "Unlimited widgets",
        "Advanced customization",
        "Cloud synchronization",
        "Priority support",
        "Team collaboration",
        "Advanced analytics",
        "Custom integrations",
        "Premium templates"
      ],
      popular: true,
      cta: "Start Free Trial"
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with specific needs",
      features: [
        "Everything in Professional",
        "SSO integration",
        "Advanced security",
        "Custom development",
        "Dedicated support",
        "SLA guarantee",
        "On-premise deployment",
        "Training & onboarding"
      ],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  const faqs = [
    {
      question: "What is FlexIO and how does it work?",
      answer: "FlexIO is a multi-purpose LLM and dashboard template that helps you build production-ready applications quickly. It combines powerful analytics, customizable widgets, and modern UI components in one comprehensive platform."
    },
    {
      question: "Is FlexIO free to use?",
      answer: "Yes! FlexIO offers a free plan with core features and up to 5 widgets. For advanced features and unlimited customization, we offer affordable paid plans starting at $29/month."
    },
    {
      question: "Can I customize the dashboard layout?",
      answer: "Absolutely! FlexIO features a drag-and-drop interface that lets you customize your dashboard layout completely. Choose from multiple layout options and arrange widgets exactly how you want them."
    },
    {
      question: "What integrations are available?",
      answer: "FlexIO supports a wide range of integrations including Google Calendar, Slack, Notion, GitHub, and many more. Professional and Enterprise plans include custom integration support."
    },
    {
      question: "How secure is my data?",
      answer: "Security is our top priority. All data is encrypted in transit and at rest using industry-standard encryption. We follow strict security protocols and never share your data with third parties."
    },
    {
      question: "Do you offer technical support?",
      answer: "Yes! We provide community support for free users, priority email support for Professional users, and dedicated support with SLA guarantees for Enterprise customers."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <CriticalCSS />
      <SEOHead 
        title="FlexIO - Multi-purpose LLM and Dashboard Template"
        description="Build production-ready dashboards with FlexIO's comprehensive BI platform. Features real-time analytics, customizable widgets, and powerful integrations."
        canonicalUrl="/"
        keywords={["dashboard template", "business intelligence", "analytics", "data visualization", "BI platform"]}
      />
      
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold text-foreground">
                  FlexIO
                </span>
              </Link>
              <div className="hidden md:flex space-x-6">
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
                <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Reviews</a>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/demo">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Multi-purpose{' '}
                <span className="text-primary">LLM</span> and{' '}
                <span className="text-primary">Dashboard</span>{' '}
                Template
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Get started with your project using this professional template. 
                Build production-ready dashboards with comprehensive BI features, 
                real-time analytics, and customizable widgets.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link to="/demo">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-lg px-8 py-3"
                  >
                    Live Preview
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto text-lg px-8 py-3"
                  >
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <div className="bg-background rounded-xl border border-border shadow-lg overflow-hidden">
              <div className="p-6">
                <InteractiveHeroDashboard />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/5">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Comprehensive BI in One Platform
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to transform your business data into actionable insights
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-foreground">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
              Powerful Features for Every Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to build, deploy, and scale your analytics platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    {feature.image && (
                      <div className="rounded-lg overflow-hidden border border-border/30 mt-4">
                        <img 
                          src={feature.image} 
                          alt={feature.title}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/5">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that's right for your team. All plans include core features.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative ${plan.popular ? 'transform scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card className={`h-full ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                  <CardHeader className="text-center space-y-4">
                    <CardTitle className="text-2xl text-foreground">{plan.name}</CardTitle>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-foreground">
                        {plan.price}
                        {plan.price !== 'Free' && plan.price !== 'Custom' && (
                          <span className="text-lg text-muted-foreground font-normal">/month</span>
                        )}
                      </div>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about FlexIO
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                  <AccordionTrigger className="text-left text-foreground hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of teams already using FlexIO to build better dashboards and improve their productivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/demo">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-3">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold text-foreground">FlexIO</span>
              </div>
              <p className="text-muted-foreground">
                The ultimate multi-purpose dashboard template for modern businesses.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to="/integrations" className="hover:text-foreground transition-colors">Integrations</Link></li>
                <li><Link to="/demo" className="hover:text-foreground transition-colors">Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/documentation" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link to="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link to="/changelog" className="hover:text-foreground transition-colors">Changelog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link to="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link to="/legal/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 FlexIO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
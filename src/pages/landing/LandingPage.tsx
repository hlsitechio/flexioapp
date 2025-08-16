import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LazyImage } from '@/components/ui/lazy-image';
import { CheckCircle, ArrowRight, Star, Users, Shield, Zap, Clock, UserCheck, Crown, DollarSign, BarChart3, Calendar, FileText, Bookmark, Calculator, Timer, Plus, Minus } from 'lucide-react';
import { SEOHead, StructuredData } from '@/components/seo';
import { CriticalCSS } from '@/components/performance/CriticalCSS';
import { usePerformanceMonitor, markPerformance } from '@/hooks/usePerformanceMonitor';
import { PrefetchLink } from '@/components/navigation/PrefetchLink';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';
import { InteractiveHeroDashboard } from '@/components/showcase/InteractiveHeroDashboard';

export function LandingPage() {
  const [showDemo, setShowDemo] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const {
    trackMetric
  } = usePerformanceMonitor();
  const {
    atTop,
    scrollingDown,
    progress
  } = useScrollVisibility();
  
  const intensity = atTop ? 0 : progress;
  const blurPx = Math.round(intensity * (scrollingDown ? 20 : 10));
  const navOpacity = Math.max(0.5, 1 - intensity * (scrollingDown ? 0.9 : 0.5));
  const y = scrollingDown && !atTop ? -Math.round(32 * intensity) : 0;

  useEffect(() => {
    if (import.meta.env.PROD) return;
    markPerformance('landing-page-start');
    const timer = setTimeout(() => {
      markPerformance('landing-page-interactive');
      trackMetric({
        landingPageLoadTime: performance.now()
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [trackMetric]);

  const scrollToDemo = () => {
    setShowDemo(true);
    setTimeout(() => {
      document.getElementById('demo-section')?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
  };

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
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Real-time Analytics",
      description: "Monitor your productivity metrics with live data visualization and interactive charts",
      benefit: "Increase decision-making speed by 75%",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Smart Calendar",
      description: "Advanced calendar with mini views, event management, and intelligent scheduling",
      benefit: "Reduce scheduling conflicts by 90%",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Note Taking",
      description: "Quick notes, code snippets, and prompts gallery for capturing ideas",
      benefit: "Save 20+ hours weekly on organization",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
    { number: "99.9%", label: "Uptime", icon: <Shield className="w-6 h-6" /> },
    { number: "24/7", label: "Support", icon: <Clock className="w-6 h-6" /> },
    { number: "4.9★", label: "Rating", icon: <Star className="w-6 h-6" /> }
  ];

  const pricingPlans = [
    {
      name: "Personal",
      price: "Free",
      period: "forever",
      features: [
        "Up to 5 widgets",
        "Basic customization",
        "Local data storage",
        "Community support"
      ],
      popular: false,
      cta: "Get Started"
    },
    {
      name: "Professional",
      price: "$9",
      period: "per month",
      features: [
        "Unlimited widgets",
        "Advanced customization",
        "Cloud synchronization",
        "Priority support",
        "Team collaboration",
        "Advanced analytics"
      ],
      popular: true,
      cta: "Start Free Trial"
    },
    {
      name: "Enterprise",
      price: "$29",
      period: "per month",
      features: [
        "Everything in Professional",
        "SSO integration",
        "Advanced security",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee"
      ],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  const faqs = [
    {
      question: "What is FlexIO and how does it work?",
      answer: "FlexIO is a customizable productivity dashboard that brings all your essential tools together in one place. You can add widgets like notes, calendar, Kanban boards, calculators, and more to create your perfect workspace."
    },
    {
      question: "Is FlexIO free to use?",
      answer: "Yes! FlexIO offers a free plan with up to 5 widgets and basic customization options. For advanced features and unlimited widgets, we offer affordable paid plans starting at $9/month."
    },
    {
      question: "Can I use FlexIO offline?",
      answer: "FlexIO works primarily in your browser and requires an internet connection for full functionality. However, many widgets like notes and calculator work offline, and your data syncs when you're back online."
    },
    {
      question: "How secure is my data?",
      answer: "We take security seriously. All data is encrypted in transit and at rest. We use industry-standard security practices and never share your personal data with third parties."
    },
    {
      question: "Can I integrate FlexIO with other tools?",
      answer: "Yes! Our Professional and Enterprise plans include integrations with popular tools like Google Calendar, Notion, Slack, and many more. Custom integrations are available for Enterprise customers."
    },
    {
      question: "What kind of support do you offer?",
      answer: "We offer community support for free users, email support for Professional users, and dedicated support with SLA guarantees for Enterprise customers."
    }
  ];

  return (
    <>
      <CriticalCSS />
      <SEOHead 
        title="FlexIO – The Ultimate Productivity Dashboard Platform" 
        description="Transform your workflow with FlexIO's customizable dashboard. Notes, calendar, Kanban, analytics, and more - all in one beautiful, dark-themed interface." 
        keywords={['productivity dashboard', 'customizable widgets', 'dark theme dashboard', 'business productivity', 'workflow optimization']} 
        canonicalUrl="/" 
        ogType="website" 
      />
      
      <StructuredData type="organization" />
      <StructuredData type="website" />
      
      <div className="min-h-screen w-full bg-background overflow-x-hidden">
        {/* Floating Navigation */}
        <motion.div 
          className="fixed top-6 left-0 right-0 flex justify-center z-50 overflow-x-hidden" 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.nav 
            className="bg-background/95 backdrop-blur-md border border-border/50 rounded-full px-8 py-4 shadow-xl mx-auto"
            initial={false}
            animate={{
              filter: `blur(${blurPx}px)`,
              opacity: navOpacity,
              y
            }}
            transition={{
              duration: 0.35,
              ease: [0.4, 0, 0.2, 1]
            }}
            style={{ willChange: 'filter, opacity, transform' }}
          >
            <div className="flex items-center justify-center space-x-6 max-w-fit">
              <Link to="/landing" className="flex items-center hover:opacity-80 transition-opacity">
                <LazyImage 
                  src="/lovable-uploads/801f0a89-558e-4fd0-8e4e-102d5c5d2d3e.png" 
                  alt="FlexIO Logo" 
                  className="h-10 w-auto" 
                  eager={true} 
                  width={80} 
                  height={40} 
                />
              </Link>
              
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/features" className="text-foreground/80 hover:text-foreground transition-all font-medium px-4 py-2 rounded-full hover:bg-muted/40">
                  Features
                </Link>
                <Link to="/pricing" className="text-foreground/80 hover:text-foreground transition-all font-medium px-4 py-2 rounded-full hover:bg-muted/40">
                  Pricing
                </Link>
                <Link to="/contact" className="text-foreground/80 hover:text-foreground transition-all font-medium px-4 py-2 rounded-full hover:bg-muted/40">
                  Contact
                </Link>
                <Link to="/documentation" className="text-foreground/80 hover:text-foreground transition-all font-medium px-4 py-2 rounded-full hover:bg-muted/40">
                  Docs
                </Link>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" className="rounded-full font-medium text-foreground/80 hover:text-foreground" asChild>
                  <PrefetchLink to="/auth">Sign In</PrefetchLink>
                </Button>
                <Button 
                  className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md hover:shadow-lg transition-all duration-200" 
                  onClick={scrollToDemo}
                >
                  Try Demo
                </Button>
              </div>
            </div>
          </motion.nav>
        </motion.div>

        {/* Hero Section */}
        <section className="w-full pt-32 pb-24 lg:pb-32 bg-gradient-to-br from-background via-background/95 to-muted/20">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
            <motion.div 
              className="text-center space-y-8 mb-16" 
              initial="initial" 
              animate="animate" 
              variants={staggerContainer}
            >
              <motion.div className="space-y-4" variants={fadeInUp}>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                  <Zap className="w-4 h-4 mr-2" />
                  The Ultimate Productivity Platform
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                  Transform Your Workflow with
                  <br />
                  <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                    FlexIO Dashboard
                  </span>
                </h1>
              </motion.div>
              
              <motion.p 
                className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" 
                variants={fadeInUp}
              >
                The all-in-one productivity dashboard that adapts to your workflow. 
                Combine notes, calendar, Kanban, analytics, and 20+ powerful widgets in one beautiful interface.
              </motion.p>
              
              <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center" variants={fadeInUp}>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={scrollToDemo}
                >
                  Try Interactive Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-4 text-lg font-semibold rounded-xl border-2"
                  asChild
                >
                  <PrefetchLink to="/auth">
                    Start Free Trial
                  </PrefetchLink>
                </Button>
              </motion.div>
            </motion.div>

            {/* Hero Dashboard Preview */}
            <motion.div 
              className="relative max-w-6xl mx-auto" 
              initial="initial" 
              animate="animate" 
              variants={slideInRight}
            >
              <div className="relative bg-gradient-to-br from-muted/30 to-muted/10 rounded-3xl p-6 lg:p-8 border border-border/50 backdrop-blur-sm shadow-2xl">
                <InteractiveHeroDashboard />
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center space-y-2"
                  variants={scaleIn}
                >
                  <div className="flex justify-center text-primary mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-foreground">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <motion.div 
              className="text-center space-y-6 mb-20"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Everything You Need in One Platform
              </h2>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                FlexIO combines the power of multiple productivity tools into one seamless, customizable dashboard experience.
              </p>
            </motion.div>

            <motion.div 
              className="grid lg:grid-cols-3 gap-8 lg:gap-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  variants={scaleIn}
                  className="group"
                >
                  <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card to-card/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <div className="text-primary mb-2">
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                          {feature.title}
                        </h3>
                      </div>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {feature.benefit}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Detailed Features Section */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <motion.div 
              className="text-center space-y-6 mb-20"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
                Powerful Widgets, Endless Possibilities
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Choose from 20+ professionally designed widgets to build your perfect productivity workspace.
              </p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {[
                { icon: <Calendar className="w-6 h-6" />, title: "Smart Calendar", desc: "Mini calendar with event management" },
                { icon: <FileText className="w-6 h-6" />, title: "Quick Notes", desc: "Capture ideas instantly" },
                { icon: <BarChart3 className="w-6 h-6" />, title: "Analytics", desc: "Real-time data visualization" },
                { icon: <Bookmark className="w-6 h-6" />, title: "Bookmarks", desc: "Organize your important links" },
                { icon: <Calculator className="w-6 h-6" />, title: "Calculator", desc: "Quick calculations at hand" },
                { icon: <Timer className="w-6 h-6" />, title: "Time Tracker", desc: "Monitor your productivity" },
                { icon: <UserCheck className="w-6 h-6" />, title: "Habit Tracker", desc: "Build better habits" },
                { icon: <Crown className="w-6 h-6" />, title: "Task Manager", desc: "Kanban boards and to-dos" },
                { icon: <Shield className="w-6 h-6" />, title: "Security", desc: "Enterprise-grade protection" }
              ].map((widget, index) => (
                <motion.div 
                  key={index}
                  variants={scaleIn}
                  className="bg-card border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-primary">
                      {widget.icon}
                    </div>
                    <h3 className="font-semibold text-foreground">
                      {widget.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {widget.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <motion.div 
              className="text-center space-y-6 mb-20"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Choose the plan that fits your needs. Upgrade or downgrade anytime.
              </p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {pricingPlans.map((plan, index) => (
                <motion.div 
                  key={index}
                  variants={scaleIn}
                  className={`relative ${plan.popular ? 'transform scale-105' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </div>
                    </div>
                  )}
                  <Card className={`h-full border-2 ${plan.popular ? 'border-primary shadow-2xl' : 'border-border'} bg-card`}>
                    <CardContent className="p-8 space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-foreground">
                          {plan.name}
                        </h3>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-4xl font-bold text-foreground">
                            {plan.price}
                          </span>
                          <span className="text-muted-foreground">
                            {plan.period}
                          </span>
                        </div>
                      </div>
                      
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        className={`w-full py-3 font-semibold ${
                          plan.popular 
                            ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                            : 'bg-muted hover:bg-muted/80 text-foreground'
                        }`}
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <motion.div 
              className="text-center space-y-6 mb-20"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to know about FlexIO
              </p>
            </motion.div>

            <motion.div 
              className="space-y-4"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {faqs.map((faq, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  className="bg-card border border-border/50 rounded-xl overflow-hidden"
                >
                  <button
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <h3 className="font-semibold text-foreground pr-8">
                      {faq.question}
                    </h3>
                    <div className="text-primary">
                      {openFaq === index ? (
                        <Minus className="w-5 h-5" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </div>
                  </button>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
            <motion.div 
              className="space-y-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h2 
                className="text-4xl lg:text-5xl font-bold tracking-tight"
                variants={fadeInUp}
              >
                Ready to Transform Your Productivity?
              </motion.h2>
              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                variants={fadeInUp}
              >
                Join thousands of professionals who have already revolutionized their workflow with FlexIO.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                variants={fadeInUp}
              >
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  id="demo-section"
                  onClick={scrollToDemo}
                >
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-4 text-lg font-semibold rounded-xl border-2"
                  asChild
                >
                  <Link to="/contact">
                    Schedule Demo Call
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-background border-t border-border/50 py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <LazyImage 
                  src="/lovable-uploads/801f0a89-558e-4fd0-8e4e-102d5c5d2d3e.png" 
                  alt="FlexIO Logo" 
                  className="h-12 w-auto" 
                  width={96} 
                  height={48} 
                />
                <p className="text-muted-foreground">
                  The ultimate productivity dashboard for modern professionals.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-4">Product</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link to="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                  <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                  <li><Link to="/integrations" className="hover:text-foreground transition-colors">Integrations</Link></li>
                  <li><Link to="/documentation" className="hover:text-foreground transition-colors">Documentation</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-4">Company</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
                  <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                  <li><Link to="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                  <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                  <li><Link to="/security" className="hover:text-foreground transition-colors">Security</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-border/50 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-muted-foreground">
                © 2024 FlexIO. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 sm:mt-0">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
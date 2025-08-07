import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { WelcomeAnimation } from '@/components/animations/WelcomeAnimation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LazyImage } from '@/components/ui/lazy-image';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { LeadCaptureForm } from '@/components/forms';
import { CheckCircle, ArrowRight, Star, Users, Shield, Zap, Image, Play, Clock, UserCheck } from 'lucide-react';
import { SEOHead, StructuredData, AIFeatureSection, AIBenefitsSection } from '@/components/seo';
import { AISearchOptimization } from '@/components/seo/AISearchOptimization';
import { CriticalCSS } from '@/components/performance/CriticalCSS';
import { usePerformanceMonitor, markPerformance } from '@/hooks/usePerformanceMonitor';
import { PrefetchLink } from '@/components/navigation/PrefetchLink';

export function LandingPage() {
  console.log("🏠 LandingPage: Component rendering");
  const [showDemo, setShowDemo] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const { trackMetric } = usePerformanceMonitor();

  useEffect(() => {
    // Skip performance tracking on production landing page
    if (import.meta.env.PROD) return;
    
    markPerformance('landing-page-start');
    
    // Track when landing page is ready (development only)
    const timer = setTimeout(() => {
      markPerformance('landing-page-interactive');
      trackMetric({ 
        landingPageLoadTime: performance.now()
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [trackMetric]);

  const features = [
    {
      name: "Real-time Analytics Dashboard",
      description: "Monitor your business metrics with live data visualization and interactive charts",
      benefit: "Increase decision-making speed by 75%"
    },
    {
      name: "Customizable Widgets",
      description: "Create personalized dashboards with drag-and-drop widget customization",
      benefit: "Reduce setup time by 80%"
    },
    {
      name: "Multi-source Data Integration",
      description: "Connect and visualize data from multiple sources in one unified dashboard",
      benefit: "Improve data accuracy by 90%"
    }
  ];

  const benefits = [
    {
      title: "Boost Productivity",
      description: "Streamline your workflow with intelligent automation and real-time insights",
      metric: "40% faster decision making"
    },
    {
      title: "Save Time",
      description: "Automated reporting and data collection eliminates manual work",
      metric: "20+ hours saved weekly"
    },
    {
      title: "Increase ROI",
      description: "Data-driven insights lead to better business outcomes and growth",
      metric: "3x return on investment"
    }
  ];

  const scrollToDemo = () => {
    setShowDemo(true);
    setTimeout(() => {
      document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
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
      transition: {
        staggerChildren: 0.1
      }
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

  console.log("🏠 LandingPage: About to return JSX");
  return (
    <>
      <CriticalCSS />
      <SEOHead
        title="FlexIO - Advanced Business Intelligence Dashboard Platform"
        description="Transform your business with FlexIO's powerful analytics dashboard. Real-time data visualization, customizable widgets, and enterprise-grade business intelligence tools for data-driven decisions."
        keywords={[
          'business intelligence',
          'analytics dashboard',
          'data visualization',
          'real-time analytics',
          'business metrics',
          'dashboard platform',
          'enterprise analytics',
          'KPI dashboard',
          'data insights',
          'business dashboard'
        ]}
        canonicalUrl="/"
        ogType="website"
      />
      
      <StructuredData type="organization" />
      <StructuredData type="website" />
      
      <AISearchOptimization
        pageType="homepage"
        primaryKeywords={[
          'business intelligence platform',
          'analytics dashboard software',
          'data visualization tool',
          'enterprise dashboard',
          'business analytics solution'
        ]}
        contentCategory="business intelligence software homepage"
        businessContext="enterprise analytics and dashboard platform"
      />
      
      <WelcomeAnimation onComplete={() => setAnimationComplete(true)}>
        <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted/20 overflow-x-hidden">
      {/* Floating Navigation */}
      <motion.div
        className="fixed top-6 left-0 right-0 flex justify-center z-50 px-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <nav className="bg-background/95 backdrop-blur-md border border-border/50 rounded-full px-8 py-4 shadow-xl mx-auto">
          <div className="flex items-center justify-center space-x-6 max-w-fit">
            {/* Logo */}
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
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/features" 
                className="text-foreground/80 hover:text-foreground transition-colors font-medium px-4 py-2 rounded-full hover:bg-muted/40"
              >
                Features
              </Link>
              <Link 
                to="/about" 
                className="text-foreground/80 hover:text-foreground transition-colors font-medium px-4 py-2 rounded-full hover:bg-muted/40"
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-foreground/80 hover:text-foreground transition-colors font-medium px-4 py-2 rounded-full hover:bg-muted/40"
              >
                Contact
              </Link>
              <Link 
                to="/documentation" 
                className="text-foreground/80 hover:text-foreground transition-colors font-medium px-4 py-2 rounded-full hover:bg-muted/40"
              >
                Docs
              </Link>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" className="rounded-full font-medium text-foreground/80 hover:text-foreground" asChild>
                <PrefetchLink to="/auth">Sign In</PrefetchLink>
              </Button>
              <Button 
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md hover:shadow-lg transition-all duration-200" 
                onClick={scrollToDemo}
              >
                Get Demo
              </Button>
            </div>
          </div>
        </nav>
      </motion.div>

      {/* Hero Section */}
      <section className="py-24 lg:py-32 px-8 sm:px-12 lg:px-16 pt-32">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center min-h-[700px]">
            <motion.div 
              className="space-y-8"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <div className="space-y-6">
                <motion.div 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                  variants={fadeInUp}
                >
                  <Zap className="h-4 w-4" />
                  Introducing FlexIO Platform
                </motion.div>
                <motion.h1 
                  className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]"
                  variants={fadeInUp}
                >
                  The productivity platform{' '}
                  <span className="text-primary">for everyone</span>
                </motion.h1>
                <motion.p 
                  className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl"
                  variants={fadeInUp}
                >
                  Streamline operations, boost productivity, and accelerate growth with our innovative platform that adapts to your workflow.
                </motion.p>
              </div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                variants={fadeInUp}
              >
                <Button size="lg" className="text-lg px-8 py-4 rounded-full hover-scale" asChild>
                  <PrefetchLink to="/workspace-selection">
                    <span className="flex items-center">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  </PrefetchLink>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 rounded-full hover-scale" onClick={scrollToDemo}>
                  Try Demo
                </Button>
              </motion.div>

              <motion.div 
                className="flex items-center flex-wrap gap-8 text-sm text-muted-foreground"
                variants={fadeInUp}
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Free forever plan</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>No setup required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Cancel anytime</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="relative"
              initial="initial"
              animate="animate"
              variants={slideInRight}
            >
              <div className="relative bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl p-8 border border-border/50 backdrop-blur-sm">
                <div className="bg-background rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-4 text-sm text-muted-foreground">FlexIO Dashboard</span>
                  </div>
                  <LazyImage 
                    src="/lovable-uploads/1e4e07cd-139c-439e-953b-8928b1dad0e1.png" 
                    alt="FlexIO Dashboard Preview - Real-time analytics and customizable widgets" 
                    className="w-full rounded-lg shadow-lg"
                    eager={true}
                    width={1200}
                    height={675}
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Productivity for Everyone Section */}
      <motion.section 
        className="py-24 px-8 sm:px-12 lg:px-16 bg-background"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-[1400px] mx-auto text-center space-y-12">
          <motion.div className="space-y-6" variants={fadeInUp}>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Productivity for the rest of us
            </h2>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              FlexIO makes productivity tools accessible to everyone—not just experts. With FlexIO as your 
              dedicated productivity platform, you can streamline workflows and drive meaningful outcomes in your business.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Any Task, Any Question Section */}
      <motion.section 
        className="py-24 px-8 sm:px-12 lg:px-16 bg-muted/20"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-[1800px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div className="relative" variants={slideInLeft}>
              <div className="bg-gradient-to-br from-background to-muted/30 rounded-2xl p-8 border border-border/50 shadow-2xl">
                <div className="bg-background rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-4 text-sm text-muted-foreground">FlexIO Assistant</span>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                        You
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 max-w-xs">
                        <p className="text-sm">Show me productivity metrics for the last 5 months</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-primary-foreground text-xs">AI</span>
                        </div>
                        <span className="text-sm font-medium">Productivity Analysis</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-background/80 rounded p-2 text-center">
                          <div className="text-xs text-muted-foreground">Tasks</div>
                          <div className="font-semibold">+23%</div>
                        </div>
                        <div className="bg-background/80 rounded p-2 text-center">
                          <div className="text-xs text-muted-foreground">Time</div>
                          <div className="font-semibold">-15%</div>
                        </div>
                        <div className="bg-background/80 rounded p-2 text-center">
                          <div className="text-xs text-muted-foreground">Quality</div>
                          <div className="font-semibold">+41%</div>
                        </div>
                      </div>
                      <div className="h-16 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded flex items-end justify-around p-2">
                        {[40, 65, 45, 80, 70].map((height, i) => (
                          <div key={i} className="bg-primary/60 rounded-sm w-4" style={{height: `${height}%`}}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <input 
                      type="text" 
                      placeholder="Ask about your workflow..." 
                      className="flex-1 bg-transparent text-sm border-none outline-none placeholder:text-muted-foreground"
                    />
                    <Button size="sm" className="rounded-full">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div className="space-y-6" variants={slideInRight}>
              <div className="space-y-4">
                <div className="w-16 h-1 bg-primary rounded-full"></div>
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
                  Any task,{' '}
                  <span className="text-primary">any question</span>
                </h2>
                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                  No matter how complex your workflow, FlexIO delivers intelligent answers in an intuitive, 
                  conversational experience. Get insights about your productivity, track progress, and optimize 
                  your workflow with natural language queries.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Showcase Section with Images */}
      <motion.section 
        className="py-24 px-8 sm:px-12 lg:px-16 bg-background"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-[1800px] mx-auto">
          <motion.div className="text-center space-y-6 mb-20" variants={fadeInUp}>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Everything you need in one platform
            </h2>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From project management to productivity tracking, FlexIO combines all your essential tools 
              in one intelligent workspace.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
            variants={staggerContainer}
          >
            <motion.div variants={scaleIn}>
              <Card className="group overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 hover-scale">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&crop=center" 
                  alt="Task Management Interface Placeholder" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="text-2xl mb-2">📋</div>
                  <h3 className="text-xl font-bold text-white">Task Management</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  Kanban boards, task counters, and habit trackers to keep your projects organized and on track.
                </p>
              </div>
              </Card>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Card className="group overflow-hidden border-0 shadow-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 hover-scale">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center" 
                  alt="Smart Calendar Interface Placeholder" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="text-2xl mb-2">📅</div>
                  <h3 className="text-xl font-bold text-white">Smart Calendar</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  Advanced calendar with mini views, event management, and intelligent scheduling.
                </p>
              </div>
              </Card>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Card className="group overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 hover-scale">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop&crop=center" 
                  alt="Note Taking Interface Placeholder" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="text-2xl mb-2">📝</div>
                  <h3 className="text-xl font-bold text-white">Note Taking</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  Quick notes, code snippets, and prompts gallery for capturing and organizing your ideas.
                </p>
              </div>
              </Card>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Card className="group overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 hover-scale">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop&crop=center" 
                  alt="Bookmark Manager Interface Placeholder" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="text-2xl mb-2">🔗</div>
                  <h3 className="text-xl font-bold text-white">Bookmark Manager</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  Organize and access your important links with smart categorization and quick search.
                </p>
              </div>
              </Card>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Card className="group overflow-hidden border-0 shadow-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 hover-scale">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center" 
                  alt="Time Tracking Interface Placeholder" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="text-2xl mb-2">⏱️</div>
                  <h3 className="text-xl font-bold text-white">Time Tracking</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  Countdown timers, productivity analytics, and time management tools to optimize your workflow.
                </p>
              </div>
              </Card>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Card className="group overflow-hidden border-0 shadow-xl bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/30 dark:to-cyan-900/30 hover-scale">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop&crop=center" 
                  alt="Quick Tools Interface Placeholder" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="text-2xl mb-2">🧮</div>
                  <h3 className="text-xl font-bold text-white">Quick Tools</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  Built-in calculator, image gallery, and utilities for instant productivity boosts.
                </p>
              </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Multi-Purpose Dashboard Section with Image */}
      <motion.section 
        className="py-24 px-8 sm:px-12 lg:px-16 bg-muted/20"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-[1800px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div className="space-y-6" variants={slideInLeft}>
              <div className="space-y-4">
                <div className="w-16 h-1 bg-primary rounded-full"></div>
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
                  Multi-purpose dashboard{' '}
                  <span className="text-primary">for every workflow</span>
                </h2>
                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                  Adapt FlexIO to your unique business needs with customizable layouts, intelligent insights, 
                  and seamless integration of all your productivity tools in one unified interface.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Customizable Grid Layouts</h4>
                    <p className="text-muted-foreground">Drag-and-drop interface with square and vertical grid options</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Real-time Collaboration</h4>
                    <p className="text-muted-foreground">Share workspaces and collaborate with team members instantly</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Smart Automation</h4>
                    <p className="text-muted-foreground">AI-powered suggestions and automated workflow optimizations</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div className="relative group hover-scale" variants={slideInRight}>
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center" 
                alt="Multi-purpose Dashboard Interface Placeholder" 
                className="rounded-2xl shadow-2xl border border-border/50 w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-2">
                <span className="text-sm font-medium text-foreground">Live Dashboard</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Dashboard Gallery Section */}
      <motion.section 
        className="py-24 px-8 sm:px-12 lg:px-16 bg-background"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "300px" }}
        variants={staggerContainer}
      >
        <div className="max-w-[1800px] mx-auto">
          <motion.div className="text-center space-y-6 mb-20" variants={fadeInUp}>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              See FlexIO in action
            </h2>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore how FlexIO transforms your workspace with intelligent dashboards, 
              comprehensive analytics, and seamless project management.
            </p>
          </motion.div>

          <div className="space-y-16">
            {/* Main Dashboard */}
            <motion.div 
              className="grid lg:grid-cols-2 gap-16 items-center"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "400px" }}
              variants={staggerContainer}
            >
              <motion.div className="space-y-6" variants={slideInLeft}>
                <div className="space-y-4">
                  <div className="w-16 h-1 bg-blue-500 rounded-full"></div>
                  <h3 className="text-3xl lg:text-4xl font-bold">Complete Dashboard Overview</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Your central hub for productivity. Monitor tasks, track progress, manage calendars, 
                    and access all your tools from one beautiful, organized interface.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">Task Management</span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">Calendar Integration</span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">Quick Notes</span>
                </div>
              </motion.div>
              <motion.div className="relative group hover-scale" variants={slideInRight}>
                <img 
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=600&fit=crop&crop=center" 
                  alt="Complete Dashboard Overview Placeholder" 
                  className="rounded-2xl shadow-2xl border border-border/50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.div>
            </motion.div>

            {/* Analytics Dashboard */}
            <motion.div 
              className="grid lg:grid-cols-2 gap-16 items-center"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "400px" }}
              variants={staggerContainer}
            >
              <motion.div className="lg:order-2 space-y-6" variants={slideInRight}>
                <div className="space-y-4">
                  <div className="w-16 h-1 bg-green-500 rounded-full"></div>
                  <h3 className="text-3xl lg:text-4xl font-bold">Advanced Analytics</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Deep insights into your productivity patterns. Track performance metrics, 
                    identify trends, and optimize your workflow with data-driven decisions.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">Performance Metrics</span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">Time Tracking</span>
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm">Reports</span>
                </div>
              </motion.div>
              <motion.div className="lg:order-1 relative group hover-scale" variants={slideInLeft}>
                <img 
                  src="/lovable-uploads/79fcf154-2cea-4690-a606-1b838ab3b07d.png" 
                  alt="Advanced Analytics" 
                  className="rounded-2xl shadow-2xl border border-border/50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.div>
            </motion.div>

            {/* Project Management */}
            <motion.div 
              className="grid lg:grid-cols-2 gap-16 items-center"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "400px" }}
              variants={staggerContainer}
            >
              <motion.div className="space-y-6" variants={slideInLeft}>
                <div className="space-y-4">
                  <div className="w-16 h-1 bg-purple-500 rounded-full"></div>
                  <h3 className="text-3xl lg:text-4xl font-bold">Project Management Suite</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Comprehensive project oversight with Kanban boards, team collaboration tools, 
                    timeline management, and integrated communication features.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">Kanban Boards</span>
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm">Team Collaboration</span>
                  <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-sm">Timeline View</span>
                </div>
              </motion.div>
              <motion.div className="relative group hover-scale" variants={slideInRight}>
                <img 
                  src="https://images.unsplash.com/photo-1473091534298-04dcbce3278c?w=800&h=600&fit=crop&crop=center" 
                  alt="Project Management Suite Placeholder" 
                  className="rounded-2xl shadow-2xl border border-border/50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Demo Section */}
      {showDemo && (
        <section id="demo-section" className="py-24 px-8 sm:px-12 lg:px-16 bg-gradient-to-br from-background to-muted/20">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Star className="h-4 w-4" />
                Most Popular
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
                See Our Platform in Action
              </h2>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Get a personalized demo tailored to your business needs. See exactly 
                how our platform can transform your operations.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
                    <Play className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold">Live Demo</h3>
                  <p className="text-muted-foreground">
                    Interactive walkthrough of key features with real data and use cases relevant to your industry.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                    <UserCheck className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold">Expert Guidance</h3>
                  <p className="text-muted-foreground">
                    Get insights from our product experts who understand your business challenges and goals.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold">Quick Setup</h3>
                  <p className="text-muted-foreground">
                    Learn how fast you can get started and see results with our streamlined onboarding process.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">What to Expect</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Personalized Overview</h4>
                      <p className="text-muted-foreground text-sm">We'll customize the demo based on your industry, company size, and specific requirements.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Real-World Scenarios</h4>
                      <p className="text-muted-foreground text-sm">See how the platform handles actual business processes and workflows from your industry.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Q&A Session</h4>
                      <p className="text-muted-foreground text-sm">Get all your questions answered by our product experts and implementation specialists.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Next Steps</h4>
                      <p className="text-muted-foreground text-sm">Learn about pricing, implementation timeline, and how to get started with a free trial.</p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="border border-border/50 shadow-xl">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Request a Demo</h3>
                      <p className="text-muted-foreground">See our platform in action with a personalized demo</p>
                    </div>
                    <LeadCaptureForm />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Get Started Today Section */}
      {!showDemo && (
        <motion.section 
          className="py-24 px-8 sm:px-12 lg:px-16 bg-gradient-to-br from-primary/5 to-accent/5"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "400px" }}
          variants={staggerContainer}
        >
          <div className="max-w-[1200px] mx-auto text-center space-y-12">
            <motion.div className="space-y-6" variants={fadeInUp}>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
                Get Started Today
              </h2>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Join thousands of teams already using FlexIO to streamline their operations and boost productivity.
              </p>
            </motion.div>
            <motion.div variants={scaleIn}>
              <Card className="max-w-2xl mx-auto border border-border/50 shadow-xl">
                <CardContent className="p-8">
                  <LeadCaptureForm />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-[1800px] mx-auto px-8 sm:px-12 lg:px-16 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-bold">FlexIO</h3>
              <p className="text-muted-foreground leading-relaxed">
                Empowering businesses worldwide with innovative productivity solutions that adapt to your workflow.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="font-semibold">Product</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to="/demo" className="hover:text-foreground transition-colors">Demo</Link></li>
                <li><Link to="/integrations" className="hover:text-foreground transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link to="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="font-semibold">Resources</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/documentation" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link to="/help-center" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-12 text-center text-muted-foreground">
            <p>&copy; 2024 FlexIO. All rights reserved.</p>
          </div>
        </div>
      </footer>
        </div>
      </WelcomeAnimation>
    </>
  );
}
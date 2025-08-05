import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LeadCaptureForm } from '@/components/forms';
import { CheckCircle, ArrowRight, Star, Users, Shield, Zap, Image } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-8 sm:px-12 lg:px-16">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">FlexIO</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-foreground/60 hover:text-foreground transition-colors story-link">Product</a>
              <a href="#" className="text-foreground/60 hover:text-foreground transition-colors story-link">Solutions</a>
              <a href="/contact" className="text-foreground/60 hover:text-foreground transition-colors story-link">Resources</a>
              <a href="#pricing" className="text-foreground/60 hover:text-foreground transition-colors story-link">Pricing</a>
              <Button variant="ghost" className="rounded-full" asChild>
                <a href="/auth">Sign In</a>
              </Button>
              <Button className="rounded-full" asChild>
                <a href="/demo">Get Demo</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 lg:py-24 px-8 sm:px-12 lg:px-16">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center min-h-[700px]">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Zap className="h-4 w-4" />
                  Introducing FlexIO Platform
                </div>
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]">
                  The productivity platform{' '}
                  <span className="text-primary">for everyone</span>
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                  Streamline operations, boost productivity, and accelerate growth with our innovative platform that adapts to your workflow.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 py-4 rounded-full hover-scale">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 rounded-full hover-scale" asChild>
                  <a href="/demo">Try Demo</a>
                </Button>
              </div>

              <div className="flex items-center flex-wrap gap-8 text-sm text-muted-foreground">
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
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl p-8 border border-border/50 backdrop-blur-sm">
                <div className="bg-background rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-4 text-sm text-muted-foreground">FlexIO Dashboard</span>
                  </div>
                  <LeadCaptureForm source="homepage_hero" campaign="landing_page" />
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 px-8 sm:px-12 lg:px-16 border-y bg-muted/20">
        <div className="max-w-[1800px] mx-auto">
          <div className="text-center space-y-8">
            <p className="text-muted-foreground font-medium">Trusted by innovative companies worldwide</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center opacity-60">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-muted rounded-lg flex items-center justify-center hover-scale">
                  <span className="text-lg font-semibold">Company {i}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-lg font-semibold">4.9/5 from 2,500+ reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Productivity for Everyone Section */}
      <section className="py-24 px-8 sm:px-12 lg:px-16 bg-background">
        <div className="max-w-[1400px] mx-auto text-center space-y-12">
          <div className="space-y-6">
            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Productivity for the rest of us
            </h2>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              FlexIO makes productivity tools accessible to everyone—not just experts. With FlexIO as your 
              dedicated productivity platform, you can streamline workflows and drive meaningful outcomes in your business.
            </p>
          </div>
        </div>
      </section>

      {/* Any Task, Any Question Section */}
      <section className="py-24 px-8 sm:px-12 lg:px-16 bg-muted/20">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative">
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
            </div>
            
            <div className="space-y-6">
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
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase Section with Images */}
      <section className="py-24 px-8 sm:px-12 lg:px-16 bg-background">
        <div className="max-w-[1800px] mx-auto">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Everything you need in one platform
            </h2>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From project management to productivity tracking, FlexIO combines all your essential tools 
              in one intelligent workspace.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            <Card className="group overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 hover-scale">
              <div className="aspect-video relative overflow-hidden bg-muted/20 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Image className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">Task Management Image</p>
                </div>
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

            <Card className="group overflow-hidden border-0 shadow-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 hover-scale">
              <div className="aspect-video relative overflow-hidden bg-muted/20 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Image className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">Smart Calendar Image</p>
                </div>
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

            <Card className="group overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 hover-scale">
              <div className="aspect-video relative overflow-hidden bg-muted/20 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Image className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">Note Taking Image</p>
                </div>
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

            <Card className="group overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 hover-scale">
              <div className="aspect-video relative overflow-hidden bg-muted/20 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Image className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">Bookmark Manager Image</p>
                </div>
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

            <Card className="group overflow-hidden border-0 shadow-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 hover-scale">
              <div className="aspect-video relative overflow-hidden bg-muted/20 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Image className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">Time Tracking Image</p>
                </div>
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

            <Card className="group overflow-hidden border-0 shadow-xl bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/30 dark:to-cyan-900/30 hover-scale">
              <div className="aspect-video relative overflow-hidden bg-muted/20 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Image className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">Quick Tools Image</p>
                </div>
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
          </div>
        </div>
      </section>

      {/* Multi-Purpose Dashboard Section with Image */}
      <section className="py-24 px-8 sm:px-12 lg:px-16 bg-muted/20">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-6">
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
            </div>
            
            <div className="relative group hover-scale">
              <div className="aspect-video bg-muted/20 rounded-2xl shadow-2xl border border-border/50 w-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Image className="h-16 w-16 mx-auto text-muted-foreground/50" />
                  <p className="text-lg text-muted-foreground">Multi-purpose Dashboard Image</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-2">
                <span className="text-sm font-medium text-foreground">Live Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Gallery Section */}
      <section className="py-24 px-8 sm:px-12 lg:px-16 bg-background">
        <div className="max-w-[1800px] mx-auto">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              See FlexIO in action
            </h2>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore how FlexIO transforms your workspace with intelligent dashboards, 
              comprehensive analytics, and seamless project management.
            </p>
          </div>

          <div className="space-y-16">
            {/* Main Dashboard */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
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
              </div>
              <div className="relative group hover-scale">
                <div className="aspect-video bg-muted/20 rounded-2xl shadow-2xl border border-border/50 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Image className="h-16 w-16 mx-auto text-muted-foreground/50" />
                    <p className="text-lg text-muted-foreground">Complete Dashboard Overview</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="lg:order-2 space-y-6">
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
              </div>
              <div className="lg:order-1 relative group hover-scale">
                <div className="aspect-video bg-muted/20 rounded-2xl shadow-2xl border border-border/50 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Image className="h-16 w-16 mx-auto text-muted-foreground/50" />
                    <p className="text-lg text-muted-foreground">Advanced Analytics</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>

            {/* Project Management */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
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
              </div>
              <div className="relative group hover-scale">
                <div className="aspect-video bg-muted/20 rounded-2xl shadow-2xl border border-border/50 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Image className="h-16 w-16 mx-auto text-muted-foreground/50" />
                    <p className="text-lg text-muted-foreground">Project Management Suite</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 sm:px-12 lg:px-16 bg-foreground text-background">
        <div className="max-w-[1400px] mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Ready to transform your productivity?
            </h2>
            <p className="text-xl lg:text-2xl opacity-80 max-w-3xl mx-auto leading-relaxed">
              Join thousands of businesses that have already revolutionized their operations with FlexIO.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-10 py-4 rounded-full hover-scale">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-10 py-4 rounded-full border-background text-background hover:bg-background hover:text-foreground hover-scale" asChild>
              <a href="/demo">Request Demo</a>
            </Button>
          </div>
        </div>
      </section>

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
                <li><a href="#features" className="hover:text-foreground transition-colors story-link">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors story-link">Pricing</a></li>
                <li><a href="/demo" className="hover:text-foreground transition-colors story-link">Demo</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors story-link">Integrations</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors story-link">About</a></li>
                <li><a href="/contact" className="hover:text-foreground transition-colors story-link">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors story-link">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors story-link">Blog</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="font-semibold">Resources</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors story-link">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors story-link">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors story-link">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors story-link">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-12 text-center text-muted-foreground">
            <p>&copy; 2024 FlexIO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
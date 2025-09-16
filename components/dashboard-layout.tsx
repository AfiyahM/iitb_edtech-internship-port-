"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  Search,
  FileText,
  BookOpen,
  MessageSquare,
  BarChart3,
  Settings,
  User,
  LogOut,
  Bell,
  ChevronUp,
  Briefcase,
  Target,
  Award,
  Calendar,
  HelpCircle,
  Zap,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"
import { signOut } from "@/lib/auth"

const topNavigation = [
  { title: "Dashboard", url: "/dashboard", icon: Home, badge: null },
  { title: "Search Internships", url: "/dashboard/search", icon: Search, badge: null},
  { title: "Resume Builder", url: "/dashboard/resume", icon: FileText, badge: "AI Ready" },
  { title: "Learning Paths", url: "/dashboard/learning", icon: BookOpen, badge: null},
  { title: "Mock Interviews", url: "/dashboard/interviews", icon: MessageSquare, badge: null},
]

const sidebarNavigation = [
  {
    title: "Progress",
    items: [
      { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3, badge: null },
      { title: "Applications", url: "/dashboard/applications", icon: Briefcase, badge: null},
      { title: "Goals", url: "/dashboard/goals", icon: Target, badge: null }
    ],
  },
  {
    title: "Support",
    items: [
      { title: "Help Center", url: "/help", icon: HelpCircle, badge: null },
      { title: "Settings", url: "/dashboard/settings", icon: Settings, badge: null },
    ],
  },
]

interface UserStats {
  profileCompletion: number
  currentStreak: number
  totalPoints: number
  level: number
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const { toast } = useToast()
  const { user, loading } = useUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [userStats, setUserStats] = useState<UserStats>({
    profileCompletion: 0,
    currentStreak: 0,
    totalPoints: 0,
    level: 0,
  })

  const [notifications, setNotifications] = useState(3)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleLogout = async () => {
    try {
      const result = await signOut()
      
      if (result.success) {
        toast({
          title: "Logged out successfully",
          description: "You have been signed out of your account.",
        })
        // Navigate to home page
        router.push("/")
      } else {
        toast({
          title: "Logout failed",
          description: result.error || "Failed to sign out. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: "Logout failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }



  const clearNotifications = () => {
    setNotifications(0)
    toast({
      title: "Notifications cleared",
      description: "All notifications have been marked as read.",
    })
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <SidebarProvider>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-80 bg-white border-r">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white text-lg font-bold">
                  I
                </div>
                <span className="font-semibold">InternDeck</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              {/* Search Bar in Mobile Menu */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Top Navigation in Mobile Menu */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Quick Access
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {topNavigation.map((item) => {
                    const isActive = pathname === item.url
                    return (
                      <Link
                        key={item.title}
                        href={item.url}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg text-sm transition-colors ${
                          isActive
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "hover:bg-gray-50 border border-transparent"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="relative mb-2">
                          <item.icon className="h-6 w-6" />
                          {item.badge && (
                            <Badge 
                              variant="destructive" 
                              className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] font-bold"
                            >
                              {item.badge.replace(/\D/g, '')}
                            </Badge>
                          )}
                        </div>
                        <span className="text-center text-xs font-medium">{item.title}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Sidebar Navigation in Mobile Menu */}
              {sidebarNavigation.map((group) => (
                <div key={group.title} className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {group.title}
                  </h3>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.url
                      return (
                        <Link
                          key={item.title}
                          href={item.url}
                          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                            isActive
                              ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <item.icon className={`h-4 w-4 ${isActive ? "text-blue-600" : ""}`} />
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Sidebar className="border-r">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white text-lg font-bold">
              I
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">InternDeck</span>
              <span className="truncate text-xs text-muted-foreground">AI Platform</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              Pro
            </Badge>
          </div>

          {/* User Stats in Sidebar */}
          <div className="px-2 py-2 space-y-2">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium">Profile Strength</span>
                <span className="text-xs text-muted-foreground">{userStats.profileCompletion}%</span>
              </div>
              <Progress value={userStats.profileCompletion} className="h-1" />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-orange-50 dark:bg-orange-950 rounded-lg p-2">
                <div className="text-sm font-bold text-orange-600">{userStats.currentStreak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
              <div className="bg-green-50 dark:bg-green-950 rounded-lg p-2">
                <div className="text-sm font-bold text-green-600">L{userStats.level}</div>
                <div className="text-xs text-muted-foreground">Level</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950 rounded-lg p-2">
                <div className="text-sm font-bold text-purple-600">{userStats.totalPoints}</div>
                <div className="text-xs text-muted-foreground">Points</div>
              </div>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {sidebarNavigation.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const isActive = pathname === item.url
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className={`${isActive ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600" : ""} hover:bg-gray-50 transition-colors`}
                        >
                          <Link href={item.url} className="flex items-center gap-3">
                            <item.icon className={`h-4 w-4 ${isActive ? "text-blue-600" : ""}`} />
                            <span className="flex-1">{item.title}</span>
                            {item.badge && (
                              <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter>
          {/* Quick Actions in Footer */}
          <div className="px-2 py-2 space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" asChild>
              <Link href="/dashboard/interviews/mock">
                <Zap className="h-4 w-4 mr-2" />
                Quick Interview
              </Link>
            </Button>
          </div>

          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={user?.avatar_url || "/placeholder.svg?height=32&width=32"}
                          alt={user?.first_name}
                        />
                        <AvatarFallback className="rounded-lg bg-blue-600 text-white">
                          {user?.first_name?.[0]}
                          {user?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.first_name} {user?.last_name}
                        </span>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`}></div>
                          <span className="truncate text-xs text-muted-foreground">
                            {isOnline ? "Online" : "Offline"}
                          </span>
                        </div>
                      </div>
                      <ChevronUp className="ml-auto size-4" />
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={user?.avatar_url || "/placeholder.svg?height=32&width=32"}
                          alt={user?.first_name}
                        />
                        <AvatarFallback className="rounded-lg bg-blue-600 text-white">
                          {user?.first_name?.[0]}
                          {user?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.first_name} {user?.last_name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-4 border-b px-4 bg-white/80 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* LinkedIn-style Search Bar */}
          <div className="flex-1 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search internships, companies, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          </div>

          {/* LinkedIn-style Top Navigation Bar */}
          <div className="hidden lg:flex items-center space-x-1">
            {topNavigation.map((item) => {
              const isActive = pathname === item.url
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  className={`flex flex-col items-center justify-center px-3 py-2 min-w-[80px] text-xs font-medium transition-colors relative group ${
                    isActive
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <div className="relative">
                    <item.icon className="h-5 w-5 mb-1" />
                    {item.badge && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] font-bold"
                      >
                        {item.badge.replace(/\D/g, '')}
                      </Badge>
                    )}
                  </div>
                  <span className="text-center leading-tight">{item.title}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative" onClick={clearNotifications}>
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {notifications}
                </Badge>
              )}
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/calendar">
                <Calendar className="h-4 w-4" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/achievements">
                <Award className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </header>
        <div className="flex flex-1">
          <main className="flex-1 p-4 sm:p-6 bg-gray-50/50 dark:bg-zinc-900/50">
            {children}
          </main>
          <aside className="hidden xl:block w-80 border-l p-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Suggested for you</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Connect with professionals in your field.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Enhance your skills with these recommended courses.
                  </p>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

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
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Moon,
  Sun,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"

const navigation = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: Home, badge: null },
      { title: "Search Internships", url: "/dashboard/search", icon: Search, badge: "12 New" },
    ],
  },
  {
    title: "Preparation",
    items: [
      { title: "Resume Builder", url: "/dashboard/resume", icon: FileText, badge: "AI Ready" },
      { title: "Learning Paths", url: "/dashboard/learning", icon: BookOpen, badge: "67%" },
      { title: "Mock Interviews", url: "/dashboard/interviews", icon: MessageSquare, badge: "3 New" },
    ],
  },
  {
    title: "Progress",
    items: [
      { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3, badge: null },
      { title: "Applications", url: "/dashboard/applications", icon: Briefcase, badge: "5 Pending" },
      { title: "Goals", url: "/dashboard/goals", icon: Target, badge: null },
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

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const { user, loading } = useUser()

  const [userStats, setUserStats] = useState<UserStats>({
    profileCompletion: 85,
    currentStreak: 7,
    totalPoints: 2450,
    level: 3,
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

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been signed out of your account.",
    })
    // Add logout logic here
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
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
          {navigation.map((group) => (
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
                  <DropdownMenuItem onClick={toggleTheme}>
                    {theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
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
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white/80 backdrop-blur-sm">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1" />

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
        <main className="flex-1 p-6 bg-gray-50/50">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

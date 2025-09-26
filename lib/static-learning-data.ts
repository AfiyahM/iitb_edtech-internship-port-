export interface StaticLearningPath {
  id: string
  title: string
  description: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  estimatedTime: string
  skills: string[]
  color: string
  rating: number
  students: number
  instructor: string
  totalResources: number
  videos: StaticVideo[]
}

export interface StaticVideo {
  id: string
  title: string
  description: string
  video_id: string
  youtube_url: string
  duration: number
  order_index: number
  points: number
}

export const staticLearningPaths: StaticLearningPath[] = [
  {
    id: "web-development-fundamentals",
    title: "Web Development Fundamentals",
    description: "Master the basics of HTML, CSS, and JavaScript to build modern websites",
    category: "Web Development",
    difficulty: "Beginner",
    estimatedTime: "4-6 weeks",
    skills: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    color: "bg-blue-500",
    rating: 4.8,
    students: 1250,
    instructor: "Sarah Johnson",
    totalResources: 8,
    videos: [
      {
        id: "html-basics",
        title: "HTML Fundamentals",
        description: "Learn the building blocks of web pages with HTML5",
        video_id: "UB1O30fR-EE",
        youtube_url: "https://www.youtube.com/watch?v=UB1O30fR-EE",
        duration: 900,
        order_index: 1,
        points: 100
      },
      {
        id: "css-styling",
        title: "CSS Styling Basics",
        description: "Style your web pages with CSS3 and modern techniques",
        video_id: "yfoY53QXEnI",
        youtube_url: "https://www.youtube.com/watch?v=yfoY53QXEnI",
        duration: 1200,
        order_index: 2,
        points: 100
      },
      {
        id: "javascript-intro",
        title: "JavaScript Introduction",
        description: "Get started with JavaScript programming fundamentals",
        video_id: "PkZNo7MFNFg",
        youtube_url: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
        duration: 1800,
        order_index: 3,
        points: 150
      },
      {
        id: "responsive-design",
        title: "Responsive Web Design",
        description: "Create websites that work on all devices",
        video_id: "srvUrASNdxs",
        youtube_url: "https://www.youtube.com/watch?v=srvUrASNdxs",
        duration: 1500,
        order_index: 4,
        points: 150
      },
      {
        id: "flexbox-grid",
        title: "CSS Flexbox and Grid",
        description: "Master modern CSS layout techniques",
        video_id: "JJSoEo8JSnc",
        youtube_url: "https://www.youtube.com/watch?v=JJSoEo8JSnc",
        duration: 1600,
        order_index: 5,
        points: 150
      },
      {
        id: "dom-manipulation",
        title: "DOM Manipulation",
        description: "Learn to interact with web pages using JavaScript",
        video_id: "5fb2aPlgoys",
        youtube_url: "https://www.youtube.com/watch?v=5fb2aPlgoys",
        duration: 1400,
        order_index: 6,
        points: 150
      },
      {
        id: "forms-validation",
        title: "Forms and Validation",
        description: "Create interactive forms with proper validation",
        video_id: "rsd4FNGTRBw",
        youtube_url: "https://www.youtube.com/watch?v=rsd4FNGTRBw",
        duration: 1300,
        order_index: 7,
        points: 150
      },
      {
        id: "project-portfolio",
        title: "Build Your Portfolio",
        description: "Create a professional portfolio website",
        video_id: "xV7S8BhIeBo",
        youtube_url: "https://www.youtube.com/watch?v=xV7S8BhIeBo",
        duration: 2400,
        order_index: 8,
        points: 200
      }
    ]
  },
  {
    id: "react-development",
    title: "React Development Mastery",
    description: "Build modern web applications with React and its ecosystem",
    category: "Frontend Framework",
    difficulty: "Intermediate",
    estimatedTime: "6-8 weeks",
    skills: ["React", "JSX", "Hooks", "State Management", "Component Design"],
    color: "bg-cyan-500",
    rating: 4.9,
    students: 980,
    instructor: "Alex Chen",
    totalResources: 10,
    videos: [
      {
        id: "react-intro",
        title: "Introduction to React",
        description: "Understanding React fundamentals and component-based architecture",
        video_id: "Tn6-PIqc4UM",
        youtube_url: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
        duration: 1800,
        order_index: 1,
        points: 150
      },
      {
        id: "jsx-components",
        title: "JSX and Components",
        description: "Learn JSX syntax and how to create reusable components",
        video_id: "DLX62G4lc44",
        youtube_url: "https://www.youtube.com/watch?v=DLX62G4lc44",
        duration: 1500,
        order_index: 2,
        points: 150
      },
      {
        id: "props-state",
        title: "Props and State",
        description: "Master data flow in React applications",
        video_id: "IYvD9oBCuJI",
        youtube_url: "https://www.youtube.com/watch?v=IYvD9oBCuJI",
        duration: 1600,
        order_index: 3,
        points: 150
      },
      {
        id: "react-hooks",
        title: "React Hooks Deep Dive",
        description: "useState, useEffect, and custom hooks",
        video_id: "O6P86uwfdR0",
        youtube_url: "https://www.youtube.com/watch?v=O6P86uwfdR0",
        duration: 2100,
        order_index: 4,
        points: 200
      },
      {
        id: "event-handling",
        title: "Event Handling in React",
        description: "Handle user interactions and form submissions",
        video_id: "Znqv84xi8Vs",
        youtube_url: "https://www.youtube.com/watch?v=Znqv84xi8Vs",
        duration: 1400,
        order_index: 5,
        points: 150
      },
      {
        id: "conditional-rendering",
        title: "Conditional Rendering",
        description: "Display content based on application state",
        video_id: "7o5FPaVA9m0",
        youtube_url: "https://www.youtube.com/watch?v=7o5FPaVA9m0",
        duration: 1200,
        order_index: 6,
        points: 150
      },
      {
        id: "lists-keys",
        title: "Lists and Keys",
        description: "Render dynamic lists efficiently in React",
        video_id: "0sasRxl35_8",
        youtube_url: "https://www.youtube.com/watch?v=0sasRxl35_8",
        duration: 1300,
        order_index: 7,
        points: 150
      },
      {
        id: "context-api",
        title: "Context API",
        description: "Manage global state without prop drilling",
        video_id: "35lXWvCuM8o",
        youtube_url: "https://www.youtube.com/watch?v=35lXWvCuM8o",
        duration: 1700,
        order_index: 8,
        points: 200
      },
      {
        id: "react-router",
        title: "React Router",
        description: "Add navigation to your React applications",
        video_id: "Law7wfdg_ls",
        youtube_url: "https://www.youtube.com/watch?v=Law7wfdg_ls",
        duration: 1900,
        order_index: 9,
        points: 200
      },
      {
        id: "react-project",
        title: "Complete React Project",
        description: "Build a full-featured React application",
        video_id: "hQAHSlTtcmY",
        youtube_url: "https://www.youtube.com/watch?v=hQAHSlTtcmY",
        duration: 3600,
        order_index: 10,
        points: 300
      }
    ]
  },
  {
    id: "python-programming",
    title: "Python Programming Essentials",
    description: "Learn Python from basics to advanced concepts for web development and data science",
    category: "Programming Language",
    difficulty: "Beginner",
    estimatedTime: "5-7 weeks",
    skills: ["Python", "Data Structures", "OOP", "File Handling", "Libraries"],
    color: "bg-green-500",
    rating: 4.7,
    students: 1500,
    instructor: "Dr. Maria Rodriguez",
    totalResources: 12,
    videos: [
      {
        id: "python-intro",
        title: "Python Introduction",
        description: "Getting started with Python programming language",
        video_id: "_uQrJ0TkZlc",
        youtube_url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
        duration: 1800,
        order_index: 1,
        points: 100
      },
      {
        id: "variables-datatypes",
        title: "Variables and Data Types",
        description: "Understanding Python variables and basic data types",
        video_id: "cQT33yu9pY8",
        youtube_url: "https://www.youtube.com/watch?v=cQT33yu9pY8",
        duration: 1500,
        order_index: 2,
        points: 100
      },
      {
        id: "control-structures",
        title: "Control Structures",
        description: "If statements, loops, and conditional logic",
        video_id: "DZwmZ8Usvnk",
        youtube_url: "https://www.youtube.com/watch?v=DZwmZ8Usvnk",
        duration: 1600,
        order_index: 3,
        points: 150
      },
      {
        id: "functions",
        title: "Functions in Python",
        description: "Creating and using functions for code reusability",
        video_id: "9Os0o3wzS_I",
        youtube_url: "https://www.youtube.com/watch?v=9Os0o3wzS_I",
        duration: 1700,
        order_index: 4,
        points: 150
      },
      {
        id: "data-structures",
        title: "Data Structures",
        description: "Lists, tuples, dictionaries, and sets",
        video_id: "R-HLU9Fl5ug",
        youtube_url: "https://www.youtube.com/watch?v=R-HLU9Fl5ug",
        duration: 2000,
        order_index: 5,
        points: 200
      },
      {
        id: "file-handling",
        title: "File Handling",
        description: "Reading from and writing to files in Python",
        video_id: "Uh2ebFW8OYM",
        youtube_url: "https://www.youtube.com/watch?v=Uh2ebFW8OYM",
        duration: 1400,
        order_index: 6,
        points: 150
      },
      {
        id: "error-handling",
        title: "Error Handling",
        description: "Exception handling and debugging techniques",
        video_id: "NIWwJbo-9_8",
        youtube_url: "https://www.youtube.com/watch?v=NIWwJbo-9_8",
        duration: 1300,
        order_index: 7,
        points: 150
      },
      {
        id: "oop-basics",
        title: "Object-Oriented Programming",
        description: "Classes, objects, and OOP principles",
        video_id: "JeznW_7DlB0",
        youtube_url: "https://www.youtube.com/watch?v=JeznW_7DlB0",
        duration: 2200,
        order_index: 8,
        points: 200
      },
      {
        id: "modules-packages",
        title: "Modules and Packages",
        description: "Organizing code with modules and packages",
        video_id: "CqvZ3vGoGs0",
        youtube_url: "https://www.youtube.com/watch?v=CqvZ3vGoGs0",
        duration: 1500,
        order_index: 9,
        points: 150
      },
      {
        id: "libraries",
        title: "Popular Python Libraries",
        description: "Introduction to NumPy, Pandas, and Requests",
        video_id: "GPVsHOlRBBI",
        youtube_url: "https://www.youtube.com/watch?v=GPVsHOlRBBI",
        duration: 2400,
        order_index: 10,
        points: 200
      },
      {
        id: "web-scraping",
        title: "Web Scraping with Python",
        description: "Extract data from websites using BeautifulSoup",
        video_id: "XVv6mJpFOb0",
        youtube_url: "https://www.youtube.com/watch?v=XVv6mJpFOb0",
        duration: 2100,
        order_index: 11,
        points: 200
      },
      {
        id: "python-project",
        title: "Python Capstone Project",
        description: "Build a complete Python application",
        video_id: "8ext9G7xspg",
        youtube_url: "https://www.youtube.com/watch?v=8ext9G7xspg",
        duration: 3000,
        order_index: 12,
        points: 300
      }
    ]
  },
  {
    id: "data-science-basics",
    title: "Data Science Fundamentals",
    description: "Introduction to data analysis, visualization, and machine learning concepts",
    category: "Data Science",
    difficulty: "Intermediate",
    estimatedTime: "8-10 weeks",
    skills: ["Python", "Pandas", "NumPy", "Matplotlib", "Statistics", "Machine Learning"],
    color: "bg-purple-500",
    rating: 4.6,
    students: 750,
    instructor: "Prof. David Kim",
    totalResources: 15,
    videos: [
      {
        id: "data-science-intro",
        title: "Introduction to Data Science",
        description: "Overview of data science field and applications",
        video_id: "ua-CiDNNj30",
        youtube_url: "https://www.youtube.com/watch?v=ua-CiDNNj30",
        duration: 1500,
        order_index: 1,
        points: 100
      },
      {
        id: "numpy-basics",
        title: "NumPy Fundamentals",
        description: "Working with arrays and numerical computations",
        video_id: "QUT1VHiLmmI",
        youtube_url: "https://www.youtube.com/watch?v=QUT1VHiLmmI",
        duration: 1800,
        order_index: 2,
        points: 150
      },
      {
        id: "pandas-intro",
        title: "Pandas for Data Analysis",
        description: "Data manipulation and analysis with Pandas",
        video_id: "vmEHCJofslg",
        youtube_url: "https://www.youtube.com/watch?v=vmEHCJofslg",
        duration: 2400,
        order_index: 3,
        points: 200
      },
      {
        id: "data-visualization",
        title: "Data Visualization",
        description: "Creating charts and graphs with Matplotlib and Seaborn",
        video_id: "UO98lJQ3QGI",
        youtube_url: "https://www.youtube.com/watch?v=UO98lJQ3QGI",
        duration: 2100,
        order_index: 4,
        points: 200
      },
      {
        id: "statistics-basics",
        title: "Statistics for Data Science",
        description: "Descriptive and inferential statistics concepts",
        video_id: "xxpc-HPKN28",
        youtube_url: "https://www.youtube.com/watch?v=xxpc-HPKN28",
        duration: 2200,
        order_index: 5,
        points: 200
      }
    ]
  },
  {
    id: "mobile-app-development",
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile applications using React Native",
    category: "Mobile Development",
    difficulty: "Advanced",
    estimatedTime: "10-12 weeks",
    skills: ["React Native", "Mobile UI", "Navigation", "APIs", "App Store"],
    color: "bg-indigo-500",
    rating: 4.5,
    students: 650,
    instructor: "Jennifer Lee",
    totalResources: 18,
    videos: [
      {
        id: "react-native-intro",
        title: "React Native Introduction",
        description: "Getting started with React Native development",
        video_id: "0-S5a0eXPoc",
        youtube_url: "https://www.youtube.com/watch?v=0-S5a0eXPoc",
        duration: 2100,
        order_index: 1,
        points: 150
      },
      {
        id: "mobile-components",
        title: "Mobile Components",
        description: "Understanding React Native components and styling",
        video_id: "qSRrxpdMpVc",
        youtube_url: "https://www.youtube.com/watch?v=qSRrxpdMpVc",
        duration: 1900,
        order_index: 2,
        points: 150
      },
      {
        id: "navigation-setup",
        title: "Navigation in React Native",
        description: "Implementing navigation between screens",
        video_id: "nQVCkqvU1uE",
        youtube_url: "https://www.youtube.com/watch?v=nQVCkqvU1uE",
        duration: 2000,
        order_index: 3,
        points: 200
      }
    ]
  }
]

export function getStaticLearningPaths(): StaticLearningPath[] {
  return staticLearningPaths
}

export function getStaticLearningPath(id: string): StaticLearningPath | undefined {
  return staticLearningPaths.find(path => path.id === id)
}

export function getStaticVideo(pathId: string, videoId: string): StaticVideo | undefined {
  const path = getStaticLearningPath(pathId)
  return path?.videos.find(video => video.video_id === videoId)
}

"use client"

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Icons as simple components
const Icon = ({ d, size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
);

const Icons = {
  Home: () => <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />,
  Users: () => <Icon d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
  Target: () => <Icon d="M12 12m-10 0a10 10 0 1 0 20 0 10 10 0 1 0-20 0 M12 12m-6 0a6 6 0 1 0 12 0 6 6 0 1 0-12 0 M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0" />,
  Calendar: () => <Icon d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M16 2v4 M8 2v4 M3 10h18" />,
  TrendingUp: () => <Icon d="M22 7l-8.5 8.5-5-5L2 17 M16 7h6v6" />,
  MapPin: () => <Icon d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />,
  Briefcase: () => <Icon d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />,
  Plus: () => <Icon d="M12 5v14 M5 12h14" />,
  Check: () => <Icon d="M20 6L9 17l-5-5" />,
  X: () => <Icon d="M18 6L6 18 M6 6l12 12" />,
  Edit: () => <Icon d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />,
  Trash: () => <Icon d="M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />,
  Phone: () => <Icon d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z" />,
  Mail: () => <Icon d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M22 6l-10 7L2 6" />,
  Activity: () => <Icon d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  BarChart: () => <Icon d="M12 20V10 M18 20V4 M6 20v-4" />,
  Award: () => <Icon d="M12 8a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />,
  ChevronRight: () => <Icon d="M9 18l6-6-6-6" size={16} />,
  Sun: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  Moon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  HelpCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Download: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Upload: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
};

// Colors
const colors = {
  primary: '#0891b2',
  primaryDark: '#0e7490',
  success: '#10b981',
  warning: '#f59e0b',
  rose: '#f43f5e',
  violet: '#8b5cf6',
};

// Initial Data
const initialContacts = [];

const initialDeals = [];

const initialTasks = [];

const initialProperties = [];

const initialActivities = [];

const masteryData = [
  { name: "Gables Estates", progress: 72, color: colors.primary },
  { name: "Cocoplum", progress: 45, color: colors.violet },
  { name: "Old Cutler Bay", progress: 28, color: colors.rose },
];

// Comprehensive Mastery System Data
const neighborhoodDetails = {
  'Gables Estates': {
    color: colors.primary,
    inventory: 18,
    avgPrice: 28.5,
    pricePerSqFt: 2450,
    avgDom: 74,
    avgLotSize: '1.2 acres',
    keyBuilders: ['Cesar Molina', 'Ramon Pacheco', 'Randall Stofft'],
    keyArchitects: ['Chad Oppenheim', 'Rafael Portuondo', 'Kobi Karp'],
    characteristics: ['Guard-gated', 'Waterfront lots', 'Old Cutler Road access', 'Mature tree canopy'],
  },
  'Cocoplum': {
    color: colors.violet,
    inventory: 32,
    avgPrice: 15.2,
    pricePerSqFt: 1890,
    avgDom: 146,
    avgLotSize: '0.75 acres',
    keyBuilders: ['Luis Bosch', 'Bart Reines', 'Todd Glaser'],
    keyArchitects: ['Max Strang', 'Roney Mateu', 'Carlos Zapata'],
    characteristics: ['24/7 guard gate', 'Tennis & marina', 'Mix of waterfront & dry lots', 'Coral Gables schools'],
  },
  'Old Cutler Bay': {
    color: colors.rose,
    inventory: 12,
    avgPrice: 19.8,
    pricePerSqFt: 2727,
    avgDom: 98,
    avgLotSize: '1.5 acres',
    keyBuilders: ['Brodson Construction', 'Moss CM', 'NDG Architecture'],
    keyArchitects: ['Touzet Studio', 'SDH Studio', 'ADD Inc'],
    characteristics: ['Unincorporated Miami-Dade', 'Large estate lots', 'Privacy', 'Pinecrest schools'],
  }
};

const quizQuestions = {
  'Gables Estates': [
    { id: 1, question: "What is the approximate average price per sqft in Gables Estates?", options: ["$1,800", "$2,450", "$3,200", "$1,500"], correct: 1 },
    { id: 2, question: "Which of these is a signature architect in Gables Estates?", options: ["Frank Lloyd Wright", "Chad Oppenheim", "Zaha Hadid", "I.M. Pei"], correct: 1 },
    { id: 3, question: "What is the typical lot size in Gables Estates?", options: ["0.5 acres", "0.75 acres", "1.2 acres", "2.5 acres"], correct: 2 },
    { id: 4, question: "Gables Estates is accessed primarily via which road?", options: ["US-1", "Old Cutler Road", "Coral Way", "Bird Road"], correct: 1 },
    { id: 5, question: "What is the average Days on Market in Gables Estates?", options: ["30 days", "74 days", "120 days", "200 days"], correct: 1 },
    { id: 6, question: "How many active listings are typically in Gables Estates?", options: ["5-10", "15-20", "30-40", "50+"], correct: 1 },
  ],
  'Cocoplum': [
    { id: 1, question: "What amenities does Cocoplum offer residents?", options: ["Golf course", "Tennis & marina", "Ski lodge", "Theme park"], correct: 1 },
    { id: 2, question: "What is the average price point in Cocoplum?", options: ["$8M", "$15M", "$25M", "$40M"], correct: 1 },
    { id: 3, question: "Which school district serves Cocoplum?", options: ["Miami Beach", "Coral Gables", "Pinecrest", "Key Biscayne"], correct: 1 },
    { id: 4, question: "What type of security does Cocoplum have?", options: ["None", "Roving patrol", "24/7 guard gate", "Video only"], correct: 2 },
    { id: 5, question: "What is a key builder in Cocoplum?", options: ["Todd Glaser", "Frank Gehry", "Philip Johnson", "Le Corbusier"], correct: 0 },
    { id: 6, question: "What is the average DOM in Cocoplum?", options: ["45 days", "90 days", "146 days", "250 days"], correct: 2 },
  ],
  'Old Cutler Bay': [
    { id: 1, question: "Old Cutler Bay is in which jurisdiction?", options: ["City of Miami", "Coral Gables", "Unincorporated Miami-Dade", "Pinecrest"], correct: 2 },
    { id: 2, question: "What is the typical lot size in Old Cutler Bay?", options: ["0.25 acres", "0.5 acres", "1.5 acres", "5 acres"], correct: 2 },
    { id: 3, question: "What is the average price per sqft?", options: ["$1,500", "$2,000", "$2,727", "$3,500"], correct: 2 },
    { id: 4, question: "Which school district serves Old Cutler Bay?", options: ["Miami Beach", "Coral Gables", "Pinecrest", "Homestead"], correct: 2 },
    { id: 5, question: "What is a defining characteristic of Old Cutler Bay?", options: ["High-rise condos", "Large estate lots & privacy", "Beach access", "Urban living"], correct: 1 },
    { id: 6, question: "What is the current inventory level?", options: ["5 homes", "12 homes", "25 homes", "50 homes"], correct: 1 },
  ]
};

const dailyHabits = [
  { id: 1, title: "Review 3 active listings", description: "Study photos, price history, and unique features", icon: "🏠", points: 10 },
  { id: 2, title: "Analyze 1 recent sale", description: "Compare list vs sale price, DOM, buyer profile", icon: "📊", points: 10 },
  { id: 3, title: "Drive the neighborhood", description: "15-minute tour, note new construction & changes", icon: "🚗", points: 15 },
  { id: 4, title: "Practice property descriptions", description: "Write 2 compelling descriptions from memory", icon: "✍️", points: 10 },
  { id: 5, title: "Study one property in depth", description: "History, renovations, lot details, neighbors", icon: "🔍", points: 15 },
];

const weeklyTasks = [
  { id: 1, title: "Deep dive: Property history research", description: "Research 5 properties - ownership history, permits, renovations", day: "Monday", points: 25 },
  { id: 2, title: "Builder & architect study", description: "Research one builder/architect active in the area", day: "Tuesday", points: 20 },
  { id: 3, title: "Market trend analysis", description: "Compare current stats to 3, 6, 12 months ago", day: "Wednesday", points: 25 },
  { id: 4, title: "Neighborhood tour with focus", description: "1-hour dedicated drive, photograph 10 properties", day: "Thursday", points: 30 },
  { id: 5, title: "Competitive analysis", description: "Review what other agents are saying/marketing", day: "Friday", points: 20 },
  { id: 6, title: "Practice presentations", description: "Role-play listing presentation with neighborhood focus", day: "Saturday", points: 25 },
  { id: 7, title: "Weekly quiz & review", description: "Take quiz, review mistakes, plan next week", day: "Sunday", points: 30 },
];

const expertStandards = [
  { id: 1, title: "Name 5 current listings with price, sqft, and key features", category: "Listings" },
  { id: 2, title: "Recall 3 recent sales with list price, sale price, and DOM", category: "Sales" },
  { id: 3, title: "Identify top 3 builders active in the neighborhood", category: "Market Players" },
  { id: 4, title: "Name 2 signature architects and their notable projects", category: "Market Players" },
  { id: 5, title: "Describe typical lot sizes, setbacks, and zoning", category: "Technical" },
  { id: 6, title: "Explain school districts and ratings", category: "Lifestyle" },
  { id: 7, title: "List 3 unique selling points vs competing neighborhoods", category: "Positioning" },
  { id: 8, title: "Quote current avg price, price/sqft, and DOM accurately", category: "Statistics" },
];

// LocalStorage helpers
const STORAGE_KEYS = {
  contacts: 'regroup_contacts',
  deals: 'regroup_deals',
  tasks: 'regroup_tasks',
  activities: 'regroup_activities',
  quizScores: 'regroup_quizScores',
  completedDailyHabits: 'regroup_dailyHabits',
  completedWeeklyTasks: 'regroup_weeklyTasks',
  masteredProperties: 'regroup_masteredProperties',
  totalPoints: 'regroup_totalPoints',
  currentStreak: 'regroup_currentStreak',
  darkMode: 'regroup_darkMode',
  goals: 'regroup_goals',
  templates: 'regroup_templates',
  properties: 'regroup_properties',
};

const loadFromStorage = (key, defaultValue) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.warn(`Error loading ${key} from localStorage:`, e);
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error saving ${key} to localStorage:`, e);
  }
};

// Supabase helper functions
const toCamelCase = (obj) => {
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

const toSnakeCase = (obj) => {
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      result[snakeKey] = toSnakeCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

// Main Component
export default function REGroupHub({ user }) {
  // Date constants (needed early for various hooks)
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Loading state for Supabase
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(() => loadFromStorage(STORAGE_KEYS.darkMode, false));
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  
  // User profile
  const [userProfile, setUserProfile] = useState({ displayName: '', company: '', phone: '', title: '' });
  
  // Modal states
  const [showModal, setShowModal] = useState(null);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [formData, setFormData] = useState({});
  
  // Contact search/filter
  const [contactSearch, setContactSearch] = useState('');
  const [contactFilter, setContactFilter] = useState('All');
  
  // Edit states
  const [editingContact, setEditingContact] = useState(null);
  const [editingDeal, setEditingDeal] = useState(null);

  // Mastery state
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Gables Estates');
  const [masteryView, setMasteryView] = useState('overview');
  const [completedDailyHabits, setCompletedDailyHabits] = useState({});
  const [completedWeeklyTasks, setCompletedWeeklyTasks] = useState({});
  const [quizState, setQuizState] = useState({ active: false, currentQuestion: 0, answers: [], showResults: false });
  const [quizScores, setQuizScores] = useState({});
  const [masteredProperties, setMasteredProperties] = useState({});
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [helpSection, setHelpSection] = useState('getting-started');
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  // Goals state
  const [goals, setGoals] = useState({
    annual: { target: 500000, label: '2026 Annual Income Goal' },
    q1: { target: 125000, label: 'Q1 2026' },
    q2: { target: 125000, label: 'Q2 2026' },
    q3: { target: 125000, label: 'Q3 2026' },
    q4: { target: 125000, label: 'Q4 2026' },
  });
  const [showGoalsModal, setShowGoalsModal] = useState(false);

  // Email/SMS Templates
  const [templates, setTemplates] = useState([]);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);

  // Calendar state
  const [calendarView, setCalendarView] = useState('week');
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Properties state
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [propertySearch, setPropertySearch] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('All');

  // Drag & Drop state
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState(null);
  
  // Toast notification state
  const [toast, setToast] = useState(null);
  
  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  // AI Assistant state
  const [showAssistant, setShowAssistant] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState([
    { role: 'assistant', content: "Hi Roxanna! 👋 I'm your AI assistant. I can help you with:\n\n• **Deal coaching** - strategies for moving deals forward\n• **Follow-up suggestions** - who to contact and when\n• **Email drafting** - professional outreach based on your templates\n• **Pipeline analysis** - insights on your performance\n\nWhat would you like help with?" }
  ]);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantLoading, setAssistantLoading] = useState(false);

  // Load data from Supabase or localStorage on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      
      if (isSupabaseConfigured()) {
        try {
          // Fetch all data from Supabase in parallel
          const [
            contactsRes,
            dealsRes,
            tasksRes,
            activitiesRes,
            propertiesRes,
            templatesRes,
            settingsRes
          ] = await Promise.all([
            supabase.from('contacts').select('*').order('created_at', { ascending: false }),
            supabase.from('deals').select('*').order('created_at', { ascending: false }),
            supabase.from('tasks').select('*').order('due_date', { ascending: true }),
            supabase.from('activities').select('*').order('date', { ascending: false }),
            supabase.from('properties').select('*').order('created_at', { ascending: false }),
            supabase.from('templates').select('*').order('name', { ascending: true }),
            supabase.from('user_settings').select('*').eq('user_id', user?.id).maybeSingle()
          ]);

          if (contactsRes.error) throw contactsRes.error;
          if (dealsRes.error) throw dealsRes.error;
          if (tasksRes.error) throw tasksRes.error;
          if (activitiesRes.error) throw activitiesRes.error;
          if (propertiesRes.error) throw propertiesRes.error;
          if (templatesRes.error) throw templatesRes.error;

          setContacts(toCamelCase(contactsRes.data || []));
          setDeals(toCamelCase(dealsRes.data || []));
          setTasks(toCamelCase(tasksRes.data || []));
          setActivities(toCamelCase(activitiesRes.data || []));
          setProperties(toCamelCase(propertiesRes.data || []));
          setTemplates(toCamelCase(templatesRes.data || []));
          
          // Load user settings
          if (settingsRes.data?.settings) {
            const s = settingsRes.data.settings;
            if (s.darkMode !== undefined) setDarkMode(s.darkMode);
            if (s.goals) setGoals(s.goals);
            if (s.quizScores) setQuizScores(s.quizScores);
            if (s.completedDailyHabits) setCompletedDailyHabits(s.completedDailyHabits);
            if (s.completedWeeklyTasks) setCompletedWeeklyTasks(s.completedWeeklyTasks);
            if (s.masteredProperties) setMasteredProperties(s.masteredProperties);
            if (s.totalPoints !== undefined) setTotalPoints(s.totalPoints);
            if (s.currentStreak !== undefined) setCurrentStreak(s.currentStreak);
            if (s.userProfile) setUserProfile(s.userProfile);
          }
          
          // Check onboarding
          const onboardingSeen = localStorage.getItem('regroup_onboarding_seen');
          setShowOnboarding(!onboardingSeen);
          
          console.log('✅ Data loaded from Supabase');
        } catch (err) {
          console.error('Supabase error:', err);
          setDbError(err.message);
          // Fall back to localStorage
          loadFromLocalStorage();
        }
      } else {
        // No Supabase, use localStorage
        console.log('📦 Using localStorage (Supabase not configured)');
        loadFromLocalStorage();
      }
      
      setIsLoading(false);
    }
    
    function loadFromLocalStorage() {
      setContacts(loadFromStorage(STORAGE_KEYS.contacts, []));
      setDeals(loadFromStorage(STORAGE_KEYS.deals, []));
      setTasks(loadFromStorage(STORAGE_KEYS.tasks, []));
      setActivities(loadFromStorage(STORAGE_KEYS.activities, []));
      setProperties(loadFromStorage(STORAGE_KEYS.properties, []));
      setTemplates(loadFromStorage(STORAGE_KEYS.templates, [
        { id: 1, name: 'Initial Outreach', category: 'Email', subject: 'Luxury Real Estate Opportunity', body: 'Hi [Name],\n\nI hope this message finds you well. I wanted to reach out regarding some exceptional properties in [Neighborhood] that align with your preferences.\n\nWould you be available for a brief call this week to discuss?\n\nBest regards,\nRoxanna Urban\nOne Sotheby\'s International Realty' },
        { id: 2, name: 'Listing Follow-up', category: 'Email', subject: 'Following Up on [Property]', body: 'Hi [Name],\n\nI wanted to follow up on your interest in [Property]. The property is still available and I\'d love to schedule a private showing at your convenience.\n\nPlease let me know what times work best for you.\n\nBest,\nRoxanna' },
        { id: 3, name: 'Market Update', category: 'Email', subject: '[Neighborhood] Market Update', body: 'Hi [Name],\n\nI wanted to share some recent market activity in [Neighborhood]:\n\n• New listings: [X]\n• Recent sales: [X]\n• Average price/sqft: $[X]\n\nLet me know if you\'d like to discuss any opportunities.\n\nBest,\nRoxanna' },
        { id: 4, name: 'Quick Check-in', category: 'SMS', subject: '', body: 'Hi [Name]! Just checking in to see if you\'re still interested in [Neighborhood]. Any updates on your timeline? - Roxanna' },
        { id: 5, name: 'Showing Confirmation', category: 'SMS', subject: '', body: 'Hi [Name], confirming our showing tomorrow at [Time] for [Property]. Looking forward to seeing you! - Roxanna' },
      ]));
      setGoals(loadFromStorage(STORAGE_KEYS.goals, goals));
      setQuizScores(loadFromStorage(STORAGE_KEYS.quizScores, {}));
      setCompletedDailyHabits(loadFromStorage(STORAGE_KEYS.completedDailyHabits, {}));
      setCompletedWeeklyTasks(loadFromStorage(STORAGE_KEYS.completedWeeklyTasks, {}));
      setMasteredProperties(loadFromStorage(STORAGE_KEYS.masteredProperties, {}));
      setTotalPoints(loadFromStorage(STORAGE_KEYS.totalPoints, 0));
      setCurrentStreak(loadFromStorage(STORAGE_KEYS.currentStreak, 0));
      setDarkMode(loadFromStorage(STORAGE_KEYS.darkMode, false));
      
      const onboardingSeen = localStorage.getItem('regroup_onboarding_seen');
      setShowOnboarding(!onboardingSeen);
    }
    
    loadData();
  }, []);

  // Save settings to Supabase (debounced)
  useEffect(() => {
    if (isLoading) return;
    
    const saveSettings = async () => {
      const settings = {
        darkMode,
        goals,
        quizScores,
        completedDailyHabits,
        completedWeeklyTasks,
        masteredProperties,
        totalPoints,
        currentStreak,
        userProfile
      };
      
      // Always save to localStorage
      saveToStorage(STORAGE_KEYS.darkMode, darkMode);
      saveToStorage(STORAGE_KEYS.goals, goals);
      saveToStorage(STORAGE_KEYS.quizScores, quizScores);
      saveToStorage(STORAGE_KEYS.completedDailyHabits, completedDailyHabits);
      saveToStorage(STORAGE_KEYS.completedWeeklyTasks, completedWeeklyTasks);
      saveToStorage(STORAGE_KEYS.masteredProperties, masteredProperties);
      saveToStorage(STORAGE_KEYS.totalPoints, totalPoints);
      saveToStorage(STORAGE_KEYS.currentStreak, currentStreak);
      
      // Save to Supabase if configured
      if (isSupabaseConfigured()) {
        try {
          await supabase.from('user_settings').upsert({
            user_id: user?.id || 'default',
            settings,
            updated_at: new Date().toISOString()
          });
        } catch (err) {
          console.error('Error saving settings to Supabase:', err);
        }
      }
    };
    
    const timer = setTimeout(saveSettings, 1000);
    return () => clearTimeout(timer);
  }, [isLoading, darkMode, goals, quizScores, completedDailyHabits, completedWeeklyTasks, masteredProperties, totalPoints, currentStreak, userProfile, user]);

  // Supabase CRUD helpers
  const dbInsert = async (table, record) => {
    // Save to localStorage first
    const localId = Date.now();
    const newRecord = { ...record, id: localId };
    
    if (isSupabaseConfigured()) {
      try {
        const { id, ...recordWithoutId } = record;
        // Add user_id if user is logged in
        const recordWithUser = user ? { ...recordWithoutId, userId: user.id } : recordWithoutId;
        const { data, error } = await supabase
          .from(table)
          .insert([toSnakeCase(recordWithUser)])
          .select()
          .single();
        
        if (error) throw error;
        return toCamelCase(data);
      } catch (err) {
        console.error(`Error inserting into ${table}:`, err);
        return newRecord; // Return local version on error
      }
    }
    return newRecord;
  };

  const dbUpdate = async (table, id, updates) => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from(table)
          .update(toSnakeCase(updates))
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return toCamelCase(data);
      } catch (err) {
        console.error(`Error updating ${table}:`, err);
        return { ...updates, id };
      }
    }
    return { ...updates, id };
  };

  const dbDelete = async (table, id) => {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error(`Error deleting from ${table}:`, err);
      }
    }
  };

  // Save data to localStorage as backup whenever it changes
  useEffect(() => { if (!isLoading) saveToStorage(STORAGE_KEYS.contacts, contacts); }, [contacts, isLoading]);
  useEffect(() => { if (!isLoading) saveToStorage(STORAGE_KEYS.deals, deals); }, [deals, isLoading]);
  useEffect(() => { if (!isLoading) saveToStorage(STORAGE_KEYS.tasks, tasks); }, [tasks, isLoading]);
  useEffect(() => { if (!isLoading) saveToStorage(STORAGE_KEYS.activities, activities); }, [activities, isLoading]);
  useEffect(() => { if (!isLoading) saveToStorage(STORAGE_KEYS.properties, properties); }, [properties, isLoading]);
  useEffect(() => { if (!isLoading) saveToStorage(STORAGE_KEYS.templates, templates); }, [templates, isLoading]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Show toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }
      
      // Global shortcuts
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowHelp(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowGlobalSearch(true);
      }
      if (e.key === 'Escape') {
        setShowModal(null);
        setShowHelp(false);
        setShowGlobalSearch(false);
        setSelectedDeal(null);
        setSelectedContact(null);
        setSelectedProperty(null);
        setShowGoalsModal(false);
        setShowTemplatesModal(false);
        setConfirmDialog(null);
      }
      
      // Quick create shortcuts (only when no modal is open)
      if (!showModal && !showHelp && !showGlobalSearch && !selectedDeal && !selectedContact && !selectedProperty) {
        if (e.key === 'n' || e.key === 'N') {
          e.preventDefault();
          setFormData({ title: '', dueDate: todayStr, priority: 'Medium', contactId: '' });
          setShowModal('task');
        }
        if (e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          setFormData({ property: '', neighborhood: '', stage: 'Lead', value: '', commissionPercent: 2.5, commission: '', type: 'Buyer', nextStep: '', contactIds: [], notes: '' });
          setShowModal('deal');
        }
        if (e.key === 'c' || e.key === 'C') {
          e.preventDefault();
          setFormData({ name: '', company: '', type: 'Buyer', email: '', phone: '', status: 'Active', neighborhood: '' });
          setShowModal('contact');
        }
        if (e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          setFormData({ type: 'Call', contactId: '', description: '', date: todayStr, outcome: 'Positive' });
          setShowModal('activity');
        }
        // Number keys for tab navigation
        if (e.key >= '1' && e.key <= '9') {
          const tabIndex = parseInt(e.key) - 1;
          const tabIds = ['overview', 'calendar', 'tasks', 'activities', 'pipeline', 'contacts', 'properties', 'analytics', 'mastery'];
          if (tabIndex < tabIds.length) {
            e.preventDefault();
            setActiveTab(tabIds[tabIndex]);
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal, showHelp, showGlobalSearch, selectedDeal, selectedContact, selectedProperty, todayStr]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowGlobalSearch(true);
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        if (showGlobalSearch) {
          setShowGlobalSearch(false);
          setGlobalSearchQuery('');
        }
        if (showHelp) setShowHelp(false);
        if (showModal) setShowModal(null);
        if (selectedDeal) setSelectedDeal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGlobalSearch, showHelp, showModal, selectedDeal]);

  // Dynamic date/time helpers
  const now = new Date();
  const currentHour = now.getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';
  const formattedDate = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const userName = userProfile.displayName || user?.email?.split('@')[0] || 'there';

  // Task due date helpers
  const getTaskDueStatus = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'overdue', label: `${Math.abs(diffDays)}d overdue`, color: 'text-rose-400', bg: 'bg-rose-500/20' };
    if (diffDays === 0) return { status: 'today', label: 'Due today', color: 'text-amber-400', bg: 'bg-amber-500/20' };
    if (diffDays === 1) return { status: 'tomorrow', label: 'Tomorrow', color: 'text-cyan-400', bg: 'bg-cyan-500/20' };
    if (diffDays <= 7) return { status: 'upcoming', label: `${diffDays}d`, color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
    return { status: 'future', label: dueDate, color: theme.textMuted, bg: theme.bgMuted };
  };

  const overdueTasks = tasks.filter(t => t.status === 'Pending' && getTaskDueStatus(t.dueDate).status === 'overdue').length;
  const todayTasks = tasks.filter(t => t.status === 'Pending' && getTaskDueStatus(t.dueDate).status === 'today').length;

  // Global search function
  const getSearchResults = (query) => {
    if (!query.trim()) return { contacts: [], deals: [], tasks: [], activities: [] };
    const q = query.toLowerCase();
    return {
      contacts: contacts.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.company?.toLowerCase().includes(q) || 
        c.email?.toLowerCase().includes(q) ||
        c.type?.toLowerCase().includes(q)
      ),
      deals: deals.filter(d => 
        d.property.toLowerCase().includes(q) || 
        d.neighborhood?.toLowerCase().includes(q) ||
        d.type?.toLowerCase().includes(q) ||
        d.stage?.toLowerCase().includes(q)
      ),
      tasks: tasks.filter(t => 
        t.title.toLowerCase().includes(q)
      ),
      activities: activities.filter(a => 
        a.description?.toLowerCase().includes(q) || 
        a.contactName?.toLowerCase().includes(q) ||
        a.type?.toLowerCase().includes(q)
      ),
    };
  };

  const searchResults = getSearchResults(globalSearchQuery);
  const totalSearchResults = searchResults.contacts.length + searchResults.deals.length + searchResults.tasks.length + searchResults.activities.length;

  // Goal calculations
  const getClosedDealsValue = (quarter) => {
    const now = new Date();
    const year = now.getFullYear();
    const quarterRanges = {
      q1: { start: new Date(year, 0, 1), end: new Date(year, 2, 31) },
      q2: { start: new Date(year, 3, 1), end: new Date(year, 5, 30) },
      q3: { start: new Date(year, 6, 1), end: new Date(year, 8, 30) },
      q4: { start: new Date(year, 9, 1), end: new Date(year, 11, 31) },
      annual: { start: new Date(year, 0, 1), end: new Date(year, 11, 31) },
    };
    // For now, use closed deals commission as income
    const closedCommissions = deals.filter(d => d.stage === 'Closed').reduce((sum, d) => sum + (d.commission || d.fees || 0), 0);
    return closedCommissions;
  };
  
  const getCurrentQuarter = () => {
    const month = new Date().getMonth();
    if (month < 3) return 'q1';
    if (month < 6) return 'q2';
    if (month < 9) return 'q3';
    return 'q4';
  };

  const projectedIncome = deals.filter(d => d.stage !== 'Closed').reduce((sum, d) => sum + (d.commission || d.fees || 0), 0);
  const closedIncome = deals.filter(d => d.stage === 'Closed').reduce((sum, d) => sum + (d.commission || d.fees || 0), 0);
  const totalProjectedIncome = closedIncome + projectedIncome;

  // Copy to clipboard helper
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  // Calendar helpers
  const getWeekDays = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay()); // Start from Sunday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const days = [];
    
    // Previous month padding
    for (let i = startPadding - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, isCurrentMonth: false });
    }
    
    // Current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    // Next month padding
    const remaining = 42 - days.length; // 6 rows of 7
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
  };

  const getItemsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayTasks = tasks.filter(t => t.dueDate === dateStr);
    const dayActivities = activities.filter(a => a.date === dateStr);
    return { tasks: dayTasks, activities: dayActivities };
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateCalendar = (direction) => {
    const newDate = new Date(calendarDate);
    if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    setCalendarDate(newDate);
  };

  // KPI calculations based on actual activity data (this week)
  const getThisWeekActivities = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    return activities.filter(a => new Date(a.date) >= startOfWeek);
  };
  
  const thisWeekActivities = getThisWeekActivities();
  const kpiData = {
    outreach: {
      actual: thisWeekActivities.filter(a => ['Call', 'Email'].includes(a.type)).length,
      target: 100,
      label: 'Outreach'
    },
    conversations: {
      actual: thisWeekActivities.filter(a => a.outcome === 'Positive' || a.type === 'Meeting').length,
      target: 10,
      label: 'Conversations'
    },
    meetings: {
      actual: thisWeekActivities.filter(a => ['Meeting', 'Showing'].includes(a.type)).length,
      target: 5,
      label: 'Meetings'
    },
    opportunities: {
      actual: deals.filter(d => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        return d.stage === 'Lead'; // Count leads as new opportunities
      }).length,
      target: 2,
      label: 'New Opps'
    }
  };

  // Theme colors
  const theme = {
    // Backgrounds
    bg: darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-cyan-50/30',
    bgCard: darkMode ? 'bg-slate-800' : 'bg-white',
    bgCardHover: darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50',
    bgInput: darkMode ? 'bg-slate-700' : 'bg-white',
    bgHeader: darkMode ? 'bg-slate-800/90' : 'bg-white/90',
    bgMuted: darkMode ? 'bg-slate-700/50' : 'bg-slate-50',
    bgKanban: darkMode ? 'bg-slate-800/50' : 'bg-slate-50',
    
    // Borders
    border: darkMode ? 'border-slate-700' : 'border-slate-200',
    borderLight: darkMode ? 'border-slate-600' : 'border-slate-100',
    
    // Text
    text: darkMode ? 'text-slate-100' : 'text-slate-800',
    textMuted: darkMode ? 'text-slate-400' : 'text-slate-500',
    textFaint: darkMode ? 'text-slate-500' : 'text-slate-400',
    
    // Focus
    focusRing: darkMode ? 'focus:ring-cyan-500/50' : 'focus:ring-cyan-100',
    focusBorder: 'focus:border-cyan-400',
  };

  // Calculations
  const totalPipeline = deals.reduce((sum, d) => sum + d.value, 0);
  const totalCommissions = deals.reduce((sum, d) => sum + (d.commission || d.fees || 0), 0);
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;

  // Helper functions
  const getContactName = (id) => contacts.find(c => c.id === id)?.name || '';
  const getContactsForDeal = (deal) => contacts.filter(c => deal.contactIds?.includes(c.id));
  const getDealsForContact = (contactId) => deals.filter(d => d.contactIds?.includes(contactId));
  
  // Contact filtering
  const contactTypes = ['All', 'Client', 'Buyer', 'Seller', 'Developer', 'Investor', 'Referral'];
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
                          contact.company.toLowerCase().includes(contactSearch.toLowerCase()) ||
                          contact.email.toLowerCase().includes(contactSearch.toLowerCase());
    const matchesFilter = contactFilter === 'All' || contact.type === contactFilter;
    return matchesSearch && matchesFilter;
  });

  // Get activities and tasks for a deal (via linked contacts)
  const getActivitiesForDeal = (deal) => {
    const contactIds = deal.contactIds || [];
    return activities.filter(a => contactIds.includes(a.contactId));
  };
  
  const getTasksForDeal = (deal) => {
    const contactIds = deal.contactIds || [];
    return tasks.filter(t => contactIds.includes(t.contactId));
  };

  // Update deal stage
  const updateDealStage = async (dealId, newStage) => {
    await dbUpdate('deals', dealId, { stage: newStage });
    setDeals(deals.map(d => d.id === dealId ? {...d, stage: newStage} : d));
    if (selectedDeal?.id === dealId) {
      setSelectedDeal({...selectedDeal, stage: newStage});
    }
  };

  // Delete handlers
  const deleteContact = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const addNoteToContact = (contactId, noteText) => {
    if (!noteText.trim()) return;
    const note = {
      id: Date.now(),
      text: noteText,
      date: new Date().toISOString(),
    };
    setContacts(contacts.map(c => 
      c.id === contactId 
        ? { ...c, notes: [...(c.notes || []), note] }
        : c
    ));
    setNewNote('');
  };

  const addNoteToDeal = (dealId, noteText) => {
    if (!noteText.trim()) return;
    const note = {
      id: Date.now(),
      text: noteText,
      date: new Date().toISOString(),
    };
    setDeals(deals.map(d => 
      d.id === dealId 
        ? { ...d, notes: [...(d.notes || []), note] }
        : d
    ));
    setNewNote('');
  };

  const deleteNoteFromContact = (contactId, noteId) => {
    setContacts(contacts.map(c => 
      c.id === contactId 
        ? { ...c, notes: (c.notes || []).filter(n => n.id !== noteId) }
        : c
    ));
  };

  const deleteNoteFromDeal = (dealId, noteId) => {
    setDeals(deals.map(d => 
      d.id === dealId 
        ? { ...d, notes: (d.notes || []).filter(n => n.id !== noteId) }
        : d
    ));
  };

  // Export/Import functions
  const exportData = () => {
    const data = {
      contacts,
      deals,
      tasks,
      activities,
      properties,
      quizScores,
      completedDailyHabits,
      completedWeeklyTasks,
      masteredProperties,
      totalPoints,
      currentStreak,
      goals,
      templates,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `re-group-hub-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportContactsCSV = () => {
    const headers = ['Name', 'Company', 'Type', 'Email', 'Phone', 'Status', 'Last Contact', 'Neighborhood'];
    const rows = contacts.map(c => [
      c.name, c.company, c.type, c.email, c.phone, c.status, c.lastContact, c.neighborhood || ''
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell || ''}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.contacts) setContacts(data.contacts);
        if (data.deals) setDeals(data.deals);
        if (data.tasks) setTasks(data.tasks);
        if (data.activities) setActivities(data.activities);
        if (data.properties) setProperties(data.properties);
        if (data.quizScores) setQuizScores(data.quizScores);
        if (data.completedDailyHabits) setCompletedDailyHabits(data.completedDailyHabits);
        if (data.completedWeeklyTasks) setCompletedWeeklyTasks(data.completedWeeklyTasks);
        if (data.masteredProperties) setMasteredProperties(data.masteredProperties);
        if (data.totalPoints) setTotalPoints(data.totalPoints);
        if (data.currentStreak) setCurrentStreak(data.currentStreak);
        if (data.goals) setGoals(data.goals);
        if (data.templates) setTemplates(data.templates);
        alert('Data imported successfully!');
      } catch (err) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };
  
  const deleteDeal = (id) => {
    setDeals(deals.filter(d => d.id !== id));
    setSelectedDeal(null);
  };

  // Drag & Drop handlers for pipeline
  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = 'move';
    // Add a slight delay to allow the drag image to be set
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedDeal(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e, stage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  };

  const handleDragLeave = (e) => {
    // Only clear if we're leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverStage(null);
    }
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    if (draggedDeal && draggedDeal.stage !== newStage) {
      await dbUpdate('deals', draggedDeal.id, { stage: newStage });
      setDeals(deals.map(d => 
        d.id === draggedDeal.id 
          ? { ...d, stage: newStage }
          : d
      ));
      showToast(`Deal moved to ${newStage}`);
    }
    setDraggedDeal(null);
    setDragOverStage(null);
  };

  // Confirmation dialog helpers
  const confirmDelete = (type, item, itemName) => {
    setConfirmDialog({
      type,
      item,
      title: `Delete ${type}?`,
      message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      onConfirm: async () => {
        if (type === 'contact') {
          await dbDelete('contacts', item.id);
          setContacts(contacts.filter(c => c.id !== item.id));
          setSelectedContact(null);
          showToast('Contact deleted');
        } else if (type === 'deal') {
          await dbDelete('deals', item.id);
          setDeals(deals.filter(d => d.id !== item.id));
          setSelectedDeal(null);
          showToast('Deal deleted');
        } else if (type === 'task') {
          await dbDelete('tasks', item.id);
          setTasks(tasks.filter(t => t.id !== item.id));
          showToast('Task deleted');
        } else if (type === 'activity') {
          await dbDelete('activities', item.id);
          setActivities(activities.filter(a => a.id !== item.id));
          showToast('Activity deleted');
        } else if (type === 'property') {
          await dbDelete('properties', item.id);
          setProperties(properties.filter(p => p.id !== item.id));
          setSelectedProperty(null);
          showToast('Property deleted');
        } else if (type === 'template') {
          await dbDelete('templates', item.id);
          setTemplates(templates.filter(t => t.id !== item.id));
          setSelectedTemplate(null);
          showToast('Template deleted');
        }
        setConfirmDialog(null);
      }
    });
  };

  // AI Assistant
  const sendToAssistant = async (directMessage = null) => {
    const userMessage = directMessage || assistantInput.trim();
    if (!userMessage || assistantLoading) return;
    
    setAssistantInput('');
    setAssistantMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setAssistantLoading(true);
    
    // Build context about current state
    const context = {
      today: todayStr,
      greeting: greeting,
      summary: {
        totalContacts: contacts.length,
        activeContacts: contacts.filter(c => c.status === 'Active').length,
        totalDeals: deals.length,
        dealsByStage: {
          Lead: deals.filter(d => d.stage === 'Lead').length,
          Qualify: deals.filter(d => d.stage === 'Qualify').length,
          Present: deals.filter(d => d.stage === 'Present').length,
          Negotiate: deals.filter(d => d.stage === 'Negotiate').length,
          Contract: deals.filter(d => d.stage === 'Contract').length,
          Closed: deals.filter(d => d.stage === 'Closed').length,
        },
        totalPipelineValue: deals.filter(d => d.stage !== 'Closed').reduce((sum, d) => sum + d.value, 0),
        totalClosedValue: deals.filter(d => d.stage === 'Closed').reduce((sum, d) => sum + (d.commission || d.fees || 0), 0),
        pendingTasks: tasks.filter(t => t.status === 'Pending').length,
        overdueTasks: tasks.filter(t => t.status === 'Pending' && t.dueDate < todayStr).length,
        todayTasks: tasks.filter(t => t.status === 'Pending' && t.dueDate === todayStr).length,
        thisWeekActivities: activities.filter(a => {
          const actDate = new Date(a.date);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return actDate >= weekAgo;
        }).length,
        goals: goals,
      },
      contacts: contacts.map(c => ({
        name: c.name,
        company: c.company,
        type: c.type,
        status: c.status,
        lastContact: c.lastContact,
        dealCount: deals.filter(d => d.contactIds?.includes(c.id)).length,
      })),
      deals: deals.map(d => ({
        property: d.property,
        neighborhood: d.neighborhood,
        stage: d.stage,
        value: d.value,
        commission: d.commission || d.fees || 0,
        type: d.type,
        nextStep: d.nextStep,
        contacts: d.contactIds?.map(id => contacts.find(c => c.id === id)?.name).filter(Boolean),
      })),
      recentTasks: tasks.filter(t => t.status === 'Pending').slice(0, 10).map(t => ({
        title: t.title,
        dueDate: t.dueDate,
        priority: t.priority,
        contact: contacts.find(c => c.id === t.contactId)?.name,
      })),
      templates: templates.map(t => ({ name: t.name, category: t.category })),
    };
    
    const systemPrompt = `You are an AI assistant for Roxanna Urban, a luxury real estate agent in Miami specializing in ultra-high-end waterfront properties in Gables Estates, Cocoplum, Old Cutler Bay, and Coral Gables.

Your role is to help Roxanna:
1. Move deals forward with strategic coaching
2. Suggest follow-ups based on contact history
3. Draft professional emails and messages
4. Analyze her pipeline and provide insights
5. Help prioritize her day

Current context:
${JSON.stringify(context, null, 2)}

Guidelines:
- Be concise but warm and professional
- Reference specific deals, contacts, and data when relevant
- Provide actionable advice
- When drafting emails, use a luxury real estate tone
- For follow-up suggestions, consider days since last contact
- Keep responses focused and practical
- Use markdown formatting for readability
- If asked to draft an email, provide it in a clean format ready to copy`;

    try {
      const messagesPayload = assistantMessages.slice(1).map(m => ({
        role: m.role,
        content: String(m.content || '')
      }));
      messagesPayload.push({ role: 'user', content: String(userMessage) });
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system: systemPrompt,
          messages: messagesPayload
        })
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          setAssistantMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "🔧 AI Assistant API route not found. Please make sure the app/api/chat/route.js file is deployed correctly."
          }]);
          setAssistantLoading(false);
          return;
        }
      }
      
      const data = await response.json();
      
      if (data.error) {
        setAssistantMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.error.includes('not configured') 
            ? "🔧 AI Assistant is not configured yet. Please add your Anthropic API key to the environment variables (ANTHROPIC_API_KEY) to enable this feature."
            : `I encountered an error: ${data.error}. Please try again.`
        }]);
      } else {
        const assistantResponse = data.content?.[0]?.text || "I'm sorry, I couldn't process that request. Please try again.";
        setAssistantMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
      }
    } catch (error) {
      console.error('Assistant error:', error);
      setAssistantMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please try again in a moment." 
      }]);
    }
    
    setAssistantLoading(false);
  };

  // Mastery functions
  const toggleDailyHabit = (habitId, neighborhood) => {
    const key = `${neighborhood}-${habitId}-${new Date().toDateString()}`;
    const habit = dailyHabits.find(h => h.id === habitId);
    setCompletedDailyHabits(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      if (!prev[key] && habit) {
        setTotalPoints(p => p + habit.points);
      } else if (prev[key] && habit) {
        setTotalPoints(p => p - habit.points);
      }
      return newState;
    });
  };

  const toggleWeeklyTask = (taskId, neighborhood) => {
    const key = `${neighborhood}-${taskId}-${getWeekNumber()}`;
    const task = weeklyTasks.find(t => t.id === taskId);
    setCompletedWeeklyTasks(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      if (!prev[key] && task) {
        setTotalPoints(p => p + task.points);
      } else if (prev[key] && task) {
        setTotalPoints(p => p - task.points);
      }
      return newState;
    });
  };

  const getWeekNumber = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    const oneWeek = 604800000;
    return Math.floor(diff / oneWeek);
  };

  const isDailyHabitComplete = (habitId, neighborhood) => {
    const key = `${neighborhood}-${habitId}-${new Date().toDateString()}`;
    return completedDailyHabits[key] || false;
  };

  const isWeeklyTaskComplete = (taskId, neighborhood) => {
    const key = `${neighborhood}-${taskId}-${getWeekNumber()}`;
    return completedWeeklyTasks[key] || false;
  };

  const getDailyProgress = (neighborhood) => {
    const completed = dailyHabits.filter(h => isDailyHabitComplete(h.id, neighborhood)).length;
    return Math.round((completed / dailyHabits.length) * 100);
  };

  const getWeeklyProgress = (neighborhood) => {
    const completed = weeklyTasks.filter(t => isWeeklyTaskComplete(t.id, neighborhood)).length;
    return Math.round((completed / weeklyTasks.length) * 100);
  };

  const startQuiz = (neighborhood) => {
    setSelectedNeighborhood(neighborhood);
    setQuizState({ active: true, currentQuestion: 0, answers: [], showResults: false });
    setMasteryView('quiz');
  };

  const answerQuestion = (answerIndex) => {
    const newAnswers = [...quizState.answers, answerIndex];
    if (quizState.currentQuestion < quizQuestions[selectedNeighborhood].length - 1) {
      setQuizState({ ...quizState, currentQuestion: quizState.currentQuestion + 1, answers: newAnswers });
    } else {
      // Quiz complete
      const score = newAnswers.reduce((acc, answer, idx) => {
        return acc + (answer === quizQuestions[selectedNeighborhood][idx].correct ? 1 : 0);
      }, 0);
      const percentage = Math.round((score / quizQuestions[selectedNeighborhood].length) * 100);
      setQuizScores(prev => ({
        ...prev,
        [selectedNeighborhood]: [...(prev[selectedNeighborhood] || []), { score: percentage, date: new Date().toISOString() }]
      }));
      setTotalPoints(p => p + score * 5);
      setQuizState({ ...quizState, answers: newAnswers, showResults: true });
    }
  };

  const getQuizAverage = (neighborhood) => {
    const scores = quizScores[neighborhood] || [];
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length);
  };

  const getOverallMasteryProgress = (neighborhood) => {
    const quizAvg = getQuizAverage(neighborhood);
    const dailyProg = getDailyProgress(neighborhood);
    const weeklyProg = getWeeklyProgress(neighborhood);
    const propertyProg = Math.round(((masteredProperties[neighborhood] || 0) / 50) * 100);
    return Math.round((quizAvg + dailyProg + weeklyProg + propertyProg) / 4);
  };
  
  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    await dbUpdate('tasks', id, { status: newStatus });
    setTasks(tasks.map(t => t.id === id ? {...t, status: newStatus} : t));
  };

  const stageColors = {
    'Lead': { bg: '#f1f5f9', text: '#64748b' },
    'Qualify': { bg: '#dbeafe', text: '#2563eb' },
    'Present': { bg: '#f3e8ff', text: '#9333ea' },
    'Negotiate': { bg: '#fef3c7', text: '#d97706' },
    'Contract': { bg: '#d1fae5', text: '#059669' },
    'Closed': { bg: '#dcfce7', text: '#16a34a' },
  };

  const typeColors = {
    'Client': { bg: '#ecfeff', text: '#0891b2' },
    'Buyer': { bg: '#ecfdf5', text: '#059669' },
    'Seller': { bg: '#fef3c7', text: '#d97706' },
    'Developer': { bg: '#f3e8ff', text: '#9333ea' },
    'Investor': { bg: '#fff1f2', text: '#e11d48' },
    'Referral': { bg: '#dbeafe', text: '#2563eb' },
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Icons.Activity },
    { id: 'calendar', label: 'Calendar', icon: Icons.Calendar },
    { id: 'tasks', label: 'Tasks', icon: Icons.Target, badge: overdueTasks > 0 ? overdueTasks : (todayTasks > 0 ? todayTasks : 0), badgeType: overdueTasks > 0 ? 'danger' : 'warning' },
    { id: 'activities', label: 'Activity', icon: Icons.TrendingUp },
    { id: 'pipeline', label: 'Deals', icon: Icons.Briefcase, badge: deals.filter(d => d.stage === 'Negotiate' || d.stage === 'Contract').length, badgeType: 'info' },
    { id: 'contacts', label: 'Contacts', icon: Icons.Users },
    { id: 'properties', label: 'Properties', icon: Icons.MapPin },
    { id: 'analytics', label: 'Analytics', icon: Icons.BarChart },
    { id: 'mastery', label: 'Mastery', icon: Icons.Award },
    { id: 'settings', label: 'Settings', icon: Icons.Settings },
  ];

  // Loading screen
  if (isLoading) {
    return (
      <div className={`min-h-screen ${theme.bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 mx-auto mb-4 animate-pulse">
            <Icons.Home />
          </div>
          <h1 className={`text-xl font-semibold ${theme.text} mb-2`}>RE | Group Hub</h1>
          <p className={theme.textMuted}>Loading your data...</p>
          <div className="mt-4 flex justify-center gap-1">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300`}>
      {/* Database Status Banner */}
      {dbError && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center">
          <p className="text-amber-600 text-sm">
            ⚠️ Using offline mode. Data saved locally. ({dbError})
          </p>
        </div>
      )}
      
      {/* Header */}
      <header className={`${theme.bgHeader} backdrop-blur border-b ${theme.border} sticky top-0 z-50 transition-colors duration-300`}>
        <div className="h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-rose-500" />
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
              <Icons.Home />
            </div>
            <div>
              <h1 className={`text-lg font-semibold ${theme.text}`}>{greeting}, {userName}!</h1>
              <p className={theme.textMuted}>RE | Group Intelligence Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className={`${theme.textMuted} text-sm hidden sm:block`}>{formattedDate}</p>
            {/* Export/Import Menu */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className={`p-2 rounded-lg ${theme.bgMuted} ${theme.text} hover:bg-cyan-500/20 transition-all`}
                title="Export/Import Data"
              >
                <Icons.Download />
              </button>
              {showExportMenu && (
                <div className={`absolute right-0 mt-2 w-48 ${theme.bgCard} rounded-lg shadow-xl border ${theme.border} py-1 z-50`}>
                  <button
                    onClick={() => { exportData(); setShowExportMenu(false); }}
                    className={`w-full px-4 py-2 text-left text-sm ${theme.text} hover:bg-cyan-500/10 flex items-center gap-2`}
                  >
                    <Icons.Download /> Export All (JSON)
                  </button>
                  <button
                    onClick={() => { exportContactsCSV(); setShowExportMenu(false); }}
                    className={`w-full px-4 py-2 text-left text-sm ${theme.text} hover:bg-cyan-500/10 flex items-center gap-2`}
                  >
                    <Icons.Download /> Export Contacts (CSV)
                  </button>
                  <label className={`w-full px-4 py-2 text-left text-sm ${theme.text} hover:bg-cyan-500/10 flex items-center gap-2 cursor-pointer`}>
                    <Icons.Upload /> Import Data
                    <input type="file" accept=".json" onChange={importData} className="hidden" />
                  </label>
                </div>
              )}
            </div>
            {/* Global Search Button */}
            <button
              onClick={() => setShowGlobalSearch(true)}
              className={`p-2 rounded-lg ${theme.bgMuted} ${theme.text} hover:bg-cyan-500/20 transition-all`}
              title="Search (Ctrl+K)"
            >
              <Icons.Search />
            </button>
            {/* Help Button */}
            <button
              onClick={() => setShowHelp(true)}
              className={`p-2 rounded-lg ${theme.bgMuted} ${theme.text} hover:bg-cyan-500/20 transition-all`}
              title="Help & Documentation"
            >
              <Icons.HelpCircle />
            </button>
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${theme.bgMuted} ${theme.text} hover:bg-cyan-500/20 transition-all`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
            {/* Logout Button */}
            {user && (
              <button
                onClick={async () => {
                  if (isSupabaseConfigured()) {
                    await supabase.auth.signOut();
                  }
                }}
                className={`px-3 py-2 rounded-lg ${theme.bgMuted} ${theme.text} hover:bg-rose-500/20 hover:text-rose-400 transition-all text-sm`}
                title="Sign Out"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
        
        {/* Tabs */}
        <div className="px-6 flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-xl whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? `${theme.bgCard} text-cyan-500 border-t-2 border-cyan-500 shadow-sm` 
                  : `${theme.textMuted} hover:${theme.text} hover:bg-slate-500/10`
              }`}
            >
              <tab.icon />
              {tab.label}
              {tab.badge > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 text-xs font-semibold rounded-full text-white ${
                  tab.badgeType === 'danger' ? 'bg-rose-500' : 
                  tab.badgeType === 'warning' ? 'bg-amber-500' : 
                  tab.badgeType === 'info' ? 'bg-cyan-500' : 'bg-rose-500'
                }`}>{tab.badge}</span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Goal Tracker + Quick Actions Row */}
            <div className="grid lg:grid-cols-3 gap-4">
              {/* Annual Goal Thermometer */}
              <div className={`${theme.bgCard} rounded-xl p-5 border ${theme.border} shadow-sm transition-colors duration-300 lg:col-span-2`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-semibold ${theme.text} flex items-center gap-2`}>
                    <span className="text-cyan-500">🎯</span>
                    {goals.annual.label}
                  </h3>
                  <button 
                    onClick={() => setShowGoalsModal(true)}
                    className={`text-xs px-2 py-1 rounded ${theme.bgMuted} ${theme.textMuted} hover:text-cyan-400`}
                  >
                    Edit Goals
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  {/* Thermometer */}
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className={theme.textMuted}>Progress</span>
                      <span className={theme.text}>${(closedIncome/1000).toFixed(0)}k / ${(goals.annual.target/1000).toFixed(0)}k</span>
                    </div>
                    <div className={`h-6 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} rounded-full overflow-hidden relative`}>
                      {/* Closed (solid) */}
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full absolute left-0 top-0 transition-all duration-500"
                        style={{ width: `${Math.min((closedIncome / goals.annual.target) * 100, 100)}%` }}
                      />
                      {/* Projected (striped) */}
                      <div 
                        className="h-full absolute top-0 transition-all duration-500 rounded-r-full opacity-50"
                        style={{ 
                          left: `${Math.min((closedIncome / goals.annual.target) * 100, 100)}%`,
                          width: `${Math.min((projectedIncome / goals.annual.target) * 100, 100 - (closedIncome / goals.annual.target) * 100)}%`,
                          background: 'repeating-linear-gradient(45deg, #10b981, #10b981 10px, #34d399 10px, #34d399 20px)'
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-emerald-400">Closed: ${(closedIncome/1000).toFixed(0)}k</span>
                      <span className={theme.textMuted}>Pipeline: ${(projectedIncome/1000).toFixed(0)}k</span>
                      <span className={`${totalProjectedIncome >= goals.annual.target ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {((totalProjectedIncome / goals.annual.target) * 100).toFixed(0)}% of goal
                      </span>
                    </div>
                  </div>
                  {/* Percentage Circle */}
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="35" fill="none" stroke={darkMode ? '#334155' : '#e2e8f0'} strokeWidth="6" />
                      <circle 
                        cx="40" cy="40" r="35" 
                        fill="none" 
                        stroke={closedIncome >= goals.annual.target ? colors.success : colors.primary}
                        strokeWidth="6" 
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 35}
                        strokeDashoffset={2 * Math.PI * 35 * (1 - Math.min(closedIncome / goals.annual.target, 1))}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className={`text-lg font-bold ${closedIncome >= goals.annual.target ? 'text-emerald-400' : theme.text}`}>
                        {((closedIncome / goals.annual.target) * 100).toFixed(0)}%
                      </span>
                      <span className={`text-xs ${theme.textMuted}`}>closed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`${theme.bgCard} rounded-xl p-5 border ${theme.border} shadow-sm transition-colors duration-300`}>
                <h3 className={`font-semibold ${theme.text} mb-3 flex items-center gap-2`}>
                  <span className="text-cyan-500">⚡</span>
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setShowTemplatesModal(true)}
                    className={`w-full p-3 ${theme.bgMuted} rounded-lg text-left hover:bg-cyan-500/10 transition-all flex items-center gap-3`}
                  >
                    <span className="text-xl">📧</span>
                    <div>
                      <p className={`font-medium ${theme.text}`}>Templates</p>
                      <p className={`text-xs ${theme.textMuted}`}>Email & SMS templates</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => { setFormData({ type: 'Call', contactId: '', description: '', date: todayStr, outcome: 'Positive' }); setShowModal('activity'); }}
                    className={`w-full p-3 ${theme.bgMuted} rounded-lg text-left hover:bg-cyan-500/10 transition-all flex items-center gap-3`}
                  >
                    <span className="text-xl">📞</span>
                    <div>
                      <p className={`font-medium ${theme.text}`}>Log Activity</p>
                      <p className={`text-xs ${theme.textMuted}`}>Record a call or meeting</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Pipeline Value', value: `$${(totalPipeline/1e6).toFixed(1)}M`, color: colors.primary, icon: '💰', trend: '+12%' },
                { label: 'Projected Commissions', value: `$${(totalCommissions/1e6).toFixed(2)}M`, color: colors.success, icon: '📈', trend: '+8%' },
                { label: 'Pending Tasks', value: pendingTasks, color: colors.violet, icon: '✓', trend: null },
                { label: 'Active Deals', value: deals.length, color: colors.warning, icon: '🏠', trend: '+2' },
              ].map((m, i) => (
                <div key={i} className={`${theme.bgCard} rounded-xl p-5 border ${theme.border} shadow-sm transition-colors duration-300 relative overflow-hidden`}>
                  <div className="absolute top-3 right-3 text-2xl opacity-20">{m.icon}</div>
                  <p className={theme.textMuted}>{m.label}</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: m.color }}>{m.value}</p>
                  {m.trend && (
                    <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 7l-8.5 8.5-5-5L2 17"/></svg>
                      {m.trend} this month
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Row 2: Pipeline Funnel + Commission Breakdown */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Pipeline Funnel */}
              <div className={`${theme.bgCard} rounded-xl border ${theme.border} shadow-sm p-5 transition-colors duration-300`}>
                <h3 className={`font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
                  <span className="text-cyan-500"><Icons.TrendingUp /></span>
                  Pipeline Funnel
                </h3>
                <div className="space-y-3">
                  {['Lead', 'Qualify', 'Present', 'Negotiate', 'Contract', 'Closed'].map((stage, i) => {
                    const stageDeals = deals.filter(d => d.stage === stage);
                    const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
                    const maxValue = Math.max(...['Lead', 'Qualify', 'Present', 'Negotiate', 'Contract', 'Closed'].map(s => 
                      deals.filter(d => d.stage === s).reduce((sum, d) => sum + d.value, 0)
                    ));
                    const percentage = maxValue > 0 ? (stageValue / maxValue) * 100 : 0;
                    const stageColor = stageColors[stage];
                    return (
                      <div key={stage} className="flex items-center gap-3">
                        <span className={`text-xs font-medium w-20 ${theme.textMuted}`}>{stage}</span>
                        <div className={`flex-1 h-8 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'} rounded-lg overflow-hidden relative`}>
                          <div 
                            className="h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-2"
                            style={{ 
                              width: `${Math.max(percentage, 5)}%`, 
                              backgroundColor: stageColor?.text,
                              opacity: 0.8
                            }}
                          >
                            {stageValue > 0 && (
                              <span className="text-white text-xs font-medium">${(stageValue/1e6).toFixed(1)}M</span>
                            )}
                          </div>
                        </div>
                        <span className={`text-xs font-semibold w-8 text-right ${theme.text}`}>{stageDeals.length}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Commission Breakdown Donut */}
              <div className={`${theme.bgCard} rounded-xl border ${theme.border} shadow-sm p-5 transition-colors duration-300`}>
                <h3 className={`font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
                  <span className="text-cyan-500"><Icons.BarChart /></span>
                  Commission Breakdown by Type
                </h3>
                <div className="flex items-center gap-6">
                  {/* Donut Chart */}
                  <div className="relative w-36 h-36">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      {(() => {
                        const typeData = ['Buyer', 'Seller', 'Developer', 'Investor'].map(type => ({
                          type,
                          commission: deals.filter(d => d.type === type).reduce((sum, d) => sum + (d.commission || d.fees || 0), 0)
                        })).filter(t => t.commission > 0);
                        const total = typeData.reduce((sum, t) => sum + t.commission, 0);
                        const typeColorMap = { Buyer: colors.primary, Seller: colors.warning, Developer: colors.violet, Investor: colors.rose };
                        let cumulative = 0;
                        return typeData.map((t, i) => {
                          const percentage = (t.commission / total) * 100;
                          const strokeDasharray = `${percentage} ${100 - percentage}`;
                          const strokeDashoffset = -cumulative;
                          cumulative += percentage;
                          return (
                            <circle
                              key={t.type}
                              cx="18" cy="18" r="15.915"
                              fill="none"
                              stroke={typeColorMap[t.type]}
                              strokeWidth="3.5"
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                              className="transition-all duration-500"
                            />
                          );
                        });
                      })()}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className={`text-lg font-bold ${theme.text}`}>${(totalCommissions/1e6).toFixed(1)}M</span>
                      <span className={`text-xs ${theme.textMuted}`}>Total</span>
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="flex-1 space-y-2">
                    {['Buyer', 'Seller', 'Developer', 'Investor'].map(type => {
                      const typeCommissions = deals.filter(d => d.type === type).reduce((sum, d) => sum + (d.commission || d.fees || 0), 0);
                      const typeColorMap = { Buyer: colors.primary, Seller: colors.warning, Developer: colors.violet, Investor: colors.rose };
                      if (typeCommissions === 0) return null;
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: typeColorMap[type] }} />
                            <span className={`text-sm ${theme.text}`}>{type}</span>
                          </div>
                          <span className={`text-sm font-semibold ${theme.text}`}>${(typeCommissions/1e3).toFixed(0)}K</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Weekly KPIs + Neighborhood Distribution */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Weekly KPI Gauges */}
              <div className={`${theme.bgCard} rounded-xl border ${theme.border} shadow-sm p-5 transition-colors duration-300`}>
                <h3 className={`font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
                  <span className="text-cyan-500"><Icons.Target /></span>
                  Weekly KPIs
                  <span className={`text-xs ${theme.textMuted} font-normal ml-auto`}>This week</span>
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { ...kpiData.outreach, color: colors.primary },
                    { ...kpiData.conversations, color: colors.success },
                    { ...kpiData.meetings, color: colors.violet },
                    { ...kpiData.opportunities, color: colors.warning },
                  ].map((kpi, i) => {
                    const percentage = Math.min((kpi.actual / kpi.target) * 100, 100);
                    const circumference = 2 * Math.PI * 28;
                    const strokeDashoffset = circumference - (percentage / 100) * circumference;
                    const isComplete = kpi.actual >= kpi.target;
                    return (
                      <div key={i} className="flex flex-col items-center">
                        <div className="relative w-16 h-16">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r="28" fill="none" stroke={darkMode ? '#334155' : '#e2e8f0'} strokeWidth="4" className="w-16 h-16" />
                            <circle 
                              cx="32" cy="32" r="28" 
                              fill="none" 
                              stroke={isComplete ? colors.success : kpi.color} 
                              strokeWidth="4" 
                              strokeLinecap="round"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                              className="transition-all duration-500"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-sm font-bold ${isComplete ? 'text-emerald-400' : theme.text}`}>{kpi.actual}</span>
                          </div>
                        </div>
                        <span className={`text-xs ${theme.textMuted} mt-1 text-center`}>{kpi.label}</span>
                        <span className={`text-xs ${isComplete ? 'text-emerald-400' : theme.textFaint}`}>/{kpi.target}</span>
                      </div>
                    );
                  })}
                </div>
                <p className={`text-xs ${theme.textMuted} mt-4 text-center`}>
                  Log more activities to hit your weekly targets!
                </p>
              </div>

              {/* Neighborhood Distribution */}
              <div className={`${theme.bgCard} rounded-xl border ${theme.border} shadow-sm p-5 transition-colors duration-300`}>
                <h3 className={`font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
                  <span className="text-cyan-500"><Icons.MapPin /></span>
                  Deals by Neighborhood
                </h3>
                <div className="space-y-3">
                  {(() => {
                    const neighborhoods = [...new Set(deals.map(d => d.neighborhood))];
                    const maxDeals = Math.max(...neighborhoods.map(n => deals.filter(d => d.neighborhood === n).length));
                    const neighborhoodColors = { 
                      'Gables Estates': colors.primary, 
                      'Cocoplum': colors.violet, 
                      'Old Cutler Bay': colors.rose,
                      'Coral Gables': colors.success,
                      'TBD': colors.warning,
                      'Various': '#64748b'
                    };
                    return neighborhoods.slice(0, 5).map((neighborhood, i) => {
                      const count = deals.filter(d => d.neighborhood === neighborhood).length;
                      const value = deals.filter(d => d.neighborhood === neighborhood).reduce((sum, d) => sum + d.value, 0);
                      const percentage = (count / maxDeals) * 100;
                      return (
                        <div key={neighborhood} className="flex items-center gap-3">
                          <span className={`text-xs w-24 truncate ${theme.textMuted}`}>{neighborhood}</span>
                          <div className={`flex-1 h-6 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'} rounded-full overflow-hidden`}>
                            <div 
                              className="h-full rounded-full transition-all duration-500 flex items-center px-2"
                              style={{ width: `${Math.max(percentage, 15)}%`, backgroundColor: neighborhoodColors[neighborhood] || colors.primary }}
                            >
                              <span className="text-white text-xs font-medium">{count}</span>
                            </div>
                          </div>
                          <span className={`text-xs font-semibold w-16 text-right ${theme.text}`}>${(value/1e6).toFixed(1)}M</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>

            {/* Row 4: Activity Chart + Top Deals */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Activity Trend Chart */}
              <div className={`${theme.bgCard} rounded-xl border ${theme.border} shadow-sm p-5 transition-colors duration-300`}>
                <h3 className={`font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
                  <span className="text-cyan-500"><Icons.Activity /></span>
                  Activity Trend
                </h3>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={(() => {
                    // Generate last 5 weeks of activity data
                    const weeks = [];
                    for (let i = 4; i >= 0; i--) {
                      const weekStart = new Date();
                      weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay());
                      const weekEnd = new Date(weekStart);
                      weekEnd.setDate(weekEnd.getDate() + 6);
                      
                      const weekActivities = activities.filter(a => {
                        const actDate = new Date(a.date);
                        return actDate >= weekStart && actDate <= weekEnd;
                      });
                      
                      weeks.push({
                        week: `W${5-i}`,
                        outreach: weekActivities.length,
                        conversations: weekActivities.filter(a => a.outcome === 'Positive').length
                      });
                    }
                    return weeks;
                  })()}>
                    <defs>
                      <linearGradient id="colorOutreach" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorConvos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.violet} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={colors.violet} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                    <XAxis dataKey="week" stroke={darkMode ? '#64748b' : '#94a3b8'} fontSize={12} />
                    <YAxis stroke={darkMode ? '#64748b' : '#94a3b8'} fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1e293b' : '#fff', 
                        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, 
                        borderRadius: '8px',
                        color: darkMode ? '#f1f5f9' : '#1e293b'
                      }} 
                    />
                    <Area type="monotone" dataKey="outreach" stroke={colors.primary} fill="url(#colorOutreach)" strokeWidth={2} name="Outreach" />
                    <Area type="monotone" dataKey="conversations" stroke={colors.violet} fill="url(#colorConvos)" strokeWidth={2} name="Conversations" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Top Deals Leaderboard */}
              <div className={`${theme.bgCard} rounded-xl border ${theme.border} shadow-sm p-5 transition-colors duration-300`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${theme.text} flex items-center gap-2`}>
                    <span className="text-cyan-500"><Icons.Award /></span>
                    Top Deals
                  </h3>
                  <button onClick={() => setActiveTab('pipeline')} className="text-cyan-500 text-sm hover:text-cyan-400">View All</button>
                </div>
                <div className="space-y-3">
                  {deals.sort((a, b) => b.value - a.value).slice(0, 4).map((deal, i) => {
                    const maxValue = Math.max(...deals.map(d => d.value));
                    const percentage = (deal.value / maxValue) * 100;
                    return (
                      <div key={deal.id} className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          i === 0 ? 'bg-amber-500 text-white' : 
                          i === 1 ? 'bg-slate-400 text-white' : 
                          i === 2 ? 'bg-amber-700 text-white' : 
                          `${theme.bgMuted} ${theme.textMuted}`
                        }`}>
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${theme.text} truncate`}>{deal.property}</p>
                          <div className={`h-1.5 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'} rounded-full mt-1 overflow-hidden`}>
                            <div 
                              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${theme.text}`}>${(deal.value/1e6).toFixed(1)}M</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Row 5: Tasks + Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Upcoming Tasks */}
              <div className={`${theme.bgCard} rounded-xl border ${theme.border} shadow-sm transition-colors duration-300`}>
                <div className={`p-4 border-b ${theme.borderLight} flex justify-between items-center`}>
                  <h3 className={`font-semibold ${theme.text} flex items-center gap-2`}>
                    <span className="text-cyan-500"><Icons.Target /></span>
                    Today's Tasks
                  </h3>
                  <button onClick={() => setActiveTab('tasks')} className="text-cyan-500 text-sm flex items-center hover:text-cyan-400">
                    View All <Icons.ChevronRight />
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  {tasks.filter(t => t.status === 'Pending').slice(0, 4).map(task => (
                    <div key={task.id} className={`flex items-center gap-3 p-3 ${theme.bgMuted} rounded-lg transition-colors duration-300`}>
                      <button onClick={() => toggleTask(task.id)} className={`w-5 h-5 rounded-full border-2 ${darkMode ? 'border-slate-500 hover:border-cyan-400' : 'border-slate-300 hover:border-cyan-400'} transition-colors`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${theme.text} truncate`}>{task.title}</p>
                        <p className={`text-xs ${theme.textMuted}`}>{task.dueDate}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${task.priority === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className={`${theme.bgCard} rounded-xl border ${theme.border} shadow-sm transition-colors duration-300`}>
                <div className={`p-4 border-b ${theme.borderLight} flex justify-between items-center`}>
                  <h3 className={`font-semibold ${theme.text} flex items-center gap-2`}>
                    <span className="text-cyan-500"><Icons.Calendar /></span>
                    Recent Activity
                  </h3>
                  <button onClick={() => setActiveTab('activities')} className="text-cyan-500 text-sm flex items-center hover:text-cyan-400">
                    View All <Icons.ChevronRight />
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  {activities.slice(0, 4).map(act => (
                    <div key={act.id} className={`flex items-center gap-3 p-3 ${theme.bgMuted} rounded-lg transition-colors duration-300`}>
                      <span className="text-lg">{act.type === 'Call' ? '📞' : act.type === 'Email' ? '📧' : act.type === 'Meeting' ? '🤝' : '🏠'}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${theme.text} truncate`}>{act.description}</p>
                        <p className={`text-xs ${theme.textMuted}`}>{act.contactName} • {act.date}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${act.outcome === 'Positive' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                        {act.outcome}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CALENDAR */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            {/* Calendar Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className={`text-xl font-semibold ${theme.text}`}>Calendar</h2>
                <p className={theme.textMuted}>View tasks and activities by date</p>
              </div>
              <div className="flex items-center gap-2">
                {/* View Toggle */}
                <div className={`flex ${theme.bgMuted} rounded-lg p-1`}>
                  <button
                    onClick={() => setCalendarView('week')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      calendarView === 'week' ? 'bg-cyan-500 text-white' : `${theme.textMuted}`
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setCalendarView('month')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      calendarView === 'month' ? 'bg-cyan-500 text-white' : `${theme.textMuted}`
                    }`}
                  >
                    Month
                  </button>
                </div>
                {/* Navigation */}
                <button
                  onClick={() => navigateCalendar(-1)}
                  className={`p-2 ${theme.bgMuted} rounded-lg ${theme.textMuted} hover:text-cyan-400`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button
                  onClick={() => setCalendarDate(new Date())}
                  className={`px-3 py-2 ${theme.bgMuted} rounded-lg ${theme.text} text-sm font-medium hover:bg-cyan-500/20`}
                >
                  Today
                </button>
                <button
                  onClick={() => navigateCalendar(1)}
                  className={`p-2 ${theme.bgMuted} rounded-lg ${theme.textMuted} hover:text-cyan-400`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
            </div>

            {/* Month/Year Display */}
            <div className={`text-center ${theme.text} text-lg font-semibold`}>
              {formatMonthYear(calendarDate)}
            </div>

            {/* Week View */}
            {calendarView === 'week' && (
              <div className={`${theme.bgCard} rounded-xl border ${theme.border} overflow-hidden`}>
                {/* Day Headers */}
                <div className="grid grid-cols-7 border-b ${theme.border}">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                    <div key={day} className={`p-3 text-center text-sm font-medium ${theme.textMuted} ${i > 0 ? `border-l ${theme.border}` : ''}`}>
                      {day}
                    </div>
                  ))}
                </div>
                {/* Week Days */}
                <div className="grid grid-cols-7 min-h-96">
                  {getWeekDays(calendarDate).map((date, i) => {
                    const items = getItemsForDate(date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const dateNum = date.getDate();
                    return (
                      <div 
                        key={i} 
                        className={`p-2 ${i > 0 ? `border-l ${theme.border}` : ''} ${theme.bgCard} min-h-48`}
                      >
                        <div className={`text-center mb-2`}>
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                            isToday ? 'bg-cyan-500 text-white' : theme.text
                          }`}>
                            {dateNum}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {items.tasks.slice(0, 3).map(task => (
                            <div 
                              key={task.id}
                              className={`text-xs p-1.5 rounded ${
                                task.status === 'Completed' 
                                  ? `${darkMode ? 'bg-slate-700' : 'bg-slate-100'} line-through ${theme.textMuted}` 
                                  : task.priority === 'High' 
                                    ? 'bg-rose-500/20 text-rose-400'
                                    : 'bg-cyan-500/20 text-cyan-400'
                              } truncate cursor-pointer`}
                              title={task.title}
                              onClick={() => setActiveTab('tasks')}
                            >
                              ✓ {task.title}
                            </div>
                          ))}
                          {items.activities.slice(0, 3).map(act => (
                            <div 
                              key={act.id}
                              className={`text-xs p-1.5 rounded bg-violet-500/20 text-violet-400 truncate cursor-pointer`}
                              title={act.description}
                              onClick={() => setActiveTab('activities')}
                            >
                              {act.type === 'Call' ? '📞' : act.type === 'Email' ? '📧' : act.type === 'Meeting' ? '🤝' : '🏠'} {act.description}
                            </div>
                          ))}
                          {(items.tasks.length + items.activities.length) > 6 && (
                            <div className={`text-xs ${theme.textMuted} text-center`}>
                              +{items.tasks.length + items.activities.length - 6} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Month View */}
            {calendarView === 'month' && (
              <div className={`${theme.bgCard} rounded-xl border ${theme.border} overflow-hidden`}>
                {/* Day Headers */}
                <div className={`grid grid-cols-7 border-b ${theme.border}`}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                    <div key={day} className={`p-2 text-center text-sm font-medium ${theme.textMuted} ${i > 0 ? `border-l ${theme.border}` : ''}`}>
                      {day}
                    </div>
                  ))}
                </div>
                {/* Month Days */}
                <div className="grid grid-cols-7">
                  {getMonthDays(calendarDate).map((dayObj, i) => {
                    const items = getItemsForDate(dayObj.date);
                    const isToday = dayObj.date.toDateString() === new Date().toDateString();
                    const totalItems = items.tasks.length + items.activities.length;
                    return (
                      <div 
                        key={i} 
                        className={`p-2 min-h-24 ${i % 7 !== 0 ? `border-l ${theme.border}` : ''} ${i >= 7 ? `border-t ${theme.border}` : ''} ${
                          dayObj.isCurrentMonth ? theme.bgCard : theme.bgMuted
                        }`}
                      >
                        <div className={`text-right mb-1`}>
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                            isToday ? 'bg-cyan-500 text-white' : dayObj.isCurrentMonth ? theme.text : theme.textFaint
                          }`}>
                            {dayObj.date.getDate()}
                          </span>
                        </div>
                        {totalItems > 0 && (
                          <div className="space-y-0.5">
                            {items.tasks.slice(0, 2).map(task => (
                              <div 
                                key={task.id}
                                className={`text-xs px-1 py-0.5 rounded truncate ${
                                  task.status === 'Completed' 
                                    ? `${theme.textMuted} line-through` 
                                    : task.priority === 'High'
                                      ? 'bg-rose-500/20 text-rose-400'
                                      : 'bg-cyan-500/20 text-cyan-400'
                                }`}
                              >
                                {task.title}
                              </div>
                            ))}
                            {items.activities.length > 0 && items.tasks.length < 2 && (
                              <div className="text-xs px-1 py-0.5 rounded bg-violet-500/20 text-violet-400 truncate">
                                {items.activities[0].type}
                              </div>
                            )}
                            {totalItems > 2 && (
                              <div className={`text-xs ${theme.textMuted}`}>+{totalItems - 2}</div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Legend */}
            <div className={`flex flex-wrap gap-4 justify-center ${theme.textMuted} text-sm`}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-cyan-500/40"></div>
                <span>Tasks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-rose-500/40"></div>
                <span>High Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-violet-500/40"></div>
                <span>Activities</span>
              </div>
            </div>
          </div>
        )}

        {/* TASKS */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className={`text-xl font-semibold ${theme.text}`}>Tasks & Reminders</h2>
                <div className="flex gap-3 mt-1">
                  {overdueTasks > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400">
                      {overdueTasks} overdue
                    </span>
                  )}
                  {todayTasks > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                      {todayTasks} due today
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => { setFormData({ title: '', dueDate: todayStr, priority: 'Medium', contactId: '' }); setShowModal('task'); }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25"
              >
                <Icons.Plus /> Add Task
              </button>
            </div>

            <div className={`${theme.bgCard} rounded-xl border ${theme.border} shadow-sm divide-y ${theme.borderLight} transition-colors duration-300`}>
              {tasks
                .sort((a, b) => {
                  // Sort: Pending first, then by due date
                  if (a.status !== b.status) return a.status === 'Pending' ? -1 : 1;
                  return new Date(a.dueDate) - new Date(b.dueDate);
                })
                .map(task => {
                const dueStatus = getTaskDueStatus(task.dueDate);
                return (
                  <div key={task.id} className={`p-4 flex items-center gap-4 ${task.status === 'Completed' ? 'opacity-50' : ''}`}>
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        task.status === 'Completed' ? 'bg-emerald-500 border-emerald-500 text-white' : `${darkMode ? 'border-slate-500 hover:border-cyan-400' : 'border-slate-300 hover:border-cyan-400'}`
                      }`}
                    >
                      {task.status === 'Completed' && <Icons.Check />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${task.status === 'Completed' ? `line-through ${theme.textMuted}` : theme.text}`}>{task.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-sm ${theme.textMuted}`}>{task.contactId ? getContactName(task.contactId) : 'No contact'}</span>
                        <span className={theme.textFaint}>•</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${task.status === 'Completed' ? `${theme.bgMuted} ${theme.textMuted}` : `${dueStatus.bg} ${dueStatus.color}`}`}>
                          {task.status === 'Completed' ? 'Completed' : dueStatus.label}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      task.priority === 'High' ? 'bg-rose-500/20 text-rose-400' : task.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ACTIVITIES */}
        {activeTab === 'activities' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className={`text-xl font-semibold ${theme.text}`}>Activity Log</h2>
              <button 
                onClick={() => { setFormData({ type: 'Call', contactId: '', description: '', date: todayStr, outcome: 'Positive' }); setShowModal('activity'); }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25"
              >
                <Icons.Plus /> Log Activity
              </button>
            </div>

            <div className={`${theme.bgCard} rounded-xl border ${theme.border} shadow-sm divide-y ${theme.borderLight} transition-colors duration-300`}>
              {activities.map(act => (
                <div key={act.id} className="p-4 flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg ${darkMode ? 'bg-cyan-500/20' : 'bg-cyan-50'} flex items-center justify-center text-lg`}>
                    {act.type === 'Call' ? '📞' : act.type === 'Email' ? '📧' : act.type === 'Meeting' ? '🤝' : act.type === 'Showing' ? '🏠' : '📝'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${darkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'} font-medium`}>{act.type}</span>
                      <span className={`font-medium ${theme.text}`}>{act.contactName}</span>
                    </div>
                    <p className={`${theme.textMuted} text-sm mt-1`}>{act.description}</p>
                    <p className={`${theme.textFaint} text-xs mt-1`}>{act.date} • {act.outcome}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className={`text-xl font-semibold ${theme.text}`}>Deal Pipeline</h2>
                <p className={theme.textMuted}>Total: ${(totalPipeline/1e6).toFixed(1)}M • Commissions: ${(totalCommissions/1e6).toFixed(2)}M</p>
              </div>
              <button 
                onClick={() => { setFormData({ property: '', neighborhood: '', stage: 'Lead', value: '', commissionPercent: 2.5, commission: '', type: 'Buyer', nextStep: '', contactIds: [] }); setShowModal('deal'); }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25"
              >
                <Icons.Plus /> Add Deal
              </button>
            </div>

            {/* Kanban */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {['Lead', 'Qualify', 'Present', 'Negotiate', 'Contract', 'Closed'].map(stage => (
                <div 
                  key={stage} 
                  className={`${theme.bgKanban} rounded-xl border-2 transition-all duration-200 ${
                    dragOverStage === stage 
                      ? 'border-cyan-400 bg-cyan-500/10' 
                      : theme.border
                  }`}
                  onDragOver={(e) => handleDragOver(e, stage)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, stage)}
                >
                  <div className={`p-3 border-b ${theme.border} ${theme.bgCard} rounded-t-xl`}>
                    <h4 className="font-medium text-sm" style={{ color: stageColors[stage]?.text }}>{stage}</h4>
                    <p className={`text-xs ${theme.textMuted}`}>{deals.filter(d => d.stage === stage).length} deals</p>
                  </div>
                  <div className={`p-2 space-y-2 min-h-32 transition-all ${dragOverStage === stage ? 'bg-cyan-500/5' : ''}`}>
                    {deals.filter(d => d.stage === stage).map(deal => (
                      <div 
                        key={deal.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal)}
                        onDragEnd={handleDragEnd}
                        onClick={() => setSelectedDeal(deal)}
                        className={`${theme.bgCard} p-3 rounded-lg border ${theme.border} hover:border-cyan-400 cursor-grab active:cursor-grabbing transition-all ${
                          draggedDeal?.id === deal.id ? 'opacity-50 scale-95' : ''
                        }`}
                      >
                        <p className={`font-medium ${theme.text} text-sm truncate`}>{deal.property}</p>
                        <p className={`text-xs ${theme.textMuted}`}>{deal.neighborhood}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className={`font-semibold ${theme.text} text-sm`}>${(deal.value/1e6).toFixed(1)}M</span>
                          {getContactsForDeal(deal).length > 0 && (
                            <div className="flex -space-x-1">
                              {getContactsForDeal(deal).slice(0,2).map(c => (
                                <div key={c.id} className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 text-white text-xs flex items-center justify-center border-2 border-slate-800">
                                  {c.name.charAt(0)}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {/* Drop zone indicator when empty */}
                    {deals.filter(d => d.stage === stage).length === 0 && draggedDeal && (
                      <div className={`h-20 border-2 border-dashed rounded-lg flex items-center justify-center ${
                        dragOverStage === stage 
                          ? 'border-cyan-400 bg-cyan-500/10' 
                          : `${theme.border} ${theme.textMuted}`
                      }`}>
                        <span className="text-xs">Drop here</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Drag & Drop hint */}
            <p className={`text-center text-xs ${theme.textMuted}`}>
              💡 Drag and drop deal cards between columns to change their stage
            </p>
          </div>
        )}

        {/* CONTACTS */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            {/* Header with search and filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <svg className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textMuted}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  <input 
                    type="text" 
                    placeholder="Search contacts..." 
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 ${theme.bgInput} border ${theme.border} rounded-lg ${theme.text} placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors duration-300`}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {contactTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setContactFilter(type)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        contactFilter === type 
                          ? 'bg-cyan-500 text-white' 
                          : `${theme.bgCard} border ${theme.border} ${theme.textMuted} hover:border-cyan-400`
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => { setFormData({ name: '', company: '', type: 'Client', email: '', phone: '', status: 'Active', neighborhood: '' }); setShowModal('contact'); }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25 whitespace-nowrap"
              >
                <Icons.Plus /> Add Contact
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Contacts', value: contacts.length, color: colors.primary },
                { label: 'Active', value: contacts.filter(c => c.status === 'Active').length, color: colors.success },
                { label: 'Developers', value: contacts.filter(c => c.type === 'Developer').length, color: colors.violet },
                { label: 'With Deals', value: contacts.filter(c => getDealsForContact(c.id).length > 0).length, color: colors.warning },
              ].map((stat, i) => (
                <div key={i} className={`${theme.bgCard} rounded-xl p-4 border ${theme.border} transition-colors duration-300`}>
                  <p className={theme.textMuted}>{stat.label}</p>
                  <p className="text-2xl font-semibold mt-1" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Contacts Table */}
            <div className={`${theme.bgCard} rounded-xl border ${theme.border} shadow-sm overflow-hidden transition-colors duration-300`}>
              <table className="w-full">
                <thead className={`${theme.bgMuted} border-b ${theme.border}`}>
                  <tr>
                    <th className={`text-left px-4 py-3 text-sm font-semibold ${theme.textMuted}`}>Contact</th>
                    <th className={`text-left px-4 py-3 text-sm font-semibold ${theme.textMuted}`}>Type</th>
                    <th className={`text-left px-4 py-3 text-sm font-semibold ${theme.textMuted} hidden md:table-cell`}>Deals</th>
                    <th className={`text-left px-4 py-3 text-sm font-semibold ${theme.textMuted} hidden lg:table-cell`}>Last Contact</th>
                    <th className={`text-left px-4 py-3 text-sm font-semibold ${theme.textMuted}`}>Status</th>
                    <th className={`text-right px-4 py-3 text-sm font-semibold ${theme.textMuted}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${theme.borderLight}`}>
                  {filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/20 mb-4">
                          <Icons.Users />
                        </div>
                        <p className={`font-medium ${theme.text}`}>No contacts found</p>
                        <p className={`${theme.textMuted} text-sm mt-1`}>
                          {contactSearch || contactFilter !== 'All' 
                            ? 'Try adjusting your search or filters' 
                            : 'Add your first contact to get started'}
                        </p>
                        {(contactSearch || contactFilter !== 'All') ? (
                          <button onClick={() => { setContactSearch(''); setContactFilter('All'); }} className="text-cyan-500 text-sm mt-3 hover:underline">Clear filters</button>
                        ) : (
                          <button onClick={() => { setFormData({ name: '', company: '', type: 'Buyer', email: '', phone: '', status: 'Active', neighborhood: '' }); setShowModal('contact'); }} className="mt-3 px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm font-medium hover:bg-cyan-600">+ Add Contact</button>
                        )}
                      </td>
                    </tr>
                  ) : filteredContacts.map(contact => {
                    const contactDeals = getDealsForContact(contact.id);
                    const totalDealValue = contactDeals.reduce((sum, d) => sum + d.value, 0);
                    return (
                      <tr key={contact.id} className={`${theme.bgCardHover} cursor-pointer`} onClick={() => setSelectedContact(contact)}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 text-white flex items-center justify-center font-medium text-sm">
                              {contact.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                            </div>
                            <div>
                              <p className={`font-medium ${theme.text}`}>{contact.name}</p>
                              <p className={`text-sm ${theme.textMuted}`}>{contact.company}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: typeColors[contact.type]?.bg, color: typeColors[contact.type]?.text }}>
                            {contact.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {contactDeals.length > 0 ? (
                            <div>
                              <span className={`font-medium ${theme.text}`}>{contactDeals.length} deal{contactDeals.length > 1 ? 's' : ''}</span>
                              <span className={`${theme.textMuted} text-sm ml-1`}>(${(totalDealValue/1e6).toFixed(1)}M)</span>
                            </div>
                          ) : <span className={theme.textMuted}>—</span>}
                        </td>
                        <td className={`px-4 py-3 ${theme.textMuted} text-sm hidden lg:table-cell`}>{contact.lastContact}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${contact.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : contact.status === 'Warm' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'}`}>
                            {contact.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setEditingContact(contact); setFormData(contact); setShowModal('contact'); }}
                              className={`p-2 rounded-lg hover:bg-cyan-500/20 ${theme.textMuted} hover:text-cyan-400 transition-colors`}
                            >
                              <Icons.Edit />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); confirmDelete('contact', contact, contact.name); }}
                              className={`p-2 rounded-lg hover:bg-rose-500/20 ${theme.textMuted} hover:text-rose-400 transition-colors`}
                            >
                              <Icons.Trash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROPERTIES */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <svg className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textMuted}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  <input 
                    type="text" 
                    placeholder="Search properties..." 
                    value={propertySearch}
                    onChange={(e) => setPropertySearch(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 ${theme.bgInput} border ${theme.border} rounded-lg ${theme.text} placeholder-slate-400 focus:outline-none focus:border-cyan-400`}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['All', 'Active', 'Coming Soon', 'Research', 'Sold'].map(filter => (
                    <button 
                      key={filter}
                      onClick={() => setPropertyFilter(filter)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        propertyFilter === filter 
                          ? 'bg-cyan-500 text-white' 
                          : `${theme.bgMuted} ${theme.textMuted} hover:${theme.text}`
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => { 
                  setFormData({ address: '', neighborhood: '', type: 'Single Family', status: 'Research', price: '', sqft: '', beds: '', baths: '', yearBuilt: '', lotSize: '', waterfront: false, pool: false, features: '', notes: '', dealId: null }); 
                  setShowModal('property'); 
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25"
              >
                <Icons.Plus /> Add Property
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Properties', value: properties.length, color: colors.primary, icon: '🏠' },
                { label: 'Total Value', value: `$${(properties.reduce((sum, p) => sum + (p.price || 0), 0) / 1e6).toFixed(1)}M`, color: colors.success, icon: '💰' },
                { label: 'Active Listings', value: properties.filter(p => p.status === 'Active').length, color: colors.violet, icon: '📋' },
                { label: 'Waterfront', value: properties.filter(p => p.waterfront).length, color: colors.warning, icon: '🌊' },
              ].map((stat, i) => (
                <div key={i} className={`${theme.bgCard} rounded-xl p-4 border ${theme.border}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{stat.icon}</span>
                    <span className={`text-2xl font-bold`} style={{ color: stat.color }}>{stat.value}</span>
                  </div>
                  <p className={`${theme.textMuted} text-sm mt-1`}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Properties Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties
                .filter(p => {
                  const matchesSearch = p.address.toLowerCase().includes(propertySearch.toLowerCase()) ||
                    p.neighborhood.toLowerCase().includes(propertySearch.toLowerCase());
                  const matchesFilter = propertyFilter === 'All' || p.status === propertyFilter;
                  return matchesSearch && matchesFilter;
                })
                .map(property => {
                  const linkedDeal = deals.find(d => d.id === property.dealId);
                  const statusColors = {
                    'Active': 'bg-emerald-500/20 text-emerald-400',
                    'Coming Soon': 'bg-amber-500/20 text-amber-400',
                    'Research': 'bg-cyan-500/20 text-cyan-400',
                    'Sold': 'bg-slate-500/20 text-slate-400',
                    'Off Market': 'bg-rose-500/20 text-rose-400',
                  };
                  return (
                    <div 
                      key={property.id}
                      onClick={() => setSelectedProperty(property)}
                      className={`${theme.bgCard} rounded-xl border ${theme.border} overflow-hidden hover:border-cyan-400 cursor-pointer transition-all group`}
                    >
                      {/* Property Image Placeholder */}
                      <div className={`h-32 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} relative overflow-hidden`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl opacity-30">🏡</span>
                        </div>
                        <div className="absolute top-2 left-2 flex gap-1">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[property.status] || statusColors['Research']}`}>
                            {property.status}
                          </span>
                          {property.waterfront && (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 font-medium">🌊 Waterfront</span>
                          )}
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <span className={`text-lg font-bold ${theme.text} bg-black/50 px-2 py-1 rounded`}>
                            ${(property.price / 1e6).toFixed(1)}M
                          </span>
                        </div>
                      </div>
                      
                      {/* Property Info */}
                      <div className="p-4">
                        <h3 className={`font-semibold ${theme.text} truncate`}>{property.address}</h3>
                        <p className={`text-sm ${theme.textMuted} flex items-center gap-1`}>
                          <Icons.MapPin /> {property.neighborhood}
                        </p>
                        
                        {/* Property Details */}
                        <div className={`flex gap-4 mt-3 text-sm ${theme.textMuted}`}>
                          {property.beds > 0 && (
                            <span className="flex items-center gap-1">
                              <span>🛏️</span> {property.beds}
                            </span>
                          )}
                          {property.baths > 0 && (
                            <span className="flex items-center gap-1">
                              <span>🚿</span> {property.baths}
                            </span>
                          )}
                          {property.sqft > 0 && (
                            <span className="flex items-center gap-1">
                              <span>📐</span> {property.sqft.toLocaleString()} sqft
                            </span>
                          )}
                        </div>

                        {/* Linked Deal */}
                        {linkedDeal && (
                          <div className={`mt-3 pt-3 border-t ${theme.border}`}>
                            <div className="flex items-center justify-between">
                              <span className={`text-xs ${theme.textMuted}`}>Linked Deal</span>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: stageColors[linkedDeal.stage]?.bg, color: stageColors[linkedDeal.stage]?.text }}>
                                {linkedDeal.stage}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Empty State */}
            {properties.filter(p => {
              const matchesSearch = p.address.toLowerCase().includes(propertySearch.toLowerCase()) ||
                p.neighborhood.toLowerCase().includes(propertySearch.toLowerCase());
              const matchesFilter = propertyFilter === 'All' || p.status === propertyFilter;
              return matchesSearch && matchesFilter;
            }).length === 0 && (
              <div className={`text-center py-12 ${theme.bgCard} rounded-xl border ${theme.border}`}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/20 mb-4">
                  <span className="text-3xl">🏠</span>
                </div>
                <p className={`font-medium ${theme.text}`}>No properties found</p>
                <p className={`${theme.textMuted} text-sm mt-1`}>
                  {propertySearch || propertyFilter !== 'All' 
                    ? 'Try adjusting your search or filters' 
                    : 'Add your first property to build your database'}
                </p>
                {(propertySearch || propertyFilter !== 'All') ? (
                  <button onClick={() => { setPropertySearch(''); setPropertyFilter('All'); }} className="text-cyan-500 text-sm mt-3 hover:underline">Clear filters</button>
                ) : (
                  <button onClick={() => { setFormData({ address: '', neighborhood: '', type: 'Single Family', status: 'Research', price: '', sqft: '', beds: '', baths: '', yearBuilt: '', lotSize: '', waterfront: false, pool: false, features: '', notes: '', dealId: null }); setShowModal('property'); }} className="mt-3 px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm font-medium hover:bg-cyan-600">+ Add Property</button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-xl font-semibold ${theme.text}`}>Analytics Dashboard</h2>
              <p className={theme.textMuted}>Performance insights and pipeline analytics</p>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {(() => {
                const closedDeals = deals.filter(d => d.stage === 'Closed');
                const totalDealsEver = deals.length;
                const conversionRate = totalDealsEver > 0 ? ((closedDeals.length / totalDealsEver) * 100).toFixed(1) : 0;
                const avgDealSize = closedDeals.length > 0 ? closedDeals.reduce((sum, d) => sum + d.value, 0) / closedDeals.length : 0;
                const avgCommissionRate = closedDeals.length > 0 ? (closedDeals.reduce((sum, d) => sum + ((d.commission || d.fees || 0) / d.value), 0) / closedDeals.length * 100).toFixed(2) : 0;
                const activitiesThisMonth = activities.filter(a => {
                  const actDate = new Date(a.date);
                  const now = new Date();
                  return actDate.getMonth() === now.getMonth() && actDate.getFullYear() === now.getFullYear();
                }).length;

                return [
                  { label: 'Conversion Rate', value: `${conversionRate}%`, color: colors.success, icon: '📈', desc: 'Leads to Closed' },
                  { label: 'Avg Deal Size', value: `$${(avgDealSize/1e6).toFixed(1)}M`, color: colors.primary, icon: '💰', desc: 'Closed deals' },
                  { label: 'Avg Commission Rate', value: `${avgCommissionRate}%`, color: colors.violet, icon: '💵', desc: 'Commission rate' },
                  { label: 'Monthly Activities', value: activitiesThisMonth, color: colors.warning, icon: '📊', desc: 'This month' },
                ].map((m, i) => (
                  <div key={i} className={`${theme.bgCard} rounded-xl p-5 border ${theme.border} shadow-sm`}>
                    <div className="flex items-start justify-between">
                      <span className="text-2xl">{m.icon}</span>
                    </div>
                    <p className={`text-2xl font-bold mt-2`} style={{ color: m.color }}>{m.value}</p>
                    <p className={`${theme.text} text-sm font-medium`}>{m.label}</p>
                    <p className={`${theme.textMuted} text-xs`}>{m.desc}</p>
                  </div>
                ));
              })()}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Pipeline by Stage */}
              <div className={`${theme.bgCard} rounded-xl p-5 border ${theme.border}`}>
                <h3 className={`font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
                  <span className="text-cyan-500"><Icons.BarChart /></span>
                  Pipeline by Stage
                </h3>
                <div className="space-y-3">
                  {['Lead', 'Qualify', 'Present', 'Negotiate', 'Contract', 'Closed'].map(stage => {
                    const stageDeals = deals.filter(d => d.stage === stage);
                    const count = stageDeals.length;
                    const value = stageDeals.reduce((sum, d) => sum + d.value, 0);
                    const maxCount = Math.max(...['Lead', 'Qualify', 'Present', 'Negotiate', 'Contract', 'Closed'].map(s => deals.filter(d => d.stage === s).length), 1);
                    const percentage = (count / maxCount) * 100;
                    return (
                      <div key={stage} className="flex items-center gap-3">
                        <span className={`text-xs w-20 ${theme.textMuted}`}>{stage}</span>
                        <div className={`flex-1 h-6 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'} rounded overflow-hidden`}>
                          <div 
                            className="h-full rounded transition-all flex items-center justify-end pr-2"
                            style={{ width: `${Math.max(percentage, 5)}%`, backgroundColor: stageColors[stage]?.text }}
                          >
                            {count > 0 && <span className="text-white text-xs font-medium">{count}</span>}
                          </div>
                        </div>
                        <span className={`text-xs w-16 text-right ${theme.text}`}>${(value/1e6).toFixed(1)}M</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Activity Breakdown */}
              <div className={`${theme.bgCard} rounded-xl p-5 border ${theme.border}`}>
                <h3 className={`font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
                  <span className="text-cyan-500"><Icons.Activity /></span>
                  Activity Breakdown (This Month)
                </h3>
                <div className="space-y-3">
                  {(() => {
                    const thisMonthActivities = activities.filter(a => {
                      const actDate = new Date(a.date);
                      const now = new Date();
                      return actDate.getMonth() === now.getMonth() && actDate.getFullYear() === now.getFullYear();
                    });
                    const activityTypes = ['Call', 'Email', 'Meeting', 'Showing'];
                    const maxCount = Math.max(...activityTypes.map(t => thisMonthActivities.filter(a => a.type === t).length), 1);
                    const typeColors = { Call: colors.primary, Email: colors.success, Meeting: colors.violet, Showing: colors.warning };
                    const typeIcons = { Call: '📞', Email: '📧', Meeting: '🤝', Showing: '🏠' };
                    
                    return activityTypes.map(type => {
                      const count = thisMonthActivities.filter(a => a.type === type).length;
                      const percentage = (count / maxCount) * 100;
                      return (
                        <div key={type} className="flex items-center gap-3">
                          <span className="text-lg">{typeIcons[type]}</span>
                          <span className={`text-sm w-16 ${theme.text}`}>{type}</span>
                          <div className={`flex-1 h-6 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'} rounded overflow-hidden`}>
                            <div 
                              className="h-full rounded transition-all flex items-center justify-end pr-2"
                              style={{ width: `${Math.max(percentage, 5)}%`, backgroundColor: typeColors[type] }}
                            >
                              {count > 0 && <span className="text-white text-xs font-medium">{count}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>

            {/* Deal Type & Contact Type Analysis */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Deals by Type */}
              <div className={`${theme.bgCard} rounded-xl p-5 border ${theme.border}`}>
                <h3 className={`font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
                  <span className="text-cyan-500">💼</span>
                  Pipeline by Deal Type
                </h3>
                <div className="space-y-3">
                  {['Buyer', 'Seller', 'Developer', 'Investor'].map(type => {
                    const typeDeals = deals.filter(d => d.type === type);
                    const value = typeDeals.reduce((sum, d) => sum + d.value, 0);
                    const fees = typeDeals.reduce((sum, d) => sum + (d.commission || d.fees || 0), 0);
                    const maxValue = Math.max(...['Buyer', 'Seller', 'Developer', 'Investor'].map(t => 
                      deals.filter(d => d.type === t).reduce((sum, d) => sum + d.value, 0)
                    ), 1);
                    const percentage = (value / maxValue) * 100;
                    const typeColorMap = { Buyer: colors.primary, Seller: colors.warning, Developer: colors.violet, Investor: colors.rose };
                    
                    return (
                      <div key={type}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={theme.text}>{type}</span>
                          <span className={theme.textMuted}>{typeDeals.length} deals • ${(fees/1000).toFixed(0)}k commission</span>
                        </div>
                        <div className={`h-4 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'} rounded overflow-hidden`}>
                          <div 
                            className="h-full rounded transition-all"
                            style={{ width: `${Math.max(percentage, 3)}%`, backgroundColor: typeColorMap[type] }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contact Activity Ranking */}
              <div className={`${theme.bgCard} rounded-xl p-5 border ${theme.border}`}>
                <h3 className={`font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
                  <span className="text-cyan-500">👥</span>
                  Most Active Contacts
                </h3>
                <div className="space-y-2">
                  {(() => {
                    const contactActivity = contacts.map(c => ({
                      ...c,
                      activityCount: activities.filter(a => a.contactId === c.id).length,
                      dealCount: deals.filter(d => d.contactIds?.includes(c.id)).length,
                    }))
                    .sort((a, b) => b.activityCount - a.activityCount)
                    .slice(0, 5);

                    return contactActivity.map((c, i) => (
                      <div key={c.id} className={`flex items-center gap-3 p-2 ${theme.bgMuted} rounded-lg`}>
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          i === 0 ? 'bg-amber-500 text-white' : i === 1 ? 'bg-slate-400 text-white' : i === 2 ? 'bg-amber-700 text-white' : `${theme.bgCard} ${theme.text}`
                        }`}>
                          {i + 1}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 text-white flex items-center justify-center text-xs font-medium">
                          {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium ${theme.text} text-sm truncate`}>{c.name}</p>
                          <p className={`text-xs ${theme.textMuted}`}>{c.company}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${theme.text}`}>{c.activityCount} activities</p>
                          <p className={`text-xs ${theme.textMuted}`}>{c.dealCount} deals</p>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>

            {/* Weekly Activity Trend (simplified) */}
            <div className={`${theme.bgCard} rounded-xl p-5 border ${theme.border}`}>
              <h3 className={`font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
                <span className="text-cyan-500"><Icons.TrendingUp /></span>
                Weekly Activity Trend
              </h3>
              <div className="flex items-end gap-2 h-32">
                {(() => {
                  const weeks = [];
                  for (let i = 7; i >= 0; i--) {
                    const weekStart = new Date();
                    weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay());
                    weekStart.setHours(0, 0, 0, 0);
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekEnd.getDate() + 7);
                    
                    const weekActivities = activities.filter(a => {
                      const actDate = new Date(a.date);
                      return actDate >= weekStart && actDate < weekEnd;
                    }).length;
                    
                    weeks.push({
                      label: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                      count: weekActivities,
                    });
                  }
                  const maxCount = Math.max(...weeks.map(w => w.count), 1);
                  
                  return weeks.map((week, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className={`w-full rounded-t transition-all ${i === weeks.length - 1 ? 'bg-cyan-500' : darkMode ? 'bg-slate-600' : 'bg-slate-300'}`}
                        style={{ height: `${Math.max((week.count / maxCount) * 100, 5)}%` }}
                      />
                      <span className={`text-xs ${theme.textMuted} truncate w-full text-center`}>{week.label}</span>
                      <span className={`text-xs font-medium ${theme.text}`}>{week.count}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        )}

        {/* MASTERY */}
        {activeTab === 'mastery' && (
          <div className="space-y-6">
            {/* Header with Stats */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className={`text-xl font-semibold ${theme.text}`}>Neighborhood Mastery</h2>
                <p className={theme.textMuted}>30-Day Sprint Program</p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`${theme.bgCard} rounded-xl px-4 py-2 border ${theme.border} flex items-center gap-2`}>
                  <span className="text-2xl">🔥</span>
                  <div>
                    <p className={`text-lg font-bold ${theme.text}`}>{currentStreak} days</p>
                    <p className={`text-xs ${theme.textMuted}`}>Current Streak</p>
                  </div>
                </div>
                <div className={`${theme.bgCard} rounded-xl px-4 py-2 border ${theme.border} flex items-center gap-2`}>
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className={`text-lg font-bold ${theme.text}`}>{totalPoints}</p>
                    <p className={`text-xs ${theme.textMuted}`}>Total Points</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Neighborhood Selector */}
            <div className="flex gap-2 flex-wrap">
              {['Gables Estates', 'Cocoplum', 'Old Cutler Bay'].map((neighborhood) => {
                const details = neighborhoodDetails[neighborhood];
                const progress = getOverallMasteryProgress(neighborhood);
                return (
                  <button
                    key={neighborhood}
                    onClick={() => { setSelectedNeighborhood(neighborhood); setMasteryView('overview'); }}
                    className={`flex-1 min-w-48 p-4 rounded-xl border transition-all ${
                      selectedNeighborhood === neighborhood 
                        ? `border-2 shadow-lg` 
                        : `${theme.border} ${theme.bgCard}`
                    }`}
                    style={{ 
                      borderColor: selectedNeighborhood === neighborhood ? details.color : undefined,
                      backgroundColor: selectedNeighborhood === neighborhood ? (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)') : undefined
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold ${theme.text}`}>{neighborhood}</span>
                      <span className="text-lg font-bold" style={{ color: details.color }}>{progress}%</span>
                    </div>
                    <div className={`h-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} rounded-full overflow-hidden`}>
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: details.color }} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sub-navigation */}
            <div className={`${theme.bgCard} rounded-xl border ${theme.border} p-1 flex gap-1 flex-wrap`}>
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'daily', label: 'Daily Habits', icon: '☀️' },
                { id: 'weekly', label: 'Weekly Tasks', icon: '📅' },
                { id: 'quiz', label: 'Quiz', icon: '❓' },
                { id: 'standards', label: 'Expert Standards', icon: '🎯' },
                { id: 'market', label: 'Market Data', icon: '📈' },
              ].map((view) => (
                <button
                  key={view.id}
                  onClick={() => setMasteryView(view.id)}
                  className={`flex-1 min-w-28 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    masteryView === view.id 
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg' 
                      : `${theme.textMuted} hover:${theme.text} ${theme.bgMuted}`
                  }`}
                >
                  <span>{view.icon}</span>
                  {view.label}
                </button>
              ))}
            </div>

            {/* OVERVIEW VIEW */}
            {masteryView === 'overview' && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Progress Summary */}
                <div className={`${theme.bgCard} rounded-xl border ${theme.border} p-5`}>
                  <h3 className={`font-semibold ${theme.text} mb-4`}>Progress Summary</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Daily Habits', value: getDailyProgress(selectedNeighborhood), color: colors.primary },
                      { label: 'Weekly Tasks', value: getWeeklyProgress(selectedNeighborhood), color: colors.violet },
                      { label: 'Quiz Scores', value: getQuizAverage(selectedNeighborhood), color: colors.success },
                      { label: 'Properties Mastered', value: Math.round(((masteredProperties[selectedNeighborhood] || 0) / 50) * 100), color: colors.warning },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-1">
                          <span className={theme.textMuted}>{item.label}</span>
                          <span className={`font-semibold ${theme.text}`}>{item.value}%</span>
                        </div>
                        <div className={`h-3 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} rounded-full overflow-hidden`}>
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className={`${theme.bgCard} rounded-xl border ${theme.border} p-5`}>
                  <h3 className={`font-semibold ${theme.text} mb-4`}>Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setMasteryView('daily')}
                      className={`p-4 rounded-xl ${theme.bgMuted} hover:bg-cyan-500/20 transition-all text-left`}
                    >
                      <span className="text-2xl mb-2 block">☀️</span>
                      <p className={`font-medium ${theme.text}`}>Daily Habits</p>
                      <p className={`text-xs ${theme.textMuted}`}>{dailyHabits.filter(h => isDailyHabitComplete(h.id, selectedNeighborhood)).length}/{dailyHabits.length} complete</p>
                    </button>
                    <button 
                      onClick={() => setMasteryView('weekly')}
                      className={`p-4 rounded-xl ${theme.bgMuted} hover:bg-violet-500/20 transition-all text-left`}
                    >
                      <span className="text-2xl mb-2 block">📅</span>
                      <p className={`font-medium ${theme.text}`}>Weekly Tasks</p>
                      <p className={`text-xs ${theme.textMuted}`}>{weeklyTasks.filter(t => isWeeklyTaskComplete(t.id, selectedNeighborhood)).length}/{weeklyTasks.length} complete</p>
                    </button>
                    <button 
                      onClick={() => startQuiz(selectedNeighborhood)}
                      className={`p-4 rounded-xl ${theme.bgMuted} hover:bg-emerald-500/20 transition-all text-left`}
                    >
                      <span className="text-2xl mb-2 block">❓</span>
                      <p className={`font-medium ${theme.text}`}>Take Quiz</p>
                      <p className={`text-xs ${theme.textMuted}`}>Best: {getQuizAverage(selectedNeighborhood)}%</p>
                    </button>
                    <button 
                      onClick={() => setMasteryView('market')}
                      className={`p-4 rounded-xl ${theme.bgMuted} hover:bg-amber-500/20 transition-all text-left`}
                    >
                      <span className="text-2xl mb-2 block">📈</span>
                      <p className={`font-medium ${theme.text}`}>Market Data</p>
                      <p className={`text-xs ${theme.textMuted}`}>View stats</p>
                    </button>
                  </div>
                </div>

                {/* Recent Quiz Scores */}
                <div className={`${theme.bgCard} rounded-xl border ${theme.border} p-5`}>
                  <h3 className={`font-semibold ${theme.text} mb-4`}>Quiz History</h3>
                  {(quizScores[selectedNeighborhood] || []).length > 0 ? (
                    <div className="space-y-2">
                      {(quizScores[selectedNeighborhood] || []).slice(-5).reverse().map((score, i) => (
                        <div key={i} className={`flex items-center justify-between p-3 ${theme.bgMuted} rounded-lg`}>
                          <span className={theme.textMuted}>{new Date(score.date).toLocaleDateString()}</span>
                          <span className={`font-bold ${score.score >= 80 ? 'text-emerald-400' : score.score >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                            {score.score}%
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`text-center py-8 ${theme.textMuted}`}>
                      <p>No quizzes taken yet</p>
                      <button 
                        onClick={() => startQuiz(selectedNeighborhood)}
                        className="mt-2 text-cyan-500 hover:text-cyan-400"
                      >
                        Take your first quiz →
                      </button>
                    </div>
                  )}
                </div>

                {/* Neighborhood Characteristics */}
                <div className={`${theme.bgCard} rounded-xl border ${theme.border} p-5`}>
                  <h3 className={`font-semibold ${theme.text} mb-4`}>Key Characteristics</h3>
                  <div className="flex flex-wrap gap-2">
                    {neighborhoodDetails[selectedNeighborhood].characteristics.map((char, i) => (
                      <span key={i} className={`px-3 py-1 rounded-full text-sm ${theme.bgMuted} ${theme.text}`}>
                        {char}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className={`text-xs ${theme.textMuted}`}>Key Builders</p>
                      {neighborhoodDetails[selectedNeighborhood].keyBuilders.map((b, i) => (
                        <p key={i} className={`text-sm ${theme.text}`}>{b}</p>
                      ))}
                    </div>
                    <div>
                      <p className={`text-xs ${theme.textMuted}`}>Key Architects</p>
                      {neighborhoodDetails[selectedNeighborhood].keyArchitects.map((a, i) => (
                        <p key={i} className={`text-sm ${theme.text}`}>{a}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DAILY HABITS VIEW */}
            {masteryView === 'daily' && (
              <div className={`${theme.bgCard} rounded-xl border ${theme.border} p-5`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${theme.text}`}>Daily Habits - {selectedNeighborhood}</h3>
                  <span className={`text-sm ${theme.textMuted}`}>{getDailyProgress(selectedNeighborhood)}% complete today</span>
                </div>
                <div className="space-y-3">
                  {dailyHabits.map((habit) => {
                    const isComplete = isDailyHabitComplete(habit.id, selectedNeighborhood);
                    return (
                      <div 
                        key={habit.id}
                        className={`p-4 rounded-xl border ${isComplete ? 'border-emerald-500/50 bg-emerald-500/10' : theme.border} ${theme.bgMuted} transition-all`}
                      >
                        <div className="flex items-start gap-4">
                          <button
                            onClick={() => toggleDailyHabit(habit.id, selectedNeighborhood)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 transition-all ${
                              isComplete ? 'bg-emerald-500 border-emerald-500 text-white' : `${darkMode ? 'border-slate-500' : 'border-slate-300'} hover:border-cyan-400`
                            }`}
                          >
                            {isComplete && <Icons.Check />}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{habit.icon}</span>
                              <p className={`font-medium ${isComplete ? 'line-through text-emerald-400' : theme.text}`}>{habit.title}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'}`}>
                                +{habit.points} pts
                              </span>
                            </div>
                            <p className={`text-sm ${theme.textMuted} mt-1`}>{habit.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WEEKLY TASKS VIEW */}
            {masteryView === 'weekly' && (
              <div className={`${theme.bgCard} rounded-xl border ${theme.border} p-5`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${theme.text}`}>Weekly Deep Dives - {selectedNeighborhood}</h3>
                  <span className={`text-sm ${theme.textMuted}`}>{getWeeklyProgress(selectedNeighborhood)}% complete this week</span>
                </div>
                <div className="space-y-3">
                  {weeklyTasks.map((task) => {
                    const isComplete = isWeeklyTaskComplete(task.id, selectedNeighborhood);
                    return (
                      <div 
                        key={task.id}
                        className={`p-4 rounded-xl border ${isComplete ? 'border-emerald-500/50 bg-emerald-500/10' : theme.border} ${theme.bgMuted} transition-all`}
                      >
                        <div className="flex items-start gap-4">
                          <button
                            onClick={() => toggleWeeklyTask(task.id, selectedNeighborhood)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 transition-all ${
                              isComplete ? 'bg-emerald-500 border-emerald-500 text-white' : `${darkMode ? 'border-slate-500' : 'border-slate-300'} hover:border-cyan-400`
                            }`}
                          >
                            {isComplete && <Icons.Check />}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-700'}`}>
                                {task.day}
                              </span>
                              <p className={`font-medium ${isComplete ? 'line-through text-emerald-400' : theme.text}`}>{task.title}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'}`}>
                                +{task.points} pts
                              </span>
                            </div>
                            <p className={`text-sm ${theme.textMuted} mt-1`}>{task.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* QUIZ VIEW */}
            {masteryView === 'quiz' && (
              <div className={`${theme.bgCard} rounded-xl border ${theme.border} p-6`}>
                {!quizState.active ? (
                  // Quiz Start Screen
                  <div className="text-center py-8">
                    <span className="text-6xl mb-4 block">🧠</span>
                    <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>{selectedNeighborhood} Knowledge Quiz</h3>
                    <p className={`${theme.textMuted} mb-6`}>{quizQuestions[selectedNeighborhood].length} questions • Earn 5 points per correct answer</p>
                    <button
                      onClick={() => startQuiz(selectedNeighborhood)}
                      className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-cyan-700 shadow-lg"
                    >
                      Start Quiz
                    </button>
                    {(quizScores[selectedNeighborhood] || []).length > 0 && (
                      <p className={`mt-4 ${theme.textMuted}`}>
                        Your average: <span className="font-bold text-cyan-500">{getQuizAverage(selectedNeighborhood)}%</span>
                      </p>
                    )}
                  </div>
                ) : quizState.showResults ? (
                  // Quiz Results
                  <div className="text-center py-8">
                    {(() => {
                      const correctCount = quizState.answers.reduce((acc, answer, idx) => {
                        return acc + (answer === quizQuestions[selectedNeighborhood][idx].correct ? 1 : 0);
                      }, 0);
                      const percentage = Math.round((correctCount / quizQuestions[selectedNeighborhood].length) * 100);
                      return (
                        <>
                          <span className="text-6xl mb-4 block">{percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}</span>
                          <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>Quiz Complete!</h3>
                          <p className={`text-4xl font-bold mb-2 ${percentage >= 80 ? 'text-emerald-400' : percentage >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                            {percentage}%
                          </p>
                          <p className={theme.textMuted}>{correctCount} of {quizQuestions[selectedNeighborhood].length} correct • +{correctCount * 5} points earned</p>
                          
                          {/* Review Answers */}
                          <div className="mt-6 text-left space-y-3">
                            {quizQuestions[selectedNeighborhood].map((q, idx) => {
                              const isCorrect = quizState.answers[idx] === q.correct;
                              return (
                                <div key={q.id} className={`p-3 rounded-lg ${isCorrect ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-rose-500/10 border border-rose-500/30'}`}>
                                  <p className={`text-sm ${theme.text}`}>{q.question}</p>
                                  <p className={`text-xs mt-1 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {isCorrect ? '✓ Correct' : `✗ Your answer: ${q.options[quizState.answers[idx]]} | Correct: ${q.options[q.correct]}`}
                                  </p>
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-6 flex gap-3 justify-center">
                            <button
                              onClick={() => setQuizState({ active: false, currentQuestion: 0, answers: [], showResults: false })}
                              className={`px-6 py-2 rounded-lg ${theme.bgMuted} ${theme.text} hover:bg-cyan-500/20`}
                            >
                              Back to Overview
                            </button>
                            <button
                              onClick={() => startQuiz(selectedNeighborhood)}
                              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-medium"
                            >
                              Retake Quiz
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  // Active Quiz
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className={theme.textMuted}>Question {quizState.currentQuestion + 1} of {quizQuestions[selectedNeighborhood].length}</span>
                      <div className={`h-2 flex-1 mx-4 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} rounded-full overflow-hidden`}>
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full transition-all duration-300"
                          style={{ width: `${((quizState.currentQuestion + 1) / quizQuestions[selectedNeighborhood].length) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <h3 className={`text-lg font-medium ${theme.text} mb-6`}>
                      {quizQuestions[selectedNeighborhood][quizState.currentQuestion].question}
                    </h3>
                    
                    <div className="space-y-3">
                      {quizQuestions[selectedNeighborhood][quizState.currentQuestion].options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => answerQuestion(idx)}
                          className={`w-full p-4 rounded-xl border ${theme.border} ${theme.bgMuted} text-left hover:border-cyan-400 hover:bg-cyan-500/10 transition-all`}
                        >
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${darkMode ? 'bg-slate-600' : 'bg-slate-200'} text-sm font-medium ${theme.text} mr-3`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className={theme.text}>{option}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* EXPERT STANDARDS VIEW */}
            {masteryView === 'standards' && (
              <div className={`${theme.bgCard} rounded-xl border ${theme.border} p-5`}>
                <h3 className={`font-semibold ${theme.text} mb-4`}>Expert Standards Checklist - {selectedNeighborhood}</h3>
                <p className={`${theme.textMuted} mb-4`}>Can you confidently do each of these? Practice until you can!</p>
                <div className="space-y-3">
                  {expertStandards.map((standard) => (
                    <div key={standard.id} className={`p-4 rounded-xl ${theme.bgMuted} border ${theme.border}`}>
                      <div className="flex items-start gap-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-700'}`}>
                          {standard.category}
                        </span>
                      </div>
                      <p className={`${theme.text} mt-2`}>{standard.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MARKET DATA VIEW */}
            {masteryView === 'market' && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className={`${theme.bgCard} rounded-xl border ${theme.border} p-5`}>
                  <h3 className={`font-semibold ${theme.text} mb-4`}>{selectedNeighborhood} Market Snapshot</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Active Inventory', value: neighborhoodDetails[selectedNeighborhood].inventory, suffix: ' homes' },
                      { label: 'Average Price', value: `$${neighborhoodDetails[selectedNeighborhood].avgPrice}M`, suffix: '' },
                      { label: 'Price per Sq Ft', value: `$${neighborhoodDetails[selectedNeighborhood].pricePerSqFt.toLocaleString()}`, suffix: '' },
                      { label: 'Avg Days on Market', value: neighborhoodDetails[selectedNeighborhood].avgDom, suffix: ' days' },
                      { label: 'Typical Lot Size', value: neighborhoodDetails[selectedNeighborhood].avgLotSize, suffix: '' },
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className={theme.textMuted}>{stat.label}</span>
                        <span className={`font-semibold ${theme.text}`}>{stat.value}{stat.suffix}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`${theme.bgCard} rounded-xl border ${theme.border} p-5`}>
                  <h3 className={`font-semibold ${theme.text} mb-4`}>Compare Neighborhoods</h3>
                  <div className="space-y-4">
                    {['Gables Estates', 'Cocoplum', 'Old Cutler Bay'].map((neighborhood) => {
                      const details = neighborhoodDetails[neighborhood];
                      return (
                        <div key={neighborhood} className={`p-3 rounded-lg ${selectedNeighborhood === neighborhood ? 'bg-cyan-500/10 border border-cyan-500/30' : theme.bgMuted}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-medium ${theme.text}`}>{neighborhood}</span>
                            <span style={{ color: details.color }}>●</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <p className={theme.textMuted}>Avg Price</p>
                              <p className={`font-semibold ${theme.text}`}>${details.avgPrice}M</p>
                            </div>
                            <div>
                              <p className={theme.textMuted}>$/SqFt</p>
                              <p className={`font-semibold ${theme.text}`}>${details.pricePerSqFt}</p>
                            </div>
                            <div>
                              <p className={theme.textMuted}>DOM</p>
                              <p className={`font-semibold ${theme.text}`}>{details.avgDom}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className={`${theme.bgCard} rounded-xl p-6 shadow-sm border ${theme.border}`}>
              <h2 className={`text-xl font-semibold ${theme.text} mb-6`}>Profile Settings</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${theme.textMuted} mb-2`}>Display Name</label>
                  <input 
                    type="text" 
                    placeholder="Your name..."
                    className={`w-full px-4 py-3 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`}
                    value={userProfile.displayName || ''}
                    onChange={e => setUserProfile({...userProfile, displayName: e.target.value})}
                  />
                  <p className={`text-xs ${theme.textMuted} mt-1`}>This is how you'll be greeted in the app</p>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${theme.textMuted} mb-2`}>Title / Role</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Real Estate Agent, Broker..."
                    className={`w-full px-4 py-3 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`}
                    value={userProfile.title || ''}
                    onChange={e => setUserProfile({...userProfile, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${theme.textMuted} mb-2`}>Company / Brokerage</label>
                  <input 
                    type="text" 
                    placeholder="e.g. One Sotheby's International Realty..."
                    className={`w-full px-4 py-3 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`}
                    value={userProfile.company || ''}
                    onChange={e => setUserProfile({...userProfile, company: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${theme.textMuted} mb-2`}>Phone</label>
                  <input 
                    type="tel" 
                    placeholder="(555) 123-4567"
                    className={`w-full px-4 py-3 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`}
                    value={userProfile.phone || ''}
                    onChange={e => setUserProfile({...userProfile, phone: e.target.value})}
                  />
                </div>
              </div>
              
              <div className={`mt-6 p-4 ${theme.bgMuted} rounded-lg`}>
                <p className={`text-sm ${theme.textMuted}`}>
                  <span className="text-cyan-500">✓</span> Changes are saved automatically
                </p>
              </div>
            </div>
            
            <div className={`${theme.bgCard} rounded-xl p-6 shadow-sm border ${theme.border}`}>
              <h2 className={`text-xl font-semibold ${theme.text} mb-6`}>Account</h2>
              
              <div className="space-y-4">
                <div className={`flex items-center justify-between p-4 ${theme.bgMuted} rounded-lg`}>
                  <div>
                    <p className={`font-medium ${theme.text}`}>Email</p>
                    <p className={`text-sm ${theme.textMuted}`}>{user?.email || 'Not logged in'}</p>
                  </div>
                </div>
                
                <div className={`flex items-center justify-between p-4 ${theme.bgMuted} rounded-lg`}>
                  <div>
                    <p className={`font-medium ${theme.text}`}>Dark Mode</p>
                    <p className={`text-sm ${theme.textMuted}`}>Toggle dark/light theme</p>
                  </div>
                  <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-cyan-500 text-white' : `${theme.border} border ${theme.text}`}`}
                  >
                    {darkMode ? 'On' : 'Off'}
                  </button>
                </div>
                
                {user && (
                  <button
                    onClick={async () => {
                      if (isSupabaseConfigured()) {
                        await supabase.auth.signOut();
                      }
                    }}
                    className="w-full mt-4 px-4 py-3 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-colors"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Deal Detail Slide-over */}
      {selectedDeal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={() => setSelectedDeal(null)}>
          <div className="bg-white w-full max-w-xl h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 z-10">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: stageColors[selectedDeal.stage]?.bg, color: stageColors[selectedDeal.stage]?.text }}>
                      {selectedDeal.stage}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-slate-100 text-slate-600">
                      {selectedDeal.type}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">{selectedDeal.property}</h2>
                  <p className="text-slate-500 flex items-center gap-1 mt-1">
                    <Icons.MapPin /> {selectedDeal.neighborhood}
                  </p>
                </div>
                <button onClick={() => setSelectedDeal(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <Icons.X />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Value Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-slate-500 text-sm">Deal Value</p>
                  <p className="text-xl font-semibold text-slate-800">${(selectedDeal.value/1e6).toFixed(2)}M</p>
                </div>
                <div className="bg-cyan-50 rounded-xl p-4">
                  <p className="text-cyan-600 text-sm">Commission Rate</p>
                  <p className="text-xl font-semibold text-cyan-600">{selectedDeal.commissionPercent || (((selectedDeal.commission || selectedDeal.fees || 0) / selectedDeal.value) * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4">
                  <p className="text-emerald-600 text-sm">Projected Commission</p>
                  <p className="text-xl font-semibold text-emerald-600">${((selectedDeal.commission || selectedDeal.fees || 0)/1e3).toFixed(0)}K</p>
                </div>
              </div>

              {/* Stage Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Deal Stage</label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(stageColors).map((stage) => (
                    <button
                      key={stage}
                      onClick={() => updateDealStage(selectedDeal.id, stage)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedDeal.stage === stage 
                          ? 'ring-2 ring-offset-2 ring-cyan-400' 
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: stageColors[stage]?.bg, color: stageColors[stage]?.text }}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Step */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-700 text-sm font-medium">Next Step</p>
                    <p className="text-amber-900 font-semibold mt-0.5">{selectedDeal.nextStep || 'Not set'}</p>
                  </div>
                  <button 
                    onClick={() => { setEditingDeal(selectedDeal); setFormData(selectedDeal); setShowModal('deal'); setSelectedDeal(null); }}
                    className="text-amber-600 hover:text-amber-700 p-1"
                  >
                    <Icons.Edit />
                  </button>
                </div>
              </div>

              {/* Linked Contacts */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-700">Linked Contacts</h3>
                  <button 
                    onClick={() => { setEditingDeal(selectedDeal); setFormData(selectedDeal); setShowModal('deal'); setSelectedDeal(null); }}
                    className="text-cyan-600 text-sm font-medium hover:text-cyan-700"
                  >
                    + Add Contact
                  </button>
                </div>
                {getContactsForDeal(selectedDeal).length > 0 ? (
                  <div className="space-y-2">
                    {getContactsForDeal(selectedDeal).map(c => (
                      <div key={c.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 text-white flex items-center justify-center font-medium">
                          {c.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">{c.name}</p>
                          <p className="text-slate-500 text-sm">{c.company} • {c.type}</p>
                        </div>
                        <div className="flex gap-1">
                          <button className="p-2 rounded-lg hover:bg-slate-200 text-slate-500">
                            <Icons.Phone />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-slate-200 text-slate-500">
                            <Icons.Mail />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-xl">
                    <p className="text-slate-500 text-sm">No contacts linked</p>
                    <button 
                      onClick={() => { setEditingDeal(selectedDeal); setFormData(selectedDeal); setShowModal('deal'); setSelectedDeal(null); }}
                      className="text-cyan-600 text-sm font-medium mt-1"
                    >
                      Link a contact
                    </button>
                  </div>
                )}
              </div>

              {/* Recent Activity for this Deal */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-700">Recent Activity</h3>
                  <button 
                    onClick={() => { setFormData({ type: 'Call', contactId: getContactsForDeal(selectedDeal)[0]?.id || '', description: '', date: todayStr, outcome: 'Positive' }); setShowModal('activity'); setSelectedDeal(null); }}
                    className="text-cyan-600 text-sm font-medium hover:text-cyan-700"
                  >
                    + Log Activity
                  </button>
                </div>
                {getActivitiesForDeal(selectedDeal).length > 0 ? (
                  <div className="space-y-2">
                    {getActivitiesForDeal(selectedDeal).slice(0, 5).map(act => (
                      <div key={act.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                        <span className="text-lg">{act.type === 'Call' ? '📞' : act.type === 'Email' ? '📧' : act.type === 'Meeting' ? '🤝' : '🏠'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-800 text-sm">{act.description}</p>
                          <p className="text-slate-400 text-xs mt-0.5">{act.date} • {act.contactName}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-xl">
                    <p className="text-slate-500 text-sm">No activity logged yet</p>
                  </div>
                )}
              </div>

              {/* Related Tasks */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-700">Related Tasks</h3>
                  <button 
                    onClick={() => { setFormData({ title: '', dueDate: todayStr, priority: 'Medium', contactId: getContactsForDeal(selectedDeal)[0]?.id || '' }); setShowModal('task'); setSelectedDeal(null); }}
                    className="text-cyan-600 text-sm font-medium hover:text-cyan-700"
                  >
                    + Add Task
                  </button>
                </div>
                {getTasksForDeal(selectedDeal).length > 0 ? (
                  <div className="space-y-2">
                    {getTasksForDeal(selectedDeal).map(task => (
                      <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            task.status === 'Completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                          }`}
                        >
                          {task.status === 'Completed' && <Icons.Check />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task.title}</p>
                          <p className="text-slate-400 text-xs mt-0.5">Due: {task.dueDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-xl">
                    <p className="text-slate-500 text-sm">No tasks for this deal</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button 
                  onClick={() => { setEditingDeal(selectedDeal); setFormData(selectedDeal); setShowModal('deal'); setSelectedDeal(null); }}
                  className="flex-1 py-2.5 rounded-xl text-white font-medium bg-cyan-500 hover:bg-cyan-600"
                >
                  Edit Deal
                </button>
                <button 
                  onClick={() => confirmDelete('deal', selectedDeal, selectedDeal.property)}
                  className="px-4 py-2.5 rounded-xl border border-red-200 text-red-500 font-medium hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Detail Slide-over */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={() => setSelectedContact(null)}>
          <div className={`${theme.bgCard} w-full max-w-xl h-full overflow-y-auto transition-colors duration-300`} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className={`sticky top-0 ${theme.bgCard} border-b ${theme.border} p-6 z-10`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 text-white flex items-center justify-center font-bold text-xl">
                    {selectedContact.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                  </div>
                  <div>
                    <h2 className={`text-xl font-semibold ${theme.text}`}>{selectedContact.name}</h2>
                    <p className={theme.textMuted}>{selectedContact.company}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: typeColors[selectedContact.type]?.bg, color: typeColors[selectedContact.type]?.text }}>
                        {selectedContact.type}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selectedContact.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : selectedContact.status === 'Warm' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'}`}>
                        {selectedContact.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedContact(null)} className={`p-2 ${theme.bgMuted} hover:bg-cyan-500/20 rounded-lg ${theme.textMuted}`}>
                  <Icons.X />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className={`${theme.bgMuted} rounded-xl p-4`}>
                <h3 className={`text-sm font-medium ${theme.textMuted} mb-3`}>Contact Information</h3>
                <div className="space-y-3">
                  {selectedContact.email && (
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-slate-200'} flex items-center justify-center`}>
                        <Icons.Mail />
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs ${theme.textMuted}`}>Email</p>
                        <a href={`mailto:${selectedContact.email}`} className={`${theme.text} hover:text-cyan-400`}>{selectedContact.email}</a>
                      </div>
                    </div>
                  )}
                  {selectedContact.phone && (
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-slate-200'} flex items-center justify-center`}>
                        <Icons.Phone />
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs ${theme.textMuted}`}>Phone</p>
                        <a href={`tel:${selectedContact.phone}`} className={`${theme.text} hover:text-cyan-400`}>{selectedContact.phone}</a>
                      </div>
                    </div>
                  )}
                  {selectedContact.neighborhood && (
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-slate-200'} flex items-center justify-center`}>
                        <Icons.MapPin />
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs ${theme.textMuted}`}>Neighborhood Focus</p>
                        <p className={theme.text}>{selectedContact.neighborhood}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-slate-200'} flex items-center justify-center`}>
                      <Icons.Calendar />
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs ${theme.textMuted}`}>Last Contact</p>
                      <p className={theme.text}>{selectedContact.lastContact || 'Not recorded'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Linked Deals */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-sm font-medium ${theme.textMuted}`}>Linked Deals ({getDealsForContact(selectedContact.id).length})</h3>
                  <button 
                    onClick={() => { setFormData({ property: '', neighborhood: '', stage: 'Lead', value: '', commissionPercent: 2.5, commission: '', type: 'Buyer', nextStep: '', contactIds: [selectedContact.id] }); setShowModal('deal'); setSelectedContact(null); }}
                    className="text-cyan-500 text-sm font-medium hover:text-cyan-400"
                  >
                    + Add Deal
                  </button>
                </div>
                {getDealsForContact(selectedContact.id).length > 0 ? (
                  <div className="space-y-2">
                    {getDealsForContact(selectedContact.id).map(deal => (
                      <div 
                        key={deal.id} 
                        onClick={() => { setSelectedContact(null); setSelectedDeal(deal); setActiveTab('pipeline'); }}
                        className={`flex items-center justify-between p-3 ${theme.bgMuted} rounded-xl cursor-pointer hover:bg-cyan-500/10 transition-all`}
                      >
                        <div>
                          <p className={`font-medium ${theme.text}`}>{deal.property}</p>
                          <p className={`text-xs ${theme.textMuted}`}>{deal.neighborhood}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${theme.text}`}>${(deal.value/1e6).toFixed(1)}M</p>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: stageColors[deal.stage]?.bg, color: stageColors[deal.stage]?.text }}>
                            {deal.stage}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-6 ${theme.bgMuted} rounded-xl`}>
                    <p className={theme.textMuted}>No deals linked to this contact</p>
                  </div>
                )}
              </div>

              {/* Activity History */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-sm font-medium ${theme.textMuted}`}>Activity History</h3>
                  <button 
                    onClick={() => { setFormData({ type: 'Call', contactId: selectedContact.id.toString(), description: '', date: todayStr, outcome: 'Positive' }); setShowModal('activity'); setSelectedContact(null); }}
                    className="text-cyan-500 text-sm font-medium hover:text-cyan-400"
                  >
                    + Log Activity
                  </button>
                </div>
                {(() => {
                  const contactActivities = activities.filter(a => a.contactId === selectedContact.id);
                  return contactActivities.length > 0 ? (
                    <div className="space-y-2">
                      {contactActivities.slice(0, 5).map(act => (
                        <div key={act.id} className={`flex items-start gap-3 p-3 ${theme.bgMuted} rounded-xl`}>
                          <span className="text-lg">{act.type === 'Call' ? '📞' : act.type === 'Email' ? '📧' : act.type === 'Meeting' ? '🤝' : '🏠'}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`${theme.text} text-sm`}>{act.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`${theme.textFaint} text-xs`}>{act.date}</span>
                              <span className={`text-xs px-2 py-0.5 rounded ${act.outcome === 'Positive' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                {act.outcome}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {contactActivities.length > 5 && (
                        <button 
                          onClick={() => { setActiveTab('activities'); setSelectedContact(null); }}
                          className={`w-full p-2 text-center text-sm ${theme.textMuted} hover:text-cyan-400`}
                        >
                          View all {contactActivities.length} activities →
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className={`text-center py-6 ${theme.bgMuted} rounded-xl`}>
                      <p className={theme.textMuted}>No activities logged yet</p>
                    </div>
                  );
                })()}
              </div>

              {/* Related Tasks */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-sm font-medium ${theme.textMuted}`}>Related Tasks</h3>
                  <button 
                    onClick={() => { setFormData({ title: '', dueDate: todayStr, priority: 'Medium', contactId: selectedContact.id.toString() }); setShowModal('task'); setSelectedContact(null); }}
                    className="text-cyan-500 text-sm font-medium hover:text-cyan-400"
                  >
                    + Add Task
                  </button>
                </div>
                {(() => {
                  const contactTasks = tasks.filter(t => t.contactId === selectedContact.id);
                  return contactTasks.length > 0 ? (
                    <div className="space-y-2">
                      {contactTasks.map(task => {
                        const dueStatus = getTaskDueStatus(task.dueDate);
                        return (
                          <div key={task.id} className={`flex items-center gap-3 p-3 ${theme.bgMuted} rounded-xl`}>
                            <button
                              onClick={() => toggleTask(task.id)}
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                task.status === 'Completed' ? 'bg-emerald-500 border-emerald-500 text-white' : `${darkMode ? 'border-slate-500' : 'border-slate-300'}`
                              }`}
                            >
                              {task.status === 'Completed' && <Icons.Check />}
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${task.status === 'Completed' ? `line-through ${theme.textMuted}` : theme.text}`}>{task.title}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${task.status === 'Completed' ? `${theme.bgMuted} ${theme.textMuted}` : `${dueStatus.bg} ${dueStatus.color}`}`}>
                                {task.status === 'Completed' ? 'Completed' : dueStatus.label}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className={`text-center py-6 ${theme.bgMuted} rounded-xl`}>
                      <p className={theme.textMuted}>No tasks for this contact</p>
                    </div>
                  );
                })()}
              </div>

              {/* Notes */}
              <div>
                <h3 className={`text-sm font-medium ${theme.textMuted} mb-3`}>Notes</h3>
                <div className="space-y-2">
                  {/* Add Note Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { addNoteToContact(selectedContact.id, newNote); } }}
                      className={`flex-1 px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} text-sm focus:outline-none focus:border-cyan-400`}
                    />
                    <button
                      onClick={() => addNoteToContact(selectedContact.id, newNote)}
                      className="px-3 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 text-sm"
                    >
                      Add
                    </button>
                  </div>
                  {/* Notes List */}
                  {(selectedContact.notes || []).length > 0 ? (
                    <div className="space-y-2 mt-3">
                      {(selectedContact.notes || []).slice().reverse().map(note => (
                        <div key={note.id} className={`p-3 ${theme.bgMuted} rounded-lg group`}>
                          <div className="flex justify-between items-start">
                            <p className={`text-sm ${theme.text}`}>{note.text}</p>
                            <button 
                              onClick={() => deleteNoteFromContact(selectedContact.id, note.id)}
                              className={`opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-500/20 rounded ${theme.textMuted} hover:text-rose-400 transition-all`}
                            >
                              <Icons.X />
                            </button>
                          </div>
                          <p className={`text-xs ${theme.textFaint} mt-1`}>
                            {new Date(note.date).toLocaleDateString()} at {new Date(note.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-sm ${theme.textMuted} text-center py-4`}>No notes yet</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className={`flex gap-3 pt-4 border-t ${theme.border}`}>
                <button 
                  onClick={() => { setEditingContact(selectedContact); setFormData(selectedContact); setShowModal('contact'); setSelectedContact(null); }}
                  className="flex-1 py-2.5 rounded-xl text-white font-medium bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700"
                >
                  Edit Contact
                </button>
                <button 
                  onClick={() => confirmDelete('contact', selectedContact, selectedContact.name)}
                  className={`px-4 py-2.5 rounded-xl border ${darkMode ? 'border-rose-500/50 text-rose-400 hover:bg-rose-500/20' : 'border-rose-200 text-rose-500 hover:bg-rose-50'} font-medium`}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property Detail Slide-over */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={() => setSelectedProperty(null)}>
          <div className={`${theme.bgCard} w-full max-w-xl h-full overflow-y-auto transition-colors duration-300`} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className={`sticky top-0 ${theme.bgCard} border-b ${theme.border} p-6 z-10`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      selectedProperty.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' :
                      selectedProperty.status === 'Coming Soon' ? 'bg-amber-500/20 text-amber-400' :
                      selectedProperty.status === 'Sold' ? 'bg-slate-500/20 text-slate-400' :
                      'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {selectedProperty.status}
                    </span>
                    {selectedProperty.waterfront && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 font-medium">🌊 Waterfront</span>
                    )}
                  </div>
                  <h2 className={`text-xl font-semibold ${theme.text}`}>{selectedProperty.address}</h2>
                  <p className={`${theme.textMuted} flex items-center gap-1`}>
                    <Icons.MapPin /> {selectedProperty.neighborhood}
                  </p>
                  <p className={`text-2xl font-bold text-cyan-500 mt-2`}>${(selectedProperty.price / 1e6).toFixed(2)}M</p>
                </div>
                <button onClick={() => setSelectedProperty(null)} className={`p-2 ${theme.bgMuted} hover:bg-cyan-500/20 rounded-lg ${theme.textMuted}`}>
                  <Icons.X />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Property Image Placeholder */}
              <div className={`h-48 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} rounded-xl flex items-center justify-center`}>
                <div className="text-center">
                  <span className="text-6xl opacity-30">🏡</span>
                  <p className={`${theme.textMuted} text-sm mt-2`}>Photos coming soon</p>
                </div>
              </div>

              {/* Property Details */}
              <div className={`${theme.bgMuted} rounded-xl p-4`}>
                <h3 className={`text-sm font-medium ${theme.textMuted} mb-3`}>Property Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-xs ${theme.textMuted}`}>Type</p>
                    <p className={theme.text}>{selectedProperty.type}</p>
                  </div>
                  {selectedProperty.beds > 0 && (
                    <div>
                      <p className={`text-xs ${theme.textMuted}`}>Bedrooms</p>
                      <p className={theme.text}>{selectedProperty.beds}</p>
                    </div>
                  )}
                  {selectedProperty.baths > 0 && (
                    <div>
                      <p className={`text-xs ${theme.textMuted}`}>Bathrooms</p>
                      <p className={theme.text}>{selectedProperty.baths}</p>
                    </div>
                  )}
                  {selectedProperty.sqft > 0 && (
                    <div>
                      <p className={`text-xs ${theme.textMuted}`}>Square Feet</p>
                      <p className={theme.text}>{selectedProperty.sqft.toLocaleString()}</p>
                    </div>
                  )}
                  {selectedProperty.lotSize && (
                    <div>
                      <p className={`text-xs ${theme.textMuted}`}>Lot Size</p>
                      <p className={theme.text}>{selectedProperty.lotSize}</p>
                    </div>
                  )}
                  {selectedProperty.yearBuilt && (
                    <div>
                      <p className={`text-xs ${theme.textMuted}`}>Year Built</p>
                      <p className={theme.text}>{selectedProperty.yearBuilt}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Amenities */}
              <div className={`${theme.bgMuted} rounded-xl p-4`}>
                <h3 className={`text-sm font-medium ${theme.textMuted} mb-3`}>Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProperty.waterfront && (
                    <span className={`text-xs px-3 py-1.5 rounded-full ${theme.bgCard} ${theme.text}`}>🌊 Waterfront</span>
                  )}
                  {selectedProperty.pool && (
                    <span className={`text-xs px-3 py-1.5 rounded-full ${theme.bgCard} ${theme.text}`}>🏊 Pool</span>
                  )}
                  {selectedProperty.features && selectedProperty.features.split(',').map((feature, i) => (
                    <span key={i} className={`text-xs px-3 py-1.5 rounded-full ${theme.bgCard} ${theme.text}`}>
                      {feature.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Linked Deal */}
              {(() => {
                const linkedDeal = deals.find(d => d.id === selectedProperty.dealId);
                return linkedDeal ? (
                  <div>
                    <h3 className={`text-sm font-medium ${theme.textMuted} mb-3`}>Linked Deal</h3>
                    <div 
                      onClick={() => { setSelectedProperty(null); setSelectedDeal(linkedDeal); setActiveTab('pipeline'); }}
                      className={`p-4 ${theme.bgMuted} rounded-xl cursor-pointer hover:bg-cyan-500/10`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${theme.text}`}>{linkedDeal.property}</p>
                          <p className={`text-sm ${theme.textMuted}`}>{linkedDeal.type} • ${(linkedDeal.value/1e6).toFixed(1)}M</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: stageColors[linkedDeal.stage]?.bg, color: stageColors[linkedDeal.stage]?.text }}>
                          {linkedDeal.stage}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className={`text-sm font-medium ${theme.textMuted} mb-3`}>Linked Deal</h3>
                    <button 
                      onClick={() => { 
                        setFormData({ property: selectedProperty.address, neighborhood: selectedProperty.neighborhood, stage: 'Lead', value: selectedProperty.price, commissionPercent: 2.5, commission: (selectedProperty.price * 0.025).toFixed(0), type: 'Buyer', nextStep: '', contactIds: [] }); 
                        setShowModal('deal'); 
                        setSelectedProperty(null); 
                      }}
                      className={`w-full p-4 ${theme.bgMuted} rounded-xl border-2 border-dashed ${theme.border} hover:border-cyan-400 ${theme.textMuted} hover:text-cyan-400 transition-all`}
                    >
                      + Create Deal for this Property
                    </button>
                  </div>
                );
              })()}

              {/* Notes */}
              <div>
                <h3 className={`text-sm font-medium ${theme.textMuted} mb-3`}>Notes</h3>
                {selectedProperty.notes ? (
                  <div className={`p-4 ${theme.bgMuted} rounded-xl`}>
                    <p className={`${theme.text} text-sm whitespace-pre-wrap`}>{selectedProperty.notes}</p>
                  </div>
                ) : (
                  <p className={`${theme.textMuted} text-sm`}>No notes added</p>
                )}
              </div>

              {/* Actions */}
              <div className={`flex gap-3 pt-4 border-t ${theme.border}`}>
                <button 
                  onClick={() => { setEditingProperty(selectedProperty); setFormData(selectedProperty); setShowModal('property'); setSelectedProperty(null); }}
                  className="flex-1 py-2.5 rounded-xl text-white font-medium bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700"
                >
                  Edit Property
                </button>
                <button 
                  onClick={() => confirmDelete('property', selectedProperty, selectedProperty.address)}
                  className={`px-4 py-2.5 rounded-xl border ${darkMode ? 'border-rose-500/50 text-rose-400 hover:bg-rose-500/20' : 'border-rose-200 text-rose-500 hover:bg-rose-50'} font-medium`}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Property Modal */}
      {showModal === 'property' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowModal(null); setEditingProperty(null); }}>
          <div className={`${theme.bgCard} rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto transition-colors duration-300`} onClick={e => e.stopPropagation()}>
            <div className={`p-4 border-b ${theme.border} flex justify-between items-center sticky top-0 ${theme.bgCard}`}>
              <h3 className={`font-semibold ${theme.text}`}>{editingProperty ? 'Edit Property' : 'Add Property'}</h3>
              <button onClick={() => { setShowModal(null); setEditingProperty(null); }} className={`p-1 ${theme.bgMuted} rounded ${theme.textMuted}`}><Icons.X /></button>
            </div>
            <div className="p-4 space-y-4">
              <input type="text" placeholder="Property address..." className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-4">
                <select className={`px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text}`} value={formData.neighborhood || ''} onChange={e => setFormData({...formData, neighborhood: e.target.value})}>
                  <option value="">Neighborhood...</option>
                  <option>Gables Estates</option>
                  <option>Cocoplum</option>
                  <option>Old Cutler Bay</option>
                  <option>Coral Gables</option>
                  <option>Pinecrest</option>
                  <option>Coconut Grove</option>
                </select>
                <select className={`px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text}`} value={formData.type || 'Single Family'} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option>Single Family</option>
                  <option>Condo</option>
                  <option>Townhouse</option>
                  <option>Lot</option>
                  <option>Multi-Family</option>
                  <option>Commercial</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select className={`px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text}`} value={formData.status || 'Research'} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option>Research</option>
                  <option>Coming Soon</option>
                  <option>Active</option>
                  <option>Under Contract</option>
                  <option>Sold</option>
                  <option>Off Market</option>
                </select>
                <div className="relative">
                  <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textMuted}`}>$</span>
                  <input type="number" placeholder="Price" className={`w-full pl-7 pr-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} value={formData.price || ''} onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})} />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <input type="number" placeholder="Beds" className={`px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} value={formData.beds || ''} onChange={e => setFormData({...formData, beds: parseInt(e.target.value) || 0})} />
                <input type="number" placeholder="Baths" className={`px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} value={formData.baths || ''} onChange={e => setFormData({...formData, baths: parseFloat(e.target.value) || 0})} />
                <input type="number" placeholder="Sq Ft" className={`px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} value={formData.sqft || ''} onChange={e => setFormData({...formData, sqft: parseInt(e.target.value) || 0})} />
                <input type="number" placeholder="Year" className={`px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} value={formData.yearBuilt || ''} onChange={e => setFormData({...formData, yearBuilt: parseInt(e.target.value) || null})} />
              </div>

              <input type="text" placeholder="Lot size (e.g., 1.5 acres, 32,000 sqft)" className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} value={formData.lotSize || ''} onChange={e => setFormData({...formData, lotSize: e.target.value})} />

              <div className="flex gap-4">
                <label className={`flex items-center gap-2 cursor-pointer ${theme.text}`}>
                  <input type="checkbox" checked={formData.waterfront || false} onChange={e => setFormData({...formData, waterfront: e.target.checked})} className="rounded border-slate-300 text-cyan-500 focus:ring-cyan-400" />
                  🌊 Waterfront
                </label>
                <label className={`flex items-center gap-2 cursor-pointer ${theme.text}`}>
                  <input type="checkbox" checked={formData.pool || false} onChange={e => setFormData({...formData, pool: e.target.checked})} className="rounded border-slate-300 text-cyan-500 focus:ring-cyan-400" />
                  🏊 Pool
                </label>
              </div>

              <input type="text" placeholder="Features (comma separated)" className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} value={formData.features || ''} onChange={e => setFormData({...formData, features: e.target.value})} />

              <textarea placeholder="Notes..." className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} rows={3} value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} />

              <div>
                <p className={`text-sm ${theme.textMuted} mb-2`}>Link to Deal (optional)</p>
                <select className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text}`} value={formData.dealId || ''} onChange={e => setFormData({...formData, dealId: e.target.value ? parseInt(e.target.value) : null})}>
                  <option value="">No linked deal</option>
                  {deals.map(d => <option key={d.id} value={d.id}>{d.property} - {d.stage}</option>)}
                </select>
              </div>
            </div>
            <div className={`p-4 border-t ${theme.border} flex justify-end gap-2 sticky bottom-0 ${theme.bgCard}`}>
              <button onClick={() => { setShowModal(null); setEditingProperty(null); }} className={`px-4 py-2 ${theme.textMuted} ${theme.bgMuted} rounded-lg`}>Cancel</button>
              <button onClick={async () => {
                if (formData.address && formData.neighborhood) {
                  if (editingProperty) {
                    const updated = await dbUpdate('properties', editingProperty.id, formData);
                    setProperties(properties.map(p => p.id === editingProperty.id ? {...formData, id: editingProperty.id, ...updated} : p));
                  } else {
                    const newProperty = await dbInsert('properties', formData);
                    setProperties([newProperty, ...properties]);
                  }
                  setShowModal(null);
                  setEditingProperty(null);
                }
              }} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700">{editingProperty ? 'Save Changes' : 'Add Property'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showModal === 'task' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(null)}>
          <div className={`${theme.bgCard} rounded-xl w-full max-w-md transition-colors duration-300`} onClick={e => e.stopPropagation()}>
            <div className={`p-4 border-b ${theme.border} flex justify-between items-center`}>
              <h3 className={`font-semibold ${theme.text}`}>Add Task</h3>
              <button onClick={() => setShowModal(null)} className={`p-1 ${theme.bgMuted} rounded ${theme.textMuted}`}><Icons.X /></button>
            </div>
            <div className="p-4 space-y-4">
              <input 
                type="text" placeholder="Task title..." 
                className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`}
                value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input type="date" className={`px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text}`} value={formData.dueDate || ''} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                <select className={`px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text}`} value={formData.priority || 'Medium'} onChange={e => setFormData({...formData, priority: e.target.value})}>
                  <option>High</option><option>Medium</option><option>Low</option>
                </select>
              </div>
              <select className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text}`} value={formData.contactId || ''} onChange={e => setFormData({...formData, contactId: e.target.value})}>
                <option value="">No contact</option>
                {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className={`p-4 border-t ${theme.border} flex justify-end gap-2`}>
              <button onClick={() => setShowModal(null)} className={`px-4 py-2 ${theme.textMuted} ${theme.bgMuted} rounded-lg`}>Cancel</button>
              <button onClick={async () => {
                if (formData.title) {
                  const taskData = { ...formData, contactId: formData.contactId || null, status: 'Pending' };
                  const newTask = await dbInsert('tasks', taskData);
                  setTasks([newTask, ...tasks]);
                  setShowModal(null);
                }
              }} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700">Add Task</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {showModal === 'activity' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(null)}>
          <div className={`${theme.bgCard} rounded-xl w-full max-w-md transition-colors duration-300`} onClick={e => e.stopPropagation()}>
            <div className={`p-4 border-b ${theme.border} flex justify-between items-center`}>
              <h3 className={`font-semibold ${theme.text}`}>Log Activity</h3>
              <button onClick={() => setShowModal(null)} className={`p-1 ${theme.bgMuted} rounded ${theme.textMuted}`}><Icons.X /></button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {['Call', 'Email', 'Meeting', 'Showing'].map(t => (
                  <button key={t} onClick={() => setFormData({...formData, type: t})} className={`p-2 rounded-lg border text-center text-sm transition-all ${formData.type === t ? 'border-cyan-400 bg-cyan-500/20' : `${theme.border} ${theme.bgMuted}`}`}>
                    {t === 'Call' ? '📞' : t === 'Email' ? '📧' : t === 'Meeting' ? '🤝' : '🏠'}<br/><span className={theme.text}>{t}</span>
                  </button>
                ))}
              </div>
              <select className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text}`} value={formData.contactId || ''} onChange={e => setFormData({...formData, contactId: e.target.value})}>
                <option value="">Select contact...</option>
                {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <textarea placeholder="Description..." className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text}`} rows={2} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="date" className={`px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text}`} value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} />
                <select className={`px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text}`} value={formData.outcome || 'Positive'} onChange={e => setFormData({...formData, outcome: e.target.value})}>
                  <option>Positive</option><option>Neutral</option><option>No Answer</option><option>Sent</option>
                </select>
              </div>
            </div>
            <div className={`p-4 border-t ${theme.border} flex justify-end gap-2`}>
              <button onClick={() => setShowModal(null)} className={`px-4 py-2 ${theme.textMuted} ${theme.bgMuted} rounded-lg`}>Cancel</button>
              <button onClick={async () => {
                if (formData.contactId && formData.description) {
                  const contact = contacts.find(c => c.id == formData.contactId);
                  const activityData = { ...formData, contactId: formData.contactId, contactName: contact?.name || '' };
                  const newActivity = await dbInsert('activities', activityData);
                  setActivities([newActivity, ...activities]);
                  setShowModal(null);
                }
              }} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700">Log Activity</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Contact Modal */}
      {showModal === 'contact' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowModal(null); setEditingContact(null); }}>
          <div className={`${theme.bgCard} rounded-xl w-full max-w-md transition-colors duration-300`} onClick={e => e.stopPropagation()}>
            <div className={`p-4 border-b ${theme.border} flex justify-between items-center`}>
              <h3 className={`font-semibold ${theme.text}`}>{editingContact ? 'Edit Contact' : 'Add Contact'}</h3>
              <button onClick={() => { setShowModal(null); setEditingContact(null); }} className={`p-1 ${theme.bgMuted} rounded ${theme.textMuted}`}><Icons.X /></button>
            </div>
            <div className="p-4 space-y-4">
              <input type="text" placeholder="Full name..." className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="text" placeholder="Company..." className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} value={formData.company || ''} onChange={e => setFormData({...formData, company: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <select className={`px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} value={formData.type || 'Client'} onChange={e => setFormData({...formData, type: e.target.value})}>
                  {Object.keys(typeColors).map(t => <option key={t}>{t}</option>)}
                </select>
                <select className={`px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} value={formData.status || 'Active'} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option>Active</option><option>Warm</option><option>Cold</option><option>Inactive</option>
                </select>
              </div>
              <input type="email" placeholder="Email..." className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
              <input type="tel" placeholder="Phone..." className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <select className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} value={formData.neighborhood || ''} onChange={e => setFormData({...formData, neighborhood: e.target.value})}>
                <option value="">Neighborhood focus...</option>
                {['Gables Estates', 'Cocoplum', 'Old Cutler Bay', 'Coral Gables', 'Various'].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div className={`p-4 border-t ${theme.border} flex justify-end gap-2`}>
              <button onClick={() => { setShowModal(null); setEditingContact(null); }} className={`px-4 py-2 ${theme.textMuted} ${theme.bgMuted} rounded-lg`}>Cancel</button>
              <button onClick={async () => {
                if (formData.name) {
                  if (editingContact) {
                    const updated = await dbUpdate('contacts', editingContact.id, {...formData});
                    setContacts(contacts.map(c => c.id === editingContact.id ? {...formData, id: editingContact.id, ...updated} : c));
                  } else {
                    const newContact = await dbInsert('contacts', { ...formData, lastContact: todayStr, notes: [] });
                    setContacts([newContact, ...contacts]);
                  }
                  setShowModal(null);
                  setEditingContact(null);
                }
              }} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700">{editingContact ? 'Save Changes' : 'Add Contact'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Deal Modal */}
      {showModal === 'deal' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowModal(null); setEditingDeal(null); }}>
          <div className={`${theme.bgCard} rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto transition-colors duration-300`} onClick={e => e.stopPropagation()}>
            <div className={`p-4 border-b ${theme.border} flex justify-between items-center`}>
              <h3 className={`font-semibold ${theme.text}`}>{editingDeal ? 'Edit Deal' : 'Add Deal'}</h3>
              <button onClick={() => { setShowModal(null); setEditingDeal(null); }} className={`p-1 ${theme.bgMuted} rounded ${theme.textMuted}`}><Icons.X /></button>
            </div>
            <div className="p-4 space-y-4">
              <input type="text" placeholder="Property / Deal name..." className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} value={formData.property || ''} onChange={e => setFormData({...formData, property: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <select className={`px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} value={formData.neighborhood || ''} onChange={e => setFormData({...formData, neighborhood: e.target.value})}>
                  <option value="">Neighborhood...</option>
                  {['Gables Estates', 'Cocoplum', 'Old Cutler Bay', 'Coral Gables', 'Coconut Grove', 'Pinecrest', 'Various', 'TBD'].map(n => <option key={n}>{n}</option>)}
                </select>
                <select className={`px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} value={formData.type || 'Buyer'} onChange={e => setFormData({...formData, type: e.target.value})}>
                  {['Buyer', 'Seller', 'Developer', 'Investor', 'Landlord', 'Tenant'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              {/* Value and Commission Percentage */}
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`text-xs ${theme.textMuted} mb-1 block`}>Deal Value</label>
                    <div className="relative">
                      <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textMuted}`}>$</span>
                      <input type="number" placeholder="10,000,000" className={`w-full pl-7 pr-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} value={formData.value || ''} onChange={e => {
                        const value = parseFloat(e.target.value) || 0;
                        const commissionPercent = formData.commissionPercent || 2.5;
                        setFormData({...formData, value: e.target.value, commission: (value * commissionPercent / 100).toFixed(0)});
                      }} />
                    </div>
                  </div>
                  <div>
                    <label className={`text-xs ${theme.textMuted} mb-1 block`}>Commission %</label>
                    <div className="relative">
                      <input type="number" step="0.1" placeholder="2.5" className={`w-full pr-8 pl-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} value={formData.commissionPercent ?? ''} onChange={e => {
                        const commissionPercent = parseFloat(e.target.value) || 0;
                        const value = parseFloat(formData.value) || 0;
                        setFormData({...formData, commissionPercent: e.target.value, commission: (value * commissionPercent / 100).toFixed(0)});
                      }} />
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.textMuted}`}>%</span>
                    </div>
                  </div>
                </div>
                {/* Calculated Commission Display */}
                {formData.value && formData.commissionPercent && (
                  <div className={`mt-2 p-2 ${theme.bgMuted} rounded-lg flex items-center justify-between`}>
                    <span className={`text-sm ${theme.textMuted}`}>Calculated Commission:</span>
                    <span className={`text-sm font-semibold text-emerald-500`}>
                      ${parseFloat(formData.commission || 0).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select className={`px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} value={formData.stage || 'Lead'} onChange={e => setFormData({...formData, stage: e.target.value})}>
                  {Object.keys(stageColors).map(s => <option key={s}>{s}</option>)}
                </select>
                <input type="text" placeholder="Next step..." className={`px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} value={formData.nextStep || ''} onChange={e => setFormData({...formData, nextStep: e.target.value})} />
              </div>
              <div>
                <p className={`text-sm font-medium ${theme.textMuted} mb-2`}>Link Contacts</p>
                <div className={`border ${theme.border} rounded-lg p-2 max-h-40 overflow-y-auto space-y-1 ${theme.bgMuted}`}>
                  {contacts.map(c => (
                    <label key={c.id} className={`flex items-center gap-2 p-2 ${theme.bgCardHover} rounded cursor-pointer`}>
                      <input type="checkbox" checked={(formData.contactIds || []).includes(c.id)} onChange={e => {
                        const ids = formData.contactIds || [];
                        setFormData({...formData, contactIds: e.target.checked ? [...ids, c.id] : ids.filter(i => i !== c.id)});
                      }} className="rounded border-slate-300 text-cyan-500 focus:ring-cyan-400" />
                      <div className="flex-1">
                        <span className={`text-sm ${theme.text} font-medium`}>{c.name}</span>
                        <span className={`text-xs ${theme.textMuted} ml-2`}>{c.company}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <textarea placeholder="Notes..." className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`} rows={2} value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} />
            </div>
            <div className={`p-4 border-t ${theme.border} flex justify-end gap-2`}>
              <button onClick={() => { setShowModal(null); setEditingDeal(null); }} className={`px-4 py-2 ${theme.textMuted} ${theme.bgMuted} rounded-lg`}>Cancel</button>
              <button onClick={async () => {
                if (formData.property && formData.value) {
                  const dealData = {
                    ...formData,
                    value: parseFloat(formData.value),
                    commission: parseFloat(formData.commission) || 0,
                    commissionPercent: parseFloat(formData.commissionPercent) || 0,
                    notes: formData.notes || []
                  };
                  if (editingDeal) {
                    const updated = await dbUpdate('deals', editingDeal.id, dealData);
                    setDeals(deals.map(d => d.id === editingDeal.id ? {...dealData, id: editingDeal.id, ...updated} : d));
                  } else {
                    const newDeal = await dbInsert('deals', dealData);
                    setDeals([newDeal, ...deals]);
                  }
                  setShowModal(null);
                  setEditingDeal(null);
                }
              }} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700">{editingDeal ? 'Save Changes' : 'Add Deal'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Goals Modal */}
      {showGoalsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowGoalsModal(false)}>
          <div className={`${theme.bgCard} rounded-xl w-full max-w-md transition-colors duration-300`} onClick={e => e.stopPropagation()}>
            <div className={`p-4 border-b ${theme.border} flex justify-between items-center`}>
              <h3 className={`font-semibold ${theme.text}`}>🎯 Edit Income Goals</h3>
              <button onClick={() => setShowGoalsModal(false)} className={`p-1 ${theme.bgMuted} rounded ${theme.textMuted}`}><Icons.X /></button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className={`text-sm ${theme.textMuted}`}>Annual Goal (2026)</label>
                <div className="relative mt-1">
                  <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textMuted}`}>$</span>
                  <input 
                    type="number" 
                    className={`w-full pl-7 pr-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`}
                    value={goals.annual.target}
                    onChange={(e) => setGoals({...goals, annual: {...goals.annual, target: parseInt(e.target.value) || 0}})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['q1', 'q2', 'q3', 'q4'].map((q) => (
                  <div key={q}>
                    <label className={`text-sm ${theme.textMuted}`}>{goals[q].label}</label>
                    <div className="relative mt-1">
                      <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textMuted}`}>$</span>
                      <input 
                        type="number" 
                        className={`w-full pl-7 pr-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`}
                        value={goals[q].target}
                        onChange={(e) => setGoals({...goals, [q]: {...goals[q], target: parseInt(e.target.value) || 0}})}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className={`text-xs ${theme.textMuted}`}>
                💡 Tip: Your annual goal should equal the sum of quarterly goals for accurate tracking.
              </p>
            </div>
            <div className={`p-4 border-t ${theme.border} flex justify-end gap-2`}>
              <button onClick={() => setShowGoalsModal(false)} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700">Save Goals</button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowTemplatesModal(false); setSelectedTemplate(null); setEditingTemplate(null); }}>
          <div className={`${theme.bgCard} rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col transition-colors duration-300`} onClick={e => e.stopPropagation()}>
            <div className={`p-4 border-b ${theme.border} flex justify-between items-center`}>
              <h3 className={`font-semibold ${theme.text}`}>📧 Email & SMS Templates</h3>
              <button onClick={() => { setShowTemplatesModal(false); setSelectedTemplate(null); setEditingTemplate(null); }} className={`p-1 ${theme.bgMuted} rounded ${theme.textMuted}`}><Icons.X /></button>
            </div>
            <div className="flex flex-1 overflow-hidden">
              {/* Template List */}
              <div className={`w-1/3 border-r ${theme.border} overflow-y-auto`}>
                <div className="p-2">
                  <button 
                    onClick={async () => {
                      const templateData = { name: 'New Template', category: 'Email', subject: '', body: '' };
                      const newTemplate = await dbInsert('templates', templateData);
                      setTemplates([...templates, newTemplate]);
                      setSelectedTemplate(newTemplate);
                      setEditingTemplate(newTemplate);
                    }}
                    className={`w-full p-2 mb-2 text-sm ${theme.bgMuted} rounded-lg ${theme.text} hover:bg-cyan-500/20 flex items-center gap-2`}
                  >
                    <Icons.Plus /> New Template
                  </button>
                  {templates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => { setSelectedTemplate(template); setEditingTemplate(null); }}
                      className={`w-full p-3 text-left rounded-lg mb-1 transition-all ${
                        selectedTemplate?.id === template.id 
                          ? 'bg-cyan-500/20 border border-cyan-500/50' 
                          : `${theme.bgMuted} hover:bg-cyan-500/10`
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{template.category === 'Email' ? '📧' : '💬'}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium ${theme.text} text-sm truncate`}>{template.name}</p>
                          <p className={`text-xs ${theme.textMuted}`}>{template.category}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Template Preview/Edit */}
              <div className="flex-1 p-4 overflow-y-auto">
                {selectedTemplate ? (
                  editingTemplate ? (
                    <div className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Template name..."
                        className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`}
                        value={editingTemplate.name}
                        onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                      />
                      <select 
                        className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text}`}
                        value={editingTemplate.category}
                        onChange={(e) => setEditingTemplate({...editingTemplate, category: e.target.value})}
                      >
                        <option>Email</option>
                        <option>SMS</option>
                      </select>
                      {editingTemplate.category === 'Email' && (
                        <input 
                          type="text" 
                          placeholder="Subject line..."
                          className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`}
                          value={editingTemplate.subject}
                          onChange={(e) => setEditingTemplate({...editingTemplate, subject: e.target.value})}
                        />
                      )}
                      <textarea 
                        placeholder="Message body... Use [Name], [Property], [Neighborhood] for placeholders"
                        className={`w-full px-3 py-2 border ${theme.border} rounded-lg ${theme.bgInput} ${theme.text} focus:outline-none focus:border-cyan-400`}
                        rows={8}
                        value={editingTemplate.body}
                        onChange={(e) => setEditingTemplate({...editingTemplate, body: e.target.value})}
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={async () => {
                            await dbUpdate('templates', editingTemplate.id, editingTemplate);
                            setTemplates(templates.map(t => t.id === editingTemplate.id ? editingTemplate : t));
                            setSelectedTemplate(editingTemplate);
                            setEditingTemplate(null);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setEditingTemplate(null)}
                          className={`px-4 py-2 ${theme.bgMuted} ${theme.textMuted} rounded-lg`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className={`font-semibold ${theme.text}`}>{selectedTemplate.name}</h4>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setEditingTemplate(selectedTemplate)}
                            className={`p-2 ${theme.bgMuted} rounded-lg ${theme.textMuted} hover:text-cyan-400`}
                          >
                            <Icons.Edit />
                          </button>
                          <button 
                            onClick={() => confirmDelete('template', selectedTemplate, selectedTemplate.name)}
                            className={`p-2 ${theme.bgMuted} rounded-lg ${theme.textMuted} hover:text-rose-400`}
                          >
                            <Icons.Trash />
                          </button>
                        </div>
                      </div>
                      {selectedTemplate.category === 'Email' && selectedTemplate.subject && (
                        <div className={`mb-3 p-3 ${theme.bgMuted} rounded-lg`}>
                          <p className={`text-xs ${theme.textMuted} mb-1`}>Subject</p>
                          <p className={theme.text}>{selectedTemplate.subject}</p>
                        </div>
                      )}
                      <div className={`p-3 ${theme.bgMuted} rounded-lg mb-4`}>
                        <p className={`text-xs ${theme.textMuted} mb-1`}>Message</p>
                        <p className={`${theme.text} whitespace-pre-wrap text-sm`}>{selectedTemplate.body}</p>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(selectedTemplate.body)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700"
                      >
                        📋 Copy to Clipboard
                      </button>
                      <p className={`text-xs ${theme.textMuted} mt-2 text-center`}>
                        Replace [Name], [Property], [Neighborhood] with actual values after pasting
                      </p>
                    </div>
                  )
                ) : (
                  <div className={`h-full flex items-center justify-center ${theme.textMuted}`}>
                    <p>Select a template to preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      {showGlobalSearch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20" onClick={() => { setShowGlobalSearch(false); setGlobalSearchQuery(''); }}>
          <div className={`${theme.bgCard} w-full max-w-2xl rounded-xl shadow-2xl border ${theme.border} transition-colors duration-300`} onClick={e => e.stopPropagation()}>
            {/* Search Input */}
            <div className={`p-4 border-b ${theme.border} flex items-center gap-3`}>
              <Icons.Search />
              <input
                type="text"
                placeholder="Search contacts, deals, tasks, activities..."
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                autoFocus
                className={`flex-1 bg-transparent ${theme.text} placeholder-slate-400 focus:outline-none text-lg`}
              />
              <button onClick={() => { setShowGlobalSearch(false); setGlobalSearchQuery(''); }} className={`p-1 ${theme.textMuted} hover:${theme.text}`}>
                <Icons.X />
              </button>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {globalSearchQuery.trim() === '' ? (
                <div className={`p-8 text-center ${theme.textMuted}`}>
                  <p>Start typing to search across all your data</p>
                  <p className="text-sm mt-2">Search contacts, deals, tasks, and activities</p>
                </div>
              ) : totalSearchResults === 0 ? (
                <div className={`p-8 text-center ${theme.textMuted}`}>
                  <p>No results found for "{globalSearchQuery}"</p>
                </div>
              ) : (
                <div className="p-2">
                  {/* Contacts Results */}
                  {searchResults.contacts.length > 0 && (
                    <div className="mb-4">
                      <p className={`px-3 py-1 text-xs font-semibold ${theme.textMuted} uppercase`}>Contacts ({searchResults.contacts.length})</p>
                      {searchResults.contacts.slice(0, 5).map(contact => (
                        <button
                          key={contact.id}
                          onClick={() => { setActiveTab('contacts'); setShowGlobalSearch(false); setGlobalSearchQuery(''); }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${theme.bgCardHover} text-left`}
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 text-white flex items-center justify-center font-medium text-sm">
                            {contact.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium ${theme.text} truncate`}>{contact.name}</p>
                            <p className={`text-xs ${theme.textMuted} truncate`}>{contact.company} • {contact.type}</p>
                          </div>
                          <span className="text-cyan-500"><Icons.ChevronRight /></span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Deals Results */}
                  {searchResults.deals.length > 0 && (
                    <div className="mb-4">
                      <p className={`px-3 py-1 text-xs font-semibold ${theme.textMuted} uppercase`}>Deals ({searchResults.deals.length})</p>
                      {searchResults.deals.slice(0, 5).map(deal => (
                        <button
                          key={deal.id}
                          onClick={() => { setSelectedDeal(deal); setActiveTab('pipeline'); setShowGlobalSearch(false); setGlobalSearchQuery(''); }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${theme.bgCardHover} text-left`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                            🏠
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium ${theme.text} truncate`}>{deal.property}</p>
                            <p className={`text-xs ${theme.textMuted} truncate`}>{deal.neighborhood} • ${(deal.value/1e6).toFixed(1)}M • {deal.stage}</p>
                          </div>
                          <span className="text-cyan-500"><Icons.ChevronRight /></span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Tasks Results */}
                  {searchResults.tasks.length > 0 && (
                    <div className="mb-4">
                      <p className={`px-3 py-1 text-xs font-semibold ${theme.textMuted} uppercase`}>Tasks ({searchResults.tasks.length})</p>
                      {searchResults.tasks.slice(0, 5).map(task => (
                        <button
                          key={task.id}
                          onClick={() => { setActiveTab('tasks'); setShowGlobalSearch(false); setGlobalSearchQuery(''); }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${theme.bgCardHover} text-left`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${task.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {task.status === 'Completed' ? '✓' : '○'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium ${theme.text} truncate ${task.status === 'Completed' ? 'line-through opacity-50' : ''}`}>{task.title}</p>
                            <p className={`text-xs ${theme.textMuted} truncate`}>{task.dueDate} • {task.priority}</p>
                          </div>
                          <span className="text-cyan-500"><Icons.ChevronRight /></span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Activities Results */}
                  {searchResults.activities.length > 0 && (
                    <div className="mb-4">
                      <p className={`px-3 py-1 text-xs font-semibold ${theme.textMuted} uppercase`}>Activities ({searchResults.activities.length})</p>
                      {searchResults.activities.slice(0, 5).map(activity => (
                        <button
                          key={activity.id}
                          onClick={() => { setActiveTab('activities'); setShowGlobalSearch(false); setGlobalSearchQuery(''); }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${theme.bgCardHover} text-left`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                            {activity.type === 'Call' ? '📞' : activity.type === 'Email' ? '📧' : activity.type === 'Meeting' ? '🤝' : '🏠'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium ${theme.text} truncate`}>{activity.description}</p>
                            <p className={`text-xs ${theme.textMuted} truncate`}>{activity.contactName} • {activity.date}</p>
                          </div>
                          <span className="text-cyan-500"><Icons.ChevronRight /></span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`p-3 border-t ${theme.border} flex items-center justify-between text-xs ${theme.textMuted}`}>
              <span>Press <kbd className={`px-1.5 py-0.5 rounded ${theme.bgMuted}`}>Esc</kbd> to close</span>
              {totalSearchResults > 0 && <span>{totalSearchResults} result{totalSearchResults !== 1 ? 's' : ''}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Help Slide-over Panel */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={() => setShowHelp(false)}>
          <div className={`${theme.bgCard} w-full max-w-xl h-full overflow-y-auto transition-colors duration-300`} onClick={e => e.stopPropagation()}>
            {/* Help Header */}
            <div className={`sticky top-0 ${theme.bgCard} border-b ${theme.border} p-6 z-10`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white">
                    <Icons.HelpCircle />
                  </div>
                  <div>
                    <h2 className={`text-lg font-semibold ${theme.text}`}>Help & Documentation</h2>
                    <p className={theme.textMuted}>Learn how to use the Hub</p>
                  </div>
                </div>
                <button onClick={() => setShowHelp(false)} className={`p-2 ${theme.bgMuted} hover:bg-cyan-500/20 rounded-lg ${theme.textMuted}`}>
                  <Icons.X />
                </button>
              </div>

              {/* Help Navigation */}
              <div className="flex gap-1 mt-4 overflow-x-auto pb-1">
                {[
                  { id: 'getting-started', label: '🚀 Start' },
                  { id: 'overview', label: '📊 Overview' },
                  { id: 'calendar', label: '📅 Calendar' },
                  { id: 'deals', label: '💼 Deals' },
                  { id: 'contacts', label: '👥 Contacts' },
                  { id: 'properties', label: '🏠 Properties' },
                  { id: 'tasks', label: '✅ Tasks' },
                  { id: 'analytics', label: '📈 Analytics' },
                  { id: 'mastery', label: '🎓 Mastery' },
                  { id: 'tips', label: '💡 Tips' },
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setHelpSection(section.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      helpSection === section.id 
                        ? 'bg-cyan-500 text-white' 
                        : `${theme.bgMuted} ${theme.textMuted} hover:${theme.text}`
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Help Content */}
            <div className="p-6 space-y-6">
              
              {/* GETTING STARTED */}
              {helpSection === 'getting-started' && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-xl font-semibold ${theme.text} mb-3`}>🚀 Welcome to RE | Group Intelligence Hub</h3>
                    <p className={theme.textMuted}>
                      Your all-in-one command center for luxury real estate success. This hub helps you manage deals, nurture relationships, track activities, and master your target neighborhoods.
                    </p>
                  </div>

                  <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                    <h4 className={`font-semibold ${theme.text} mb-3`}>Quick Start Checklist</h4>
                    <div className="space-y-2">
                      {[
                        'Add your first contact in the Contacts tab',
                        'Create a deal and link it to contacts',
                        'Log your first activity (call, email, meeting)',
                        'Set up tasks with due dates',
                        'Start your Neighborhood Mastery training',
                        'Try the dark/light mode toggle ☀️🌙',
                        'Press Ctrl+K to try global search 🔍',
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-cyan-500">✓</span>
                          <span className={theme.text}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                    <h4 className={`font-semibold ${theme.text} mb-2`}>💾 Your Data is Saved</h4>
                    <p className={`${theme.textMuted} text-sm`}>
                      All your data is automatically saved to your browser. You can close this tab and come back anytime — your contacts, deals, tasks, and progress will still be here!
                    </p>
                  </div>

                  <div>
                    <h4 className={`font-semibold ${theme.text} mb-3`}>Navigation</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: '📊', name: 'Overview', desc: 'Dashboard & KPIs' },
                        { icon: '📅', name: 'Calendar', desc: 'Week/month view' },
                        { icon: '✅', name: 'Tasks', desc: 'To-dos & reminders' },
                        { icon: '📝', name: 'Activity', desc: 'Log interactions' },
                        { icon: '💼', name: 'Deals', desc: 'Pipeline management' },
                        { icon: '👥', name: 'Contacts', desc: 'CRM & relationships' },
                        { icon: '🏠', name: 'Properties', desc: 'Property database' },
                        { icon: '📈', name: 'Analytics', desc: 'Performance insights' },
                        { icon: '🎓', name: 'Mastery', desc: 'Training program' },
                      ].map((tab, i) => (
                        <div key={i} className={`${theme.bgMuted} rounded-lg p-3 border ${theme.border}`}>
                          <span className="text-xl">{tab.icon}</span>
                          <p className={`font-medium ${theme.text} mt-1`}>{tab.name}</p>
                          <p className={`text-xs ${theme.textMuted}`}>{tab.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* OVERVIEW HELP */}
              {helpSection === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-xl font-semibold ${theme.text} mb-3`}>📊 Overview Dashboard</h3>
                    <p className={theme.textMuted}>
                      Your daily command center showing key metrics, pipeline health, and activity trends at a glance.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>🎯 Goal Tracker</h4>
                      <p className={`${theme.textMuted} text-sm mb-2`}>
                        Track your progress toward annual and quarterly income goals:
                      </p>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li><strong className="text-emerald-400">Solid green:</strong> Closed income (realized)</li>
                        <li><strong className="text-emerald-400/50">Striped green:</strong> Pipeline income (projected)</li>
                        <li><strong className={theme.text}>Circle gauge:</strong> % of goal from closed deals</li>
                        <li>Click <strong className={theme.text}>Edit Goals</strong> to set your targets</li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>📧 Email & SMS Templates</h4>
                      <p className={`${theme.textMuted} text-sm mb-2`}>
                        Quick access to your message templates:
                      </p>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• Click <strong className={theme.text}>Templates</strong> in Quick Actions</li>
                        <li>• Browse, create, and edit templates</li>
                        <li>• Use placeholders: [Name], [Property], [Neighborhood]</li>
                        <li>• Copy to clipboard and paste into your email/SMS</li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>📈 Top Metrics</h4>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li><strong className={theme.text}>Pipeline Value:</strong> Total value of all active deals</li>
                        <li><strong className={theme.text}>Projected Commissions:</strong> Expected commission from deals</li>
                        <li><strong className={theme.text}>Pending Tasks:</strong> Tasks not yet completed</li>
                        <li><strong className={theme.text}>Active Deals:</strong> Number of deals in pipeline</li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>📊 Pipeline Funnel</h4>
                      <p className={`${theme.textMuted} text-sm`}>
                        Visual breakdown of deals by stage. The bar width shows deal value, the number shows deal count. Use this to identify bottlenecks in your pipeline.
                      </p>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>🎯 Weekly KPI Gauges</h4>
                      <p className={`${theme.textMuted} text-sm mb-2`}>
                        Track your weekly performance against targets:
                      </p>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li><strong className={theme.text}>Outreach:</strong> Calls, emails, texts sent (target: 100/week)</li>
                        <li><strong className={theme.text}>Conversations:</strong> Meaningful two-way exchanges (target: 10/week)</li>
                        <li><strong className={theme.text}>Meetings:</strong> In-person or video meetings (target: 5/week)</li>
                        <li><strong className={theme.text}>Opportunities:</strong> New deals created (target: 2/week)</li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>🏆 Top Deals Leaderboard</h4>
                      <p className={`${theme.textMuted} text-sm`}>
                        Your highest-value deals ranked by deal size. Gold, silver, and bronze indicators for top 3. Click "View All" to see full pipeline.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CALENDAR HELP */}
              {helpSection === 'calendar' && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-xl font-semibold ${theme.text} mb-3`}>📅 Calendar</h3>
                    <p className={theme.textMuted}>
                      View your tasks and activities organized by date in week or month format.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>📆 Week View</h4>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• See 7 days at a time (Sunday to Saturday)</li>
                        <li>• Tasks and activities displayed in each day column</li>
                        <li>• Today highlighted with cyan circle</li>
                        <li>• Click items to navigate to Tasks or Activity tab</li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>🗓️ Month View</h4>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• Full month grid with 6 weeks displayed</li>
                        <li>• Compact view shows up to 2 items per day</li>
                        <li>• "+N" indicator for additional items</li>
                        <li>• Previous/next month days shown in muted style</li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>🎨 Color Coding</h4>
                      <ul className={`space-y-1 text-sm`}>
                        <li className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-cyan-500/40"></span><span className={theme.text}>Tasks (normal priority)</span></li>
                        <li className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-rose-500/40"></span><span className={theme.text}>High priority tasks</span></li>
                        <li className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-violet-500/40"></span><span className={theme.text}>Activities (calls, meetings, etc.)</span></li>
                        <li className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-slate-500/40"></span><span className={theme.text}>Completed tasks</span></li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>🧭 Navigation</h4>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• <strong className={theme.text}>Week/Month toggle:</strong> Switch between views</li>
                        <li>• <strong className={theme.text}>← → arrows:</strong> Navigate to prev/next period</li>
                        <li>• <strong className={theme.text}>Today button:</strong> Jump back to current date</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* DEALS HELP */}
              {helpSection === 'deals' && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-xl font-semibold ${theme.text} mb-3`}>💼 Deals & Pipeline</h3>
                    <p className={theme.textMuted}>
                      Manage your deals through a visual Kanban board with 6 stages from Lead to Closed.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>🖱️ Drag & Drop</h4>
                      <p className={`${theme.textMuted} text-sm mb-2`}>
                        Easily move deals between stages:
                      </p>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• <strong className={theme.text}>Grab</strong> any deal card to start dragging</li>
                        <li>• <strong className={theme.text}>Drag</strong> to a different stage column</li>
                        <li>• <strong className={theme.text}>Drop</strong> to update the deal's stage</li>
                        <li>• Columns highlight cyan when you hover over them</li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>📋 Deal Stages</h4>
                      <div className="space-y-2 text-sm">
                        {[
                          { stage: 'Lead', desc: 'Initial inquiry or opportunity identified' },
                          { stage: 'Qualify', desc: 'Assessing fit, motivation, and timeline' },
                          { stage: 'Present', desc: 'Showing properties or presenting services' },
                          { stage: 'Negotiate', desc: 'Active negotiation on terms' },
                          { stage: 'Contract', desc: 'Under contract, pending close' },
                          { stage: 'Closed', desc: 'Deal completed! 🎉' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="font-semibold text-cyan-500 w-20">{item.stage}:</span>
                            <span className={theme.textMuted}>{item.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>🔗 Linking Contacts to Deals</h4>
                      <p className={`${theme.textMuted} text-sm mb-2`}>
                        Each deal can be linked to multiple contacts (buyers, sellers, attorneys, etc.). This creates a 360° view:
                      </p>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• See all contacts involved in a deal</li>
                        <li>• View all deals for a specific contact</li>
                        <li>• Activities & tasks auto-associate</li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>📱 Deal Detail Panel</h4>
                      <p className={`${theme.textMuted} text-sm mb-2`}>
                        Click any deal card to open the detail slide-over where you can:
                      </p>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• Change deal stage with one click</li>
                        <li>• View/edit deal value and projected commission</li>
                        <li>• See all linked contacts with quick-dial/email</li>
                        <li>• Review related activities and tasks</li>
                        <li>• Update the "Next Step" action item</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTACTS HELP */}
              {helpSection === 'contacts' && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-xl font-semibold ${theme.text} mb-3`}>👥 Contacts & CRM</h3>
                    <p className={theme.textMuted}>
                      Your relationship database. Track clients, prospects, and professional connections.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>🏷️ Contact Types</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {[
                          { type: 'Client', desc: 'Active client relationship' },
                          { type: 'Buyer', desc: 'Looking to purchase' },
                          { type: 'Seller', desc: 'Looking to sell' },
                          { type: 'Developer', desc: 'Development projects' },
                          { type: 'Investor', desc: 'Investment opportunities' },
                          { type: 'Referral', desc: 'Referral partner' },
                        ].map((item, i) => (
                          <div key={i} className={`${theme.bgCard} rounded-lg p-2 border ${theme.border}`}>
                            <span className={`font-medium ${theme.text}`}>{item.type}</span>
                            <p className={`text-xs ${theme.textMuted}`}>{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>👤 Contact Detail Panel</h4>
                      <p className={`${theme.textMuted} text-sm mb-2`}>
                        Click any contact row to open their full profile:
                      </p>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• Contact info with click-to-call/email</li>
                        <li>• All linked deals with values & stages</li>
                        <li>• Activity history timeline</li>
                        <li>• Related tasks with due dates</li>
                        <li>• Notes section for quick memos</li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>📝 Notes</h4>
                      <p className={`${theme.textMuted} text-sm`}>
                        Add timestamped notes to any contact. Great for recording preferences, conversation highlights, or follow-up reminders. Notes are searchable and persist with the contact record.
                      </p>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>🔍 Search & Filter</h4>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• <strong className={theme.text}>Search:</strong> Find by name, company, or email</li>
                        <li>• <strong className={theme.text}>Type filters:</strong> Click pills to filter by contact type</li>
                        <li>• <strong className={theme.text}>Deals column:</strong> See linked deals and total value</li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>📊 Contact Statuses</h4>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• <span className="text-emerald-400 font-medium">Active:</span> Regular communication, engaged</li>
                        <li>• <span className="text-amber-400 font-medium">Warm:</span> Periodic contact, potential opportunity</li>
                        <li>• <span className={theme.textMuted}>Cold:</span> No recent engagement</li>
                        <li>• <span className={theme.textFaint}>Inactive:</span> Archived or dormant</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* PROPERTIES HELP */}
              {helpSection === 'properties' && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-xl font-semibold ${theme.text} mb-3`}>🏠 Property Database</h3>
                    <p className={theme.textMuted}>
                      Track properties, manage listings, and link them to your deals.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>📋 Property Cards</h4>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• Visual cards with property photo placeholder</li>
                        <li>• Status badges (Active, Coming Soon, Research, Sold)</li>
                        <li>• Waterfront indicator 🌊</li>
                        <li>• Price, beds, baths, sqft at a glance</li>
                        <li>• Linked deal status shown on card</li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>🔍 Search & Filter</h4>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• Search by address or neighborhood</li>
                        <li>• Filter by status: Active, Coming Soon, Research, Sold</li>
                        <li>• Stats row shows totals and waterfront count</li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>📝 Property Details</h4>
                      <p className={`${theme.textMuted} text-sm mb-2`}>
                        Click any property to see full details:
                      </p>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• Address, neighborhood, price</li>
                        <li>• Beds, baths, sqft, lot size, year built</li>
                        <li>• Amenities: waterfront, pool, custom features</li>
                        <li>• Notes for your research</li>
                        <li>• Linked deal with quick navigation</li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>🔗 Deal Linking</h4>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• Link properties to existing deals</li>
                        <li>• Create new deal directly from property</li>
                        <li>• See deal stage on property card</li>
                        <li>• Navigate from property to deal detail</li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>🏷️ Property Statuses</h4>
                      <ul className={`space-y-1 text-sm`}>
                        <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-cyan-500"></span><span className={theme.text}>Research - Gathering info</span></li>
                        <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span><span className={theme.text}>Coming Soon - Not yet listed</span></li>
                        <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span><span className={theme.text}>Active - Currently on market</span></li>
                        <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-500"></span><span className={theme.text}>Sold - Transaction closed</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TASKS HELP */}
              {helpSection === 'tasks' && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-xl font-semibold ${theme.text} mb-3`}>✅ Tasks & Activities</h3>
                    <p className={theme.textMuted}>
                      Stay on top of your to-dos and log every client interaction for a complete history.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>📋 Tasks</h4>
                      <p className={`${theme.textMuted} text-sm mb-2`}>
                        Create tasks with:
                      </p>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• <strong className={theme.text}>Title:</strong> What needs to be done</li>
                        <li>• <strong className={theme.text}>Due date:</strong> When it's due</li>
                        <li>• <strong className={theme.text}>Priority:</strong> High, Medium, or Low</li>
                        <li>• <strong className={theme.text}>Contact:</strong> Optionally link to a contact</li>
                      </ul>
                      <p className={`${theme.textMuted} text-sm mt-2`}>
                        Click the circle to mark complete. Completed tasks show with strikethrough.
                      </p>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>🚦 Due Date Indicators</h4>
                      <p className={`${theme.textMuted} text-sm mb-2`}>
                        Tasks are color-coded by urgency:
                      </p>
                      <ul className={`space-y-1 text-sm`}>
                        <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-500"></span><span className={theme.text}>Red = Overdue</span></li>
                        <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span><span className={theme.text}>Amber = Due today</span></li>
                        <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-cyan-500"></span><span className={theme.text}>Cyan = Due tomorrow</span></li>
                        <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span><span className={theme.text}>Green = Upcoming (within 7 days)</span></li>
                      </ul>
                      <p className={`${theme.textMuted} text-sm mt-2`}>
                        Tasks are automatically sorted with pending tasks first, then by due date.
                      </p>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>📝 Activity Log</h4>
                      <p className={`${theme.textMuted} text-sm mb-2`}>
                        Log every interaction to build a complete client history:
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span>📞</span>
                          <span className={theme.text}>Calls</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📧</span>
                          <span className={theme.text}>Emails</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>🤝</span>
                          <span className={theme.text}>Meetings</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>🏠</span>
                          <span className={theme.text}>Showings</span>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>📈 Outcomes</h4>
                      <p className={`${theme.textMuted} text-sm`}>
                        Track the result of each activity: Positive, Neutral, No Answer, or Sent. This helps identify which contacts need follow-up.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ANALYTICS HELP */}
              {helpSection === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-xl font-semibold ${theme.text} mb-3`}>📈 Analytics Dashboard</h3>
                    <p className={theme.textMuted}>
                      Deep insights into your pipeline performance, activity trends, and conversion metrics.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>📊 Key Metrics</h4>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li><strong className={theme.text}>Conversion Rate:</strong> % of leads that become closed deals</li>
                        <li><strong className={theme.text}>Avg Deal Size:</strong> Average value of closed deals</li>
                        <li><strong className={theme.text}>Avg Commission Rate:</strong> Average commission percentage</li>
                        <li><strong className={theme.text}>Monthly Activities:</strong> Total logged activities this month</li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>📈 Charts & Visualizations</h4>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li><strong className={theme.text}>Pipeline by Stage:</strong> Deal count and value at each stage</li>
                        <li><strong className={theme.text}>Activity Breakdown:</strong> Call, Email, Meeting, Showing distribution</li>
                        <li><strong className={theme.text}>Pipeline by Deal Type:</strong> Buyer, Seller, Developer, Investor mix</li>
                        <li><strong className={theme.text}>Most Active Contacts:</strong> Top 5 contacts by activity volume</li>
                        <li><strong className={theme.text}>Weekly Activity Trend:</strong> 8-week activity history</li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>💡 Using Analytics</h4>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• Review weekly to spot trends and bottlenecks</li>
                        <li>• Compare activity levels week-over-week</li>
                        <li>• Identify which deal types perform best</li>
                        <li>• Focus on contacts with high engagement</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* MASTERY HELP */}
              {helpSection === 'mastery' && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-xl font-semibold ${theme.text} mb-3`}>🎓 Neighborhood Mastery</h3>
                    <p className={theme.textMuted}>
                      A 30-day training program to become the go-to expert in your target luxury neighborhoods.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>🎯 How It Works</h4>
                      <ol className={`space-y-2 ${theme.textMuted} text-sm list-decimal list-inside`}>
                        <li>Select a neighborhood to focus on</li>
                        <li>Complete daily habits each day</li>
                        <li>Tackle weekly deep-dive tasks</li>
                        <li>Take quizzes to test your knowledge</li>
                        <li>Track your progress toward mastery</li>
                      </ol>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>☀️ Daily Habits (5 tasks)</h4>
                      <p className={`${theme.textMuted} text-sm mb-2`}>
                        Quick daily actions to build expertise:
                      </p>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• Review active listings</li>
                        <li>• Analyze recent sales</li>
                        <li>• Drive the neighborhood</li>
                        <li>• Practice property descriptions</li>
                        <li>• Study one property in depth</li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>📅 Weekly Deep Dives (7 tasks)</h4>
                      <p className={`${theme.textMuted} text-sm`}>
                        One focused task per day: property history research, builder study, market analysis, dedicated tours, competitive analysis, presentation practice, and weekly quiz review.
                      </p>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>❓ Quizzes</h4>
                      <p className={`${theme.textMuted} text-sm mb-2`}>
                        Test your knowledge with multiple-choice questions about:
                      </p>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• Market statistics (price/sqft, DOM, inventory)</li>
                        <li>• Key builders and architects</li>
                        <li>• Neighborhood characteristics</li>
                        <li>• Schools and amenities</li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>⭐ Points & Streaks</h4>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• <strong className={theme.text}>Points:</strong> Earn points for completing habits, tasks, and quizzes</li>
                        <li>• <strong className={theme.text}>Streaks:</strong> Track consecutive days of activity</li>
                        <li>• <strong className={theme.text}>Progress:</strong> Watch your mastery percentage grow</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TIPS HELP */}
              {helpSection === 'tips' && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-xl font-semibold ${theme.text} mb-3`}>💡 Tips & Best Practices</h3>
                    <p className={theme.textMuted}>
                      Get the most out of your Intelligence Hub with these pro tips.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>🌅 Daily Workflow</h4>
                      <ol className={`space-y-2 ${theme.textMuted} text-sm list-decimal list-inside`}>
                        <li>Start on the Overview to check your KPIs</li>
                        <li>Review and complete pending tasks (check overdue items first!)</li>
                        <li>Log any activities from yesterday</li>
                        <li>Update deal stages as things progress</li>
                        <li>Complete your Mastery daily habits</li>
                      </ol>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>🔗 Keep Everything Connected</h4>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• Always link tasks to the relevant contact</li>
                        <li>• Link all parties to each deal</li>
                        <li>• Log activities right after they happen</li>
                        <li>• Use "Next Step" on deals to track momentum</li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>🎯 Pipeline Management</h4>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• Review pipeline funnel weekly for bottlenecks</li>
                        <li>• Move deals promptly through stages</li>
                        <li>• Don't let deals sit in "Negotiate" too long</li>
                        <li>• Celebrate closed deals! 🎉</li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>🎓 Mastery Success</h4>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• Focus on one neighborhood at a time</li>
                        <li>• Complete daily habits before anything else</li>
                        <li>• Take quizzes regularly to reinforce learning</li>
                        <li>• Use Market Data to prep for client meetings</li>
                        <li>• Aim for 80%+ on quizzes before moving on</li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>⌨️ Keyboard Shortcuts</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-slate-600' : 'bg-slate-200'} ${theme.text} text-xs font-mono`}>N</kbd>
                          <span className={theme.textMuted}>New Task</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-slate-600' : 'bg-slate-200'} ${theme.text} text-xs font-mono`}>D</kbd>
                          <span className={theme.textMuted}>New Deal</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-slate-600' : 'bg-slate-200'} ${theme.text} text-xs font-mono`}>C</kbd>
                          <span className={theme.textMuted}>New Contact</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-slate-600' : 'bg-slate-200'} ${theme.text} text-xs font-mono`}>A</kbd>
                          <span className={theme.textMuted}>Log Activity</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-slate-600' : 'bg-slate-200'} ${theme.text} text-xs font-mono`}>?</kbd>
                          <span className={theme.textMuted}>Open Help</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-slate-600' : 'bg-slate-200'} ${theme.text} text-xs font-mono`}>1-9</kbd>
                          <span className={theme.textMuted}>Switch Tabs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-slate-600' : 'bg-slate-200'} ${theme.text} text-xs font-mono`}>Ctrl+K</kbd>
                          <span className={theme.textMuted}>Global Search</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-slate-600' : 'bg-slate-200'} ${theme.text} text-xs font-mono`}>Esc</kbd>
                          <span className={theme.textMuted}>Close Modal</span>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>🔍 Global Search</h4>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• Press <kbd className={`px-1 py-0.5 rounded ${darkMode ? 'bg-slate-600' : 'bg-slate-200'} text-xs`}>Ctrl+K</kbd> or click 🔍 to search</li>
                        <li>• Search across contacts, deals, tasks & activities</li>
                        <li>• Click a result to navigate directly to it</li>
                        <li>• Results are grouped by type with counts</li>
                      </ul>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>💾 Data Persistence</h4>
                      <p className={`${theme.textMuted} text-sm`}>
                        All your data is automatically saved to your browser's local storage. Your contacts, deals, tasks, activities, quiz scores, and mastery progress will persist even if you close the browser or refresh the page.
                      </p>
                    </div>

                    <div className={`${theme.bgMuted} rounded-xl p-4 border ${theme.border}`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>📤 Export & Backup</h4>
                      <p className={`${theme.textMuted} text-sm mb-2`}>
                        Click the download icon in the header to access export options:
                      </p>
                      <ul className={`space-y-1 ${theme.textMuted} text-sm`}>
                        <li>• <strong className={theme.text}>Export All (JSON):</strong> Full backup of all data</li>
                        <li>• <strong className={theme.text}>Export Contacts (CSV):</strong> Spreadsheet-compatible contact list</li>
                        <li>• <strong className={theme.text}>Import Data:</strong> Restore from a JSON backup</li>
                      </ul>
                      <p className={`${theme.textMuted} text-sm mt-2`}>
                        💡 Tip: Create regular backups before making major changes!
                      </p>
                    </div>

                    <div className={`bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-xl p-4 border border-cyan-500/30`}>
                      <h4 className={`font-semibold ${theme.text} mb-2`}>💪 You've Got This!</h4>
                      <p className={`${theme.textMuted} text-sm`}>
                        Consistent daily use of this system will compound over time. Track your activities, nurture your relationships, and master your neighborhoods. The results will follow!
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={() => setConfirmDialog(null)}>
          <div className={`${theme.bgCard} rounded-xl w-full max-w-sm shadow-2xl`} onClick={e => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 flex items-center justify-center">
                <Icons.Trash />
              </div>
              <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>{confirmDialog.title}</h3>
              <p className={`${theme.textMuted} text-sm`}>{confirmDialog.message}</p>
            </div>
            <div className={`p-4 border-t ${theme.border} flex gap-3`}>
              <button 
                onClick={() => setConfirmDialog(null)}
                className={`flex-1 py-2.5 rounded-lg ${theme.bgMuted} ${theme.text} font-medium hover:bg-slate-600/50`}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDialog.onConfirm}
                className="flex-1 py-2.5 rounded-lg bg-rose-500 text-white font-medium hover:bg-rose-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[70] animate-slide-up`}>
          <div className={`${toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-rose-500' : 'bg-cyan-500'} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
            {toast.type === 'success' && <Icons.Check />}
            {toast.type === 'error' && <Icons.X />}
            <span className="font-medium">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 opacity-70 hover:opacity-100">
              <Icons.X />
            </button>
          </div>
        </div>
      )}

      {/* AI Assistant Floating Button */}
      <button
        onClick={() => setShowAssistant(!showAssistant)}
        className={`fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-500/30 flex items-center justify-center hover:scale-110 transition-transform ${showAssistant ? 'ring-4 ring-violet-500/30' : ''}`}
      >
        {showAssistant ? <Icons.X /> : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8V4H8"/>
            <rect x="8" y="8" width="8" height="12" rx="2"/>
            <path d="M12 8a4 4 0 0 0-4-4"/>
            <path d="M12 8a4 4 0 0 1 4-4"/>
            <circle cx="10" cy="13" r="1"/>
            <circle cx="14" cy="13" r="1"/>
            <path d="M10 17h4"/>
          </svg>
        )}
      </button>

      {/* AI Assistant Panel */}
      {showAssistant && (
        <div className={`fixed bottom-24 left-6 z-40 w-96 max-w-[calc(100vw-3rem)] ${theme.bgCard} rounded-2xl shadow-2xl border ${theme.border} flex flex-col overflow-hidden`} style={{ height: '500px', maxHeight: 'calc(100vh - 8rem)' }}>
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-violet-500 to-cyan-500 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8V4H8"/>
                  <rect x="8" y="8" width="8" height="12" rx="2"/>
                  <path d="M12 8a4 4 0 0 0-4-4"/>
                  <path d="M12 8a4 4 0 0 1 4-4"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-white/70">Powered by Claude</p>
              </div>
            </div>
            <button onClick={() => setShowAssistant(false)} className="p-1 hover:bg-white/20 rounded">
              <Icons.X />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {assistantMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white' 
                    : `${theme.bgMuted} ${theme.text}`
                }`}>
                  <div className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ 
                    __html: msg.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br/>')
                      .replace(/• /g, '&bull; ')
                  }} />
                </div>
              </div>
            ))}
            {assistantLoading && (
              <div className="flex justify-start">
                <div className={`${theme.bgMuted} rounded-2xl px-4 py-3`}>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className={`px-4 py-2 border-t ${theme.border} flex gap-2 overflow-x-auto`}>
            {[
              { label: '📊 Pipeline review', prompt: 'Give me a quick review of my pipeline. What should I focus on?' },
              { label: '📞 Who to call', prompt: 'Who should I follow up with today? Prioritize by importance.' },
              { label: '✉️ Draft email', prompt: 'Help me draft a follow-up email for my most important deal.' },
              { label: '🎯 Today\'s plan', prompt: 'Help me plan my day based on my tasks and pipeline.' },
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => sendToAssistant(action.prompt)}
                disabled={assistantLoading}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${theme.bgMuted} ${theme.text} hover:bg-violet-500/20 hover:text-violet-400 transition-colors disabled:opacity-50`}
              >
                {action.label}
              </button>
            ))}
          </div>
          
          {/* Input */}
          <div className={`p-4 border-t ${theme.border}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={assistantInput}
                onChange={(e) => setAssistantInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendToAssistant()}
                placeholder="Ask me anything..."
                disabled={assistantLoading}
                className={`flex-1 px-4 py-2.5 ${theme.bgInput} border ${theme.border} rounded-xl ${theme.text} placeholder-slate-400 focus:outline-none focus:border-violet-400 disabled:opacity-50`}
              />
              <button
                onClick={sendToAssistant}
                disabled={assistantLoading || !assistantInput.trim()}
                className="px-4 py-2.5 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Tour */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/70 z-[80] flex items-center justify-center p-4">
          <div className={`${theme.bgCard} rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden`}>
            {/* Progress Bar */}
            <div className="h-1 bg-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-300"
                style={{ width: `${((onboardingStep + 1) / 6) * 100}%` }}
              />
            </div>
            
            {/* Content */}
            <div className="p-8">
              {onboardingStep === 0 && (
                <div className="text-center">
                  <div className="text-6xl mb-4">👋</div>
                  <h2 className={`text-2xl font-bold ${theme.text} mb-3`}>Welcome to RE | Group Hub!</h2>
                  <p className={theme.textMuted}>Your personal command center for luxury real estate success. Let's take a quick tour.</p>
                </div>
              )}
              
              {onboardingStep === 1 && (
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <h2 className={`text-2xl font-bold ${theme.text} mb-3`}>Your Dashboard</h2>
                  <p className={theme.textMuted}>Track your pipeline, KPIs, and goals at a glance. Set income targets and watch your progress with visual thermometers.</p>
                </div>
              )}
              
              {onboardingStep === 2 && (
                <div className="text-center">
                  <div className="text-6xl mb-4">💼</div>
                  <h2 className={`text-2xl font-bold ${theme.text} mb-3`}>Manage Deals</h2>
                  <p className={theme.textMuted}>Drag and drop deals through stages: Lead → Qualify → Present → Negotiate → Contract → Closed. Link contacts and properties to each deal.</p>
                </div>
              )}
              
              {onboardingStep === 3 && (
                <div className="text-center">
                  <div className="text-6xl mb-4">⌨️</div>
                  <h2 className={`text-2xl font-bold ${theme.text} mb-3`}>Keyboard Shortcuts</h2>
                  <div className={`${theme.bgMuted} rounded-xl p-4 mt-4 text-left`}>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><kbd className="px-2 py-1 rounded bg-slate-600 text-white">N</kbd> <span className={theme.textMuted}>New Task</span></div>
                      <div><kbd className="px-2 py-1 rounded bg-slate-600 text-white">D</kbd> <span className={theme.textMuted}>New Deal</span></div>
                      <div><kbd className="px-2 py-1 rounded bg-slate-600 text-white">C</kbd> <span className={theme.textMuted}>New Contact</span></div>
                      <div><kbd className="px-2 py-1 rounded bg-slate-600 text-white">A</kbd> <span className={theme.textMuted}>Log Activity</span></div>
                      <div><kbd className="px-2 py-1 rounded bg-slate-600 text-white">?</kbd> <span className={theme.textMuted}>Help</span></div>
                      <div><kbd className="px-2 py-1 rounded bg-slate-600 text-white">1-9</kbd> <span className={theme.textMuted}>Switch Tabs</span></div>
                    </div>
                  </div>
                </div>
              )}
              
              {onboardingStep === 4 && (
                <div className="text-center">
                  <div className="text-6xl mb-4">🤖</div>
                  <h2 className={`text-2xl font-bold ${theme.text} mb-3`}>AI Assistant</h2>
                  <p className={theme.textMuted}>Click the purple button in the bottom-left corner to chat with your AI assistant. Get help with:</p>
                  <div className={`${theme.bgMuted} rounded-xl p-4 mt-4 text-left`}>
                    <ul className={`space-y-2 text-sm ${theme.textMuted}`}>
                      <li>• <strong className={theme.text}>Pipeline reviews</strong> - strategic advice on your deals</li>
                      <li>• <strong className={theme.text}>Follow-up suggestions</strong> - who to contact today</li>
                      <li>• <strong className={theme.text}>Email drafting</strong> - professional outreach</li>
                      <li>• <strong className={theme.text}>Daily planning</strong> - prioritize your tasks</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {onboardingStep === 5 && (
                <div className="text-center">
                  <div className="text-6xl mb-4">🚀</div>
                  <h2 className={`text-2xl font-bold ${theme.text} mb-3`}>You're All Set!</h2>
                  <p className={theme.textMuted}>Your data saves automatically to your browser. Export backups anytime from the download icon. Now go close some deals!</p>
                </div>
              )}
            </div>
            
            {/* Navigation */}
            <div className={`p-6 border-t ${theme.border} flex justify-between items-center`}>
              <button 
                onClick={() => {
                  localStorage.setItem('regroup_onboarding_seen', 'true');
                  setShowOnboarding(false);
                }}
                className={`${theme.textMuted} hover:${theme.text}`}
              >
                Skip Tour
              </button>
              <div className="flex gap-2">
                {onboardingStep > 0 && (
                  <button 
                    onClick={() => setOnboardingStep(onboardingStep - 1)}
                    className={`px-4 py-2 ${theme.bgMuted} rounded-lg ${theme.text}`}
                  >
                    Back
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (onboardingStep < 5) {
                      setOnboardingStep(onboardingStep + 1);
                    } else {
                      localStorage.setItem('regroup_onboarding_seen', 'true');
                      setShowOnboarding(false);
                    }
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-lg font-medium"
                >
                  {onboardingStep < 5 ? 'Next' : 'Get Started'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

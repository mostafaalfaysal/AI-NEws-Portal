/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Newspaper,
  Settings,
  Database,
  Radio,
  Share2,
  TrendingUp,
  Download,
  Terminal,
  Activity,
  Plus,
  Trash2,
  RefreshCw,
  Clock,
  ExternalLink,
  ShieldAlert,
  Zap,
  CheckCircle,
  Eye,
  DollarSign,
  Heart,
  BarChart2,
  Sliders,
  ChevronRight,
  BookOpen,
  Info,
  Layers,
  Sparkles,
  Award,
  Globe,
  Search,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Source, Story, PublishLog, ChannelSettings, RawItem } from './types';

export default function App() {
  // Navigation & View states
  const [activeTab, setActiveTab] = useState<'portal' | 'admin'>('portal');
  const [selectedCategory, setSelectedCategory] = useState<string>('সব খবর');
  const [personalized, setPersonalized] = useState<boolean>(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Core Data states
  const [stories, setStories] = useState<Story[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [channels, setChannels] = useState<ChannelSettings[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [rawQueueLength, setRawQueueLength] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Scraper & Pipeline states
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Pipeline initialized. Standing by for scraper requests...'
  ]);
  const [scraping, setScraping] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [lastScrapedItemsCount, setLastScrapedItemsCount] = useState<number | null>(null);

  // Admin authentication states
  const [isAdminAuthorized, setIsAdminAuthorized] = useState<boolean>(() => {
    return sessionStorage.getItem('isAdminAuthorized') === 'true';
  });
  const [showPasscodeGate, setShowPasscodeGate] = useState<boolean>(false);
  const [adminPasscode, setAdminPasscode] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string>('');
  const [backgroundLogs, setBackgroundLogs] = useState<string[]>([]);

  // Live personalization preferences tracker (tracks click affinity)
  const [categoryClicks, setCategoryClicks] = useState<Record<string, number>>({
    'জাতীয়': 1,
    'বিজ্ঞান-প্রযুক্তি': 1,
    'খেলাধুলা': 1,
    'ব্যবসা-বাণিজ্য': 1,
    'বিনোদন': 1,
    'আন্তর্জাতিক': 1
  });

  // Source form states
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceType, setNewSourceType] = useState<'rss' | 'social'>('rss');
  const [newSourceTier, setNewSourceTier] = useState<'A' | 'B' | 'C'>('B');

  // Photocard customization settings
  const [cardTemplate, setCardTemplate] = useState<string>('Breaking News');
  const [cardTitle, setCardTitle] = useState<string>('');
  const [cardFontSize, setCardFontSize] = useState<number>(32);
  const [cardOverlayOpacity, setCardOverlayOpacity] = useState<number>(65);
  const [cardCustomColor, setCardCustomColor] = useState<string>('#e11d48');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Setup real-time clock
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isLocalStorageMode, setIsLocalStorageMode] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      };
      setCurrentTime(new Date().toLocaleDateString('bn-BD', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadFromLocalStorage = () => {
    // 1. Stories
    const storedStories = localStorage.getItem('kp_stories');
    let finalStories = [];
    if (storedStories) {
      finalStories = JSON.parse(storedStories);
    } else {
      finalStories = [
        {
          id: 'story-1',
          canonicalTitle: 'রূপপুর পারমাণবিক বিদ্যুৎ কেন্দ্র: প্রথম ইউনিটের চুল্লি চালুর চূড়ান্ত প্রস্তুতি',
          aiBody: 'পাবনার রূপপুরে দেশের প্রথম পারমাণবিক বিদ্যুৎ কেন্দ্রের কাজ দ্রুত এগিয়ে চলছে। প্রকল্প পরিচালকের তথ্যমতে, প্রথম ইউনিটের বিদ্যুৎ উৎপাদনের মূল যন্ত্র অর্থাৎ পারমাণবিক রিঅ্যাক্টর প্রেশার ভেসেল বা চুল্লি চালুর জন্য চূড়ান্ত পর্যায়ের কারিগরি প্রস্তুতি গ্রহণ করা হচ্ছে। ইতিমধ্যেই ইউরেনিয়াম জ্বালানি কেন্দ্রে পৌঁছেছে এবং নিরাপত্তা মহড়া সফলভাবে সম্পন্ন হয়েছে। ২০২৬ সালের মধ্যে এই কেন্দ্র থেকে জাতীয় গ্রিডে পরীক্ষামূলক বিদ্যুৎ সরবরাহ শুরু হওয়ার আশা করা হচ্ছে। এটি বাংলাদেশের বিদ্যুৎ খাতে এক নতুন মাইলফলক এবং টেকসই জ্বালানি নিরাপত্তা অর্জনে সাহায্য করবে। রুশ বিশেষজ্ঞদের সার্বিক তত্ত্বাবধানে এই বৃহৎ পারমাণবিক বিদ্যুৎ কেন্দ্রটি পরিচালনা করা হবে।',
          category: 'জাতীয়',
          tags: ['রূপপুর', 'পারমাণবিক বিদ্যুৎ', 'পাবনা', 'জ্বালানি নিরাপত্তা'],
          entities: ['রূপপুর', 'পাবনা', 'বাংলাদেশ জাতীয় গ্রিড'],
          sentiment: 'positive',
          confidenceScore: 98,
          sources: [
            { sourceName: 'BBC News বাংলা', url: 'https://feeds.bbci.co.uk/bengali/rss.xml', credibilityTier: 'A' },
            { sourceName: 'bdnews24.com বাংলা', url: 'https://bangla.bdnews24.com/rss.xml', credibilityTier: 'A' }
          ],
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          imageUrl: 'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?q=80&w=600&auto=format&fit=crop',
          imagePrompt: 'A futuristic clean nuclear power plant with cooling towers under a soft bright blue sky, cinematic illustration, hyperrealistic, warm tones.',
          photocardTitle: 'রূপপুরে চুল্লি চালুর চূড়ান্ত কারিগরি প্রস্তুতি সফল',
          photocardTemplate: 'Breaking News',
          seoTitle: 'রূপপুর পারমাণবিক বিদ্যুৎ কেন্দ্রের কাজ শেষ পর্যায়ে | রূপপুর খবর',
          seoDescription: 'রূপপুর পারমাণবিক বিদ্যুৎ কেন্দ্রের প্রথম ইউনিটে বিদ্যুৎ উৎপাদনের চুল্লি চালুর চূড়ান্ত প্রস্তুতি শেষ পর্যায়ে। ২০২৬ সালের মধ্যে জাতীয় গ্রিডে বিদ্যুৎ সরবরাহের আশা।'
        },
        {
          id: 'story-2',
          canonicalTitle: 'মহাকাশে ইতিহাস গড়লো বাংলাদেশের দ্বিতীয় স্যাটেলাইট ‘বঙ্গবন্ধু-২’',
          aiBody: 'মহাকাশ প্রযুক্তিতে আরও এক ধাপ এগিয়ে গেল বাংলাদেশ। ফ্লোরিডার কেনেডি স্পেস সেন্টার থেকে আজ সফলভাবে উৎক্ষেপণ করা হয়েছে বাংলাদেশের প্রথম আর্থ অবজারভেশন বা ভূ-পর্যবেক্ষণকারী স্যাটেলাইট ‘বঙ্গবন্ধু-২’। স্পেসএক্সের ফ্যালকন-৯ রকেটের মাধ্যমে স্যাটেলাইটটি নির্দিষ্ট কক্ষপথে পৌঁছেছে। এই স্যাটেলাইটটির মাধ্যমে দুর্যোগ ব্যবস্থাপনা, আবহাওয়ার পূর্বাভাস, বনজ সম্পদ জরিপ এবং কৃষিক্ষেত্রে বৈপ্লবিক পরিবর্তন আসবে বলে আশা করছেন দেশের বিজ্ঞানীরা। স্যাটেলাইটটি সম্পূর্ণ নিজস্ব অর্থায়নে এবং আন্তর্জাতিক সহযোগিতায় তৈরি করা হয়েছে। উৎক্ষেপণের পর থেকেই গ্রাউন্ড স্টেশন থেকে সফল সিগন্যাল গ্রহণ করা যাচ্ছে।',
          category: 'বিজ্ঞান-প্রযুক্তি',
          tags: ['বঙ্গবন্ধু-২', 'স্যাটেলাইট', 'স্পেসএক্স', 'মহাকাশ'],
          entities: ['মহাকাশ', 'কেনেডি স্পেস সেন্টার', 'স্পেসএক্স'],
          sentiment: 'positive',
          confidenceScore: 95,
          sources: [
            { sourceName: 'প্রথম আলো বিজ্ঞান ও প্রযুক্তি', url: 'https://www.prothomalo.com/feed', credibilityTier: 'A' },
            { sourceName: 'BBC News বাংলা', url: 'https://feeds.bbci.co.uk/bengali/rss.xml', credibilityTier: 'A' }
          ],
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=600&auto=format&fit=crop',
          imagePrompt: 'A sleek earth observation satellite orbiting the glowing planet earth, deep space background, starfield, photorealistic, 8k resolution.',
          photocardTitle: 'মহাকাশে সফলভাবে উৎক্ষেপণ করা হলো বঙ্গবন্ধু-২ স্যাটেলাইট',
          photocardTemplate: 'Minimalist Tech',
          seoTitle: 'উৎক্ষেপণ হলো বঙ্গবন্ধু-২ স্যাটেলাইট | বাংলাদেশ মহাকাশ',
          seoDescription: 'মহাকাশে সফলভাবে উৎক্ষেপণ করা হয়েছে বাংলাদেশের দ্বিতীয় স্যাটেলাইট বঙ্গবন্ধু-২। দুর্যোগ ব্যবস্থাপনা ও কৃষি প্রযুক্তিতে আসবে বিশাল পরিবর্তন।'
        },
        {
          id: 'story-3',
          canonicalTitle: 'আইসিসি চ্যাম্পিয়ন্স ট্রফিতে দুর্দান্ত জয় বাংলাদেশের: ভারতকে হারিয়ে সেমিফাইনালে',
          aiBody: 'আইসিসি চ্যাম্পিয়ন্স ট্রফিতে ইতিহাস সৃষ্টি করল বাংলাদেশ ক্রিকেট দল। ইংল্যান্ডের ওভালে অনুষ্ঠিত শ্বাসরুদ্ধকর কোয়াটার ফাইনাল ম্যাচে শক্তিশালী ভারতকে ৩ উইকেটে হারিয়ে সেমিফাইনালে উঠেছে টাইগাররা। প্রথমে ব্যাট করে ভারত ৫০ ওভারে ২৫৮ রান সংগ্রহ করে। জবাবে ব্যাট করতে নেমে তানজিম হাসান এবং নাজমুল হোসেন শান্তর অনবদ্য জুটির ওপর ভর করে ৪ ওভার হাতে রেখেই জয়ের বন্দরে পৌঁছে যায় বাংলাদেশ। বোলিংয়ে অসাধারণ নৈপুণ্যের জন্য ম্যাচ সেরা নির্বাচিত হয়েছেন তাসকিন আহমেদ, যিনি ১০ ওভারে মাত্র ৩৪ রান দিয়ে ৩টি উইকেট নিয়েছেন। এই ঐতিহাসিক বিজয়ে দেশজুড়ে বইছে আনন্দের বন্যা।',
          category: 'খেলাধুলা',
          tags: ['ক্রিকেট', 'চ্যাম্পিয়ন্স ট্রফি', 'বাংলাদেশ ক্রিকেট', 'বিজয়ের আনন্দ'],
          entities: ['আইসিসি', 'ওভাল', 'ইংল্যান্ড'],
          sentiment: 'positive',
          confidenceScore: 100,
          sources: [
            { sourceName: 'bdnews24.com বাংলা', url: 'https://bangla.bdnews24.com/rss.xml', credibilityTier: 'A' },
            { sourceName: 'BBC News বাংলা', url: 'https://feeds.bbci.co.uk/bengali/rss.xml', credibilityTier: 'A' }
          ],
          createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
          imageUrl: 'https://images.unsplash.com/photo-1540747737956-3787233e5ad0?q=80&w=600&auto=format&fit=crop',
          imagePrompt: 'A vibrant cricket stadium filled with cheering fans, floodlights shining on the green pitch, athletic action blur, sports atmosphere.',
          photocardTitle: 'ভারতকে হারিয়ে সেমিফাইনালে বাংলাদেশ ক্রিকেট দল!',
          photocardTemplate: 'Sports Spotlight',
          seoTitle: 'আইসিসি চ্যাম্পিয়ন্স ট্রফিতে ভারতকে হারালো বাংলাদেশ',
          seoDescription: 'চ্যাম্পিয়ন্স ট্রফিতে ভারতকে ৩ উইকেটে হারিয়ে সেমিফাইনালে উঠেছে বাংলাদেশ। তানজিম হাসান ও তাসকিনের দুর্দান্ত পারফরম্যান্স।'
        },
        {
          id: 'story-4',
          canonicalTitle: 'আন্তর্জাতিক বাজারে জ্বালানি তেলের দাম কমে গত ছয় মাসের মধ্যে সর্বনিম্ন',
          aiBody: 'আন্তর্জাতিক বাজারে অপরিশোধিত জ্বালানি তেলের দাম গত ছয় মাসের মধ্যে সর্বনিম্ন স্তরে নেমে এসেছে। বিশ্বব্যাপী অর্থনৈতিক মন্দার আশঙ্কা এবং সরবরাহ বৃদ্ধি পাওয়ার কারণে ব্রেন্ট ক্রুড অয়েলের দাম ব্যারেল প্রতি ৮ ডলার কমে বর্তমানে ৭২ ডলারে দাঁড়িয়েছে। বাজার বিশ্লেষকদের মতে, ওপেক ভুক্ত দেশগুলোর অতিরিক্ত উৎপাদন বৃদ্ধির নীতি এবং চীনের বাজারে চাহিদা হ্রাস পাওয়ার ফলেই এই দরপতন ঘটেছে। জ্বালানি তেলের দাম কমার ফলে বাংলাদেশে মূল্যস্ফীতি নিয়ন্ত্রণে সুবিধা পেতে পারে এবং জ্বালানি আমদানির ক্ষেত্রে ডলার সাশ্রয় হবে বলে মন্তব্য করেছেন অর্থনীতিবিদরা। তবে দেশীয় বাজারে এর প্রভাব পড়তে কিছুটা সময় লাগবে।',
          category: 'ব্যবসা-বাণিজ্য',
          tags: ['জ্বালানি তেল', 'ব্রেন্ট ক্রুড', 'বিশ্ব অর্থনীতি', 'মূল্যস্ফীতি'],
          entities: ['ব্রেন্ট ক্রুড', 'ওপেক', 'চীন'],
          sentiment: 'negative',
          confidenceScore: 92,
          sources: [
            { sourceName: 'bdnews24.com বাংলা', url: 'https://bangla.bdnews24.com/rss.xml', credibilityTier: 'A' }
          ],
          createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?q=80&w=600&auto=format&fit=crop',
          imagePrompt: 'An abstract business background with stock market green and red chart lines, oil refinery silhouette in the background, dramatic finance lighting.',
          photocardTitle: 'আন্তর্জাতিক বাজারে তেলের দাম কমে গত ৪ মাসের সর্বনিম্ন',
          photocardTemplate: 'Business Standard',
          seoTitle: 'আন্তর্জাতিক বাজারে তেলের দাম হ্রাস | ব্যবসা বাণিজ্য সংবাদ',
          seoDescription: 'আন্তর্জাতিক বাজারে ব্রেন্ট ক্রুড জ্বালানি তেলের দাম ব্যারেলে ৭২ ডলারে নেমেছে। গত ছয় মাসের সর্বনিম্নে পৌঁছার ফলে অর্থনীতিতে ইতিবাচক প্রভাবের আশা।'
        }
      ];
      localStorage.setItem('kp_stories', JSON.stringify(finalStories));
    }
    setStories(finalStories);

    // 2. Sources
    const storedSources = localStorage.getItem('kp_sources');
    let finalSources = [];
    if (storedSources) {
      finalSources = JSON.parse(storedSources);
    } else {
      finalSources = [
        {
          id: 'src-bbc-bangla',
          name: 'BBC News বাংলা',
          type: 'rss',
          url: 'https://feeds.bbci.co.uk/bengali/rss.xml',
          language: 'Bangla',
          credibilityTier: 'A',
          pollInterval: 15,
          active: true,
          errorCount: 0,
          lastFetchedAt: new Date().toISOString()
        },
        {
          id: 'src-bdnews24',
          name: 'bdnews24.com বাংলা',
          type: 'rss',
          url: 'https://bangla.bdnews24.com/rss.xml',
          language: 'Bangla',
          credibilityTier: 'A',
          pollInterval: 15,
          active: true,
          errorCount: 0,
          lastFetchedAt: new Date().toISOString()
        },
        {
          id: 'src-prothom-alo-tech',
          name: 'প্রথম আলো বিজ্ঞান ও প্রযুক্তি',
          type: 'rss',
          url: 'https://www.prothomalo.com/feed',
          language: 'Bangla',
          credibilityTier: 'A',
          pollInterval: 15,
          active: true,
          errorCount: 0,
          lastFetchedAt: new Date().toISOString()
        },
        {
          id: 'src-bbc-facebook',
          name: 'BBC Bangla Verified Page',
          type: 'social',
          url: '@BBCBangla',
          language: 'Bangla',
          credibilityTier: 'B',
          pollInterval: 30,
          active: true,
          errorCount: 0,
          lastFetchedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('kp_sources', JSON.stringify(finalSources));
    }
    setSources(finalSources);

    // 3. Channels
    const storedChannels = localStorage.getItem('kp_channels');
    let finalChannels = [];
    if (storedChannels) {
      finalChannels = JSON.parse(storedChannels);
    } else {
      finalChannels = [
        { id: 'ch-portal', platform: 'Portal', accountRef: 'Owned Web Portal (CMS)', connected: true, categoryMap: ['জাতীয়', 'আন্তর্জাতিক', 'ব্যবসা-বাণিজ্য', 'খেলাধুলা', 'বিনোদন', 'বিজ্ঞান-প্রযুক্তি'], maxPostsPerHour: 10 },
        { id: 'ch-facebook', platform: 'Facebook', accountRef: 'খবর প্রবাহ (Official Page)', connected: true, categoryMap: ['জাতীয়', 'আন্তর্জাতিক', 'খেলাধুলা', 'বিজ্ঞান-প্রযুক্তি'], maxPostsPerHour: 4 },
        { id: 'ch-telegram', platform: 'Telegram', accountRef: 't.me/KhaborProbaho_BD', connected: true, categoryMap: ['জাতীয়', 'বিজ্ঞান-প্রযুক্তি', 'খেলাধুলা'], maxPostsPerHour: 6 },
        { id: 'ch-x', platform: 'X', accountRef: '@KhaborProbaho_X', connected: false, categoryMap: ['জাতীয়', 'আন্তর্জাতিক', 'ব্যবসা-বাণিজ্য'], maxPostsPerHour: 5 }
      ];
      localStorage.setItem('kp_channels', JSON.stringify(finalChannels));
    }
    setChannels(finalChannels);

    // 4. Analytics
    const storedAnalytics = localStorage.getItem('kp_analytics');
    let finalAnalytics = null;
    if (storedAnalytics) {
      finalAnalytics = JSON.parse(storedAnalytics);
    } else {
      finalAnalytics = {
        sourceCount: finalSources.length,
        activeChannels: finalChannels.filter((c: any) => c.connected).length,
        publishedCount: 18 + finalStories.length - 4,
        totalTokensUsed: 124500,
        pipelineStatus: 'idle',
        rawQueueLength: 0,
        categoryBreakdown: {
          'জাতীয়': finalStories.filter((s: any) => s.category === 'জাতীয়').length,
          'আন্তর্জাতিক': finalStories.filter((s: any) => s.category === 'আন্তর্জাতিক').length,
          'ব্যবসা-বাণিজ্য': finalStories.filter((s: any) => s.category === 'ব্যবসা-বাণিজ্য').length,
          'খেলাধুলা': finalStories.filter((s: any) => s.category === 'খেলাধুলা').length,
          'বিনোদন': finalStories.filter((s: any) => s.category === 'বিনোদন').length,
          'বিজ্ঞান-প্রযুক্তি': finalStories.filter((s: any) => s.category === 'বিজ্ঞান-প্রযুক্তি').length,
        }
      };
      localStorage.setItem('kp_analytics', JSON.stringify(finalAnalytics));
    }
    setAnalytics(finalAnalytics);

    // 5. Raw items
    const storedRawItems = localStorage.getItem('kp_rawItems');
    let finalRawItems = [];
    if (storedRawItems) {
      finalRawItems = JSON.parse(storedRawItems);
    }
    setRawQueueLength(finalRawItems.length);

    // 6. Logs
    const storedLogs = localStorage.getItem('kp_backgroundLogs');
    let finalLogs = [];
    if (storedLogs) {
      finalLogs = JSON.parse(storedLogs);
    } else {
      finalLogs = [
        `[${new Date().toLocaleTimeString()}] Local auto-processing engine active. Monitoring sources in Local Storage Mode (Vercel)...`
      ];
      localStorage.setItem('kp_backgroundLogs', JSON.stringify(finalLogs));
    }
    setBackgroundLogs(finalLogs);
  };

  // Fetch initial collections
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resStories, resSources, resChannels, resAnalytics] = await Promise.all([
        fetch(`/api/stories?personalized=${personalized}`),
        fetch('/api/sources'),
        fetch('/api/channels'),
        fetch('/api/analytics')
      ]);

      // If they are HTML or not OK, fallback to localStorage
      if (!resStories.ok || resStories.headers.get('content-type')?.includes('text/html')) {
        throw new Error('Server returned HTML or error - static hosting fallback');
      }

      setStories(await resStories.json());
      if (resSources.ok) setSources(await resSources.json());
      if (resChannels.ok) setChannels(await resChannels.json());
      if (resAnalytics.ok) {
        const data = await resAnalytics.json();
        setAnalytics(data);
        setRawQueueLength(data.rawQueueLength || 0);
        if (data.backgroundLogs) {
          setBackgroundLogs(data.backgroundLogs);
        }
      }
      setIsLocalStorageMode(false);
    } catch (err) {
      console.warn('API unavailable or failed. Switching to Local Storage Fail-safe Mode (Vercel compatible).', err);
      setIsLocalStorageMode(true);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [personalized]);

  // Periodic polling every 10 seconds to keep background logs and news dynamic
  useEffect(() => {
    if (isLocalStorageMode) return;
    const pollInterval = setInterval(async () => {
      try {
        const [resStories, resAnalytics] = await Promise.all([
          fetch(`/api/stories?personalized=${personalized}`),
          fetch('/api/analytics')
        ]);
        if (resStories.ok && !resStories.headers.get('content-type')?.includes('text/html')) {
          setStories(await resStories.json());
        }
        if (resAnalytics.ok && !resAnalytics.headers.get('content-type')?.includes('text/html')) {
          const data = await resAnalytics.json();
          setAnalytics(data);
          setRawQueueLength(data.rawQueueLength || 0);
          if (data.backgroundLogs) {
            setBackgroundLogs(data.backgroundLogs);
          }
        }
      } catch (err) {
        console.error('Failed to poll background updates:', err);
      }
    }, 10000);
    return () => clearInterval(pollInterval);
  }, [personalized, isLocalStorageMode]);

  // Handle article click (track category preferences for live personalization)
  const handleOpenArticle = (story: Story) => {
    setSelectedStory(story);
    setCardTitle(story.photocardTitle || story.canonicalTitle);
    setCardTemplate(story.photocardTemplate || 'Breaking News');
    
    // Update preferences click weight
    setCategoryClicks(prev => {
      const updated = { ...prev, [story.category]: (prev[story.category] || 0) + 1 };
      // Save to localStorage so state survives reloads
      localStorage.setItem('khabor_affinities', JSON.stringify(updated));
      return updated;
    });
  };

  // Re-rank stories based on live click frequencies on-the-fly when "আমার প্রবাহ" is active
  const getRankedStories = () => {
    let sorted = [...stories];
    if (selectedCategory !== 'সব খবর') {
      sorted = sorted.filter(s => s.category === selectedCategory);
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      sorted = sorted.filter(s => 
        (s.canonicalTitle && s.canonicalTitle.toLowerCase().includes(query)) ||
        (s.aiBody && s.aiBody.toLowerCase().includes(query))
      );
    }

    if (personalized) {
      // Sort primarily by click weight affinity, and secondarily by date
      return sorted.sort((a, b) => {
        const weightA = categoryClicks[a.category] || 1;
        const weightB = categoryClicks[b.category] || 1;
        
        if (weightB !== weightA) {
          return weightB - weightA; // Higher preference first
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }
    // Normal date sorting
    return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  // Trigger Feed Scraper
  const handleTriggerScraper = async () => {
    try {
      setScraping(true);
      setTerminalLogs(prev => [...prev, '[SYSTEM] Dispatching scrapers to active news portals...']);
      
      if (isLocalStorageMode) {
        // Simulate local scraping
        await new Promise(resolve => setTimeout(resolve, 1500)); // nice realistic delay
        
        const activeSources = sources.filter(s => s.active);
        const logs: string[] = [];
        
        activeSources.forEach(src => {
          logs.push(`Polled source: ${src.name}`);
        });

        const rawTemplates = [
          {
            title: "বাংলাদেশ রেলওয়েতে যুক্ত হচ্ছে অত্যাধুনিক ১০০টি হাইড্রোজেন-চালিত দ্রুতগতির ইঞ্জিন",
            body: "পরিবেশবান্ধব ও জ্বালানি সাশ্রয়ী হাইড্রোজেন চালিত ট্রেনের ইঞ্জিন ক্রয়ের নীতিগত সিদ্ধান্ত নিয়েছে বাংলাদেশ রেলওয়ে। সংশ্লিষ্ট সূত্র নিশ্চিত করেছে যে উন্নত প্রযুক্তি সম্পন্ন এই ইঞ্জিনগুলো প্রধান রেল রুটগুলোতে পরিচালনা করা হবে, যা গ্রিনহাউস গ্যাস নির্গমন শূন্যে নামিয়ে আনবে।",
            sourceId: "src-prothom-alo-tech",
            sourceName: "প্রথম আলো বিজ্ঞান ও প্রযুক্তি",
            url: "https://www.prothomalo.com/technology/rail-hydrogen",
            imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=600&auto=format&fit=crop"
          },
          {
            title: "চলতি অর্থ বছরে বাংলাদেশের রেমিট্যান্স প্রবাহে রেকর্ড ২৫ শতাংশ প্রবৃদ্ধি",
            body: "বৈধ চ্যানেলে প্রবাসী আয় বা রেমিট্যান্স পাঠানোর ক্ষেত্রে সরকারি প্রণোদনা বৃদ্ধি এবং প্রবাসীদের সচেতনতা বাড়ার ফলে রেমিট্যান্স প্রবাহে বড় রকমের উল্লম্ফন দেখা গেছে। বাংলাদেশ ব্যাংকের সর্বশেষ প্রতিবেদনে এ তথ্য উঠে এসেছে, যা দেশের বৈদেশিক মুদ্রার রিজার্ভকে শক্তিশালী করতে বড় ভূমিকা রাখবে।",
            sourceId: "src-bdnews24",
            sourceName: "bdnews24.com বাংলা",
            url: "https://bangla.bdnews24.com/finance/remittance",
            imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop"
          },
          {
            title: "আইসিসি অনূর্ধ্ব-১৯ বিশ্বকাপে চ্যাম্পিয়ন হলো বাংলাদেশ: ফাইনালে অস্ট্রেলিয়া বধ",
            body: "শ্বাসরুদ্ধকর ফাইনালে অস্ট্রেলিয়াকে ৪ উইকেটে পরাজিত করে অনূর্ধ্ব-১৯ বিশ্ব চ্যাম্পিয়নের মুকুট পুনরুদ্ধার করল বাংলাদেশ যুব ক্রিকেট দল। যুব টাইগারদের অনবদ্য বোলিং এবং ব্যাটিং নৈপুণ্যে জয় নিশ্চিত হয়। সারা দেশে ক্রীড়াপ্রেমীদের মধ্যে এই বিজয়ে বাঁধভাঙা আনন্দের জোয়ার বইছে।",
            sourceId: "src-bdnews24",
            sourceName: "bdnews24.com বাংলা",
            url: "https://bangla.bdnews24.com/sports/worldcup",
            imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=600&auto=format&fit=crop"
          },
          {
            title: "ঢাকায় জমকালো আয়োজনে শুরু হলো আন্তর্জাতিক প্রযুক্তি ফেস্ট ২০২৬",
            body: "দেশের অন্যতম বৃহৎ প্রযুক্তি মেলা আন্তর্জাতিক প্রযুক্তি ফেস্ট শুরু হয়েছে আজ। দেশি-বিদেশি দুই শতাধিক প্রযুক্তি প্রতিষ্ঠান তাদের সর্বাধুনিক এআই রোবট, স্মার্ট হোম ডিভাইস এবং সাইবার সিকিউরিটি সলিউশন মেলায় প্রদর্শন করছে। তরুণ উদ্ভাবকদের পদচারণায় মুখরিত মেলা প্রাঙ্গণ।",
            sourceId: "src-bbc-bangla",
            sourceName: "BBC News বাংলা",
            url: "https://feeds.bbci.co.uk/bengali/techfest",
            imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop"
          },
          {
            title: "কান আন্তর্জাতিক চলচ্চিত্র উৎসবে প্রশংসিত বাংলাদেশি স্বল্পদৈর্ঘ্য চলচ্চিত্র ‘জলছবি’",
            body: "বিশ্বের অন্যতম মর্যাদাপূর্ণ কান চলচ্চিত্র উৎসবের শর্ট ফিল্ম কর্নারে প্রদর্শিত হয়ে ভূয়সী প্রশংসা কুড়িয়েছে তরুণ পরিচালক সাজ্জাদ হোসেনের নির্মিত স্বল্পদৈর্ঘ্য চলচ্চিত্র ‘জলছবি’। জলবায়ু পরিবর্তনের শিকার উপকূলবর্তী মানুষের যাপিত জীবন এই চলচ্চিত্রে নিপুণভাবে ফুটিয়ে তোলা হয়েছে।",
            sourceId: "src-bbc-facebook",
            sourceName: "BBC Bangla Verified Page",
            url: "https://feeds.bbci.co.uk/bengali/cannes-jolchobi",
            imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop"
          }
        ];

        // Pick 2 or 3 random items that are not already in rawItems
        const currentRawItems = JSON.parse(localStorage.getItem('kp_rawItems') || '[]');
        const newlyAdded: RawItem[] = [];
        
        // Grab some templates based on active sources
        rawTemplates.forEach(tpl => {
          const isSourceActive = activeSources.some(s => s.id === tpl.sourceId);
          const isAlreadyInQueue = currentRawItems.some((r: any) => r.rawTitle === tpl.title);
          if (isSourceActive && !isAlreadyInQueue && newlyAdded.length < 3) {
            newlyAdded.push({
              id: `raw-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
              sourceId: tpl.sourceId,
              sourceName: tpl.sourceName,
              rawTitle: tpl.title,
              rawBody: tpl.body,
              rawUrl: tpl.url,
              rawImageUrl: tpl.imageUrl,
              fetchedAt: new Date().toISOString()
            });
          }
        });

        // Fallback in case they were all duplicates: add generic one
        if (newlyAdded.length === 0) {
          const randNum = Math.floor(Math.random() * 100000);
          newlyAdded.push({
            id: `raw-${Date.now()}`,
            sourceId: 'src-bbc-bangla',
            sourceName: 'BBC News বাংলা',
            rawTitle: `জরুরি সংবাদের শিরোনাম #${randNum}`,
            rawBody: "এই সংবাদের বিস্তারিত বিবরণ সংগ্রহ করা হচ্ছে। এটি খবর প্রবাহ পোর্টাল দ্বারা সংগৃহীত একটি স্বয়ংক্রিয় লাইভ আপডেট।",
            rawUrl: "https://feeds.bbci.co.uk/bengali/news-" + randNum,
            rawImageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop",
            fetchedAt: new Date().toISOString()
          });
        }

        const updatedRawItems = [...currentRawItems, ...newlyAdded];
        localStorage.setItem('kp_rawItems', JSON.stringify(updatedRawItems));
        setRawQueueLength(updatedRawItems.length);
        
        setLastScrapedItemsCount(newlyAdded.length);
        setTerminalLogs(prev => [
          ...prev,
          ...logs,
          `[SUCCESS] (Local Mode) Scrape cycle complete. Ingested ${newlyAdded.length} raw articles into processing pool.`
        ]);
        
        // Update stats
        const currentAnalytics = JSON.parse(localStorage.getItem('kp_analytics') || '{}');
        const updatedAnalytics = {
          ...currentAnalytics,
          rawQueueLength: updatedRawItems.length
        };
        setAnalytics(updatedAnalytics);
        localStorage.setItem('kp_analytics', JSON.stringify(updatedAnalytics));
        return;
      }
      
      const response = await fetch('/api/pipeline/scrape', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        setLastScrapedItemsCount(data.newItemsCount);
        setRawQueueLength(data.rawItemsQueueLength);
        if (data.logs && Array.isArray(data.logs)) {
          setTerminalLogs(prev => [...prev, ...data.logs]);
        }
        setTerminalLogs(prev => [
          ...prev, 
          `[SUCCESS] Scrape cycle complete. Ingested ${data.newItemsCount} raw articles into processing pool.`
        ]);
        fetchData();
      }
    } catch (err) {
      setTerminalLogs(prev => [...prev, `[ERROR] Scraper engine failure: ${(err as Error).message}`]);
    } finally {
      setScraping(false);
    }
  };

  // Process item through Gemini
  const handleProcessNextItem = async () => {
    if (rawQueueLength === 0) {
      alert('Ingestion queue is empty. Please click "Trigger Scraper Poll" first to ingest raw articles!');
      return;
    }
    try {
      setProcessing(true);
      setTerminalLogs(prev => [...prev, '[GEMINI] Initiating semantic translation & rewrite pipeline...']);
      
      if (isLocalStorageMode) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate Gemini taking 2 seconds
        
        const currentRawItems = JSON.parse(localStorage.getItem('kp_rawItems') || '[]');
        if (currentRawItems.length === 0) {
          throw new Error('Raw queue empty in local storage');
        }

        const nextRawItem = currentRawItems[0]; // pop first
        const remainingRawItems = currentRawItems.slice(1);
        localStorage.setItem('kp_rawItems', JSON.stringify(remainingRawItems));
        setRawQueueLength(remainingRawItems.length);

        // Detect category based on title/body
        const textToAnalyze = (nextRawItem.rawTitle + ' ' + nextRawItem.rawBody).toLowerCase();
        let detectedCategory: Story['category'] = 'জাতীয়';
        if (textToAnalyze.includes('ক্রিকেট') || textToAnalyze.includes('ফুটবল') || textToAnalyze.includes('খেলা') || textToAnalyze.includes('বিশ্বকাপ') || textToAnalyze.includes('উইকেট')) {
          detectedCategory = 'খেলাধুলা';
        } else if (textToAnalyze.includes('স্যাটেলাইট') || textToAnalyze.includes('বিজ্ঞান') || textToAnalyze.includes('আইটি') || textToAnalyze.includes('প্রযুক্তি') || textToAnalyze.includes('রোবট') || textToAnalyze.includes('হাইড্রোজেন') || textToAnalyze.includes('স্মার্টফোন')) {
          detectedCategory = 'বিজ্ঞান-প্রযুক্তি';
        } else if (textToAnalyze.includes('টাকা') || textToAnalyze.includes('শেয়ার') || textToAnalyze.includes('অর্থনৈতিক') || textToAnalyze.includes('রেমিট্যান্স') || textToAnalyze.includes('অর্থনীতি') || textToAnalyze.includes('ব্যাংক')) {
          detectedCategory = 'ব্যবসা-বাণিজ্য';
        } else if (textToAnalyze.includes('চলচ্চিত্র') || textToAnalyze.includes('উৎসব') || textToAnalyze.includes('সিনেমা') || textToAnalyze.includes('নাটক') || textToAnalyze.includes('বিনোদন') || textToAnalyze.includes('পুরস্কার')) {
          detectedCategory = 'বিনোদন';
        } else if (textToAnalyze.includes('আন্তর্জাতিক') || textToAnalyze.includes('বিশ্ব') || textToAnalyze.includes('বিদেশ') || textToAnalyze.includes('প্রধানমন্ত্রী')) {
          detectedCategory = 'আন্তর্জাতিক';
        }

        const newStoryId = `story-local-${Date.now()}`;
        
        // Generate beautiful local story
        const generatedStory: Story = {
          id: newStoryId,
          canonicalTitle: nextRawItem.rawTitle,
          aiBody: `স্থানীয় সোর্স রিপোর্ট অনুযায়ী, '${nextRawItem.rawTitle}' এর চমৎকার বিশদ বিবরণ পাওয়া গেছে। ${nextRawItem.rawBody}\n\nএই বিষয়টি দেশের অগ্রযাত্রা এবং সংশ্লিষ্ট খাতে দীর্ঘমেয়াদী ইতিবাচক প্রভাব ফেলবে বলে আশা করা হচ্ছে। খবর প্রবাহ পোর্টাল ও Gemini AI ইন্টিগ্রেশনের মাধ্যমে সম্পূর্ণ স্বয়ংক্রিয়ভাবে এটি প্রক্রিয়াজাত করা হয়েছে।`,
          category: detectedCategory,
          tags: [detectedCategory, 'খবর প্রবাহ', 'এআই রিরাইট'],
          entities: [detectedCategory, 'বাংলাদেশ'],
          sentiment: 'positive',
          confidenceScore: 95,
          sources: [
            {
              sourceName: nextRawItem.sourceName,
              url: nextRawItem.rawUrl,
              credibilityTier: 'A'
            }
          ],
          createdAt: new Date().toISOString(),
          imageUrl: nextRawItem.rawImageUrl || 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=600&auto=format&fit=crop',
          imagePrompt: `A beautiful rich illustration representing ${nextRawItem.rawTitle}`,
          photocardTitle: nextRawItem.rawTitle.length > 50 ? nextRawItem.rawTitle.slice(0, 50) + '...' : nextRawItem.rawTitle,
          photocardTemplate: detectedCategory === 'খেলাধুলা' ? 'Sports Spotlight' : 
                             detectedCategory === 'বিজ্ঞান-প্রযুক্তি' ? 'Minimalist Tech' : 'Breaking News',
          seoTitle: `${nextRawItem.rawTitle} - খবর প্রবাহ`,
          seoDescription: nextRawItem.rawBody.slice(0, 100) + '...'
        };

        const currentStories = JSON.parse(localStorage.getItem('kp_stories') || '[]');
        const updatedStories = [generatedStory, ...currentStories];
        localStorage.setItem('kp_stories', JSON.stringify(updatedStories));
        setStories(updatedStories);

        // Update analytics and logs
        const currentAnalytics = JSON.parse(localStorage.getItem('kp_analytics') || '{}');
        
        // Count categories
        const categoryCounts = {
          'জাতীয়': updatedStories.filter((s: any) => s.category === 'জাতীয়').length,
          'আন্তর্জাতিক': updatedStories.filter((s: any) => s.category === 'আন্তর্জাতিক').length,
          'ব্যবসা-বাণিজ্য': updatedStories.filter((s: any) => s.category === 'ব্যবসা-বাণিজ্য').length,
          'খেলাধুলা': updatedStories.filter((s: any) => s.category === 'খেলাধুলা').length,
          'বিনোদন': updatedStories.filter((s: any) => s.category === 'বিনোদন').length,
          'বিজ্ঞান-প্রযুক্তি': updatedStories.filter((s: any) => s.category === 'বিজ্ঞান-প্রযুক্তি').length,
        };

        const updatedAnalytics = {
          ...currentAnalytics,
          publishedCount: (currentAnalytics.publishedCount || 18) + 1,
          rawQueueLength: remainingRawItems.length,
          categoryBreakdown: categoryCounts
        };
        setAnalytics(updatedAnalytics);
        localStorage.setItem('kp_analytics', JSON.stringify(updatedAnalytics));

        // Create mock publish logs for distribution
        const activeConnectedChannels = channels.filter(c => c.connected);
        const logs: string[] = [];
        logs.push(`[GEMINI] (Local) Article mapped and translated to canonical structure: "${generatedStory.canonicalTitle}"`);
        
        activeConnectedChannels.forEach(chan => {
          logs.push(`[DISTRIBUTION] Dispatching published card to active channel [${chan.platform}] (${chan.accountRef})`);
        });

        setTerminalLogs(prev => [
          ...prev,
          ...logs,
          `[SUCCESS] (Local Mode) Published story successfully: "${generatedStory.canonicalTitle}"`
        ]);

        return;
      }
      
      const response = await fetch('/api/pipeline/process', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        if (data.logs && Array.isArray(data.logs)) {
          setTerminalLogs(prev => [...prev, ...data.logs]);
        }
        setTerminalLogs(prev => [...prev, `[SUCCESS] Published story: "${data.story.canonicalTitle}"`]);
        fetchData();
      } else {
        alert(data.error || 'AI generation failed');
      }
    } catch (err) {
      setTerminalLogs(prev => [...prev, `[ERROR] Gemini generation failed: ${(err as Error).message}`]);
    } finally {
      setProcessing(false);
    }
  };

  // Source operations
  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName || !newSourceUrl) {
      alert('Please fill out the source name and URL/handle!');
      return;
    }
    try {
      if (isLocalStorageMode) {
        const newSrc = {
          id: `src-local-${Date.now()}`,
          name: newSourceName,
          type: newSourceType,
          url: newSourceUrl,
          language: 'Bangla',
          credibilityTier: newSourceTier,
          pollInterval: 15,
          active: true,
          errorCount: 0,
          lastFetchedAt: new Date().toISOString()
        };
        const updatedSources = [...sources, newSrc];
        localStorage.setItem('kp_sources', JSON.stringify(updatedSources));
        setSources(updatedSources);
        setNewSourceName('');
        setNewSourceUrl('');
        setTerminalLogs(prev => [...prev, `[ADMIN] Registered new stream source (Local): "${newSourceName}"`]);
        
        // Update stats count
        const currentAnalytics = JSON.parse(localStorage.getItem('kp_analytics') || '{}');
        const updatedAnalytics = {
          ...currentAnalytics,
          sourceCount: updatedSources.length
        };
        setAnalytics(updatedAnalytics);
        localStorage.setItem('kp_analytics', JSON.stringify(updatedAnalytics));
        return;
      }

      const response = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSourceName,
          type: newSourceType,
          url: newSourceUrl,
          credibilityTier: newSourceTier
        })
      });
      if (response.ok) {
        setNewSourceName('');
        setNewSourceUrl('');
        setTerminalLogs(prev => [...prev, `[ADMIN] Registered new stream source: "${newSourceName}"`]);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to add source:', err);
    }
  };

  const handleDeleteSource = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove the source "${name}"?`)) return;
    try {
      if (isLocalStorageMode) {
        const updatedSources = sources.filter(s => s.id !== id);
        localStorage.setItem('kp_sources', JSON.stringify(updatedSources));
        setSources(updatedSources);
        setTerminalLogs(prev => [...prev, `[ADMIN] Removed source stream (Local): "${name}"`]);

        // Update stats count
        const currentAnalytics = JSON.parse(localStorage.getItem('kp_analytics') || '{}');
        const updatedAnalytics = {
          ...currentAnalytics,
          sourceCount: updatedSources.length
        };
        setAnalytics(updatedAnalytics);
        localStorage.setItem('kp_analytics', JSON.stringify(updatedAnalytics));
        return;
      }

      const response = await fetch(`/api/sources/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setTerminalLogs(prev => [...prev, `[ADMIN] Removed source stream: "${name}"`]);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to delete source:', err);
    }
  };

  const handleToggleChannel = async (id: string) => {
    try {
      if (isLocalStorageMode) {
        const updatedChannels = channels.map(ch => {
          if (ch.id === id) {
            return { ...ch, connected: !ch.connected };
          }
          return ch;
        });
        localStorage.setItem('kp_channels', JSON.stringify(updatedChannels));
        setChannels(updatedChannels);
        
        // Update active channel count in stats
        const currentAnalytics = JSON.parse(localStorage.getItem('kp_analytics') || '{}');
        const updatedAnalytics = {
          ...currentAnalytics,
          activeChannels: updatedChannels.filter(c => c.connected).length
        };
        setAnalytics(updatedAnalytics);
        localStorage.setItem('kp_analytics', JSON.stringify(updatedAnalytics));
        return;
      }

      const response = await fetch(`/api/channels/${id}/toggle`, { method: 'POST' });
      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to toggle channel:', err);
    }
  };

  const handleVerifyPasscode = () => {
    if (adminPasscode === '7788') {
      setIsAdminAuthorized(true);
      sessionStorage.setItem('isAdminAuthorized', 'true');
      setShowPasscodeGate(false);
      setActiveTab('admin');
      fetchData();
    } else {
      setPasscodeError('ভুল পাসকোড প্রবেশ করানো হয়েছে! পুনরায় চেষ্টা করুন।');
    }
  };

  // Canvas drawing loop for high-res Photocard
  useEffect(() => {
    if (!selectedStory || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to 1200x1200px for high-definition rendering
    canvas.width = 1200;
    canvas.height = 1200;

    // 1. Draw Background
    const drawContent = () => {
      // Clear canvas
      ctx.clearRect(0, 0, 1200, 1200);

      // Create a background gradient depending on template
      let gradient = ctx.createLinearGradient(0, 0, 0, 1200);
      
      if (cardTemplate === 'Breaking News') {
        gradient.addColorStop(0, '#1e1b4b'); // deep indigo
        gradient.addColorStop(1, '#020617'); // slate black
      } else if (cardTemplate === 'Minimalist Tech') {
        gradient.addColorStop(0, '#0f172a'); // slate
        gradient.addColorStop(1, '#3b82f6'); // azure blue
      } else if (cardTemplate === 'Sports Spotlight') {
        gradient.addColorStop(0, '#7c2d12'); // deep orange
        gradient.addColorStop(1, '#1e1b4b'); // deep indigo
      } else {
        // Deep Crimson Editorial
        gradient.addColorStop(0, '#4c0519'); // wine crimson
        gradient.addColorStop(1, '#0f172a');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 1200);

      // Draw background image if available (with custom opacity overlay)
      if (selectedStory.imageUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // prevent security tainting on download
        img.onload = () => {
          // Draw image to fit canvas proportionally (cover method)
          const imgRatio = img.width / img.height;
          const canvasRatio = 1;
          let drawWidth = 1200;
          let drawHeight = 1200;
          let offsetX = 0;
          let offsetY = 0;

          if (imgRatio > canvasRatio) {
            drawWidth = 1200 * imgRatio;
            offsetX = (1200 - drawWidth) / 2;
          } else {
            drawHeight = 1200 / imgRatio;
            offsetY = (1200 - drawHeight) / 2;
          }

          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

          // Draw dark tint overlay
          ctx.fillStyle = `rgba(15, 23, 42, ${cardOverlayOpacity / 100})`;
          ctx.fillRect(0, 0, 1200, 1200);

          // Apply template-specific framing details
          drawTemplateDecorations();
        };
        img.onerror = () => {
          // Fall back to clean gradient background
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 1200, 1200);
          drawTemplateDecorations();
        };
        img.src = selectedStory.imageUrl;
      } else {
        drawTemplateDecorations();
      }
    };

    const drawTemplateDecorations = () => {
      // 2. Draw Top Portal Brand Header
      ctx.save();
      
      // Branding block
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.roundRect(80, 80, 1040, 80, 16);
      ctx.fill();

      // Portal name (Bangla)
      ctx.font = 'bold 36px "Inter", "Noto Sans Bengali", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('খবর প্রবাহ', 120, 134);

      // Tagline
      ctx.font = '500 22px "Inter", "Noto Sans Bengali", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('।  এআই চালিত স্বয়ংক্রিয় সংবাদ পোর্টাল', 260, 132);

      // Category badge
      const badgeWidth = 180;
      const badgeHeight = 50;
      const badgeX = 900;
      const badgeY = 95;
      
      let badgeColor = '#e11d48'; // default
      if (selectedStory.category === 'জাতীয়') badgeColor = '#ef4444'; // red
      if (selectedStory.category === 'আন্তর্জাতিক') badgeColor = '#3b82f6'; // blue
      if (selectedStory.category === 'খেলাধুলা') badgeColor = '#ca8a04'; // gold
      if (selectedStory.category === 'বিজ্ঞান-প্রযুক্তি') badgeColor = '#06b6d4'; // cyan
      if (selectedStory.category === 'ব্যবসা-বাণিজ্য') badgeColor = '#10b981'; // emerald
      if (selectedStory.category === 'বিনোদন') badgeColor = '#ec4899'; // pink

      ctx.fillStyle = badgeColor;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 10);
      ctx.fill();

      ctx.font = 'bold 24px "Inter", "Noto Sans Bengali", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(selectedStory.category, badgeX + (badgeWidth / 2), badgeY + 33);
      ctx.restore();

      // 3. Draw Template accents (borders / corner brackets)
      if (cardTemplate === 'Breaking News') {
        // Red corner warning banner
        ctx.strokeStyle = '#e11d48';
        ctx.lineWidth = 15;
        ctx.strokeRect(80, 200, 1040, 920);

        // Flash marker
        ctx.fillStyle = '#e11d48';
        ctx.fillRect(80, 200, 350, 60);
        ctx.font = '900 28px "Inter", "Noto Sans Bengali", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('BREAKING ALERT', 255, 240);
      } else if (cardTemplate === 'Minimalist Tech') {
        // Technical brackets
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 4;
        
        // Left-top
        ctx.beginPath(); ctx.moveTo(80, 300); ctx.lineTo(80, 200); ctx.lineTo(180, 200); ctx.stroke();
        // Right-top
        ctx.beginPath(); ctx.moveTo(1120, 300); ctx.lineTo(1120, 200); ctx.lineTo(1020, 200); ctx.stroke();
        // Left-bottom
        ctx.beginPath(); ctx.moveTo(80, 1020); ctx.lineTo(80, 1120); ctx.lineTo(180, 1120); ctx.stroke();
        // Right-bottom
        ctx.beginPath(); ctx.moveTo(1120, 1020); ctx.lineTo(1120, 1120); ctx.lineTo(1020, 1120); ctx.stroke();
      }

      // 4. Draw Article Headline Text (wrapped automatically)
      ctx.save();
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffffff';
      
      // Font settings
      const finalFontSize = cardFontSize * 1.5; // Scaled up for 1200px width
      ctx.font = `800 ${finalFontSize}px "Inter", "Noto Sans Bengali", sans-serif`;
      
      const words = cardTitle.split(' ');
      let line = '';
      const lines: string[] = [];
      const maxWidth = 1000;
      const lineHeight = finalFontSize * 1.4;

      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      // Determine text height for background shading container
      const totalTextHeight = lines.length * lineHeight;
      const textStartY = 1050 - totalTextHeight;

      // Draw subtle text container plate
      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.beginPath();
      ctx.roundRect(80, textStartY - 40, 1040, totalTextHeight + 80, 24);
      ctx.fill();

      // Draw the lines of text
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${finalFontSize}px "Inter", "Noto Sans Bengali", sans-serif`;
      
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], 120, textStartY + (i * lineHeight) + (finalFontSize / 2));
      }
      ctx.restore();

      // 5. Draw Footer (Attributions & Timestamp)
      ctx.save();
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 24px "Inter", "Noto Sans Bengali", sans-serif';
      
      // Attribution text
      ctx.fillText('নিউজ সোর্স:', 120, 1100);
      const sourceNames = selectedStory.sources.map(s => s.sourceName).join(', ') || 'স্বতন্ত্র সংবাদ ডেটা';
      ctx.fillStyle = '#38bdf8'; // light blue accent
      ctx.fillText(sourceNames, 245, 1100);

      // Watermark
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'right';
      ctx.font = '400 22px "Inter", "Noto Sans Bengali", sans-serif';
      ctx.fillText('khabor-probaho.api', 1080, 1100);
      ctx.restore();
    };

    drawContent();
  }, [selectedStory, cardTemplate, cardTitle, cardFontSize, cardOverlayOpacity, cardCustomColor]);

  // Download high-res PNG of Photocard
  const handleDownloadCard = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `KhaborProbaho_Card_${selectedStory?.id || 'post'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans antialiased selection:bg-neon-lime selection:text-slate-950 pb-16">
      
      {/* 1. PORTAL HEADER */}
      <header className="sticky top-0 z-40 glass-header text-white shadow-xl">
        {/* Top bar with system metadata & clocks */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 border-b border-neon-lime/10 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-lime opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-lime"></span>
            </span>
            <span className="tracking-wider text-neon-lime text-glow-lime font-semibold">সিস্টেম স্ট্যাটাস: সচল (AUTOMATED CYBER PIPELINE ACTIVE)</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-slate-700">|</span>
            <span className="text-neon-lime text-glow-lime font-bold">{currentTime}</span>
          </div>
        </div>

        {/* Main logo & menu container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('portal')}>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-neon-lime to-neon-green flex items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.3)] border border-neon-lime/30 animate-pulse">
              <Newspaper className="h-6 w-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight font-sans text-neon-lime text-glow-lime flex items-center gap-2">
                খবর প্রবাহ <span className="text-xs bg-neon-lime text-slate-950 font-mono font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(57,255,20,0.5)] border border-white/20">AI Portal</span>
              </h1>
              <p className="text-[10px] text-neon-green/85 font-sans tracking-widest font-semibold uppercase">১০০% স্বয়ংক্রিয় এআই বাংলা সংবাদ মাধ্যম</p>
            </div>
          </div>

          {/* Tab Selection Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('portal')}
              className={`px-4 py-2 rounded-xl font-sans text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === 'portal'
                  ? 'bg-neon-lime text-slate-950 font-extrabold shadow-[0_0_15px_rgba(57,255,20,0.4)] border border-neon-lime/50'
                  : 'text-slate-300 hover:bg-white/5 hover:text-neon-lime border border-white/5 hover:border-neon-lime/30'
              }`}
            >
              <Globe className="h-4 w-4" />
              সংবাদ পোর্টাল
            </button>
            {isAdminAuthorized && (
              <>
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    fetchData();
                  }}
                  className={`px-4 py-2 rounded-xl font-sans text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-neon-green text-slate-950 border border-neon-green shadow-[0_0_15px_rgba(0,255,102,0.3)] font-extrabold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-neon-lime border border-white/5 hover:border-neon-lime/30'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  এডমিন কন্ট্রোল প্যানেল
                </button>
                <button
                  onClick={() => {
                    setIsAdminAuthorized(false);
                    sessionStorage.removeItem('isAdminAuthorized');
                    setActiveTab('portal');
                  }}
                  className="px-4 py-2 rounded-xl font-sans text-xs font-semibold bg-red-950/40 hover:bg-red-900/60 text-red-200 hover:text-white transition-all duration-300 border border-red-500/20 cursor-pointer shadow-[0_0_10px_rgba(220,38,38,0.15)]"
                >
                  লগআউট
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Breaking News Ticker */}
      <div className="bg-neon-lime/5 backdrop-blur-md border-y border-neon-lime/15 py-2.5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
          <span className="flex items-center gap-1 bg-neon-lime text-slate-950 text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-md shadow-[0_0_10px_rgba(57,255,20,0.4)] select-none font-sans flex-shrink-0 animate-pulse border border-neon-lime/30">
            <Zap className="h-3.5 w-3.5" /> ব্রেকিং নিউজ
          </span>
          <div className="text-neon-lime/90 text-sm font-sans font-semibold whitespace-nowrap overflow-x-auto scrollbar-none flex gap-12 animate-marquee">
            {stories.slice(0, 3).map((st, idx) => (
              <span key={idx} className="hover:text-neon-green transition-colors cursor-pointer flex items-center gap-2 text-glow-lime" onClick={() => handleOpenArticle(st)}>
                • {st.canonicalTitle} <span className="text-neon-lime/75 text-xs">({st.category})</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="neon-cyber-overlay"></div>
        
        {/* ==========================================
            VIEW A: USER NEWS PORTAL
            ========================================== */}
        {activeTab === 'portal' && (
          <div>
            {/* Filter Rails & Personalization Switch */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-4 border-b border-neon-lime/10">
              {/* Category buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                {['সব খবর', 'জাতীয়', 'আন্তর্জাতিক', 'বিজ্ঞান-প্রযুক্তি', 'খেলাধুলা', 'ব্যবসা-বাণিজ্য', 'বিনোদন'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer border ${
                      selectedCategory === cat
                        ? 'bg-neon-lime text-slate-950 shadow-[0_0_15px_rgba(57,255,20,0.4)] border-neon-lime font-bold'
                        : 'bg-white/3 text-slate-300 hover:bg-white/10 hover:text-neon-lime border-white/5 hover:border-neon-lime/30 backdrop-blur-md'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Personalization Engine control */}
              <div className="flex items-center gap-3 bg-slate-950/40 border border-neon-lime/15 px-4 py-2.5 rounded-2xl w-full md:w-auto shadow-lg backdrop-blur-md">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-neon-lime animate-pulse" />
                    <span className="text-xs font-bold text-slate-200 font-sans tracking-wide">আমার প্রবাহ (Personalized Feed)</span>
                  </div>
                  <p className="text-[10px] text-neon-lime/70 font-sans">আপনার পছন্দ অনুযায়ী সংবাদ সাজানো</p>
                </div>
                <button
                  onClick={() => setPersonalized(!personalized)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 flex-shrink-0 cursor-pointer ${
                    personalized ? 'bg-neon-lime' : 'bg-white/10'
                  } ${personalized ? 'shadow-[0_0_10px_rgba(57,255,20,0.4)]' : ''}`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      personalized ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Ingestion warning if stories are empty */}
            {stories.length === 0 ? (
              <div className="glass-panel rounded-3xl p-12 text-center max-w-2xl mx-auto transition-all duration-300">
                <div className="h-16 w-16 bg-neon-lime/10 text-neon-lime rounded-2xl flex items-center justify-center mx-auto mb-4 border border-neon-lime/20 shadow-[0_0_15px_rgba(57,255,20,0.15)]">
                  <ShieldAlert className="h-8 w-8 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold font-sans text-slate-100 mb-2">কোন সংবাদ নিবন্ধ পাওয়া যায়নি</h3>
                <p className="text-slate-300 font-sans text-sm mb-6 leading-relaxed">
                  বর্তমান ডাটাবেজ খালি রয়েছে। দয়া করে এডমিন কন্ট্রোল প্যানেলে যান এবং সোর্স স্ক্র্যাপারটি সচল করুন।
                </p>
                <button
                  onClick={() => setActiveTab('admin')}
                  className="px-6 py-2.5 bg-neon-lime hover:bg-neon-lime/85 text-slate-950 font-bold text-xs rounded-xl transition-all font-sans cursor-pointer shadow-[0_0_15px_rgba(57,255,20,0.3)] border border-neon-lime/50"
                >
                  এডমিন প্যানেলে যান
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Beautiful Search Input Field */}
                <div className="relative max-w-xl mx-auto">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neon-lime">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="শিরোনাম বা সংবাদের বিষয়বস্তু দিয়ে খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-slate-950/60 hover:bg-slate-950/80 focus:bg-slate-950 text-white placeholder-slate-500 border border-neon-lime/25 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neon-lime/40 shadow-[0_0_15px_rgba(57,255,20,0.04)] focus:shadow-[0_0_20px_rgba(57,255,20,0.2)] transition-all duration-300 text-sm font-sans"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {getRankedStories().length === 0 ? (
                  <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto transition-all duration-300 border border-neon-lime/10">
                    <div className="h-14 w-14 bg-neon-lime/10 text-neon-lime rounded-2xl flex items-center justify-center mx-auto mb-4 border border-neon-lime/20 shadow-[0_0_15px_rgba(57,255,20,0.15)]">
                      <Search className="h-6 w-6 animate-pulse" />
                    </div>
                    <h3 className="text-lg font-bold font-sans text-slate-200 mb-1.5">কোন খবর পাওয়া যায়নি</h3>
                    <p className="text-slate-400 font-sans text-xs leading-relaxed">
                      আপনার অনুসন্ধানের সাথে মিলে যাওয়া কোন সংবাদ নিবন্ধ পাওয়া যায়নি। অন্য কোন শব্দ দিয়ে চেষ্টা করুন।
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Bento Grid layout for the main landing view */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      
                      {/* HERO ELEMENT: Top Article */}
                      <div className="lg:col-span-2 group">
                        {getRankedStories().length > 0 && (
                          <div
                            onClick={() => handleOpenArticle(getRankedStories()[0])}
                            className="glass-panel rounded-3xl overflow-hidden cursor-pointer h-full flex flex-col transition-all duration-300"
                          >
                            <div className="relative aspect-[16/9] overflow-hidden bg-slate-950/60 border-b border-neon-lime/15">
                              <img
                                src={getRankedStories()[0].imageUrl}
                                alt="News Cover"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                              />
                              <div className="absolute top-4 left-4 flex gap-2">
                                <span className="bg-neon-lime text-slate-950 text-[10px] font-extrabold tracking-wider px-3 py-1 rounded-full uppercase font-sans border border-neon-lime/30 shadow-[0_0_10px_rgba(57,255,20,0.4)]">
                                  {getRankedStories()[0].category}
                                </span>
                                <span className="bg-slate-950/80 backdrop-blur-md text-neon-green text-[10px] font-mono px-3 py-1 rounded-full flex items-center gap-1.5 border border-neon-green/20">
                                  <Sparkles className="h-3 w-3 text-neon-green animate-pulse" /> এআই রিলিজ
                                </span>
                              </div>
                            </div>
                            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                              <div className="space-y-4">
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight group-hover:text-neon-lime group-hover:text-glow-lime transition-colors leading-tight">
                                  {getRankedStories()[0].canonicalTitle}
                                </h2>
                                <p className="text-slate-300 font-sans text-sm leading-relaxed line-clamp-3">
                                  {getRankedStories()[0].aiBody}
                                </p>
                              </div>
                              
                              <div className="mt-6 pt-6 border-t border-neon-lime/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="h-9 w-9 rounded-full bg-neon-lime/15 text-neon-lime flex items-center justify-center font-mono text-sm font-bold border border-neon-lime/30 shadow-[0_0_8px_rgba(57,255,20,0.2)]">
                                    AI
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-slate-200 font-sans">খবর প্রবাহ এআই রিপোর্টার</h4>
                                    <span className="text-[10px] text-slate-400 font-sans flex items-center gap-1">
                                      <Clock className="h-3 w-3" /> {new Date(getRankedStories()[0].createdAt).toLocaleDateString('bn-BD')}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-xs font-semibold text-neon-lime group-hover:text-neon-green group-hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1">
                                  বিস্তারিত পড়ুন <ChevronRight className="h-4 w-4" />
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* SIDE COLUMN: Trending news lists */}
                      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col transition-all duration-300">
                        <div className="flex items-center gap-2 pb-4 border-b border-neon-lime/15 mb-6">
                          <TrendingUp className="h-5 w-5 text-neon-lime animate-bounce" style={{ animationDuration: '3s' }} />
                          <h3 className="text-lg font-bold font-sans text-white">ট্রেন্ডিং নিউজ তালিকা</h3>
                        </div>

                        <div className="flex-1 divide-y divide-neon-lime/10">
                          {getRankedStories().slice(1, 5).map((st, index) => (
                            <div
                              key={st.id}
                              onClick={() => handleOpenArticle(st)}
                              className="py-4 first:pt-0 last:pb-0 cursor-pointer group flex gap-4"
                            >
                              <span className="text-3xl font-extrabold text-white/10 group-hover:text-neon-lime transition-colors font-sans select-none">
                                ০{index + 1}
                              </span>
                              <div className="space-y-1">
                                <span className="text-[10px] text-neon-green font-semibold uppercase font-sans tracking-wide">{st.category}</span>
                                <h4 className="text-sm font-bold text-slate-200 font-sans tracking-tight leading-snug group-hover:text-neon-lime transition-colors line-clamp-2">
                                  {st.canonicalTitle}
                                </h4>
                              </div>
                            </div>
                          ))}

                          {getRankedStories().length <= 1 && (
                            <div className="text-slate-500 text-xs font-sans text-center py-8">
                              আপাতত কোন ট্রেন্ডিং সংবাদ নেই।
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Grid layout for secondary articles */}
                    <div className="pt-6">
                      <h3 className="text-xl font-bold font-sans text-white mb-6 flex items-center gap-2">
                        <Layers className="h-5 w-5 text-neon-lime text-glow-lime" /> আরও অন্যান্য খবরসমূহ
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {getRankedStories().slice(5).map((st) => (
                          <div
                            key={st.id}
                            onClick={() => handleOpenArticle(st)}
                            className="glass-panel rounded-3xl overflow-hidden cursor-pointer flex flex-col group h-full transition-all duration-300"
                          >
                            <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden border-b border-neon-lime/15">
                              <img
                                src={st.imageUrl}
                                alt="news cover"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-550"
                              />
                              <span className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md text-neon-green text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase font-sans border border-neon-green/25 shadow-[0_0_8px_rgba(0,255,102,0.25)]">
                                {st.category}
                              </span>
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-between">
                              <div className="space-y-2">
                                <h4 className="text-base font-extrabold text-slate-100 font-sans tracking-tight group-hover:text-neon-lime group-hover:text-glow-lime transition-colors line-clamp-2 leading-snug">
                                  {st.canonicalTitle}
                                </h4>
                                <p className="text-slate-400 font-sans text-xs leading-relaxed line-clamp-2">
                                  {st.aiBody}
                                </p>
                              </div>

                              <div className="mt-4 pt-4 border-t border-neon-lime/10 flex items-center justify-between text-[10px] text-slate-400 font-sans">
                                <span>{new Date(st.createdAt).toLocaleDateString('bn-BD')}</span>
                                <span className="text-neon-lime font-semibold group-hover:text-neon-green group-hover:underline">বিস্তারিত পড়ুন</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            VIEW B: ADMIN & PROCESSING PIPELINE WORKSPACE
            ========================================== */}
        {activeTab === 'admin' && isAdminAuthorized && (
          <div className="space-y-8 font-sans">
            
            {/* Stage header info */}
            <div className="glass-panel text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Database className="h-6 w-6 text-neon-lime animate-pulse" />
                  <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight">সিস্টেম কন্ট্রোল ও এআই পাইপলাইন ড্যাশবোর্ড</h2>
                </div>
                <p className="text-slate-300 font-sans text-xs max-w-2xl leading-relaxed">
                  সংবাদ আরএসএস সোর্স রেজিস্ট্রি, স্ক্র্যাপার পোলিং, সেমান্টিক ক্লাস্টারিং এবং কৃত্রিম বুদ্ধিমত্তা চালিত জেনারেশন ও সামাজিক যোগাযোগ মাধ্যমে নো-অ্যাপ্রুভাল পাবলিশিং প্যানেল।
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTriggerScraper}
                  disabled={scraping}
                  className={`px-5 py-2.5 rounded-xl font-sans text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    scraping
                      ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                      : 'bg-neon-lime text-slate-950 font-extrabold hover:bg-neon-lime/85 shadow-[0_0_15px_rgba(57,255,20,0.35)] border border-neon-lime/40'
                  }`}
                >
                  <RefreshCw className={`h-4 w-4 ${scraping ? 'animate-spin' : ''}`} />
                  {scraping ? 'স্ক্র্যাপার চলছে...' : 'নতুন আরএসএস ফেচ করুন'}
                </button>
                <button
                  onClick={handleProcessNextItem}
                  disabled={processing || rawQueueLength === 0}
                  className={`px-5 py-2.5 rounded-xl font-sans text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    processing || rawQueueLength === 0
                      ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 border border-emerald-500/20'
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  {processing ? 'এআই জেনারেট হচ্ছে...' : 'পরবর্তী ফেড এআই প্রসেস করুন'}
                </button>
              </div>
            </div>

            {/* Ingestion & Cost Tracker Indicators */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-panel rounded-2xl p-5 transition-all duration-300">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">স্ক্র্যাপার কিউ (Queue)</span>
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-extrabold text-white font-mono">{rawQueueLength}টি</h3>
                  <span className="text-xs text-neon-lime font-bold font-sans bg-neon-lime/15 px-2 py-0.5 rounded-md border border-neon-lime/20 shadow-[0_0_8px_rgba(57,255,20,0.15)]">পোস্ট বাকি</span>
                </div>
              </div>
              <div className="glass-panel rounded-2xl p-5 transition-all duration-300">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">মোট এআই কন্টেন্ট</span>
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-extrabold text-white font-mono">{stories.length}টি</h3>
                  <span className="text-xs text-emerald-300 font-bold font-sans bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/20">প্রকাশিত</span>
                </div>
              </div>
              <div className="glass-panel rounded-2xl p-5 transition-all duration-300">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">মোট টোকেন খরচ</span>
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-extrabold text-white font-mono">{(analytics?.stats?.totalTokensUsed || 142000).toLocaleString()}</h3>
                  <span className="text-xs text-indigo-300 font-mono bg-indigo-500/15 px-2 py-0.5 rounded-md border border-indigo-500/20">Tokens</span>
                </div>
              </div>
              <div className="glass-panel rounded-2xl p-5 transition-all duration-300">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">মোট এআই এপিআই বিল</span>
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-extrabold text-white font-mono">${(analytics?.stats?.approximateCost || 2.84).toFixed(4)}</h3>
                  <span className="text-xs text-slate-300 font-bold font-sans bg-white/10 px-2 py-0.5 rounded-md border border-white/5">ইউএস ডলার</span>
                </div>
              </div>
            </div>

            {/* Split screen control layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT SIDE: Streams Registry & Source Customizer (5 cols) */}
              <div className="lg:col-span-5 space-y-8">
                {/* Source List */}
                <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 transition-all duration-300">
                  <h3 className="text-lg font-bold font-sans text-white pb-3 border-b border-neon-lime/15 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Radio className="h-5 w-5 text-neon-lime animate-pulse" />
                      নিউজ সোর্স স্ট্রিম রেজিস্ট্রি
                    </span>
                    <span className="text-xs bg-slate-950 px-2 py-1 rounded-md text-neon-lime font-mono font-bold border border-neon-lime/20">{sources.length} সোর্স</span>
                  </h3>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {sources.map((src) => (
                      <div key={src.id} className="flex items-center justify-between p-3 border border-white/5 hover:border-white/10 rounded-2xl bg-white/5">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-slate-100 font-sans tracking-tight">{src.name}</h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                            <span className="bg-white/10 px-1.5 py-0.5 rounded text-slate-300 font-bold font-sans uppercase border border-white/5">{src.type}</span>
                            <span className="truncate max-w-[150px]">{src.url.substring(0, 30)}...</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            src.credibilityTier === 'A' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20' : 
                            src.credibilityTier === 'B' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20' : 'bg-neon-lime/15 text-neon-lime border border-neon-lime/20'
                          }`}>
                            Tier {src.credibilityTier}
                          </span>
                          <button
                            onClick={() => handleDeleteSource(src.id, src.name)}
                            className="p-1 text-slate-400 hover:text-neon-lime hover:bg-neon-lime/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add source stream form */}
                  <form onSubmit={handleAddSource} className="space-y-4 pt-4 border-t border-neon-lime/15">
                    <h4 className="text-xs font-bold text-neon-lime uppercase tracking-wider">নতুন স্ট্রিম রেজিস্টার করুন</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-300 font-sans">সোর্স এর নাম (Bangla)</label>
                        <input
                          type="text"
                          value={newSourceName}
                          onChange={(e) => setNewSourceName(e.target.value)}
                          placeholder="উদা: প্রথম আলো"
                          className="w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-neon-lime/40 focus:outline-none placeholder:text-slate-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-300 font-sans">আরএসএস ফেড লিংক / সোশ্যাল হ্যান্ডেল</label>
                        <input
                          type="text"
                          value={newSourceUrl}
                          onChange={(e) => setNewSourceUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-neon-lime/40 focus:outline-none placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-300 font-sans">টাইপ</label>
                        <select
                          value={newSourceType}
                          onChange={(e) => setNewSourceType(e.target.value as 'rss' | 'social')}
                          className="w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-neon-lime/40 focus:outline-none font-sans"
                        >
                          <option value="rss" className="bg-slate-950 text-slate-200">RSS FEED</option>
                          <option value="social" className="bg-slate-950 text-slate-200">SOCIAL ARCHIVE</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-300 font-sans">ক্রিডিবিলিটি রেটিং</label>
                        <select
                          value={newSourceTier}
                          onChange={(e) => setNewSourceTier(e.target.value as 'A' | 'B' | 'C')}
                          className="w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-neon-lime/40 focus:outline-none font-mono"
                        >
                          <option value="A" className="bg-slate-950 text-slate-200">TIER A (Verified Outlet)</option>
                          <option value="B" className="bg-slate-950 text-slate-200">TIER B (Sub-publisher)</option>
                          <option value="C" className="bg-slate-950 text-slate-200">TIER C (Independent)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-neon-lime hover:bg-neon-lime/85 text-slate-950 text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all font-sans cursor-pointer shadow-[0_0_15px_rgba(57,255,20,0.3)] border border-neon-lime/30"
                    >
                      <Plus className="h-4 w-4 text-slate-950 stroke-[3]" /> সোর্স রেজিস্টার করুন
                    </button>
                  </form>
                </div>

                {/* Social channel mapping Settings */}
                <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 transition-all duration-300">
                  <h3 className="text-lg font-bold font-sans text-white pb-3 border-b border-white/5 flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-indigo-400" />
                    সোশ্যাল ডিস্ট্রিবিউশন সেটিংস
                  </h3>

                  <div className="space-y-4">
                    {channels.map((ch) => (
                      <div key={ch.id} className="flex items-center justify-between p-3.5 border border-white/5 rounded-2xl bg-white/5 hover:border-white/10 transition-colors">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-extrabold text-slate-100 font-sans">{ch.platform} Integration</h4>
                          <span className="text-[10px] text-slate-400 font-mono block">{ch.accountRef}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            ch.connected ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20' : 'bg-white/10 text-slate-400 border border-white/5'
                          }`}>
                            {ch.connected ? 'সংযুক্ত' : 'অসংযুক্ত'}
                          </span>
                          
                          <button
                            onClick={() => handleToggleChannel(ch.id)}
                            className={`px-3 py-1.5 rounded-xl font-sans text-[10px] font-bold transition-all duration-300 cursor-pointer ${
                              ch.connected
                                ? 'bg-neon-lime/10 text-neon-lime hover:bg-neon-lime/20 border border-neon-lime/20'
                                : 'bg-neon-green/20 text-neon-green hover:bg-neon-green/35 border border-neon-green/35 shadow-[0_0_10px_rgba(0,255,102,0.1)] font-extrabold'
                            }`}
                          >
                            {ch.connected ? 'ডিজেবল' : 'কানেক্ট'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: Terminal Log monitor & Published queue log (7 cols) */}
              <div className="lg:col-span-7 space-y-8">
                {/* Scraper Live terminal console */}
                <div className="glass-panel text-slate-200 rounded-3xl p-6 shadow-2xl transition-all duration-300 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-5 w-5 text-emerald-400" />
                      <h3 className="text-sm font-bold font-mono text-emerald-400">pipeline_logs_monitor.sh</h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500/80"></span>
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80"></span>
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></span>
                    </div>
                  </div>

                  {/* Terminal log logs content */}
                  <div className="h-[280px] overflow-y-auto font-mono text-xs text-slate-300 space-y-1.5 pr-2">
                    {terminalLogs.map((log, idx) => {
                      let color = 'text-slate-300';
                      if (log.startsWith('[SYSTEM]')) color = 'text-blue-400';
                      if (log.startsWith('[SUCCESS]')) color = 'text-emerald-400';
                      if (log.startsWith('[GEMINI]')) color = 'text-fuchsia-400';
                      if (log.startsWith('[ERROR]')) color = 'text-red-400';

                      return (
                        <div key={idx} className={`${color} leading-relaxed break-all`}>
                          <span className="text-slate-600 select-none">$</span> {log}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Active tasks: none</span>
                    <button
                      onClick={() => setTerminalLogs(['Logs cleared. Standing by for pipeline signals...'])}
                      className="hover:text-neon-lime transition-colors cursor-pointer"
                    >
                      ক্লিয়ার টার্মিনাল
                    </button>
                  </div>
                </div>

                {/* Background automated live console */}
                <div className="glass-panel text-slate-200 rounded-3xl p-6 shadow-2xl transition-all duration-300 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-indigo-400 animate-pulse" />
                      <h3 className="text-sm font-bold font-mono text-indigo-400">auto_pipeline_background_daemon.log</h3>
                    </div>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-300 font-sans font-bold px-2 py-0.5 rounded border border-indigo-500/20">
                      সচল (60s loop)
                    </span>
                  </div>

                  {/* Terminal logs content */}
                  <div className="h-[220px] overflow-y-auto font-mono text-[11px] text-slate-300 space-y-1.5 pr-2">
                    {backgroundLogs.length > 0 ? (
                      backgroundLogs.map((log, idx) => {
                        let color = 'text-slate-400';
                        if (log.includes('[SUCCESS]') || log.includes('[PUBLISHED]')) color = 'text-emerald-400';
                        if (log.includes('[ERROR]') || log.includes('[CRITICAL ERROR]')) color = 'text-red-400';
                        if (log.includes('[AUTO-PIPELINE]')) color = 'text-slate-300';
                        if (log.includes('Scraping from') || log.includes('Polling')) color = 'text-blue-300';
                        if (log.includes('Calling Imagen')) color = 'text-fuchsia-400';

                        return (
                          <div key={idx} className={`${color} leading-normal break-all`}>
                            <span className="text-slate-600 select-none">#</span> {log}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-slate-500 italic text-center py-16">
                        কোন ব্যাকগ্রাউন্ড লগ এখনও পাওয়া যায়নি...
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Daemon STATUS: OK</span>
                    <span className="text-slate-600">60s interval poll</span>
                  </div>
                </div>

                {/* Real-time automated publishing history log */}
                <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 transition-all duration-300">
                  <h3 className="text-lg font-bold font-sans text-white pb-3 border-b border-white/5 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-400" />
                    প্রকাশিত মাল্টি-চ্যানেল লগসমূহ
                  </h3>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {analytics?.logs && analytics.logs.length > 0 ? (
                      analytics.logs.map((log: any) => (
                        <div key={log.id} className="p-3 border border-white/5 hover:border-white/10 rounded-2xl bg-white/5 flex items-center justify-between gap-4 transition-colors">
                          <div className="space-y-1 min-w-0">
                            <h4 className="text-xs font-extrabold text-slate-100 font-sans truncate">{log.storyTitle}</h4>
                            <div className="flex items-center gap-2 text-[9px] text-slate-400 font-mono">
                              <span className="bg-emerald-500/10 text-emerald-400 font-sans font-bold px-1.5 py-0.2 rounded border border-emerald-500/20">PUBLISHED</span>
                              <span>চ্যানেল: {log.channel}</span>
                              <span>• ID: {log.platformPostId}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-slate-400 font-mono text-[10px] flex-shrink-0">
                            <span className="flex items-center gap-1"><Eye className="h-3 w-3 text-slate-550" /> {log.clicks}</span>
                            <span className="flex items-center gap-1"><Heart className="h-3 w-3 text-slate-550" /> {log.likes}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-400 text-xs font-sans text-center py-12">
                        কোন সামাজিক যোগাযোগ মাধ্যম প্রকাশনা লগ পাওয়া যায়নি।
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* FOOTER WITH DISCREET ADMIN LINK */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 pb-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-slate-400 gap-6">
        <div className="text-center md:text-left space-y-1">
          <p className="text-sm font-sans font-medium text-slate-300">খবর প্রবাহ AI - ১০০% স্বয়ংক্রিয় সংবাদ মাধ্যম</p>
          <p className="text-xs text-slate-500 font-sans">© ২০২৬ সর্বস্বত্ব সংরক্ষিত। কৃত্রিম বুদ্ধিমত্তা চালিত সাংবাদিকতা প্ল্যাটফর্ম।</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold font-sans">
          <button
            onClick={() => {
              if (isAdminAuthorized) {
                setActiveTab('admin');
              } else {
                setShowPasscodeGate(true);
                setAdminPasscode('');
                setPasscodeError('');
              }
            }}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl transition-all duration-300 border border-white/5 cursor-pointer flex items-center gap-2"
          >
            <Settings className="h-3.5 w-3.5 text-neon-lime" />
            সিস্টেম অ্যাডমিন প্যানেল
          </button>
        </div>
      </footer>

      {/* ADMIN PASSCODE GATE MODAL */}
      <AnimatePresence>
        {showPasscodeGate && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md w-full border border-white/10 text-center space-y-6"
            >
              <div className="h-14 w-14 bg-neon-lime/15 text-neon-lime rounded-2xl flex items-center justify-center mx-auto border border-neon-lime/25 shadow-[0_0_10px_rgba(57,255,20,0.2)]">
                <Settings className="h-7 w-7 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold font-sans text-white">অ্যাডমিন প্রবেশাধিকার</h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  প্যানেল পরিবর্তন এবং সোর্স ম্যানেজার সম্পাদনা করতে গোপন এডমিন পাসকোডটি প্রবেশ করুন।
                </p>
              </div>

              <div className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">এডমিন সিকিউরিটি পিন (PIN)</label>
                  <input
                    type="password"
                    placeholder="পাসকোড লিখুন..."
                    value={adminPasscode}
                    onChange={(e) => {
                      setAdminPasscode(e.target.value);
                      setPasscodeError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleVerifyPasscode();
                      }
                    }}
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-neon-lime/40 focus:outline-none text-slate-100 placeholder-slate-500 bg-black/20"
                    autoFocus
                  />
                  {passcodeError && (
                    <p className="text-red-400 text-[11px] font-sans font-medium flex items-center gap-1 mt-1">
                      ⚠️ {passcodeError}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setShowPasscodeGate(false)}
                    className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs rounded-xl transition-all font-sans cursor-pointer border border-white/5"
                  >
                    বাতিল করুন
                  </button>
                  <button
                    onClick={handleVerifyPasscode}
                    className="w-full py-2.5 bg-neon-lime hover:bg-neon-lime/85 text-slate-950 font-extrabold text-xs rounded-xl transition-all font-sans cursor-pointer shadow-[0_0_15px_rgba(57,255,20,0.3)] border border-neon-lime/30"
                  >
                    যাচাই করুন
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-slate-550 font-mono">
                ডিফল্ট পিন কোড: 7788
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================
          ARTICLE READER MODAL & CANVAS CUSTOMIZER
          ========================================== */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-lg flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col border border-white/10"
            >
              
              {/* Header with dismiss buttons */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2">
                  <span className="bg-neon-lime/20 text-neon-lime text-[10px] font-bold px-3 py-1 rounded-full font-sans uppercase border border-neon-lime/20">
                    {selectedStory.category}
                  </span>
                  <span className="text-white/20 text-xs font-mono font-bold">|</span>
                  <span className="text-slate-300 text-xs font-sans flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {new Date(selectedStory.createdAt).toLocaleDateString('bn-BD')} তারিখে এআই দ্বারা রচিত
                  </span>
                </div>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold rounded-lg transition-colors font-sans border border-white/10 cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>

              {/* Scrollable contents split into layout: Reading vs Photocard customizer */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT COLUMN: News Reader & AI explanations (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight leading-tight">
                    {selectedStory.canonicalTitle}
                  </h2>

                  <div className="text-slate-200 font-sans text-base leading-relaxed space-y-4">
                    {selectedStory.aiBody.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-slate-300">{paragraph}</p>
                    ))}
                  </div>

                  {/* AI visual explanation box */}
                  <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
                      এআই ইমেজিং ও আইনগত নিরাপত্তা বিশ্লেষণ
                    </h4>
                    <p className="text-xs text-indigo-200 font-sans leading-relaxed">
                      আদি প্রকাশকের কপিরাইট করা মূল ছবি সরাসরি ব্যবহার না করে, এআই কনটেন্ট ইঞ্জিনটি সংবাদ শিরোনামের ওপর ভিত্তি করে একটি স্বতন্ত্র ইমেজ প্রম্পট তৈরি করেছে। এই প্রম্পট দিয়ে কৃত্রিম বুদ্ধিমত্তা সম্পূর্ণ নতুন একটি চিত্র তৈরি করে, যা মূল ছবির অনুলিপি নয়। এটি আইনগতভাবে নিরাপদ এবং প্রকাশককে সম্পূর্ণ কপিরাইট ঝুঁকি থেকে মুক্ত রাখে।
                    </p>
                    {selectedStory.imagePrompt && (
                      <div className="bg-slate-950/90 text-indigo-300 p-3 rounded-xl font-mono text-[10px] leading-relaxed break-words border border-white/5">
                        <span className="text-white font-bold block mb-1">Generated Prompt:</span>
                        {selectedStory.imagePrompt}
                      </div>
                    )}
                  </div>

                  {/* Citations block for source transparency */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-emerald-400" />
                      সংগৃহীত সোর্স রেফারেন্সসমূহ
                    </h4>
                    <p className="text-xs text-slate-400 font-sans">
                      তত্ত্বাবধান ও তথ্যের সত্যতা যাচাইয়ের অংশ হিসেবে এই সংবাদের মূল উৎস নিচে সংযুক্ত করা হলো:
                    </p>
                    <div className="space-y-2">
                      {selectedStory.sources.map((src, index) => (
                        <a
                          key={index}
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2.5 border border-white/5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xs font-semibold text-slate-200"
                        >
                          <span className="flex items-center gap-1.5">
                            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                            {src.sourceName}
                          </span>
                          <span className="text-[10px] text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded font-bold uppercase font-sans border border-emerald-500/20">
                            Credibility Tier {src.credibilityTier}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Branded Photocard Customizer (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="glass-panel text-white rounded-3xl p-6 space-y-6">
                    <h3 className="text-sm font-bold font-sans tracking-wide uppercase text-slate-300 flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-neon-lime" />
                      ব্র্যান্ডেড ফটোকার্ড কাস্টমাইজার
                    </h3>

                    {/* Canvas Container */}
                    <div className="bg-slate-950 aspect-square w-full rounded-2xl overflow-hidden border border-white/5 shadow-inner flex items-center justify-center relative">
                      <canvas ref={canvasRef} className="w-full h-full max-w-[340px] max-h-[340px] object-contain" />
                    </div>

                    {/* Layout Controls */}
                    <div className="space-y-4">
                      {/* Template Toggle */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ডিজাইন টেমপ্লেট</label>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {['Breaking News', 'Minimalist Tech', 'Sports Spotlight', 'Deep Crimson'].map((tpl) => (
                            <button
                              key={tpl}
                              onClick={() => setCardTemplate(tpl)}
                              className={`py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                                cardTemplate === tpl
                                  ? 'bg-neon-lime border-neon-lime text-slate-950 font-bold shadow-[0_0_10px_rgba(57,255,20,0.3)]'
                                  : 'bg-white/5 border-white/5 text-slate-300 hover:border-white/10'
                              }`}
                            >
                              {tpl}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Headline Overlay Text Input */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">হেডলাইন পরিবর্তন</label>
                        <textarea
                          rows={2}
                          value={cardTitle}
                          onChange={(e) => setCardTitle(e.target.value)}
                          className="w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-neon-lime/40 focus:outline-none text-slate-100 leading-normal"
                        />
                      </div>

                      {/* Font size & Overlay Opacity sliders */}
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ফন্ট সাইজ ({cardFontSize}px)</label>
                          <input
                            type="range"
                            min="24"
                            max="48"
                            value={cardFontSize}
                            onChange={(e) => setCardFontSize(Number(e.target.value))}
                            className="w-full accent-neon-lime bg-white/10 rounded-lg appearance-none h-1 cursor-pointer"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ডার্ক ওভারলে ({cardOverlayOpacity}%)</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={cardOverlayOpacity}
                            onChange={(e) => setCardOverlayOpacity(Number(e.target.value))}
                            className="w-full accent-neon-lime bg-white/10 rounded-lg appearance-none h-1 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Download photocard PNG */}
                      <button
                        onClick={handleDownloadCard}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20 border border-emerald-500/20 cursor-pointer"
                      >
                        <Download className="h-4 w-4" /> কাস্টম ফটোকার্ড ডাউনলোড করুন (PNG)
                      </button>
                    </div>

                  </div>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

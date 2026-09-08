/**
 * ---------------------------------------------------------------------------
 * WHAT WE DO / CAPABILITIES / PROCESS / PILLARS
 * ---------------------------------------------------------------------------
 * `icon` values are Lucide React icon names. See https://lucide.dev/icons
 * ---------------------------------------------------------------------------
 */

export type Service = {
  number: string;
  title: string;
  description: string;
  icon: string;
};

/** Section 6 — What We Do. */
export const services: Service[] = [
  {
    number: '01',
    title: 'Software Development',
    description: 'Custom web applications, mobile apps, business software, and digital platforms.',
    icon: 'Code2',
  },
  {
    number: '02',
    title: 'Web & Mobile Applications',
    description: 'Modern, responsive web platforms and intuitive mobile applications.',
    icon: 'Smartphone',
  },
  {
    number: '03',
    title: 'IoT Solutions',
    description: 'Connected devices, sensors, monitoring systems, automation, and real-time data solutions.',
    icon: 'Radio',
  },
  {
    number: '04',
    title: 'IoT-Integrated Applications',
    description:
      'Applications that communicate with and control smart devices while providing real-time insights and analytics.',
    icon: 'Waypoints',
  },
  {
    number: '05',
    title: 'Smart & Connected Products',
    description: 'Technology-enabled products designed to address specific real-world needs.',
    icon: 'Boxes',
  },
  {
    number: '06',
    title: 'Automation Solutions',
    description:
      'Smart systems that reduce manual processes, improve efficiency, and support intelligent decision-making.',
    icon: 'Workflow',
  },
  {
    number: '07',
    title: 'Cloud-Based Solutions',
    description: 'Secure cloud-connected platforms, data collection, dashboards, analytics, and remote monitoring.',
    icon: 'Cloud',
  },
  {
    number: '08',
    title: 'Real-Time Monitoring & Analytics',
    description: 'Systems that collect, visualize, and analyze real-time data.',
    icon: 'Activity',
  },
  {
    number: '09',
    title: 'AI & Data-Driven Solutions',
    description: 'Intelligent technology solutions using AI, automation, analytics, and data.',
    icon: 'BrainCircuit',
  },
  {
    number: '10',
    title: 'API & System Integration',
    description: 'Connecting applications, platforms, devices, APIs, and external systems.',
    icon: 'Plug',
  },
  {
    number: '11',
    title: 'UI/UX Design',
    description: 'Simple, intuitive, and engaging digital experiences.',
    icon: 'PenTool',
  },
  {
    number: '12',
    title: 'Product Design & Development',
    description: 'Turning ideas into practical digital and connected products.',
    icon: 'Layers',
  },
];

/** Section 7 — Services / Capabilities list. */
export const capabilities: string[] = [
  'Custom Software Development',
  'Web & Mobile App Development',
  'IoT Application Development',
  'Smart Product Development',
  'IoT Device Integration',
  'Automation & Control Systems',
  'Cloud & Backend Solutions',
  'Real-Time Data & Monitoring',
  'AI & Data-Driven Solutions',
  'API & System Integration',
  'UI/UX Design',
  'Product Prototyping & Testing',
  'Maintenance & Technical Support',
  'Custom Enterprise Solutions',
];

/** Section 14 — About supporting concepts. */
export const pillars = [
  {
    number: '01',
    title: 'Innovation',
    description: 'Exploring new technologies and ideas to solve meaningful problems.',
    icon: 'Lightbulb',
  },
  {
    number: '02',
    title: 'Connection',
    description: 'Connecting software, devices, data, and people into intelligent systems.',
    icon: 'Network',
  },
  {
    number: '03',
    title: 'Impact',
    description: 'Creating practical technology that delivers real-world value.',
    icon: 'Target',
  },
];

/** Section 15 — Connecting the Physical & Digital Worlds. */
export const connectionFlow = [
  { label: 'Device', icon: 'Cpu' },
  { label: 'Sensor', icon: 'Radar' },
  { label: 'IoT', icon: 'Wifi' },
  { label: 'Data', icon: 'Database' },
  { label: 'Cloud', icon: 'CloudCog' },
  { label: 'Application', icon: 'AppWindow' },
  { label: 'Automation', icon: 'Cog' },
  { label: 'Intelligent Decision', icon: 'Sparkles' },
];

/** Section 16 — Our Process. */
export const processSteps = [
  {
    number: '01',
    title: 'Idea & Requirement Analysis',
    description: 'Understand the problem and requirements.',
    icon: 'Search',
  },
  {
    number: '02',
    title: 'Research & Planning',
    description: 'Identify the right technology and solution.',
    icon: 'Map',
  },
  {
    number: '03',
    title: 'UI/UX Design',
    description: 'Design a simple and user-friendly experience.',
    icon: 'PenTool',
  },
  {
    number: '04',
    title: 'Development',
    description: 'Build the software, application, or IoT system.',
    icon: 'Code2',
  },
  {
    number: '05',
    title: 'IoT Integration',
    description: 'Connect devices, sensors, hardware, and software.',
    icon: 'Waypoints',
  },
  {
    number: '06',
    title: 'Testing & Optimization',
    description: 'Test performance, security, and reliability.',
    icon: 'ShieldCheck',
  },
  {
    number: '07',
    title: 'Deployment',
    description: 'Launch the solution for real-world use.',
    icon: 'Rocket',
  },
  {
    number: '08',
    title: 'Support & Improvement',
    description: 'Maintain, monitor, and continuously improve the product.',
    icon: 'RefreshCw',
  },
];

/** Section 17 — Why fyndig. */
export const whyFyndig = [
  {
    number: '01',
    title: 'Problem First',
    description: 'We start by understanding the real problem before choosing the technology.',
    icon: 'Compass',
  },
  {
    number: '02',
    title: 'Connected Thinking',
    description: 'We think beyond individual applications and devices to create complete connected ecosystems.',
    icon: 'Network',
  },
  {
    number: '03',
    title: 'User Focused',
    description: 'We build technology that is practical, intuitive, and useful.',
    icon: 'Users',
  },
  {
    number: '04',
    title: 'Scalable',
    description: 'We design solutions that can grow with changing requirements.',
    icon: 'TrendingUp',
  },
  {
    number: '05',
    title: 'Modern Technology',
    description: 'We use modern software, cloud, IoT, automation, and data technologies.',
    icon: 'Cpu',
  },
  {
    number: '06',
    title: 'End-to-End',
    description: 'From idea and design to development, integration, testing, and deployment.',
    icon: 'GitBranch',
  },
];

/** Section 18 — Future Vision. */
export const futureVision = {
  heading: "Building What's Next.",
  body: [
    'We believe technology should solve meaningful problems.',
    'Our goal is to continuously explore new ideas, technologies, and opportunities to create products that make experiences simpler, smarter, more connected, and better.',
  ],
};

/** Section 32 — The visual story arc rendered in the Vision section. */
export const visualStory = [
  'Problem',
  'Idea',
  'Design',
  'Software + IoT',
  'Connected System',
  'Data',
  'Automation',
  'Smart Product',
  'Real-World Impact',
];

/** Options offered in the contact form's "Project Type" field. */
export const projectTypes = [
  'Software Development',
  'Web Application',
  'Mobile Application',
  'IoT Solution',
  'IoT-Integrated Application',
  'Smart / Connected Product',
  'Automation System',
  'Cloud & Backend',
  'AI & Data Solution',
  'UI/UX Design',
  'Other',
];

/**
 * ---------------------------------------------------------------------------
 * CURRENT PROJECTS  —  "What We're Building"
 * ---------------------------------------------------------------------------
 * The showcase reads this file and nothing else. Adding, removing or reordering
 * entries updates the cards, the counter and the scroll progress bar.
 *
 * Every optional list (`features`, `technologies`) hides its own block when
 * left empty, and `problem` / `solution` are only rendered when filled in — so
 * a project can be published with as much or as little detail as is ready.
 *
 * To add a project image: drop the file in /public/projects/ and set
 * `image: '/projects/your-file.jpg'`. Leave it `null` for the built-in
 * abstract visual.
 * ---------------------------------------------------------------------------
 */

export type ProjectStatus =
  | 'In Development'
  | 'In Design'
  | 'Research'
  | 'Prototyping'
  | 'Testing'
  | 'Coming Soon'
  | 'Live';

export type Project = {
  /** Internal key — must be unique. */
  id: string;
  /** Display name. */
  name: string;
  /** Short category label shown above the title. */
  category: string;
  /** One or two sentences describing the project. */
  description: string;
  /** Key features. Empty array hides the block. */
  features: string[];
  /** The real-world problem. Empty string hides the row. */
  problem: string;
  /** How the project solves it. Empty string hides the row. */
  solution: string;
  /** Current stage. */
  status: ProjectStatus;
  /** Technologies used. Empty array hides the row. */
  technologies: string[];
  /** Path to an image in /public, or null for the generated placeholder. */
  image: string | null;
  /** External URL, or null to hide the button. */
  link: string | null;
};

export const projects: Project[] = [
  {
    id: 'cam-assist-application',
    name: 'Cam Assist Application',
    category: 'AI-Powered CCTV Search & Security Application',
    description:
      'A smart software application that lets users search and understand CCTV events using natural-language queries. It provides a simple interface to search camera activity, view relevant results, check timelines, and receive intelligent insights from recorded footage.',
    features: [
      'Mobile application',
      'Natural-language CCTV search',
      'AI-powered video analysis',
      'Person & activity detection',
      'Delivery/package detection',
      'Event timeline',
      'Search results with images',
      'Smart notifications',
      'Local & cloud storage options',
    ],
    problem: '',
    solution: '',
    status: 'In Development',
    technologies: ['Kotlin', 'Jetpack Compose', 'AI/ML', 'Computer Vision', 'Room Database', 'Cloud'],
    image: '/projects/cam-assist-application.jpg',
    link: null,
  },
  {
    id: 'cam-assist-iot',
    name: 'Cam Assist IoT',
    category: 'Smart CCTV & IoT Camera Integration System',
    description:
      'A hardware-connectivity and integration layer that connects existing IP/CCTV cameras with Cam Assist software. It handles camera discovery, network communication, image and video capture, and integration with AI processing — built around ONVIF and RTSP standards.',
    features: [
      'IP/CCTV camera integration',
      'Network connectivity',
      'ONVIF camera discovery',
      'RTSP video streaming',
      'Scheduled & motion-triggered snapshots',
      'Real-time camera events',
      'Local storage integration',
      'AI processing integration',
      'Smart home security integration',
      'Commercial CCTV/NVR integration',
    ],
    problem: '',
    solution: '',
    status: 'In Design',
    technologies: ['IoT', 'ONVIF', 'RTSP', 'IP Cameras', 'NVR', 'GStreamer', 'Edge AI', 'Computer Vision'],
    image: '/projects/cam-assist-iot.jpg',
    link: null,
  },
  {
    id: 'skillswap',
    name: 'Skillswap',
    category: 'EdTech',
    description: 'Coming soon.',
    features: [],
    problem: '',
    solution: '',
    status: 'Coming Soon',
    technologies: [],
    image: '/projects/skillswap.jpg',
    link: null,
  },
];

/** Copy for the projects section header. Edit freely. */
export const projectsSection = {
  eyebrow: 'Current Projects',
  heading: "What We're Building",
  intro:
    'Work in progress. Each project starts with a real problem and ends as a connected product — details are published here as they are ready to share.',
  /** Shown on the closing card at the end of the rail. */
  outro: 'More to be announced.',
};

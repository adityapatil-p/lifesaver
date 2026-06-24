export const user = {
  name: 'Alex Chen',
  email: 'alex@lastminutelifesaver.app',
  avatar: 'AC',
  role: 'Product Lead',
  plan: 'Pro',
}

export const focusTasks = [
  {
    id: '1',
    title: 'Finalize hackathon pitch deck',
    priority: 'critical',
    deadline: '2026-06-23T18:00:00',
    progress: 75,
    category: 'Presentation',
    tags: ['urgent', 'demo'],
  },
  {
    id: '2',
    title: 'Review AI model integration',
    priority: 'high',
    deadline: '2026-06-23T20:00:00',
    progress: 40,
    category: 'Engineering',
    tags: ['backend'],
  },
  {
    id: '3',
    title: 'User testing session prep',
    priority: 'medium',
    deadline: '2026-06-24T10:00:00',
    progress: 20,
    category: 'Research',
    tags: ['ux'],
  },
]

export const upcomingDeadlines = [
  { id: 'd1', title: 'Pitch deck submission', date: '2026-06-23T18:00:00', type: 'critical' },
  { id: 'd2', title: 'API documentation', date: '2026-06-24T14:00:00', type: 'high' },
  { id: 'd3', title: 'Team sync presentation', date: '2026-06-25T09:00:00', type: 'medium' },
  { id: 'd4', title: 'Sprint retrospective', date: '2026-06-26T16:00:00', type: 'low' },
]

export const aiRecommendations = [
  {
    id: 'r1',
    icon: 'zap',
    title: 'Batch similar tasks',
    description: 'Group your 3 design reviews into one 90-min block for 40% faster completion.',
    impact: 'high',
  },
  {
    id: 'r2',
    icon: 'clock',
    title: 'Move low-priority items',
    description: 'Defer "Update team wiki" to Friday — your pitch deck needs focus today.',
    impact: 'medium',
  },
  {
    id: 'r3',
    icon: 'brain',
    title: 'Peak hours detected',
    description: 'Your productivity peaks 9–11 AM. Schedule deep work for the API review tomorrow.',
    impact: 'high',
  },
]

export const weeklyProgress = [
  { day: 'Mon', completed: 8, planned: 10, focus: 85 },
  { day: 'Tue', completed: 6, planned: 8, focus: 72 },
  { day: 'Wed', completed: 10, planned: 10, focus: 95 },
  { day: 'Thu', completed: 7, planned: 9, focus: 78 },
  { day: 'Fri', completed: 5, planned: 7, focus: 68 },
  { day: 'Sat', completed: 3, planned: 4, focus: 82 },
  { day: 'Sun', completed: 4, planned: 5, focus: 88 },
]

export const heatmapData = [
  { hour: '6AM', mon: 0, tue: 0, wed: 1, thu: 0, fri: 0, sat: 0, sun: 0 },
  { hour: '8AM', mon: 2, tue: 3, wed: 3, thu: 2, fri: 2, sat: 1, sun: 1 },
  { hour: '10AM', mon: 4, tue: 4, wed: 5, thu: 4, fri: 3, sat: 2, sun: 2 },
  { hour: '12PM', mon: 3, tue: 2, wed: 3, thu: 3, fri: 2, sat: 1, sun: 1 },
  { hour: '2PM', mon: 4, tue: 3, wed: 4, thu: 3, fri: 4, sat: 2, sun: 2 },
  { hour: '4PM', mon: 3, tue: 4, wed: 3, thu: 4, fri: 3, sat: 3, sun: 2 },
  { hour: '6PM', mon: 2, tue: 2, wed: 2, thu: 2, fri: 2, sat: 2, sun: 3 },
  { hour: '8PM', mon: 1, tue: 1, wed: 1, thu: 1, fri: 1, sat: 2, sun: 2 },
]

export const smartInsights = [
  {
    id: 's1',
    metric: '+23%',
    label: 'Productivity vs last week',
    trend: 'up',
    detail: 'Your focus sessions increased by 4 hours',
  },
  {
    id: 's2',
    metric: '2.4h',
    label: 'Avg. time to complete',
    trend: 'down',
    detail: '12% faster than your 30-day average',
  },
  {
    id: 's3',
    metric: '89%',
    label: 'On-time delivery rate',
    trend: 'up',
    detail: 'Best streak: 12 consecutive deadlines met',
  },
]

export const allTasks = [
  {
    id: 't1',
    title: 'Finalize hackathon pitch deck',
    description: 'Complete slides 8-12 with demo screenshots and metrics',
    priority: 'critical',
    status: 'in-progress',
    deadline: '2026-06-23T18:00:00',
    category: 'Presentation',
    tags: ['urgent', 'demo'],
    assignee: 'Alex Chen',
  },
  {
    id: 't2',
    title: 'Review AI model integration',
    description: 'Test API endpoints and error handling flows',
    priority: 'high',
    status: 'in-progress',
    deadline: '2026-06-23T20:00:00',
    category: 'Engineering',
    tags: ['backend'],
    assignee: 'Alex Chen',
  },
  {
    id: 't3',
    title: 'User testing session prep',
    description: 'Create test script and recruit 5 participants',
    priority: 'medium',
    status: 'todo',
    deadline: '2026-06-24T10:00:00',
    category: 'Research',
    tags: ['ux'],
    assignee: 'Alex Chen',
  },
  {
    id: 't4',
    title: 'Update team wiki',
    description: 'Document new onboarding process',
    priority: 'low',
    status: 'todo',
    deadline: '2026-06-27T17:00:00',
    category: 'Documentation',
    tags: ['internal'],
    assignee: 'Alex Chen',
  },
  {
    id: 't5',
    title: 'Design system audit',
    description: 'Review component consistency across pages',
    priority: 'medium',
    status: 'todo',
    deadline: '2026-06-25T15:00:00',
    category: 'Design',
    tags: ['ui'],
    assignee: 'Alex Chen',
  },
  {
    id: 't6',
    title: 'Deploy staging environment',
    description: 'Set up CI/CD pipeline for preview builds',
    priority: 'high',
    status: 'done',
    deadline: '2026-06-22T12:00:00',
    category: 'DevOps',
    tags: ['infra'],
    assignee: 'Alex Chen',
  },
]

export const aiSchedule = [
  {
    id: 'sch1',
    time: '09:00',
    duration: '2h',
    task: 'Deep work: Pitch deck finalization',
    type: 'focus',
    risk: 'low',
  },
  {
    id: 'sch2',
    time: '11:30',
    duration: '30m',
    task: 'Break + quick email review',
    type: 'break',
    risk: null,
  },
  {
    id: 'sch3',
    time: '12:00',
    duration: '1.5h',
    task: 'AI model integration testing',
    type: 'focus',
    risk: 'medium',
  },
  {
    id: 'sch4',
    time: '14:00',
    duration: '1h',
    task: 'User testing prep & script writing',
    type: 'focus',
    risk: 'low',
  },
  {
    id: 'sch5',
    time: '15:30',
    duration: '45m',
    task: 'Team standup + blocker resolution',
    type: 'meeting',
    risk: null,
  },
  {
    id: 'sch6',
    time: '16:30',
    duration: '1h',
    task: 'Buffer: Pitch deck polish & rehearsal',
    type: 'buffer',
    risk: 'high',
  },
]

export const deadlineRisks = [
  {
    id: 'dr1',
    task: 'Pitch deck submission',
    risk: 'medium',
    probability: 35,
    suggestion: 'Allocate buffer block at 4:30 PM for final polish',
  },
  {
    id: 'dr2',
    task: 'API documentation',
    risk: 'low',
    probability: 15,
    suggestion: 'Auto-generate from OpenAPI spec to save 2 hours',
  },
  {
    id: 'dr3',
    task: 'Design system audit',
    risk: 'high',
    probability: 62,
    suggestion: 'Split into 3 smaller reviews or delegate 2 components',
  },
]

export const analyticsData = {
  weeklyPerformance: [
    { week: 'W1', tasks: 42, completed: 38, hours: 32 },
    { week: 'W2', tasks: 45, completed: 40, hours: 35 },
    { week: 'W3', tasks: 38, completed: 36, hours: 28 },
    { week: 'W4', tasks: 50, completed: 47, hours: 38 },
    { week: 'W5', tasks: 48, completed: 43, hours: 36 },
    { week: 'W6', tasks: 52, completed: 49, hours: 40 },
  ],
  productivityTrend: [
    { date: 'Jun 17', score: 72 },
    { date: 'Jun 18', score: 78 },
    { date: 'Jun 19', score: 85 },
    { date: 'Jun 20', score: 81 },
    { date: 'Jun 21', score: 88 },
    { date: 'Jun 22', score: 92 },
    { date: 'Jun 23', score: 87 },
  ],
  completionStats: [
    { name: 'Completed', value: 49, color: '#6366f1' },
    { name: 'In Progress', value: 12, color: '#a78bfa' },
    { name: 'Overdue', value: 3, color: '#f472b6' },
    { name: 'Cancelled', value: 2, color: '#71717a' },
  ],
  categoryBreakdown: [
    { category: 'Engineering', count: 18 },
    { category: 'Design', count: 12 },
    { category: 'Research', count: 8 },
    { category: 'Documentation', count: 6 },
    { category: 'Meetings', count: 14 },
  ],
}

export const productivityScore = 87
export const completionRate = 78

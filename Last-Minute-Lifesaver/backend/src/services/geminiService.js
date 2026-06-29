import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini API client if key is available
const callGemini = async (model, prompt) => {
  try {
    const response = await model.generateContent(prompt);
    return response;
  } catch (error) {
    if (error.status === 503) {
      // Gemini Busy. Retry after 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      const retry = await model.generateContent(prompt);
      return retry;
    }
    throw error;
  }
};

const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });
};

const isCompleted = (task) => task.status === 'completed' || task.status === 'done'

// Graceful fallback for schedule generation when no API Key is available
const generateMockSchedule = (tasks) => {
  const activeTasks = tasks.filter((t) => !isCompleted(t))
  
  const criticalTasks = activeTasks.filter((t) => t.priority === 'critical')
  const highTasks = activeTasks.filter((t) => t.priority === 'high')

  const schedule = [
    {
      id: 'sch_fb_1',
      time: '09:00',
      duration: '2h',
      task: criticalTasks.length > 0 ? `Deep work: ${criticalTasks[0].title}` : 'Deep work: Core project tasks',
      type: 'focus',
      risk: criticalTasks.length > 0 ? 'medium' : 'low',
    },
    {
      id: 'sch_fb_2',
      time: '11:00',
      duration: '30m',
      task: 'Recovery break + Hydration',
      type: 'break',
      risk: null,
    },
    {
      id: 'sch_fb_3',
      time: '11:30',
      duration: '1.5h',
      task: highTasks.length > 0 ? `Focus session: ${highTasks[0].title}` : 'Focus session: High-priority items',
      type: 'focus',
      risk: highTasks.length > 0 ? 'low' : null,
    },
    {
      id: 'sch_fb_4',
      time: '13:00',
      duration: '1h',
      task: 'Lunch & Screen-free rest',
      type: 'break',
      risk: null,
    },
    {
      id: 'sch_fb_5',
      time: '14:00',
      duration: '1.5h',
      task: activeTasks.length > 2 ? `Task completion: ${activeTasks[2].title}` : 'Collaboration & email response sync',
      type: 'meeting',
      risk: null,
    },
    {
      id: 'sch_fb_6',
      time: '15:30',
      duration: '45m',
      task: 'Buffer block: Review outstanding submissions',
      type: 'buffer',
      risk: 'high',
    },
  ]

  const deadlineRisks = activeTasks.map((t, idx) => {
    let risk = 'low'
    let prob = 10
    let suggest = 'Keep up the good progress.'

    if (t.priority === 'critical') {
      risk = 'high'
      prob = 65
      suggest = 'Add a dedicated 60-minute buffer block to finalize this.'
    } else if (t.priority === 'high') {
      risk = 'medium'
      prob = 40
      suggest = 'Break this task into two smaller chunks to avoid delay.'
    }

    return {
      id: `dr_fb_${idx}`,
      task: t.title,
      risk,
      probability: prob,
      suggestion: suggest,
    }
  })

  const recommendations = [
    {
      id: 'r_fb_1',
      icon: 'zap',
      title: 'Batch similar activities',
      description: 'You have multiple coding/writing tasks. Batching them will save 30 mins of context-switching.',
      impact: 'high',
    },
    {
      id: 'r_fb_2',
      icon: 'clock',
      title: 'Buffer time allocation',
      description: 'Your afternoon looks heavy. Allocate 45 mins of buffer time at 3:30 PM.',
      impact: 'medium',
    },
    {
      id: 'r_fb_3',
      icon: 'brain',
      title: 'Peak performance hours',
      description: 'Your energy peaks between 9 AM and 11 AM. Schedule your hardest work then.',
      impact: 'high',
    },
  ]

  return { schedule, deadlineRisks, recommendations }
}

export const generateScheduleAI = async (tasks, currentDateTime = new Date()) => {
 

  try {
const model = getModel();

if (!model) {
  return generateMockSchedule(tasks);
}

    const activeTasks = tasks
  .filter((t) => !isCompleted(t))
  .sort((a, b) => {
    const priorityOrder = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    return new Date(a.deadline) - new Date(b.deadline);
  })
      .map((t) => ({
        id: t._id || t.id,
        title: t.title,
        description: t.description,
        priority: t.priority,
        deadline: t.deadline,
        category: t.category,
      }))
    const prompt = `
You are LifeSaver AI.

Current Date:
${currentDateTime.toDateString()}

Current Time:
${currentDateTime.toLocaleTimeString()}

Today's Tasks:
${JSON.stringify(activeTasks)}

Create the best daily schedule.

Rules:
- Schedule Critical tasks first.
- Then High.
- Then Medium.
- Then Low.
- Focus block = 60-120 minutes.
- Break = 15-30 minutes after every focus block.
- Add one afternoon buffer block.
- Do not schedule after 10 PM.
- No overlapping time blocks.
- If deadline is today or overdue, risk is "high".

Return ONLY valid JSON.

{
  "schedule":[
    {
      "id":"",
      "time":"",
      "duration":"",
      "task":"",
      "type":"focus",
      "risk":"low"
    }
  ],
  "deadlineRisks":[
    {
      "id":"",
      "task":"",
      "risk":"high",
      "probability":80,
      "suggestion":""
    }
  ],
  "recommendations":[
    {
      "id":"",
      "icon":"zap",
      "title":"",
      "description":"",
      "impact":"high"
    }
  ]
}
`  

const result = await Promise.race([
  callGemini(model, prompt),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Gemini Timeout after 30 seconds")), 30000)
  )
]);

const responseText = result.response.text()
const cleanText = responseText
  .replace(/```json\s*/gi, "")
  .replace(/```\s*/g, "")
  .trim();

return JSON.parse(cleanText);
  } catch (error) {
    return generateMockSchedule(tasks);
  }
}


export const prioritizeTasksAI = async (tasks) => {

  const model = getModel();

  if (!model) {
    return tasks.map((t) => ({
      id: t._id || t.id,
      title: t.title,
      priority: t.priority,
      reasoning: "Fallback prioritization.",
    }));
  }

  try {

    const taskInputs = tasks.map((t) => ({
      id: t._id || t.id,
      title: t.title,
      description: t.description,
      priority: t.priority,
      deadline: t.deadline,
      status: t.status,
    }))

   const prompt = `
You are LifeSaver AI.

Current Time:
${new Date().toISOString()}

Tasks:
${JSON.stringify(taskInputs)}

Analyse every task.

Priority Rules:

Critical
High
Medium
Low

Factors:
- Deadline
- Overdue
- Existing priority
- Importance

Return ONLY valid JSON.

[
  {
    "id":"",
    "priority":"critical",
    "reasoning":""
  }
]
`;

const result = await Promise.race([
  callGemini(model, prompt),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Gemini Timeout after 30 seconds")), 30000)
  )
]);

const responseText = result.response.text();
    const cleanText = responseText
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(cleanText);
  } catch (error) {
    return tasks.map((t) => ({
      id: t._id || t.id,
      priority: t.priority,
      reasoning: 'Fallback prioritization due to API error.',
    }))
  }
}

export const runRescueModeAI = async (tasks) => {

  const model = getModel();

  if (!model) {
    const activeTasks = tasks.filter((t) => !isCompleted(t));
    const criticalTasks = activeTasks.filter(
      (t) => t.priority === "critical" || t.priority === "high"
    );
    const lowPriorityTasks = activeTasks.filter(
      (t) => t.priority === "medium" || t.priority === "low"
    );

    const deferred = lowPriorityTasks.map((t) => t.title);

    const schedule = [
      {
        id: "rescue_1",
        time: "09:00",
        duration: "2h",
        task:
          criticalTasks.length > 0
            ? `🚨 ${criticalTasks[0].title}`
            : "Emergency Focus Session",
        type: "focus",
        risk: "high",
      },
      {
        id: "rescue_2",
        time: "11:00",
        duration: "20m",
        task: "Short Break",
        type: "break",
        risk: null,
      },
      {
        id: "rescue_3",
        time: "11:20",
        duration: "2h",
        task:
          criticalTasks.length > 1
            ? `🚨 ${criticalTasks[1].title}`
            : "Second Focus Session",
        type: "focus",
        risk: "high",
      },
    ];

    return {
      schedule,
      deferredTasks: deferred,
      recommendations: [
        {
          id: "rec1",
          icon: "zap",
          title: "Focus Mode",
          description: "Concentrate only on your highest priority tasks.",
          impact: "high",
        },
      ],
    };
  }

  try {
    const activeTasks = tasks
  .filter((t) => !isCompleted(t))
  .sort((a, b) => {
    const priorityOrder = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    return new Date(a.deadline) - new Date(b.deadline);
  })
  .map((t) => ({
    id: t._id || t.id,
    title: t.title,
    description: t.description,
    priority: t.priority,
    deadline: t.deadline,
    category: t.category,
  }));

    const prompt = `
You are LifeSaver AI Rescue Mode.

Current Time:
${new Date().toISOString()}

Tasks:
${JSON.stringify(activeTasks)}

The user is overloaded.

Create an emergency schedule.

Rules:

- Focus only on Critical and High tasks.
- Defer Medium and Low tasks.
- Maximum focus block 2 hours.
- Add 20 minute breaks.
- Add one buffer block.
- Never schedule after 10 PM.

Return ONLY valid JSON.

{
  "schedule":[
    {
      "id":"",
      "time":"",
      "duration":"",
      "task":"",
      "type":"focus",
      "risk":"high"
    }
  ],
  "deferredTasks":[
    ""
  ],
  "recommendations":[
    {
      "id":"",
      "icon":"zap",
      "title":"",
      "description":"",
      "impact":"high"
    }
  ]
}
`;

  const result = await Promise.race([
  callGemini(model, prompt),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Gemini Timeout after 30 seconds")), 30000)
  )
]);

  const responseText = result.response.text()
  const cleanText = responseText
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(cleanText);
  } catch (error) {
    // Fall back to local solver
    return {
  schedule: [
    {
      id: "fallback1",
      time: "09:00",
      duration: "2h",
      task: "🚨 Highest Priority Task",
      type: "focus",
      risk: "high",
    },
    {
      id: "fallback2",
      time: "11:00",
      duration: "20m",
      task: "Short Break",
      type: "break",
      risk: null,
    },
    {
    id: "fallback3",
    time: "11:20",
    duration: "90m",
    task: "🚨 Second Highest Priority Task",
    type: "focus",
    risk: "medium"
}
    
  ],

  deferredTasks: [],

  recommendations: [
    {
      id: "r1",
      icon: "zap",
      title: "Focus Mode",
      description: "Complete one task before starting another.",
      impact: "high",
    }
  ]
}
  }
}

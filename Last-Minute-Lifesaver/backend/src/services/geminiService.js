import { GoogleGenerativeAI } from '@google/generative-ai'
console.log("Gemini Service Key:", process.env.GEMINI_API_KEY);
// Initialize Gemini API client if key is available

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

// Graceful fallback for schedule generation when no API Key is available
const generateMockSchedule = (tasks) => {
  const activeTasks = tasks.filter((t) => t.status !== 'done')
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
console.log("1. Model Created");

if (!model) {
  console.warn("GEMINI_API_KEY is not defined.");
  return generateMockSchedule(tasks);
}

    const activeTasks = tasks
  .filter((t) => t.status !== "done")
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
      You are LifeSaver AI, an expert productivity planner.
      Current Date/Time: ${currentDateTime.toISOString()}
      User's Active Tasks: ${JSON.stringify(activeTasks)}
      Total Tasks: ${activeTasks.length}

Current Time: ${new Date().toLocaleTimeString()}

Today: ${new Date().toDateString()}

       
Return ONLY valid JSON.

Do not include markdown, code fences or explanations.

The response must be directly parseable using JSON.parse().

       
      
      
      Return a JSON object exactly like this:

      Keep all task ids unchanged.

{
  "schedule": [
    {
      "id": "",
      "time": "",
      "duration": "",
      "task": "",
      "type": "focus",
      "risk": "low"
    }
  ],

  "deadlineRisks": [
    {
      "id": "",
      "task": "",
      "risk": "low",
      "probability": 0,
      "suggestion": ""
    }
  ],

  "recommendations": [
    {
      "id": "",
      "icon": "zap",
      "title": "",
      "description": "",
      "impact": "high"
    }
  ]
}
      Requirements:

1. Allocate focus blocks for critical and high priority tasks first.

2. Insert breaks every 90–120 minutes.

3. Create a buffer block in the afternoon.

4. Highlight deadline risks.

5. Limit focus sessions to a maximum of 2 hours.

6. Insert a 15–30 minute break after every focus block.

7. Do not schedule work after 10 PM.

8. Never create overlapping time blocks.
    `
console.log("Before Gemini Schedule");
console.log("Sending request to Gemini...");
console.log("Prompt Length:", prompt.length);
console.time("Gemini Request");
   const result = await Promise.race([
  model.generateContent(prompt),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Gemini Timeout after 30 seconds")), 30000)
  )
]);
    console.timeEnd("Gemini Request");
console.log("Request completed");
    console.log("After Gemini Schedule");
    console.log("Gemini Response Received");
    const responseText = result.response.text()
    console.log(responseText);
   const cleanText = responseText
  .replace(/```json\s*/gi, "")
  .replace(/```\s*/g, "")
  .trim();

return JSON.parse(cleanText);
  } catch (error) {
    console.error("FULL GEMINI ERROR");
    console.error(error);

    if (error.stack) {
        console.error(error.stack);
    }

    return generateMockSchedule(tasks);
}
}


export const prioritizeTasksAI = async (tasks) => {

  const model = getModel();
  console.log("Prioritize Model Created");

  if (!model) {
    console.warn("GEMINI_API_KEY is not defined. Using fallback prioritization.");

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
      You are LifeSaver AI, a task prioritization engine.
      Analyze these tasks: ${JSON.stringify(taskInputs)}
      Current Date/Time: ${new Date().toISOString()}
    Return ONLY valid JSON.

Do not include markdown, code fences or explanations.

The response must be directly parseable using JSON.parse().

      Recommend the optimal priority level for each active task ("critical", "high", "medium", "low") based on:

- deadline proximity
- current priority
- task importance
- overdue status

Keep the original task id unchanged.

If a deadline is overdue, always assign "critical".

Never downgrade a task that is due today.

Provide a brief reasoning statement (maximum 15 words).
     Return a JSON array exactly like this:

[
  {
    "id": "",
    "priority": "high",
    "reasoning": ""
  }
]
    `
console.log("Before Gemini Prioritize");
console.log("Sending request to Gemini...");
console.log("Prompt Length:", prompt.length);
console.time("Gemini Request");
    const result = await Promise.race([
  model.generateContent(prompt),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Gemini Timeout after 30 seconds")), 30000)
  )
]);
    console.timeEnd("Gemini Request");
console.log("Request completed");
    console.log("After Gemini Prioritize");
    console.log("Gemini Response Received");
    const responseText = result.response.text()
    console.log(responseText);
    const cleanText = responseText
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(cleanText);
  } catch (error) {
    console.error('Gemini API Error (prioritizeTasksAI):', error)
    return tasks.map((t) => ({
      id: t._id || t.id,
      priority: t.priority,
      reasoning: 'Fallback prioritization due to API error.',
    }))
  }
}

export const runRescueModeAI = async (tasks) => {

  const model = getModel();
  console.log("Rescue Model Created");

  if (!model) {
    console.warn("GEMINI_API_KEY is not defined. Simulating Rescue Mode.");

    const activeTasks = tasks.filter((t) => t.status !== "done");
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
    console.log("Calling Gemini...");
    console.log("Gemini Returned");

if (!model) {
  throw new Error("Gemini model not initialized");
}

    const activeTasks = tasks
  .filter((t) => t.status !== "done")
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
      You are LifeSaver AI, entering RESCUE MODE.
      The user is heavily overloaded and at risk of missing critical deadlines.
      Current Date/Time: ${new Date().toISOString()}
      User's Active Tasks: ${JSON.stringify(activeTasks)}
      Total Tasks: ${activeTasks.length}

Current Time: ${new Date().toLocaleTimeString()}

Today: ${new Date().toDateString()}

      You are an expert productivity coach.

Your only goal is to help the user finish the maximum amount of important work today.

Ignore medium and low priority work if deadlines are close.

Always prioritize:

1. Critical deadlines
2. High priority work
3. Earliest deadlines
4. Short tasks

Create the most realistic emergency schedule possible.



Requirements:

1. Limit focus sessions to a maximum of 2 hours.

2. Insert a 15-30 minute break after every focus block.

3. Do not schedule work after 10 PM.

4. Never create overlapping time blocks.

- Return ONLY valid JSON.

- Do not wrap the response inside markdown code blocks.

- Never return anything except JSON.

Defer (postpone/delay) any medium or low priority tasks that are not due immediately. 
      Create a highly concentrated, time-blocked emergency schedule (mostly long focus sessions and short breaks) focusing ONLY on the most critical tasks.

    Return a JSON object exactly like this:
    Keep all task ids unchanged.

{
  "schedule": [
    {
      "id": "",
      "time": "",
      "duration": "",
      "task": "",
      "type": "focus",
      "risk": "high"
    }
  ],

  "deferredTasks": [
    ""
  ],

  "recommendations": [
    {
      "id": "",
      "icon": "zap",
      "title": "",
      "description": "",
      "impact": "high"
    }
  ]
}
    `
  console.log("Before Gemini Rescue");
  console.log("Sending request to Gemini...");
  console.log("Prompt Length:", prompt.length);
console.time("Gemini Request");
    const result = await Promise.race([
  model.generateContent(prompt),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Gemini Timeout after 30 seconds")), 30000)
  )
]);
    console.timeEnd("Gemini Request");
console.log("Request completed");
    console.log("After Gemini Rescue");
    console.log("Gemini Response Received");
    const responseText = result.response.text()
    console.log(responseText);
    const cleanText = responseText
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(cleanText);
  } catch (error) {
    console.error('Gemini API Error (runRescueModeAI):', error)
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
  


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let chart;

let xp =
parseInt(
localStorage.getItem("xp")
) || 0;

let streak =
parseInt(
localStorage.getItem("streak")
) || 0;

/* ==========================
   STORAGE
========================== */

function saveTasks(){

localStorage.setItem(
"tasks",
JSON.stringify(tasks)
);

}

/* ==========================
   CLEAR INPUTS
========================== */

function clearInputs(){

document.getElementById(
"taskName"
).value="";

document.getElementById(
"taskHours"
).value="";

document.getElementById(
"taskImportance"
).value="";

document.getElementById(
"taskDeadline"
).value="";

}

/* ==========================
   ADD TASK
========================== */

function addTask(){

const name =
document.getElementById(
"taskName"
).value.trim();

const hours =
parseInt(
document.getElementById(
"taskHours"
).value
);

const importance =
parseInt(
document.getElementById(
"taskImportance"
).value
);

const deadline =
document.getElementById(
"taskDeadline"
).value;

if(
!name ||
!hours ||
!importance ||
!deadline
){
alert(
"Please fill all fields"
);
return;
}

const today =
new Date();

const dueDate =
new Date(deadline);

const daysLeft =
Math.max(
1,
Math.ceil(
(dueDate-today)/
(1000*60*60*24)
)
);

const urgency =
daysLeft <= 1 ? 10 :
daysLeft <= 3 ? 8 :
daysLeft <= 7 ? 5 : 2;

const priorityScore =
(importance*4)+
(urgency*6)+
(hours*1.5);

const missProbability =
Math.min(
95,
Math.round(
(hours*10)/
daysLeft
)
);

const successChance =
100 -
missProbability;

const task = {

id:Date.now(),

name,

hours,

importance,

deadline,

priorityScore,

missProbability,

successChance,

completed:false

};

tasks.push(task);

saveTasks();

clearInputs();

showNotification(
"✅ Task Added"
);

renderTasks();

}

/* ==========================
   COMPLETE TASK
========================== */

function completeTask(id){

const task =
tasks.find(
t=>t.id===id
);

if(
task &&
!task.completed
){

task.completed=true;

xp += 20;

localStorage.setItem(
"xp",
xp
);

showNotification(
"🏆 +20 XP Earned"
);

}

saveTasks();

renderTasks();

}

/* ==========================
   DELETE TASK
========================== */

function deleteTask(id){

tasks =
tasks.filter(
task =>
task.id !== id
);

saveTasks();

renderTasks();

}

/* ==========================
   GAMIFICATION
========================== */

function updateGamification(){

const xpBox =
document.getElementById(
"xpPoints"
);

if(xpBox){

xpBox.innerText = xp;

}

let level =
"Beginner";

if(xp>=100)
level=
"Productivity Pro";

if(xp>=200)
level=
"Deadline Slayer";

if(xp>=300)
level=
"AI Master";

const levelBox =
document.getElementById(
"userLevel"
);

if(levelBox){

levelBox.innerText =
level;

}

const streakBox =
document.getElementById(
"streakDays"
);

if(streakBox){

streakBox.innerText =
streak;

}

}
/* ==========================
   RENDER TASKS
========================== */

function renderTasks(){

const taskList =
document.getElementById(
"taskList"
);

const riskList =
document.getElementById(
"riskList"
);

taskList.innerHTML="";
riskList.innerHTML="";

tasks.sort(
(a,b)=>
b.priorityScore-
a.priorityScore
);

let highRiskCount=0;

tasks.forEach(task=>{

const daysLeft =
Math.max(
0,
Math.ceil(
(
new Date(task.deadline)
-
new Date()
)
/
(1000*60*60*24)
)
);

let risk="Low";
let riskClass="risk-low";

if(daysLeft<=1){

risk="High";

riskClass=
"risk-high";

highRiskCount++;

}
else if(daysLeft<=3){

risk="Medium";

riskClass=
"risk-medium";

}

taskList.innerHTML += `

<div class="task-item">

<h3>
${task.name}
</h3>

<p>
⭐ Priority Score:
${Math.round(
task.priorityScore
)}
</p>

<p>
📅 Deadline:
${task.deadline}
</p>

<p>
⏳ ${daysLeft}
day(s) left
</p>

<p>
🎯 Success Chance:
${task.successChance}%
</p>

<p>
⚠ Miss Probability:
${task.missProbability}%
</p>

<p>
${
task.completed
?
"✅ Completed"
:
"⌛ Pending"
}
</p>

<div class="progress-container">
<div class="progress-bar">
</div>
</div>

<button
onclick=
"completeTask(${task.id})">
Complete
</button>

<button
onclick=
"deleteTask(${task.id})">
Delete
</button>

</div>

`;

riskList.innerHTML += `

<p class="${riskClass}">
${task.name}
→ ${risk} Risk
</p>

`;

});

updateStats(
highRiskCount
);

generateRecommendations();

updateGamification();

updateChart();

}

/* ==========================
   STATS
========================== */

function updateStats(
highRiskCount
){

document.getElementById(
"totalTasks"
).innerText =
tasks.length;

document.getElementById(
"highRiskTasks"
).innerText =
highRiskCount;

const completed =
tasks.filter(
t=>t.completed
).length;

document.getElementById(
"completedTasks"
).innerText =
completed;

const productivityScore =
tasks.length===0
?
0
:
Math.round(
(
completed/
tasks.length
)
*100
);

document.getElementById(
"productivityScore"
).innerText =
productivityScore;

const banner =
document.getElementById(
"alertBanner"
);

if(highRiskCount>0){

banner.innerHTML =
`🚨 ${highRiskCount}
High Risk Task(s)
Need Attention`;

banner.style.background =
"#ef4444";

}
else{

banner.innerHTML =
"✅ Everything Looks Good";

banner.style.background =
"#22c55e";

}

}

/* ==========================
   AI RECOMMENDATIONS
========================== */

function generateRecommendations(){

const recommendations =
document.getElementById(
"recommendations"
);

recommendations.innerHTML="";

const completed =
tasks.filter(
t=>t.completed
).length;

recommendations.innerHTML +=
`<p>📌 Break large tasks into smaller milestones.</p>`;

recommendations.innerHTML +=
`<p>⏰ Use 25 minute focus sessions.</p>`;

recommendations.innerHTML +=
`<p>🎯 Complete high-risk tasks first.</p>`;

if(completed>=3){

recommendations.innerHTML +=
`<p>🏆 Achievement:
Productivity Starter</p>`;

}

if(completed>=5){

recommendations.innerHTML +=
`<p>🥇 Achievement:
Task Crusher</p>`;

}

if(completed>=10){

recommendations.innerHTML +=
`<p>👑 Achievement:
Deadline Master</p>`;

}

}

/* ==========================
   AI PLANNER
========================== */

function generatePlanner(){

const planner =
document.getElementById(
"plannerOutput"
);

planner.innerHTML="";

if(tasks.length===0){

planner.innerHTML=
"No Tasks Found";

return;

}

tasks.forEach(task=>{

planner.innerHTML += `

<p>

📅 ${task.name}

→ Allocate

${task.hours}
hour(s)

before

${task.deadline}

</p>

`;

});

}

/* ==========================
   RESCUE MODE
========================== */

function generateRescuePlan(){

const rescue =
document.getElementById(
"rescueOutput"
);

rescue.innerHTML="";

const urgentTasks =
tasks.filter(task=>{

const daysLeft =
Math.ceil(
(
new Date(task.deadline)
-
new Date()
)
/
(1000*60*60*24)
);

return daysLeft<=2;

});

if(
urgentTasks.length===0
){

rescue.innerHTML =
"🎉 No urgent deadlines.";

return;

}

urgentTasks.forEach(task=>{

rescue.innerHTML += `

<h4>
🚨 ${task.name}
</h4>

<p>
6 PM → Start Work
</p>

<p>
7 PM → Reach 50%
</p>

<p>
8 PM → Review
</p>

<p>
9 PM → Final Submission
</p>

<hr>

`;

});

}
/* ==========================
   AI CHAT ASSISTANT
========================== */

function sendMessage(){

const input =
document.getElementById(
"chatInput"
);

const msg =
input.value.trim();

if(!msg){
return;
}

const chat =
document.getElementById(
"chatMessages"
);

chat.innerHTML +=
`<p><b>You:</b> ${msg}</p>`;

let reply = "";

const lower =
msg.toLowerCase();

if(
lower.includes("deadline")
){

reply =
"Focus on high-priority tasks first and activate Rescue Mode.";

}
else if(
lower.includes("assignment")
){

reply =
"Break the assignment into research, draft and review phases.";

}
else if(
lower.includes("exam")
){

reply =
"Use 45-minute focus sessions and revise weak topics first.";

}
else if(
lower.includes("project")
){

reply =
"Complete core features first, then polish UI and documentation.";

}
else{

reply =
"Prioritize urgent tasks and avoid multitasking.";

}

chat.innerHTML +=
`<p><b>Guardian AI:</b> ${reply}</p>`;

chat.scrollTop =
chat.scrollHeight;

input.value = "";

}

/* ==========================
   VOICE INPUT
========================== */

function startVoice(){

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

if(!SpeechRecognition){

alert(
"Voice recognition not supported in this browser."
);

return;

}

const recognition =
new SpeechRecognition();

recognition.start();

recognition.onresult =
function(event){

const transcript =
event.results[0][0].transcript;

document.getElementById(
"taskName"
).value =
transcript;

showNotification(
"🎤 Voice captured"
);

};

}

/* ==========================
   PRODUCTIVITY REPORT
========================== */

function downloadReport(){

let report =

"DEADLINE GUARDIAN AI REPORT\n\n";

report +=
"Total Tasks: " +
tasks.length +
"\n\n";

tasks.forEach(task=>{

report +=
`Task: ${task.name}
Deadline: ${task.deadline}
Priority Score: ${task.priorityScore}
Success Chance: ${task.successChance}%
Completed: ${task.completed}

`;

});

const blob =
new Blob(
[report],
{
type:"text/plain"
}
);

const a =
document.createElement(
"a"
);

a.href =
URL.createObjectURL(
blob
);

a.download =
"DeadlineGuardianReport.txt";

a.click();

showNotification(
"📄 Report Downloaded"
);

}

/* ==========================
   TOAST NOTIFICATION
========================== */

function showNotification(text){

const toast =
document.getElementById(
"toast"
);

if(!toast){
return;
}

toast.innerHTML =
text;

toast.style.display =
"block";

setTimeout(()=>{

toast.style.display =
"none";

},2500);

}

/* ==========================
   ANALYTICS CHART
========================== */

function updateChart(){

const completed =
tasks.filter(
t=>t.completed
).length;

const pending =
tasks.length -
completed;

const ctx =
document.getElementById(
"analyticsChart"
);

if(!ctx){
return;
}

if(chart){

chart.destroy();

}

chart =
new Chart(ctx,{

type:"doughnut",

data:{

labels:[
"Completed",
"Pending"
],

datasets:[{

data:[
completed,
pending
]

}]

},

options:{

responsive:true,

maintainAspectRatio:false

}

});

}

/* ==========================
   THEME TOGGLE
========================== */

const themeBtn =
document.getElementById(
"themeToggle"
);

if(themeBtn){

themeBtn.addEventListener(
"click",
()=>{

document.body.classList.toggle(
"light-mode"
);

}
);

}

/* ==========================
   DAILY STREAK
========================== */

function updateStreak(){

const today =
new Date()
.toDateString();

const lastVisit =
localStorage.getItem(
"lastVisit"
);

if(
lastVisit !== today
){

streak++;

localStorage.setItem(
"streak",
streak
);

localStorage.setItem(
"lastVisit",
today
);

}

}

/* ==========================
   INITIALIZATION
========================== */

updateStreak();

renderTasks();

showNotification(
"🚀 Deadline Guardian AI Ready"
);
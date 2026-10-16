const courses = [
  {name:"UPSC", icon:"🏛️", desc:"Civil Services, State PSC and CSE-CSAT preparation."},
  {name:"Banking", icon:"🏦", desc:"PO, Clerk, SO and other banking recruitment exams."},
  {name:"SSC", icon:"📘", desc:"CGL, CHSL, GD, Stenographer and related exams."},
  {name:"NET / SET", icon:"🎓", desc:"UGC NET, CSIR NET and State Eligibility Tests."}
];
const resourceTypes = ["Syllabus PDF","Notes PDF","Practice Series","PYQ Series"];
const starterNotices = [
  {id:1,title:"Welcome to ReasonIQ99",desc:"Course resources and exam updates will be published here. Please verify important dates through the official exam authority.",link:"",date:new Date().toISOString()},
  {id:2,title:"Prepare consistently with practice sets",desc:"Use the course section to organise your syllabus, notes, practice and previous-year questions.",link:"",date:new Date(Date.now()-86400000).toISOString()}
];
const load = (key, fallback) => { try { const v=localStorage.getItem(key); return v?JSON.parse(v):fallback; } catch(e){return fallback;} };
let notices = load("riq99_notices", starterNotices);
let resources = load("riq99_resources", []);
const $ = id => document.getElementById(id);
$("year").textContent = new Date().getFullYear();

function renderCourses(){
  $("courseGrid").innerHTML = courses.map(c => {
    const buttons = resourceTypes.map(t => `<button class="resource-btn" data-course="${c.name}" data-type="${t}">${t}</button>`).join("");
    const count = resources.filter(r=>r.course===c.name).length;
    return `<article class="course-card"><div class="course-icon">${c.icon}</div><h3>${c.name}</h3><p>${c.desc}</p><div class="resource-list">${buttons}</div><div class="resource-status">${count?`${count} resource(s) attached in this browser`:"Resources can be attached using Admin Tools."}</div></article>`;
  }).join("");
  document.querySelectorAll(".resource-btn").forEach(btn=>btn.addEventListener("click",()=>showResources(btn.dataset.course,btn.dataset.type)));
}
function safe(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderNotices(){
  notices.sort((a,b)=>new Date(b.date)-new Date(a.date));
  $("notificationList").innerHTML = notices.map(n=>`<article class="notice-card"><div><h3>${safe(n.title)}</h3><p>${safe(n.desc)}</p><div class="notice-date">${new Date(n.date).toLocaleDateString()}</div></div><button data-id="${n.id}">View details →</button></article>`).join("");
  document.querySelectorAll(".notice-card button").forEach(b=>b.addEventListener("click",()=>showNotice(Number(b.dataset.id))));
  $("tickerText").textContent = notices[0]?.title || "No notifications have been added yet.";
}
function showNotice(id){
  const n=notices.find(x=>Number(x.id)===id); if(!n)return;
  $("noticeDetailContent").innerHTML=`<p class="eyebrow">Notification details</p><h3>${safe(n.title)}</h3><p>${safe(n.desc)}</p><p class="notice-date">Published: ${new Date(n.date).toLocaleDateString()}</p>${n.link?`<p><b>Official link:</b> <a href="${safe(n.link)}" target="_blank" rel="noopener">${safe(n.link)}</a></p>`:"<p>No official link has been added. Check the relevant official exam website.</p>"}`;
  $("noticeDetail").classList.remove("hidden");
}
$("closeDetail").addEventListener("click",()=>$("noticeDetail").classList.add("hidden"));
$("noticeDetail").addEventListener("click",e=>{if(e.target===$("noticeDetail"))$("noticeDetail").classList.add("hidden")});
function showResources(course,type){
  const found=resources.filter(r=>r.course===course&&r.type===type);
  $("noticeDetailContent").innerHTML=`<p class="eyebrow">${safe(course)} resources</p><h3>${safe(type)}</h3>${found.length?found.map(r=>`<p>📎 <a href="${r.data}" download="${safe(r.name)}">${safe(r.name)}</a> <small>(${(r.size/1024).toFixed(0)} KB)</small></p>`).join(""):"<p>No file has been attached for this category yet. An administrator can add resources using Admin Tools.</p>"}`;
  $("noticeDetail").classList.remove("hidden");
}
$("adminToggle").addEventListener("click",()=>$("adminTools").classList.toggle("hidden"));
$("unlockAdmin").addEventListener("click",()=>{
  if($("adminPass").value==="IQ99ADMIN"){$("adminForm").classList.remove("hidden");$("unlockAdmin").textContent="Unlocked";$("unlockAdmin").disabled=true;}
  else alert("Incorrect demo passcode.");
});
$("addNotice").addEventListener("click",()=>{
  const title=$("newNoticeTitle").value.trim(), desc=$("newNoticeDesc").value.trim(), link=$("newNoticeLink").value.trim();
  if(!title||!desc){alert("Please enter a title and short details.");return;}
  if(link && !/^https?:\/\//i.test(link)){alert("Please enter a valid link beginning with http:// or https://");return;}
  notices.unshift({id:Date.now(),title,desc,link,date:new Date().toISOString()});
  localStorage.setItem("riq99_notices",JSON.stringify(notices));renderNotices();
  $("newNoticeTitle").value="";$("newNoticeDesc").value="";$("newNoticeLink").value="";
});
$("saveResource").addEventListener("click",()=>{
  const file=$("resourceFile").files[0];if(!file){alert("Choose a file first.");return;}
  if(file.size>2*1024*1024){alert("For this browser demo, choose a file under 2 MB. Live websites should store files on a server.");return;}
  const reader=new FileReader();
  reader.onload=()=>{
    resources.push({course:$("uploadCourse").value,type:$("uploadType").value,name:file.name,size:file.size,data:reader.result});
    try{localStorage.setItem("riq99_resources",JSON.stringify(resources));renderCourses();alert("Resource attached in this browser.");}
    catch(e){resources.pop();alert("Browser storage is full. Use server-side file storage for a real website.");}
    $("resourceFile").value="";
  };
  reader.readAsDataURL(file);
});
$("menuToggle").addEventListener("click",()=>{const nav=$("mainNav");nav.classList.toggle("open");$("menuToggle").setAttribute("aria-expanded",nav.classList.contains("open")?"true":"false");});
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>$("mainNav").classList.remove("open")));
renderCourses();renderNotices();

(() => {
  "use strict";
  const STORAGE_KEY = "flowdesk.requests.v1";
  const STATUSES = ["Submitted","Under review","Awaiting approval","Approved","Rejected","In progress","Completed","Cancelled"];
  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const isoNow = () => new Date().toISOString();
  const dateText = (value) => { if(!value) return "—"; const d = new Date(value); return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"}); };
  const stamp = (value) => { if(!value) return ""; const d=new Date(value); return Number.isNaN(d.getTime()) ? "" : d.toLocaleString(); };
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z]+/g,"-").replace(/^-|-$/g,"");
  const uid = () => "REQ-" + Date.now().toString(36).toUpperCase().slice(-5) + Math.random().toString(36).slice(2,5).toUpperCase();
  const sample = [
    {id:"REQ-1042",title:"Access to analytics workspace",description:"Need access to the approved reporting workspace to prepare the monthly service dashboard.",category:"Access",priority:"High",status:"Awaiting approval",requester:"alex@example.com",assignee:"IT Support",approvalRequired:true,approvalDecision:"Pending",createdAt:new Date(Date.now()-86400000*1.2).toISOString(),updatedAt:new Date(Date.now()-3600000*4).toISOString(),history:[{at:new Date(Date.now()-86400000*1.2).toISOString(),text:"Request created"},{at:new Date(Date.now()-3600000*4).toISOString(),text:"Moved to Awaiting approval"}]},
    {id:"REQ-1041",title:"Replace damaged keyboard",description:"Several keys on the assigned workstation are not responding.",category:"Equipment",priority:"Low",status:"In progress",requester:"sam@example.com",assignee:"Workplace Support",approvalRequired:false,approvalDecision:"Not required",createdAt:new Date(Date.now()-86400000*2).toISOString(),updatedAt:new Date(Date.now()-3600000*10).toISOString(),history:[{at:new Date(Date.now()-86400000*2).toISOString(),text:"Request created"},{at:new Date(Date.now()-3600000*10).toISOString(),text:"Assigned to Workplace Support"}]},
    {id:"REQ-1040",title:"Install approved design tool",description:"Requesting the approved design tool for a project mockup.",category:"Software",priority:"Normal",status:"Completed",requester:"jordan@example.com",assignee:"App Support",approvalRequired:false,approvalDecision:"Not required",createdAt:new Date(Date.now()-86400000*4).toISOString(),updatedAt:new Date(Date.now()-86400000).toISOString(),history:[{at:new Date(Date.now()-86400000*4).toISOString(),text:"Request created"},{at:new Date(Date.now()-86400000).toISOString(),text:"Request completed"}]},
    {id:"REQ-1039",title:"Temporary shared-folder access",description:"Need temporary access to a project folder for the reporting cycle.",category:"Access",priority:"Normal",status:"Submitted",requester:"morgan@example.com",assignee:"Unassigned",approvalRequired:true,approvalDecision:"Pending",createdAt:new Date(Date.now()-86400000*0.4).toISOString(),updatedAt:new Date(Date.now()-86400000*0.4).toISOString(),history:[{at:new Date(Date.now()-86400000*0.4).toISOString(),text:"Request created"}]}
  ];
  let requests = load();
  let currentView = "dashboard";
  let toastTimer;
  function load(){
    try { const raw=localStorage.getItem(STORAGE_KEY); if(raw!==null){const v=JSON.parse(raw); if(Array.isArray(v)) return v;} }
    catch(e){ console.warn("Could not read local demo storage",e); }
    return sample.map(x=>({...x,history:x.history.map(h=>({...h}))}));
  }
  function save(){
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify(requests)); return true; }
    catch(e){ notify("Browser storage is unavailable. Changes may not persist."); return false; }
  }
  function notify(message){
    const el=$("toast"); el.textContent=message; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2600);
  }
  function go(view){
    currentView=view;
    document.querySelectorAll(".view").forEach(el=>el.classList.add("hidden"));
    const target=$("view-"+view); if(target) target.classList.remove("hidden");
    document.querySelectorAll(".nav-item").forEach(el=>el.classList.toggle("active",el.dataset.view===view || (view==="detail" && el.dataset.view==="requests")));
    const titles={dashboard:"Overview",requests:"All requests",new:"New request",detail:"Request details",assistant:"Help assistant"};
    $("page-title").textContent=titles[view]||"FlowDesk";
    if(view==="dashboard") renderDashboard();
    if(view==="requests") renderRequests();
    if(view==="new") { if(!$("edit-id").value) resetForm(); }
    if(view==="assistant") $("chat-input").focus();
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function badge(status){return '<span class="badge status-'+slug(status)+'">'+esc(status)+'</span>';}
  function priority(p){return '<span class="priority-'+slug(p)+'">'+esc(p)+'</span>';}
  function sorted(){return [...requests].sort((a,b)=>new Date(b.updatedAt||b.createdAt)-new Date(a.updatedAt||a.createdAt));}
  function renderDashboard(){
    const open=requests.filter(r=>!["Completed","Rejected","Cancelled"].includes(r.status)).length;
    const pending=requests.filter(r=>["Submitted","Under review","Awaiting approval"].includes(r.status)).length;
    const approvals=requests.filter(r=>r.approvalRequired && r.approvalDecision==="Pending").length;
    const completed=requests.filter(r=>r.status==="Completed").length;
    const cards=[
      ["Total requests",requests.length,"All recorded items","▤","#f0edff","#6658d3"],
      ["Open requests",open,"Not yet closed","◷","#eaf4ff","#2875bd"],
      ["Need approval",approvals,"Waiting for a decision","✓","#fff3df","#a86412"],
      ["Completed",completed,"Successfully closed","↗","#e4f7ee","#17845d"]
    ];
    $("stats").innerHTML=cards.map(c=>'<div class="stat-card"><div class="stat-top">'+c[0]+'<span class="stat-icon" style="background:'+c[4]+';color:'+c[5]+'">'+c[3]+'</span></div><div class="stat-value">'+c[1]+'</div><div class="stat-foot">'+c[2]+'</div></div>').join("");
    const list=sorted().slice(0,5);
    $("recent-requests").innerHTML=list.length?list.map(r=>'<div class="request-row"><div><button class="request-title" data-detail="'+esc(r.id)+'">'+esc(r.title)+'</button><div class="request-meta">'+esc(r.id)+' · '+esc(r.category)+' · '+dateText(r.createdAt)+'</div></div><div class="row-right">'+badge(r.status)+'</div></div>').join(""):'<div class="empty"><b>No requests yet</b><p>Create a request to get started.</p></div>';
  }
  function renderRequests(){
    const q=$("search").value.trim().toLowerCase(), status=$("status-filter").value, pri=$("priority-filter").value;
    const list=sorted().filter(r=>(!q||[r.id,r.title,r.description,r.category,r.requester,r.assignee].join(" ").toLowerCase().includes(q))&&(!status||r.status===status)&&(!pri||r.priority===pri));
    $("request-table").innerHTML=list.map(r=>'<tr><td><button class="request-title" data-detail="'+esc(r.id)+'">'+esc(r.title)+'</button><div class="request-meta">'+esc(r.id)+'</div></td><td>'+esc(r.category)+'</td><td>'+priority(r.priority)+'</td><td>'+badge(r.status)+'</td><td>'+esc(r.assignee||"Unassigned")+'</td><td>'+dateText(r.createdAt)+'</td><td><div class="table-actions"><button class="small-btn" data-detail="'+esc(r.id)+'">Open</button></div></td></tr>').join("");
    $("empty-state").classList.toggle("hidden",list.length>0);
    $("request-table").parentElement.classList.toggle("hidden",list.length===0);
  }
  function resetForm(){
    $("request-form").reset(); $("edit-id").value=""; $("form-heading").textContent="Create a request"; $("submit-label").textContent="Create request →";
    const savedEmail=localStorage.getItem("flowdesk.requester.email"); if(savedEmail) $("requester").value=savedEmail;
  }
  function submitRequest(event){
    event.preventDefault();
    const editId=$("edit-id").value;
    const title=$("title").value.trim(), description=$("description").value.trim(), category=$("category").value, priorityValue=$("priority").value, requester=$("requester").value.trim();
    if(!title||!description||!category||!requester){notify("Please complete all required fields.");return;}
    const existing=editId?requests.find(r=>r.id===editId):null;
    const now=isoNow();
    if(existing){
      Object.assign(existing,{title,description,category,priority:priorityValue,requester,assignee:$("assignee").value.trim()||"Unassigned",approvalRequired:$("approval-required").checked,updatedAt:now});
      if(existing.approvalRequired && !["Approved","Rejected"].includes(existing.approvalDecision)){existing.approvalDecision="Pending";if(existing.status==="Submitted")existing.status="Awaiting approval";}
      existing.history=existing.history||[]; existing.history.unshift({at:now,text:"Request details updated"});
      notify("Request updated.");
    }else{
      const requires=$("approval-required").checked;
      const item={id:uid(),title,description,category,priority:priorityValue,status:requires?"Awaiting approval":"Submitted",requester,assignee:$("assignee").value.trim()||"Unassigned",approvalRequired:requires,approvalDecision:requires?"Pending":"Not required",createdAt:now,updatedAt:now,history:[{at:now,text:"Request created"+(requires+"")}]};
      item.history[0].text=requires?"Request created; approval required":"Request created";
      requests.unshift(item); notify("Request "+item.id+" created.");
    }
    try{localStorage.setItem("flowdesk.requester.email",requester);}catch(e){}
    save(); resetForm(); go("requests");
  }
  function detail(id){
    const r=requests.find(x=>x.id===id); if(!r){notify("That request could not be found.");go("requests");return;}
    $("detail-content").innerHTML='<div class="detail-header"><div><h2>'+esc(r.title)+'</h2><p>'+esc(r.id)+' · Created '+dateText(r.createdAt)+'</p></div><div class="detail-actions"><button class="secondary-btn" data-edit="'+esc(r.id)+'">Edit request</button><button class="secondary-btn" data-go="requests">← Back</button></div></div><div class="detail-grid"><div><section class="detail-card"><h3>Request information</h3><div class="detail-fields"><div><div class="field-label">STATUS</div>'+badge(r.status)+'</div><div><div class="field-label">PRIORITY</div>'+priority(r.priority)+'</div><div><div class="field-label">CATEGORY</div><div class="field-value">'+esc(r.category)+'</div></div><div><div class="field-label">REQUESTER</div><div class="field-value">'+esc(r.requester)+'</div></div><div><div class="field-label">ASSIGNED TO</div><div class="field-value">'+esc(r.assignee||"Unassigned")+'</div></div><div><div class="field-label">CREATED</div><div class="field-value">'+dateText(r.createdAt)+'</div></div></div><h3 style="margin-top:24px">Description</h3><div class="detail-description">'+esc(r.description)+'</div></section><section class="detail-card"><h3>Activity history</h3>'+(r.history||[]).map(h=>'<div class="history-item"><b>'+esc(h.text)+'</b><div>'+esc(stamp(h.at))+'</div></div>').join("")+'</section></div><div><section class="detail-card"><h3>Update workflow</h3><label class="field-label" for="detail-status">REQUEST STATUS</label><select id="detail-status" style="width:100%;margin:7px 0 16px">'+STATUSES.map(s=>'<option '+(s===r.status?"selected":"")+'>'+s+'</option>').join("")+'</select><label class="field-label" for="detail-assignee">ASSIGNED TO</label><input id="detail-assignee" value="'+esc(r.assignee||"")+'" placeholder="Person or queue" style="width:100%;margin:7px 0 16px"><button class="primary-btn" id="save-workflow" style="width:100%">Save workflow changes</button><div class="tip"><b>Approval decision</b><p>Required: '+(r.approvalRequired?"Yes":"No")+' · Decision: '+esc(r.approvalDecision||"Not required")+'</p><div class="detail-actions" style="margin-top:10px">'+(r.approvalRequired?'<button class="small-btn" data-approval="Approved" data-id="'+esc(r.id)+'">Approve</button><button class="small-btn" data-approval="Rejected" data-id="'+esc(r.id)+'">Reject</button>':'<span class="muted">No approval required for this request.</span>')+'</div></div><button class="small-btn" data-delete="'+esc(r.id)+'" style="margin-top:16px;color:#b33343">Delete demo request</button></section></div></div>';
    $("save-workflow").addEventListener("click",()=>saveWorkflow(r.id));
    go("detail");
  }
  function saveWorkflow(id){
    const r=requests.find(x=>x.id===id); if(!r)return;
    const status=$("detail-status").value, assignee=$("detail-assignee").value.trim()||"Unassigned", now=isoNow();
    const changes=[];
    if(r.status!==status){changes.push("Status changed to "+status);r.status=status;}
    if(r.assignee!==assignee){changes.push("Assigned to "+assignee);r.assignee=assignee;}
    if(!changes.length){notify("No changes to save.");return;}
    r.updatedAt=now;r.history=r.history||[];r.history.unshift({at:now,text:changes.join("; ")});
    save();notify("Workflow updated.");detail(id);
  }
  function approval(id,decision){
    const r=requests.find(x=>x.id===id);if(!r)return;
    if(!r.approvalRequired){notify("This request does not require approval.");return;}
    if(!["Approved","Rejected"].includes(decision))return;
    const now=isoNow();r.approvalDecision=decision;r.status=decision;r.updatedAt=now;r.history=r.history||[];r.history.unshift({at:now,text:"Approval decision recorded: "+decision});
    save();notify("Decision recorded: "+decision+".");detail(id);
  }
  function edit(id){
    const r=requests.find(x=>x.id===id);if(!r)return;
    $("edit-id").value=r.id;$("title").value=r.title;$("description").value=r.description;$("category").value=r.category;$("priority").value=r.priority;$("requester").value=r.requester;$("assignee").value=r.assignee==="Unassigned"?"":r.assignee;$("approval-required").checked=!!r.approvalRequired;
    $("form-heading").textContent="Edit "+r.id;$("submit-label").textContent="Save changes →";go("new");
  }
  function remove(id){
    const r=requests.find(x=>x.id===id);if(!r)return;
    if(!window.confirm("Delete "+r.id+" from this browser's demo data? This cannot be undone."))return;
    requests=requests.filter(x=>x.id!==id);save();notify("Demo request deleted.");go("requests");
  }
  function csvExport(){
    const fields=["id","title","description","category","priority","status","requester","assignee","approvalRequired","approvalDecision","createdAt","updatedAt"];
    const cell=v=>'"'+String(v??"").replace(/"/g,'""')+'"';
    const content=[fields.join(","),...sorted().map(r=>fields.map(f=>cell(r[f])).join(","))].join("\r\n");
    const blob=new Blob(["\ufeff"+content],{type:"text/csv;charset=utf-8;"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="flowdesk-requests.csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);notify("CSV export downloaded.");
  }
  function assistantAnswer(raw){
    const q=raw.toLowerCase();
    if(/submit|create|new request|log a request/.test(q))return "To submit a request, open “New request”, enter a title and description, choose a category and priority, add your requester email, then select Create request. If approval is required, the demo starts it in Awaiting approval.";
    if(/awaiting approval|approval|approve|reject/.test(q))return "“Awaiting approval” means a decision is still pending. Open the request, review its details, then use Approve or Reject under Approval decision. In this demo the decision is recorded locally; no real approver is notified.";
    if(/priority|urgent|high|normal|low/.test(q))return "Use High for time-sensitive work with significant impact, Normal for standard requests, and Low for work that can wait. Agree on official criteria with your team before using this in production.";
    if(/status|in progress|completed|submitted/.test(q))return "Submitted = received; Under review = being triaged; Awaiting approval = decision pending; Approved = approval granted; Rejected = not approved; In progress = work started; Completed = finished; Cancelled = no longer needed. Statuses in this prototype are changed manually.";
    if(/assign|assigned|owner|team/.test(q))return "Open a request and choose a person or support queue in Assigned to, then save workflow changes. This demo does not send a notification to that assignee.";
    if(/data|private|secure|stored|storage/.test(q))return "The prototype stores request records in this browser's localStorage. They are not synced to GitHub or Microsoft services, but anyone using this browser profile may be able to access them. Use fictional data only and avoid shared devices.";
    if(/power automate|microsoft|copilot|dataverse|sharepoint/.test(q))return "This repository currently contains a standalone working prototype, not a live Microsoft integration. Production integration requires a configured Microsoft tenant, data source, authenticated connections, Power Automate flows, and a published Copilot Studio agent where appropriate.";
    if(/delete|remove/.test(q))return "Open a request and choose Delete demo request. The app asks for confirmation. This removes it from this browser's local demo data.";
    if(/hello|hi\b|hey/.test(q))return "Hello! I can explain submitting requests, statuses, priorities, assignments, approvals, and how this demo stores data. What would you like to know?";
    return "I don't have a reliable answer for that in the built-in FAQ. Try asking how to submit a request, what an approval status means, which priority to choose, or how demo data is stored. For a production assistant, connect approved knowledge sources through Copilot Studio and define a human escalation path.";
  }
  function addMessage(text,type){
    const el=document.createElement("div");el.className="message "+type;
    if(type==="bot"){const b=document.createElement("b");b.textContent="FlowDesk";el.appendChild(b);const p=document.createElement("p");p.textContent=text;el.appendChild(p);}else el.textContent=text;
    $("chat-messages").appendChild(el);$("chat-messages").scrollTop=$("chat-messages").scrollHeight;
  }
  document.addEventListener("click",e=>{
    const goBtn=e.target.closest("[data-go]");if(goBtn){go(goBtn.dataset.go);return;}
    const nav=e.target.closest("[data-view]");if(nav){go(nav.dataset.view);return;}
    const detailBtn=e.target.closest("[data-detail]");if(detailBtn){detail(detailBtn.dataset.detail);return;}
    const editBtn=e.target.closest("[data-edit]");if(editBtn){edit(editBtn.dataset.edit);return;}
    const deleteBtn=e.target.closest("[data-delete]");if(deleteBtn){remove(deleteBtn.dataset.delete);return;}
    const approveBtn=e.target.closest("[data-approval]");if(approveBtn){approval(approveBtn.dataset.id,approveBtn.dataset.approval);return;}
    const prompt=e.target.closest("[data-prompt]");if(prompt){$("chat-input").value=prompt.dataset.prompt;$("chat-form").requestSubmit();}
  });
  $("top-new").addEventListener("click",()=>{resetForm();go("new");});
  $("request-form").addEventListener("submit",submitRequest);
  ["search","status-filter","priority-filter"].forEach(id=>$(id).addEventListener(id==="search"?"input":"change",renderRequests));
  $("chat-form").addEventListener("submit",e=>{e.preventDefault();const input=$("chat-input"),value=input.value.trim();if(!value)return;addMessage(value,"user");input.value="";addMessage(assistantAnswer(value),"bot");});
  $("today-label").textContent=new Date().toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"});
  const exportBtn=document.createElement("button");exportBtn.className="secondary-btn";exportBtn.id="export-csv";exportBtn.textContent="↓ Export CSV";exportBtn.addEventListener("click",csvExport);
  const toolbar=$("search").parentElement;toolbar.appendChild(exportBtn);
  renderDashboard();renderRequests();
})();
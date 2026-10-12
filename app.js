"use strict";
document.documentElement.classList.add("js-motion");
const revealObserver="IntersectionObserver" in window?new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");revealObserver.unobserve(entry.target)}}),{threshold:.14,rootMargin:"0px 0px -35px 0px"}):null;
function observeReveals(root=document){if(!revealObserver)return;root.querySelectorAll(".reveal").forEach(element=>revealObserver.observe(element))}
const destinations = [
  {name:"Manali", region:"Himachal Pradesh, India", kind:"mountain", label:"Mountain escape", price:4999, image:"assets/manali.jpg", alt:"Snowy Himalayan ridges above a quiet mountain trail", description:"Pine-scented trails, snowy peaks and slow mornings."},
  {name:"Goa", region:"India's west coast", kind:"beach", label:"Coastal favourite", price:3999, image:"assets/goa.jpg", alt:"Palm-lined Goan beach beside clear turquoise water", description:"Salt air, palm shade and nowhere urgent to be."},
  {name:"Jaipur", region:"Rajasthan, India", kind:"heritage", label:"Royal city", price:3499, image:"assets/jaipur.jpg", alt:"Amber Fort in Jaipur reflected in the water below", description:"Amber forts, pink lanes and evenings full of colour."},
  {name:"Kerala", region:"South India", kind:"beach", label:"Backwater slow-down", price:5499, image:"assets/kerala.jpg", alt:"A traditional houseboat drifting through Kerala backwaters", description:"Drift past coconut groves on a quiet backwater."},
  {name:"Ladakh", region:"Himalayan India", kind:"mountain", label:"High-altitude wonder", price:8999, image:"assets/ladakh.jpg", alt:"Dramatic snow-covered Himalayan peaks in Ladakh", description:"Wide-open valleys, mountain air and starry nights."},
  {name:"Udaipur", region:"Rajasthan, India", kind:"heritage", label:"City of lakes", price:4299, image:"assets/udaipur.jpg", alt:"Udaipur's City Palace rising beside Lake Pichola", description:"Lake views, rooftop sunsets and old-city charm."},
  {name:"Bali", region:"Indonesia", kind:"beach", label:"Island daydream", price:21999, image:"assets/bali.jpg", alt:"A Balinese waterside temple framed by green hills", description:"Temple mornings, green hills and warm island nights."},
  {name:"Maldives", region:"Indian Ocean", kind:"beach", label:"Island hideaway", price:34999, image:"assets/maldives.jpg", alt:"Overwater villas set in a bright turquoise lagoon", description:"Clear lagoons and long, unhurried afternoons."}
];
const transport = {
  Flight:{name:["NestJet","SkyNest","CloudAir"],base:3200,duration:["2h 10m","2h 25m","2h 05m"],icon:"✈"},
  Train:{name:["Nest Rajdhani","Nest Superfast","Nest Premium"],base:1100,duration:["12h 40m","15h 10m","11h 55m"],icon:"▰"},
  Bus:{name:["Nest Volvo AC","Night Sleeper","Hill Express"],base:800,duration:["14h 30m","16h 00m","13h 45m"],icon:"▣"}
};
const departureTimes=["06:15","11:40","19:25"];
const state={category:"all",query:"",mode:"Flight",savedOnly:false,saved:new Set()};
const $=selector=>document.querySelector(selector);
const $$=selector=>Array.from(document.querySelectorAll(selector));
const grid=$("#destination-grid");
const emptyState=$("#empty-state");
const toast=$("#toast");
let toastTimer;
let activeTrip=null;
try{state.saved=new Set(JSON.parse(localStorage.getItem("tripnest-saved")||"[]"))}catch(_){state.saved=new Set()}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]))}
function formatMoney(value){return "₹"+Number(value).toLocaleString("en-IN")}
function renderDestinations(){
  const shown=destinations.filter(place=>{
    const matchesCategory=state.category==="all"||place.kind===state.category;
    const term=state.query.trim().toLocaleLowerCase();
    const matchesQuery=!term||(place.name+" "+place.region+" "+place.label).toLocaleLowerCase().includes(term);
    const matchesSaved=!state.savedOnly||state.saved.has(place.name);
    return matchesCategory&&matchesQuery&&matchesSaved;
  });
  grid.innerHTML=shown.map((place,index)=>{
    const saved=state.saved.has(place.name);
    return '<article class="destination-card reveal" style="--reveal-delay:'+Math.min(index,5)*70+'ms">'+
      '<div class="destination-photo"><img src="'+place.image+'" alt="'+escapeHTML(place.alt)+'" loading="lazy" decoding="async" width="1100" height="735" onerror="this.style.visibility=\'hidden\'"><span class="photo-tag">'+escapeHTML(place.label)+'</span>'+
      '<button class="save-button" type="button" data-save="'+escapeHTML(place.name)+'" aria-label="'+(saved?"Remove "+escapeHTML(place.name)+" from":"Save "+escapeHTML(place.name)+" to")+' saved places" aria-pressed="'+saved+'">'+(saved?"♥":"♡")+'</button></div>'+
      '<div class="destination-info"><p class="destination-location"><span aria-hidden="true">⌖</span>'+escapeHTML(place.region)+'</p><h3>'+escapeHTML(place.name)+'</h3>'+
      '<p class="destination-description">'+escapeHTML(place.description)+'</p><div class="destination-bottom"><div><span class="fare-label">Sample fare from</span><span class="fare-price">'+formatMoney(place.price)+'</span></div>'+
      '<button class="plan-button" type="button" data-plan="'+escapeHTML(place.name)+'">Plan this trip <span aria-hidden="true">↗</span></button></div></div></article>';
  }).join("");
  observeReveals(grid);
  emptyState.hidden=shown.length>0;
  $("#saved-count").textContent=String(state.saved.size);
}
function showToast(message){
  toast.textContent=message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove("is-visible"),2200);
}
function setSaved(name){
  if(state.saved.has(name)){state.saved.delete(name);showToast(name+" removed from saved places")}
  else{state.saved.add(name);showToast(name+" saved for later")}
  try{localStorage.setItem("tripnest-saved",JSON.stringify(Array.from(state.saved)))}catch(_){}
  renderDestinations();
}
function selectDestination(name){
  const place=destinations.find(item=>item.name===name);
  if(!place)return;
  $("#to").value=place.name;
  $("#search").scrollIntoView({behavior:"smooth",block:"start"});
  $("#to").focus({preventScroll:true});
}
$("#filters").addEventListener("click",event=>{
  const button=event.target.closest("[data-category]");
  if(!button)return;
  state.category=button.dataset.category;
  $$("#filters [data-category]").forEach(item=>{
    const active=item===button;
    item.classList.toggle("is-active",active);
    item.setAttribute("aria-pressed",String(active));
  });
  renderDestinations();
});
$("#destination-search").addEventListener("input",event=>{state.query=event.target.value;renderDestinations()});
$("#saved-filter").addEventListener("click",event=>{
  state.savedOnly=!state.savedOnly;
  event.currentTarget.setAttribute("aria-pressed",String(state.savedOnly));
  renderDestinations();
});
grid.addEventListener("click",event=>{
  const save=event.target.closest("[data-save]");
  if(save){setSaved(save.dataset.save);return}
  const plan=event.target.closest("[data-plan]");
  if(plan)selectDestination(plan.dataset.plan);
});
$("#search-form").addEventListener("click",event=>{
  const tab=event.target.closest("[data-mode]");
  if(!tab)return;
  state.mode=tab.dataset.mode;
  $$(".transport-tab").forEach(button=>{
    const active=button===tab;
    button.classList.toggle("is-active",active);
    button.setAttribute("aria-pressed",String(active));
  });
});
function localDate(date){
  return [date.getFullYear(),String(date.getMonth()+1).padStart(2,"0"),String(date.getDate()).padStart(2,"0")].join("-");
}
const today=localDate(new Date());
$("#date").min=today;
const defaultDate=new Date();
defaultDate.setDate(defaultDate.getDate()+7);
$("#date").value=localDate(defaultDate);
function escapeForDisplay(value){return escapeHTML(value.trim())}
function renderResults(from,to,date,count){
  const selected=transport[state.mode];
  const route=escapeForDisplay(from)+" to "+escapeForDisplay(to);
  const departures=selected.name.map((name,index)=>{
    const total=(selected.base+index*380+to.length*90)*count;
    return '<article class="departure"><div><div class="departure-main"><span class="departure-time">'+departureTimes[index]+'</span><span class="departure-route" aria-label="route">to</span><span class="departure-time">'+selected.duration[index]+'</span></div>'+
      '<div class="departure-name">'+escapeHTML(name)+' · '+route+' · '+count+' traveller'+(count>1?"s":"")+'</div></div><div class="departure-side"><span class="departure-price">'+formatMoney(total)+'</span>'+
      '<button class="button button-primary" type="button" data-book="'+index+'" data-price="'+total+'">Preview</button></div></article>';
  }).join("");
  $("#results").innerHTML='<div class="results-heading"><div><h3>Sample '+state.mode.toLowerCase()+' departures</h3><p>'+route+' · '+escapeHTML(date)+' · made-up demo schedules</p></div><p>Prices shown in INR</p></div><div class="departure-list">'+departures+'</div>';
  $("#results").setAttribute("aria-busy","false");
}
$("#search-form").addEventListener("submit",event=>{
  event.preventDefault();
  const from=$("#from").value.trim();
  const to=$("#to").value.trim();
  const fromKey=from.toLocaleLowerCase();
  const toKey=to.toLocaleLowerCase();
  const date=$("#date").value;
  const paxInput=$("#pax");
  const raw=Number(paxInput.value);
  const count=Number.isFinite(raw)?Math.min(9,Math.max(1,Math.floor(raw))):1;
  paxInput.value=String(count);
  if(fromKey===toKey){$("#to").setCustomValidity("Choose a different destination from your starting point.");$("#to").reportValidity();$("#to").addEventListener("input",()=>$("#to").setCustomValidity(""),{once:true});return}
  if(date<today){$("#date").setCustomValidity("Choose today or a future date.");$("#date").reportValidity();$("#date").addEventListener("change",()=>$("#date").setCustomValidity(""),{once:true});return}
  if(!$("#search-form").reportValidity())return;
  $("#results").setAttribute("aria-busy","true");
  $("#results").innerHTML='<p class="search-disclaimer">Finding a few sample departures…</p>';
  window.setTimeout(()=>renderResults(from,to,date,count),220);
});
$("#results").addEventListener("click",event=>{
  const button=event.target.closest("[data-book]");
  if(!button)return;
  const from=$("#from").value.trim();
  const to=$("#to").value.trim();
  const date=$("#date").value;
  const pax=Math.min(9,Math.max(1,Math.floor(Number($("#pax").value)||1)));
  activeTrip={from:from,to:to,date:date,passengers:pax,carrier:transport[state.mode].name[Number(button.dataset.book)],price:Number(button.dataset.price),icon:transport[state.mode].icon};
  openBookingDialog();
});
const dialog=$("#booking-dialog");
function openBookingDialog(){
  $("#dialog-content").innerHTML='<p class="dialog-kicker">A pretend trip, just for fun</p><h2 class="dialog-title" id="dialog-title">Your sample pass awaits.</h2>'+
    '<p class="dialog-summary">'+escapeHTML(activeTrip.from)+' to '+escapeHTML(activeTrip.to)+' · '+escapeHTML(activeTrip.carrier)+' · '+formatMoney(activeTrip.price)+'</p>'+
    '<label class="passenger-label" for="passenger-name">Name for the sample pass</label><input class="passenger-input" id="passenger-name" name="passenger" maxlength="60" autocomplete="name" placeholder="Your name">'+
    '<p class="dialog-note">Demo only. No payment is taken and no real ticket is issued.</p><button class="button button-primary dialog-action" id="create-pass" type="button">Create sample pass <span aria-hidden="true">↗</span></button>';
  dialog.showModal();
  $("#passenger-name").focus();
}
$("#dialog-content").addEventListener("click",event=>{
  if(event.target.closest("#create-pass"))createPass();
});
function createPass(){
  const input=$("#passenger-name");
  const name=input.value.trim();
  if(!name){input.setCustomValidity("Add a name for your sample pass.");input.reportValidity();input.addEventListener("input",()=>input.setCustomValidity(""),{once:true});return}
  const safeName=escapeHTML(name);
  const code=value=>escapeHTML(value.slice(0,3).toLocaleUpperCase());
  $("#dialog-content").innerHTML='<p class="dialog-kicker">Sample pass created</p><h2 class="dialog-title" id="dialog-title">Have a lovely daydream, '+safeName.split(" ")[0]+'.</h2>'+
    '<div class="sample-pass"><div class="pass-route"><span>'+code(activeTrip.from)+'</span><span>'+escapeHTML(activeTrip.icon)+' ━━━ ✦</span><span>'+code(activeTrip.to)+'</span></div>'+
    '<div class="pass-grid"><div><span>Passenger</span><strong>'+safeName+'</strong></div><div><span>Date</span><strong>'+escapeHTML(activeTrip.date)+'</strong></div>'+
    '<div><span>Departure</span><strong>'+escapeHTML(activeTrip.carrier)+'</strong></div><div><span>Travellers</span><strong>'+activeTrip.passengers+'</strong></div>'+
    '<div><span>Sample fare</span><strong>'+formatMoney(activeTrip.price)+'</strong></div><div><span>Booking code</span><strong>DEMO-'+Math.random().toString(36).slice(2,6).toLocaleUpperCase()+'</strong></div></div>'+
    '<p class="pass-disclaimer">This is a pretend pass. It is not valid for travel.</p></div><button class="button button-primary dialog-action" style="margin-top:15px" type="button" id="finish-pass">Lovely, thanks</button>';
}
$("#dialog-content").addEventListener("click",event=>{if(event.target.closest("#finish-pass"))dialog.close()});
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
const menuButton=$(".menu-toggle");
const navLinks=$("#nav-links");
menuButton.addEventListener("click",()=>{
  const open=menuButton.getAttribute("aria-expanded")!=="true";
  menuButton.setAttribute("aria-expanded",String(open));
  menuButton.setAttribute("aria-label",open?"Close menu":"Open menu");
  navLinks.classList.toggle("is-open",open);
});
navLinks.addEventListener("click",event=>{
  if(event.target.closest("a")){menuButton.setAttribute("aria-expanded","false");menuButton.setAttribute("aria-label","Open menu");navLinks.classList.remove("is-open")}
});
renderDestinations();
document.querySelectorAll(".search-panel,.results,.how-intro,.step,.site-footer").forEach(element=>element.classList.add("reveal"));
observeReveals();


// Uses the same Supabase project as your existing Veylqora website.
const SUPABASE_URL = 'https://tfcpmylfdgctmjrijedz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_5Evrro5ZdtN-2lpdpNEw5w_A6phH5Gm';
const db = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
// Shorthand for looking up an element by its HTML id.
const $ = id => document.getElementById(id);
// All onboarding screens and the available interest choices.
const steps = [...document.querySelectorAll('.step')];
// The six small circles in the left sidebar correspond to screens 2–7.
const navItems = [...document.querySelectorAll('[data-nav]')];
const availableInterests = ['Music','Travel','Movies','Reading','Fitness','Gaming','Cooking','Art','Photography','Dancing','Nature','Technology','Sports','Pets','Coffee','Fashion'];
const selected = new Set();
let step = 0;
let currentUser = null;
let existingProfile = null;
// A per-user browser draft is kept until the profile is saved.
const storageKey = 'veylqora-profile-draft';
const photoInput = $('photo');
// Display validation, loading, and error messages without alerts.
function message(text='') { $('notice').textContent=text; $('notice').classList.toggle('show',!!text); }
// Draw selectable interest buttons and keep their pressed states in sync.
function renderChips() {
  $('interestChips').replaceChildren();
  for(const interest of availableInterests){
    const b=document.createElement('button');b.type='button';b.className='chip'+(selected.has(interest)?' selected':'');b.textContent=interest;
    b.setAttribute('aria-pressed',String(selected.has(interest)));
    b.addEventListener('click',()=>{selected.has(interest)?selected.delete(interest):selected.add(interest);renderChips();saveDraft();});
    $('interestChips').append(b);
  }
  $('chosenInterests').textContent=selected.size?'Selected: '+[...selected].join(' · '):'No interests selected yet';
}
$('addInterest').addEventListener('click',()=>{
  const value=$('customInterest').value.trim().replace(/\s+/g,' ');
  if(!value)return;
  if(selected.size>=20){message('You can add up to 20 interests.');return;}
  selected.add(value);$('customInterest').value='';message();renderChips();saveDraft();
});
// Calculate age from the entered birthday; profile setup requires 18+.
function ageFromDate(value){
  if(!value)return 0;
  const d=new Date(value+'T12:00:00');if(Number.isNaN(d.getTime()))return 0;
  const now=new Date();let age=now.getFullYear()-d.getFullYear();
  if(now.getMonth()<d.getMonth()||(now.getMonth()===d.getMonth()&&now.getDate()<d.getDate()))age--;
  return age;
}
// Validate the current screen before allowing the user to continue.
function validStep(){
  if(step===1&&!['firstName','lastName'].every(id=>$(id).value.trim()))return 'Please enter your first and last name.';
  if(step===2){
    if(!['birthDate','gender','interestedIn'].every(id=>$(id).value.trim()))return 'Please complete your personal details.';
    if(ageFromDate($('birthDate').value)<18)return 'You must be 18 or older to join Veylqora.';
  }
  if(step===3&&(!$('city').value.trim()||!$('bio').value.trim()))return 'Please add your city and a short bio.';
  if(step===4&&selected.size<3)return 'Please select at least 3 interests.';
  if(step===5&&photoInput.files[0]){
    const f=photoInput.files[0];
    if(!['image/jpeg','image/png','image/webp'].includes(f.type))return 'Choose a JPG, PNG, or WebP image.';
    if(f.size>5*1024*1024)return 'Your photo must be 5 MB or smaller.';
  }
  return '';
}
// Collect profile fields in the shape expected by the Supabase profiles table.
function values(){return {first_name:$('firstName').value.trim(),last_name:$('lastName').value.trim(),birth_date:$('birthDate').value,gender:$('gender').value,interested_in:$('interestedIn').value,city:$('city').value.trim(),bio:$('bio').value.trim(),interests:[...selected]};}
// Save unfinished text fields and interests locally for the signed-in user.
function saveDraft(){if(!currentUser)return;localStorage.setItem(storageKey+'-'+currentUser.id,JSON.stringify(values()));}
// Restore a draft when the user returns to an unfinished profile.
function restoreDraft(){
  if(!currentUser)return;
  try{const data=JSON.parse(localStorage.getItem(storageKey+'-'+currentUser.id)||'null');if(!data)return;
    for(const [field,id] of Object.entries({first_name:'firstName',last_name:'lastName',birth_date:'birthDate',gender:'gender',interested_in:'interestedIn',city:'city',bio:'bio'}))if(data[field])$(id).value=data[field];
    (data.interests||[]).forEach(x=>selected.add(x));
  }catch(e){console.warn('Could not restore draft',e)}
}
// Safely build the review screen using textContent, not user-supplied HTML.
function renderReview(){
  const v=values();const fields=[['Name',v.first_name+' '+v.last_name],['Date of birth',v.birth_date],['Gender',v.gender],['Interested in',v.interested_in],['City',v.city],['About me',v.bio],['Interests',v.interests.join(', ')],['Photo',photoInput.files[0]?.name|| (existingProfile?.avatar_url?'Previously uploaded photo':'Not added')]];
  const r=$('review');r.replaceChildren();for(const [key,value] of fields){const line=document.createElement('div');const strong=document.createElement('strong');strong.textContent=key+': ';line.append(strong,document.createTextNode(value||'—'));r.append(line);}
}
// Show the saved profile details in a card-style preview.
function renderFinalPreview(){
  const v=values(), box=$('finalPreview');box.replaceChildren();
  const photo=document.createElement('div');photo.className='preview-avatar';
  if($('photoPreview').src && !$('photoPreview').hidden){const img=document.createElement('img');img.src=$('photoPreview').src;img.alt='Your profile photo';photo.append(img);}else{photo.textContent='♡';}
  const title=document.createElement('h3');title.textContent=`${v.first_name} ${v.last_name}, ${ageFromDate(v.birth_date)}`;
  const city=document.createElement('p');city.textContent='📍 '+v.city;
  const bio=document.createElement('p');bio.textContent=v.bio;
  const interests=document.createElement('div');interests.className='chips';v.interests.forEach(x=>{const span=document.createElement('span');span.className='chip selected';span.textContent=x;interests.append(span)});
  box.append(photo,title,city,bio,interests);
}
// Switch visible screens, update progress, and set button labels.
function render(){
  steps.forEach((s,i)=>s.classList.toggle('active',i===step));
  // Welcome/success/preview are wide; form stages have a left sidebar.
  $('layout').classList.toggle('wide',step===0||step>=7);
  $('progressFill').style.width=(step===0?0:step>=7?100:Math.round(step/6*100))+'%';
  $('stepCounter').textContent=step===0?'Start':step>=7?'Complete':`${step} / 6`;
  $('topCaption').textContent=step===0?'Your story starts here':step>=7?'Your Profile':'Your Profile';
  navItems.forEach((item,i)=>{item.classList.toggle('active',step===i+1);item.classList.toggle('done',step>i+1);});
  $('backBtn').hidden=step===0||step>=7;
  $('nextBtn').textContent=step===0?'Get Started →':step===6?'Save My Profile →':step===7?'View My Profile →':step===8?'Go to Home →':'Next →';
  if(step===6)renderReview();if(step===8)renderFinalPreview();message();window.scrollTo({top:0,behavior:'smooth'});
}
// Previous/next buttons control the nine-screen flow.
$('backBtn').addEventListener('click',()=>{if(step>0&&step<7){step--;render();}});
$('nextBtn').addEventListener('click',async()=>{
  if(step===8){window.location.href='index.html';return;}
  if(step===7){step=8;render();return;}
  const err=validStep();if(err){message(err);return;}
  saveDraft();if(step<6){step++;render();return;}
  await saveProfile();
});
// Preview the selected photo locally before it is uploaded.
photoInput.addEventListener('change',()=>{
  const f=photoInput.files[0];if(!f){$('photoPreview').hidden=true;$('photoPlaceholder').hidden=false;return;}
  const err=validStep();if(err){message(err);photoInput.value='';return;}
  $('photoPreview').src=URL.createObjectURL(f);$('photoPreview').hidden=false;$('photoPlaceholder').hidden=true;message();
});
['firstName','lastName','birthDate','gender','interestedIn','city','bio'].forEach(id=>$(id).addEventListener('change',saveDraft));
// Upload an optional photo to private Storage, then upsert the profile row.
async function saveProfile(){
  if(!currentUser){message('Your session has expired. Please sign in again.');return;}
  const btn=$('nextBtn');btn.disabled=true;btn.textContent='Saving…';
  try{
    let avatar_url=existingProfile?.avatar_url||null;
    const f=photoInput.files[0];
    if(f){
      // Create a PRIVATE Supabase Storage bucket named profile-photos before uploading.
      const ext=f.type==='image/png'?'png':f.type==='image/webp'?'webp':'jpg';
      const path=`${currentUser.id}/avatar-${Date.now()}.${ext}`;
      const upload=await db.storage.from('profile-photos').upload(path,f,{contentType:f.type,upsert:false});
      if(upload.error)throw new Error('Photo upload failed: '+upload.error.message+'. You can go Back and remove the photo, then save.');
      avatar_url=path; // Private storage path, not a public URL.
    }
    const payload={user_id:currentUser.id,...values(),avatar_url,updated_at:new Date().toISOString()};
    const result=await db.from('profiles').upsert(payload,{onConflict:'user_id'});
    if(result.error)throw result.error;
    localStorage.removeItem(storageKey+'-'+currentUser.id);
    step=7;render();
  }catch(e){message(e.message||'Could not save your profile. Please try again.');}
  finally{btn.disabled=false;if(step===6)btn.textContent='Save My Profile →';}
}
// Check the signed-in Supabase user and load any existing profile/draft.
async function init(){
  renderChips();render();
  if(!db){message('Could not load Supabase. Check your internet connection.');return;}
  const {data:{user},error}=await db.auth.getUser();
  if(error||!user){$('profileForm').hidden=true;message('Please sign up or sign in on the homepage, verify your email OTP, then return to this page.');return;}
  currentUser=user;
  const result=await db.from('profiles').select('*').eq('user_id',user.id).maybeSingle();
  if(result.error){message('Could not load your saved profile: '+result.error.message);return;}
  existingProfile=result.data;
  if(existingProfile){
    const fields={first_name:'firstName',last_name:'lastName',birth_date:'birthDate',gender:'gender',interested_in:'interestedIn',city:'city',bio:'bio'};
    for(const [key,id] of Object.entries(fields))$(id).value=existingProfile[key]||'';
    (existingProfile.interests||[]).forEach(i=>selected.add(i));
  }else restoreDraft();
  renderChips();
}
init();

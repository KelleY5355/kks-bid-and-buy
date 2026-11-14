/* KK's BID & BUY public shop. Orders use Netlify Forms; no payment, account login, or live inventory sync. */
(()=>{'use strict';

// Replace missing product photos with a clean branded placeholder instead of a broken image icon.
document.addEventListener('error',event=>{
  const img=event.target;
  if(!(img instanceof HTMLImageElement))return;
  const placeholder=document.createElement('div');
  placeholder.className='prod-placeholder';
  placeholder.setAttribute('role','img');
  placeholder.setAttribute('aria-label','Product photograph not yet available');
  placeholder.textContent='✦ KK’s BID & BUY · Photo coming soon';
  img.replaceWith(placeholder);
},true);
const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const raw=Array.isArray(window.KK_LISTINGS)?window.KK_LISTINGS:[], cfg=window.KK_SITE_CONFIG||{};
const money=n=>new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD'}).format(n);
function getPrice(p){let m=String(p??'').replace(/,/g,'').match(/(?:\$\s*)?(\d+(?:\.\d{1,2})?)/);return m?Number(m[1]):NaN}
function safeHttp(url){try{let u=new URL(url);return /^(https?):$/.test(u.protocol)?u.href:''}catch{return ''}}
const products=raw.map((item,i)=>({...item,id:String(item.id||'listing-'+i),title:String(item.title||'Untitled product'),price:String(item.price||''),quantity:Math.max(0,Math.floor(Number(item.quantity??1)||0)),status:String(item.status||'Coming Soon'),type:String(item.type||'Shop'),category:String(item.category||'Other'),condition:String(item.condition||'To Be Confirmed'),description:String(item.description||''),image:String(item.image||''),link:safeHttp(item.link),featured:Boolean(item.featured)}));
const shop=products.filter(p=>p.type.toLowerCase()!=='auction'),auctions=products.filter(p=>p.type.toLowerCase()==='auction');
let filter='All',q='',sort='featured',cart={};
try{const c=JSON.parse(localStorage.getItem('kk-cart-2026')||'{}');if(c&&typeof c==='object'&&!Array.isArray(c))cart=c}catch{}
function isLive(p){return p.status.toLowerCase()==='live'&&p.quantity>0&&Number.isFinite(getPrice(p.price))}
function statusText(p){if(p.status.toLowerCase()==='sold out'||(p.status.toLowerCase()==='live'&&p.quantity===0))return 'SOLD OUT';if(isLive(p))return 'AVAILABLE';return 'COMING SOON'}
function saveCart(){try{localStorage.setItem('kk-cart-2026',JSON.stringify(cart))}catch{}}
function cartRows(){return Object.entries(cart).map(([id,count])=>{const p=shop.find(x=>x.id===id);return p&&isLive(p)?{p,count:Math.min(Math.max(Number(count)||0,0),p.quantity)}:null}).filter(x=>x&&x.count>0)}
function adjustCart(id,delta){const p=shop.find(x=>x.id===id);if(!p||!isLive(p))return;let n=Math.min(p.quantity,Math.max(0,(Number(cart[id])||0)+delta));if(n)cart[id]=n;else delete cart[id];saveCart();renderCart()}
function renderCart(){const rows=cartRows();let count=rows.reduce((s,x)=>s+x.count,0),total=rows.reduce((s,x)=>s+x.count*getPrice(x.p.price),0);$('#cart-count').textContent=count;$('#cart-subtotal').textContent=money(total);$('#checkout-button').disabled=count===0;$('#cart-items').innerHTML=rows.length?rows.map(({p,count})=>`<div class="cart-row">${p.image?`<img src="${esc(p.image)}" alt="">`:'<div class="prod-placeholder">🛍</div>'}<div class="cart-info"><strong>${esc(p.title)}</strong><small>${money(getPrice(p.price))} each</small><div class="qty-control"><button type="button" data-minus="${esc(p.id)}" aria-label="Remove one ${esc(p.title)}">−</button><b>${count}</b><button type="button" data-plus="${esc(p.id)}" aria-label="Add one ${esc(p.title)}">+</button><button class="remove" type="button" data-remove="${esc(p.id)}">Remove</button></div></div></div>`).join(''):'<div class="cart-empty"><div class="icon-big">🛒</div><h3>Your cart is empty</h3><p>Start with the Shop Now section to discover what is available.</p></div>';}
function showCart(){renderCart();$('#drawer-shade').hidden=false;$('#cart-drawer').classList.add('open');$('#cart-drawer').setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');$('#close-cart').focus()}
function hideCart(){ $('#cart-drawer').classList.remove('open');$('#cart-drawer').setAttribute('aria-hidden','true');$('#drawer-shade').hidden=true;document.body.classList.remove('no-scroll');}
const categories=['All',...new Set(shop.map(p=>p.category))];
function renderFilters(){ $('#category-filters').innerHTML=categories.map(c=>`<button type="button" class="filter-pill ${c===filter?'active':''}" data-category="${esc(c)}">${esc(c)}</button>`).join('') }
function renderShop(){let result=shop.filter(p=>(filter==='All'||p.category===filter)&&[p.title,p.category,p.description].join(' ').toLowerCase().includes(q));if(sort==='low')result.sort((a,b)=>(getPrice(a.price)||0)-(getPrice(b.price)||0));else if(sort==='high')result.sort((a,b)=>(getPrice(b.price)||0)-(getPrice(a.price)||0));else if(sort==='az')result.sort((a,b)=>a.title.localeCompare(b.title));else result.sort((a,b)=>(Number(b.featured)-Number(a.featured))||a.title.localeCompare(b.title));
 $('#store-counter').textContent=`${result.length} product${result.length===1?'':'s'} ${filter!=='All'?'in '+filter:'in the store'}`;
 $('#store-empty').hidden=result.length!==0;$('#product-grid').innerHTML=result.map(p=>{let st=statusText(p),isAvailable=isLive(p),pVal=getPrice(p.price),price=Number.isFinite(pVal)?money(pVal):esc(p.price),remaining=isAvailable?`${p.quantity} in stock`:esc(p.status);return `<article class="product-card"><div class="prod-img">${p.image?`<img loading="lazy" src="${esc(p.image)}" alt="Product image for ${esc(p.title)}">`:'<div class="prod-placeholder" aria-hidden="true">✦</div>'}<span class="item-badge ${isAvailable?'live':st==='SOLD OUT'?'sold':''}">${st}</span></div><div class="prod-body"><div class="prod-cat">${esc(p.category)}</div><h3>${esc(p.title)}</h3><p class="prod-desc">${esc(p.description||'More details coming soon.')}</p><div class="prod-meta"><span>${esc(p.condition)}</span><span>${remaining}</span></div><div class="prod-bottom"><div class="price">${price} <small>CAD</small></div><div class="prod-actions"><button class="add-btn" type="button" data-add="${esc(p.id)}" ${isAvailable?'':'disabled'}>${isAvailable?'Add to cart +':st==='SOLD OUT'?'Sold out':'Coming soon'}</button><button class="details-btn" type="button" data-detail="${esc(p.id)}">Details</button></div>${p.imageNote?`<div class="image-note">${esc(p.imageNote)}</div>`:''}</div></div></article>`}).join('')}
function renderAuctions(){const el=$('#auction-list');if(!auctions.length){el.innerHTML='<p>No live auction lots have been published yet. Check back for upcoming announcements.</p>';return;}el.innerHTML=auctions.map(p=>`<div class="auction-card"><div><b>${esc(p.title)}</b><br><small>${esc(p.price)} · ${esc(p.status)}</small></div>${p.link&&p.status.toLowerCase()==='live'?`<a href="${esc(p.link)}" target="_blank" rel="noopener noreferrer">View bidding ↗</a>`:'<strong>Coming soon</strong>'}</div>`).join('')}
function applySettings(){const fields=[['facebook-page-link',cfg.facebookPageUrl],['facebook-group-link',cfg.facebookGroupUrl]],links=[];for(const [id,url] of fields){const u=safeHttp(url);if(u){$("#"+id).href=u;$("#"+id).hidden=false;links.push(u)}}if(links.length)$('#facebook-placeholder').hidden=true;const au=safeHttp(cfg.facebookGroupUrl);if(au){$('#auction-more').href=au;$('#auction-more').target='_blank';$('#auction-more').rel='noopener noreferrer';}$('#year').textContent=new Date().getFullYear()}
function details(id){const p=shop.find(x=>x.id===id);if(!p)return;const wrap=document.createElement('div');wrap.className='checkout-layer';wrap.id='detail-layer';let price=getPrice(p.price);wrap.innerHTML=`<section class="checkout-card" role="dialog" aria-modal="true" aria-labelledby="detail-title" style="max-width:520px"><div class="checkout-top"><div><span class="section-kicker">${esc(p.category)}</span><h2 id="detail-title">${esc(p.title)}</h2></div><button type="button" class="close" id="close-detail" aria-label="Close">✕</button></div>${p.image?`<img src="${esc(p.image)}" alt="Product image" style="width:100%;max-height:270px;object-fit:cover;border-radius:10px;margin:14px 0">`:''}<p>${esc(p.description||'Details to be confirmed.')}</p><p><b>Price:</b> ${Number.isFinite(price)?money(price):esc(p.price)} CAD<br><b>Condition:</b> ${esc(p.condition)}<br><b>Status:</b> ${statusText(p)}</p>${p.imageNote?`<p><small>${esc(p.imageNote)}</small></p>`:''}<button type="button" class="button button-gold button-full" id="detail-add" ${isLive(p)?'':'disabled'}>${isLive(p)?'Add to cart +':'Not yet available'}</button></section>`;document.body.append(wrap);document.body.classList.add('no-scroll');const close=()=>{wrap.remove();document.body.classList.remove('no-scroll')};wrap.querySelector('#close-detail').onclick=close;wrap.addEventListener('click',e=>{if(e.target===wrap)close()});wrap.querySelector('#detail-add').onclick=()=>{adjustCart(p.id,1);close();showCart()};wrap.querySelector('#close-detail').focus();}
function startCheckout(){const rows=cartRows();if(!rows.length)return;hideCart();const total=rows.reduce((s,x)=>s+x.count*getPrice(x.p.price),0);let detail=rows.map(({p,count})=>`${count} × ${p.title} — ${money(getPrice(p.price))} each`).join('\n');$('#order-details').value=detail;$('#order-total').value=total.toFixed(2);$('#checkout-summary').innerHTML=rows.map(({p,count})=>`<div>${count} × ${esc(p.title)} — ${money(count*getPrice(p.price))}</div>`).join('')+`<hr><strong>Estimated subtotal: ${money(total)}</strong>`;$('#checkout-layer').hidden=false;document.body.classList.add('no-scroll');$('#close-checkout').focus()}
function closeCheckout(){$('#checkout-layer').hidden=true;document.body.classList.remove('no-scroll')}
$('#open-cart').addEventListener('click',showCart);$('#close-cart').addEventListener('click',hideCart);$('#drawer-shade').addEventListener('click',hideCart);$('#checkout-button').addEventListener('click',startCheckout);$('#close-checkout').addEventListener('click',closeCheckout);
$('#checkout-layer').addEventListener('click',e=>{if(e.target===$('#checkout-layer'))closeCheckout()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if($('#detail-layer'))$('#detail-layer').querySelector('#close-detail').click();else if(!$('#checkout-layer').hidden)closeCheckout();else hideCart()}});
$('#cart-items').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.plus)adjustCart(b.dataset.plus,1);if(b.dataset.minus)adjustCart(b.dataset.minus,-1);if(b.dataset.remove){delete cart[b.dataset.remove];saveCart();renderCart()}});
$('#product-grid').addEventListener('click',e=>{const a=e.target.closest('[data-add]'),d=e.target.closest('[data-detail]');if(a){adjustCart(a.dataset.add,1);showCart()}if(d)details(d.dataset.detail)});
$('#category-filters').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;filter=b.dataset.category;renderFilters();renderShop()});
$('#search-input').addEventListener('input',e=>{q=e.target.value.trim().toLowerCase();renderShop()});$('#sort-select').addEventListener('change',e=>{sort=e.target.value;renderShop()});$('#clear-filters').addEventListener('click',()=>{filter='All';q='';$('#search-input').value='';renderFilters();renderShop()});
$('#order-form').addEventListener('submit',async e=>{
 e.preventDefault();
 const rows=cartRows();
 if(!rows.length){alert('Please add available items to your cart before sending an order request.');return}
 const total=rows.reduce((s,x)=>s+x.count*getPrice(x.p.price),0);
 $('#order-details').value=rows.map(({p,count})=>`${count} × ${p.title} — ${money(getPrice(p.price))} each`).join('\n');
 $('#order-total').value=total.toFixed(2);
 const form=$('#order-form'),button=$('#send-order');
 if(button.disabled)return;
 button.disabled=true;button.textContent='Sending your order request…';
 let message=$('#order-feedback');
 if(!message){message=document.createElement('p');message.id='order-feedback';message.setAttribute('role','status');form.append(message)}
 message.textContent='';
 try{
  const data=new FormData(form);
  const response=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(data).toString()});
  if(!response.ok)throw new Error('Order request not accepted (HTTP '+response.status+')');
  message.textContent='Your order request was submitted. KK’s BID & BUY will contact you to confirm availability and pickup. No payment has been taken.';
  message.style.color='#8ee6a6';
  cart={};saveCart();renderCart();form.reset();$('#checkout-summary').innerHTML='<strong>Order request submitted — thank you!</strong>';
  button.textContent='Request submitted';
 }catch(error){
  message.textContent='Your request could not be confirmed. Please try again or contact KK’s BID & BUY directly. No payment has been taken.';
  message.style.color='#ff9ba7';button.disabled=false;button.textContent='Try sending again';
 }
});
applySettings();renderFilters();renderShop();renderAuctions();renderCart();
})();

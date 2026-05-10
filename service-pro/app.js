let isDark = true;
let buildPurpose = 'gaming';
let selectedPreset = 'medium';
let activeCategory = 'all';
let approvalChoice = 'repair';

const serviceCenters = [
    { id: 1, name: "ServicePro Almaty - Mega", address: "ул. Розыбакиева 247" },
    { id: 2, name: "ServicePro Astana - Keruen", address: "ул. Достык 9" },
    { id: 3, name: "ServicePro Shymkent - Plaza", address: "пр. Аль-Фараби 3/1" }
];

const presets = [
    { id: 'budget', title: 'Бюджетная', desc: 'Киберспорт / Базовые задачи', price: 'от 250 000 ₸', icon: 'cpu' },
    { id: 'medium', title: 'Оптимальная', desc: 'Уверенный 2K гейминг', price: 'от 550 000 ₸', icon: 'zap' },
    { id: 'high', title: 'Ультимативная', desc: 'Максимальная производительность', price: 'от 1 200 000 ₸', icon: 'sparkles' },
];

const products = [
    { id: 1, name: "iPhone 15 Pro Max", category: "smartphones", price: "450 000 ₸", rating: 4.8, specs: "A17 Pro, 256GB, Blue Titanium", stock: "Almaty, Astana" },
    { id: 2, name: "MacBook Pro M3 14\"", category: "laptops", price: "980 000 ₸", rating: 4.9, specs: "M3 Chip, 16GB RAM, 512GB SSD", stock: "Almaty" },
    { id: 3, name: "RTX 4090 Founders", category: "components", price: "1 150 000 ₸", rating: 5.0, specs: "24GB GDDR6X, DLSS 3.5", stock: "Astana" },
    { id: 4, name: "Samsung S24 Ultra", category: "smartphones", price: "520 000 ₸", rating: 4.7, specs: "Snapdragon 8 Gen 3, 512GB", stock: "Shymkent, Almaty" },
];

let orders = [
    { 
        id: "SP-9921", name: "Ремонт iPhone 13 Pro", progress: 65, status: "Требует подтверждения", statusColor: "text-amber-500", date: "12.10.2023",
        timeline: [
            { step: "Принято в СЦ", date: "12.10.2023 10:20", done: true },
            { step: "Диагностика", date: "12.10.2023 14:45", done: true },
            { step: "Согласование", date: "Ожидание", done: false },
            { step: "Ремонт", date: "-", done: false },
        ],
        media: { before: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbea?auto=format&fit=crop&q=80&w=200", after: null }
    },
    { 
        id: "SP-8801", name: "Сборка Workstation", progress: 100, status: "Завершено", statusColor: "text-emerald-500", date: "05.10.2023",
        timeline: [
            { step: "Сборка", date: "03.10.2023", done: true },
            { step: "Выдано", date: "05.10.2023", done: true },
        ],
        media: { before: null, after: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=200" }
    }
];

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    if(document.getElementById('presetContainer')) renderPresets();
    if(document.getElementById('marketCategories')) renderMarketCategories();
    if(document.getElementById('marketGrid')) renderMarket();
    if(document.getElementById('ordersContainer')) renderOrders();
    if(document.getElementById('scList')) renderServiceCenters();
});

function toggleTheme() {
    isDark = !isDark;
    const body = document.getElementById('appBody');
    const header = document.getElementById('mainHeader');
    
    if (isDark) {
        body.classList.replace('bg-white', 'bg-[#0a0a0c]');
        body.classList.replace('text-black', 'text-white');
        header.classList.replace('bg-white/80', 'bg-black/50');
        document.getElementById('themeIcon').setAttribute('data-lucide', 'sun');
    } else {
        body.classList.replace('bg-[#0a0a0c]', 'bg-white');
        body.classList.replace('text-white', 'text-black');
        header.classList.replace('bg-black/50', 'bg-white/80');
        document.getElementById('themeIcon').setAttribute('data-lucide', 'moon');
    }
    
    document.querySelectorAll('.theme-box').forEach(el => {
        if(isDark) {
            el.classList.remove('bg-white', 'shadow-2xl');
            el.classList.add('bg-[#0f0f12]');
        } else {
            el.classList.remove('bg-[#0f0f12]');
            el.classList.add('bg-white', 'shadow-2xl');
        }
    });

    lucide.createIcons();
    if(document.getElementById('presetContainer')) renderPresets();
    if(document.getElementById('marketGrid')) renderMarket();
    if(document.getElementById('ordersContainer')) renderOrders();
}

// Функции Маркета
function renderMarketCategories() {
    const cats = [{ id: 'all', label: 'Все' }, { id: 'smartphones', label: 'Смартфоны' }, { id: 'laptops', label: 'Ноутбуки' }, { id: 'components', label: 'Железо' }];
    const html = cats.map(c => `<button onclick="setActiveCategory('${c.id}')" class="px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeCategory === c.id ? 'bg-[#00f2ff] text-black' : 'bg-white/5 border border-white/10'}">${c.label}</button>`).join('');
    document.getElementById('marketCategories').innerHTML = html;
}

function setActiveCategory(cat) {
    activeCategory = cat;
    renderMarketCategories();
    renderMarket();
}

function renderMarket() {
    const query = document.getElementById('marketSearch') ? document.getElementById('marketSearch').value.toLowerCase() : '';
    const filtered = products.filter(p => (activeCategory === 'all' || p.category === activeCategory) && p.name.toLowerCase().includes(query));
    const html = filtered.map(p => `
        <div class="group p-6 rounded-[2.5rem] border transition-all hover:-translate-y-2 ${isDark ? 'bg-[#0f0f12] border-white/5 hover:border-[#00f2ff]/30' : 'bg-white border-black/5 shadow-xl'}">
            <div class="aspect-square rounded-3xl bg-white/5 mb-6 flex items-center justify-center relative overflow-hidden">
                <i data-lucide="box" class="w-16 h-16 opacity-10 group-hover:scale-110 transition-transform"></i>
                <div class="absolute top-4 right-4 flex gap-1 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white">
                    <i data-lucide="star" class="w-3 h-3 text-yellow-400 fill-yellow-400"></i><span class="text-[10px] font-black">${p.rating}</span>
                </div>
            </div>
            <h3 class="font-black italic uppercase text-lg mb-1 leading-tight">${p.name}</h3>
            <p class="text-[10px] font-bold opacity-40 uppercase mb-4">${p.specs}</p>
            <div class="flex items-center justify-between mt-auto">
                <span class="text-xl font-black text-[#00f2ff]">${p.price}</span>
                <button class="p-3 bg-white/5 rounded-xl hover:bg-[#00f2ff] hover:text-black transition-all"><i data-lucide="shopping-bag" class="w-5 h-5"></i></button>
            </div>
        </div>
    `).join('');
    document.getElementById('marketGrid').innerHTML = html;
    lucide.createIcons();
}

// Функции ЛК (Дашборда)
function renderOrders() {
    const html = orders.map(order => `
        <div class="p-8 rounded-[3rem] border transition-all ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5 shadow-xl'}">
            <div class="flex flex-col md:flex-row gap-8 items-center">
                <div class="w-full md:w-auto flex-grow space-y-4">
                    <div class="flex items-center justify-between">
                        <div><span class="text-[10px] font-black uppercase opacity-30">ID: ${order.id} • ${order.date}</span><h3 class="text-2xl font-black italic uppercase tracking-tighter">${order.name}</h3></div>
                        <div class="px-4 py-1.5 rounded-full border border-current text-[10px] font-black uppercase ${order.statusColor}">${order.status}</div>
                    </div>
                    <div class="space-y-2">
                        <div class="flex justify-between text-[10px] font-black uppercase"><span>Прогресс</span><span>${order.progress}%</span></div>
                        <div class="h-2 w-full bg-white/5 rounded-full overflow-hidden"><div class="h-full transition-all duration-1000 bg-gradient-to-r from-[#00f2ff] to-[#7000ff]" style="width: ${order.progress}%"></div></div>
                    </div>
                </div>
                <div class="flex gap-3 w-full md:w-auto">
                    <button onclick="openTracking('${order.id}')" class="flex-grow md:flex-none px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-[10px] hover:border-[#00f2ff] transition-all">Трекинг</button>
                    ${order.status === 'Требует подтверждения' ? `<button onclick="openModal('modalApproval')" class="px-8 py-4 bg-[#00f2ff] text-black rounded-2xl font-black uppercase text-[10px] hover:scale-105 transition-all animate-pulse">Согласовать</button>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    document.getElementById('ordersContainer').innerHTML = html;
}

function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
    document.getElementById(id).classList.add('flex');
}
function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
    document.getElementById(id).classList.remove('flex');
}

function openTracking(id) {
    const order = orders.find(o => o.id === id);
    const timelineHtml = order.timeline.map(step => `
        <div class="relative pl-10">
            <div class="absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 ${step.done ? 'bg-[#00f2ff] border-[#00f2ff]/30' : 'bg-transparent border-white/10'}"></div>
            <div class="text-sm font-black uppercase italic ${step.done ? 'text-white' : 'opacity-30'}">${step.step}</div>
            <div class="text-[10px] font-bold opacity-30 uppercase">${step.date}</div>
        </div>
    `).join('');

    document.getElementById('trackingContent').innerHTML = `
        <div class="space-y-8"><h3 class="text-3xl font-black italic uppercase tracking-tighter">История этапов</h3><div class="space-y-6 relative ml-4"><div class="absolute left-[7px] top-2 bottom-2 w-px bg-white/10"></div>${timelineHtml}</div></div>
        <div class="space-y-8"><h3 class="text-3xl font-black italic uppercase tracking-tighter">Медиа-отчет</h3>
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2"><span class="text-[10px] font-black uppercase opacity-40">Приемка</span><div class="aspect-video rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative">${order.media.before ? `<img src="${order.media.before}" class="w-full h-full object-cover"/>` : '<div class="w-full h-full flex items-center justify-center opacity-20"><i data-lucide="image"></i></div>'}</div></div>
                <div class="space-y-2"><span class="text-[10px] font-black uppercase opacity-40">Результат</span><div class="aspect-video rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative">${order.media.after ? `<img src="${order.media.after}" class="w-full h-full object-cover"/>` : '<div class="w-full h-full flex items-center justify-center opacity-20"><i data-lucide="video"></i></div>'}</div></div>
            </div>
        </div>
    `;
    lucide.createIcons();
    openModal('modalTracking');
}

function setApprovalChoice(choice) {
    approvalChoice = choice;
    const btnRepair = document.getElementById('btnApproveRepair'), btnDiag = document.getElementById('btnApproveDiag'), submitBtn = document.getElementById('btnSubmitApproval');
    if(choice === 'repair') {
        btnRepair.classList.replace('bg-white/5', 'bg-[#00f2ff]/10'); btnRepair.classList.replace('border-white/5', 'border-[#00f2ff]');
        btnDiag.classList.replace('bg-red-500/10', 'bg-white/5'); btnDiag.classList.replace('border-red-500', 'border-white/5');
        submitBtn.innerText = 'Оплатить и подтвердить';
    } else {
        btnDiag.classList.replace('bg-white/5', 'bg-red-500/10'); btnDiag.classList.replace('border-white/5', 'border-red-500');
        btnRepair.classList.replace('bg-[#00f2ff]/10', 'bg-white/5'); btnRepair.classList.replace('border-[#00f2ff]', 'border-white/5');
        submitBtn.innerText = 'Оплатить диагностику';
    }
}

function checkApproval() {
    const isChecked = document.getElementById('approvalAgree').checked;
    const btn = document.getElementById('btnSubmitApproval');
    if (isChecked) { btn.removeAttribute('disabled'); btn.classList.remove('opacity-20', 'grayscale'); } 
    else { btn.setAttribute('disabled', 'true'); btn.classList.add('opacity-20', 'grayscale'); }
}

function submitApproval() {
    orders = orders.map(o => o.id === "SP-9921" ? { ...o, status: "В работе", statusColor: "text-blue-500", progress: 80 } : o);
    renderOrders();
    closeModal('modalApproval');
}

function renderPresets() {
    const html = presets.map(p => `
        <div onclick="selectPreset('${p.id}')" class="p-6 rounded-[2rem] border cursor-pointer transition-all ${selectedPreset === p.id ? 'border-[#00f2ff] bg-[#00f2ff]/5' : 'border-white/5 bg-white/5'}">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center ${selectedPreset === p.id ? 'bg-[#00f2ff] text-black' : 'bg-white/10'}">
                    <i data-lucide="${p.icon}" class="w-6 h-6"></i>
                </div>
                <div class="flex-grow">
                    <h4 class="font-black uppercase italic tracking-tighter">${p.title}</h4>
                    <p class="text-[10px] opacity-50 font-bold uppercase">${p.desc}</p>
                </div>
                <div class="text-right">
                    <p class="font-black text-[#00f2ff]">${p.price}</p>
                </div>
            </div>
        </div>
    `).join('');
    document.getElementById('presetContainer').innerHTML = html;
    lucide.createIcons();
}

function handleCustomBudget() {
    // Функция для обработки пользовательского бюджета (можно расширить)
    console.log('Custom budget:', document.getElementById('customBudgetInput').value);
}

function selectPreset(id) {
    selectedPreset = id;
    renderPresets();
}
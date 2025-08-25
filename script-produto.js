
    // FireBase
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
  import { getDatabase, ref, onValue, push, set } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

  const firebaseConfig = {
    apiKey: "AIzaSyD53Q57GFkGSYH1p5mAfsxZIGBKnp8AEG8",
    authDomain: "ferramentaria-d120f.firebaseapp.com",
    databaseURL: "https://ferramentaria-d120f-default-rtdb.firebaseio.com",
    projectId: "ferramentaria-d120f",
    storageBucket: "ferramentaria-d120f.firebasestorage.app",
    messagingSenderId: "227336233826",
    appId: "1:227336233826:web:0fa15161281a6d896a823b",
    measurementId: "G-2EVDBKX8S6"
  };

  // Inicializa Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

// ======== helpers ========

  // Data Atual
  const now = new Date();

  const month = now.toLocaleString('default', { month: 'long' }).toUpperCase(); 
  const day = now.getDate();

  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const clsx = (...parts) => parts.filter(Boolean).join(' ');
  const map = (value, sMin, sMax, dMin, dMax) => dMin + ((value - sMin) / (sMax - sMin)) * (dMax - dMin);
  function animateValue({from=0, to=1, duration=800, onUpdate, easing=(t)=>t, onComplete}){
    const start = performance.now();
    function frame(now){
      const p = Math.min(1, (now-start)/duration);
      const v = from + (to-from)*easing(p);
      onUpdate && onUpdate(v);
      if(p < 1){ requestAnimationFrame(frame); } else { onComplete && onComplete(); }
    }
    requestAnimationFrame(frame);
  }

// Busca os dados no nó "ppaps" (exemplo de estrutura)

let statusdata = [];

const statusRef = ref(db, "produtos");

onValue(statusRef, (snapshot) => {
  if (snapshot.exists()) {
    const data = snapshot.val();

    // Contadores por status
    let naoIniciado = 0;
    let emAndamento = 0;
    let finalizado = 0;

    Object.values(data).forEach(produto => {
      switch (produto.STATUS) {
        case "NÃO INICIADO":
          naoIniciado++;
          break;
        case "EM ANDAMENTO":
          emAndamento++;
          break;
        case "FINALIZADO":
          finalizado++;
          break;
      }
    });

    // Agora popula o statusdata dinamicamente
    const statusdata = [
      { id: 1, name: 'NÃO INICIADO', position: "Quantidade de PPAP's não iniciados", transactions: naoIniciado, rise: true, tasksCompleted: 3, imgId: 0 },
      { id: 2, name: 'EM ANDAMENTO', position: "Quantidade de PPAP's em andamento", transactions: emAndamento, rise: true, tasksCompleted: 5, imgId: 2 },
      { id: 3, name: 'FINALIZADO', position: "Quantidade de PPAP's finalizados", transactions: finalizado, rise: true, tasksCompleted: 1, imgId: 3 },
    ];
  }
});

  const Countrydata = [
    { name: 'USA', rise: true, value: 21942.83, id: 1 },
    { name: 'Ireland', rise: false, value: 19710.0, id: 2 },
    { name: 'Ukraine', rise: false, value: 12320.3, id: 3 },
    { name: 'Sweden', rise: true, value: 9725.0, id: 4 },
  ];
  const segmentationData = [
    { c1: 'Usinagem', c2: '25', c3: '#363636', color: '#535353' },
    { c1: 'Dobra', c2: '14', c3: '#818bb1', color: '#595f77' },
    { c1: 'Chanfro', c2: '10', c3: '#2c365d', color: '#232942' },
    { c1: 'Solda', c2: '3', c3: '#334ed8', color: '#2c3051' },
  ];
  const months = ['Jan','Feb','Mar','Abr','Mai','Jun','Jul','Ago','Set'];
  const graphData = months.map((m)=>{
  const revenue = 500 + Math.random()*2000;
  const expectedRevenue = Math.max(revenue + (Math.random()-0.5)*2000, 0);
    return { name:m, revenue, expectedRevenue, sales: Math.floor(Math.random()*500) };
  });

  // ======== montagem ========
  function App(){
    const root = document.getElementById('root');
    root.innerHTML = `
    <div class="flex">
      <aside id="sidebar" class="fixed inset-y-0 left-0 bg-card w-full sm:w-20 xl:w-60 sm:flex flex-col z-10 hidden"></aside>
      <main class="flex w-full">
        <div class="w-full h-screen hidden sm:block sm:w-20 xl:w-60 flex-shrink-0">.</div>
        <div id="content" class="h-screen flex-grow overflow-x-hidden overflow-auto flex flex-wrap content-start p-2"></div>
      </main>
    </div>`;
    Sidebar({ mount: $('#sidebar') });
    Content({ mount: $('#content') });
  }

  // ======== Sidebar ========
  function Sidebar({ mount }){
    let selected = '0';
    let showSidebar = false;
    const sidebarItems = [
      [
        { id: '0', title: 'Dashboard', notifications: false },
        { id: '1', title: 'Overview', notifications: false },
        { id: '2', title: 'Nova Info', notifications: false },
        { id: '3', title: 'Nova Info', notifications: false },
      ],
      [
        { id: '4', title: 'Nova Info', notifications: false },
        { id: '5', title: 'Nova Info', notifications: false },
        { id: '6', title: 'Nova Info', notifications: false },
      ],
    ];

    function render(){
      mount.innerHTML = `
        <div class="flex-shrink-0 overflow-hidden p-2 mt-12">
          <div class="flex items-center h-full sm:justify-center xl:justify-start p-2 sidebar-separator-top">
            ${IconButton({icon:'res-react-dash-logo', className:'w-10 h-10', asHtml:true})}
            <div class="block sm:hidden xl:block ml-2 font-bold text-xl text-black">PRODUTOS</div>
            <div class="flex-grow sm:hidden xl:block"></div>
            ${IconButton({icon:'res-react-dash-sidebar-close', className:'block sm:hidden', asHtml:true, onclick:'__onSidebarHide()'})}
          </div>
        </div>
        <div class="flex-grow overflow-x-hidden overflow-y-auto flex flex-col">
          ${sidebarItems[0].map(i=>MenuItem({item:i,selected})).join('')}
          <div class="mt-8 mb-0 font-bold px-3 block sm:hidden xl:block">ATALHOS</div>
          ${sidebarItems[1].map(i=>MenuItem({item:i,selected})).join('')}
          <div class="flex-grow"></div>
        </div>
        <div class="flex-shrink-0 overflow-hidden p-2">
          <div class="flex items-center h-full sm:justify-center xl:justify-start p-2 sidebar-separator-bottom">
            <div class="block sm:hidden xl:block ml-2 font-bold ">Usuario</div>
            <div class="flex-grow block sm:hidden xl:block"></div>
            ${Icon({path:'res-react-dash-options', className:'block sm:hidden xl:block w-3 h-3', asHtml:true})}
          </div>
        </div>`;

      // bind clicks
      $$('.js-menu').forEach(el=>{
        el.addEventListener('click', ()=>{
          selected = el.dataset.id;
          render();
        });
      });
    }

    function MenuItem({ item:{id,title,notifications}, selected }){
      return `
        <div data-id="${id}" class="js-menu w-full mt-6 flex items-center px-3 sm:px-0 xl:px-3 justify-start sm:justify-center xl:justify-start sm:mt-6 xl:mt-3 cursor-pointer ${selected===id? 'sidebar-item-selected':'sidebar-item'}">
          ${SidebarIcon(id)}
          <div class="block sm:hidden xl:block ml-2">${title}</div>
          <div class="block sm:hidden xl:block flex-grow"></div>
          ${notifications ? `<div class='flex sm:hidden xl:flex bg-pink-600  w-5 h-5 items-center justify-center rounded-full mr-2'><div class='text-white text-sm'>${notifications}</div></div>`: ''}
        </div>`
    }

    
    function UsageCard(){
      // barra horizontal animada
      const id = 'usageBar_'+Math.random().toString(36).slice(2);
      const percentId = id+'_p';
      // inserido como svg simples
      const svg = `
        <div class="w-full p-3 h-28 hidden sm:block sm:h-20 xl:h-32">
          <div class="rounded-xl w-full h-full px-3 sm:px-0 xl:px-3 overflow-hidden" style="background-image:url('https://assets.codepen.io/3685267/res-react-dash-usage-card.svg')">
            <div class="block sm:hidden xl:block pt-3">
              <div class="font-bold text-gray-300 text-sm">Used Space</div>
              <div class="text-gray-500 text-xs">Última Atualização, 16 de Agosto</div>
              <div id="${percentId}" class="text-right text-gray-400 text-xs">0%</div>
              <div class="w-full text-gray-300">
                <svg viewBox="0 0 100 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="5" y1="5.25" x2="95" y2="5.25" stroke="#3C3C3C" stroke-width="5" stroke-linecap="round"/>
                  <line id="${id}" x1="5" y1="5.25" x2="5" y2="5.25" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>`;
      setTimeout(()=>{
        const line = document.getElementById(id);
        const label = document.getElementById(percentId);
        animateValue({from:0,to:77,duration:1400,onUpdate:(v)=>{
          const x2 = 5 + (90*(v/100));
          if(line){ line.setAttribute('x2', String(x2)); }
          if(label){ label.textContent = `${Math.round(v)}%`; }
        }});
      });
      return svg;
    }
    

    // util icons/images
    function SidebarIcon(id){
      const map={
        0:`<svg class="w-8 h-8 xl:w-5 xl:h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 19C10.067 19 8.31704 18.2165 7.05029 16.9498L12 12V5C15.866 5 19 8.13401 19 12C19 15.866 15.866 19 12 19Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"/></svg>`,
        1:`<svg class="w-8 h-8 xl:w-5 xl:h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 5C3 3.34315 4.34315 2 6 2H14C17.866 2 21 5.13401 21 9V19C21 20.6569 19.6569 22 18 22H6C4.34315 22 3 20.6569 3 19V5ZM13 4H6C5.44772 4 5 4.44772 5 5V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V9H13V4ZM18.584 7C17.9413 5.52906 16.6113 4.4271 15 4.10002V7H18.584Z"/></svg>`,
        2:`<svg class="w-8 h-8 xl:w-5 xl:h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2 4V18L6.8 14.4C7.14582 14.1396 7.56713 13.9992 8 14H16C17.1046 14 18 13.1046 18 12V4C18 2.89543 17.1046 2 16 2H4C2.89543 2 2 2.89543 2 4ZM4 14V4H16V12H7.334C6.90107 11.9988 6.47964 12.1393 6.134 12.4L4 14Z"/><path d="M22 22V9C22 7.89543 21.1046 7 20 7V18L17.866 16.4C17.5204 16.1393 17.0989 15.9988 16.666 16H7C7 17.1046 7.89543 18 9 18H16C16.4329 17.9992 16.8542 18.1396 17.2 18.4L22 22Z"/></svg>`,
        3:`<svg class="w-8 h-8 xl:w-5 xl:h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9 3C6.23858 3 4 5.23858 4 8C4 10.7614 6.23858 13 9 13C11.7614 13 14 10.7614 14 8C14 5.23858 11.7614 3 9 3ZM6 8C6 6.34315 7.34315 5 9 5C10.6569 5 12 6.34315 12 8C12 9.65685 10.6569 11 9 11C7.34315 11 6 9.65685 6 8Z"/><path d="M16.9084 8.21828C16.6271 8.07484 16.3158 8.00006 16 8.00006V6.00006C16.6316 6.00006 17.2542 6.14956 17.8169 6.43645C17.8789 6.46805 17.9399 6.50121 18 6.5359C18.4854 6.81614 18.9072 7.19569 19.2373 7.65055C19.6083 8.16172 19.8529 8.75347 19.9512 9.37737C20.0496 10.0013 19.9987 10.6396 19.8029 11.2401C19.6071 11.8405 19.2719 12.3861 18.8247 12.8321C18.3775 13.2782 17.8311 13.6119 17.2301 13.8062C16.6953 13.979 16.1308 14.037 15.5735 13.9772C15.5046 13.9698 15.4357 13.9606 15.367 13.9496C14.7438 13.8497 14.1531 13.6038 13.6431 13.2319L13.6421 13.2311L14.821 11.6156C15.0761 11.8017 15.3717 11.9248 15.6835 11.9747C15.9953 12.0247 16.3145 12.0001 16.615 11.903C16.9155 11.8059 17.1887 11.639 17.4123 11.416C17.6359 11.193 17.8035 10.9202 17.9014 10.62C17.9993 10.3198 18.0247 10.0006 17.9756 9.68869C17.9264 9.37675 17.8041 9.08089 17.6186 8.82531C17.4331 8.56974 17.1898 8.36172 16.9084 8.21828Z"/><path d="M19.9981 21C19.9981 20.475 19.8947 19.9551 19.6938 19.47C19.4928 18.9849 19.1983 18.5442 18.8271 18.1729C18.4558 17.8017 18.0151 17.5072 17.53 17.3062C17.0449 17.1053 16.525 17.0019 16 17.0019V15C16.6821 15 17.3584 15.1163 18 15.3431C18.0996 15.3783 18.1983 15.4162 18.2961 15.4567C19.0241 15.7583 19.6855 16.2002 20.2426 16.7574C20.7998 17.3145 21.2417 17.9759 21.5433 18.7039C21.5838 18.8017 21.6217 18.9004 21.6569 19C21.8837 19.6416 22 20.3179 22 21H19.9981Z"/><path d="M16 21H14C14 18.2386 11.7614 16 9 16C6.23858 16 4 18.2386 4 21H2C2 17.134 5.13401 14 9 14C12.866 14 16 17.134 16 21Z"/></svg>`,
        4:`<svg class="w-8 h-8 xl:w-5 xl:h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4H7V2H9V4H15V2H17V4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22ZM5 10V20H19V10H5ZM5 6V8H19V6H5ZM17 14H7V12H17V14Z"/></svg>`,
        5:`<svg class="w-8 h-8 xl:w-5 xl:h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21.266 20.998H2.73301C2.37575 20.998 2.04563 20.8074 1.867 20.498C1.68837 20.1886 1.68838 19.8074 1.86701 19.498L11.133 3.49799C11.3118 3.1891 11.6416 2.9989 11.9985 2.9989C12.3554 2.9989 12.6852 3.1891 12.864 3.49799L22.13 19.498C22.3085 19.8072 22.3086 20.1882 22.1303 20.4975C21.9519 20.8069 21.6221 20.9976 21.265 20.998H21.266ZM12 5.99799L4.46901 18.998H19.533L12 5.99799ZM12.995 14.999H10.995V9.99799H12.995V14.999Z"/><path d="M11 16H13V18H11V16Z"/></svg>`,
        6:`<svg class="w-8 h-8 xl:w-5 xl:h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M13.82 22H10.18C9.71016 22 9.3036 21.673 9.20304 21.214L8.79604 19.33C8.25309 19.0921 7.73827 18.7946 7.26104 18.443L5.42404 19.028C4.97604 19.1709 4.48903 18.9823 4.25404 18.575L2.43004 15.424C2.19763 15.0165 2.2777 14.5025 2.62304 14.185L4.04804 12.885C3.98324 12.2961 3.98324 11.7019 4.04804 11.113L2.62304 9.816C2.27719 9.49837 2.19709 8.98372 2.43004 8.576L4.25004 5.423C4.48503 5.0157 4.97204 4.82714 5.42004 4.97L7.25704 5.555C7.5011 5.37416 7.75517 5.20722 8.01804 5.055C8.27038 4.91269 8.53008 4.78385 8.79604 4.669L9.20404 2.787C9.30411 2.32797 9.71023 2.00049 10.18 2H13.82C14.2899 2.00049 14.696 2.32797 14.796 2.787L15.208 4.67C15.4888 4.79352 15.7623 4.93308 16.027 5.088C16.274 5.23081 16.5127 5.38739 16.742 5.557L18.58 4.972C19.0277 4.82967 19.5142 5.01816 19.749 5.425L21.569 8.578C21.8015 8.98548 21.7214 9.49951 21.376 9.817L19.951 11.117C20.0158 11.7059 20.0158 12.3001 19.951 12.889L21.376 14.189C21.7214 14.5065 21.8015 15.0205 21.569 15.428L19.749 18.581C19.5142 18.9878 19.0277 19.1763 18.58 19.034L16.742 18.449C16.5095 18.6203 16.2678 18.7789 16.018 18.924C15.7559 19.0759 15.4854 19.2131 15.208 19.335L14.796 21.214C14.6956 21.6726 14.2895 21.9996 13.82 22ZM7.62004 16.229L8.44004 16.829C8.62489 16.9652 8.81755 17.0904 9.01704 17.204C9.20474 17.3127 9.39801 17.4115 9.59604 17.5L10.529 17.909L10.986 20H13.016L13.473 17.908L14.406 17.499C14.8133 17.3194 15.1999 17.0961 15.559 16.833L16.38 16.233L18.421 16.883L19.436 15.125L17.853 13.682L17.965 12.67C18.0142 12.2274 18.0142 11.7806 17.965 11.338L17.853 10.326L19.437 8.88L18.421 7.121L16.38 7.771L15.559 7.171C15.1998 6.90671 14.8133 6.68175 14.406 6.5L13.473 6.091L13.016 4H10.986L10.527 6.092L9.59604 6.5C9.39785 6.58704 9.20456 6.68486 9.01704 6.793C8.81878 6.90633 8.62713 7.03086 8.44304 7.166L7.62204 7.766L5.58204 7.116L4.56504 8.88L6.14804 10.321L6.03604 11.334C5.98684 11.7766 5.98684 12.2234 6.03604 12.666L6.14804 13.678L4.56504 15.121L5.58004 16.879L7.62004 16.229ZM11.996 16C9.7869 16 7.99604 14.2091 7.99604 12C7.99604 9.79086 9.7869 8 11.996 8C14.2052 8 15.996 9.79086 15.996 12C15.9933 14.208 14.204 15.9972 11.996 16ZM11.996 10C10.9034 10.0011 10.0139 10.8788 9.99827 11.9713C9.98262 13.0638 10.8466 13.9667 11.9387 13.9991C13.0309 14.0315 13.9469 13.1815 13.996 12.09V12.49V12C13.996 10.8954 13.1006 10 11.996 10Z"/></svg>`
      };
      return map[id] ?? '';
    }

    window.__onSidebarHide = () => {
      $('#sidebar').classList.add('hidden');
    };
    window.__onSidebarOpen = () => {
      $('#sidebar').classList.remove('hidden');
    };
    render();
  }

  function Icon({path='options', className='w-4 h-4', asHtml=false}){
    const html = `<img src="https://assets.codepen.io/3685267/${path}.svg" alt="" class="${className}"/>`;
    return asHtml? html: (()=>{ const img=new Image(); img.src=`https://assets.codepen.io/3685267/${path}.svg`; img.className=className; return img; })();
  }
  function IconButton({icon='options', className='w-4 h-4', onclick, asHtml=false}){
    const html = `<button ${onclick?`onclick=\"${onclick}\"`:''} type="button" class="${className}"><img src="https://assets.codepen.io/3685267/${icon}.svg" class="w-full h-full"/></button>`;
    return asHtml? html: (()=>{ const btn=document.createElement('button'); btn.type='button'; btn.className=className; btn.innerHTML=`<img src="https://assets.codepen.io/3685267/${icon}.svg" class="w-full h-full"/>`; if(onclick) btn.setAttribute('onclick', onclick); return btn; })();
  }
  
  function Image({path='1', className='w-4 h-4', asHtml=false}){
    const html = `<img src="https://assets.codepen.io/3685267/${path}.jpg" alt="" class="${className} rounded-full"/>`;
    return asHtml? html: (()=>{ const img=new window.Image(); img.src=`https://assets.codepen.io/3685267/${path}.jpg`; img.className=className+" rounded-full"; return img; })();
  }
  
  // ======== Conteúdo principal ========
  
  function Content({ mount }){
    mount.innerHTML = `
      <div class="w-full sm:flex p-2 mt-4 items-end">
        <div class="sm:flex-grow flex justify-between w-full">
          <div>
            <div class="flex items-center">
              <div class="text-3xl font-bold text-black">Bem vindo, usuario</div>
            </div>
            <div class="flex items-center text-sm text-gray-400">
              ${Icon({path:'res-react-dash-date-indicator', className:'w-3 h-3', asHtml:true})}
              <div class="ml-2">${month} ${day}</div>
            </div>
          </div>
          ${IconButton({icon:'res-react-dash-sidebar-open', className:'block sm:hidden', onclick:'__onSidebarOpen()', asHtml:true})}
        </div>
        <div class="w-full sm:w-56 mt-4 sm:mt-0 relative">
          ${Icon({path:'res-react-dash-search', className:'w-5 h-5 search-icon left-3 absolute', asHtml:true})}
          <form action="#" method="POST">
            <input type="text" class="pl-12 py-2 pr-2 block w-full rounded-lg border-gray-300 bg-card" placeholder="Buscar"/>
          </form>
        </div>
      </div>
      <div id="cards" class="flex flex-wrap w-full"></div>
      <div class="w-full p-2 lg:w-2/3">
        <div class="rounded-lg bg-card sm:h-80 h-60 p-0" id="AnimatedGraph"></div>
      </div>
      <div class="w-full p-2 lg:w-1/3">
        <div class="rounded-lg bg-card h-80 p-4" id="topCountries"></div>
      </div>
      <div class="w-full p-2 lg:w-1/3">
        <div class="rounded-lg bg-card h-80" id="segmentation"></div>
      </div>
      <div class="w-full p-2 lg:w-1/3">
        <div class="rounded-lg bg-card h-80" id="satisfaction"></div>
      </div>
      <div class="w-full p-2 lg:w-1/3">
        <div class="rounded-lg bg-card overflow-hidden h-80" id="addComponent"></div>
      </div>`;

    // Cards
    const cards = document.getElementById('cards');
    if(cards){
      cards.innerHTML = ''; // limpa antes
      statusdata.forEach(e => cards.appendChild(NameCard(e)));
    }

    // Gráfico
    //fetchGraphData(graphArray => {
      AnimatedGraph($('#graph'), graphArray);
    //});

    // Segmentação
    Segmentation($('#segmentation', mount));

    // Satisfação
    Satisfaction($('#satisfaction', mount));

    // Add component
    //AddComponent($('#addComponent', mount));
    
  }

  function AnimatedGraph(mount, data) {
  mount.innerHTML = `<div id="svgWrap" style="width:100%;height:260px;position:relative;"></div>`;
  const svgWrap = $('#svgWrap', mount);

  function renderSvg() {
    const w = svgWrap.clientWidth || 600;
    const h = svgWrap.clientHeight || 260;
    const pad = {l:48, r:16, t:30, b:28}; // mais topo para legendaAC
    const x0 = pad.l, x1 = w - pad.r, y0 = h - pad.b, y1 = pad.t;

    const xs = i => map(i, 0, data.length-1, x0, x1);
    const maxY = Math.max(...data.map(d => Math.max(d.total, d.finished, d.ideal))) * 1.15;
    const ys = v => map(v, 0, maxY, y0, y1);

    const barWidth = (x1 - x0) / data.length * 0.6;

    // Barras animadas
    const bars = data.map((d,i) => `
      <rect x="${xs(i)-barWidth/2}" y="${y0}" width="${barWidth}" height="0" fill="#6c5ce7">
        <animate attributeName="y" from="${y0}" to="${ys(d.total)}" dur="0.8s" fill="freeze"/>
        <animate attributeName="height" from="0" to="${y0-ys(d.total)}" dur="0.8s" fill="freeze"/>
      </rect>
    `).join('');

    // Linhas animadas
    const linePath = key => data.map((d,i)=>`${i?'L':'M'}${xs(i)} ${ys(d[key])}`).join(' ');

    const lines = `
      <path d="${linePath('finished')}" fill="none" stroke="#00b894" stroke-width="2">
        <animate attributeName="stroke-dasharray" from="0,${x1}" to="${x1},0" dur="1s" fill="freeze"/>
      </path>
      <path d="${linePath('ideal')}" fill="none" stroke="#d63031" stroke-width="2" stroke-dasharray="5,5">
        <animate attributeName="stroke-dasharray" from="0,${x1}" to="5,5" dur="1s" fill="freeze"/>
      </path>
    `;

    // Eixo X
    const xTicks = data.map((d,i) => `<text x="${xs(i)}" y="${y0 + 20}" text-anchor="middle">${d.name}</text>`).join('');

    // Legenda
    const legend = `
      <g>
        <rect x="${pad.l}" y="5" width="12" height="12" fill="#6c5ce7"/>
        <text x="${pad.l+16}" y="16" font-size="12">Total</text>

        <rect x="${pad.l+80}" y="5" width="12" height="12" fill="#00b894"/>
        <text x="${pad.l+96}" y="16" font-size="12">Finalizado</text>

        <rect x="${pad.l+180}" y="5" width="12" height="12" fill="#d63031"/>
        <text x="${pad.l+196}" y="16" font-size="12">Meta</text>
      </g>
    `;

    svgWrap.innerHTML = `
      <svg width="${w}" height="${h}">
        ${bars}
        ${lines}
        ${xTicks}
        ${legend}
      </svg>
    `;
  }

  renderSvg();
  new ResizeObserver(renderSvg).observe(svgWrap);
}

  function NameCard({id, name, position, transactions, rise, tasksCompleted, imgId}){
    const wrap = document.createElement('div');
    wrap.className='w-full p-2 lg:w-1/3';

    let statusIcon = '';
      
    switch(id){
      case 1:
          statusIcon = '<i class="fi fi-bs-cross"></i>';
          break;
      case 2:
          statusIcon = '<i class="fi fi-bs-refresh"></i>';
          break;
      case 3:
          statusIcon = '<i class="fi fi-bs-check"></i>';
          break;
      default:
          statusIcon = '<i class="fa fa-question-circle"></i>';
    }

    wrap.innerHTML = `
      <div class="rounded-lg bg-card flex justify-between p-3 h-32">
        <div>
          <div class="flex items-center">
            ${statusIcon}
            <div class="ml-2">
              <div class="flex items-center">
                <div class="mr-2 font-bold text-black">${name}</div>
                ${Icon({path:'res-react-dash-tick', asHtml:true})}
              </div>
              <div class="text-sm text-gray-400">${position}</div>
            </div>
          </div>
          <div class="text-sm mt-2">${tasksCompleted} de 5 tarefas completas</div>
          <svg class="w-44 mt-3" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="6" rx="3" fill="#2D2D2D" />
            <rect id="bar" width="0" height="6" rx="3" fill="url(#paint0_linear)" />
            <rect x="38" width="2" height="6" fill="#171717" />
            <rect x="78" width="2" height="6" fill="#171717" />
            <rect x="118" width="2" height="6" fill="#171717" />
            <rect x="158" width="2" height="6" fill="#171717" />
            <defs>
              <linearGradient id="paint0_linear" x1="0" y1="0" x2="1" y2="0">
                <stop stop-color="#8E76EF" />
                <stop offset="1" stop-color="#3912D2" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="flex flex-col items-center">
          ${Icon({path: rise? 'res-react-dash-bull':'res-react-dash-bear', className:'w-8 h-8', asHtml:true})}
          <div class="font-bold text-lg ${rise? 'text-green-500':'text-red-500'}" id="money">0.00</div>
          <div class="text-sm text-gray-400">No mês de: ${month}</div>
        </div>
      </div>`;
    // animações
    const bar = $('#bar', wrap);
    const money = $('#money', wrap);
    animateValue({ from:0, to:transactions, duration:900, onUpdate:(v)=>{ money.textContent = `${v.toFixed(0)}`; }});
    animateValue({ from:0, to:(tasksCompleted/5)*200, duration:900, onUpdate:(w)=>{ bar.setAttribute('width', String(w)); }});
    return wrap;
  }

  // ======== Gráfico SVG responsivo (linhas) ========
  function Graph(mount){
    mount.innerHTML = `
      <div class="flex p-4 h-full flex-col">
        <div>
          <div class="flex items-center">
            <div class="font-bold text-white">Sumário mensal</div>
            <div class="flex-grow"></div>
            ${Icon({path:'res-react-dash-graph-range', className:'w-4 h-4', asHtml:true})}
            <div class="ml-2">No mês de: ${month}</div>
            <div class="ml-6 w-5 h-5 flex justify-center items-center rounded-full icon-background">?</div>
          </div>
          <div class="font-bold ml-5">Jan - Set</div>
        </div>
        <div class="flex-grow">
          <div class="w-full h-full" id="svgWrap" style="min-height:12rem"></div>
        </div>
      </div>`;

    const svgWrap = $('#svgWrap', mount);
    function renderSvg(){
      const w = svgWrap.clientWidth || 600;
      const h = svgWrap.clientHeight || 260;
      const pad = {l:48, r:16, t:10, b:28};
      const x0 = pad.l, x1 = w - pad.r, y0 = h - pad.b, y1 = pad.t;
      const xs = (i)=> map(i, 0, graphData.length-1, x0, x1);
      const maxY = Math.max(...graphData.map(d=>Math.max(d.revenue,d.expectedRevenue)))*1.15;
      const ys = (v)=> map(v, 0, maxY, y0, y1);
      const path = (key)=> graphData.map((d,i)=> `${i? 'L':'M'} ${xs(i)} ${ys(d[key])}`).join(' ');
      const xTicks = graphData.map((d,i)=>({x: xs(i), label:d.name}));

      svgWrap.innerHTML = `
        <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="1" y2="0">
              <stop stop-color="#6B8DE3"/>
              <stop offset="1" stop-color="#7D1C8D"/>
            </linearGradient>
          </defs>
          <!-- grid vertical -->
          ${xTicks.map(t=>`<line x1="${t.x}" x2="${t.x}" y1="${y1}" y2="${y0}" stroke="#252525" stroke-width="6"/>`).join('')}
          <!-- eixo X labels -->
          ${xTicks.map(t=>`<text x="${t.x}" y="${h-8}" text-anchor="middle" font-size="12" fill="#9aa1b2">${t.label}</text>`).join('')}
          <!-- linhas -->
          <path d="${path('expectedRevenue')}" fill="none" stroke="#242424" stroke-width="3" class="stroke-dash"/>
          <path id="rev" d="${path('revenue')}" fill="none" stroke="url(#paint0_linear)" stroke-width="4"/>
        </svg>`;
      // anima desenhando o caminho principal
      const p = $('#rev', svgWrap);
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      p.getBoundingClientRect();
      animateValue({from:len,to:0,duration:1200,onUpdate:(v)=>{ p.style.strokeDashoffset = v; }});
    }
    // primeira render e redimensionamento
    renderSvg();
    const ro = new ResizeObserver(renderSvg); ro.observe(svgWrap);
  }

  function TopCountries(mount){
    mount.innerHTML = `
      <div class="flex justify-between items-center">
        <div class="text-white font-bold">Top Countries</div>
        ${Icon({path:'res-react-dash-plus', className:'w-5 h-5', asHtml:true})}
      </div>
      <div class="text-sm text-gray-400">favourites</div>
      <div id="rows"></div>
      <div class="flex-grow"></div>
      <div class="flex justify-center"><div>Check All</div></div>`;
    const rows = $('#rows', mount);
    Countrydata.forEach(({name,rise,value,id})=>{
      const row = document.createElement('div');
      row.className='flex items-center mt-3';
      row.innerHTML = `
        <div>${id}</div>
        <img src="https://assets.codepen.io/3685267/res-react-dash-flag-${id}.svg" class="ml-2 w-6 h-6"/>
        <div class="ml-2">${name}</div>
        <div class="flex-grow"></div>
        <div>$${value.toLocaleString()}</div>
        <img src="https://assets.codepen.io/3685267/${rise? 'res-react-dash-country-up':'res-react-dash-country-down'}.svg" class="w-4 h-4 mx-3"/>
        <img src="https://assets.codepen.io/3685267/res-react-dash-options.svg" class="w-2 h-2"/>
      `;
      rows.appendChild(row);
    });
  }

  function Segmentation(mount){
    mount.innerHTML = `
      <div class="p-4 h-full">
        <div class="flex justify-between items-center">
          <div class="text-white font-bold">Segmentation</div>
          <img src="https://assets.codepen.io/3685267/res-react-dash-options.svg" class="w-2 h-2"/>
        </div>
        <div class="mt-3">Por processo:</div>
        <div id="rows"></div>
        <div class="flex mt-3 px-3 items-center justify-between bg-details rounded-xl w-36 h-12 text-white">
          <div>Detalhes</div>
          <img src="https://assets.codepen.io/3685267/res-react-dash-chevron-right.svg" class="w-4 h-4"/>
        </div>
      </div>`;
    const rows = $('#rows', mount.parentElement);
    segmentationData.forEach(({c1,c2,c3,color})=>{
      const row = document.createElement('div');
      row.className='flex items-center';
      row.innerHTML = `
        <div class="w-2 h-2 rounded-full" style="background:${color}"></div>
        <div class="ml-2" style="color:${color}">${c1}</div>
        <div class="flex-grow"></div>
        <div style="color:${color}">${c2}</div>
        <div class="ml-2 w-12 card-stack-border"></div>
        <div class="ml-2 h-8">
          <div class="w-20 h-28 rounded-lg overflow-hidden" style="background:${c3}">
            ${c1==='Other'? `<img src="https://assets.codepen.io/3685267/res-react-dash-user-card.svg"/>`:''}
          </div>
        </div>`;
      rows.appendChild(row);
    });
  }

  function Satisfaction(mount){
    mount.innerHTML = `
      <div class="p-4 h-full">
        <div class="flex justify-between items-center">
          <div class="text-white font-bold">Satisfication</div>
          <img src="https://assets.codepen.io/3685267/res-react-dash-options.svg" class="w-2 h-2"/>
        </div>
        <div class="mt-3">Conclusão Geral:</div>
        <div class="flex justify-center"><svg viewBox="0 0 700 380" fill="none" width="300" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 350C100 283.696 126.339 220.107 173.223 173.223C220.107 126.339 283.696 100 350 100C416.304 100 479.893 126.339 526.777 173.223C573.661 220.107 600 283.696 600 350" stroke="#2d2d2d" stroke-width="40" stroke-linecap="round"/>
          <path id="satPath" d="M100 350C100 283.696 126.339 220.107 173.223 173.223C220.107 126.339 283.696 100 350 100C416.304 100 479.893 126.339 526.777 173.223C573.661 220.107 600 283.696 600 350" stroke="#2f49d0" stroke-width="40" stroke-linecap="round" stroke-dasharray="785.4" stroke-dashoffset="785.4"/>
          <circle id="satDot" cx="140" cy="350" r="12" fill="#fff"/>
        </svg></div>
        <div class="flex justify-center">
          <div class="flex justify-between mt-2" style="width:300px">
            <div style="width:50px;padding-left:16px">0%</div>
            <div style="width:150px;text-align:center">
              <div class="font-bold" style="color:#2f49d1;font-size:18px">88,1%</div>
              <div>Taxa de finalização</div>
            </div>
            <div style="width:50px">100%</div>
          </div>
        </div>
      </div>`;
    // anima o arco e o ponto
    const path = $('#satPath', mount);
    const dot = $('#satDot', mount);
    animateValue({from:785.4, to:78.54, duration:1500, easing:(t)=>1-Math.pow(1-t,3), onUpdate:(v)=>{
      path.setAttribute('stroke-dashoffset', String(v));
      const pi = Math.PI; const tau = 2*pi;
      const cx = 350 + 250 * Math.cos(map(v, 785.4, 0, pi, tau));
      const cy = 350 + 250 * Math.sin(map(v, 785.4, 0, pi, tau));
      dot.setAttribute('cx', String(cx));
      dot.setAttribute('cy', String(cy));
    }});
  }

  function AddComponent(mount){
    mount.innerHTML = `
      <div>
        <div class="w-full h-20 add-component-head"></div>
        <div class="flex flex-col items-center" style="transform:translate(0,-40px)">
          <div style="background:#414455;width:80px;height:80px;border-radius:999px;overflow:hidden">
            <img src="https://assets.codepen.io/3685267/res-react-dash-rocket.svg" class="w-full h-full"/>
          </div>
          <div class="text-white font-bold mt-3">No Components Created Yet</div>
          <div class="mt-2">Simply create your first component</div>
          <div class="mt-1">Just click on the button</div>
          <button class="flex items-center p-3 mt-3" style="background:#2f49d1;border-radius:15px;color:white">
            <img src="https://assets.codepen.io/3685267/res-react-dash-add-component.svg" class="w-5 h-5"/>
            <div class="ml-2">Add Component</div>
            <div class="ml-2" style="background:#4964ed;border-radius:15px;padding:4px 8px">129</div>
          </button>
        </div>
      </div>`;
  }

  // init
App();

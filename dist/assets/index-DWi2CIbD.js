var q=Object.defineProperty;var M=(e,t,s)=>t in e?q(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;var l=(e,t,s)=>M(e,typeof t!="symbol"?t+"":t,s);var T=(e,t,s)=>new Promise((n,i)=>{var r=o=>{try{h(s.next(o))}catch(y){i(y)}},d=o=>{try{h(s.throw(o))}catch(y){i(y)}},h=o=>o.done?n(o.value):Promise.resolve(o.value).then(r,d);h((s=s.apply(e,t)).next())});(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const d of r.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&n(d)}).observe(document,{childList:!0,subtree:!0});function s(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=s(i);fetch(i.href,r)}})();var m;customElements.define("artist-cover",(m=class extends HTMLElement{connectedCallback(){this.render()}attributeChangedCallback(){this.render()}render(){this.innerHTML=`
      <a href="${this.getAttribute("href")}">
        <img src="${this.getAttribute("cover")}" />
        <div class="artist-list-item-title">${this.getAttribute("title")}</div>
      </a>
     `}},l(m,"observedAttributes",["cover","title","href"]),m));customElements.define("search-bar",class extends HTMLElement{connectedCallback(){this.innerHTML=`
      <div id="search-wrapper">
        <!-- ajouter la classe "active" à #search-input pour l'afficher-->
        <input id="search-input" type="search" spellcheck="false" autocapitalize="false" autofocus />

        <button id="search-trigger" class="icon-button" type="button">
          <span class="material-icons">search</span>
        </button>
      </div>
     `;const e=this.querySelector("#search-input");this.querySelector("#search-trigger").addEventListener("click",()=>{e.classList.toggle("active")}),e.addEventListener("change",()=>{window.location.hash=`#search/${e.value}`})}});const k=new CustomEvent("play_click"),w=new CustomEvent("favorite_click");var f;customElements.define("song-item",(f=class extends HTMLElement{connectedCallback(){this.render()}attributeChangedCallback(){this.render()}render(){const e=this.getAttribute("favorite")=="true"?"favorite":"favorite_border";this.innerHTML=`
      <div class="list-item-title">${this.getAttribute("title")}</div>
      <div class="list-item-actions">
        <button type="button" class="icon-button favorite-button ">
          <span class="material-icons">${e}</span>
        </button>
        <button type="button" class="icon-button play-button">
          <span class="material-icons">play_arrow</span>
        </button>
      </div>`,this.querySelector(".play-button").addEventListener("click",()=>{this.dispatchEvent(k)}),this.querySelector(".favorite-button").addEventListener("click",()=>{this.dispatchEvent(w)})}},l(f,"observedAttributes",["favorite","href","title"]),f));customElements.define("spot-footer",class extends HTMLElement{connectedCallback(){this.innerHTML=`
      <nav>
        <a href="#home" class="active">
          <span class="material-icons">home</span>
          <span>Home</span>
        </a>
        <a href="#player">
          <span class="material-icons">subscriptions</span>
          <span>Lecteur</span>
        </a>
        <a href="#artists">
          <span class="material-icons">library_music</span>
          <span>Musique</span>
        </a>
        <a href="#favorites">
          <span class="material-icons">favorite</span>
          <span>Favoris</span>
        </a>
      </nav>
    `,this.hashChange=this.hashChange.bind(this),window.addEventListener("hashchange",this.hashChange),this.hashChange()}hashChange(){var t,s;const e=window.location.hash.split("/")[0];(t=this.querySelector("nav a.active"))==null||t.classList.remove("active"),(s=this.querySelector(`nav a[href="${e}"]`))==null||s.classList.add("active")}});const A="https://webmob-ui-22-spotlified.herokuapp.com",v=e=>fetch(`${A}${e}`).then(t=>t.json()),C=()=>v("/api/artists"),H=e=>v(`/api/artists/${e}/songs`),I=e=>v(`/api/songs/search/${e}`);customElements.define("page-artists",class extends HTMLElement{connectedCallback(){this.innerHTML=`
      <h4>Artistes</h4>

      <artist-list>
      </artist-list>
    `;const e=this.querySelector("artist-list");C().then(t=>{t.forEach(s=>{e.innerHTML+=`<artist-cover href="#artists/${s.id}" title="${s.name}" cover="${s.image_url}" />`})})}});customElements.define("page-home",class extends HTMLElement{connectedCallback(){this.innerHTML=`
      <h1 class="hero">Bienvenue</h1>
      <h4>Playlists</h4>
    `}});const a=document.querySelector("#audio-player");let u=[],c=null;const g=(e,t)=>{c=e,t&&(u=t),a.src=e.audio_url,a.play()},$=()=>{let e=u.indexOf(c)+1;e==u.length&&(e=0),g(u[e])},_=()=>{let e=u.indexOf(c)-1;e==-1&&(e=u.length-1),g(u[e])};function E(e){e=parseInt(e,10);let t=Math.floor(e/3600),s=Math.floor((e-t*3600)/60),n=e-t*3600-s*60;return s<10&&(s="0"+s),n<10&&(n="0"+n),s+":"+n}customElements.define("page-player",class extends HTMLElement{constructor(){super(...arguments);l(this,"playerThumbnail");l(this,"playerSongTitle");l(this,"playerArtistName");l(this,"playerPrev");l(this,"playerNext");l(this,"playerPlay");l(this,"playerPlayIcon");l(this,"playerTimeCurrent");l(this,"playerTimeDuration");l(this,"playerProgress")}connectedCallback(){this.innerHTML=`
      <div id="player">
        <div id="player-thumbnail">
          <!-- utiliser l'id de cet élément pour changer la cover de la chanson -->
          <img src="http://placecats.com/200/300" id="player-thumbnail-image" />
        </div>

        <div id="player-infos">
          <div id="player-infos-song">
            <span class="material-icons">music_note</span>
            <!-- utiliser l'id de cet élément pour changer le titre de la chanson -->
            <span id="player-infos-song-title">
              -
            </span>
          </div>

          <div id="player-infos-artist">
            <span class="material-icons">person</span>
            <!-- utiliser l'id de cet élément pour changer le nom de l'artiste -->
            <span id="player-infos-artist-name">
              -
            </span>
          </div>
        </div>

        <div id="player-controls">
          <!-- utiliser l'id de cet élément pour ajouter un listener pour le click sur précédent -->
          <button type="button" class="player-control player-control-small" id="player-control-previous">
            <span class="material-icons">skip_previous</span>
          </button>
          <!-- utiliser l'id de cet élément pour ajouter un listener pour le click sur play/pause -->
          <button type="button" class="player-control" id="player-control-play">
            <span class="material-icons">play_arrow</span>
          </button>
          <!-- utiliser l'id de cet élément pour ajouter un listener pour le click sur suivant -->
          <button type="button" class="player-control player-control-small" id="player-control-next">
            <span class="material-icons">skip_next</span>
          </button>
        </div>

        <div id="player-progress">
          <input type="range" id="player-progress-bar" />
          <div id="player-times">
            <!-- utiliser l'id de cet élément pour changer le temps écoulé -->
            <span id="player-time-current">--:--</span>
            <!-- utiliser l'id de cet élément pour changer la durée totale -->
            <span id="player-time-duration">--:--</span>
          </div>
        </div>
      </div>
      `,this.playerThumbnail=this.querySelector("#player-thumbnail-image"),this.playerSongTitle=this.querySelector("#player-infos-song-title"),this.playerArtistName=this.querySelector("#player-infos-artist-name"),this.playerPrev=this.querySelector("#player-control-previous"),this.playerNext=this.querySelector("#player-control-next"),this.playerPlay=this.querySelector("#player-control-play"),this.playerPlayIcon=this.playerPlay.querySelector(".material-icons"),this.playerTimeCurrent=this.querySelector("#player-time-current"),this.playerTimeDuration=this.querySelector("#player-time-duration"),this.playerProgress=this.querySelector("#player-progress-bar"),this.bindEvents()}bindEvents(){this.updatePlayerInfos=this.updatePlayerInfos.bind(this),this.updatePlayButton=this.updatePlayButton.bind(this),a.addEventListener("loadeddata",this.updatePlayerInfos),this.updatePlayerInfos(),this.updatePlayButton(),this.playerPlay.addEventListener("click",()=>{a.paused?a.play():a.pause()}),this.playerPrev.addEventListener("click",_),this.playerNext.addEventListener("click",$),this.playerProgress.addEventListener("change",t=>{a.currentTime=t.currentTarget.value}),a.addEventListener("timeupdate",()=>{this.playerProgress.value=a.currentTime,this.playerTimeCurrent.innerText=E(a.currentTime)}),a.addEventListener("play",this.updatePlayButton),a.addEventListener("pause",this.updatePlayButton)}updatePlayerInfos(){c&&(this.playerSongTitle.innerText=c.title,this.playerArtistName.innerText=c.artist.name,this.playerThumbnail.src=c.artist.image_url,this.playerProgress.max=a.duration,this.playerTimeDuration.innerText=E(a.duration))}updatePlayButton(){a.paused?this.playerPlayIcon.innerText="play_arrow":this.playerPlayIcon.innerText="pause"}});const b="favorites",P=(e,t)=>localStorage.setItem(e,JSON.stringify(t)),N=e=>localStorage.getItem(e)&&JSON.parse(localStorage.getItem(e)),p=()=>{var e;return(e=N(b))!=null?e:[]},S=e=>!!p().find(t=>t.id==e.id),O=e=>{const t=p();t.push(e),P(b,t)},B=e=>{const t=p(),s=t.findIndex(n=>n.id==e.id);t.splice(s,1),P(b,t)};class L extends HTMLElement{constructor(){super(...arguments);l(this,"songs",null)}getSongsData(){}getTitle(){}connectedCallback(){this.getSongsData().then(s=>{this.songs=s,this.innerHTML=`
          <h4>
          </h4>

          <div class="list">
          </div>
        `,this.querySelector("h4").innerText=this.getTitle();const n=this.querySelector(".list");s.length==0&&(n.innerText="Aucun résultat"),s.forEach(i=>{const r=document.createElement("song-item");r.setAttribute("title",i.title),r.setAttribute("favorite",S(i)),r.addEventListener("play_click",()=>g(i,s)),r.addEventListener("favorite_click",()=>{S(i)?(B(i),r.setAttribute("favorite",!1)):(O(i),r.setAttribute("favorite",!0))}),n.append(r)})})}}customElements.define("page-artist-songs",class extends L{getSongsData(){const e=this.getAttribute("artist-id");return H(e)}getTitle(){return`Artistes > ${this.songs[0].artist.name}`}});customElements.define("page-search-songs",class extends L{getSongsData(){const e=this.getAttribute("query");return I(e)}getTitle(){return`Résultats pour : ${this.getAttribute("query")}`}});customElements.define("page-favorites",class extends L{getSongsData(){return T(this,null,function*(){return p()})}getTitle(){return"Favoris"}});const x=()=>{const e=document.querySelector("main"),t=(window.location.hash||"#home").split("/");t[0]=="#home"?e.innerHTML="<page-home />":t[0]=="#player"?e.innerHTML="<page-player />":t[0]=="#search"&&t[1]?e.innerHTML=`<page-search-songs query="${t[1]}" />`:t[0]=="#artists"&&t[1]?e.innerHTML=`<page-artist-songs artist-id="${t[1]}" />`:t[0]=="#artists"&&!t[1]?e.innerHTML="<page-artists />":t[0]=="#favorites"&&(e.innerHTML="<page-favorites />")};window.addEventListener("hashchange",x);x();window.addEventListener("offline",e=>document.body.classList.add("offline"));window.addEventListener("online",e=>document.body.classList.remove("offline"));navigator.serviceWorker.register("/monworker.js");

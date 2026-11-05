/* [create-plugin] version: 7.7.0 */
/* [create-plugin] plugin: asimzulfiqar-customdashboardlist-panel@1.0.2 */
define(["@emotion/css","@grafana/data","@grafana/runtime","@grafana/ui","react"],(e,t,a,r,n)=>(()=>{"use strict";var o={89(t){t.exports=e},781(e){e.exports=t},531(e){e.exports=a},7(e){e.exports=r},959(e){e.exports=n}},i={};function l(e){var t=i[e];if(void 0!==t)return t.exports;var a=i[e]={exports:{}};return o[e](a,a.exports,l),a.exports}l.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return l.d(t,{a:t}),t},l.d=(e,t)=>{for(var a in t)l.o(t,a)&&!l.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},l.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),l.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var s={};l.r(s),l.d(s,{plugin:()=>I});var d=l(781),c=l(959),p=l.n(c),m=l(89),u=l(7);function g(e,t="de-grouped",a=0,r=""){if(null==e||isNaN(e))return"-";const n=Number(e.toFixed(a));let o;switch(t){case"de-grouped":o=n.toLocaleString("de-DE",{minimumFractionDigits:a,maximumFractionDigits:a});break;case"de-plain":o=n.toString().replace(".",",");break;case"en-grouped":o=n.toLocaleString("en-US",{minimumFractionDigits:a,maximumFractionDigits:a});break;default:o=n.toString()}return r?`${o} ${r}`.trim():o}function h(e,t,a=[]){if(t){const a=e.findIndex(e=>e.name.toLowerCase()===t.toLowerCase()||e.labels&&Object.values(e.labels).some(e=>e.toLowerCase()===t.toLowerCase()));if(-1!==a)return a}for(const t of a){const a=e.findIndex(e=>t.test(e.name)||e.labels&&Object.values(e.labels).some(e=>t.test(e)));if(-1!==a)return a}return-1}function b(e,t,a,r){var n,o,i,l,s;let d=(null===(n=a.wellLinks)||void 0===n?void 0:n.wellUrlPattern)||"/d/${dashboardUid}?var-GroupWells=$__all&from=${from}&to=${to}";r&&(d=r(d));const c=t||(r?r((null===(o=a.wellLinks)||void 0===o?void 0:o.targetDashboardUid)||""):null===(i=a.wellLinks)||void 0===i?void 0:i.targetDashboardUid)||"",p=encodeURIComponent((null===(l=a.wellLinks)||void 0===l?void 0:l.defaultTimeFrom)||"now-5d"),m=encodeURIComponent((null===(s=a.wellLinks)||void 0===s?void 0:s.defaultTimeTo)||"now");let u=d.replace(/\${wellId}/g,encodeURIComponent(e)).replace(/\${id_raw}/g,encodeURIComponent(e)).replace(/\${id}/g,encodeURIComponent(e)).replace(/\${dashboardUid}/g,encodeURIComponent(c)).replace(/\${from}/g,p).replace(/\${to}/g,m);const g=function(){var e,t,a;if("undefined"==typeof window)return"";const r=null===(a=window)||void 0===a||null===(t=a.grafanaBootData)||void 0===t||null===(e=t.settings)||void 0===e?void 0:e.appSubUrl;return r&&"string"==typeof r?r:window.location&&"string"==typeof window.location.pathname&&window.location.pathname.startsWith("/grafana")?"/grafana":""}();return g&&u.startsWith("/")&&!u.startsWith(g)&&(u=`${g}${u}`),u}function f(e,t,a){var r;if(!e||0===e.length)return{rows:[]};const n=t.fieldMappings||{},o=new Map,i=e=>{if(!e)return"";if(a&&(e.includes("$")||e.includes("{"))){const t=a(e);return t!==e?t:""}return""},l=i(n.operatorField),s=i(n.wellIdField),d=(i(n.wellNameField),i(n.betreiberkennzahlField)),c=i(n.authorityNameField),p=i(n.roleField),m=i(n.userNameField);let u=p?p.toLowerCase().includes("admin")?"admin":p.toLowerCase().includes("author")||p.toLowerCase().includes("regulat")?"authority":"operator":void 0,g=c||void 0,f=d||void 0,w=m||void 0;for(const t of e){const e=t.fields;if(!e||0===e.length)continue;const a=t.length,r=h(e,n.wellNameField,[/title/i,/brunnenbezeichnung/i,/brunnen/i,/station/i,/anlage/i,/messstelle/i,/^name$/i]),i=h(e,n.wellIdField,[/well_id/i,/objektkennzahl/i,/id_raw/i,/device_id/i,/station_id/i,/meter_id/i,/^id$/i]),c=h(e,n.operatorField,[/operator/i,/betreiber/i,/company/i,/vendor/i]),p=h(e,n.meterReadingField,[/reading/i,/meter/i,/zaehlerstand/i,/value/i,/total/i]),m=h(e,n.consumption12hField,[/12h/i,/12_h/i,/consumption_12h/i,/letzte_12/i]),b=h(e,n.consumptionYearField,[/year/i,/jahr/i,/annual/i,/gesamt/i]),x=h(e,n.lastSeenField,[/time/i,/timestamp/i,/last_seen/i,/status_time/i]),k=h(e,n.statusField,[/status/i,/online/i]),$=h(e,n.dashboardUidField,[/uid/i,/dashboard/i]),v=h(e,n.betreiberkennzahlField,[/betreiberkennzahl/i,/numerical_id/i,/operator_id/i,/betreiber_id/i,/kennzahl/i,/bzk/i,/account_id/i]),N=h(e,n.authorityNameField,[/authority/i,/regulator/i,/agency/i,/leitstelle/i,/behoerde/i,/amt/i]),E=h(e,n.roleField,[/role/i,/user_role/i,/user_type/i]),S=h(e,n.userNameField,[/user_name/i,/username/i,/^user$/i,/benutzer/i]),z=-1!==r||-1!==c;for(let t=0;t<a;t++){var y;const a=-1!==i?String(null!==(y=e[i].values[t])&&void 0!==y?y:""):s||"",n=-1!==r&&null!=e[r].values[t]?String(e[r].values[t]).trim():"",h=a||n||`row-${t}`;if(!h)continue;if(-1!==r&&!n)continue;let L=o.get(h);if(L||z||!(o.size>0)){if(L||(L={id:a||h,name:n||a||"Messstelle",operator:l||"Allgemein"}),a&&(L.id=a),n&&(L.name=n),-1!==c&&null!=e[c].values[t]&&""!==String(e[c].values[t]).trim()?L.operator=String(e[c].values[t]).trim():!l||L.operator&&"Allgemein"!==L.operator||(L.operator=l),-1!==v&&null!=e[v].values[t]){const a=String(e[v].values[t]).trim();a&&"null"!==a&&"undefined"!==a&&(L.betreiberkennzahl=a,f||(f=a))}else d&&!L.betreiberkennzahl&&(L.betreiberkennzahl=d);if(-1!==p&&null!=e[p].values[t]){const a=Number(e[p].values[t]);isNaN(a)||(L.meterReading=a)}if(-1!==m&&null!=e[m].values[t]){const a=Number(e[m].values[t]);isNaN(a)||(L.consumption12h=a)}if(-1!==b&&null!=e[b].values[t]){const a=Number(e[b].values[t]);isNaN(a)||(L.consumptionYear=a)}if(-1!==x&&null!=e[x].values[t]&&(L.lastSeen=e[x].values[t]),-1!==k&&null!=e[k].values[t]){const a=e[k].values[t];"boolean"==typeof a?L.isOnline=a:"number"==typeof a?L.isOnline=1===a:"string"==typeof a&&(L.isOnline="green"===a.toLowerCase()||"online"===a.toLowerCase()||"1"===a)}if(-1!==$&&null!=e[$].values[t]&&(L.dashboardUid=String(e[$].values[t])),-1===N||null==e[N].values[t]||g||(g=String(e[N].values[t])),-1!==S&&null!=e[S].values[t]&&!w){const a=String(e[S].values[t]).trim();a&&(w=a)}if(-1!==E&&null!=e[E].values[t]&&!u){const a=String(e[E].values[t]).toLowerCase();a.includes("admin")?u="admin":a.includes("author")||a.includes("regulat")||a.includes("supervis")?u="authority":(a.includes("operat")||a.includes("client")||a.includes("user"))&&(u="operator")}o.set(h,L)}}}const x=(null!==(r=t.excludedOperators)&&void 0!==r?r:"Hauptbetreiber").split(",").map(e=>e.trim().toLowerCase()).filter(Boolean);return{rows:Array.from(o.values()).filter(e=>!(e=>{if(!e)return!1;const t=e.toLowerCase();return x.some(e=>t.includes(e))})(e.operator||"")).map(e=>{var r,n,o;const i=e.id||"unbekannt",s=e.name||i,c=e.operator||l||"Allgemein",p=function(e,t=24){if(!e)return{isOnline:!1,relativeText:"Keine Daten empfangen",formattedDate:"-"};let a="number"==typeof e?e:new Date(e).getTime();if(isNaN(a)||a<=0)return{isOnline:!1,relativeText:"Ungültiger Zeitstempel",formattedDate:"-"};a<1e11?a*=1e3:a>1e14&&(a=Math.floor(a/1e6));const r=Date.now()-a,n=r/36e5,o=n>=-1&&n<=t,i=new Date(a).toLocaleString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});let l="";l=n<1?`Vor ${Math.max(1,Math.round(r/6e4))} Min.`:n<24?`Vor ${Math.round(n)} Std.`:`Vor ${Math.round(n/24)} Tag(en) (Kein Empfang > ${t}h)`;return{isOnline:o,relativeText:l,formattedDate:i}}(e.lastSeen,t.freshnessHoursThreshold||24),m=void 0!==e.isOnline?e.isOnline:p.isOnline,u=b(i,e.dashboardUid||"",t,a);return{id:i,name:s,operator:c,betreiberkennzahl:e.betreiberkennzahl||d,meterReading:null!==(r=e.meterReading)&&void 0!==r?r:null,consumption12h:null!==(n=e.consumption12h)&&void 0!==n?n:null,consumptionYear:null!==(o=e.consumptionYear)&&void 0!==o?o:null,lastSeen:e.lastSeen,lastSeenFormatted:p.formattedDate,isOnline:m,dashboardUid:e.dashboardUid,targetUrl:u}}),detectedRole:u,detectedAuthority:g,detectedBetreiberkennzahl:f,detectedUserName:w}}const w=[{id:"FL-101",name:"Einspeisestation Node-Alpha (FL-101)",operator:"Stadtwerke Sektor Nord (GmbH)",betreiberkennzahl:"OPS-DE-1044",meterReading:245890,consumption12h:124,consumptionYear:245890,lastSeen:Date.now()-54e5,lastSeenFormatted:new Date(Date.now()-54e5).toLocaleString("de-DE"),isOnline:!0,targetUrl:"/d/telemetry-detail?var-device_id=FL-101&from=now-7d&to=now"},{id:"FL-102",name:"Druckminderstation Beta (FL-102)",operator:"Stadtwerke Sektor Nord (GmbH)",betreiberkennzahl:"OPS-DE-1044",meterReading:68420,consumption12h:35,consumptionYear:68420,lastSeen:Date.now()-1368e4,lastSeenFormatted:new Date(Date.now()-1368e4).toLocaleString("de-DE"),isOnline:!0,targetUrl:"/d/telemetry-detail?var-device_id=FL-102&from=now-7d&to=now"},{id:"FL-103",name:"Verteilerknoten Nord 03 (FL-103)",operator:"Stadtwerke Sektor Nord (GmbH)",betreiberkennzahl:"OPS-DE-1044",meterReading:512300,consumption12h:0,consumptionYear:512300,lastSeen:Date.now()-288e5,lastSeenFormatted:new Date(Date.now()-288e5).toLocaleString("de-DE"),isOnline:!0,targetUrl:"/d/telemetry-detail?var-device_id=FL-103&from=now-7d&to=now"},{id:"FL-104",name:"Pumpwerk Zentral 04 (FL-104)",operator:"Stadtwerke Sektor Nord (GmbH)",betreiberkennzahl:"OPS-DE-1044",meterReading:389140,consumption12h:null,consumptionYear:389140,lastSeen:Date.now()-1224e5,lastSeenFormatted:new Date(Date.now()-1224e5).toLocaleString("de-DE"),isOnline:!1,targetUrl:"/d/telemetry-detail?var-device_id=FL-104&from=now-7d&to=now"},{id:"DS-201",name:"Hauptübergabestation Süd (DS-201)",operator:"Industriepark Süd Betriebsgesellschaft",betreiberkennzahl:"OPS-DE-2088",meterReading:780450,consumption12h:210,consumptionYear:780450,lastSeen:Date.now()-24e5,lastSeenFormatted:new Date(Date.now()-24e5).toLocaleString("de-DE"),isOnline:!0,targetUrl:"/d/telemetry-detail?var-device_id=DS-201&from=now-7d&to=now"},{id:"DS-202",name:"Kühlkreislaufmesspunkt 02 (DS-202)",operator:"Industriepark Süd Betriebsgesellschaft",betreiberkennzahl:"OPS-DE-2088",meterReading:142800,consumption12h:45,consumptionYear:142800,lastSeen:Date.now()-1872e5,lastSeenFormatted:new Date(Date.now()-1872e5).toLocaleString("de-DE"),isOnline:!1,targetUrl:"/d/telemetry-detail?var-device_id=DS-202&from=now-7d&to=now"},{id:"SP-301",name:"Speicherbecken Zulauf 01 (SP-301)",operator:"Energie- & Wasserverbund West",betreiberkennzahl:"OPS-DE-3099",meterReading:94600,consumption12h:18,consumptionYear:94600,lastSeen:Date.now()-9e6,lastSeenFormatted:new Date(Date.now()-9e6).toLocaleString("de-DE"),isOnline:!0,targetUrl:"/d/telemetry-detail?var-device_id=SP-301&from=now-7d&to=now"}];var y=l(531);const x=({options:e,isAuthority:t,detectedRole:a,detectedAuthority:r,detectedBetreiberkennzahl:n,detectedUserName:o,operatorName:i,currentUsername:l,isNarrow:s=!1})=>{var d,c,m,g;const h=(0,u.useStyles2)(k);if(!e.header.showHeader)return null;const b=e.header.headerTitle,f="admin"===a,w=e=>{if(!e)return!0;const t=e.replace(/['"]/g,"").trim();return!t||(!!/^\d+$/.test(t)||!(!t.includes("${")&&!t.includes("__user")))},x=(null===y.config||void 0===y.config||null===(c=y.config.bootData)||void 0===c||null===(d=c.user)||void 0===d?void 0:d.name)||(null===y.config||void 0===y.config||null===(g=y.config.bootData)||void 0===g||null===(m=g.user)||void 0===m?void 0:m.login),$=(e.header.userName||"").trim(),v=w(o)?void 0:o,N=w($)?void 0:$,E=w(x)?void 0:x,S=v||(!t&&i?i:void 0)||E||N||i||l||(f?"Administrator":"Benutzer"),z=(e.header.authorityName||"").trim(),L=z&&"Zentrale Netzleitstelle"!==z&&!z.includes("${")?z:void 0,D=r||L,O=(e.header.betreiberkennzahl||"").trim(),C=O&&"OPS-DE-1044"!==O&&!O.includes("${")?O:void 0,M=n||C,T=t&&!f&&D&&"All Authorities"!==D;return p().createElement("div",{className:h.container},b&&"Smart Utility & Grid Operations"!==b&&p().createElement("div",{className:s?h.titleRowNarrow:h.titleRow},p().createElement("div",{className:h.titleGroup},p().createElement("div",{className:h.titleTextWrapper},p().createElement("h1",{className:s?h.mainTitleNarrow:h.mainTitle},b)))),p().createElement("div",{className:h.welcomeCard},p().createElement("div",{className:h.welcomeText},t?p().createElement("div",{className:h.greetingLine},p().createElement("span",{className:h.welcomeTitle},"Willkommen ",S),T&&p().createElement("span",{className:h.authorityTag}," (",D,")")):p().createElement("div",null,p().createElement("div",{className:h.greetingLine},p().createElement("span",{className:h.welcomeTitle},"Willkommen ",S)),M&&p().createElement("div",{className:h.bzkLine},p().createElement("span",{className:h.bzkLabel},"Betreiberkennzahl:")," ",p().createElement("span",{className:h.bzkValue},M))))))},k=e=>({container:m.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1)};
    margin-bottom: ${e.spacing(1.5)};
  `,titleRow:m.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: ${e.spacing(1.5)};
    padding-bottom: ${e.spacing(.5)};
  `,titleRowNarrow:m.css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: ${e.spacing(1)};
    padding-bottom: ${e.spacing(.5)};
  `,titleGroup:m.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1.5)};
    width: 100%;
    min-width: 0;
  `,titleTextWrapper:m.css`
    min-width: 0;
    flex: 1;
  `,mainTitle:m.css`
    margin: 0;
    font-size: ${e.typography.h3.fontSize};
    font-weight: ${e.typography.fontWeightBold};
    color: ${e.colors.text.primary};
    line-height: 1.2;
    word-break: break-word;
  `,mainTitleNarrow:m.css`
    margin: 0;
    font-size: 18px;
    font-weight: ${e.typography.fontWeightBold};
    color: ${e.colors.text.primary};
    line-height: 1.25;
    word-break: break-word;
  `,welcomeCard:m.css`
    padding: ${e.spacing(.5)} 0;
    margin-bottom: ${e.spacing(.5)};
    display: inline-flex;
    flex-direction: column;
    border-right: 2px solid ${e.colors.border.medium};
    padding-right: ${e.spacing(3)};
  `,welcomeText:m.css`
    color: ${e.colors.text.primary};
  `,greetingLine:m.css`
    line-height: 1.35;
    word-break: break-word;
  `,welcomeTitle:m.css`
    font-size: clamp(20px, 1.4vw, 26px);
    font-weight: ${e.typography.fontWeightBold};
    color: ${e.colors.text.primary};
  `,authorityTag:m.css`
    font-size: clamp(20px, 1.4vw, 26px);
    font-weight: ${e.typography.fontWeightMedium};
    color: ${e.colors.text.primary};
  `,bzkLine:m.css`
    margin-top: 6px;
    font-size: clamp(15px, 1vw, 18px);
    line-height: 1.4;
    color: ${e.colors.text.primary};
  `,bzkLabel:m.css`
    font-weight: ${e.typography.fontWeightBold};
    color: ${e.colors.text.primary};
  `,bzkValue:m.css`
    font-weight: ${e.typography.fontWeightRegular};
    color: ${e.colors.text.primary};
  `}),$=({wells:e,options:t,showOperatorColumn:a=!1,isNarrow:r=!1})=>{var n,o;const i=(0,u.useStyles2)(v);if(0===e.length)return p().createElement("div",{className:i.emptyState},"Keine Messstellen oder Anlagen für diesen Betreiber gefunden.");const l=null!==(n=t.readingDecimals)&&void 0!==n?n:0,s=null!==(o=t.consumptionDecimals)&&void 0!==o?o:0,d=t.numberFormat||"de-grouped",c=t.wellLinks.openInNewTab;return r?p().createElement("div",{className:i.cardList},e.map(e=>{const r=e.isOnline?`Online: Letzte Datenübertragung am ${e.lastSeenFormatted||"vor kurzem"}`:`Offline: Keine Datenübertragung seit mehr als ${t.freshnessHoursThreshold||24} Stunden! (${e.lastSeenFormatted||"unbekannt"})`;return p().createElement("div",{key:e.id,className:i.mobileCard},p().createElement("div",{className:i.mobileRowTop},p().createElement("a",{href:e.targetUrl,target:c?"_blank":"_self",rel:c?"noopener noreferrer":void 0,className:i.wellLink,title:"Zum Detail-Dashboard"},p().createElement(u.Icon,{name:"link",size:"sm",className:i.linkIcon}),p().createElement("span",{className:i.wellTitle},e.name)),p().createElement(u.Tooltip,{content:r,placement:"top"},p().createElement("span",{className:e.isOnline?i.dotContainerOnline:i.dotContainerOffline},p().createElement("span",{className:e.isOnline?i.dotOnline:i.dotOffline})))),p().createElement("div",{className:i.mobileRowMiddle},p().createElement("div",{className:i.mobileMeterGroup},p().createElement("span",{className:i.mobileLabel},"Zählerstand:"),p().createElement("span",{className:i.mobileValBold},g(e.meterReading,d,l,t.meterReadingUnit||"m³"))),a&&e.operator&&p().createElement("span",{className:i.mobileOperatorTag,title:"Betreiber"},e.operator)),p().createElement("div",{className:i.mobileRowBottom},p().createElement("span",null,"12h: ",p().createElement("strong",null,g(e.consumption12h,d,s,t.consumption12hUnit||"m³"))),p().createElement("span",{className:i.mobileBullet},"•"),p().createElement("span",null,"Jahr: ",p().createElement("strong",null,g(e.consumptionYear,d,s,t.consumptionYearUnit||"m³"))),e.lastSeenFormatted&&"-"!==e.lastSeenFormatted&&p().createElement(p().Fragment,null,p().createElement("span",{className:i.mobileBullet},"•"),p().createElement("span",{className:i.mobileTimestamp,title:"Letzter Datentransfer"},e.lastSeenFormatted))))})):p().createElement("div",{className:i.tableWrapper},p().createElement("table",{className:i.table},p().createElement("thead",null,p().createElement("tr",null,p().createElement("th",{className:i.thWell},"Brunnen"),a&&p().createElement("th",{className:i.thOperator},"Betreiber"),p().createElement("th",{className:i.thNumber},"Letzter Zählerstand"),p().createElement("th",{className:i.thNumber},"Wasserentnahmen letzte 12 Std."),p().createElement("th",{className:i.thNumber},"Entnahme im laufenden Kalenderjahr"),p().createElement("th",{className:i.thStatus},"Funkstatus"))),p().createElement("tbody",null,e.map(e=>{const r=e.isOnline?`Online: Letzte Datenübertragung am ${e.lastSeenFormatted||"vor kurzem"}`:`Offline: Keine Datenübertragung seit mehr als ${t.freshnessHoursThreshold||24} Stunden! (Letzter Stand: ${e.lastSeenFormatted||"unbekannt"})`;return p().createElement("tr",{key:e.id,className:i.row},p().createElement("td",{className:i.tdWell},p().createElement("a",{href:e.targetUrl,target:c?"_blank":"_self",rel:c?"noopener noreferrer":void 0,className:i.wellLink,title:"Zum Detail-Dashboard"},p().createElement(u.Icon,{name:"link",size:"sm",className:i.linkIcon}),p().createElement("span",{className:i.wellTitle},e.name))),a&&p().createElement("td",{className:i.tdOperator},e.operator),p().createElement("td",{className:i.tdNumber},g(e.meterReading,d,l,t.meterReadingUnit||"m³")),p().createElement("td",{className:i.tdNumber},g(e.consumption12h,d,s,t.consumption12hUnit||"m³")),p().createElement("td",{className:i.tdNumber},g(e.consumptionYear,d,s,t.consumptionYearUnit||"m³")),p().createElement("td",{className:i.tdStatus},p().createElement(u.Tooltip,{content:r,placement:"top"},p().createElement("span",{className:e.isOnline?i.dotContainerOnline:i.dotContainerOffline},p().createElement("span",{className:e.isOnline?i.dotOnline:i.dotOffline})))))}))))},v=e=>({tableWrapper:m.css`
    width: 100%;
    overflow-x: auto;
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    background: ${e.colors.background.primary};
    scrollbar-gutter: stable;
    scrollbar-width: thin;
    scrollbar-color: ${e.colors.border.strong} ${e.colors.background.secondary};
    &::-webkit-scrollbar {
      height: 8px;
    }
    &::-webkit-scrollbar-track {
      background: ${e.colors.background.secondary};
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${e.colors.border.strong};
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${e.colors.text.secondary};
    }
  `,table:m.css`
    width: 100%;
    min-width: 680px;
    border-collapse: collapse;
    font-size: clamp(13px, 0.9vw, 15px);
    text-align: left;
  `,thWell:m.css`
    padding: ${e.spacing(.75)} ${e.spacing(1.25)};
    background: ${e.colors.background.secondary};
    color: ${e.colors.text.secondary};
    font-size: clamp(12px, 0.85vw, 14px);
    font-weight: ${e.typography.fontWeightBold};
    border-bottom: 2px solid ${e.colors.border.medium};
    min-width: 220px;
  `,thOperator:m.css`
    padding: ${e.spacing(.75)} ${e.spacing(1.25)};
    background: ${e.colors.background.secondary};
    color: ${e.colors.text.secondary};
    font-size: clamp(12px, 0.85vw, 14px);
    font-weight: ${e.typography.fontWeightBold};
    border-bottom: 2px solid ${e.colors.border.medium};
    min-width: 140px;
  `,thNumber:m.css`
    padding: ${e.spacing(.75)} ${e.spacing(1.25)};
    background: ${e.colors.background.secondary};
    color: ${e.colors.text.secondary};
    font-size: clamp(12px, 0.85vw, 14px);
    font-weight: ${e.typography.fontWeightBold};
    border-bottom: 2px solid ${e.colors.border.medium};
    text-align: right;
    white-space: nowrap;
    min-width: 140px;
  `,thStatus:m.css`
    padding: ${e.spacing(.75)} ${e.spacing(1.25)};
    background: ${e.colors.background.secondary};
    color: ${e.colors.text.secondary};
    font-size: clamp(12px, 0.85vw, 14px);
    font-weight: ${e.typography.fontWeightBold};
    border-bottom: 2px solid ${e.colors.border.medium};
    text-align: center;
    width: 100px;
  `,row:m.css`
    border-bottom: 1px solid ${e.colors.border.weak};
    transition: background 0.15s ease-in-out;
    &:hover {
      background: ${e.colors.action.hover};
    }
  `,tdWell:m.css`
    padding: ${e.spacing(.75)} ${e.spacing(1.25)};
    font-size: clamp(13px, 0.9vw, 15px);
    font-weight: ${e.typography.fontWeightMedium};
  `,tdOperator:m.css`
    padding: ${e.spacing(.75)} ${e.spacing(1.25)};
    font-size: clamp(13px, 0.85vw, 15px);
    color: ${e.colors.text.secondary};
  `,tdNumber:m.css`
    padding: ${e.spacing(.75)} ${e.spacing(1.25)};
    text-align: right;
    font-size: clamp(13px, 0.9vw, 15px);
    font-family: ${e.typography.fontFamilyMonospace};
    font-weight: ${e.typography.fontWeightMedium};
    color: ${e.colors.text.primary};
  `,tdStatus:m.css`
    padding: ${e.spacing(.75)} ${e.spacing(1.25)};
    text-align: center;
  `,wellLink:m.css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: clamp(13px, 0.9vw, 15px);
    color: ${e.colors.primary.text};
    text-decoration: none;
    cursor: pointer;
    line-height: 1.35;
    &:hover {
      text-decoration: underline;
    }
  `,linkIcon:m.css`
    color: ${e.colors.text.secondary};
    flex-shrink: 0;
  `,wellTitle:m.css`
    word-break: break-word;
  `,dotContainerOnline:m.css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${e.colors.success.transparent};
    cursor: help;
    transition: transform 0.15s ease-in-out;
    &:hover {
      transform: scale(1.2);
    }
  `,dotContainerOffline:m.css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${e.colors.error.transparent};
    cursor: help;
    transition: transform 0.15s ease-in-out;
    &:hover {
      transform: scale(1.2);
    }
  `,dotOnline:m.css`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${e.colors.success.text};
    box-shadow: 0 0 6px ${e.colors.success.text};
  `,dotOffline:m.css`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${e.colors.error.text};
    box-shadow: 0 0 6px ${e.colors.error.text};
  `,emptyState:m.css`
    padding: ${e.spacing(2)};
    text-align: center;
    color: ${e.colors.text.secondary};
    background: ${e.colors.background.secondary};
    border-radius: ${e.shape.radius.default};
    border: 1px dashed ${e.colors.border.medium};
  `,cardList:m.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(.75)};
    width: 100%;
    box-sizing: border-box;
  `,mobileCard:m.css`
    background: ${e.colors.background.primary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(.75)} ${e.spacing(1)};
    display: flex;
    flex-direction: column;
    gap: 3px;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    transition: background 0.15s ease-in-out, border-color 0.15s ease-in-out;
    &:hover {
      background: ${e.colors.action.hover};
      border-color: ${e.colors.border.medium};
    }
  `,mobileRowTop:m.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${e.spacing(1)};
  `,mobileRowMiddle:m.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${e.spacing(1)};
    margin-top: 1px;
  `,mobileMeterGroup:m.css`
    display: flex;
    align-items: baseline;
    gap: 6px;
  `,mobileLabel:m.css`
    font-size: 11px;
    color: ${e.colors.text.secondary};
  `,mobileValBold:m.css`
    font-size: 14px;
    font-weight: ${e.typography.fontWeightBold};
    font-family: ${e.typography.fontFamilyMonospace};
    color: ${e.colors.text.primary};
  `,mobileOperatorTag:m.css`
    font-size: 11px;
    color: ${e.colors.text.secondary};
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.pill};
    padding: 1px 6px;
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,mobileRowBottom:m.css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    font-size: 11px;
    color: ${e.colors.text.secondary};
    margin-top: 1px;
    strong {
      color: ${e.colors.text.primary};
      font-family: ${e.typography.fontFamilyMonospace};
      font-weight: ${e.typography.fontWeightMedium};
    }
  `,mobileBullet:m.css`
    color: ${e.colors.text.disabled};
    font-size: 9px;
  `,mobileTimestamp:m.css`
    color: ${e.colors.text.secondary};
    font-size: 11px;
  `});function N(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function E(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{},r=Object.keys(a);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(a).filter(function(e){return Object.getOwnPropertyDescriptor(a,e).enumerable}))),r.forEach(function(t){N(e,t,a[t])})}return e}function S(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,r)}return a}(Object(t)).forEach(function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}),e}const z=({groups:e,options:t,isNarrow:a=!1})=>{var r;const n=(0,u.useStyles2)(L),[o,i]=(0,c.useState)(""),l=null!==(r=t.defaultExpandedAccordions)&&void 0!==r&&r,[s,d]=(0,c.useState)(()=>{const t={};for(const a of e)t[a.operatorName]=l;return t}),m=e=>{d(t=>S(E({},t),{[e]:!t[e]}))},h=(0,c.useMemo)(()=>0!==e.length&&e.every(e=>!0===s[e.operatorName]),[e,s]),b=(0,c.useMemo)(()=>{if(!o.trim())return e;const t=o.toLowerCase();return e.map(e=>{const a=e.operatorName.toLowerCase().includes(t),r=e.wells.filter(e=>e.name.toLowerCase().includes(t)||e.id.toLowerCase().includes(t)||e.betreiberkennzahl&&e.betreiberkennzahl.toLowerCase().includes(t));return a?e:r.length>0?S(E({},e),{wells:r}):null}).filter(e=>null!==e)},[e,o]);return p().createElement("div",{className:n.container},p().createElement("div",{className:a?n.actionBarNarrow:n.actionBar},t.searchEnabled&&p().createElement("div",{className:a?n.searchWrapperNarrow:n.searchWrapper},p().createElement(u.Input,{value:o,onChange:e=>i(e.currentTarget.value),placeholder:"Betreiber, Station oder Kennziffer suchen...",prefix:p().createElement(u.Icon,{name:"search"})})),p().createElement("div",{className:a?n.buttonGroupNarrow:n.buttonGroup},p().createElement(u.Tooltip,{content:h?"Alle zuklappen":"Alle aufklappen",placement:"top"},p().createElement(u.Button,{size:"sm",variant:"secondary",onClick:()=>{const t=!h,a={};for(const r of e)a[r.operatorName]=t;d(a)},icon:h?"angle-double-up":"angle-double-down","aria-label":h?"Alle zuklappen":"Alle aufklappen",title:h?"Alle zuklappen":"Alle aufklappen"})))),0===b.length?p().createElement("div",{className:n.emptySearch},'Keine Messstellen oder Betreiber gefunden für "',o,'".'):p().createElement("div",{className:n.groupList},b.map(e=>{var r,o;const i=null!==(r=s[e.operatorName])&&void 0!==r?r:l,d=null!==(o=t.consumptionDecimals)&&void 0!==o?o:0,c=t.numberFormat||"de-grouped";return p().createElement("div",{key:e.operatorName,className:a?n.groupCardMobile:n.groupCard},a?p().createElement("div",{className:n.groupHeaderMobile,onClick:()=>m(e.operatorName),role:"button",tabIndex:0},p().createElement("div",{className:n.mobileHeaderRowTop},p().createElement("div",{className:n.mobileHeaderTitleGroup},p().createElement(u.Icon,{name:i?"angle-down":"angle-right",size:"md",className:n.chevronIcon}),p().createElement("span",{className:n.operatorTitleMobile},e.operatorName)),p().createElement("div",{className:n.statusSummaryMobile},p().createElement("span",{className:n.onlineBadge,title:"Online Stationen"},"🟢 ",e.onlineCount),p().createElement("span",{className:e.offlineCount>0?n.offlineBadge:n.offlineZeroBadge,title:"Offline Stationen"},"🔴 ",e.offlineCount))),p().createElement("div",{className:n.mobileHeaderRowBottom},p().createElement("div",{className:n.mobileBadgesGroup},p().createElement("span",{className:n.wellCountBadge},e.wells.length," ",1===e.wells.length?"Station":"Stationen"),e.betreiberkennzahl&&p().createElement("span",{className:n.bzkBadge},"ID: ",e.betreiberkennzahl)),p().createElement("div",{className:n.mobileMetricsGroup},p().createElement("span",{className:n.summaryMetricMobile},"12h: ",p().createElement("strong",null,g(e.totalConsumption12h,c,d,t.consumption12hUnit||"m³"))),p().createElement("span",{className:n.mobileBullet},"•"),p().createElement("span",{className:n.summaryMetricMobile},"Jahr: ",p().createElement("strong",null,g(e.totalConsumptionYear,c,d,t.consumptionYearUnit||"m³")))))):p().createElement("div",{className:n.groupHeader,onClick:()=>m(e.operatorName),role:"button",tabIndex:0},p().createElement("div",{className:n.groupHeaderLeft},p().createElement(u.Icon,{name:i?"angle-down":"angle-right",size:"md",className:n.chevronIcon}),p().createElement("span",{className:n.operatorTitle},e.operatorName),p().createElement("span",{className:n.wellCountBadge},e.wells.length," ",1===e.wells.length?"Station":"Stationen"),e.betreiberkennzahl&&p().createElement("span",{className:n.bzkBadge},"ID: ",e.betreiberkennzahl)),p().createElement("div",{className:n.groupHeaderRight},p().createElement("span",{className:n.summaryMetric},"12h: ",p().createElement("strong",null,g(e.totalConsumption12h,c,d,t.consumption12hUnit||"m³"))),p().createElement("span",{className:n.summaryMetric},"Jahr: ",p().createElement("strong",null,g(e.totalConsumptionYear,c,d,t.consumptionYearUnit||"m³"))),p().createElement("div",{className:n.statusSummary},p().createElement("span",{className:n.onlineBadge,title:"Online Stationen"},"🟢 ",e.onlineCount),p().createElement("span",{className:e.offlineCount>0?n.offlineBadge:n.offlineZeroBadge,title:"Offline Stationen"},"🔴 ",e.offlineCount)))),i&&p().createElement("div",{className:n.groupContent},p().createElement($,{wells:e.wells,options:t,showOperatorColumn:!1,isNarrow:a})))})))},L=e=>({container:m.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1.5)};
    margin-bottom: ${e.spacing(2)};
  `,actionBar:m.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: ${e.spacing(1)};
  `,actionBarNarrow:m.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1)};
    width: 100%;
  `,searchWrapper:m.css`
    flex: 1;
    min-width: 240px;
    max-width: 420px;
  `,searchWrapperNarrow:m.css`
    width: 100%;
  `,buttonGroup:m.css`
    display: flex;
    gap: ${e.spacing(1)};
  `,buttonGroupNarrow:m.css`
    display: flex;
    gap: ${e.spacing(1)};
    width: 100%;
  `,fullFlexButton:m.css`
    flex: 1;
  `,groupList:m.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1.25)};
  `,groupCard:m.css`
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    background: ${e.colors.background.secondary};
    overflow-x: auto;
    scrollbar-gutter: stable;
    scrollbar-width: thin;
    scrollbar-color: ${e.colors.border.strong} ${e.colors.background.secondary};
    &::-webkit-scrollbar {
      height: 8px;
    }
    &::-webkit-scrollbar-track {
      background: ${e.colors.background.secondary};
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${e.colors.border.strong};
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${e.colors.text.secondary};
    }
  `,groupCardMobile:m.css`
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    background: ${e.colors.background.secondary};
    overflow-x: hidden;
    width: 100%;
    box-sizing: border-box;
  `,groupHeader:m.css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: ${e.spacing(2)};
    padding: ${e.spacing(1.2)} ${e.spacing(1.5)};
    background: ${e.colors.background.secondary};
    cursor: pointer;
    user-select: none;
    transition: background 0.15s ease-in-out;
    white-space: nowrap;
    min-width: max-content;
    &:hover {
      background: ${e.colors.action.hover};
    }
  `,groupHeaderMobile:m.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(.75)};
    padding: ${e.spacing(1)} ${e.spacing(1.25)};
    background: ${e.colors.background.secondary};
    cursor: pointer;
    user-select: none;
    transition: background 0.15s ease-in-out;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    &:hover {
      background: ${e.colors.action.hover};
    }
  `,mobileHeaderRowTop:m.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: ${e.spacing(1)};
    box-sizing: border-box;
  `,mobileHeaderTitleGroup:m.css`
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    flex: 1;
    overflow: hidden;
  `,operatorTitleMobile:m.css`
    font-size: 15px;
    font-weight: ${e.typography.fontWeightBold};
    color: ${e.colors.text.primary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,statusSummaryMobile:m.css`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    flex-shrink: 0;
    white-space: nowrap;
  `,mobileHeaderRowBottom:m.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    row-gap: 4px;
    column-gap: 8px;
    font-size: 11px;
    color: ${e.colors.text.secondary};
    width: 100%;
    box-sizing: border-box;
  `,mobileBadgesGroup:m.css`
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  `,mobileMetricsGroup:m.css`
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: nowrap;
    white-space: nowrap;
  `,summaryMetricMobile:m.css`
    font-size: 11px;
    color: ${e.colors.text.secondary};
    white-space: nowrap;
    strong {
      color: ${e.colors.text.primary};
      font-family: ${e.typography.fontFamilyMonospace};
      font-weight: ${e.typography.fontWeightMedium};
    }
  `,mobileMetricDivider:m.css`
    color: ${e.colors.border.medium};
    margin: 0 2px;
    font-size: 10px;
  `,mobileBullet:m.css`
    color: ${e.colors.text.disabled};
    font-size: 9px;
  `,groupHeaderLeft:m.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
    flex-wrap: nowrap;
    min-width: 0;
    flex: 1;
    white-space: nowrap;
  `,chevronIcon:m.css`
    color: ${e.colors.text.secondary};
    flex-shrink: 0;
  `,operatorTitle:m.css`
    font-size: clamp(16px, 1.1vw, 20px);
    font-weight: ${e.typography.fontWeightBold};
    color: ${e.colors.text.primary};
    white-space: nowrap;
  `,wellCountBadge:m.css`
    font-size: clamp(11px, 0.75vw, 13px);
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    padding: 2px 7px;
    border-radius: ${e.shape.radius.pill};
    color: ${e.colors.text.secondary};
    white-space: nowrap;
  `,bzkBadge:m.css`
    font-size: clamp(11px, 0.75vw, 13px);
    font-family: ${e.typography.fontFamilyMonospace};
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    padding: 2px 5px;
    border-radius: 4px;
    color: ${e.colors.text.secondary};
    white-space: nowrap;
  `,groupHeaderRight:m.css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${e.spacing(2.5)};
    flex-wrap: nowrap !important;
    flex-shrink: 0;
    white-space: nowrap;
  `,summaryMetric:m.css`
    font-size: clamp(13px, 0.9vw, 16px);
    color: ${e.colors.text.secondary};
    white-space: nowrap;
    strong {
      color: ${e.colors.text.primary};
      font-family: ${e.typography.fontFamilyMonospace};
      font-size: clamp(13px, 0.9vw, 16px);
    }
  `,statusSummary:m.css`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: ${e.typography.bodySmall.fontSize};
    white-space: nowrap;
  `,onlineBadge:m.css`
    color: ${e.colors.success.text};
    font-weight: ${e.typography.fontWeightMedium};
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  `,offlineBadge:m.css`
    color: ${e.colors.error.text};
    font-weight: ${e.typography.fontWeightMedium};
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  `,offlineZeroBadge:m.css`
    color: ${e.colors.text.secondary};
    opacity: 0.6;
    font-weight: ${e.typography.fontWeightRegular};
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  `,groupContent:m.css`
    padding: ${e.spacing(1.25)};
    background: ${e.colors.background.primary};
    border-top: 1px solid ${e.colors.border.weak};
  `,emptySearch:m.css`
    padding: ${e.spacing(3)};
    text-align: center;
    color: ${e.colors.text.secondary};
    background: ${e.colors.background.secondary};
    border-radius: ${e.shape.radius.default};
  `}),D=({options:e,isAuthority:t,isNarrow:a=!1})=>{const r=(0,u.useStyles2)(O),n=e.quickLinks,o=t&&n.showGroundwaterLink,i=n.showWeatherLink;return o||i?p().createElement("div",{className:r.container},p().createElement("h3",{className:r.sectionHeading},"Weitere Messstellen & Messwerte"),p().createElement("div",{className:a?r.cardsGridNarrow:r.cardsGrid},o&&p().createElement("div",{className:r.card},p().createElement("div",{className:r.cardHeader},p().createElement("div",{className:r.cardTextWrapper},p().createElement("h4",{className:r.cardTitle},n.groundwaterTitle||"Zentrale Netz- & Pegelüberwachung"))),p().createElement("div",{className:r.linkList},p().createElement("a",{href:n.groundwaterUrl||"/d/grid-telemetry",className:r.primaryLink},p().createElement(u.Icon,{name:"arrow-right",size:"sm"}),p().createElement("span",null,n.groundwaterLinkLabel||"Zu den Netzmesswerten")))),i&&p().createElement("div",{className:r.card},p().createElement("div",{className:r.cardHeader},p().createElement("div",{className:r.cardTextWrapper},p().createElement("h4",{className:r.cardTitle},n.weatherTitle||"Meteorologische Referenzstation"))),p().createElement("div",{className:r.linkList},t&&n.weatherInternalUrl&&p().createElement("a",{href:n.weatherInternalUrl,className:r.primaryLink},p().createElement(u.Icon,{name:"database",size:"sm"}),p().createElement("span",null,n.weatherInternalLinkLabel||"Zu den meteorologischen Stationsdaten")),n.weatherExternalUrl&&p().createElement("a",{href:n.weatherExternalUrl,target:"_blank",rel:"noopener noreferrer",className:r.externalLink},p().createElement(u.Icon,{name:"external-link-alt",size:"sm"}),p().createElement("span",null,n.weatherExternalLinkLabel||"Nationaler Wetterdienst (DWD)")))))):null},O=e=>({container:m.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1.5)};
    margin-top: ${e.spacing(1)};
    padding-top: ${e.spacing(1.5)};
    border-top: 1px solid ${e.colors.border.weak};
  `,sectionHeading:m.css`
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 15px;
    font-weight: ${e.typography.fontWeightBold};
    color: ${e.colors.text.primary};
  `,cardsGrid:m.css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: ${e.spacing(1.5)};
  `,cardsGridNarrow:m.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1.5)};
    width: 100%;
  `,card:m.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(1.5)};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: ${e.spacing(1.25)};
    box-shadow: ${e.shadows.z1};
  `,cardHeader:m.css`
    display: flex;
    align-items: flex-start;
    gap: ${e.spacing(1.25)};
  `,cardTextWrapper:m.css`
    min-width: 0;
    flex: 1;
  `,cardIconWater:m.css`
    width: 36px;
    height: 36px;
    border-radius: 6px;
    background: ${e.colors.primary.transparent};
    color: ${e.colors.primary.text};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  `,cardIconWeather:m.css`
    width: 36px;
    height: 36px;
    border-radius: 6px;
    background: ${e.colors.warning.transparent};
    color: ${e.colors.warning.text};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  `,cardTitle:m.css`
    margin: 0 0 3px 0;
    font-size: 15px;
    font-weight: ${e.typography.fontWeightBold};
    color: ${e.colors.text.primary};
    line-height: 1.3;
  `,cardDescription:m.css`
    margin: 0;
    font-size: ${e.typography.bodySmall.fontSize};
    color: ${e.colors.text.secondary};
    line-height: 1.3;
  `,linkList:m.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(.75)};
    padding-top: ${e.spacing(1)};
    border-top: 1px solid ${e.colors.border.weak};
  `,primaryLink:m.css`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: ${e.typography.body.fontSize};
    font-weight: ${e.typography.fontWeightMedium};
    color: ${e.colors.primary.text};
    text-decoration: none;
    line-height: 1.3;
    &:hover {
      text-decoration: underline;
    }
  `,externalLink:m.css`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: ${e.typography.body.fontSize};
    color: ${e.colors.text.secondary};
    text-decoration: none;
    line-height: 1.3;
    &:hover {
      color: ${e.colors.primary.text};
      text-decoration: underline;
    }
  `});function C(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function M(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{},r=Object.keys(a);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(a).filter(function(e){return Object.getOwnPropertyDescriptor(a,e).enumerable}))),r.forEach(function(t){C(e,t,a[t])})}return e}function T(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,r)}return a}(Object(t)).forEach(function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}),e}const F=e=>({container:m.css`
    padding: ${e.spacing(2)};
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: auto;
    scrollbar-gutter: stable;
    scrollbar-width: thin;
    scrollbar-color: ${e.isDark?"rgba(255, 255, 255, 0.35)":"rgba(0, 0, 0, 0.35)"} ${e.isDark?"rgba(0, 0, 0, 0.25)":"rgba(0, 0, 0, 0.05)"};
    &::-webkit-scrollbar {
      width: 10px;
      height: 8px;
    }
    &::-webkit-scrollbar-track {
      background: ${e.isDark?"rgba(0, 0, 0, 0.25)":"rgba(0, 0, 0, 0.05)"};
      border-radius: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${e.isDark?"rgba(255, 255, 255, 0.35)":"rgba(0, 0, 0, 0.35)"};
      border-radius: 5px;
      border: 2px solid transparent;
      background-clip: padding-box;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${e.isDark?"rgba(255, 255, 255, 0.6)":"rgba(0, 0, 0, 0.6)"};
    }
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1.5)};
    font-family: ${e.typography.fontFamily};
    color: ${e.colors.text.primary};
  `,containerNarrow:m.css`
    padding: ${e.spacing(1)};
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-gutter: stable;
    scrollbar-width: thin;
    scrollbar-color: ${e.isDark?"rgba(255, 255, 255, 0.35)":"rgba(0, 0, 0, 0.35)"} ${e.isDark?"rgba(0, 0, 0, 0.25)":"rgba(0, 0, 0, 0.05)"};
    &::-webkit-scrollbar {
      width: 8px;
      height: 0px;
    }
    &::-webkit-scrollbar-track {
      background: ${e.isDark?"rgba(0, 0, 0, 0.25)":"rgba(0, 0, 0, 0.05)"};
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${e.isDark?"rgba(255, 255, 255, 0.35)":"rgba(0, 0, 0, 0.35)"};
      border-radius: 4px;
      border: 1px solid transparent;
      background-clip: padding-box;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${e.isDark?"rgba(255, 255, 255, 0.6)":"rgba(0, 0, 0, 0.6)"};
    }
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1)};
    font-family: ${e.typography.fontFamily};
    color: ${e.colors.text.primary};
  `,sampleDataBanner:m.css`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: ${e.spacing(.75)} ${e.spacing(1.5)};
    background: ${e.colors.info.transparent};
    border: 1px solid ${e.colors.info.border};
    border-radius: ${e.shape.radius.default};
    color: ${e.colors.info.text};
    font-size: ${e.typography.bodySmall.fontSize};
    font-weight: ${e.typography.fontWeightMedium};
  `,operatorWellSection:m.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1)};
  `,sectionHeader:m.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: ${e.spacing(.5)};
  `,sectionTitle:m.css`
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 15px;
    font-weight: ${e.typography.fontWeightBold};
    color: ${e.colors.text.primary};
  `,noDataCard:m.css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${e.spacing(4)};
    background: ${e.colors.background.secondary};
    border: 1px dashed ${e.colors.border.medium};
    border-radius: ${e.shape.radius.default};
    text-align: center;
    gap: ${e.spacing(1)};
  `,noDataIcon:m.css`
    color: ${e.colors.text.secondary};
  `,noDataTitle:m.css`
    font-size: ${e.typography.h5.fontSize};
    font-weight: ${e.typography.fontWeightBold};
    color: ${e.colors.text.primary};
  `,noDataDescription:m.css`
    font-size: ${e.typography.body.fontSize};
    color: ${e.colors.text.secondary};
    max-width: 520px;
    line-height: 1.4;
  `}),U=({value:e,onChange:t,context:a})=>{const r=(a.data||[]).flatMap(e=>e.fields.map(e=>e.name));let n=[];try{const e=(0,y.getTemplateSrv)().getVariables();e&&Array.isArray(e)&&(n=e.map(e=>`\${${e.name}}`))}catch(e){}const o=["${__user.name}","${__user.login}","${__user.email}","${__user.id}","${__dashboard.name}","${__dashboard.uid}"],i=[...Array.from(new Set(r.filter(Boolean))).map(e=>({label:`Column: ${e}`,value:e})),...Array.from(new Set([...n,...o])).map(e=>({label:`Variable: ${e}`,value:e})),...!e||r.includes(e)||n.includes(e)||o.includes(e)?[]:[{label:`Value / Variable: ${e}`,value:e}]];return p().createElement(u.Combobox,{isClearable:!0,createCustomValue:!0,customValueDescription:"Use as variable or custom value",options:i,value:e,onChange:e=>{var a;return t(null!==(a=null==e?void 0:e.value)&&void 0!==a?a:"")}})},I=new d.PanelPlugin(({options:e,data:t,width:a,height:r,replaceVariables:n})=>{var o,i;const l=(0,u.useStyles2)(F),s=a<720,d=(0,c.useMemo)(()=>n?T(M({},e),{header:T(M({},e.header),{headerTitle:n(e.header.headerTitle||""),userName:n(e.header.userName||""),authorityName:n(e.header.authorityName||""),betreiberkennzahl:n(e.header.betreiberkennzahl||"")}),quickLinks:T(M({},e.quickLinks),{groundwaterTitle:n(e.quickLinks.groundwaterTitle||""),groundwaterLinkLabel:n(e.quickLinks.groundwaterLinkLabel||""),groundwaterUrl:n(e.quickLinks.groundwaterUrl||""),weatherTitle:n(e.quickLinks.weatherTitle||""),weatherInternalLinkLabel:n(e.quickLinks.weatherInternalLinkLabel||""),weatherInternalUrl:n(e.quickLinks.weatherInternalUrl||""),weatherExternalLinkLabel:n(e.quickLinks.weatherExternalLinkLabel||""),weatherExternalUrl:n(e.quickLinks.weatherExternalUrl||"")}),wellLinks:T(M({},e.wellLinks),{wellUrlPattern:n(e.wellLinks.wellUrlPattern||""),targetDashboardUid:n(e.wellLinks.targetDashboardUid||"")})}):e,[e,n]),{extractedRows:m,detectedRole:g,detectedAuthority:h,detectedBetreiberkennzahl:b,detectedUserName:y}=(0,c.useMemo)(()=>{const e=f(t.series||[],d,n);return{extractedRows:e.rows,detectedRole:e.detectedRole,detectedAuthority:e.detectedAuthority,detectedBetreiberkennzahl:e.detectedBetreiberkennzahl,detectedUserName:e.detectedUserName}},[t.series,d,n]),k=null===(o=d.showSampleDataOnEmpty)||void 0===o||o,v=0===m.length&&k,N=v?w:m,E=(0,c.useMemo)(()=>function(e,t){const a=new Map,r=(null!=t?t:"Hauptbetreiber").split(",").map(e=>e.trim().toLowerCase()).filter(Boolean),n=e=>{if(!e)return!1;const t=e.toLowerCase();return r.some(e=>t.includes(e))};for(const t of e){const e=t.operator||"Allgemein";if(n(e))continue;let r=a.get(e);r||(r={operatorName:e,betreiberkennzahl:t.betreiberkennzahl,wells:[],totalConsumption12h:0,totalConsumptionYear:0,onlineCount:0,offlineCount:0},a.set(e,r)),r.wells.push(t),t.betreiberkennzahl&&!r.betreiberkennzahl&&(r.betreiberkennzahl=t.betreiberkennzahl),t.consumption12h&&(r.totalConsumption12h+=t.consumption12h),t.consumptionYear&&(r.totalConsumptionYear+=t.consumptionYear),t.isOnline?r.onlineCount+=1:r.offlineCount+=1}return Array.from(a.values()).sort((e,t)=>e.operatorName.localeCompare(t.operatorName,"de-DE"))}(N,e.excludedOperators),[N,e.excludedOperators]),S=(0,c.useMemo)(()=>"authority"===d.viewMode||"operator"!==d.viewMode&&("authority"===g||"admin"===g||"operator"!==g&&E.length>1),[d.viewMode,g,E.length]);return p().createElement("div",{className:s?l.containerNarrow:l.container,style:{width:"100%",maxWidth:`${a}px`,height:`${r}px`,maxHeight:`${r}px`,overflowY:"auto",overflowX:s?"hidden":"auto",boxSizing:"border-box"}},v&&p().createElement("div",{className:l.sampleDataBanner},p().createElement(u.Icon,{name:"info-circle",size:"sm"}),p().createElement("span",null,"Vorschau-Modus mit Demodaten für Versorgungsnetze. Sobald eine Datenabfrage konfiguriert ist, wird diese Ansicht automatisch ersetzt.")),p().createElement(x,{options:d,isAuthority:S,detectedRole:g,detectedAuthority:h,detectedBetreiberkennzahl:b||(null===(i=N.find(e=>Boolean(e.betreiberkennzahl)))||void 0===i?void 0:i.betreiberkennzahl),detectedUserName:y,operatorName:N.length>0?N[0].operator:void 0,isNarrow:s}),0===N.length?p().createElement("div",{className:l.noDataCard},p().createElement("div",{className:l.noDataIcon},p().createElement(u.Icon,{name:"info-circle",size:"xl"})),p().createElement("div",{className:l.noDataTitle},"Keine Telemetriedaten verfügbar"),p().createElement("div",{className:l.noDataDescription},'Fügen Sie eine Datenquellenabfrage hinzu und ordnen Sie die Spalten in den Panel-Einstellungen unter "Spaltenzuordnung (Queries)" zu.')):S?p().createElement(z,{groups:E,options:d,isNarrow:s}):p().createElement("div",{className:l.operatorWellSection},p().createElement("div",{className:l.sectionHeader},p().createElement("h3",{className:l.sectionTitle},p().createElement(u.Icon,{name:"database",size:"md"}),"Anlagenübersicht (",N.length," ",1===N.length?"Station":"Stationen",")")),p().createElement($,{wells:N,options:d,showOperatorColumn:!1,isNarrow:s})),p().createElement(D,{options:d,isAuthority:S,isNarrow:s}))}).setPanelOptions(e=>{e.addRadio({path:"viewMode",name:"View Mode",category:["View Mode & Roles"],description:"Automatic role detection or force a specific view mode.",defaultValue:"auto",settings:{options:[{label:"Auto (Automatic Detection)",value:"auto"},{label:"Authority View (Grouped by Operator)",value:"authority"},{label:"Operator View (Own Assets)",value:"operator"}]}}).addCustomEditor({id:"fieldMappings.wellNameField",path:"fieldMappings.wellNameField",name:"Station / Asset Name Column",category:["Column Mapping (Queries)"],description:'Column with the name or title of the station/asset (e.g. "title", "brunnenbezeichnung")',editor:U,defaultValue:""}).addCustomEditor({id:"fieldMappings.wellIdField",path:"fieldMappings.wellIdField",name:"Asset ID / Code Column",category:["Column Mapping (Queries)"],description:'Column containing the asset ID (e.g. "well_id", "objektkennzahl")',editor:U,defaultValue:""}).addCustomEditor({id:"fieldMappings.operatorField",path:"fieldMappings.operatorField",name:"Operator (Company / Organization)",category:["Column Mapping (Queries)"],description:'Column containing the operator name (e.g. "Betreiber")',editor:U,defaultValue:"Betreiber"}).addCustomEditor({id:"fieldMappings.meterReadingField",path:"fieldMappings.meterReadingField",name:"Current Meter Reading Column",category:["Column Mapping (Queries)"],description:"Column containing the latest meter reading value",editor:U,defaultValue:""}).addCustomEditor({id:"fieldMappings.consumption12hField",path:"fieldMappings.consumption12hField",name:"12h Consumption Column",category:["Column Mapping (Queries)"],description:"Column containing the consumption over the last 12 hours",editor:U,defaultValue:""}).addCustomEditor({id:"fieldMappings.consumptionYearField",path:"fieldMappings.consumptionYearField",name:"Annual Consumption Column",category:["Column Mapping (Queries)"],description:"Column containing cumulative calendar year consumption",editor:U,defaultValue:""}).addCustomEditor({id:"fieldMappings.lastSeenField",path:"fieldMappings.lastSeenField",name:"Telemetry Timestamp Column",category:["Column Mapping (Queries)"],description:"Timestamp of the last telemetry message for 24h freshness check",editor:U,defaultValue:""}).addCustomEditor({id:"fieldMappings.statusField",path:"fieldMappings.statusField",name:"Status Column (Optional Override)",category:["Column Mapping (Queries)"],description:"Optional: If status is already provided as 1/0, boolean, or online/offline",editor:U,defaultValue:""}).addCustomEditor({id:"fieldMappings.dashboardUidField",path:"fieldMappings.dashboardUidField",name:"Dashboard UID Column (Optional)",category:["Column Mapping (Queries)"],description:"Optional: Column containing individual Grafana dashboard UID per station",editor:U,defaultValue:""}).addCustomEditor({id:"fieldMappings.betreiberkennzahlField",path:"fieldMappings.betreiberkennzahlField",name:"Operator ID / Kennzahl Column (Optional)",category:["Column Mapping (Queries)"],description:'Optional: Column with operator numerical ID from the database (e.g. "betreiberkennzahl")',editor:U,defaultValue:""}).addCustomEditor({id:"fieldMappings.authorityNameField",path:"fieldMappings.authorityNameField",name:"Authority / Agency Column (Optional)",category:["Column Mapping (Queries)"],description:"Optional: Column with name of the supervisory authority or agency",editor:U,defaultValue:""}).addCustomEditor({id:"fieldMappings.userNameField",path:"fieldMappings.userNameField",name:"User Name Column (Optional)",category:["Column Mapping (Queries)"],description:'Optional: Column with user display name from query (e.g. "user_name")',editor:U,defaultValue:""}).addBooleanSwitch({path:"header.showHeader",name:"Show Header Banner",category:["Header & Greeting"],defaultValue:!0}).addTextInput({path:"header.headerTitle",name:"Project Title",category:["Header & Greeting"],description:'Top header title banner (e.g. "Pilotprojekt Funkzähler Bergtheimer Mulde")',defaultValue:"Smart Utility & Grid Operations"}).addTextInput({path:"header.userName",name:"User Name (Template / Fallback)",category:["Header & Greeting"],description:"Supports Grafana variables like ${__user.name} or ${__user.login}",defaultValue:"${__user.name}"}).addTextInput({path:"header.authorityName",name:"Authority / Agency Name (Fallback)",category:["Header & Greeting"],defaultValue:""}).addTextInput({path:"header.betreiberkennzahl",name:"Operator ID / Kennzahl (Fallback)",category:["Header & Greeting"],defaultValue:""}).addSelect({path:"numberFormat",name:"Number Format",category:["Formatting & Status"],defaultValue:"de-grouped",settings:{options:[{label:"German with Separators (22.123 m³ / 21,5 m³)",value:"de-grouped"},{label:"German without Separator (22123 m³ / 21,5 m³)",value:"de-plain"},{label:"English with Separators (22,123 m³ / 21.5 m³)",value:"en-grouped"},{label:"Standard (22123 m³ / 21.5 m³)",value:"en-plain"}]}}).addNumberInput({path:"readingDecimals",name:"Meter Reading Decimals",category:["Formatting & Status"],defaultValue:0}).addNumberInput({path:"consumptionDecimals",name:"Consumption Decimals",category:["Formatting & Status"],defaultValue:0}).addTextInput({path:"meterReadingUnit",name:"Meter Reading Unit",category:["Formatting & Status"],defaultValue:"m³"}).addTextInput({path:"consumption12hUnit",name:"12h Consumption Unit",category:["Formatting & Status"],defaultValue:"m³"}).addTextInput({path:"consumptionYearUnit",name:"Annual Consumption Unit",category:["Formatting & Status"],defaultValue:"m³"}).addNumberInput({path:"freshnessHoursThreshold",name:"Freshness Threshold in Hours (Green / Red Dot)",category:["Formatting & Status"],description:"Within this threshold = Green dot, older = Red dot",defaultValue:24}).addTextInput({path:"excludedOperators",name:"Excluded Operators",category:["Formatting & Status"],description:'Comma-separated list of operator names to hide from the panel (e.g. "Hauptbetreiber")',defaultValue:"Hauptbetreiber"}).addBooleanSwitch({path:"searchEnabled",name:"Enable Search Bar (Authority View)",category:["Formatting & Status"],defaultValue:!0}).addBooleanSwitch({path:"defaultExpandedAccordions",name:"Expand Operator Accordions by Default",category:["Formatting & Status"],description:"If disabled, all operator accordions start collapsed.",defaultValue:!1}).addBooleanSwitch({path:"showSampleDataOnEmpty",name:"Show Sample Data when Queries are Empty",category:["Formatting & Status"],description:"Displays demo rows when no data source is connected yet.",defaultValue:!0}).addTextInput({path:"wellLinks.wellUrlPattern",name:"Asset Link URL Pattern",category:["Asset Navigation & Links"],description:"Placeholders: ${wellId}, ${id_raw}, ${dashboardUid}, ${from}, ${to}",defaultValue:"/d/${dashboardUid}?var-GroupWells=$__all&from=${from}&to=${to}"}).addTextInput({path:"wellLinks.targetDashboardUid",name:"Target Dashboard UID (Fallback)",category:["Asset Navigation & Links"],description:"Fallback dashboard UID if not returned in query columns",defaultValue:""}).addTextInput({path:"wellLinks.defaultTimeFrom",name:"Default Time Range From",category:["Asset Navigation & Links"],defaultValue:"now-5d"}).addTextInput({path:"wellLinks.defaultTimeTo",name:"Default Time Range To",category:["Asset Navigation & Links"],defaultValue:"now"}).addBooleanSwitch({path:"wellLinks.openInNewTab",name:"Open Link in New Tab",category:["Asset Navigation & Links"],defaultValue:!1}).addBooleanSwitch({path:"quickLinks.showGroundwaterLink",name:"Show Central Network Monitoring Link (Authority)",category:["Additional Stations & Weather"],defaultValue:!0}).addTextInput({path:"quickLinks.groundwaterTitle",name:"Network Monitoring Title",category:["Additional Stations & Weather"],defaultValue:"Zentrale Netz- & Pegelüberwachung"}).addTextInput({path:"quickLinks.groundwaterLinkLabel",name:"Network Monitoring Link Text",category:["Additional Stations & Weather"],defaultValue:"Zu den Netzmesswerten"}).addTextInput({path:"quickLinks.groundwaterUrl",name:"Network Monitoring URL",category:["Additional Stations & Weather"],defaultValue:"/d/grid-telemetry"}).addBooleanSwitch({path:"quickLinks.showWeatherLink",name:"Show Weather Station Link",category:["Additional Stations & Weather"],defaultValue:!0}).addTextInput({path:"quickLinks.weatherTitle",name:"Weather Station Title",category:["Additional Stations & Weather"],defaultValue:"Meteorologische Referenzstation"}).addTextInput({path:"quickLinks.weatherInternalLinkLabel",name:"Telemetry Data Link Text (Authority)",category:["Additional Stations & Weather"],defaultValue:"Zu den meteorologischen Stationsdaten"}).addTextInput({path:"quickLinks.weatherInternalUrl",name:"Telemetry Data URL",category:["Additional Stations & Weather"],defaultValue:"/d/weather-telemetry"}).addTextInput({path:"quickLinks.weatherExternalLinkLabel",name:"External Weather Service Link Text (All)",category:["Additional Stations & Weather"],defaultValue:"Nationaler Wetterdienst (DWD)"}).addTextInput({path:"quickLinks.weatherExternalUrl",name:"External Weather Service URL",category:["Additional Stations & Weather"],defaultValue:"https://www.dwd.de"})});return s})());
//# sourceMappingURL=module.js.map
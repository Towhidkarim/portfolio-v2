// Inline script for <head>, after the theme script. Marks the page as JS-enabled
// (`html.js`, which switches on the hidden states in reveal.css) and runs one
// shared IntersectionObserver that sets `data-in` the first time an element
// scrolls into view. Without IntersectionObserver everything stays visible
// (`html.no-io`).
export const revealInit = `(function(){var d=document.documentElement;d.classList.add('js');
if(!('IntersectionObserver' in window)){d.classList.add('no-io');return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.setAttribute('data-in','');io.unobserve(e.target)}})},{rootMargin:'0px 0px -12% 0px',threshold:0.01});
function scan(){document.querySelectorAll('[data-reveal]:not([data-in])').forEach(function(el){io.observe(el)})}
window.__revealScan=scan;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan);else scan()})();`;

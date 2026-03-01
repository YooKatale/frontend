export const V4_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--g:#1a5c1a;--gl:#2d8c2d;--gp:#e6f0e6;--gold:#f0c020;--dark:#0e180e;--mid:#445444;--muted:#8a9e87;--surf:#fff;--bg:#edf0ea;--r:20px;--rs:14px;--sh:0 2px 18px rgba(0,0,0,.08);--sh2:0 10px 40px rgba(0,0,0,.16);}
.yookatale-v4-page{font-family:'Sora',sans-serif;background:var(--bg);color:var(--dark);min-height:100vh;}
.yookatale-v4-page .page{width:100%;max-width:1440px;margin:0 auto;}
.yookatale-v4-page .page-max{width:100%;max-width:90%;margin-left:auto;margin-right:auto;}
@media(max-width:1023px){.yookatale-v4-page .page-max{max-width:100%;}}
.yookatale-v4-page .prod-grid{display:grid;gap:12px;grid-template-columns:repeat(2,1fr);padding-bottom:8px;}
@media(min-width:480px){.yookatale-v4-page .prod-grid{grid-template-columns:repeat(3,1fr);}}
@media(min-width:768px){.yookatale-v4-page .prod-grid{grid-template-columns:repeat(4,1fr);}}
@media(min-width:1024px){.yookatale-v4-page .prod-grid{grid-template-columns:repeat(5,1fr);gap:14px;}}
@media(min-width:1280px){.yookatale-v4-page .prod-grid{grid-template-columns:repeat(6,1fr);}}
.yookatale-v4-page .prod-grid .pcard{width:100%;}
.yookatale-v4-page .hero-grid{display:flex;flex-direction:column;gap:10px;padding:12px 12px 0;}
@media(min-width:700px){.yookatale-v4-page .hero-grid{flex-direction:row;align-items:stretch;padding:16px 16px 0;gap:12px;}}
@media(min-width:1024px){.yookatale-v4-page .hero-grid{padding:20px 24px 0;gap:14px;}}
.yookatale-v4-page .hero-main{border-radius:var(--r);overflow:hidden;position:relative;min-height:300px;display:flex;flex-direction:column;justify-content:flex-end;flex-shrink:0;width:100%;}
@media(min-width:700px){.yookatale-v4-page .hero-main{flex:0 0 68%;min-height:420px;width:auto;}}
@media(min-width:1024px){.yookatale-v4-page .hero-main{flex:0 0 70%;min-height:520px;}}
@media(min-width:1280px){.yookatale-v4-page .hero-main{min-height:560px;}}
.yookatale-v4-page .hero-bg-layer{position:absolute;inset:0;z-index:0;transition:background 1.1s ease;}
.yookatale-v4-page .hero-grain{position:absolute;inset:0;z-index:1;pointer-events:none;opacity:.55;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E");}
.yookatale-v4-page .hero-vignette{position:absolute;inset:0;z-index:2;pointer-events:none;background:radial-gradient(ellipse at 30% 50%, transparent 40%, rgba(0,0,0,.35) 100%);}
.yookatale-v4-page .hero-content-wrap{position:relative;z-index:4;padding:22px 20px 24px;}
@media(min-width:1024px){.yookatale-v4-page .hero-content-wrap{padding:36px 40px 40px;}}
@media(min-width:1280px){.yookatale-v4-page .hero-content-wrap{padding:44px 48px 48px;}}
.yookatale-v4-page .hero-pill{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.2);backdrop-filter:blur(8px);border-radius:100px;padding:4px 12px;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,.92);margin-bottom:10px;}
@media(min-width:1024px){.yookatale-v4-page .hero-pill{font-size:10px;padding:5px 14px;margin-bottom:12px;}}
.yookatale-v4-page .hero-title{font-family:'DM Serif Display',serif;font-size:clamp(24px,4.5vw,42px);line-height:1.05;color:#fff;margin-bottom:4px;}
@media(min-width:1024px){.yookatale-v4-page .hero-title{font-size:clamp(32px,3.5vw,52px);margin-bottom:6px;}}
@media(min-width:1280px){.yookatale-v4-page .hero-title{font-size:56px;}}
.yookatale-v4-page .hero-title i{display:block;}
.yookatale-v4-page .hero-desc{font-size:clamp(11px,1.4vw,13px);color:rgba(255,255,255,.75);line-height:1.65;margin-bottom:20px;max-width:400px;}
@media(min-width:1024px){.yookatale-v4-page .hero-desc{font-size:15px;max-width:480px;margin-bottom:24px;}}
@media(min-width:1280px){.yookatale-v4-page .hero-desc{font-size:16px;max-width:520px;margin-bottom:28px;}}
.yookatale-v4-page .hero-btns{display:flex;gap:10px;flex-wrap:wrap;}
@media(min-width:1024px){.yookatale-v4-page .hero-btns{gap:14px;}}
.yookatale-v4-page .btn-primary{display:inline-flex;align-items:center;gap:7px;background:var(--gold);color:#111;border:none;border-radius:100px;padding:10px 20px;font-size:13px;font-weight:800;cursor:pointer;font-family:'Sora',sans-serif;transition:transform .15s,box-shadow .2s;}
@media(min-width:1024px){.yookatale-v4-page .btn-primary{padding:14px 28px;font-size:15px;}}
@media(min-width:1280px){.yookatale-v4-page .btn-primary{padding:16px 32px;font-size:16px;}}
.yookatale-v4-page .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(240,192,32,.55);}
.yookatale-v4-page .btn-outline{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.28);border-radius:100px;padding:10px 18px;font-size:13px;font-weight:600;cursor:pointer;backdrop-filter:blur(6px);font-family:'Sora',sans-serif;}
@media(min-width:1024px){.yookatale-v4-page .btn-outline{padding:14px 24px;font-size:15px;}}
@media(min-width:1280px){.yookatale-v4-page .btn-outline{padding:16px 28px;font-size:16px;}}
.yookatale-v4-page .btn-outline:hover{background:rgba(255,255,255,.22);}
.yookatale-v4-page .hero-dots{display:flex;gap:5px;margin-top:18px;}
@media(min-width:1024px){.yookatale-v4-page .hero-dots{margin-top:24px;gap:6px;}.yookatale-v4-page .hero-dots .dot{width:6px;height:6px;}.yookatale-v4-page .hero-dots .dot.on{width:22px;}}
.yookatale-v4-page .dot{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.3);cursor:pointer;transition:all .35s;}
.yookatale-v4-page .dot.on{width:20px;border-radius:3px;background:var(--gold);}
.yookatale-v4-page .side-cards{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
@media(min-width:700px){.yookatale-v4-page .side-cards{display:flex;flex-direction:column;flex:0 0 32%;gap:12px;min-width:0;}}
@media(min-width:1024px){.yookatale-v4-page .side-cards{flex:0 0 30%;}}
.yookatale-v4-page .s-card{border-radius:var(--r);overflow:hidden;position:relative;min-height:120px;cursor:pointer;display:flex;flex-direction:column;justify-content:flex-end;transition:transform .2s,box-shadow .2s;}
@media(min-width:700px){.yookatale-v4-page .s-card{min-height:0;flex:1;min-height:1px;}}
.yookatale-v4-page .s-card:hover{transform:translateY(-3px) scale(1.01);box-shadow:var(--sh2);}
.yookatale-v4-page .s-card-wide{grid-column:1/-1;}
@media(min-width:700px){.yookatale-v4-page .s-card-wide{grid-column:unset;}}
.yookatale-v4-page .s-card-bg{position:absolute;inset:0;z-index:0;}
.yookatale-v4-page .s-card-grain{position:absolute;inset:0;z-index:1;opacity:.4;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");}
.yookatale-v4-page .s-card-shade{position:absolute;inset:0;z-index:2;background:linear-gradient(to top,rgba(0,0,0,.75) 0%,rgba(0,0,0,.1) 60%,transparent 100%);}
.yookatale-v4-page .s-card-body{position:relative;z-index:3;padding:14px;display:flex;flex-direction:column;justify-content:flex-end;height:100%;gap:4px;}
.yookatale-v4-page .s-card-eyebrow-row{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:2px;}
.yookatale-v4-page .s-card-eyebrow{font-size:clamp(8px,0.9vw,11px);font-weight:700;text-transform:uppercase;letter-spacing:1px;flex:1;}
.yookatale-v4-page .s-card-title{font-size:clamp(13px,1.4vw,17px);font-weight:700;color:#fff;line-height:1.25;margin-bottom:6px;}
.yookatale-v4-page .s-card-cta{display:inline-flex;align-items:center;gap:5px;font-size:clamp(10px,0.9vw,12px);font-weight:700;color:#fff;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.25);border-radius:100px;padding:4px 10px;backdrop-filter:blur(6px);}
.yookatale-v4-page .s-card-dot{width:28px;height:28px;border-radius:50%;flex-shrink:0;background:rgba(255,255,255,.12);border:1.5px solid rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;}
.yookatale-v4-page .section-wrap{padding:14px 12px 0;}
@media(min-width:700px){.yookatale-v4-page .section-wrap{padding:18px 16px 0;}}
@media(min-width:1024px){.yookatale-v4-page .section-wrap{padding:22px 24px 0;}}
.yookatale-v4-page .cuisine-card{background:var(--surf);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh);}
.yookatale-v4-page .cuisine-header{background:linear-gradient(135deg,#0e1e0e,#1a5c1a);padding:18px 20px 16px;position:relative;overflow:hidden;}
.yookatale-v4-page .cuisine-header-grain{position:absolute;inset:0;pointer-events:none;opacity:.4;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E");}
.yookatale-v4-page .cuisine-header-eyebrow{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,.6);display:flex;align-items:center;gap:5px;margin-bottom:4px;position:relative;z-index:2;}
.yookatale-v4-page .cuisine-header-title{font-family:'DM Serif Display',serif;font-size:22px;color:#fff;line-height:1.1;position:relative;z-index:2;}
.yookatale-v4-page .cuisine-header-sub{font-size:11px;color:rgba(255,255,255,.65);margin-top:3px;position:relative;z-index:2;}
.yookatale-v4-page .cuisine-header-globe{position:absolute;right:-10px;top:50%;transform:translateY(-50%);opacity:.08;pointer-events:none;}
.yookatale-v4-page .country-grid{display:grid;padding:14px 16px;gap:8px;grid-template-columns:repeat(5,1fr);}
@media(min-width:480px){.yookatale-v4-page .country-grid{grid-template-columns:repeat(7,1fr);}}
@media(min-width:700px){.yookatale-v4-page .country-grid{grid-template-columns:repeat(6,1fr);}}
@media(min-width:900px){.yookatale-v4-page .country-grid{grid-template-columns:repeat(8,1fr);}}
@media(min-width:1100px){.yookatale-v4-page .country-grid{grid-template-columns:repeat(10,1fr);gap:10px;}}
.yookatale-v4-page .c-btn{display:flex;flex-direction:column;align-items:center;gap:5px;border-radius:14px;padding:9px 4px 8px;border:1.5px solid transparent;background:#f4f7f1;cursor:pointer;transition:all .2s;position:relative;-webkit-tap-highlight-color:transparent;}
.yookatale-v4-page .c-btn:hover{background:#e0ecdf;border-color:#b4ccb4;transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,.1);}
.yookatale-v4-page .c-btn.dflt{background:var(--gp);border-color:var(--g);}
.yookatale-v4-page .c-flag-wrap{width:36px;height:24px;border-radius:5px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,.22);flex-shrink:0;background:#ccc;}
.yookatale-v4-page .c-flag-wrap img{width:100%;height:100%;object-fit:cover;display:block;}
.yookatale-v4-page .c-name{font-size:8.5px;font-weight:700;color:var(--mid);text-align:center;line-height:1.2;}
.yookatale-v4-page .c-btn.dflt .c-name{color:var(--g);}
.yookatale-v4-page .c-default-ring{position:absolute;inset:-1.5px;border-radius:15px;border:2px solid var(--g);pointer-events:none;opacity:.7;}
.yookatale-v4-page .c-default-label{position:absolute;top:-7px;left:50%;transform:translateX(-50%);background:var(--g);color:#fff;font-size:7px;font-weight:800;padding:1px 5px;border-radius:6px;text-transform:uppercase;white-space:nowrap;}
.yookatale-v4-page .cat-head-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.yookatale-v4-page .cat-head-title{font-family:'DM Serif Display',serif;font-size:20px;color:var(--dark);}
.yookatale-v4-page .btn-viewall{display:flex;align-items:center;gap:4px;font-size:11px;font-weight:700;color:var(--g);background:var(--gp);border:none;border-radius:100px;padding:6px 13px;cursor:pointer;font-family:'Sora',sans-serif;}
.yookatale-v4-page .btn-viewall:hover{background:#d4e8d4;}
.yookatale-v4-page .cat-grid{display:grid;gap:8px;grid-template-columns:repeat(3,1fr);}
@media(min-width:480px){.yookatale-v4-page .cat-grid{grid-template-columns:repeat(4,1fr);}}
@media(min-width:640px){.yookatale-v4-page .cat-grid{grid-template-columns:repeat(5,1fr);}}
@media(min-width:900px){.yookatale-v4-page .cat-grid{grid-template-columns:repeat(6,1fr);gap:10px;}}
@media(min-width:1100px){.yookatale-v4-page .cat-grid{grid-template-columns:repeat(7,1fr);}}
.yookatale-v4-page .cat-tile{border-radius:16px;overflow:hidden;aspect-ratio:1/1;position:relative;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.09);transition:transform .2s,box-shadow .2s;}
.yookatale-v4-page .cat-tile:hover{transform:scale(1.04);box-shadow:0 8px 24px rgba(0,0,0,.15);}
.yookatale-v4-page .cat-tile img{width:100%;height:100%;object-fit:cover;display:block;position:absolute;inset:0;}
.yookatale-v4-page .cat-shade{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.72) 0%,rgba(0,0,0,.05) 55%,transparent 100%);}
.yookatale-v4-page .cat-label{position:absolute;bottom:0;left:0;right:0;padding:5px 7px;font-size:9.5px;font-weight:700;color:#fff;text-align:center;line-height:1.2;text-shadow:0 1px 4px rgba(0,0,0,.5);}
.yookatale-v4-page .shimmer-tile{animation:shimmer 1.7s infinite;background:linear-gradient(90deg,#d4dcd4 25%,#c2cec2 50%,#d4dcd4 75%);background-size:300% 100%;}
@keyframes shimmer{from{background-position:300% 0}to{background-position:-300% 0}}
.yookatale-v4-page .budget-wrap{margin-bottom:20px;}
.yookatale-v4-page .budget-head-title{font-family:'DM Serif Display',serif;font-size:20px;color:var(--dark);margin-bottom:12px;}
.yookatale-v4-page .budget-pills{display:flex;flex-wrap:wrap;gap:10px;}
.yookatale-v4-page .budget-pill{font-family:'Sora',sans-serif;font-size:13px;font-weight:600;color:var(--mid);background:var(--surf);border:2px solid rgba(26,92,26,.2);border-radius:100px;padding:10px 20px;cursor:pointer;transition:background .2s,border-color .2s,color .2s;}
.yookatale-v4-page .budget-pill:hover{background:var(--gp);border-color:var(--g);color:var(--dark);}
.yookatale-v4-page .budget-pill.active{background:var(--g);border-color:var(--g);color:#fff;}
.yookatale-v4-page .m-overlay{position:fixed;inset:0;z-index:1100;background:rgba(0,0,0,.78);backdrop-filter:blur(10px);display:flex;align-items:flex-end;justify-content:center;animation:fadeBlur .22s ease;}
@media(min-width:600px){.yookatale-v4-page .m-overlay{align-items:center;padding:24px;}}
@keyframes fadeBlur{from{opacity:0}to{opacity:1}}
.yookatale-v4-page .m-sheet{background:#000;border-radius:24px 24px 0 0;width:100%;max-width:100%;overflow:hidden;animation:slideUp .32s cubic-bezier(.32,.72,0,1);position:relative;max-height:95vh;display:flex;flex-direction:column;}
@media(min-width:600px){.yookatale-v4-page .m-sheet{max-width:500px;border-radius:24px;animation:scaleIn .28s cubic-bezier(.34,1.4,.64,1);}}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
@keyframes scaleIn{from{transform:scale(.96);opacity:0}to{transform:scale(1);opacity:1}}
.yookatale-v4-page .m-banner{position:relative;width:100%;min-height:clamp(200px,50vmin,380px);aspect-ratio:16/10;flex-shrink:0;overflow:hidden;background:linear-gradient(135deg,#0e1e0e,#1a5c1a);}
@media(min-width:600px){.yookatale-v4-page .m-banner{aspect-ratio:16/10;min-height:280px;max-height:380px;}}
.yookatale-v4-page .m-banner-img{position:absolute;inset:0;z-index:0;width:100%;height:100%;object-fit:cover;display:block;}
.yookatale-v4-page .m-banner-shade{position:absolute;inset:0;z-index:1;background:linear-gradient(to bottom,rgba(0,0,0,.08) 0%,transparent 35%,transparent 45%,rgba(0,0,0,.82) 100%);}
.yookatale-v4-page .m-handle{position:absolute;top:10px;left:50%;transform:translateX(-50%);width:36px;height:4px;background:rgba(255,255,255,.35);border-radius:2px;z-index:10;}
@media(min-width:600px){.yookatale-v4-page .m-handle{display:none;}}
.yookatale-v4-page .m-banner-info{position:absolute;bottom:0;left:0;right:0;z-index:5;padding:16px 20px;display:flex;align-items:flex-end;gap:12px;}
.yookatale-v4-page .m-flag{width:46px;height:31px;border-radius:6px;object-fit:cover;flex-shrink:0;box-shadow:0 3px 12px rgba(0,0,0,.5);border:2px solid rgba(255,255,255,.2);}
.yookatale-v4-page .m-title-block{flex:1;min-width:0;}
.yookatale-v4-page .m-country-name{font-family:'DM Serif Display',serif;font-size:22px;color:#fff;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.yookatale-v4-page .m-specialty{font-size:11px;color:rgba(255,255,255,.78);font-weight:600;margin-top:2px;}
.yookatale-v4-page .m-close{position:absolute;top:14px;right:14px;z-index:10;width:32px;height:32px;border-radius:50%;border:none;background:rgba(0,0,0,.5);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;}
.yookatale-v4-page .m-close:hover{background:rgba(0,0,0,.75);}
.yookatale-v4-page .m-body{background:var(--surf);padding:12px 16px 16px;flex:1;overflow-y:auto;}
@media(max-width:599px){.yookatale-v4-page .m-body{padding-bottom:max(24px, env(safe-area-inset-bottom) + 80px);}}
.yookatale-v4-page .sub-btn{width:100%;border:none;cursor:pointer;padding:0;border-radius:14px;overflow:hidden;position:relative;box-shadow:0 8px 32px rgba(26,92,26,.38);transition:transform .16s,box-shadow .22s;font-family:'Sora',sans-serif;}
.yookatale-v4-page .sub-btn:hover{transform:translateY(-2px);box-shadow:0 14px 40px rgba(26,92,26,.48);}
.yookatale-v4-page .sub-btn-bg{background:linear-gradient(130deg,#0e2e0e 0%,#1a5c1a 45%,#2d8c2d 100%);padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;position:relative;overflow:hidden;}
.yookatale-v4-page .sub-btn-text{position:relative;z-index:2;text-align:left;}
.yookatale-v4-page .sub-btn-eyebrow{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,.6);margin-bottom:3px;}
.yookatale-v4-page .sub-btn-label{font-size:13px;font-weight:800;color:#fff;line-height:1.2;}
.yookatale-v4-page .sub-btn-ring{position:relative;z-index:2;flex-shrink:0;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.14);border:1.5px solid rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;}
.yookatale-v4-page .sub-btn:hover .sub-btn-ring{background:rgba(255,255,255,.25);transform:rotate(45deg);}
.yookatale-v4-page .pb{height:32px;}
.yookatale-v4-page .sec-wrap{padding:14px 12px 0;}@media(min-width:768px){.yookatale-v4-page .sec-wrap{padding:18px 20px 0;}}@media(min-width:1280px){.yookatale-v4-page .sec-wrap{padding:22px 24px 0;}}
.yookatale-v4-page .sec-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;gap:10px;}
.yookatale-v4-page .sec-head-left{display:flex;align-items:center;gap:10px;}
.yookatale-v4-page .sec-head-icon{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.yookatale-v4-page .sec-head-label{font-size:clamp(18px,2.2vw,24px);color:var(--dark);font-weight:400;line-height:1;font-family:'DM Serif Display',serif;}
.yookatale-v4-page .sec-head-right{display:flex;align-items:center;gap:10px;}
.yookatale-v4-page .sec-see-all{display:inline-flex;align-items:center;gap:3px;font-size:12px;font-weight:700;color:#e07820;background:#fff4ea;border-radius:100px;padding:5px 12px;cursor:pointer;text-decoration:none;white-space:nowrap;transition:background .18s;}
.yookatale-v4-page .sec-see-all:hover{background:#fde8d0;}
.yookatale-v4-page .sec-nav-btns{display:none;gap:6px;}@media(min-width:640px){.yookatale-v4-page .sec-nav-btns{display:flex;}}
.yookatale-v4-page .sec-nav-btn{width:32px;height:32px;border-radius:50%;background:var(--surf);border:1.5px solid rgba(0,0,0,.08);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--dark);transition:background .18s,transform .15s;box-shadow:var(--sh);}
.yookatale-v4-page .sec-nav-btn:hover:not(.disabled){background:var(--dark);color:#fff;border-color:var(--dark);transform:scale(1.06);}.yookatale-v4-page .sec-nav-btn.disabled{opacity:.35;cursor:default;}
.yookatale-v4-page .prod-row{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-ms-overflow-style:none;padding-bottom:4px;}
.yookatale-v4-page .prod-row::-webkit-scrollbar{display:none;}
@media(min-width:1024px){.yookatale-v4-page .prod-row{display:grid;grid-template-columns:repeat(6,1fr);overflow-x:visible;scroll-snap-type:none;}}
@media(min-width:768px) and (max-width:1023px){.yookatale-v4-page .prod-row{display:grid;grid-template-columns:repeat(4,1fr);overflow-x:visible;}}
.yookatale-v4-page .pcard{background:var(--surf);border-radius:16px;overflow:hidden;flex-shrink:0;width:148px;cursor:pointer;scroll-snap-align:start;transition:transform .2s,box-shadow .2s;box-shadow:var(--sh);border:1px solid rgba(0,0,0,.04);}
.yookatale-v4-page .pcard:hover{transform:translateY(-4px);box-shadow:var(--sh2);}
@media(min-width:480px){.yookatale-v4-page .pcard{width:168px;}}@media(min-width:768px){.yookatale-v4-page .pcard{width:auto;}}
.yookatale-v4-page .pcard-img{position:relative;aspect-ratio:4/3;overflow:hidden;background:#d0d8cc;}
.yookatale-v4-page .pcard-sweep{position:absolute;inset:0;background:linear-gradient(105deg, transparent 35%, rgba(255,255,255,.15) 50%, transparent 65%);background-size:300% 100%;animation:shimmer 3s infinite;pointer-events:none;}
.yookatale-v4-page .pcard-tag{position:absolute;top:8px;left:8px;font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;color:#fff;background:rgba(0,0,0,.45);backdrop-filter:blur(6px);border-radius:6px;padding:3px 7px;}
.yookatale-v4-page .pcard-discount{position:absolute;top:8px;right:8px;font-size:9px;font-weight:800;color:#fff;background:#e07820;border-radius:6px;padding:3px 7px;}
.yookatale-v4-page .pcard-wish{position:absolute;bottom:8px;right:8px;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.85);backdrop-filter:blur(6px);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted);transition:background .18s,color .18s,transform .15s;}
.yookatale-v4-page .pcard-wish:hover,.yookatale-v4-page .pcard-wish.wished{background:#fff;color:#e07820;transform:scale(1.1);}.yookatale-v4-page .pcard-wish.wished svg{fill:#e07820;stroke:#e07820;}
.yookatale-v4-page .pcard-body{padding:10px 10px 12px;}
.yookatale-v4-page .pcard-name{font-size:11.5px;font-weight:700;color:var(--dark);line-height:1.35;margin-bottom:5px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}@media(min-width:768px){.yookatale-v4-page .pcard-name{font-size:12.5px;}}
.yookatale-v4-page .pcard-meta{display:flex;align-items:center;gap:4px;margin-bottom:7px;}
.yookatale-v4-page .pcard-rating{font-size:10px;font-weight:700;color:var(--dark);}.yookatale-v4-page .pcard-sold{font-size:10px;color:var(--muted);font-weight:500;margin-left:2px;}
.yookatale-v4-page .pcard-price-row{display:flex;align-items:center;justify-content:space-between;gap:4px;}
.yookatale-v4-page .pcard-price{font-size:12px;font-weight:800;color:#e07820;display:block;line-height:1;}@media(min-width:768px){.yookatale-v4-page .pcard-price{font-size:13px;}}
.yookatale-v4-page .pcard-old{font-size:10px;color:var(--muted);text-decoration:line-through;font-weight:500;}
.yookatale-v4-page .pcard-add{width:28px;height:28px;border-radius:9px;background:var(--g);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;flex-shrink:0;transition:background .18s,transform .15s;}
.yookatale-v4-page .pcard-add:hover{background:var(--gl);transform:scale(1.08);}
.yookatale-v4-page .promo-banner{border-radius:var(--r);overflow:hidden;position:relative;min-height:90px;display:flex;align-items:center;cursor:pointer;transition:transform .2s;}@media(min-width:768px){.yookatale-v4-page .promo-banner{min-height:110px;}}
.yookatale-v4-page .promo-banner-grain{position:absolute;inset:0;pointer-events:none;z-index:1;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E");opacity:.5;}
.yookatale-v4-page .promo-banner-content{position:relative;z-index:3;padding:18px 20px;flex:1;}@media(min-width:768px){.yookatale-v4-page .promo-banner-content{padding:22px 28px;}}
.yookatale-v4-page .promo-banner-title{font-family:'DM Serif Display',serif;font-size:clamp(18px,2.8vw,30px);color:#fff;line-height:1.15;margin-bottom:6px;text-shadow:0 2px 12px rgba(0,0,0,.3);}
.yookatale-v4-page .promo-banner-sub{font-size:12px;color:rgba(255,255,255,.78);font-weight:500;margin-bottom:12px;}@media(min-width:768px){.yookatale-v4-page .promo-banner-sub{font-size:13px;}}
.yookatale-v4-page .promo-banner-cta{display:inline-flex;align-items:center;gap:6px;border:none;border-radius:100px;padding:9px 20px;font-size:12px;font-weight:800;cursor:pointer;font-family:'Sora',sans-serif;letter-spacing:.2px;transition:transform .15s,opacity .18s;box-shadow:0 4px 16px rgba(0,0,0,.25);}
.yookatale-v4-page .promo-banner-cta:hover{transform:translateY(-2px);opacity:.9;}
.yookatale-v4-page .promo-banner-deco{position:absolute;top:-30px;right:-30px;width:140px;height:140px;border-radius:50%;background:rgba(255,255,255,.07);z-index:2;pointer-events:none;}
.yookatale-v4-page .promo-banner-img{position:absolute;inset:0;z-index:0;}.yookatale-v4-page .promo-banner-img img{width:100%;height:100%;object-fit:cover;display:block;}
.yookatale-v4-page .pg-spacer{height:28px;}@media(min-width:768px){.yookatale-v4-page .pg-spacer{height:48px;}}
.yookatale-v4-page .sub-page{width:100%;max-width:90%;margin:0 auto;padding:0 14px;}
@media(max-width:1023px){.yookatale-v4-page .sub-page{max-width:100%;padding:0 12px;}}
.yookatale-v4-page .sub-banner{background:linear-gradient(135deg,#0e1e0e 0%,#1a5c1a 50%,#2d8c2d 100%);border-radius:var(--r);padding:20px 24px;margin-bottom:24px;position:relative;overflow:hidden;}
.yookatale-v4-page .sub-banner::before{content:'';position:absolute;inset:0;opacity:.06;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
.yookatale-v4-page .sub-banner-inner{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;position:relative;z-index:1;}
.yookatale-v4-page .sub-banner-title{font-family:'DM Serif Display',serif;font-size:clamp(20px,2.5vw,28px);color:#fff;margin-bottom:4px;}
.yookatale-v4-page .sub-banner-sub{font-size:13px;color:rgba(255,255,255,.8);}
.yookatale-v4-page .sub-banner-badge{font-size:24px;font-weight:800;color:var(--gold);}
.yookatale-v4-page .sub-sec-title{font-family:'DM Serif Display',serif;font-size:22px;color:var(--dark);margin-bottom:8px;}
.yookatale-v4-page .sub-sec-desc{font-size:14px;color:var(--mid);margin-bottom:20px;}
.yookatale-v4-page .sub-plan-grid{display:grid;gap:16px;grid-template-columns:1fr;}
@media(min-width:768px){.yookatale-v4-page .sub-plan-grid{grid-template-columns:repeat(2,1fr);}}
@media(min-width:1024px){.yookatale-v4-page .sub-plan-grid{grid-template-columns:repeat(3,1fr);}}
.yookatale-v4-page .sub-calendar-wrap{margin-top:24px;}
.yookatale-v4-page .sub-plan-pills{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px;justify-content:center;}
.yookatale-v4-page .sub-plan-pill{font-family:'Sora',sans-serif;font-size:13px;font-weight:600;padding:10px 20px;border-radius:100px;border:2px solid rgba(26,92,26,.25);background:var(--surf);color:var(--mid);cursor:pointer;transition:all .2s;}
.yookatale-v4-page .sub-plan-pill:hover,.yookatale-v4-page .sub-plan-pill.active{background:var(--g);border-color:var(--g);color:#fff;}
`;
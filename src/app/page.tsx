'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useCallback } from 'react';

const GOLD = '#D4AF37';
declare global { interface Window { gtag?: (...args: unknown[]) => void } }

export default function LandingPage() {
  const trackUTM = useCallback(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const utm = {
      source:   params.get('utm_source') || 'direct',
      medium:   params.get('utm_medium') || 'none',
      campaign: params.get('utm_campaign') || 'none',
    };
    sessionStorage.setItem('sal_utm', JSON.stringify(utm));
    window.gtag?.('event', 'page_view', {
      page_title: 'SaintSal Labs Landing',
      utm_source: utm.source,
      utm_campaign: utm.campaign,
    });
  }, []);

  useEffect(() => { trackUTM(); }, [trackUTM]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Public+Sans:wght@300;400;600;700;800;900&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        body{background:#080808;color:white;font-family:'Public Sans',sans-serif;overflow-x:hidden;}

        @keyframes livePulse{0%,100%{opacity:1;box-shadow:0 0 8px #00FF88}50%{opacity:0.4;box-shadow:0 0 3px #00FF88}}
        @keyframes tickerScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}

        .bebas{font-family:'Bebas Neue',sans-serif;}
        .gold{color:#D4AF37;}
        .gold-grad{
          background:linear-gradient(135deg,#D4AF37 0%,#F3D06D 50%,#8A7129 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
          filter:drop-shadow(0 0 28px rgba(212,175,55,0.35));
        }
        .btn-gold{
          background:linear-gradient(135deg,#D4AF37,#8A7129);color:#080808;border:none;
          padding:17px 38px;font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:2px;
          cursor:pointer;border-radius:3px;box-shadow:0 6px 28px rgba(212,175,55,0.3);
          transition:all 0.25s;display:inline-block;text-decoration:none;
        }
        .btn-gold:hover{transform:translateY(-3px);box-shadow:0 12px 48px rgba(212,175,55,0.5);}
        .btn-out{
          background:transparent;color:#D4AF37;border:1px solid rgba(212,175,55,0.4);
          padding:17px 38px;font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:2px;
          cursor:pointer;border-radius:3px;transition:all 0.25s;display:inline-block;text-decoration:none;
        }
        .btn-out:hover{border-color:#D4AF37;background:rgba(212,175,55,0.05);}

        /* TICKER */
        .ticker-wrap{background:rgba(212,175,55,0.04);border-top:1px solid rgba(212,175,55,0.1);border-bottom:1px solid rgba(212,175,55,0.1);padding:13px 0;overflow:hidden;}
        .ticker{display:flex;gap:48px;animation:tickerScroll 30s linear infinite;white-space:nowrap;}
        .ti{font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#D4AF37;opacity:0.65;}

        /* WHY CARDS */
        .ck-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(212,175,55,0.07);}
        @media(max-width:768px){.ck-grid{grid-template-columns:1fr;}}
        .ck-card{background:#0F0F0F;padding:44px 36px;transition:background 0.3s;}
        .ck-card:hover{background:#131313;}

        /* VALUE HERO BOX */
        .value-hero-box{
          background:linear-gradient(135deg,rgba(212,175,55,0.1),rgba(212,175,55,0.03));
          border:1px solid rgba(212,175,55,0.3);border-radius:16px;padding:48px;
          display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;margin-bottom:40px;
        }
        @media(max-width:900px){.value-hero-box{grid-template-columns:1fr;}}

        /* PLATFORM CARDS */
        .plat-grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
        @media(max-width:900px){.plat-grid-4{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:500px){.plat-grid-4{grid-template-columns:1fr;}}
        .plat-card{background:#0F0F0F;border:1px solid rgba(212,175,55,0.1);border-radius:12px;padding:28px 22px;position:relative;overflow:hidden;transition:all 0.3s;}
        .plat-card:hover{border-color:rgba(212,175,55,0.3);transform:translateY(-4px);}
        .plat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#8A7129,#D4AF37,#F3D06D);}

        /* VERTICALS */
        .v-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
        @media(max-width:900px){.v-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:500px){.v-grid{grid-template-columns:1fr;}}
        .v-card{background:linear-gradient(135deg,rgba(212,175,55,0.06),rgba(212,175,55,0.02));border:1px solid rgba(212,175,55,0.12);border-radius:14px;padding:32px 28px;transition:all 0.3s;}
        .v-card:hover{border-color:rgba(212,175,55,0.3);transform:translateY(-4px);}
        .v-chip{display:inline-block;background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.2);border-radius:999px;padding:3px 10px;font-size:10px;font-weight:700;color:#D4AF37;letter-spacing:1px;margin:3px 2px 0;}

        /* SNAPSHOTS */
        .snap-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:40px;}
        @media(max-width:900px){.snap-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:500px){.snap-grid{grid-template-columns:1fr;}}
        .snap-card{background:#0F0F0F;border:1px solid rgba(212,175,55,0.15);border-radius:14px;padding:28px 24px;display:flex;flex-direction:column;gap:12px;}

        /* PRICING */
        .pricing-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:40px;}
        @media(max-width:900px){.pricing-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:500px){.pricing-grid{grid-template-columns:1fr;}}
        .p-card{background:#0F0F0F;border:1px solid rgba(212,175,55,0.12);border-radius:14px;padding:32px 24px;display:flex;flex-direction:column;gap:12px;position:relative;transition:all 0.3s;}
        .p-card:hover{transform:translateY(-4px);}
        .p-card.hot{border-color:rgba(212,175,55,0.5);background:linear-gradient(135deg,rgba(212,175,55,0.08),#0F0F0F);}
        .p-feat{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:rgba(255,255,255,0.55);}

        /* NAV */
        nav{position:fixed;top:36px;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:14px 48px;background:rgba(8,8,8,0.9);backdrop-filter:blur(20px);border-bottom:1px solid rgba(212,175,55,0.12);transition:top 0.3s;}
        @media(max-width:768px){nav{padding:14px 20px;top:0;}}

        /* CTA LOGO FLOAT */
        .cta-logo{animation:float 4s ease-in-out infinite;}

        /* VH CHECK */
        .vh-check{width:22px;height:22px;background:linear-gradient(135deg,#D4AF37,#8A7129);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;color:#080808;font-weight:800;}
      `}</style>

      {/* HB Locals Banner */}
      <div style={{background:'linear-gradient(135deg,rgba(212,175,55,0.15),rgba(212,175,55,0.08))',borderBottom:'1px solid rgba(212,175,55,0.3)',padding:'10px 24px',display:'flex',alignItems:'center',justifyContent:'center',gap:16,flexWrap:'wrap'}}>
        <span style={{fontSize:13,fontWeight:700,color:'rgba(255,255,255,0.85)',letterSpacing:0.5}}>🏄 <strong style={{color:GOLD}}>HB Locals — Surf City Night Tonight!</strong> &nbsp;20% off first month with code</span>
        <span style={{background:'linear-gradient(135deg,#D4AF37,#8A7129)',color:'#080808',padding:'4px 12px',borderRadius:4,fontFamily:'Bebas Neue,sans-serif',fontSize:16,letterSpacing:3}}>HBLOCAL</span>
        <span style={{fontSize:13,fontWeight:700,color:'rgba(255,255,255,0.85)'}}>at <strong style={{color:GOLD}}>saintsallabs.com</strong> &nbsp;·&nbsp; 221 Main St Suite J</span>
      </div>

      {/* NAV */}
      <nav>
        <div style={{display:'flex',alignItems:'center',gap:13}}>
          {/* CLEAN LOGO — transparent PNG, no box border */}
          <Image src="/helmet.png" alt="SaintSal Labs" width={44} height={44}
            style={{objectFit:'contain',filter:'drop-shadow(0 0 12px rgba(212,175,55,0.5))'}} />
          <span className="bebas" style={{fontSize:24,letterSpacing:3,background:'linear-gradient(135deg,#D4AF37,#F3D06D,#8A7129)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>SaintSal™ Labs</span>
        </div>
        <ul style={{display:'flex',gap:32,listStyle:'none',margin:0}}>
          {[['Why','why'],['Verticals','verticals'],['Snapshots','snapshots'],['Partners','partners'],['Pricing','pricing']].map(([l,id])=>(
            <li key={id} style={{display:'none'}} className="nav-link-item">
              <button onClick={()=>scrollTo(id)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.45)',fontSize:12,fontWeight:700,letterSpacing:2,textTransform:'uppercase',cursor:'pointer',padding:0}}>
                {l}
              </button>
            </li>
          ))}
        </ul>
        <Link href="/login" className="btn-gold" style={{padding:'12px 26px',fontSize:16}}>Start Free →</Link>
      </nav>

      {/* HERO */}
      <section style={{minHeight:'100vh',display:'grid',gridTemplateColumns:'1fr 1fr',alignItems:'center',paddingTop:130,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 60% 80% at 0% 50%,rgba(212,175,55,0.09) 0%,transparent 60%),#080808'}} />
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(212,175,55,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.03) 1px,transparent 1px)',backgroundSize:'80px 80px'}} />

        <div style={{position:'relative',zIndex:5,padding:'80px 60px 80px 80px',display:'flex',flexDirection:'column',gap:26}}>
          {/* Live badge */}
          <div style={{display:'inline-flex',alignItems:'center',gap:7,background:'rgba(0,255,136,0.08)',border:'1px solid rgba(0,255,136,0.2)',padding:'6px 14px',borderRadius:999,width:'fit-content'}}>
            <div style={{width:6,height:6,background:'#00FF88',borderRadius:'50%',animation:'livePulse 1.5s infinite'}} />
            <span style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'#00FF88'}}>All 8 Providers Live · Patent #10,290,222</span>
          </div>

          <p style={{fontSize:11,fontWeight:700,letterSpacing:5,textTransform:'uppercase',color:'rgba(255,255,255,0.28)'}}>Responsible Intelligence™ · HACP™ Protocol</p>

          <h1 className="bebas" style={{fontSize:'clamp(68px,8vw,106px)',lineHeight:0.88,letterSpacing:1}}>
            <span style={{color:'white',display:'block'}}>YOUR GOTTA</span>
            <span style={{color:'white',display:'block'}}>GUY™ IS</span>
            <span className="gold-grad" style={{display:'block'}}>READY.</span>
          </h1>

          <p style={{fontSize:17,lineHeight:1.75,color:'rgba(255,255,255,0.52)',maxWidth:460}}>
            Stop juggling 12 tools. SAL Labs is everything — <strong style={{color:'white'}}>research, build, analyze, automate, invest, earn</strong> — one platform, one login, <em style={{color:GOLD,fontStyle:'italic'}}>one subscription that pays for itself.</em>
          </p>

          <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
            <Link href="/login" className="btn-gold">⚡ Start Free — No Card Needed</Link>
            <button className="btn-out" onClick={()=>scrollTo('snapshots')}>View GHL Snapshots →</button>
          </div>

          <div style={{display:'flex',gap:36,paddingTop:18,borderTop:'1px solid rgba(212,175,55,0.1)'}}>
            {[['9','AI Verticals'],['53','AI Models'],['88','Connectors'],['175+','Countries']].map(([n,l])=>(
              <div key={l} style={{display:'flex',flexDirection:'column',gap:3}}>
                <span className="bebas" style={{fontSize:36,color:GOLD,lineHeight:1,filter:'drop-shadow(0 0 10px rgba(212,175,55,0.3))'}}>
                  {n}
                </span>
                <span style={{fontSize:10,color:'rgba(255,255,255,0.32)',letterSpacing:2,textTransform:'uppercase'}}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero right — gradient + patent pill */}
        <div style={{position:'relative',height:'100vh',overflow:'hidden',background:'linear-gradient(135deg,rgba(212,175,55,0.05),rgba(0,0,0,0))',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Image src="/helmet.png" alt="SAL" width={480} height={480}
            style={{objectFit:'contain',filter:'drop-shadow(0 0 80px rgba(212,175,55,0.4)) drop-shadow(0 0 160px rgba(212,175,55,0.2))',opacity:0.9}} />
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,#080808 0%,transparent 45%),linear-gradient(to top,#080808 0%,transparent 35%)'}} />
          <div style={{position:'absolute',bottom:36,left:'50%',transform:'translateX(-50%)',background:'rgba(8,8,8,0.92)',backdropFilter:'blur(16px)',border:'1px solid rgba(212,175,55,0.3)',borderRadius:999,padding:'10px 22px',display:'flex',alignItems:'center',gap:10,whiteSpace:'nowrap'}}>
            <span style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:GOLD}}>⚡ US #10,290,222 · HACP™ · Recognized by Apple & Google</span>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker">
          {['⚡ Claude · GPT · Gemini · Grok','🏠 Real Estate Intelligence','📈 Finance & Markets','🏈 Sports Intelligence','🏥 Medical AI · HIPAA + BAA','⚖️ Legal & Compliance','🤖 AI Builder · Deploy Instantly','📱 Social Studio','🎯 GHL Smart Bridge','💸 CookinPartners™ 15% Forever','⚡ Claude · GPT · Gemini · Grok','🏠 Real Estate Intelligence','📈 Finance & Markets','🤖 AI Builder'].map((t,i)=>(
            <span key={i} className="ti">{t}</span>
          ))}
        </div>
      </div>

      {/* WHY WE WIN */}
      <div id="why" style={{background:'#080808'}}>
        <div style={{padding:'100px 80px',maxWidth:1400,margin:'0 auto'}}>
          <p style={{fontSize:11,fontWeight:700,letterSpacing:4,textTransform:'uppercase',color:GOLD,marginBottom:14}}>Why Switch To SaintSal™ Labs</p>
          <h2 className="bebas" style={{fontSize:'clamp(44px,5vw,68px)',lineHeight:0.95,marginBottom:56}}>
            STOP PAYING FOR<br/><span style={{color:GOLD}}>12 TOOLS. USE ONE.</span>
          </h2>
          <div className="ck-grid">
            {[
              {vs:'vs Perplexity',them:'Search only. No action.',us:'Search + Build + Deploy',desc:'SAL searches 5 sources simultaneously AND turns insights into built products, social content, and business plans — in one session.'},
              {vs:'vs ChatGPT / Claude standalone',them:'One model. No live data.',us:'Every Model. Live Data.',desc:'Claude + GPT + Gemini + Grok in parallel, with RentCast, Alpaca, Apollo, GHL, and your CRM all baked in.'},
              {vs:'vs 12 separate subscriptions',them:'$400+/mo. Fragmented.',us:'$97/mo. Everything.',desc:'Cancel Perplexity, Jasper, Copy.ai, Zapier, GHL AI, and 8 others. SAL Labs replaces them all and does it better.'},
            ].map((c)=>(
              <div key={c.vs} className="ck-card">
                <p style={{fontSize:10,fontWeight:700,letterSpacing:3,textTransform:'uppercase',color:'rgba(255,255,255,0.22)',marginBottom:14}}>{c.vs}</p>
                <p style={{fontSize:18,fontWeight:800,color:'rgba(255,255,255,0.32)',textDecoration:'line-through',textDecorationColor:'rgba(255,80,80,0.4)',marginBottom:8}}>{c.them}</p>
                <p className="bebas" style={{fontSize:30,letterSpacing:1,color:GOLD,marginBottom:14}}>{c.us}</p>
                <p style={{fontSize:13,lineHeight:1.7,color:'rgba(255,255,255,0.45)'}}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ONE PRICE, FULL EMPIRE */}
      <div style={{background:'linear-gradient(180deg,transparent,rgba(212,175,55,0.03),transparent)',borderTop:'1px solid rgba(212,175,55,0.07)',borderBottom:'1px solid rgba(212,175,55,0.07)',padding:'100px 80px'}}>
        <div style={{maxWidth:1400,margin:'0 auto'}}>
          <p style={{fontSize:11,fontWeight:700,letterSpacing:4,textTransform:'uppercase',color:GOLD,marginBottom:14}}>One Subscription. Full Empire.</p>
          <h2 className="bebas" style={{fontSize:'clamp(44px,5vw,68px)',lineHeight:0.95,marginBottom:40}}>
            $97/MO GETS YOU<br/><span style={{color:GOLD}}>EVERYTHING.</span>
          </h2>

          <div className="value-hero-box">
            <div style={{display:'flex',flexDirection:'column',gap:20}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:4,textTransform:'uppercase',color:GOLD,opacity:0.7}}>Why Pro Is The Only Move</span>
              <div className="bebas" style={{fontSize:52,lineHeight:0.92}}>
                GHL alone costs <span style={{color:GOLD}}>$97/mo.</span><br/>
                With SAL Pro you get<br/><span style={{color:GOLD}}>ALL of this.</span>
              </div>
              <p style={{fontSize:15,color:'rgba(255,255,255,0.5)',lineHeight:1.7}}>Every Pro subscriber gets full GHL CRM access, SaintSal™ AI, SaintSal™ Labs, AND FREE automated Pro workflows installed automatically. Same price. Full empire.</p>
              <Link href="/login" className="btn-gold" style={{width:'fit-content'}}>Get Pro — $97/mo →</Link>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {['SaintSal™ AI (saintsal.ai) — full access','SaintSal™ Labs (saintsallabs.com) — full access','GoHighLevel CRM — full Smart Bridge','FREE Pro Workflows — auto-installed in GHL','2,000 min AI compute per month','Image + Video + Voice generation','Premium GHL Snapshots access'].map((item,i)=>{
                const [bold,...rest] = item.split(' — ');
                return (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(212,175,55,0.1)',borderRadius:8}}>
                    <div className="vh-check">✓</div>
                    <div style={{fontSize:13,color:'rgba(255,255,255,0.65)'}}><strong style={{color:'white'}}>{bold}</strong>{rest.length ? ' — '+rest.join(' — ') : ''}</div>
                  </div>
                );
              })}
              <div style={{display:'flex',alignItems:'center',gap:12,padding:16,background:'rgba(212,175,55,0.08)',border:'1px solid rgba(212,175,55,0.25)',borderRadius:8}}>
                <span className="bebas" style={{fontSize:52,color:GOLD,lineHeight:1}}>$97</span>
                <div>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.35)'}}>per month total</div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,0.25)',textDecoration:'line-through'}}>vs $400+/mo for all separately</div>
                </div>
              </div>
            </div>
          </div>

          <div className="plat-grid-4">
            {[
              {icon:'🤖',name:'SaintSal™ AI',url:'saintsal.ai',desc:'Personal AI for everything. Chat, research & voice across 9 verticals with 4 AI models simultaneously.'},
              {icon:'⚡',name:'SaintSal™ Labs',url:'saintsallabs.com',desc:'Developer + business platform. Builder, GHL bridge, intelligence hub, snapshots — all in one.'},
              {icon:'📈',name:'CookinCapital™',url:'cookin.io',desc:'Fixed return investment fund. 9–12% annual returns. Accredited investors only.'},
              {icon:'💸',name:'CookinPartners™',url:'cookinpartners.com',desc:'Earn 15% recurring commission on every referral. Monthly. No cap. Forever.'},
            ].map(p=>(
              <div key={p.name} className="plat-card">
                <div style={{fontSize:28,marginBottom:14}}>{p.icon}</div>
                <div className="bebas" style={{fontSize:20,letterSpacing:1,color:'white',marginBottom:4}}>{p.name}</div>
                <div style={{fontSize:11,color:GOLD,letterSpacing:1,marginBottom:10,opacity:0.7}}>{p.url}</div>
                <div style={{fontSize:13,color:'rgba(255,255,255,0.45)',lineHeight:1.6}}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INTELLIGENCE VERTICALS */}
      <div id="verticals" style={{padding:'100px 80px'}}>
        <div style={{maxWidth:1400,margin:'0 auto'}}>
          <p style={{fontSize:11,fontWeight:700,letterSpacing:4,textTransform:'uppercase',color:GOLD,marginBottom:14}}>Intelligence Verticals</p>
          <h2 className="bebas" style={{fontSize:'clamp(44px,5vw,68px)',lineHeight:0.95,marginBottom:56}}>
            EVERY DOMAIN.<br/><span style={{color:GOLD}}>ONE PLATFORM.</span>
          </h2>
          <div className="v-grid">
            {[
              {icon:'🏠',name:'Real Estate',desc:'Foreclosures, BRRRR, deal analysis, live RentCast data, distressed pipeline, comps in seconds.',chips:['RentCast','PropertyAPI','Claude','Maps']},
              {icon:'📈',name:'Finance',desc:'Live Alpaca portfolio, DCF models, earnings synthesis, crypto intelligence, macro analysis.',chips:['Alpaca','Grok RT','Perplexity']},
              {icon:'🏈',name:'Sports',desc:'Live scores, fantasy advice, trade analysis, injury intel, team news across every league.',chips:['Grok','Tavily','ElevenLabs']},
              {icon:'🏥',name:'Medical',desc:'Clinical notes, ICD-10, research synthesis. HIPAA compliant via BAA with Anthropic.',chips:['Claude BAA','AssemblyAI','Exa']},
              {icon:'⚡',name:'Builder',desc:'Describe it. SAL builds it. Full apps, landing pages, dashboards — deployed instantly.',chips:['Claude Opus','DALL-E 3','Runway','GitHub']},
              {icon:'🤝',name:'GHL Bridge',desc:'SAL knows your contacts, pipelines, and deals. AI follow-ups, lead scoring, voice agents.',chips:['GHL API','Claude','Twilio','ElevenLabs']},
            ].map(v=>(
              <div key={v.name} className="v-card">
                <span style={{fontSize:36,marginBottom:18,display:'block'}}>{v.icon}</span>
                <div className="bebas" style={{fontSize:26,letterSpacing:1,marginBottom:10}}>{v.name}</div>
                <p style={{fontSize:13,lineHeight:1.7,color:'rgba(255,255,255,0.45)',marginBottom:14}}>{v.desc}</p>
                <div>{v.chips.map(c=><span key={c} className="v-chip">{c}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GHL SNAPSHOTS */}
      <div id="snapshots" style={{padding:'100px 80px',maxWidth:1400,margin:'0 auto'}}>
        <p style={{fontSize:11,fontWeight:700,letterSpacing:4,textTransform:'uppercase',color:GOLD,marginBottom:14}}>GHL Snapshot Systems</p>
        <h2 className="bebas" style={{fontSize:'clamp(44px,5vw,68px)',lineHeight:0.95,marginBottom:20}}>
          DONE-FOR-YOU.<br/><span style={{color:GOLD}}>DEPLOY IN MINUTES.</span>
        </h2>
        <p style={{color:'rgba(255,255,255,0.42)',fontSize:16,maxWidth:600,lineHeight:1.8,marginBottom:40}}>Complete GoHighLevel systems — 36+ workflows, voice agents, AI automations. Clone once, go live immediately.</p>
        <div className="snap-grid">
          {[
            {tag:'🏠 Lending',name:'Residential Lending Pro',desc:'Full residential mortgage pipeline with AI lead qualification and voice follow-up.',feats:['36+ automated workflows','Voice AI calling system','AI lead scoring','Compliance docs included'],price:'$797'},
            {tag:'🏢 Commercial',name:'Commercial Lending Pro',desc:'High-ticket commercial deal pipeline with underwriting automation and broker CRM.',feats:['Commercial deal tracking','Broker relationship CRM','Term sheet automation','SAL AI underwriting'],price:'$997'},
            {tag:'👔 Executive',name:'CEO Pro System',desc:'Full business command center — SAL runs operations and briefs you daily.',feats:['Daily AI executive briefings','Team & revenue tracking','Investor reporting','Strategic AI advisor'],price:'$1,297'},
            {tag:'🃏 Collectibles',name:'CookinCards™',desc:'Pokemon & sports card AI. PSA grading, live pricing, eBay deal engine, portfolio tracking.',feats:['Real-time card pricing','PSA grading tracker','eBay deal engine','Portfolio intelligence'],price:'$797'},
          ].map(s=>(
            <div key={s.name} className="snap-card">
              <span style={{fontSize:12,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:GOLD,opacity:0.7,background:'rgba(212,175,55,0.1)',borderRadius:999,padding:'4px 10px',width:'fit-content'}}>{s.tag}</span>
              <div className="bebas" style={{fontSize:22,letterSpacing:1}}>{s.name}</div>
              <p style={{fontSize:13,lineHeight:1.6,color:'rgba(255,255,255,0.45)'}}>{s.desc}</p>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {s.feats.map(f=><div key={f} style={{fontSize:12,color:'rgba(255,255,255,0.5)',display:'flex',gap:6}}><span style={{color:GOLD}}>✓</span>{f}</div>)}
              </div>
              <div style={{marginTop:'auto',display:'flex',alignItems:'baseline',gap:6}}>
                <span className="bebas" style={{fontSize:36,color:GOLD}}>{s.price}</span>
                <span style={{fontSize:12,color:'rgba(255,255,255,0.3)'}}>one-time</span>
              </div>
              <Link href="/login" style={{background:GOLD,color:'#080808',border:'none',padding:'12px 0',borderRadius:8,fontFamily:'Bebas Neue,sans-serif',fontSize:16,letterSpacing:2,textAlign:'center',cursor:'pointer',textDecoration:'none',display:'block'}}>Get This System →</Link>
            </div>
          ))}
        </div>
      </div>

      {/* COOKINPARTNERS AFFILIATE */}
      <div id="partners" style={{background:'linear-gradient(135deg,rgba(212,175,55,0.06),rgba(212,175,55,0.02))',borderTop:'1px solid rgba(212,175,55,0.1)',borderBottom:'1px solid rgba(212,175,55,0.1)',padding:'100px 80px'}}>
        <div style={{maxWidth:1400,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center'}}>
          <div>
            <p style={{fontSize:11,fontWeight:700,letterSpacing:4,textTransform:'uppercase',color:GOLD,marginBottom:14}}>CookinPartners™ Affiliate Program</p>
            <h2 className="bebas" style={{fontSize:'clamp(44px,5vw,68px)',lineHeight:0.95,marginBottom:24}}>
              EARN 15%<br/><span style={{color:GOLD}}>FOREVER.</span>
            </h2>
            <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:32}}>
              {['15% recurring commission on every referral','Paid monthly via Stripe — direct to you','Works for SaintSal™ AI + SaintSal™ Labs','No cap. No expiry. Monthly forever.'].map(f=>(
                <div key={f} style={{display:'flex',alignItems:'center',gap:10,fontSize:15,color:'rgba(255,255,255,0.65)'}}>
                  <span style={{color:GOLD,fontWeight:800}}>✓</span>{f}
                </div>
              ))}
            </div>
            <Link href="/login" className="btn-gold">Join CookinPartners™ →</Link>
          </div>
          <div style={{textAlign:'center'}}>
            <div className="bebas" style={{fontSize:120,color:GOLD,lineHeight:1,filter:'drop-shadow(0 0 40px rgba(212,175,55,0.3))'}}>15%</div>
            <div className="bebas" style={{fontSize:20,letterSpacing:4,color:'rgba(255,255,255,0.4)'}}>RECURRING · FOREVER</div>
            <p style={{fontSize:13,color:'rgba(255,255,255,0.35)',marginTop:12,lineHeight:1.7}}>Refer one Pro subscriber ($97/mo) and earn $14.55/mo — forever. Ten referrals = $145.50/mo passive.</p>
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div id="pricing" style={{padding:'100px 80px',background:'#080808'}}>
        <div style={{maxWidth:1400,margin:'0 auto'}}>
          <p style={{fontSize:11,fontWeight:700,letterSpacing:4,textTransform:'uppercase',color:GOLD,marginBottom:14}}>Pricing</p>
          <h2 className="bebas" style={{fontSize:'clamp(44px,5vw,68px)',lineHeight:0.95}}>
            START FREE.<br/><span style={{color:GOLD}}>SCALE WHEN READY.</span>
          </h2>
          <div className="pricing-grid">
            {[
              {name:'Free',price:'$0',period:'forever',feats:['100 min compute/mo','Basic chat all verticals','3 builder runs/day','Community support'],btn:'Start Free',link:'/login',hot:false},
              {name:'Starter',price:'$27',period:'per month',feats:['500 min compute/mo','GHL Basic Bridge','Save 5 builds','Standard snapshots','Email support'],btn:'Get Starter',link:'/login',hot:false},
              {name:'Pro',price:'$97',period:'per month · everything included',feats:['2,000 min compute/mo','Full GHL Bridge + FREE workflows','SaintSal™ AI + Labs access','Image + video + voice gen','Premium snapshots','Priority support'],btn:'Get Pro — Best Value',link:'/login',hot:true},
              {name:'Enterprise',price:'$497',period:'per month',feats:['Unlimited compute','White-glove onboarding','Custom snapshots','Dedicated SAL agent','Custom integrations'],btn:'Get Enterprise',link:'/login',hot:false},
            ].map(p=>(
              <div key={p.name} className={`p-card${p.hot?' hot':''}`}>
                {p.hot && <div style={{position:'absolute',top:-1,right:20,background:'linear-gradient(135deg,#D4AF37,#8A7129)',color:'#080808',fontSize:10,fontWeight:800,letterSpacing:2,padding:'4px 12px',borderRadius:'0 0 8px 8px'}}>MOST POPULAR</div>}
                <div className="bebas" style={{fontSize:28,letterSpacing:1}}>{p.name}</div>
                <div>
                  <span className="bebas" style={{fontSize:56,color:GOLD,lineHeight:1}}>{p.price}</span>
                  <span style={{fontSize:13,color:'rgba(255,255,255,0.35)',marginLeft:8}}>{p.period}</span>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:8,flex:1}}>
                  {p.feats.map(f=><div key={f} className="p-feat"><span style={{color:GOLD,flexShrink:0}}>✓</span>{f}</div>)}
                </div>
                <Link href={p.link} style={{
                  display:'block',textAlign:'center',padding:'14px 0',borderRadius:8,
                  fontFamily:'Bebas Neue,sans-serif',fontSize:16,letterSpacing:2,
                  textDecoration:'none',marginTop:8,
                  ...(p.hot
                    ? {background:'linear-gradient(135deg,#D4AF37,#8A7129)',color:'#080808'}
                    : {border:'1px solid rgba(212,175,55,0.3)',color:GOLD})
                }}>{p.btn}</Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div style={{position:'relative',overflow:'hidden',padding:'140px 80px',textAlign:'center',background:'radial-gradient(ellipse 80% 60% at 50% 50%,rgba(212,175,55,0.12) 0%,transparent 70%)'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(212,175,55,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.04) 1px,transparent 1px)',backgroundSize:'60px 60px'}} />
        <div style={{position:'relative',zIndex:5,display:'flex',flexDirection:'column',alignItems:'center',gap:28}}>
          <Image src="/helmet.png" alt="SAL" width={180} height={180} className="cta-logo"
            style={{objectFit:'contain',filter:'drop-shadow(0 0 50px rgba(212,175,55,0.55))'}} />
          <p style={{fontSize:11,fontWeight:700,letterSpacing:5,textTransform:'uppercase',color:'rgba(255,255,255,0.28)'}}>The AI That Actually Shows Up</p>
          <h2 className="bebas" style={{fontSize:'clamp(56px,8vw,106px)',lineHeight:0.88}}>
            <span style={{color:'white',display:'block'}}>YOUR GOTTA GUY™</span>
            <span className="gold-grad" style={{display:'block'}}>IS READY.</span>
          </h2>
          <p style={{fontSize:18,color:'rgba(255,255,255,0.5)',maxWidth:560,lineHeight:1.7}}>
            Join thousands building empires with SAL Labs. One login. Every tool. Patent-protected intelligence.
          </p>
          <div style={{display:'flex',gap:16,flexWrap:'wrap',justifyContent:'center'}}>
            <Link href="/login" className="btn-gold" style={{fontSize:22,padding:'20px 48px'}}>⚡ Start Free Today</Link>
            <Link href="/app-clip" className="btn-out" style={{fontSize:22,padding:'20px 48px'}}>📱 Get App Clip</Link>
          </div>
          <p style={{fontSize:12,color:'rgba(255,255,255,0.25)',letterSpacing:1}}>No credit card · Cancel anytime · US Patent #10,290,222</p>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{background:'#050505',borderTop:'1px solid rgba(212,175,55,0.08)',padding:'60px 80px 40px'}}>
        <div style={{maxWidth:1400,margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:40,marginBottom:60}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                <Image src="/helmet.png" alt="SAL" width={40} height={40} style={{objectFit:'contain',filter:'drop-shadow(0 0 8px rgba(212,175,55,0.4))'}} />
                <span className="bebas" style={{fontSize:20,letterSpacing:3,background:'linear-gradient(135deg,#D4AF37,#F3D06D)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>SaintSal™ Labs</span>
              </div>
              <p style={{fontSize:13,color:'rgba(255,255,255,0.3)',lineHeight:1.8,maxWidth:280}}>The AI that actually shows up. Powered by Patented HACP™ Technology. US Patent #10,290,222.</p>
            </div>
            <div>
              <p style={{fontSize:11,fontWeight:700,letterSpacing:3,textTransform:'uppercase',color:GOLD,marginBottom:20,opacity:0.7}}>Platform</p>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {['Intelligence','Builder','Social Studio','GHL Bridge','Pricing'].map(l=><a key={l} href="#" style={{fontSize:13,color:'rgba(255,255,255,0.35)',textDecoration:'none'}}>{l}</a>)}
              </div>
            </div>
            <div>
              <p style={{fontSize:11,fontWeight:700,letterSpacing:3,textTransform:'uppercase',color:GOLD,marginBottom:20,opacity:0.7}}>Company</p>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {['About','Blog','Careers','Patent','Contact'].map(l=><a key={l} href="#" style={{fontSize:13,color:'rgba(255,255,255,0.35)',textDecoration:'none'}}>{l}</a>)}
              </div>
            </div>
            <div>
              <p style={{fontSize:11,fontWeight:700,letterSpacing:3,textTransform:'uppercase',color:GOLD,marginBottom:20,opacity:0.7}}>Legal</p>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                <Link href="/privacy" style={{fontSize:13,color:'rgba(255,255,255,0.35)',textDecoration:'none'}}>Privacy Policy</Link>
                <Link href="/terms" style={{fontSize:13,color:'rgba(255,255,255,0.35)',textDecoration:'none'}}>Terms of Service</Link>
                <a href="mailto:legal@saintsallabs.com" style={{fontSize:13,color:'rgba(255,255,255,0.35)',textDecoration:'none'}}>HIPAA BAA</a>
                <a href="mailto:legal@saintsallabs.com" style={{fontSize:13,color:'rgba(255,255,255,0.35)',textDecoration:'none'}}>Contact Legal</a>
              </div>
            </div>
          </div>
          <div style={{borderTop:'1px solid rgba(212,175,55,0.06)',paddingTop:32,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
            <p style={{fontSize:12,color:'rgba(255,255,255,0.2)'}}>© 2026 Saint Vision Technologies LLC · All rights reserved · US Patent #10,290,222</p>
            <p style={{fontSize:12,color:'rgba(255,255,255,0.2)'}}>Responsible Intelligence™ · HACP™ Protocol · <span style={{color:'rgba(212,175,55,0.4)'}}>saintsallabs.com</span></p>
          </div>
        </div>
      </footer>
    </>
  );
}

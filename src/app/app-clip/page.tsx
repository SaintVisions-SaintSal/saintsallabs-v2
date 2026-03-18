'use client';
import Image from 'next/image';
import Link from 'next/link';

const GOLD = '#D4AF37';

export default function AppClipPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Public+Sans:wght@400;600;700;800;900&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        html,body{background:#080808;color:white;font-family:'Public Sans',sans-serif;overflow-x:hidden;}
        .bebas{font-family:'Bebas Neue',sans-serif;}
        @keyframes livePulse{0%,100%{opacity:1;box-shadow:0 0 6px #00FF88}50%{opacity:0.4;box-shadow:0 0 2px #00FF88}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .clip-logo{animation:float 3s ease-in-out infinite;}
        .live-dot{width:5px;height:5px;background:#00FF88;border-radius:50%;animation:livePulse 1.5s infinite;display:inline-block;}
        .primary-btn{transition:opacity 0.2s;}
        .primary-btn:active{opacity:0.85;}
        .primary-btn:hover{opacity:0.92;}
        .clip-path-btn:hover{background:rgba(212,175,55,0.08)!important;}
      `}</style>

      {/* Outer centering wrapper — no overflow:hidden, allows scroll */}
      <div style={{minHeight:'100vh',background:'#080808',display:'flex',flexDirection:'column',alignItems:'center'}}>

        {/* BG gradients — fixed so they don't affect layout */}
        <div style={{position:'fixed',inset:0,background:'radial-gradient(ellipse 80% 60% at 50% 0%,rgba(212,175,55,0.13) 0%,transparent 60%),radial-gradient(ellipse 60% 40% at 50% 100%,rgba(212,175,55,0.06) 0%,transparent 60%)',pointerEvents:'none',zIndex:0}} />
        <div style={{position:'fixed',inset:0,backgroundImage:'linear-gradient(rgba(212,175,55,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.03) 1px,transparent 1px)',backgroundSize:'32px 32px',pointerEvents:'none',zIndex:0}} />

        {/* Page content — scrollable, constrained to 390px (mobile card look) */}
        <div style={{position:'relative',zIndex:1,width:'100%',maxWidth:430,display:'flex',flexDirection:'column',flex:1}}>

          {/* ── App badge header ────────────────────────────── */}
          <div style={{padding:'20px 20px 0'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:14,padding:'10px 16px'}}>
              <Image src="/helmet.png" alt="SaintSal Labs" width={44} height={44}
                style={{objectFit:'contain',filter:'drop-shadow(0 0 8px rgba(212,175,55,0.5))',flexShrink:0}} />
              <div style={{display:'flex',flexDirection:'column',gap:1}}>
                <div style={{fontSize:15,fontWeight:700,color:'white'}}>SaintSal™ Labs</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.45)'}}>Responsible Intelligence™</div>
              </div>
              <a href="https://apps.apple.com/app/saintsallabs"
                style={{marginLeft:'auto',flexShrink:0,background:'linear-gradient(135deg,#D4AF37,#8A7129)',color:'#080808',padding:'7px 16px',borderRadius:20,fontSize:13,fontWeight:800,cursor:'pointer',letterSpacing:0.5,textDecoration:'none'}}>
                Open
              </a>
            </div>
          </div>

          {/* ── Hero ────────────────────────────────────────── */}
          <div style={{padding:'28px 20px 0',display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center'}}>
            <Image src="/helmet.png" alt="SAL" width={130} height={130} className="clip-logo"
              style={{objectFit:'contain',filter:'drop-shadow(0 0 40px rgba(212,175,55,0.55)) drop-shadow(0 8px 20px rgba(0,0,0,0.7))'}} />

            <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(0,255,136,0.08)',border:'1px solid rgba(0,255,136,0.2)',padding:'5px 12px',borderRadius:999,marginTop:16}}>
              <div className="live-dot" />
              <span style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'#00FF88'}}>All 8 AI Providers Live · Patent #10,290,222</span>
            </div>

            <h1 className="bebas" style={{fontSize:54,lineHeight:0.9,letterSpacing:1,marginTop:14}}>
              <span style={{color:'white',display:'block'}}>THE AI THAT</span>
              <span style={{display:'block',background:'linear-gradient(135deg,#D4AF37,#F3D06D,#8A7129)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',filter:'drop-shadow(0 0 16px rgba(212,175,55,0.4))'}}>ACTUALLY SHOWS UP</span>
            </h1>

            <p style={{fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.65,marginTop:10,padding:'0 4px'}}>
              <strong style={{color:'white'}}>Your Gotta Guy™.</strong> Claude + GPT + Gemini + Grok.<br/>
              Powered by Patented HACP™ Technology.
            </p>
          </div>

          {/* ── HB Locals Offer Strip ───────────────────────── */}
          <div style={{margin:'20px 20px 0',background:'linear-gradient(135deg,rgba(212,175,55,0.14),rgba(212,175,55,0.05))',border:'1px solid rgba(212,175,55,0.35)',borderRadius:14,padding:'16px 18px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
            <div>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:GOLD,opacity:0.75,marginBottom:4}}>🏄 HB Locals Special</div>
              <div className="bebas" style={{fontSize:24,letterSpacing:1,lineHeight:1}}>20% OFF <span style={{color:GOLD}}>FIRST MONTH</span></div>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginTop:4}}>Use at checkout · saintsallabs.com</div>
            </div>
            <div style={{background:'linear-gradient(135deg,#D4AF37,#8A7129)',color:'#080808',padding:'10px 14px',borderRadius:10,textAlign:'center',flexShrink:0}}>
              <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:20,letterSpacing:3,lineHeight:1}}>HBLOCAL</div>
              <div style={{fontSize:8,letterSpacing:1,fontWeight:700,opacity:0.65,marginTop:2}}>PROMO CODE</div>
            </div>
          </div>

          {/* ── Primary CTA ─────────────────────────────────── */}
          <div style={{padding:'16px 20px 0',display:'flex',flexDirection:'column',gap:10}}>
            <Link href="/login" className="primary-btn"
              style={{width:'100%',background:'linear-gradient(135deg,#D4AF37,#8A7129)',color:'#080808',padding:18,borderRadius:14,fontFamily:'Bebas Neue,sans-serif',fontSize:22,letterSpacing:2,cursor:'pointer',boxShadow:'0 8px 30px rgba(212,175,55,0.35)',textAlign:'center',textDecoration:'none',display:'block'}}>
              ⚡ START FREE — NO CARD NEEDED
            </Link>

            {/* 3 Quick Paths */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
              {[
                {icon:'🔍',name:'Intelligence',desc:'Search 5 AI engines at once',href:'/chat/search'},
                {icon:'💬',name:'Chat',desc:'Multi-model AI conversations',href:'/chat/search'},
                {icon:'⚡',name:'Builder',desc:'Build apps & sites with AI',href:'/builder'},
              ].map(p=>(
                <Link key={p.name} href={p.href}
                  style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(212,175,55,0.12)',borderRadius:12,padding:'14px 6px',textAlign:'center',cursor:'pointer',textDecoration:'none',display:'block'}}>
                  <div style={{fontSize:22,marginBottom:6}}>{p.icon}</div>
                  <div className="bebas" style={{fontSize:14,letterSpacing:1,color:GOLD,marginBottom:2}}>{p.name}</div>
                  <div style={{fontSize:9,color:'rgba(255,255,255,0.38)',lineHeight:1.4}}>{p.desc}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Trust Signals ───────────────────────────────── */}
          <div style={{margin:'16px 20px 0',background:'rgba(255,255,255,0.025)',border:'1px solid rgba(212,175,55,0.1)',borderRadius:12,padding:'14px 16px'}}>
            {[
              {icon:'🔒',txt:<>Your data is <strong style={{color:'rgba(212,175,55,0.7)'}}>encrypted &amp; private</strong> · HIPAA ready</>},
              {icon:'⚡',txt:<><strong style={{color:'rgba(212,175,55,0.7)'}}>US Patent #10,290,222</strong> · Recognized by Apple &amp; Google</>},
              {icon:'🏛️',txt:<>Saint Vision Technologies LLC · 221 Main St, Huntington Beach CA</>},
            ].map((t,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:i<2?6:0}}>
                <span style={{fontSize:14,flexShrink:0}}>{t.icon}</span>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.45)',lineHeight:1.4}}>{t.txt}</span>
              </div>
            ))}
          </div>

          {/* ── Platforms ───────────────────────────────────── */}
          <div style={{padding:'16px 20px 0',display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            {[
              {name:'SaintSal™ AI',url:'saintsal.ai',desc:'Personal AI across 9 verticals'},
              {name:'SaintSal™ Labs',url:'saintsallabs.com',desc:'Builder + GHL + Intelligence'},
            ].map(p=>(
              <div key={p.name} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(212,175,55,0.1)',borderRadius:10,padding:'12px 12px'}}>
                <div className="bebas" style={{fontSize:14,letterSpacing:1,color:GOLD}}>{p.name}</div>
                <div style={{fontSize:9,color:'rgba(255,255,255,0.3)',letterSpacing:1,margin:'2px 0 4px'}}>{p.url}</div>
                <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',lineHeight:1.4}}>{p.desc}</div>
              </div>
            ))}
          </div>

          {/* ── Stats strip ─────────────────────────────────── */}
          <div style={{margin:'16px 20px 0',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,textAlign:'center'}}>
            {[['9','Verticals'],['53','Models'],['88','Connectors'],['175+','Countries']].map(([n,l])=>(
              <div key={l} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(212,175,55,0.08)',borderRadius:10,padding:'10px 4px'}}>
                <div className="bebas" style={{fontSize:24,color:GOLD,lineHeight:1}}>{n}</div>
                <div style={{fontSize:9,color:'rgba(255,255,255,0.3)',letterSpacing:1,textTransform:'uppercase',marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>

          {/* ── Footer ──────────────────────────────────────── */}
          <div style={{padding:'24px 20px 40px',textAlign:'center',marginTop:'auto'}}>
            <div style={{display:'flex',justifyContent:'center',gap:20,marginBottom:10}}>
              <a href="/privacy" style={{fontSize:11,color:'rgba(255,255,255,0.3)',textDecoration:'none'}}>Privacy Policy</a>
              <a href="/terms" style={{fontSize:11,color:'rgba(255,255,255,0.3)',textDecoration:'none'}}>Terms of Use</a>
              <a href="https://apps.apple.com/app/saintsallabs" style={{fontSize:11,color:'rgba(255,255,255,0.3)',textDecoration:'none'}}>Full App</a>
            </div>
            <p style={{fontSize:10,color:'rgba(255,255,255,0.2)',letterSpacing:1,lineHeight:1.7}}>
              © 2026 <strong style={{color:'rgba(212,175,55,0.4)'}}>Saint Vision Technologies LLC</strong><br/>
              US Patent #10,290,222 · Responsible Intelligence™
            </p>
          </div>

        </div>
      </div>
    </>
  );
}

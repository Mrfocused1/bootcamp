# Generates Urban AI marketing pages with shared nav + footer.
SHARED_CSS = "../cdn.prod.website-files.com/683703490bc01e1b8c052e06/css/truus.webflow.shared.4287771df.css"
STRIPE = "STRIPE_PAYMENT_LINK_HERE"  # replace with your real Stripe Payment Link
APP_URL = "http://localhost:3000"  # learning app; change to https://app.urbanai.co in production

NAV_ITEMS = [
    ("syllabus.html","Syllabus"),
    ("pricing.html","Pricing"),
    ("success-stories.html","Success Stories"),
    ("faq.html","FAQ"),
    ("about.html","About"),
    ("contact.html","Contact"),
]

def head(title, desc):
    return f'''<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>{title}</title>
<meta name="description" content="{desc}"/>
<meta property="og:title" content="{title}"/>
<meta property="og:description" content="{desc}"/>
<link rel="stylesheet" href="{SHARED_CSS}"/>
<link rel="stylesheet" href="urbanai.css"/>
</head>'''

def nav(active):
    items=""
    for href,label in NAV_ITEMS:
        cls=' class="is-active"' if href==active else ''
        items+=f'<li><a href="{href}"{cls}>{label}</a></li>'
    return f'''<nav class="ua-nav"><div class="ua-wrap ua-nav__in">
<a class="ua-logo" href="index.html">Urban AI</a>
<ul class="ua-menu">{items}</ul>
<div class="ua-navcta">
<a class="ua-btn ua-btn--light" href="{APP_URL}/login">Log in</a>
<a class="ua-btn ua-btn--blue" href="{STRIPE}">Enrol</a>
</div></div></nav>'''

FOOTER = f'''<footer class="ua-foot"><div class="ua-wrap">
<div class="ua-foot__cols">
<div>
<span class="ua-foot__tag">ready to start?</span>
<div class="ua-foot__h">Learn to build websites<br/>with AI in 5 days.</div>
<a class="ua-btn ua-btn--lg" style="background:#fff;color:var(--ua-blue);margin-top:14px" href="{STRIPE}">Enrol now →</a>
</div>
<div>
<span class="ua-foot__tag">explore</span>
<ul class="ua-foot__links">
<li><a href="syllabus.html">Syllabus</a></li>
<li><a href="pricing.html">Pricing</a></li>
<li><a href="success-stories.html">Success Stories</a></li>
</ul>
</div>
<div>
<span class="ua-foot__tag">contact</span>
<ul class="ua-foot__links">
<li><a href="mailto:hello@urbanai.co">hello@urbanai.co</a></li>
<li><a href="faq.html">FAQ</a></li>
<li><a href="about.html">About</a></li>
<li><a href="https://www.instagram.com/" target="_blank" rel="noopener">Instagram</a></li>
<li><a href="https://www.tiktok.com/" target="_blank" rel="noopener">TikTok</a></li>
</ul>
</div>
</div>
<div class="ua-foot__big">Urban AI</div>
</div></footer>'''

def page(active, body):
    return head_cur + nav(active) + body + FOOTER + "</body></html>"

def media(label, mod=""):
    return f'<div class="ua-media {mod}"><!-- IMAGE/VIDEO SLOT: {label} -->{label}</div>'

def quote(txt, name, who, color="ua-pill--blue"):
    initial=name[0]
    return f'''<div class="ua-quote"><p class="ua-quote__txt">"{txt}"</p>
<div class="ua-quote__who"><div class="ua-avatar">{initial}</div>
<div><div class="ua-story__name">{name}</div><div style="opacity:.6;font-size:14px">{who}</div></div></div></div>'''

TESTIMONIALS = [
    ("I went from zero coding to a live booking site for my salon in a week. I still can't believe I built it myself.","Maya R.","Salon owner"),
    ("The Stripe and Supabase days alone paid for the course. I launched my SaaS and got my first paying user the next month.","Daniel K.","Indie founder"),
    ("I now build websites for local businesses as a side hustle. £1,200 per client, built with AI.","Priya S.","Freelancer"),
    ("Clear, practical, no fluff. Every session is recorded so I rewatched the SEO day three times.","Tom B.","Marketer"),
    ("I'd tried to learn to code for years. Five days with AI got me further than five months of tutorials.","Leah M.","Career changer"),
    ("Cloning a competitor's layout and making it my own was a lightbulb moment. Shipped my store the same day.","Marcus O.","E-commerce"),
]

# ---------------- build each page ----------------
import io
pages = {}

# ===== SYLLABUS =====
days = [
 ("1","Build the look","By the end of day 1 you'll have a great-looking site on screen.",
  ["Set up & build in Cursor","Clone any website from a link","Recreate a design from a screenshot","Generate images with AI","Voice-control coding with Whisper"]),
 ("2","Make it real","By the end of day 2 your site stores and remembers real data.",
  ["Databases with Supabase","User sign-up & login","Connect your front-end","Version control with GitHub"]),
 ("3","Get paid & connected","By the end of day 3 you can take money and talk to customers.",
  ["Payments with Stripe","Transactional emails with Resend","Set up a CRM","Capture & manage leads"]),
 ("4","Launch it live","By the end of day 4 your site is live on the internet.",
  ["Hosting your site","Connect a custom domain","Go live to the world","Debug like a pro"]),
 ("5","Get found & grow","By the end of day 5 people can find you on Google.",
  ["SEO fundamentals","Rank on Google","Analytics & iteration","Recap + live Q&A"]),
]
daycards=""
for no,title,sub,topics in days:
    pills="".join(f"<li>{t}</li>" for t in topics)
    daycards+=f'''<div class="ua-day">
<div class="ua-day__no">{no}</div>
<div><div class="ua-pill">Day {no} · 1 hour live</div>
<h3 class="ua-h3 ua-mt-s">{title}</h3>
<p class="ua-mt-s" style="opacity:.8">{sub}</p>
<ul class="ua-day__topics">{pills}</ul>
<div class="ua-media ua-media--wide ua-mt"><!-- VIDEO SLOT: Day {no} recorded tutorial -->Day {no} tutorial — video slot</div>
</div></div>'''
pages["syllabus.html"]=("Syllabus — Urban AI","The full 5-day curriculum: what you'll learn each day to build a website with AI.","syllabus.html",
f'''<header class="ua-hero"><div class="ua-wrap">
<div class="ua-pill ua-pill--green">5 days · 1 hour a day · live on Zoom</div>
<h1 class="ua-display ua-h1 ua-mt">the syllabus</h1>
<p class="ua-lead ua-mt">Twelve essential skills, spread across five focused one-hour live sessions. Every session is recorded, so you can rewatch any topic whenever you like.</p>
<a class="ua-btn ua-btn--lg ua-mt" href="{STRIPE}">Enrol</a>
</div></header>
<section class="ua-section--tight"><div class="ua-wrap ua-grid" style="gap:20px">{daycards}</div></section>
<section class="ua-section ua-center"><div class="ua-wrap">
<h2 class="ua-display ua-h2">ready to build?</h2>
<p class="ua-lead ua-mt" style="margin-inline:auto">Join the next cohort and ship your first real website with AI.</p>
<a class="ua-btn ua-btn--blue ua-btn--lg ua-mt" href="{STRIPE}">Enrol now</a>
</div></section>''')

# ===== PRICING =====
incl=["5 live 1-hour Zoom sessions","Lifetime access to all recordings","The full 12-topic curriculum",
      "Student dashboard to rewatch lessons","Ask-anything Q&A support","Templates, prompts & resources",
      "A real, live website by the end"]
incl_li="".join(f"<li>{i}</li>" for i in incl)
tcards="".join(quote(t,n,w) for t,n,w in TESTIMONIALS[:3])
pages["pricing.html"]=("Pricing — Urban AI","One simple price: £1,000 for the complete 5-day Urban AI course.","pricing.html",
f'''<header class="ua-hero ua-center"><div class="ua-wrap">
<div class="ua-pill ua-pill--orange">one simple price</div>
<h1 class="ua-display ua-h1 ua-mt">pricing</h1>
<p class="ua-lead ua-mt" style="margin-inline:auto">Everything you need to learn to build and launch real websites with AI.</p>
</div></header>
<section class="ua-section--tight"><div class="ua-wrap">
<div class="ua-card ua-price">
<div class="ua-pill ua-pill--blue">Full course</div>
<div class="ua-price__amount ua-mt-s">£1,000</div>
<div style="opacity:.6">one-time payment · lifetime access</div>
<ul class="ua-price__list">{incl_li}</ul>
<a class="ua-btn ua-btn--blue ua-btn--lg" style="width:100%;justify-content:center" href="{STRIPE}">Enrol now</a>
<p class="ua-mt-s" style="opacity:.6;font-size:14px">Secure checkout via Stripe. 14-day money-back guarantee.</p>
</div></div></section>
<section class="ua-section ua-blue"><div class="ua-wrap ua-center">
<h2 class="ua-display ua-h2">what students say</h2>
<div class="ua-grid ua-grid--3 ua-mt-l" style="text-align:left">{tcards}</div>
</div></section>
<section class="ua-section"><div class="ua-wrap">
<h2 class="ua-display ua-h2 ua-center">common questions</h2>
<div class="ua-faq ua-mt-l">
<details><summary>Do I need any coding experience?<span></span></summary><p>No. The whole point is that AI does the heavy lifting. We start from zero.</p></details>
<details><summary>What if I miss a live session?<span></span></summary><p>Every session is recorded and added to your dashboard, so you can catch up and rewatch anytime.</p></details>
<details><summary>How long do I keep access?<span></span></summary><p>Forever. You get lifetime access to all recordings and resources.</p></details>
</div>
<p class="ua-center ua-mt"><a href="faq.html">See all FAQs →</a></p>
</div></section>''')

# ===== SUCCESS STORIES =====
stories=[
 ("AI meal-planning app","Maya R.","Apps","Launched in 7 days, now 300+ users"),
 ("Coffee subscription store","Daniel K.","Stores","First paying customer in week one"),
 ("Online tutoring platform","Priya S.","Apps","Replaced a £6k agency quote"),
 ("Handmade jewellery shop","Leah M.","Stores","£2k in sales the first month"),
 ("Barber booking site","Marcus O.","Booking","Fully booked weekends now"),
 ("Author portfolio","Tom B.","Sites","Landed a publishing deal"),
 ("Fitness coaching site","Sara D.","Sites","Sells programmes on autopilot"),
 ("Restaurant ordering site","Hassan A.","Booking","Cut commission fees to zero"),
 ("SaaS dashboard","Nina P.","Apps","Bootstrapped to first revenue"),
]
scards=""
colors=["ua-pill--blue","ua-pill--green","ua-pill--orange","ua-pill--blue"]
for i,(proj,name,cat,result) in enumerate(stories):
    scards+=f'''<div class="ua-card">
<div class="ua-media ua-media--wide"><!-- IMAGE SLOT: screenshot of {name}'s website -->{proj} — screenshot</div>
<div class="ua-story__meta"><span class="ua-story__name">{name}</span><span class="ua-pill {colors[i%4]}">{cat}</span></div>
<h3 class="ua-h3 ua-mt-s">{proj}</h3>
<p class="ua-mt-s" style="opacity:.8">{result}</p>
<a class="ua-mt-s" style="display:inline-block;font-weight:700" href="#"><!-- LINK: live site URL -->View site →</a>
</div>'''
pages["success-stories.html"]=("Success Stories — Urban AI","Real students, real websites. See what people have built with AI after the Urban AI course.","success-stories.html",
f'''<header class="ua-hero"><div class="ua-wrap">
<div class="ua-pill ua-pill--blue">real students · real websites</div>
<h1 class="ua-display ua-h1 ua-mt">success stories</h1>
<p class="ua-lead ua-mt">From total beginners to live, money-making websites. Here's a taste of what our students have built with AI.</p>
</div></header>
<section class="ua-section--tight"><div class="ua-wrap ua-grid ua-grid--3">{scards}</div></section>
<section class="ua-section ua-center"><div class="ua-wrap">
<h2 class="ua-display ua-h2">you could be next</h2>
<a class="ua-btn ua-btn--blue ua-btn--lg ua-mt" href="{STRIPE}">Enrol</a>
</div></section>''')

# ===== FAQ =====
faqs=[
 ("Do I need any coding experience?","None at all. Urban AI is built for complete beginners as well as people who already build. AI writes the code — you learn how to direct it."),
 ("What exactly do I get?","Five live 1-hour Zoom sessions, lifetime access to every recording, the full 12-topic curriculum, a student dashboard to rewatch lessons, Q&A support, and templates and prompts to reuse."),
 ("When are the live sessions?","The course runs over five consecutive days, one hour per day, live on Zoom. Dates for the next cohort are shown at checkout."),
 ("What if I miss a session?","No problem — every session is recorded and added to your dashboard within hours, so you can catch up and rewatch anytime."),
 ("What will I be able to build?","A real, live website with a database, payments, emails, a custom domain and SEO — the same stack used by real startups."),
 ("What do I need to start?","A laptop, an internet connection, and an AI account. We'll walk you through any other tools (all have free tiers to start)."),
 ("How long do I keep access?","Forever. Lifetime access to all recordings and resources is included."),
 ("Is there a guarantee?","Yes — a 14-day money-back guarantee. If it's not for you, email us for a full refund."),
]
faq_html="".join(f'<details><summary>{q}<span></span></summary><p>{a}</p></details>' for q,a in faqs)
pages["faq.html"]=("FAQ — Urban AI","Answers to common questions about the Urban AI 5-day website-building course.","faq.html",
f'''<header class="ua-hero ua-center"><div class="ua-wrap">
<div class="ua-pill ua-pill--green">questions?</div>
<h1 class="ua-display ua-h1 ua-mt">frequently asked</h1>
</div></header>
<section class="ua-section--tight"><div class="ua-wrap"><div class="ua-faq">{faq_html}</div>
<p class="ua-center ua-mt-l">Still unsure? <a href="contact.html">Get in touch →</a></p>
</div></section>
<section class="ua-section ua-blue ua-center"><div class="ua-wrap">
<h2 class="ua-display ua-h2">ready when you are</h2>
<a class="ua-btn ua-btn--lg ua-mt" style="background:#fff;color:var(--ua-blue)" href="{STRIPE}">Enrol</a>
</div></section>''')

# ===== ABOUT =====
pages["about.html"]=("About — Urban AI","Why Urban AI exists: making website-building accessible to everyone with AI.","about.html",
f'''<header class="ua-hero"><div class="ua-wrap">
<div class="ua-pill ua-pill--orange">our mission</div>
<h1 class="ua-display ua-h1 ua-mt">about urban ai</h1>
<p class="ua-lead ua-mt">We believe anyone should be able to build the thing in their head — without a computer-science degree or a £10,000 agency invoice. AI changed what's possible. We teach you how to use it.</p>
</div></header>
<section class="ua-section--tight"><div class="ua-wrap ua-grid ua-grid--2" style="align-items:center;gap:48px">
<div>{media("instructor photo","ua-media--sq")}</div>
<div>
<div class="ua-pill ua-pill--blue">your instructor</div>
<h2 class="ua-display ua-h2 ua-mt-s">hi, i'm your guide</h2>
<p class="ua-mt"><!-- TEXT: instructor bio -->I've built and shipped dozens of websites and products using AI — for myself and for clients. I'll show you the exact, repeatable workflow I use, with no jargon and no gatekeeping.</p>
<p class="ua-mt">Over five days you'll learn the same stack real startups use: Cursor, Supabase, Stripe, Resend, GitHub, hosting, domains and SEO — all driven by AI.</p>
<a class="ua-btn ua-mt" href="syllabus.html">See the syllabus →</a>
</div></div></section>
<section class="ua-section ua-blue"><div class="ua-wrap ua-center">
<h2 class="ua-display ua-h2">why ai?</h2>
<div class="ua-grid ua-grid--3 ua-mt-l" style="text-align:left">
<div class="ua-card"><h3 class="ua-h3">It writes the code</h3><p class="ua-mt-s">You describe what you want; AI builds it. You stay in control and learn as you go.</p></div>
<div class="ua-card"><h3 class="ua-h3">It's the whole stack</h3><p class="ua-mt-s">From front-end to database to payments — one workflow covers everything you need to ship.</p></div>
<div class="ua-card"><h3 class="ua-h3">It's a real skill</h3><p class="ua-mt-s">Build for yourself, or for clients. People are paying thousands for sites you'll learn to make.</p></div>
</div>
<a class="ua-btn ua-btn--lg ua-mt-l" style="background:#fff;color:var(--ua-blue)" href="{STRIPE}">Enrol</a>
</div></section>''')

# ===== CONTACT =====
pages["contact.html"]=("Contact — Urban AI","Get in touch with Urban AI about the course.","contact.html",
f'''<header class="ua-hero"><div class="ua-wrap">
<div class="ua-pill ua-pill--green">say hello</div>
<h1 class="ua-display ua-h1 ua-mt">contact</h1>
<p class="ua-lead ua-mt">Questions before you enrol? We'd love to help.</p>
</div></header>
<section class="ua-section--tight"><div class="ua-wrap ua-grid ua-grid--2" style="gap:48px">
<div>
<h2 class="ua-h3">Email</h2>
<p><a href="mailto:hello@urbanai.co" style="font-weight:700">hello@urbanai.co</a></p>
<h2 class="ua-h3 ua-mt">Social</h2>
<ul class="ua-foot__links" style="color:var(--ua-ink)">
<li><a href="https://www.instagram.com/" target="_blank" rel="noopener">Instagram</a></li>
<li><a href="https://www.tiktok.com/" target="_blank" rel="noopener">TikTok</a></li>
<li><a href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a></li>
</ul>
<p class="ua-mt" style="opacity:.6;font-size:14px">We're online — reply times are usually within a day.</p>
</div>
<div class="ua-card">
<h2 class="ua-h3">Send a message</h2>
<form class="ua-form ua-mt" action="mailto:hello@urbanai.co" method="post" enctype="text/plain">
<input class="ua-input" type="text" name="name" placeholder="Your name" required/>
<input class="ua-input" type="email" name="email" placeholder="Your email" required/>
<textarea class="ua-input" name="message" placeholder="Your message" rows="4" style="border-radius:18px" required></textarea>
<button class="ua-btn ua-btn--blue" type="submit">Send</button>
</form>
<p class="ua-mt-s" style="opacity:.6;font-size:13px"><!-- NOTE: static mailto form. Wire to a real handler in the app phase. --></p>
</div></div></section>''')

# write all
for fname,(title,desc,active,body) in pages.items():
    head_cur=head(title,desc)
    html=head_cur+'<body class="ua-body">'+nav(active)+body+FOOTER+"</body></html>"
    open(fname,'w',encoding='utf-8').write(html)
    print("wrote",fname,len(html),"bytes")

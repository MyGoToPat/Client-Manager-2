# HiPat Enterprise Marketing - Design & Copywriting Guide

Use this document as a reference when creating marketing pages for Pat for Trainers (Enterprise).

---

## 1. BRAND IDENTITY

### Colors
```css
/* Primary Gradient */
--pat-purple: #8B5CF6;
--pat-orange: #F97316;

/* Backgrounds */
--background: #0a0a0f;
--background-gradient: linear-gradient(180deg, #111827 0%, #0a0a0f 50%, #0a0a0f 100%);

/* Cards & Surfaces */
--card-bg: rgba(255, 255, 255, 0.05);
--card-border: rgba(255, 255, 255, 0.1);

/* Text */
--text-primary: #ffffff;
--text-secondary: #9ca3af;
--text-muted: #6b7280;

/* Status Colors */
--success: #22c55e;
--warning: #f59e0b;
--error: #ef4444;
```

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)
- **Headlines**: text-4xl to text-6xl, font-bold
- **Body**: text-base to text-xl, text-gray-300
- **Small text**: text-sm, text-gray-400

### Pat Avatar
```html
<!-- Small (nav, footer) -->
<div class="w-10 h-10 rounded-full bg-gradient-to-br from-pat-purple to-pat-orange flex items-center justify-center">
    <div class="flex gap-1.5">
        <div class="w-1.5 h-2 bg-white rounded-full"></div>
        <div class="w-1.5 h-2 bg-white rounded-full"></div>
    </div>
</div>

<!-- Large with badge (hero) -->
<div class="relative">
    <div class="w-24 h-24 rounded-full bg-gradient-to-br from-pat-purple via-purple-500 to-pat-orange flex items-center justify-center">
        <div class="flex gap-4">
            <div class="w-3 h-4 bg-white rounded-full"></div>
            <div class="w-3 h-4 bg-white rounded-full"></div>
        </div>
    </div>
    <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-pat-purple text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
        Your AI Employee
    </div>
</div>
```

### Gradient Text
```html
<span class="gradient-text">Text here</span>

<style>
.gradient-text {
    background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 50%, #F97316 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>
```

### CTA Button with Glow
```html
<button class="bg-gradient-to-r from-pat-orange to-orange-500 hover:from-orange-500 hover:to-pat-orange text-white text-lg font-bold px-10 py-4 rounded-full cta-glow transition-all hover:scale-105">
    Hire Pat — 14 Days Free
</button>

<style>
.cta-glow { box-shadow: 0 0 30px rgba(249, 115, 22, 0.4); }
</style>
```

---

## 2. VOICE & MESSAGING

### Pat's Voice (Enterprise)
- **First person**: "I'm Pat. I'm your AI employee."
- **Direct**: No fluff, get to the point
- **Confident**: Pat knows what Pat does well
- **Helpful**: Focused on solving trainer problems

### Key Messaging Shifts (Consumer → Enterprise)

| Concept | Consumer | Enterprise |
|---------|----------|------------|
| Role | "I'm your coach" | "I'm your employee" |
| CTA | "Talk to Me" | "Hire Pat" / "Hire Me" |
| Trial | "7 Days Free" | "14 Days Free" |
| Value | "One coach, full picture" | "Pat sees everything so you don't have to" |
| Availability | "24/7 support" | "24/7 client coverage" |
| Memory | "I remember everything" | "Pat remembers every client" |

### Taglines
- "You can't be there for every client, 24/7. I can."
- "Other platforms show you data. I tell you what to do about it."
- "They build tools. I build relationships."
- "Born not built."

---

## 3. HORMOZI SELLING TECHNIQUES

### A. Value Equation
**Dream Outcome × Perceived Likelihood / Time × Effort**
- Maximize: Results, believability
- Minimize: Time to results, effort required

**Apply by showing:**
- Specific results: "67% churn reduction", "12 hours saved per week"
- Low effort: "Zero extra work from you", "Pat does it automatically"
- Fast results: "See results in week one"

### B. Pain → Agitate → Solve
1. **Pain**: State the problem they feel
2. **Agitate**: Make it worse (cost of inaction)
3. **Solve**: Present Pat as the relief

**Enterprise Pain Points:**
```
#1: "I can't be available 24/7 for every client"
    → I never sleep. I'm always there.

#2: "I spend hours prepping before each session"
    → I brief you in 2 minutes flat.

#3: "I miss warning signs until clients churn"
    → I catch them on day 1, not day 30.

#4: "I use 5 different tools and nothing talks to each other"
    → One dashboard. Everything connected.

#5: "Scaling means less personal touch"
    → I make 50 clients feel like 10.

#6: "Clients need nutrition help but I can't do it all"
    → I handle nutrition coaching 24/7.
```

### C. Value Anchoring
Show what the alternative costs before revealing price:
```
What you'd pay for the same coverage:
- VA: $2,000/mo (crossed out)
- 2nd trainer: $4,000/mo (crossed out)
- Pat: From $99/mo ✓
```

### D. Specificity = Believability
Use specific numbers, not vague claims:
- ❌ "Many trainers use Pat"
- ✅ "347 trainers managing 12,400+ clients"

- ❌ "Saves you time"
- ✅ "Saves 12 hours per week"

- ❌ "Reduces churn"
- ✅ "67% average churn reduction"

- ❌ "Backed by research"
- ✅ "Trained on 847+ peer-reviewed studies"

### E. Risk Reversal
Remove all risk from the buyer:
```html
<div class="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
    <p class="text-green-400 font-bold">The "Pat Pays For Itself" Guarantee</p>
    <p class="text-gray-300">If Pat doesn't save you at least 5 hours in your first week, get a full refund. No questions asked.</p>
    <div class="flex gap-4 text-sm text-green-400">
        <span>✓ 14-day free trial</span>
        <span>✓ 30-day money-back</span>
        <span>✓ Cancel anytime</span>
    </div>
</div>
```

### F. Scarcity & Urgency
Create legitimate reasons to act now:
```html
<div class="bg-pat-orange/20 border border-pat-orange/30 px-4 py-2 rounded-full">
    <span class="w-2 h-2 bg-pat-orange rounded-full animate-pulse"></span>
    <span class="text-pat-orange">Founding Trainer Pricing — Only 47 Spots Left</span>
</div>
```

### G. ROI-Focused Testimonials
Always include specific results:
```
"I went from 18 to 47 clients in 4 months without burning out."
— Daniel R., Online Coach
Result: +161% client growth

"My retention went from 4 months to 11 months average."
— Michelle K., Gym Owner
Result: +175% retention
```

---

## 4. PAGE STRUCTURE TEMPLATE

### Landing Page Sections (in order)
1. **Nav** - Logo, links, CTA button
2. **Hero** - Headline, subhead, CTA, social proof, Pat avatar, feature preview
3. **Cost of Inaction** - Stats showing what they're losing
4. **Pain Agitation** - 6 pain points with solutions
5. **How It Works** - 4 feature cards (Morning Briefings, Smart Directives, Session Prep, 24/7 Support)
6. **Comparison** - Old Way vs With Pat
7. **Feature Table** - vs Competitors (Everfit, TrueCoach, Trainerize)
8. **Testimonials** - 3 cards with specific ROI results
9. **Pricing** - 3 tiers with value anchor
10. **FAQ** - 5-6 common questions
11. **Final CTA** - Urgency + risk reversal
12. **Footer** - Links, copyright

### Pricing Page Sections
1. **Header** - Value proposition
2. **Value Breakdown** - What they're getting (crossed out values)
3. **ROI Calculator** - Time saved + churn reduced + growth = total value
4. **Pricing Cards** - 3-4 tiers
5. **Comparison Table** - Features by tier
6. **Guarantee Box** - Risk reversal
7. **FAQ** - Pricing-specific questions
8. **Final CTA**

---

## 5. KEY COMPONENTS

### Morning Briefing Card
```html
<div class="bg-white/5 border border-white/10 rounded-2xl p-5">
    <div class="flex items-center gap-2 mb-4">
        <svg class="w-4 h-4 text-pat-orange"><!-- sun icon --></svg>
        <span class="text-gray-300 font-medium">Your Morning Briefing</span>
        <span class="text-xs text-gray-500 ml-auto">7:00 AM</span>
    </div>

    <!-- Urgent item (red) -->
    <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-3">
        <span class="text-red-400 text-xs font-bold">URGENT</span>
        <p class="text-gray-300"><span class="text-white font-medium">Emily R.</span> hasn't logged in 7 days.</p>
        <p class="text-gray-500 text-xs">→ Suggested: Send check-in</p>
    </div>

    <!-- Win item (green) -->
    <div class="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-3">
        <span class="text-green-400 text-xs font-bold">WIN</span>
        <p class="text-gray-300"><span class="text-white font-medium">Marcus T.</span> hit a new PR!</p>
    </div>

    <!-- Heads up item (yellow) -->
    <div class="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
        <span class="text-yellow-400 text-xs font-bold">HEADS UP</span>
        <p class="text-gray-300">3 clients have sessions today.</p>
    </div>
</div>
```

### Stat Cards
```html
<div class="grid grid-cols-4 gap-4">
    <div class="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
        <div class="text-3xl font-bold text-white">347</div>
        <div class="text-xs text-gray-400">Trainers using Pat</div>
    </div>
    <div class="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
        <div class="text-3xl font-bold text-white">12,400+</div>
        <div class="text-xs text-gray-400">Clients managed</div>
    </div>
    <div class="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
        <div class="text-3xl font-bold text-white">67%</div>
        <div class="text-xs text-gray-400">Avg churn reduction</div>
    </div>
    <div class="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
        <div class="text-3xl font-bold text-white">12 hrs</div>
        <div class="text-xs text-gray-400">Saved per week</div>
    </div>
</div>
```

### Comparison Row
```html
<div class="grid md:grid-cols-2 gap-6">
    <!-- Old Way (Red) -->
    <div class="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
        <h3 class="text-red-400 font-bold text-sm uppercase mb-4">Traditional Tools</h3>
        <div class="flex items-start gap-3">
            <span class="text-red-400">✕</span>
            <div>
                <span class="text-gray-300">Dashboard shows data</span>
                <p class="text-gray-500 text-sm">You analyze. You decide. You act.</p>
            </div>
        </div>
    </div>

    <!-- With Pat (Purple/Orange gradient) -->
    <div class="bg-gradient-to-br from-pat-purple/10 to-pat-orange/10 border border-pat-purple/30 rounded-2xl p-6">
        <h3 class="text-pat-purple font-bold text-sm uppercase mb-4">With Pat</h3>
        <div class="flex items-start gap-3">
            <span class="text-green-400">✓</span>
            <div>
                <span class="text-white font-medium">I brief you every morning</span>
                <p class="text-gray-400 text-sm">"Emily's struggling — here's why."</p>
            </div>
        </div>
    </div>
</div>
```

---

## 6. ENTERPRISE PRICING TIERS

| Plan | Price | Clients | Best For |
|------|-------|---------|----------|
| **Starter** | $99/mo | Up to 15 | Solo trainers starting to scale |
| **Growth** | $199/mo (was $299) | Up to 50 | Growing trainers (Most Popular) |
| **Pro** | $599/mo | Unlimited | Teams & studios |
| **Enterprise** | Custom | Custom | 100+ clients, custom needs |

**Per-client cost positioning:**
- Starter: "$6.60/client at 15 clients"
- Growth: "$4/client at 50 clients — Best value"

---

## 7. HTML TEMPLATE STARTER

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PAGE TITLE — Pat for Trainers</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        pat: { purple: '#8B5CF6', orange: '#F97316' },
                        background: '#0a0a0f',
                    },
                },
            },
        }
    </script>
    <style>
        body {
            background: linear-gradient(180deg, #111827 0%, #0a0a0f 50%, #0a0a0f 100%);
            font-family: 'Inter', sans-serif;
        }
        .gradient-text {
            background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 50%, #F97316 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .cta-glow { box-shadow: 0 0 30px rgba(249, 115, 22, 0.4); }
        .value-line { text-decoration: line-through; text-decoration-color: #ef4444; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .float { animation: float 4s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
    </style>
</head>
<body class="text-white min-h-screen">
    <!-- NAV -->
    <!-- HERO -->
    <!-- SECTIONS -->
    <!-- FOOTER -->
</body>
</html>
```

---

## 8. PROMPT FOR GENERATING NEW PAGES

When asking Claude to create a new enterprise marketing page, use this prompt structure:

```
Create an HTML marketing page for [PAGE PURPOSE] using the HiPat Enterprise design system.

**Design Requirements:**
- Dark theme (#0a0a0f background)
- Purple (#8B5CF6) and orange (#F97316) gradient accents
- Inter font from Google Fonts
- Tailwind CSS via CDN
- Pat avatar with "AI Employee" badge
- Glass-morphism cards (bg-white/5, backdrop-blur, border-white/10)

**Hormozi Selling Techniques to Apply:**
- Pain → Agitate → Solve structure
- Specific numbers for credibility
- Value anchoring (show what alternatives cost)
- Risk reversal (14-day trial, 30-day guarantee)
- Scarcity (founding spots, price lock)
- ROI-focused testimonials

**Voice:**
- First person from Pat: "I'm your employee"
- Direct, confident, helpful
- CTA: "Hire Pat — 14 Days Free"

**Include these sections:**
[List specific sections needed]

**Key stats to use:**
- 347 trainers
- 12,400+ clients managed
- 67% avg churn reduction
- 12 hours saved per week
- $99-599/mo pricing
```

---

This guide contains everything needed to create consistent HiPat enterprise marketing pages.

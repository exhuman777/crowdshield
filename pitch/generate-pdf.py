#!/usr/bin/env python3
"""Generate teleprompter-style PDF from pitch script."""

try:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import mm
    from reportlab.pdfgen import canvas
    from reportlab.lib.colors import white, HexColor
except ImportError:
    import subprocess, sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "reportlab", "-q"])
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import mm
    from reportlab.pdfgen import canvas
    from reportlab.lib.colors import white, HexColor

import os

OUTPUT = os.path.expanduser("~/crowdshield/pitch/PITCH_TODAY.pdf")
W, H = A4

BG = HexColor("#0a0a0a")
GREEN = HexColor("#34d399")
RED = HexColor("#f87171")
YELLOW = HexColor("#fbbf24")
GRAY = HexColor("#71717a")
WHITE = white

def new_page(c):
    c.setFillColor(BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)

def draw_text(c, y, text, size=22, color=WHITE, bold=False):
    font = "Helvetica-Bold" if bold else "Helvetica"
    c.setFont(font, size)
    c.setFillColor(color)
    max_width = W - 60*mm
    words = text.split()
    lines = []
    current = ""
    for w in words:
        test = current + " " + w if current else w
        if c.stringWidth(test, font, size) < max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = w
    if current:
        lines.append(current)
    for line in lines:
        if y < 30*mm:
            c.showPage()
            new_page(c)
            y = H - 30*mm
        c.drawString(30*mm, y, line)
        y -= size * 1.5
    return y

def draw_action(c, y, text):
    return draw_text(c, y, "→  " + text, size=18, color=GREEN, bold=True)

def draw_stage(c, y, text):
    return draw_text(c, y, text, size=16, color=YELLOW, bold=False)

def draw_section_header(c, y, num, title):
    if y < 80*mm:
        c.showPage()
        new_page(c)
        y = H - 30*mm
    y = draw_text(c, y, f"{num}.", size=40, color=GREEN, bold=True)
    y += 20
    y = draw_text(c, y + 15, title, size=28, color=GREEN, bold=True)
    y -= 5
    return y

c = canvas.Canvas(OUTPUT, pagesize=A4)

# ─── TITLE PAGE ─────────────────────────────────────
new_page(c)
y = H - 80*mm
y = draw_text(c, y, "CROWDSHIELD", size=48, color=GREEN, bold=True)
y -= 10
y = draw_text(c, y, "PITCH SCRIPT", size=36, color=WHITE, bold=True)
y -= 20
y = draw_text(c, y, "3 minutes. Live demo. Read and click.", size=20, color=GRAY)
y -= 30
y = draw_text(c, y, "Share screen: localhost:4242", size=18, color=YELLOW)
y = draw_text(c, y, "Click through the app while talking.", size=18, color=YELLOW)
y = draw_text(c, y, "No slides. No tabs. Just the product.", size=18, color=YELLOW)

# ─── SECTION 1 ──────────────────────────────────────
c.showPage()
new_page(c)
y = H - 30*mm
y = draw_section_header(c, y, "1", "HOMEPAGE  (0:00)")
y -= 5
y = draw_text(c, y, "Show: localhost:4242", size=14, color=GRAY)
y -= 15

for line in [
    "April seventh.",
    "Wireless Festival.",
    "Cancelled.",
    "",
    "50,000 fans stranded.",
    "Flights booked.",
    "Hotels non-refundable.",
    "Ye banned from the UK.",
    "Sponsors fled. Done.",
    "",
    "Wireless wasn't special.",
    "Over forty festivals cancelled",
    "in 2025 alone.",
    "Wildfires shut down Greek islands.",
    "Airlines collapsed routes overnight.",
]:
    if line == "":
        y -= 12
    else:
        y = draw_text(c, y, line, size=22, color=WHITE)

c.showPage()
new_page(c)
y = H - 30*mm
y = draw_text(c, y, "Insurance exists for all of this.", size=22)
y = draw_text(c, y, "Six and a half billion dollar market.", size=22)
y = draw_text(c, y, "Growing to twenty-three billion by 2035.", size=22)
y -= 15
y = draw_text(c, y, "But nobody under 35 has ever", size=22)
y = draw_text(c, y, "voluntarily bought", size=24, bold=True)
y = draw_text(c, y, "an insurance policy.", size=22)
y -= 15
y = draw_text(c, y, "They won't fill out claim forms.", size=22)
y = draw_text(c, y, "They won't read policy documents.", size=22)
y -= 10
y = draw_text(c, y, "But they will open", size=22)
y = draw_text(c, y, "a collectible pack.", size=24, bold=True)
y -= 25
y = draw_action(c, y, 'CLICK "Open Packs" button')

# ─── SECTION 2 ──────────────────────────────────────
c.showPage()
new_page(c)
y = H - 30*mm
y = draw_section_header(c, y, "2", "PACK STORE  (0:35)")
y -= 5
y = draw_text(c, y, "Show: 4 pack tiers visible", size=14, color=GRAY)
y -= 15

y = draw_text(c, y, "A twenty-four billion dollar gaming market", size=22)
y = draw_text(c, y, "and a six and a half billion dollar", size=22)
y = draw_text(c, y, "insurance market were waiting", size=22)
y = draw_text(c, y, "for someone to connect them.", size=22)
y -= 15
y = draw_text(c, y, "71% of blockchain gamers", size=24, bold=True)
y = draw_text(c, y, "are 18 to 34.", size=24, bold=True)
y -= 10
y = draw_text(c, y, "The exact demographic", size=22)
y = draw_text(c, y, "that rejects insurance.", size=22)
y = draw_text(c, y, "The exact demographic", size=22)
y = draw_text(c, y, "that opens packs.", size=22)
y -= 25
y = draw_action(c, y, 'CLICK "Open Pack" on Starter Shield')
y = draw_stage(c, y, "Wait ~3 seconds for cards to reveal")

# ─── SECTION 3 ──────────────────────────────────────
c.showPage()
new_page(c)
y = H - 30*mm
y = draw_section_header(c, y, "3", "PACK OPENED  (0:55)")
y -= 5
y = draw_text(c, y, "Show: 3 cards, gold Wireless TRIGGERED", size=14, color=GRAY)
y -= 15

y = draw_text(c, y, "CrowdShield.", size=24, bold=True)
y = draw_text(c, y, "Each card is a real parametric", size=22)
y = draw_text(c, y, "micro-insurance policy", size=22)
y = draw_text(c, y, "on a real-world event.", size=22)
y -= 10
y = draw_text(c, y, "Wildfires. Flight disruptions.", size=22)
y = draw_text(c, y, "Festival cancellations. Pandemics.", size=22)
y -= 15
y = draw_text(c, y, "That gold card?", size=22)
y = draw_text(c, y, "Wireless Festival Cancelled.", size=24, bold=True)
y = draw_text(c, y, "Already triggered.", size=22)
y = draw_text(c, y, "300 USDC paid out automatically", size=22)
y = draw_text(c, y, "on April 7th.", size=22)
y = draw_text(c, y, "No claim filed. No form.", size=22)
y = draw_text(c, y, "Three seconds on Solana.", size=24, bold=True)
y -= 10
y = draw_text(c, y, "A five dollar pack.", size=22)
y = draw_text(c, y, "Three hundred dollar payout.", size=24, bold=True)
y = draw_text(c, y, "Where does the money come from?", size=22)
y -= 10
y = draw_text(c, y, "Same place as any insurance pool.", size=22)
y = draw_text(c, y, "Most cards never trigger.", size=22)
y = draw_text(c, y, "Every pack sold puts 55%", size=22)
y = draw_text(c, y, "into the payout pool.", size=22)

c.showPage()
new_page(c)
y = H - 30*mm
y = draw_text(c, y, "3. PACK OPENED (continued)", size=20, color=GREEN, bold=True)
y -= 15
y = draw_text(c, y, "Trigger probabilities run 1 to 8 percent.", size=22)
y = draw_text(c, y, "Thousands of expired cards fund", size=22)
y = draw_text(c, y, "the few that fire.", size=22)
y -= 10
y = draw_text(c, y, "Expected value per pack", size=22)
y = draw_text(c, y, "stays below pack price.", size=22)
y = draw_text(c, y, "The spread funds the pool.", size=22)
y -= 10
y = draw_text(c, y, "Same math as traditional insurance,", size=24, bold=True)
y = draw_text(c, y, "completely different experience.", size=24, bold=True)
y -= 25
y = draw_action(c, y, "CLICK the Greece Wildfire card")

# ─── SECTION 4 ──────────────────────────────────────
c.showPage()
new_page(c)
y = H - 30*mm
y = draw_section_header(c, y, "4", "CARD DETAIL  (1:20)")
y -= 5
y = draw_text(c, y, "Show: Wildfire card + odds + news", size=14, color=GRAY)
y = draw_stage(c, y, "Scroll slowly so they see the depth")
y -= 10

y = draw_text(c, y, "Every card has real data behind it.", size=22)
y -= 5
y = draw_text(c, y, "This card: 67% trigger probability.", size=24, bold=True)
y = draw_text(c, y, "Based on ten years of", size=22)
y = draw_text(c, y, "European Forest Fire data.", size=22)
y = draw_text(c, y, "Seven of the last ten summers", size=22)
y = draw_text(c, y, "exceeded the threshold.", size=22)
y -= 10
y = draw_text(c, y, "Oracle source: EFFIS. Satellite-confirmed.", size=22)
y = draw_text(c, y, "Binary: did wildfire exceed 500 hectares?", size=22)
y = draw_text(c, y, "Yes or no. Oracle confirms, payout lands.", size=22)

c.showPage()
new_page(c)
y = H - 30*mm
y = draw_text(c, y, "4. CARD DETAIL (continued)", size=20, color=GREEN, bold=True)
y -= 15

y = draw_text(c, y, "The pricing uses a bonding curve.", size=22)
y = draw_text(c, y, "Early buyers get cheaper cover.", size=22)
y = draw_text(c, y, "The math guarantees pool solvency", size=22)
y = draw_text(c, y, "at every state.", size=22)
y -= 15
y = draw_text(c, y, "We built this full stack ourselves.", size=24, bold=True)
y = draw_text(c, y, "Nine smart contract instructions.", size=22)
y = draw_text(c, y, "Bonding curve engine.", size=22)
y = draw_text(c, y, "Twelve fully researched cards", size=22)
y = draw_text(c, y, "with real oracle sources.", size=22)
y -= 5
y = draw_text(c, y, "We build fast because", size=22)
y = draw_text(c, y, "we've shipped on-chain before.", size=24, bold=True)
y -= 25
y = draw_action(c, y, 'CLICK "Events" in navbar')
y = draw_action(c, y, 'CLICK "Wireless Festival 2026"')

# ─── SECTION 5 ──────────────────────────────────────
c.showPage()
new_page(c)
y = H - 30*mm
y = draw_section_header(c, y, "5", "WIRELESS EVENT  (1:55)")
y -= 5
y = draw_text(c, y, "Show: Red CANCELLED banner, gauge at 92", size=14, color=GRAY)
y -= 15

y = draw_text(c, y, "Two products, two revenue streams.", size=24, bold=True)
y -= 5
y = draw_text(c, y, "Shield Packs: 20% platform take.", size=22)
y = draw_text(c, y, "Event Shields: 12% spread on premiums.", size=22)
y = draw_text(c, y, "Plus 5% royalties on secondary trades.", size=22)
y -= 15
y = draw_text(c, y, "Ten thousand packs per month, ten events:", size=22)
y = draw_text(c, y, "over a million dollars annually.", size=24, bold=True)
y -= 15
y = draw_text(c, y, "Organizers stake bonds.", size=22)
y = draw_text(c, y, "Minimum 2% of ticket revenue.", size=22)
y = draw_text(c, y, "Cancelled by organizer fault?", size=22)
y = draw_text(c, y, "Bond gets slashed. On-chain. Automatic.", size=22)
y -= 25
y = draw_action(c, y, "SCROLL DOWN to Resolution Simulator")
y = draw_action(c, y, 'CLICK "Simulate: Event Cancelled"')
y = draw_stage(c, y, "Wait ~3 seconds for payout animation")

# ─── SECTION 6 ──────────────────────────────────────
c.showPage()
new_page(c)
y = H - 30*mm
y = draw_section_header(c, y, "6", "PAYOUT COMPLETE  (2:25)")
y -= 5
y = draw_text(c, y, "Show: Green checkmark, 300 USDC, 27.6x", size=14, color=GRAY)
y -= 15

y = draw_text(c, y, "Polymarket proved people want exposure", size=22)
y = draw_text(c, y, "to real-world events.", size=22)
y = draw_text(c, y, "Two billion in volume.", size=22)
y -= 10
y = draw_text(c, y, "But Polymarket is pure speculation.", size=24, bold=True)
y = draw_text(c, y, "Anyone can bet on anything.", size=22)
y = draw_text(c, y, "War outcomes. Nuclear detonations.", size=22)
y = draw_text(c, y, "Congress introducing bans.", size=22)
y -= 15
y = draw_text(c, y, "CrowdShield is structurally different.", size=24, bold=True)

c.showPage()
new_page(c)
y = H - 30*mm
y = draw_text(c, y, "6. PAYOUT (continued)", size=20, color=GREEN, bold=True)
y -= 15

y = draw_text(c, y, "Every card pays out based on", size=22)
y = draw_text(c, y, "a parametric trigger.", size=22)
y = draw_text(c, y, "Not opinion. Not a vote.", size=22)
y = draw_text(c, y, "Verifiable data.", size=24, bold=True)
y = draw_text(c, y, "Satellite imagery. Flight network status.", size=22)
y = draw_text(c, y, "Official government announcements.", size=22)
y -= 10
y = draw_text(c, y, "The payout follows truth,", size=22)
y = draw_text(c, y, "not consensus.", size=24, bold=True)
y -= 10
y = draw_text(c, y, "That eliminates moral hazard.", size=22)
y = draw_text(c, y, "Nobody profits from causing the disaster.", size=22)
y = draw_text(c, y, "The World Bank validated this model", size=22)
y = draw_text(c, y, "across thirty countries.", size=22)
y = draw_text(c, y, "We apply it to a generation", size=22)
y = draw_text(c, y, "that traditional insurance ignores.", size=22)

c.showPage()
new_page(c)
y = H - 30*mm
y = draw_text(c, y, "6. PAYOUT (continued)", size=20, color=GREEN, bold=True)
y -= 15

y = draw_text(c, y, "Five actors in the system:", size=22)
y = draw_text(c, y, "fans, organizers, LPs, traders, collectors.", size=22)
y = draw_text(c, y, "Every actor's dominant strategy is", size=22)
y = draw_text(c, y, "individually optimal AND", size=24, bold=True)
y = draw_text(c, y, "collectively welfare-maximizing.", size=24, bold=True)
y = draw_text(c, y, "No prisoner's dilemma.", size=22)
y = draw_text(c, y, "Cooperation dominates.", size=22)
y -= 15
y = draw_text(c, y, "5,400 projects in the Colosseum corpus.", size=22)
y = draw_text(c, y, "Zero combine parametric insurance", size=22)
y = draw_text(c, y, "with gamified distribution.", size=22)
y = draw_text(c, y, "We want to be the first.", size=24, bold=True)

# ─── CLOSING ────────────────────────────────────────
c.showPage()
new_page(c)
y = H - 80*mm

y = draw_stage(c, y, "SLOW DOWN")
y -= 20
y = draw_text(c, y, "10.86 USDC premium.", size=28, bold=True)
y -= 5
y = draw_text(c, y, "300 USDC payout.", size=28, bold=True)
y -= 5
y = draw_text(c, y, "Three seconds.", size=32, color=GREEN, bold=True)
y -= 5
y = draw_text(c, y, "No form. No waiting.", size=28, bold=True)
y -= 30
y = draw_stage(c, y, "PAUSE")
y -= 25
y = draw_text(c, y, "CrowdShield.", size=36, color=GREEN, bold=True)
y -= 5
y = draw_text(c, y, "Collect your shields.", size=32, bold=True)
y -= 5
y = draw_text(c, y, "Protect against chaos.", size=32, bold=True)
y -= 40
y = draw_stage(c, y, "SILENCE — 3 SECONDS — DONE")

c.save()
print(f"PDF saved: {OUTPUT}")

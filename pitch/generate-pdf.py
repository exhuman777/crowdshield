#!/usr/bin/env python3
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
YELLOW = HexColor("#fbbf24")
GRAY = HexColor("#71717a")
WHITE = white

def new_page(c):
    c.setFillColor(BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)

def t(c, y, text, size=22, color=WHITE, bold=False):
    font = "Helvetica-Bold" if bold else "Helvetica"
    c.setFont(font, size)
    c.setFillColor(color)
    mx = W - 60*mm
    words = text.split()
    lines, cur = [], ""
    for w in words:
        test = cur + " " + w if cur else w
        if c.stringWidth(test, font, size) < mx:
            cur = test
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    for line in lines:
        if y < 30*mm:
            c.showPage(); new_page(c); y = H - 30*mm
        c.drawString(30*mm, y, line)
        y -= size * 1.5
    return y

def act(c, y, text):
    return t(c, y, "→  " + text, size=18, color=GREEN, bold=True)

def hdr(c, y, num, title):
    if y < 80*mm:
        c.showPage(); new_page(c); y = H - 30*mm
    y = t(c, y, f"{num}. {title}", size=30, color=GREEN, bold=True)
    y -= 5
    return y

c = canvas.Canvas(OUTPUT, pagesize=A4)

# TITLE
new_page(c)
y = H - 80*mm
y = t(c, y, "CROWDSHIELD", size=48, color=GREEN, bold=True)
y -= 10
y = t(c, y, "PITCH SCRIPT", size=36, bold=True)
y -= 20
y = t(c, y, "3 min. Screen share localhost:4242.", size=20, color=GRAY)
y = t(c, y, "Click through live. Read this.", size=20, color=GRAY)

# 1. HOMEPAGE
c.showPage(); new_page(c); y = H - 30*mm
y = hdr(c, y, 1, "HOMEPAGE (0:00)")
y -= 10
y = t(c, y, "April seventh.", size=24)
y = t(c, y, "Wireless Festival. Cancelled.", size=24)
y -= 8
y = t(c, y, "50,000 fans. Flights booked.", size=22)
y = t(c, y, "Hotels non-refundable.", size=22)
y = t(c, y, "Ye banned from the UK. Done.", size=22)
y -= 12
y = t(c, y, "Forty festivals cancelled in 2025.", size=22)
y = t(c, y, "$6.5B insurance market,", size=22)
y = t(c, y, "growing to $23B.", size=22)
y -= 12
y = t(c, y, "But nobody under 35", size=22)
y = t(c, y, "buys insurance.", size=24, bold=True)
y = t(c, y, "They won't fill out forms.", size=22)
y = t(c, y, "They will open a collectible pack.", size=24, bold=True)
y -= 20
y = act(c, y, 'CLICK "Open Packs"')

# 2. PACK STORE
c.showPage(); new_page(c); y = H - 30*mm
y = hdr(c, y, 2, "PACK STORE (0:30)")
y -= 10
y = t(c, y, "$24B gaming meets $6.5B insurance.", size=24, bold=True)
y -= 8
y = t(c, y, "71% of blockchain gamers", size=22)
y = t(c, y, "are 18 to 34.", size=22)
y = t(c, y, "Rejects insurance. Opens packs.", size=22)
y -= 25
y = act(c, y, 'CLICK "Open Pack" on Starter')
y = t(c, y, "Wait ~3 seconds", size=16, color=YELLOW)

# 3. PACK OPENED
c.showPage(); new_page(c); y = H - 30*mm
y = hdr(c, y, 3, "PACK OPENED (0:45)")
y -= 10
y = t(c, y, "CrowdShield.", size=26, bold=True)
y = t(c, y, "Each card = real parametric", size=22)
y = t(c, y, "micro-insurance policy.", size=22)
y = t(c, y, "Wildfires. Flights.", size=22)
y = t(c, y, "Festivals. Pandemics.", size=22)
y -= 10
y = t(c, y, "That gold card?", size=22)
y = t(c, y, "Wireless Cancelled.", size=24, bold=True)
y = t(c, y, "300 USDC paid out April 7th.", size=22)
y = t(c, y, "No claim. No form.", size=22)
y = t(c, y, "Three seconds.", size=26, color=GREEN, bold=True)
y -= 12
y = t(c, y, "$5 pack. $300 payout.", size=24, bold=True)
y = t(c, y, "Where does the money come from?", size=22)

c.showPage(); new_page(c); y = H - 30*mm
y = t(c, y, "3. (continued)", size=20, color=GREEN, bold=True)
y -= 12
y = t(c, y, "Most cards never trigger.", size=22)
y = t(c, y, "55% of every pack goes to payout pool.", size=22)
y = t(c, y, "Triggers run 1 to 8 percent.", size=22)
y = t(c, y, "Thousands of expired cards", size=22)
y = t(c, y, "fund the few that fire.", size=22)
y -= 8
y = t(c, y, "Same math as insurance,", size=24, bold=True)
y = t(c, y, "different experience.", size=24, bold=True)
y -= 20
y = act(c, y, "CLICK Greece Wildfire card")

# 4. CARD DETAIL
c.showPage(); new_page(c); y = H - 30*mm
y = hdr(c, y, 4, "CARD DETAIL (1:15)")
y = t(c, y, "Scroll slowly", size=14, color=YELLOW)
y -= 10
y = t(c, y, "67% trigger probability.", size=24, bold=True)
y = t(c, y, "Ten years of fire data.", size=22)
y = t(c, y, "Seven of ten summers exceeded.", size=22)
y = t(c, y, "Oracle: EFFIS satellite. Binary.", size=22)
y -= 12
y = t(c, y, "Bonding curve pricing:", size=22)
y = t(c, y, "Wireless day 90, score 35:", size=22)
y = t(c, y, "premium 10 USDC.", size=22)
y = t(c, y, "Score hits 92: 59 USDC.", size=22)
y = t(c, y, "Day before: 233 USDC", size=22)
y = t(c, y, "for 300 payout.", size=22)
y -= 8
y = t(c, y, "Early: 3.5%. Late: 78%.", size=24, bold=True)
y = t(c, y, "Pool can't be drained.", size=24, bold=True)

c.showPage(); new_page(c); y = H - 30*mm
y = t(c, y, "4. (continued)", size=20, color=GREEN, bold=True)
y -= 12
y = t(c, y, "Tested on Solana smart contracts.", size=22)
y = t(c, y, "Core logic works.", size=22)
y = t(c, y, "Production needs security audits.", size=22)
y = t(c, y, "That's what funding is for.", size=24, bold=True)
y -= 10
y = t(c, y, "Twelve cards, real oracles,", size=22)
y = t(c, y, "working pricing engine.", size=22)
y = t(c, y, "We build fast.", size=24, bold=True)
y -= 20
y = act(c, y, "CLICK Events → Wireless")

# 5. WIRELESS
c.showPage(); new_page(c); y = H - 30*mm
y = hdr(c, y, 5, "WIRELESS EVENT (1:50)")
y -= 10
y = t(c, y, "Two revenue streams.", size=24, bold=True)
y = t(c, y, "Packs: 20%. Covers: 12%.", size=22)
y = t(c, y, "Secondary: 5% royalty.", size=22)
y -= 8
y = t(c, y, "10k packs + 10 events =", size=22)
y = t(c, y, "$1M+ annually.", size=24, bold=True)
y -= 8
y = t(c, y, "Organizer bonds: 2% of revenue.", size=22)
y = t(c, y, "Slashed on cancellation. On-chain.", size=22)
y -= 20
y = act(c, y, "SCROLL → CLICK Simulate")
y = t(c, y, "Wait ~3 seconds", size=16, color=YELLOW)

# 6. PAYOUT
c.showPage(); new_page(c); y = H - 30*mm
y = hdr(c, y, 6, "PAYOUT COMPLETE (2:15)")
y -= 10
y = t(c, y, "Polymarket: pure speculation.", size=22)
y = t(c, y, "War bets. Nuclear bets.", size=22)
y = t(c, y, "Congress banning it.", size=22)
y -= 10
y = t(c, y, "CrowdShield: structurally different.", size=24, bold=True)
y = t(c, y, "Parametric triggers. Verifiable data.", size=22)
y = t(c, y, "Satellite. Flights. Government.", size=22)
y = t(c, y, "Payout follows truth, not consensus.", size=22)
y -= 10
y = t(c, y, "Eliminates moral hazard.", size=22)
y = t(c, y, "Nobody profits from disaster.", size=22)
y = t(c, y, "World Bank validated across 30 countries.", size=22)

c.showPage(); new_page(c); y = H - 30*mm
y = t(c, y, "6. (continued)", size=20, color=GREEN, bold=True)
y -= 12
y = t(c, y, "Five actors: fans, organizers,", size=22)
y = t(c, y, "LPs, traders, collectors.", size=22)
y = t(c, y, "Every dominant strategy:", size=22)
y = t(c, y, "individually optimal AND", size=24, bold=True)
y = t(c, y, "collectively welfare-maximizing.", size=24, bold=True)
y = t(c, y, "Cooperation dominates.", size=22)
y -= 12
y = t(c, y, "5,400 Colosseum projects.", size=22)
y = t(c, y, "Zero in this intersection.", size=22)

# CLOSING
c.showPage(); new_page(c)
y = H - 80*mm
y = t(c, y, "SLOW DOWN", size=16, color=YELLOW)
y -= 20
y = t(c, y, "10.86 premium.", size=30, bold=True)
y = t(c, y, "300 payout.", size=30, bold=True)
y = t(c, y, "Three seconds.", size=34, color=GREEN, bold=True)
y = t(c, y, "No form. No waiting.", size=30, bold=True)
y -= 30
y = t(c, y, "PAUSE", size=16, color=YELLOW)
y -= 25
y = t(c, y, "CrowdShield.", size=38, color=GREEN, bold=True)
y = t(c, y, "Collect your shields.", size=34, bold=True)
y = t(c, y, "Protect against chaos.", size=34, bold=True)
y -= 40
y = t(c, y, "SILENCE — 3 SECONDS — DONE", size=16, color=YELLOW)

c.save()
print(f"PDF saved: {OUTPUT}")

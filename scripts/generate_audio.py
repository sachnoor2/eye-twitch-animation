import asyncio, edge_tts, os, subprocess
from pathlib import Path

VOICE_ID = "hi-IN-SureshNeural"
FPS, TOTAL_FRAMES = 60, 2700
AUDIO_DIR = Path("public/audio")
SEG_DIR = AUDIO_DIR / "segments"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)
SEG_DIR.mkdir(parents=True, exist_ok=True)

SCENES = [
    {"id":"s01","fs":10,"fe":180,"text":"Kya aapne notice kiya hai ki kabhi-kabhi aapki aankh achanak phadakne lagti hai?"},
    {"id":"s02","fs":210,"fe":480,"text":"Isse medical language mein Myokymia kehte hain. Ye aapki eyelid muscle ke involuntary contractions hote hain."},
    {"id":"s03","fs":510,"fe":850,"text":"Asal mein, hamari eyelid mein Orbicularis Oculi naam ki ek muscle hoti hai jo blink karne mein help karti hai."},
    {"id":"s04","fs":880,"fe":1200,"text":"Jab aap bohot zyada stressed hote hain ya aapki neend poori nahi hoti, toh aapki nerves over-excited ho jati hain."},
    {"id":"s05","fs":1230,"fe":1650,"text":"Ye nerves bina kisi reason ke muscles ko contract hone ka signal bhejne lagti hain."},
    {"id":"s06","fs":1680,"fe":2100,"text":"Isse muscle mein ek loop ban jata hai aur wo baar-baar phadakne lagti hai."},
    {"id":"s07","fs":2130,"fe":2280,"text":"Caffeine aur alcohol bhi nerves ko irritate karke isse badha sakte hain."},
    {"id":"s08","fs":2310,"fe":2550,"text":"Zyadatar cases mein ye harmless hai, lekin agar ye hafton tak chale toh doctor ko zaroor dikhayein!"},
    {"id":"s09","fs":2580,"fe":2690,"text":"Agle video ke liye subscribe karein."}
]

async def gen():
    v_dir = SEG_DIR / "Suresh"
    v_dir.mkdir(parents=True, exist_ok=True)
    for sc in SCENES:
        await edge_tts.Communicate(sc["text"], VOICE_ID).save(str(v_dir / f"{sc['id']}.mp3"))

def comb():
    v_dir = SEG_DIR / "Suresh"
    inputs, filter_parts, labels = [], [], []
    for idx, sc in enumerate(SCENES):
        start_ms = int(sc["fs"] / FPS * 1000)
        inputs += ["-i", str(v_dir / f"{sc['id']}.mp3")]
        filter_parts.append(f"[{idx}]adelay={start_ms}|{start_ms}[d{idx}]")
        labels.append(f"[d{idx}]")
    fc = ";".join(filter_parts) + ";" + "".join(labels) + f"amix=inputs={len(SCENES)}:normalize=0[out]"
    subprocess.run(["ffmpeg", "-y"] + inputs + ["-filter_complex", fc, "-map", "[out]", "-t", str(TOTAL_FRAMES/FPS), "-b:a", "192k", str(AUDIO_DIR / "narration_suresh.mp3")], check=True)

if __name__ == "__main__":
    asyncio.run(gen())
    comb()

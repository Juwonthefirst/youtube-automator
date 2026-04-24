import json, os, boto3
from faster_whisper import WhisperModel
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

s3 = boto3.client("s3")


def transcribe(file_path: str):
    model = WhisperModel("base", device="cpu", compute_type="int8")
    segments, info = model.transcribe(file_path)
    words = []
    for segment in segments:
        words.append(
            {"start": segment.start, "end": segment.end, "text": segment.text.strip()}
        )

    return words


def style_subtitles(transcript_segments):
    prompt = f"""
You are a subtitle styling AI for viral boondocks Shorts.

For each subtitle segment, return JSON with:
- text
- style (choose: normal, big, shout, funny, dramatic)
- highlight_words (optional list)

Segments:
{json.dumps(transcript_segments, indent=2)}

Return ONLY JSON array
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini", messages=[{"role": "user", "content": prompt}]
    )

    return json.loads(response.choices[0].message.content)


def generate_ass(subs, output_file_path):
    header = """[Script Info]
ScriptType: v4.00+

[V4+ Styles]
Format: Name, FontName, Fontsize, PrimaryColour, OutlineColour, BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,60,&H00FFFFFF,&H00000000,&H64000000,1,0,1,3,2,2,10,10,30,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

    def style_map(style):
        match (style):
            case "big":
                return "{\\fs80\\b1\\c&H00FFFF&\\bord4}"
            case "shout":
                return "{\\fs90\\b1\\c&H0000FF&\\bord5}"
            case "funny":
                return "{\\fs60\\c&H00FF00&\\bord3}"
            case "dramatic":
                return "{\\fs70\\c&HFFFFFF&\\bord6}"
            case _:
                return "{\\fs50\\c&HFFFFFF&\\bord2}"

    def to_time(t):
        h = int(t // 3600)
        m = int((t % 3600) // 60)
        s = int(t % 60)
        cs = int((t - int(t)) * 100)
        return f"{h}:{m:02}:{s:02}.{cs:02}"

    lines = [header]

    for s in subs:
        start = to_time(s["start"])
        end = to_time(s["end"])
        style = style_map(s.get("style", "normal"))
        text = s["text"].replace("{", "").replace("}", "")
        lines.append(f"Dialogue: 0,{start},{end},Default,,0,0,0,,{style}{text}\n")

    with open(output_file_path, "w", encoding="utf-8") as f:
        f.writelines(lines)

    return output_file_path


def lambda_handler(event, context):
    Key = ""
    bucket_name = ""
    input_file_path = f"/tmp/{Key}"
    try:
        s3.download_file(Bucket=bucket_name, Key=Key, Filename=input_file_path)

    except Exception as err:
        pass

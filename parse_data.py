import re
import json

# Ingredient Mapping
ingredient_map = {
    "Fancy Apple": "특선사과",
    "Honey": "달콤한꿀",
    "Snoozy Tomato": "숙면토마토",
    "Soft Potato": "따끈따끈감자",
    "Bean Sausage": "콩고기",
    "Warming Ginger": "따뜻한생강",
    "Fiery Herb": "불맛허브",
    "Moomoo Milk": "튼튼밀크",
    "Soothing Cacao": "릴랙스카카오",
    "Greengrass Soybeans": "연둣빛대두",
    "Large Leek": "굵은대파",
    "Tasty Mushroom": "풍미버섯",
    "Fancy Egg": "특선에그",
    "Pure Oil": "퓨어오일",
    "Greengrass Corn": "연둣빛옥수수",
    "Slowpoke Tail": "맛있는꼬리",
    "Rousing Coffee": "각성원두",
    "Glossy Avocado": "윤기아보카도",
    "Plump Pumpkin": "통통호박"
}

# Pokemon Name Mapping
pokemon_name_map = {
    "Bulbasaur": "이상해씨", "Ivysaur": "이상해풀", "Venusaur": "이상해꽃",
    "Charmander": "파이리", "Charmeleon": "리자드", "Charizard": "리자몽",
    "Squirtle": "꼬부기", "Wartortle": "어니부기", "Blastoise": "거북왕",
    "Caterpie": "캐터피", "Metapod": "단데기", "Butterfree": "버터플",
    "Rattata": "꼬렛", "Raticate": "레트라",
    "Ekans": "아보", "Arbok": "아보크",
    "Pikachu": "피카츄", "Pikachu (Halloween)": "피카츄(할로윈)", "Pikachu (Holiday)": "피카츄(홀리데이)",
    "Raichu": "라이츄",
    "Clefairy": "삐삐", "Clefable": "픽시",
    "Vulpix": "식스테일", "Alolan Vulpix": "식스테일(알로라의 모습)",
    "Ninetales": "나인테일", "Alolan Ninetales": "나인테일(알로라의 모습)",
    "Jigglypuff": "푸린", "Wigglytuff": "푸크린",
    "Diglett": "디그다", "Dugtrio": "닥트리오",
    "Meowth": "나옹", "Persian": "페르시온",
    "Psyduck": "고라파덕", "Golduck": "골덕",
    "Mankey": "망키", "Primeape": "성원숭",
    "Growlithe": "가디", "Arcanine": "윈디",
    "Bellsprout": "모다피", "Weepinbell": "우츠동", "Victreebel": "우츠보트",
    "Geodude": "꼬마돌", "Graveler": "데구리", "Golem": "딱구리",
    "Slowpoke": "야돈", "Slowbro": "야도란",
    "Magnemite": "코일", "Magneton": "레어코일",
    "Farfetch'd": "파오리",
    "Doduo": "두두", "Dodrio": "두트리오",
    "Gastly": "고오스", "Haunter": "고우스트", "Gengar": "팬텀",
    "Onix": "롱스톤",
    "Cubone": "탕구리", "Marowak": "텅구리",
    "Chansey": "럭키", "Kangaskhan": "캥카",
    "Mr. Mime": "마임맨", "Pinsir": "쁘사이저",
    "Ditto": "메타몽",
    "Eevee": "이브이", "Eevee (Holiday)": "이브이(홀리데이)", "Eevee (Halloween)": "이브이(할로윈)",
    "Vaporeon": "샤미드", "Jolteon": "쥬피썬더", "Flareon": "부스터",
    "Dratini": "미뇽", "Dragonair": "신뇽", "Dragonite": "망나뇽",
    "Chikorita": "치코리타", "Bayleef": "베이리프", "Meganium": "메가니움",
    "Cyndaquil": "브케인", "Quilava": "마그케인", "Typhlosion": "블레이범",
    "Totodile": "리아코", "Croconaw": "엘리게이", "Feraligatr": "장크로다일",
    "Pichu": "피츄", "Cleffa": "삐", "Igglybuff": "푸푸린",
    "Togepi": "토게피", "Togetic": "토게틱",
    "Natu": "네이티", "Xatu": "네이티오",
    "Mareep": "메리프", "Flaaffy": "보송송", "Ampharos": "전룡",
    "Sudowoodo": "꼬지모",
    "Wooper": "우파", "Paldean Wooper": "우파(팔데아의 모습)", "Quagsire": "누오",
    "Espeon": "에브이", "Umbreon": "블래키", "Murkrow": "니로우",
    "Slowking": "야도킹", "Wobbuffet": "마자용", "Steelix": "강철톤",
    "Heracross": "헤라크로스", "Sneasel": "포푸니", "Delibird": "딜리버드",
    "Houndour": "델빌", "Houndoom": "헬가",
    "Blissey": "해피너스",
    "Raikou": "라이코", "Entei": "앤테이", "Suicune": "스이쿤",
    "Larvitar": "애버라스", "Pupitar": "데기라스", "Tyranitar": "마기라스",
    "Treecko": "나무지기", "Grovyle": "나무돌이", "Sceptile": "나무킹",
    "Torchic": "아차모", "Combusken": "영치코", "Blaziken": "번치코",
    "Mudkip": "물짱이", "Marshtomp": "늪짱이", "Swampert": "대짱이",
    "Ralts": "랄토스", "Kirlia": "킬리아", "Gardevoir": "가디안",
    "Slakoth": "게을로", "Vigoroth": "발바로", "Slaking": "게을킹",
    "Sableye": "깜까미", "Mawile": "입치트",
    "Aron": "가보리", "Lairon": "갱도라", "Aggron": "보스로라",
    "Plusle": "플러시", "Minun": "마이농",
    "Gulpin": "꼴깍몬", "Swalot": "꿀꺽몬",
    "Trapinch": "톱치", "Vibrava": "비브라바", "Flygon": "플라이곤",
    "Swablu": "파비코", "Altaria": "파비코리",
    "Shuppet": "어둠대신", "Banette": "다크펫",
    "Absol": "앱솔", "Wynaut": "마자",
    "Spheal": "대굴레오", "Sealeo": "씨레오", "Walrein": "씨카이저",
    "Bagon": "아기공", "Shelgon": "쉘곤", "Salamence": "보만다",
    "Shinx": "꼬링크", "Luxio": "럭시오", "Luxray": "렌트라",
    "Drifloon": "흔들풍손", "Drifblim": "둥실라이드",
    "Honchkrow": "돈크로우", "Bonsly": "꼬지지", "Mime Jr.": "흉내내", "Happiny": "핑복",
    "Riolu": "리오르", "Lucario": "루카리오",
    "Croagunk": "삐딱구리", "Toxicroak": "독개굴",
    "Snover": "눈쓰개", "Abomasnow": "눈설왕",
    "Weavile": "포푸니라", "Magnezone": "자포코일",
    "Togekiss": "토게키스",
    "Leafeon": "리피아", "Glaceon": "글레이시아",
    "Gallade": "엘레이드", "Cresselia": "크레세리아", "Darkrai": "다크라이",
    "Munna": "몽나", "Musharna": "몽얌나",
    "Dwebble": "돌살이", "Crustle": "암팰리스",
    "Rufflet": "수리둥보", "Braviary": "워글",
    "Sylveon": "님피아", "Dedenne": "데덴네",
    "Pumpkaboo": "호바귀", "Gourgeist": "펌킨인",
    "Grubbin": "턱지충이", "Charjabug": "전지충이", "Vikavolt": "투구뿌논",
    "Stufful": "포곰곰", "Bewear": "이븐곰", "Comfey": "큐아링",
    "Mimikyu": "따라큐", "Cramorant": "윽우지",
    "Toxel": "일레즌",
    "Toxtricity (Amped Form)": "스트린더(하이한 모습)", "Toxtricity (Low Key Form)": "스트린더(로우한 모습)",
    "Sprigatito": "나오하", "Floragato": "나로테", "Meowscarada": "마스카나",
    "Fuecoco": "뜨아거", "Crocalor": "악뜨거", "Skeledirge": "라우드본",
    "Quaxly": "꾸왁스", "Quaxwell": "아꾸왁", "Quaquaval": "웨이니발",
    "Pawmi": "빠모", "Pawmo": "빠모트", "Pawmot": "빠르모트",
    "Clodsire": "토오"
}

pokemons = []
pokemon_ingredients = []

with open('/Users/changsu/Projects/toothbrush-tracker/user_input.txt', 'r') as f:
    content = f.read()

# Split by ID at the start of the line
entries = re.split(r'\n(?=\d+\.?\d*\t)', content)

for entry in entries:
    if not entry.strip():
        continue
    
    lines = entry.strip().split('\n')
    header = lines[0]
    
    # Extract ID and Name
    # Format: 1	Pokemon Sleep - BulbasaurBulbasaur
    # Or: 25.1	Pokemon Sleep - Pikachu (Halloween)Pikachu (Halloween)
    match = re.match(r'(\d+\.?\d*)\tPokemon Sleep - (.+?)\2', header)
    if not match:
        # Try looser match if the duplication isn't perfect
        match = re.match(r'(\d+\.?\d*)\tPokemon Sleep - (.+)', header)
    
    if match:
        p_id = match.group(1)
        # Clean up name: remove repeated part if present
        raw_name = match.group(2)
        # Heuristic: if the name ends with the same string as it starts with, cut it
        # But some names might be short.
        # Looking at input: "BulbasaurBulbasaur" -> "Bulbasaur"
        # "Pikachu (Halloween)Pikachu (Halloween)" -> "Pikachu (Halloween)"
        
        # Find the midpoint where the string repeats
        name = raw_name
        for i in range(1, len(raw_name)//2 + 1):
            if raw_name[:i] == raw_name[i:2*i] and 2*i == len(raw_name):
                name = raw_name[:i]
                break
        
        # Handle decimal IDs for variants
        # If ID has decimal, it's a variant.
        # But for JSON, maybe we keep string ID or number?
        # The user asked for "pokemons.csv" to be converted to JSON.
        # Existing CSV had numeric IDs.
        # Let's keep ID as number if possible, or string if decimal.
        # Actually, let's use the ID from the input.
        
        korean_name = pokemon_name_map.get(name, name)
        
        # Handle Pumpkaboo/Gourgeist sizes
        if p_id.startswith("710."):
            if p_id == "710.1": korean_name = "호바귀(작은 사이즈)"
            elif p_id == "710.2": korean_name = "호바귀(큰 사이즈)"
            elif p_id == "710.3": korean_name = "호바귀(특대 사이즈)"
        elif p_id.startswith("711."):
            if p_id == "711.1": korean_name = "펌킨인(작은 사이즈)"
            elif p_id == "711.2": korean_name = "펌킨인(큰 사이즈)"
            elif p_id == "711.3": korean_name = "펌킨인(특대 사이즈)"

        pokemons.append({
            "id": float(p_id) if '.' in p_id else int(p_id),
            "name": korean_name
        })
        
        # Extract Ingredients
        # Look for line starting with "Ingredients", "Berries", "Skills", "All"
        # Then the next line contains the ingredients string
        # Example: "Durin Berry x1 | HoneySnoozy TomatoSoft Potato"
        
        ing_line = ""
        for i, line in enumerate(lines):
            if line.strip() in ["Ingredients", "Berries", "Skills", "All"] and i + 1 < len(lines):
                ing_line = lines[i+1]
                break
        
        if ing_line:
            # Extract ingredients after "|"
            parts = ing_line.split('|')
            if len(parts) > 1:
                ing_part = parts[1]
                
                # Find all ingredients present in the string
                found_ingredients = []
                for eng, kor in ingredient_map.items():
                    if eng in ing_part:
                        found_ingredients.append(kor)
                
                # TBD check
                if "TBD" in ing_part:
                    pass # Or handle TBD
                
                if found_ingredients:
                    pokemon_ingredients.append({
                        "pokemon": korean_name,
                        "ingredients": found_ingredients
                    })

# Write to JSON files
with open('/Users/changsu/Projects/toothbrush-tracker/public/data/pokemons.json', 'w', encoding='utf-8') as f:
    json.dump(pokemons, f, ensure_ascii=False, indent=2)

with open('/Users/changsu/Projects/toothbrush-tracker/public/data/pokemon_ingredients.json', 'w', encoding='utf-8') as f:
    json.dump(pokemon_ingredients, f, ensure_ascii=False, indent=2)

print("JSON files generated successfully.")

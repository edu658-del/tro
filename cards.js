/**
 * [cards.js]
 * 22장의 메이저 아르카나 타로 카드 데이터 모음입니다.
 * 초보자분들도 이해하기 쉽도록 카드별 한국어 이름, 의미, 수비학 번호, 대표 상징 아이콘을 포함하고 있습니다.
 */

// 22장 메이저 아르카나 타로 카드 데이터 정의
const TAROT_CARDS = [
  {
    id: 0,
    number: "0",
    name: "바보 (The Fool)",
    keyword: "새로운 시작, 모험, 순수함, 자유",
    element: "공기",
    icon: "🌟",
    description: "새로운 여정의 시작과 무한한 가능성, 두려움 없는 도전을 상징합니다."
  },
  {
    id: 1,
    number: "I",
    name: "마법사 (The Magician)",
    keyword: "창조력, 잠재력, 기술, 자신감",
    element: "수성",
    icon: "🪄",
    description: "자신의 능력을 활용하여 원하는 것을 현실로 만들어내는 강력한 창조의 기운입니다."
  },
  {
    id: 2,
    number: "II",
    name: "고위 여사제 (The High Priestess)",
    keyword: "직관, 지혜, 비밀, 통찰력",
    element: "달",
    icon: "🌙",
    description: "내면의 목소리와 직관에 귀를 기울여 조용히 지혜를 얻을 때임을 알려줍니다."
  },
  {
    id: 3,
    number: "III",
    name: "여황제 (The Empress)",
    keyword: "풍요, 풍요로움, 풍성한 결실, 모성",
    element: "금성",
    icon: "👑",
    description: "자연의 풍요로움과 따뜻한 결실, 창의적인 에너지와 풍족한 보상을 뜻합니다."
  },
  {
    id: 4,
    number: "IV",
    name: "황제 (The Emperor)",
    keyword: "권위, 리더십, 질서, 안정",
    element: "양자리",
    icon: "🏛️",
    description: "확고한 체계와 리더십으로 상황을 통제하고 안정된 기반을 다지는 힘을 의미합니다."
  },
  {
    id: 5,
    number: "V",
    name: "교황 (The Hierophant)",
    keyword: "전통, 가르침, 조언, 조화",
    element: "황소자리",
    icon: "📜",
    description: "지혜로운 스승의 조언을 듣거나 신뢰받는 규칙과 가치관을 따르는 것이 좋습니다."
  },
  {
    id: 6,
    number: "VI",
    name: "연인 (The Lovers)",
    keyword: "사랑, 선택, 조화, 파트너십",
    element: "쌍둥이자리",
    icon: "💖",
    description: "아름다운 관계와 인연, 그리고 올바른 가치관에 따른 중요한 선택을 상징합니다."
  },
  {
    id: 7,
    number: "VII",
    name: "전차 (The Chariot)",
    keyword: "전진, 승리, 의지력, 극복",
    element: "게자리",
    icon: "🛞",
    description: "강한 의지와 집중력으로 장애물을 극복하고 목표를 향해 당당히 나아가는 승리입니다."
  },
  {
    id: 8,
    number: "VIII",
    name: "힘 (Strength)",
    keyword: "용기, 인내, 부드러운 힘, 자신감",
    element: "사자자리",
    icon: "🦁",
    description: "외유내강의 마음으로 시련을 부드럽게 다스리고, 내면의 강인한 용기를 발휘합니다."
  },
  {
    id: 9,
    number: "IX",
    name: "은둔자 (The Hermit)",
    keyword: "성찰, 내면의 탐구, 신중함, 성숙",
    element: "처녀자리",
    icon: "🕯️",
    description: "외부의 소음에서 벗어나 스스로를 돌아보며 진정한 지혜의 등불을 밝히는 시간입니다."
  },
  {
    id: 10,
    number: "X",
    name: "운명의 수레바퀴 (Wheel of Fortune)",
    keyword: "변화, 운명, 행운, 행운의 전환점",
    element: "목성",
    icon: "🎡",
    description: "운명의 긍정적인 변화와 기회가 찾아오고 있음을 알려주는 긍정의 신호입니다."
  },
  {
    id: 11,
    number: "XI",
    name: "정의 (Justice)",
    keyword: "공정, 균형, 합리적 판단, 진실",
    element: "천칭자리",
    icon: "⚖️",
    description: "감정에 치우치지 않고 객관적이고 공정한 눈으로 올바른 결정을 내림을 의미합니다."
  },
  {
    id: 12,
    number: "XII",
    name: "매달린 사람 (The Hanged Man)",
    keyword: "수용, 관점의 전환, 기다림, 헌신",
    element: "해왕성",
    icon: "🦇",
    description: "잠시 멈추어 세상을 다른 각도에서 바라볼 때 뜻밖의 통찰과 깨달음을 얻습니다."
  },
  {
    id: 13,
    number: "XIII",
    name: "죽음 (Death)",
    keyword: "끝과 새로운 시작, 변혁, 탈바꿈",
    element: "전갈자리",
    icon: "🦋",
    description: "묵은 과거를 훌훌 털어내고 새로운 삶과 시작을 맞이하는 긍정적인 탈바꿈입니다."
  },
  {
    id: 14,
    number: "XIV",
    name: "절제 (Temperance)",
    keyword: "조화, 절제, 평정심, 순응",
    element: "사수자리",
    icon: "🏺",
    description: "치우치지 않는 절제와 인내로 마음의 평화를 유지하고 조화로운 균형을 이룹니다."
  },
  {
    id: 15,
    number: "XV",
    name: "악마 (The Devil)",
    keyword: "집착, 유혹, 물질적 욕망, 주의",
    element: "염소자리",
    icon: "🔮",
    description: "나를 구속하는 나쁜 습관이나 과도한 집착에서 벗어나 자유로워질 필요가 있습니다."
  },
  {
    id: 16,
    number: "XVI",
    name: "탑 (The Tower)",
    keyword: "갑작스러운 깨달음, 변화, 해방",
    element: "화성",
    icon: "⚡",
    description: "잘못된 틀이 깨어지고 새로운 진실이 드러나며 더 튼튼한 기반을 다지게 됩니다."
  },
  {
    id: 17,
    number: "XVII",
    name: "별 (The Star)",
    keyword: "희망, 영감, 치유, 평화",
    element: "물병자리",
    icon: "⭐",
    description: "어둠 속에서 환하게 빛나는 희망의 별처럼, 마음이 치유되고 새로운 꿈이 피어납니다."
  },
  {
    id: 18,
    number: "XVIII",
    name: "달 (The Moon)",
    keyword: "상상력, 무의식, 신비, 불확실성",
    element: "물고기자리",
    icon: "🌕",
    description: "마음속의 막연한 불안을 넘어서 내면의 신비로운 지혜와 상상력을 발견할 때입니다."
  },
  {
    id: 19,
    number: "XIX",
    name: "태양 (The Sun)",
    keyword: "기쁨, 성공, 활력, 명확함",
    element: "태양",
    icon: "☀️",
    description: "밝은 햇살처럼 찬란한 성공과 기쁨, 활력이 삶을 따뜻하게 가득 채워줍니다."
  },
  {
    id: 20,
    number: "XX",
    name: "심판 (Judgement)",
    keyword: "부활, 새로운 결단, 소명, 용서",
    element: "명왕성",
    icon: "🎺",
    description: "지나간 일들에 대한 보상과 함께, 새로운 명확한 길을 선택할 부름을 받습니다."
  },
  {
    id: 21,
    number: "XXI",
    name: "세계 (The World)",
    keyword: "완성, 성취, 조화, 만족",
    element: "토성",
    icon: "🌍",
    description: "하나의 커다란 주기가 완벽하게 마무리되고, 완전한 성취와 기쁨을 누리는 단계입니다."
  }
];

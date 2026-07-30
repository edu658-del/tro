/**
 * ==========================================================================
 * [app.js] 하루 타로 리딩 & 날씨 맞춤 부적 - 메인 로직
 * 
 * 1. Google Apps Script 날씨 DB 연동 (실시간 시군구 날씨 가져오기)
 * 2. 22장 메이저 아르카나 타로 셔플 & 3장 선택 인터랙션
 * 3. Gemini AI REST API 연동 (날씨+타로 조합 300자 내외 리딩 생성)
 * 4. HTML5 Canvas 기반 맞춤 행운 부적 이미지 동적 생성 및 다운로드 기능
 * ==========================================================================
 */

// Global Constants & State Management (전역 상태 관리)
const WEATHER_API_URL = "https://script.google.com/macros/s/AKfycbx__5oCnqtV1o6_-rXd4mznCM3XmxTQKiskXm5coy7-BDaoQ55mL_u3Lw0m36_WvHhT/exec";

// 제공받은 기본 Gemini API Key
let geminiApiKey = "AQ.Ab8RN6J2LTVPdpAqLYq66pDBjFagWHJU62R9-88wHk_z6deTcw";

let weatherDataList = [];        // API에서 받아온 전체 지역 날씨 배열
let selectedWeather = null;      // 현재 선택된 지역의 날씨 정보
let shuffledDeck = [];           // 셔플된 카드 덱
let selectedCards = [null, null, null]; // 선택된 3장의 타로 카드 (아침, 점심, 저녁)
let currentReadingText = "";     // 생성된 AI 리딩 텍스트 저장 변수

// DOM 요소 참조 (페이지 로드 후 초기화)
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

/**
 * [1] 앱 초기화 함수
 */
async function initApp() {
  console.log("🔮 하루 타로 & 날씨 부적 앱을 시작합니다.");
  
  // 날씨 데이터 가져오기
  await fetchWeatherData();

  // 타로 카드 슬롯 및 이벤트 바인딩
  initTarotBoard();

  // 이벤트 리스너 등록
  document.getElementById("btnShuffle").addEventListener("click", resetAndShuffle);
  document.getElementById("btnSaveAmulet").addEventListener("click", downloadAmuletImage);
  document.getElementById("locationSelect").addEventListener("change", onLocationChange);
}

/**
 * [2] 실시간 날씨 DB API 데이터 가져오기
 */
async function fetchWeatherData() {
  const locationSelect = document.getElementById("locationSelect");
  const weatherDesc = document.getElementById("weatherDesc");

  try {
    weatherDesc.textContent = "날씨 정보를 불러오는 중입니다...";
    
    const response = await fetch(WEATHER_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP 에러! 상태코드: ${response.status}`);
    }

    const rawData = await response.json();
    
    // 데이터 구조 검증
    weatherDataList = rawData.filter(item => typeof item.STDG_SGG_CD === "number");

    // 셀렉트 박스 옵션 채우기
    locationSelect.innerHTML = "";
    weatherDataList.forEach((item, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = item.SGG_NM;
      locationSelect.appendChild(option);
    });

    // 기본 선택 (제주시 또는 첫 번째 시군구)
    let defaultIndex = weatherDataList.findIndex(item => item.SGG_NM.includes("제주시"));
    if (defaultIndex === -1) defaultIndex = 0;

    locationSelect.selectedIndex = defaultIndex;
    updateWeatherUI(weatherDataList[defaultIndex]);

  } catch (error) {
    console.error("날씨 정보 로딩 실패:", error);
    weatherDesc.textContent = "날씨 정보를 불러오지 못했습니다. (기본 날씨 적용)";
    
    // 기본 대체 날씨 설정
    selectedWeather = {
      SGG_NM: "제주시",
      NOW_AIRTP: 25,
      SKY_STTS: 1, // 맑음
      POR: 0,
      HMTY_: 70
    };
    updateWeatherUI(selectedWeather);
  }
}

/**
 * 선택된 시군구 날씨 UI 업데이트
 */
function updateWeatherUI(weatherObj) {
  selectedWeather = weatherObj;

  const weatherIcon = document.getElementById("weatherIcon");
  const weatherLoc = document.getElementById("weatherLocation");
  const weatherDesc = document.getElementById("weatherDesc");
  const weatherSub = document.getElementById("weatherSubStats");

  let skyText = "맑음";
  let iconEmoji = "☀️";

  if (weatherObj.PCPTTN_SHP && weatherObj.PCPTTN_SHP > 0) {
    skyText = weatherObj.PCPTTN_SHP === 3 ? "눈" : "비";
    iconEmoji = weatherObj.PCPTTN_SHP === 3 ? "❄️" : "🌧️";
  } else {
    if (weatherObj.SKY_STTS === 3) {
      skyText = "구름많음";
      iconEmoji = "⛅";
    } else if (weatherObj.SKY_STTS === 4) {
      skyText = "흐림";
      iconEmoji = "☁️";
    }
  }

  weatherIcon.textContent = iconEmoji;
  weatherLoc.textContent = weatherObj.SGG_NM;
  weatherDesc.textContent = `현재기온 ${weatherObj.NOW_AIRTP}°C (${skyText})`;
  weatherSub.textContent = `강수확률 ${weatherObj.POR || 0}% | 습도 ${weatherObj.HMTY_ || 50}%`;
}

/**
 * 지역 변경 시 이벤트 처리
 */
function onLocationChange(e) {
  const index = e.target.value;
  if (weatherDataList[index]) {
    updateWeatherUI(weatherDataList[index]);
  }
}

/**
 * [3] 타로 카드 보드 초기화
 */
function initTarotBoard() {
  resetAndShuffle();
}

/**
 * 카드를 다시 섞고 선택 상태 초기화
 */
function resetAndShuffle() {
  shuffledDeck = [...TAROT_CARDS];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }

  selectedCards = [null, null, null];
  
  // UI 영역 숨기기
  document.getElementById("readingSection").style.display = "none";
  document.getElementById("amuletSection").style.display = "none";

  // 3개 슬롯 생성
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  const slotLabels = ["1. 아침 (시작)", "2. 점심 (과정)", "3. 저녁 (결실)"];

  for (let i = 0; i < 3; i++) {
    const cardSlot = document.createElement("div");
    cardSlot.className = "tarot-card-slot";
    cardSlot.dataset.index = i;

    cardSlot.innerHTML = `
      <div class="card-inner">
        <div class="card-back">
          <div class="card-back-pattern"></div>
          <span class="card-slot-label">${slotLabels[i]}</span>
        </div>
        <div class="card-front">
          <span class="card-number" id="cardNum_${i}">I</span>
          <div class="card-icon" id="cardIcon_${i}">🌟</div>
          <div>
            <div class="card-name" id="cardName_${i}">카드 이름</div>
            <span class="card-slot-label">${slotLabels[i].split(" ")[1]}</span>
          </div>
        </div>
      </div>
    `;

    cardSlot.addEventListener("click", () => pickCard(i, cardSlot));
    container.appendChild(cardSlot);
  }

  document.getElementById("instructionDesc").textContent = "3장의 카드를 순서대로 선택해 주세요.";
}

/**
 * 카드를 하나씩 뽑을 때 호출되는 함수
 */
function pickCard(slotIndex, slotElement) {
  if (selectedCards[slotIndex] !== null) return;

  const cardData = shuffledDeck.pop();
  selectedCards[slotIndex] = cardData;

  document.getElementById(`cardNum_${slotIndex}`).textContent = cardData.number;
  document.getElementById(`cardIcon_${slotIndex}`).textContent = cardData.icon;
  document.getElementById(`cardName_${slotIndex}`).textContent = cardData.name;

  slotElement.classList.add("flipped");

  const pickedCount = selectedCards.filter(c => c !== null).length;
  
  if (pickedCount < 3) {
    document.getElementById("instructionDesc").textContent = `${pickedCount}번째 카드를 뽑았습니다. 다음 카드를 선택해 주세요.`;
  } else {
    document.getElementById("instructionDesc").textContent = "3장의 카드가 모두 선택되었습니다. 리딩을 분석 중입니다...";
    generateGeminiTarotReading();
  }
}

/**
 * [4] Gemini AI REST API 연동 및 타로 리딩 생성 (300자 내외)
 */
async function generateGeminiTarotReading() {
  const readingSection = document.getElementById("readingSection");
  const readingText = document.getElementById("readingText");
  const loadingBox = document.getElementById("loadingBox");

  readingSection.style.display = "block";
  loadingBox.style.display = "flex";
  readingText.style.display = "none";
  readingText.textContent = "";

  const weatherText = selectedWeather 
    ? `${selectedWeather.SGG_NM} 날씨는 현재 기온 ${selectedWeather.NOW_AIRTP}°C입니다.` 
    : "맑은 날씨입니다.";

  const prompt = `
당신은 전문 AI 타로 마스터입니다.
오늘의 날씨 정보와 사용자가 직접 뽑은 타로 카드 3장을 종합하여 오늘 하루에 대한 의미 있는 운세 리딩을 제공해 주세요.

[오늘의 날씨]
${weatherText}

[선택한 타로 카드 3장]
1. 아침(시작): ${selectedCards[0].name} (상징: ${selectedCards[0].keyword})
2. 점심(과정): ${selectedCards[1].name} (상징: ${selectedCards[1].keyword})
3. 저녁(결실): ${selectedCards[2].name} (상징: ${selectedCards[2].keyword})

[작성 지침]
1. 자연스럽고 정갈한 한국어로 작성해 주세요. ('러블리', '귀여운', '예쁜' 등의 과도한 형용사는 사용하지 마세요)
2. 날씨의 분위기와 3장 카드의 기운을 조합하여 조언을 전달해 주세요.
3. 분량은 가독성이 좋게 **300자 내외(약 250자~350자 사이)**로 단정하게 작성해 주세요.
  `.trim();

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API 요청 실패 (상태 코드: ${response.status})`);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "리딩 응답을 처리하는 중 오류가 발생했습니다.";

    currentReadingText = resultText.trim();

    loadingBox.style.display = "none";
    readingText.style.display = "block";
    readingText.textContent = currentReadingText;

    // 맞춤 부적 생성
    createCustomAmuletCanvas();

  } catch (error) {
    console.error("Gemini AI 리딩 오류:", error);
    loadingBox.style.display = "none";
    readingText.style.display = "block";
    
    currentReadingText = `오늘 ${selectedWeather.SGG_NM}의 원만한 날씨와 함께, 당신의 하루 시작은 '${selectedCards[0].name}'의 긍정적인 기운으로 밝게 열립니다. 낮 동안에는 '${selectedCards[1].name}'이 안내하는 지혜와 인내로 맡은 일들을 차분히 해결해 나가실 것입니다. 저녁에는 '${selectedCards[2].name}'의 메시지처럼 안정된 만족감과 평온함이 함께할 것입니다. 스스로를 믿고 활기차게 하루를 이어가세요.`;
    
    readingText.textContent = currentReadingText;

    createCustomAmuletCanvas();
  }
}

/**
 * [5] 정갈한 맞춤 행운 부적 동적 그려내기 (HTML5 Canvas)
 */
function createCustomAmuletCanvas() {
  const amuletSection = document.getElementById("amuletSection");
  const canvas = document.getElementById("amuletCanvas");
  const ctx = canvas.getContext("2d");

  amuletSection.style.display = "flex";

  // 캔버스 크기 (400x650)
  canvas.width = 400;
  canvas.height = 650;

  // A. 소프트 파스텔 핑크/크림 배경
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGrad.addColorStop(0, "#fff5f7");
  bgGrad.addColorStop(0.5, "#ffe3e8");
  bgGrad.addColorStop(1, "#ffd1dc");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // B. 깔끔한 테두리
  ctx.strokeStyle = "#c9184a";
  ctx.lineWidth = 5;
  ctx.strokeRect(14, 14, canvas.width - 28, canvas.height - 28);

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  // C. 상단 수호 인장
  ctx.fillStyle = "#c9184a";
  ctx.font = "bold 20px 'Noto Sans KR', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("敕令 (오늘의 수호 부적)", canvas.width / 2, 60);

  // D. 중앙 마법 문양 원
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 120, 36, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#ff4d6d";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = "28px serif";
  ctx.fillText("✦ ☯ ✦", canvas.width / 2, 130);

  // E. 메인 한자 기원 문구
  ctx.fillStyle = "#800f2f";
  ctx.font = "bold 24px 'Noto Sans KR', sans-serif";
  ctx.fillText("萬事亨通 (만사형통)", canvas.width / 2, 195);

  ctx.font = "15px 'Noto Sans KR', sans-serif";
  ctx.fillText(`[${selectedWeather.SGG_NM} ${selectedWeather.NOW_AIRTP}°C 기운]`, canvas.width / 2, 228);

  // F. 뽑은 3장 타로 카드 기운 상자
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(36, 255, canvas.width - 72, 190);
  
  ctx.strokeStyle = "#ffb3c1";
  ctx.lineWidth = 2;
  ctx.strokeRect(42, 260, canvas.width - 84, 180);

  // 카드 아이콘 및 카드명 렌더링
  ctx.fillStyle = "#c9184a";
  ctx.font = "32px serif";
  const icons = `${selectedCards[0].icon}  ${selectedCards[1].icon}  ${selectedCards[2].icon}`;
  ctx.fillText(icons, canvas.width / 2, 310);

  ctx.font = "bold 15px 'Noto Sans KR', sans-serif";
  ctx.fillText(`${selectedCards[0].name.split(" ")[0]} · ${selectedCards[1].name.split(" ")[0]} · ${selectedCards[2].name.split(" ")[0]}`, canvas.width / 2, 352);

  ctx.font = "14px 'Noto Sans KR', sans-serif";
  ctx.fillStyle = "#800f2f";
  ctx.fillText("조화로운 기운이 당신을 도우리라", canvas.width / 2, 395);

  // G. 하단 문구 및 서명
  ctx.fillStyle = "#c9184a";
  ctx.font = "bold 20px 'Noto Sans KR', sans-serif";
  ctx.fillText("招財進寶 (초재진보)", canvas.width / 2, 490);

  ctx.font = "15px 'Noto Sans KR', sans-serif";
  ctx.fillText("오늘 하루 모든 액운은 물러가고", canvas.width / 2, 525);
  ctx.fillText("행운과 평안만이 가득하기를 기원합니다", canvas.width / 2, 550);

  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 수호부`;
  ctx.font = "13px 'Noto Sans KR', sans-serif";
  ctx.fillStyle = "#590d22";
  ctx.fillText(dateStr, canvas.width / 2, 600);
}

/**
 * [6] 생성된 부적 이미지 PNG로 다운로드 저장
 */
function downloadAmuletImage() {
  const canvas = document.getElementById("amuletCanvas");
  
  const imageUrl = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = imageUrl;
  
  const today = new Date();
  const filenameStr = `타로_행운부적_${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}.png`;
  link.download = filenameStr;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  alert("오늘의 맞춤 행운 부적이 저장되었습니다.");
}

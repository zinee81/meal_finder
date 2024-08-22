const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const categoryButton = document.getElementById("category-button");
const category = document.getElementById("category");
const resultsDiv = document.getElementById("results");
const popup = document.getElementById("popup");
const mealTitle = document.getElementById("meal-title");
const mealImage = document.getElementById("meal-image");
const mealIngredient = document.getElementById("meal-ingredient");
const mealDescription = document.getElementById("meal-description");
const closeButton = document.querySelector(".close-button");

// query값을 검색하여 list를 출력
async function mealList(query) {
  try {
    // themealdb api에서 검색한 값을 fetch로 받아옴
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await response.json(); // 받아온 값을 json 값으로 변환
    resultsDiv.innerHTML = ""; // 이전 결과 지우기

    // 스트링 변수를 만들어줌(검색된 결과를 보여주는 html 코드를 저장)
    let mealDiv = "";
    // 검색된 음식 갯수만큼 실행해서 페이지에 뿌려줌
    data.meals.forEach((meal) => {
      mealDiv += `<div class='result-item'>
            <div class='result-img'>
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" data-id="${meal.idMeal}">
            </div>
          <label>${meal.strMeal}</label></div>`;
    });
    // mealDiv에 저장된 결과값을 results div에 넣어줘서 화면에 출력
    resultsDiv.innerHTML = mealDiv;
  } catch (error) {
    // api에서 검색한 결과가 비정상일때
    console.error("Error fetching data:", error);
    resultsDiv.innerHTML = "<p>데이터를 가져오는 중 오류가 발생했습니다.</p>";
  }
}

// 검색 버튼 눌렀을 때
searchButton.addEventListener("click", () => {
  // 검색값을 받아옴
  const query = searchInput.value;
  // 입력된 검색어가 있으면 실행
  if (query) {
    mealList(query);
  } else {
    // 검색값을 입력하지 않았을때
    resultsDiv.innerHTML = "<p>Search for meals of keywords</p>";
  }
});

// 랜덤으로 알파벳 하나 가져오기
function getRandomLetter() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const randomIndex = Math.floor(Math.random() * letters.length);
  return letters[randomIndex];
}

// 페이지가 로딩될때 랜덤으로 요리를 출력
window.onload = function () {
  mealList(getRandomLetter());
  categoryView();
};

// 요리 카테고리를 불러옴
async function categoryView() {
  // themealdb api에서 검색한 값을 fetch로 받아옴
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
  const data = await response.json(); // 받아온 값을 json 값으로 변환

  // 스트링 변수를 만들어줌(카테고리를 html 코드로 저장)
  let categoryDiv = "";
  // 카테고리 종류를 페이지에 뿌려줌
  data.categories.forEach((category) => {
    categoryDiv += `<label><a href='#'>${category.strCategory}</a></label>`;
  });
  // categoryDiv에 저장된 결과값을 category div에 넣어줘서 화면에 출력
  category.innerHTML = categoryDiv;
}

// 카테고리 클릭시
category.addEventListener("click", (c) => {
  if (c.target.tagName === "A") {
    // 이벤트가 발생한 요소의 data-id 속성을 가져와 mealId라는 변수에 저장
    const categories = c.target.innerText;
    mealList(categories);
  }
});

function showCategory() {
  category.style.display = "block"; // category 표시
}

function hideCategory() {
  category.style.display = "none"; // category 숨김
}

// 아이콘에 마우스 오버 시
categoryButton.addEventListener("mouseover", showCategory);
category.addEventListener("mouseover", showCategory);

// 아이콘에서 마우스 아웃 시
categoryButton.addEventListener("mouseout", hideCategory);
category.addEventListener("mouseout", hideCategory);

// 클릭 이벤트 핸들러
function handleClick(message) {
  alert(message); // 클릭 시 알림 창 표시
}

// 이미지 클릭 시 팝업 열기
resultsDiv.addEventListener("click", async (event) => {
  // 이벤트가 발생한 타겟 요소가 <img> 태그인지 확인하여 참이면 실행
  if (event.target.tagName === "IMG") {
    // 이벤트가 발생한 요소의 data-id 속성을 가져와 mealId라는 변수에 저장
    const mealId = event.target.dataset.id;
    // id값으로 데이터 받아옴
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    // json으로 변환하여 저장
    const data = await response.json();

    // 해당 id로 검색한 meals 값이 있다면 실행
    if (data.meals) {
      const meal = data.meals[0];
      // 음식 이름 출력
      mealTitle.innerText = meal.strMeal;
      // 음식 사진 출력
      mealImage.src = meal.strMealThumb;
      // 음식 재료에 값이 있는 만큼 재료 출력
      let ingreStr = "<b>Ingredient</b> : ";
      for (let i = 1; i < 21; i++) {
        let str = "strIngredient" + i;
        if (meal[str] !== "") {
          ingreStr += `${meal[str]}. `;
        }
      }
      mealIngredient.innerHTML = ingreStr;
      // 요리법 출력
      mealDescription.innerHTML = `<br><b>Recipe</b> : ${meal.strInstructions}`;
      popup.style.display = "block"; // 팝업 보이기
    }
  }
});

// 팝업 닫기
closeButton.addEventListener("click", () => {
  popup.style.display = "none"; // 팝업 숨기기
});

// 팝업 외부 클릭 시 닫기
popup.addEventListener("click", (event) => {
  if (event.target === popup) {
    popup.style.display = "none"; // 팝업 숨기기
  }
});

// 슬라이드
$(".slide").slick({
  infinite: true,
  slidesToShow: 2,
  autoplay: true,
  autoplaySpeed: 1000,
  arrows: false,
});

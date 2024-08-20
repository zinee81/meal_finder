const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const resultsDiv = document.getElementById("results");
const popup = document.getElementById("popup");
const mealTitle = document.getElementById("meal-title");
const mealImage = document.getElementById("meal-image");
const mealIngredient = document.getElementById("meal-ingredient");
const mealDescription = document.getElementById("meal-description");
const closeButton = document.querySelector(".close-button");

searchButton.addEventListener("click", async () => {
  // 검색값을 받아옴
  const query = searchInput.value;
  // 입력된 검색어가 있으면 실행
  if (query) {
    try {
      // themealdb api에서 검색한 값을 fetch로 받아옴
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      const data = await response.json(); // 받아온 값을 json 값으로 변환
      resultsDiv.innerHTML = ""; // 이전 결과 지우기

      // 검색된 음식이 있다면 실행
      if (data.meals) {
        /*
        data.meals.forEach((meal) => {
          const mealDiv = document.createElement("div");
          const mealImg = document.createElement("div");
          mealImg.classList.add("result-item");
          mealImg.innerHTML = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}" data-id="${meal.idMeal}" class="meal-image">`;
          mealDiv.innerHTML = `${meal.strMeal}`;
          mealDiv.appendChild(mealImg);
          resultsDiv.appendChild(mealDiv);
        });*/

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
      } else {
        // 검색된 음식이 없다면 실행
        resultsDiv.innerHTML = "<p>No Result</p>";
      }
    } catch (error) {
      // api에서 검색한 결과가 비정상일때
      console.error("Error fetching data:", error);
      resultsDiv.innerHTML = "<p>데이터를 가져오는 중 오류가 발생했습니다.</p>";
    }
  } else {
    // 검색값을 입력하지 않았을때
    resultsDiv.innerHTML = "<p>Search for meals of keywords</p>";
  }
});

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
      mealDescription.innerHTML = `<b>Recipe</b> : ${meal.strInstructions}`;
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

// 이미지 클릭 시 새 창 열기
// resultsDiv.addEventListener("click", async (event) => {
//   if (event.target.classList.contains("meal-image")) {
//     const mealId = event.target.dataset.id;
//     window.open(`https://www.themealdb.com/meal.php?c=${mealId}`, "_blank"); // 새 창에서 열기
//   }
// });

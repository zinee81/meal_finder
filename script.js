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
        // 검색된 음식 갯수만큼 실행해서 페이지에 뿌려줌
        data.meals.forEach((meal) => {
          const mealDiv = document.createElement("div");
          mealDiv.classList.add("result-item");
          mealDiv.innerHTML = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}" data-id="${meal.idMeal}" class="meal-image">`;
          resultsDiv.appendChild(mealDiv);
        });
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
  if (event.target.tagName === "IMG") {
    const mealId = event.target.dataset.id;
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await response.json();

    if (data.meals) {
      const meal = data.meals[0];
      mealTitle.innerText = meal.strMeal;
      mealImage.src = meal.strMealThumb;
      mealDescription.innerText = meal.strInstructions;
      let ingreStr = "<b>Ingredient</b> : ";
      for (let i = 1; i < 21; i++) {
        let str = "strIngredient" + i;
        if (meal[str] !== "") {
          ingreStr += `${meal[str]}. `;
        }
      }
      mealIngredient.innerHTML = ingreStr;
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

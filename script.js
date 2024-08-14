const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const resultsDiv = document.getElementById("results");
const popup = document.getElementById("popup");
const mealTitle = document.getElementById("meal-title");
const mealImage = document.getElementById("meal-image");
const mealDescription = document.getElementById("meal-description");
const closeButton = document.querySelector(".close-button");

searchButton.addEventListener("click", async () => {
  const query = searchInput.value;
  if (query) {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      const data = await response.json();
      resultsDiv.innerHTML = ""; // 이전 결과 지우기

      if (data.meals) {
        data.meals.forEach((meal) => {
          const mealDiv = document.createElement("div");
          mealDiv.classList.add("result-item");
          mealDiv.innerHTML = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}" data-id="${meal.idMeal}">`;
          resultsDiv.appendChild(mealDiv);
        });
      } else {
        resultsDiv.innerHTML = "<p>No Result</p>";
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      resultsDiv.innerHTML = "<p>데이터를 가져오는 중 오류가 발생했습니다.</p>";
    }
  } else {
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

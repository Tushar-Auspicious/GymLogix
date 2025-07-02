import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { myMealsList, MyMealsListItem } from "../../Seeds/Plans";
import { RootState } from "../store";
import { IngredientItem } from "../../Seeds/MealPlansData";

// Interface for the training plans slice state
interface MyMealsSlice {
  myMealsList: MyMealsListItem[];
}

// Define the initial state using that type
const initialState: MyMealsSlice = {
  myMealsList: myMealsList,
};

export const MyMealsSlice = createSlice({
  name: "myMeals",
  initialState,
  reducers: {
    addMeal: (state, action: PayloadAction<MyMealsListItem>) => {
      state.myMealsList.push(action.payload);
    },
    updateMeal: (state, action: PayloadAction<MyMealsListItem>) => {
      const index = state.myMealsList.findIndex(
        (meal) => meal.id === action.payload.id
      );
      if (index !== -1) {
        state.myMealsList[index] = action.payload;
      }
    },

    removeIngredientsFromMeal: (
      state,
      action: PayloadAction<{ mealId: string; ingredientId: string }>
    ) => {
      const selectedMeal = state.myMealsList.find(
        (meal) => meal.id === action.payload.mealId
      );
      if (selectedMeal) {
        selectedMeal.ingredients = selectedMeal.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload.ingredientId
        );
      }
    },
    addIngredientsToMeal: (
      state,
      action: PayloadAction<{ mealId: string; ingredients: IngredientItem[] }>
    ) => {
      const selectedMeal = state.myMealsList.find(
        (meal) => meal.id === action.payload.mealId
      );
      if (selectedMeal) {
        const existingIds = new Set(
          selectedMeal.ingredients.map((item) => item.id)
        );

        const uniqueItems = action.payload.ingredients.filter(
          (item) => !existingIds.has(item.id)
        );
        selectedMeal.ingredients.push(...uniqueItems);
      }
    },

    deleteMeal: (state, action: PayloadAction<string>) => {
      state.myMealsList = state.myMealsList.filter(
        (meal) => meal.id !== action.payload
      );
    },
  },
});

// Export actions
export const {
  addMeal,
  updateMeal,
  removeIngredientsFromMeal,
  deleteMeal,
  addIngredientsToMeal,
} = MyMealsSlice.actions;

export const selectMealById = (
  state: RootState,
  id: string
): MyMealsListItem | undefined => {
  return state.myMeals.myMealsList.find((meal) => meal.id === id);
};

// Export reducer
export default MyMealsSlice.reducer;

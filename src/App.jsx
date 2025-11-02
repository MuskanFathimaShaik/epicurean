import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import Header from "./components/Header";
import { useState } from "react";
// import CategoryListPage from "./pages/RecipesListPage";
import RecipesListPage from "./pages/RecipesListPage";
import RecipeDetailsPage from "./pages/RecipeDetailsPage";
import AllRecipesPage from "./pages/AllRecipesPage";
import LikedRecipesPage from "./pages/LikedRecipesPage";
import SavedRecipesPage from "./pages/SavedRecipesPage";
import ScrollToTop from "./components/ScrollToTop";
// import "./App.css";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="h-full">
      <Header setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route exact path="/categories" element={<CategoriesPage />} />
        <Route path="/all-recipes" element={<AllRecipesPage />} />
        <Route path="/liked-recipes" element={<LikedRecipesPage />} />
        <Route path="/saved-recipes" element={<SavedRecipesPage />} />
        <Route path="/category/:id" element={<RecipesListPage />} />
        <Route path="/recipe/:recipeName" element={<RecipeDetailsPage />} />
      </Routes>
    </div>
  );
}

// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './features/toothbrush/pages/RegisterPage';
import ListPage from './features/toothbrush/pages/ListPage';
import DetailPage from './features/toothbrush/pages/DetailPage';
import PokemonIngredientPage from './features/pokemon/pages/PokemonPage';
import RecipeListPage from './features/pokemon/pages/RecipeListPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen w-screen bg-gray-100 flex flex-col overflow-x-hidden">
        <nav className="w-full bg-white shadow-lg">
          <div className="w-full px-6">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link to="/" className="flex items-center px-4 py-2 text-black hover:text-gray-900 text-lg">
                  목록
                </Link>
                <Link to="/register" className="flex items-center px-4 py-2 text-black hover:text-gray-900 text-lg">
                  등록
                </Link>
                <Link to="/pokemon" className="flex items-center px-4 py-2 text-black hover:text-gray-900 text-lg">
                  포켓몬 보기
                </Link>
                <Link to="/recipeList" className="flex items-center px-4 py-2 text-black hover:text-gray-900 text-lg">
                  레시피 목록
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 w-full px-6 py-6">
          <div className="w-full h-full">
            <Routes>
              <Route path="/" element={<ListPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/detail/:id" element={<DetailPage />} />
              <Route path="/pokemon" element={<PokemonIngredientPage />} />
              <Route path="/recipeList" element={<RecipeListPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
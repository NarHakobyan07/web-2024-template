import { useState, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";
import styled from "styled-components";
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Slider,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { orange, purple } from "@mui/material/colors";

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface Recipe {
  id: number;
  name: string;
  ingredients: Ingredient[];
  instructions: string;
  portions: number;
  originalPortions: number;
}

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, ${purple[100]}, ${orange[100]});
  min-height: 100vh;
`;

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const StyledCard = styled(Card)`
  && {
    transition: transform 0.2s;
    background: linear-gradient(45deg, ${purple[50]}, ${orange[50]});
    &:hover {
      transform: translateY(-5px);
    }
  }
`;

const RecipeTitle = styled(Typography)`
  && {
    color: ${purple[900]};
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

const RecipeApp = () => {
  const [recipes, setRecipes] = useLocalStorageState<Recipe[]>("recipes", {
    defaultValue: [],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [newRecipe, setNewRecipe] = useState<Recipe>({
    id: 0,
    name: "",
    ingredients: [],
    instructions: "",
    portions: 4,
    originalPortions: 4,
  });

  useEffect(() => {
    if (recipes.length === 0) {
      const boilerplateRecipes: Recipe[] = [
        {
          id: 1,
          name: "Classic Margherita Pizza",
          ingredients: [
            { name: "Pizza Dough", amount: 250, unit: "g" },
            { name: "Tomato Sauce", amount: 100, unit: "ml" },
            { name: "Mozzarella", amount: 200, unit: "g" },
            { name: "Fresh Basil", amount: 10, unit: "leaves" },
          ],
          instructions: "1. Roll out dough\n2. Add sauce\n3. Add cheese\n4. Bake at 220°C for 12-15 minutes\n5. Add fresh basil",
          portions: 2,
          originalPortions: 2,
        },
        {
          id: 2,
          name: "Chocolate Chip Cookies",
          ingredients: [
            { name: "Flour", amount: 250, unit: "g" },
            { name: "Butter", amount: 170, unit: "g" },
            { name: "Brown Sugar", amount: 200, unit: "g" },
            { name: "Chocolate Chips", amount: 200, unit: "g" },
          ],
          instructions: "1. Cream butter and sugar\n2. Add dry ingredients\n3. Form cookies\n4. Bake at 180°C for 10-12 minutes",
          portions: 24,
          originalPortions: 24,
        },
        {
          id: 3,
          name: "Spaghetti Carbonara",
          ingredients: [
            { name: "Spaghetti", amount: 400, unit: "g" },
            { name: "Eggs", amount: 4, unit: "pcs" },
            { name: "Pecorino", amount: 100, unit: "g" },
            { name: "Guanciale", amount: 150, unit: "g" },
          ],
          instructions: "1. Cook pasta\n2. Fry guanciale\n3. Mix eggs and cheese\n4. Combine all ingredients",
          portions: 4,
          originalPortions: 4,
        },
        {
          id: 4,
          name: "Green Smoothie",
          ingredients: [
            { name: "Spinach", amount: 100, unit: "g" },
            { name: "Banana", amount: 1, unit: "pc" },
            { name: "Apple", amount: 1, unit: "pc" },
            { name: "Almond Milk", amount: 250, unit: "ml" },
          ],
          instructions: "1. Add all ingredients to blender\n2. Blend until smooth\n3. Serve immediately",
          portions: 2,
          originalPortions: 2,
        },
        {
          id: 5,
          name: "Guacamole",
          ingredients: [
            { name: "Avocados", amount: 3, unit: "pcs" },
            { name: "Lime", amount: 1, unit: "pc" },
            { name: "Tomato", amount: 1, unit: "pc" },
            { name: "Onion", amount: 0.5, unit: "pc" },
          ],
          instructions: "1. Mash avocados\n2. Dice tomato and onion\n3. Mix ingredients\n4. Season to taste",
          portions: 4,
          originalPortions: 4,
        },
      ];
      setRecipes(boilerplateRecipes);
    }
  }, [recipes.length, setRecipes]);

  const handlePortionChange = (recipe: Recipe, newPortions: number) => {
    const updatedRecipes = recipes.map((r) => {
      if (r.id === recipe.id) {
        const scaleFactor = newPortions / r.originalPortions;
        const updatedIngredients = r.ingredients.map((ing) => {
          const originalIngredient = recipe.ingredients.find(
            (origIng) => origIng.name === ing.name
          );
          const originalAmount = (originalIngredient?.amount || ing.amount) / 
            (recipe.portions / recipe.originalPortions);
          
          return {
            ...ing,
            amount: Number((originalAmount * scaleFactor).toFixed(2)),
          };
        });
        return { ...r, portions: newPortions, ingredients: updatedIngredients };
      }
      return r;
    });
    setRecipes(updatedRecipes);
  };

  const handleDeleteRecipe = (id: number) => {
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setNewRecipe(recipe);
    setIsDialogOpen(true);
  };

  const handleSaveRecipe = () => {
    if (editingRecipe) {
      setRecipes(recipes.map((r) => (r.id === editingRecipe.id ? newRecipe : r)));
    } else {
      setRecipes([...recipes, { ...newRecipe, id: Date.now() }]);
    }
    setIsDialogOpen(false);
    setEditingRecipe(null);
    setNewRecipe({
      id: 0,
      name: "",
      ingredients: [],
      instructions: "",
      portions: 4,
      originalPortions: 4,
    });
  };

  return (
    <AppContainer>
      <RecipeTitle variant="h3" gutterBottom>
        Funky Recipe Book 🍳
      </RecipeTitle>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<RestaurantIcon />}
        onClick={() => setIsDialogOpen(true)}
      >
        Add New Recipe
      </Button>

      <RecipeGrid>
        {recipes.map((recipe) => (
          <StyledCard key={recipe.id}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {recipe.name}
              </Typography>
              
              <Stack spacing={2} direction="row" alignItems="center" sx={{ mb: 2 }}>
                <Typography>Portions:</Typography>
                <Slider
                  value={recipe.portions}
                  min={1}
                  max={20}
                  onChange={(_, value) => handlePortionChange(recipe, value as number)}
                  valueLabelDisplay="auto"
                  sx={{ color: purple[400] }}
                />
              </Stack>

              <Typography variant="h6">Ingredients:</Typography>
              {recipe.ingredients.map((ing, index) => (
                <Typography key={index}>
                  • {ing.amount} {ing.unit} {ing.name}
                </Typography>
              ))}

              <Typography variant="h6" sx={{ mt: 2 }}>
                Instructions:
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                {recipe.instructions}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton onClick={() => handleEditRecipe(recipe)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteRecipe(recipe.id)}>
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </StyledCard>
        ))}
      </RecipeGrid>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingRecipe ? "Edit Recipe" : "Add New Recipe"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Recipe Name"
              value={newRecipe.name}
              onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Instructions"
              value={newRecipe.instructions}
              onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
              multiline
              rows={4}
              fullWidth
            />
            {/* Add more fields for ingredients */}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveRecipe} variant="contained" color="primary">
            Save Recipe
          </Button>
        </DialogActions>
      </Dialog>
    </AppContainer>
  );
};

export default RecipeApp;

import React, { useState, useRef } from "react";
import {
  Box,
  InputBase,
  Select,
  MenuItem,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import { selectCategories } from "../../store/slice/categories";

const SearchBar = () => {
  const categories = useSelector(selectCategories);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState(
    categories[0]?.id || ""
  );

  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Searching:", { query, categoryId });
    // TODO: replace console.log with dispatch or navigation
  };

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
  };

  const containerSx = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? 1 : 0,
    maxWidth: "680px",
    width: "100%",
    border: "1px solid white",
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
    "&:focus-within": {
      boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.3)",
    },
  };

  const inputSx = {
    flex: 1,
    px: 2,
    py: 1.5,
    color: "white",
    "& input": {
      color: "white",
      "&::placeholder": {
        color: "rgba(255, 255, 255, 0.7)",
        opacity: 1,
      },
    },
    "& .MuiInputBase-input": {
      fontSize: "16px",
    },
  };

  const selectSx = {
    minWidth: isMobile ? "100%" : 160,
    color: "white",
    borderLeft: isMobile ? "none" : "1px solid rgba(255, 255, 255, 0.3)",
    "& .MuiSelect-select": {
      px: 2,
      py: 1.5,
      color: "white",
      fontSize: "16px",
    },
    "& .MuiSelect-icon": {
      color: "white",
    },
    "& fieldset": {
      border: "none",
    },
  };

  const buttonSx = {
    width: 48,
    height: 48,
    borderRadius: isMobile ? 1 : 0,
    borderLeft: isMobile ? "none" : "1px solid rgba(255, 255, 255, 0.3)",
    color: "white",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={containerSx}
      role="search"
      aria-label="Search form"
    >
      <InputBase
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search…"
        sx={inputSx}
        inputProps={{
          "aria-label": "Search query",
        }}
      />

      <Select
        value={categoryId}
        onChange={handleCategoryChange}
        variant="outlined"
        sx={selectSx}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              "& .MuiMenuItem-root": {
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
                "&.Mui-selected": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              },
            },
          },
        }}
        inputProps={{
          "aria-label": "Search category",
        }}
      >
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.label}
          </MenuItem>
        ))}
      </Select>

      <IconButton type="submit" sx={buttonSx} aria-label="Search">
        <SearchIcon sx={{ color: "white" }} />
      </IconButton>
    </Box>
  );
};

export default SearchBar;

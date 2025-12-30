import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Skeleton,
  InputBase,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import { selectCategories } from "../../store/slice/categories";
import { selectUser } from "../../store/slice/user";
import { IMAGES } from "../../theme";
import { getAllCategories } from "../../services/data/categories";

import { CustomCard } from "../../components";
import { getCountryCategoryEvents } from "../../services/data/events";
import { Style } from "./style";

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { language, countryId } = useSelector(selectUser);
  const isArabic = language === "ar";

  // Controlled inputs
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Event data
  const [allEvents, setAllEvents] = useState([]);
  const [searchedEvents, setSearchedEvents] = useState([]);
  const [loader, setLoader] = useState(false);
  const skeletonArray = new Array(4);
  const [categories, setCategories] = useState([]);

  const placeholderText = "Start typing to search";
  const noResultsText = "No results found";
  const otherEventsText = "Other Events";
  useEffect(() => {
  const fetchCategories = async () => {
    const cats = await getAllCategories({ page: 1, number: 10 });
    setCategories(cats?.data?.data?.data || []);
  };

  fetchCategories();
}, []);

  // Filter events locally from allEvents
  const filterEvents = (events, qValue, categoryValue) => {
    let filtered = [...events];
    console.log("filtered are ", filtered, categoryValue)

    if (categoryValue) {
      filtered = filtered.filter((e) => String(e.category?.id) === String(categoryValue));

    }
console.log("filtered after category mapping ", filtered)
    if (qValue) {
      const query = qValue.toLowerCase();
      filtered = filtered.filter((e) => {
        const t = e.translation || {};
        const ar = t.ar || {};
        const en = t.en || {};
        return (
          (ar.name?.toLowerCase().includes(query)) ||
          (en.name?.toLowerCase().includes(query)) ||
          (ar.content?.toLowerCase().includes(query)) ||
          (en.content?.toLowerCase().includes(query)) ||
          (ar.address?.toLowerCase().includes(query)) ||
          (en.address?.toLowerCase().includes(query)) ||
          (ar.terms?.toLowerCase().includes(query)) ||
          (en.terms?.toLowerCase().includes(query))
        );
      });
    }

    return filtered;
  };

  // Fetch all events once
  const fetchAllEvents = async () => {
    setLoader(true);
    try {
      const events = await getCountryCategoryEvents({
        page: 1,
        number: 100, // fetch enough events
        country: countryId || "all",
        category: "",
        searchKey: "",
      });
      const fetched = events?.data?.data?.data || [];
      setAllEvents(fetched);
    } catch (err) {
      console.error(err);
      setAllEvents([]);
    } finally {
      setLoader(false);
    }
  };

  // Initialize inputs from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlQ = params.get("q") || "";
    const urlCategory = params.get("category") || "";
    setQ(urlQ);
    setCategoryId(urlCategory);
  }, [location.search]);

  // Fetch all events once on page load
  useEffect(() => {
    fetchAllEvents();
  }, []);

  // Watch for input changes and filter locally from allEvents
  useEffect(() => {
    if (!q && !categoryId) {
      setSearchedEvents([]);
      return;
    }
    const filtered = filterEvents(allEvents, q, categoryId);
    console.log("filtered events are ", filtered)
    setSearchedEvents(filtered);
  }, [q, categoryId, allEvents]);

  const handleSearchSubmit = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categoryId) params.set("category", categoryId);
    navigate(`/search?${params.toString()}`);
  };

  return (
  <Box sx={{padding:'20px 10px 100px 10px',  minHeight: '100vh', background: 'var(--app-background)' }}>
  

<Box sx={{ 
  mb: 2,
  overflow: 'hidden'
}}>
   <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
    <IconButton 
      onClick={() => navigate("/")} 
      sx={{ color: "#FFBA83", p: 0 }}
    >
      <ArrowBackIcon fontSize="medium" />
    </IconButton>
  </Box>
 <Box
  sx={{
    display: "flex",
    alignItems: "center",
    borderRadius: "12px",
    marginTop:"10px",
    overflow: "hidden",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255, 186, 131, 0.3)",
  }}
>
  {/* Search Input */}
  <InputBase
    placeholder="Search events..."
    value={q}
    onChange={(e) => setQ(e.target.value)}
    sx={{
      flex: 1,
      px: 1.2, // reduced padding
      py: 0.8, // reduced vertical padding
      color: "white !important",
      fontSize: "0.85rem", // smaller font
      minHeight: "36px", // ensures compact height
      "& input::placeholder": {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: "0.8rem",
        opacity: 1,
      },
    }}
  />

  {/* Divider */}
  <Box
    sx={{
      width: "1px",
      background: "rgba(255, 186, 131, 0.3)",
      alignSelf: "stretch",
    }}
  />

  {/* Category Selector */}
  <Select
    value={categoryId}
    onChange={(e) => setCategoryId(e.target.value)}
    displayEmpty
    sx={{
      minWidth: 80, // reduced width
      color: "white !important",
      "& .MuiSelect-select": {
        py: 0.6, // reduced vertical padding
        px: 1,
        fontSize: "0.8rem", // smaller font
        lineHeight:"36px",
        minHeight: "36px", // match search input height
      },
      "& .MuiSelect-icon": {
        color: "#FFBA83",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
    }}
    MenuProps={{
      PaperProps: {
        sx: {
          background: "rgba(30, 41, 59, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 186, 131, 0.2)",
          "& .MuiMenuItem-root": {
            color: "white !important",
            fontSize: "0.85rem",
            lineHeight:"36px",
            "&:hover": {
              background: "rgba(255, 186, 131, 0.1)",
            },
            "&.Mui-selected": {
              background: "rgba(255, 186, 131, 0.2)",
            },
          },
        },
      },
    }}
  >
    <MenuItem value="">All</MenuItem>
    {categories.map((cat) => (
      <MenuItem key={cat.id} value={cat.id}>
        {cat.translation[language]?.name}
      </MenuItem>
    ))}
  </Select>
</Box>

</Box>
  {/* Center message */}
  {!loader && searchedEvents.length === 0 && !q && !categoryId && (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
        textAlign: 'center',
        px: 2
      }}
    >
      
          <Box 
            sx={{
              width: { xs: "35vw", sm: "35vw" },
              maxWidth: "120px",
              mb:3,
              ml: { xs: 1, sm: 2 }
            }} 
            component={"img"} 
            src={IMAGES.FavIcon} 
            width={"100%"}
          />

      <Typography 
        variant="h5" 
        sx={{ 
          color: "#FFBA83 !important", 
          mb: 1,
          fontWeight: 600
        }}
      >
        Discover Events
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          color: "rgba(255, 255, 255, 0.7)",
          maxWidth: 280
        }}
      >
        {placeholderText}
      </Typography>
    </Box>
  )}

  {/* No results */}
  {!loader && searchedEvents.length === 0 && (q || categoryId) && (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ 
        textAlign: 'center', 
        mb: 4,
        px: 2
      }}>
        <Box sx={{ 
          fontSize: '3rem', 
          mb: 2,
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
        }}>
          🔍
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 1, 
            color:"#FFBA83", 
            fontWeight: 700,
            fontSize: '1.2rem'
          }}
        >
          {noResultsText}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3, 
            color:"rgba(255, 186, 131, 0.8)",
            fontSize: '0.95rem'
          }}
        >
          {otherEventsText}
        </Typography>
      </Box>
      
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 2,
          px: 1
        }}
      >
        {allEvents.map((item, index) => (
          <Box 
            key={index} 
            sx={{ 
              borderRadius: 4, 
              overflow: "hidden",
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                borderColor: 'rgba(255, 186, 131, 0.3)'
              }
            }}
          >
            <CustomCard length={allEvents.length} data={item} />
          </Box>
        ))}
      </Box>
    </Box>
  )}

  {/* Searched results */}
  {searchedEvents.length > 0 && (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 2,
        mt: 2,
        px: 1
      }}
    >
      {loader
        ? skeletonArray.map((_, idx) => (
            <Skeleton
              key={idx}
              variant="rectangular"
              sx={{ 
                height: 180, 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.1)',
                '&::after': {
                  background: 'linear-gradient(90deg, transparent, rgba(255, 186, 131, 0.2), transparent)'
                }
              }}
            />
          ))
        : searchedEvents.map((item, index) => (
            <Box
                                key={index}
                                sx={{
                                  flex: "0 0 auto",
                                  borderRadius: 3,
                                  overflow: "hidden",
                                }}
                              >
              <CustomCard length={searchedEvents.length} data={item} />
            </Box>
          ))}
    </Box>
  )}
</Box>
  );
};

export default SearchPage;
